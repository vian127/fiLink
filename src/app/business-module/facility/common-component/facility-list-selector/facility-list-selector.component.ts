import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityService} from '../../../../core-module/api-service/facility/facility-manage';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityUtilService} from '../..';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FilterCondition, QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {getDeviceStatus, getDeviceType} from '../../share/const/facility.config';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {ResultModel} from '../../../../core-module/model/result.model';
import {FacilityListModel} from '../../share/model/facility-list.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {FilterSelectEnum} from '../../share/enum/equipment.enum';

/**
 * 设施列表选择器组件
 * created by PoHe
 */
@Component({
  selector: 'facility-list-selector-component',
  templateUrl: './facility-list-selector.component.html',
  styleUrls: ['./facility-list-selector.component.scss',
    '../../facility-common.scss']
})
export class FacilityListSelectorComponent implements OnInit, OnDestroy {
  @Input()
  set facilityVisible(params) {
    this._facilityVisible = params;
    this.facilityVisibleChange.emit(this._facilityVisible);
  }

  // 获取modal框显示状态
  get facilityVisible() {
    return this._facilityVisible;
  }

  // 弹框title
  @Input() title: string;
  // 设施过滤条件
  @Input() filterConditions: FilterCondition[] = [];
  // 是否多选
  @Input()
  public multiple: boolean = false;
  // 显示隐藏变化
  @Output() facilityVisibleChange = new EventEmitter<any>();
  // 选中的值变化
  @Output() selectDataChange = new EventEmitter<any>();
  // 设施状态
  @ViewChild('deviceStatusTemp') private _deviceStatusTemp: TemplateRef<HTMLDocument>;
  // 设施类型模板
  @ViewChild('deviceTypeTemp') private _deviceTypeTemp: TemplateRef<HTMLDocument>;
  // 表格实例
  @ViewChild('tableComponent') private _tableComponent: TableComponent;
  // 列表单选
  @ViewChild('radioTemp') private _radioTemp: TableComponent;
  // 设备数量
  @ViewChild('equipmentNumTemp') _equipmentNumTemp: TemplateRef<HTMLDocument>;
  // 是否显示
  private _facilityVisible: boolean = false;
  // 列表数据
  public _dataSet = [];
  // 分页参数
  public _pageBean: PageBean = new PageBean();
  // 表格配置
  public _tableConfig: TableConfig = new TableConfig();
  // 列表查询条件
  public _queryCondition: QueryCondition = new QueryCondition();
  // 设施国际化
  public _language: FacilityLanguageInterface;
  //  过滤下拉选-- label
  public _filterSelectEnum = FilterSelectEnum;
  // 过滤操作类型--value
  public _filterOperateEnum = OperatorEnum;
  // 公共国际化
  public _commonLanguage: CommonLanguageInterface;
  // 已选设施的id
  public _selectFacilityId: string = null;
  //  已选设施数据集
  public _selectedFacilityData: FacilityListModel[] = [];
  // 设备数量过滤值
  public _equipmentNumSelectValue: string = OperatorEnum.eq;


  /**
   * 构造器
   */
  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $facilityService: FacilityService) {
  }

  /**
   * 初始化钩子
   */
  public ngOnInit(): void {
    this._language = this.$nzI18n.getLocaleData('facility');
    this._commonLanguage = this.$nzI18n.getLocaleData('common');
    // 初始化表格
    this.initTableConfig();
    //  查询列表数据
    this.refreshData();
  }

  /**
   * 销毁钩子 将模型设置成空
   */
  public ngOnDestroy(): void {
    this._deviceStatusTemp = null;
    this._deviceTypeTemp = null;
    this._tableComponent = null;
    this._radioTemp = null;
    this._equipmentNumTemp = null;
  }

  /**
   * 切换分页事件
   */
  public pageChange(event: PageBean): void {
    this._queryCondition.pageCondition.pageNum = event.pageIndex;
    this._queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 单选设施
   */
  public onFacilityChange(event: string, data: FacilityListModel): void {
    this._selectFacilityId = event || null;
    this._selectedFacilityData = [data] || [];
  }

  /**
   * 确定
   */
  public handleOk(): void {
    const data = this.multiple ? this._tableComponent.getDataChecked()
      : this._selectedFacilityData;
    this.selectDataChange.emit(data);
    this.facilityVisible = false;
  }


  /**
   *  初始化表格参数
   */
  private initTableConfig(): void {
    this._tableConfig = {
      primaryKey: '03-1',
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: false,
      notShowPrint: true,
      scroll: {x: '600px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        {
          type: this.multiple ? 'select' : 'render',
          renderTemplate: this.multiple ? null : this._radioTemp,
          fixedStyle: {
            fixedLeft: true,
            style: {left: '0px'}
          },
          width: 62
        },
        { // 资产编号
          title: this._language.deviceCode, key: 'deviceCode', width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 名称
          title: this._language.deviceName,
          key: 'deviceName',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        { // 类型
          title: this._language.deviceType,
          key: 'deviceType',
          width: 150,
          configurable: false,
          type: 'render',
          renderTemplate: this._deviceTypeTemp,
          minWidth: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: getDeviceType(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        { // 设备数量
          title: this._language.equipmentQuantity,
          key: 'equipmentQuantity',
          width: 120,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this._equipmentNumTemp,
          }
        },
        {  // 详细地址
          title: this._language.address,
          key: 'address',
          width: 150,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 状态
          title: this._language.deviceStatus,
          key: 'deviceStatus',
          width: 120,
          type: 'render',
          renderTemplate: this._deviceStatusTemp,
          configurable: false,
          isShowSort: true,
          searchable: true,
          minWidth: 90,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: getDeviceStatus(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        { // 操作
          title: this._commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '',
          width: 150,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      sort: (event: SortCondition) => {
        this._queryCondition.sortCondition.sortField = event.sortField;
        this._queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        const index = event.findIndex(item => item.filterField === 'equipmentQuantity');
        if (index >= 0) {
          event[index].operator = this._equipmentNumSelectValue;
        }
        this._queryCondition.pageCondition.pageNum = 1;
        this._queryCondition.filterConditions = event;
        this.refreshData();
      },
    };
  }

  /**
   * 查询数据
   */
  private refreshData(): void {
    this._queryCondition.filterConditions = this._queryCondition.filterConditions.concat(this.filterConditions);
    this._tableConfig.isLoading = true;
    this.$facilityService.deviceListByPage(this._queryCondition).subscribe((result: ResultModel<FacilityListModel[]>) => {
      this._tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this._pageBean.Total = result.totalCount;
        this._pageBean.pageIndex = result.pageNum;
        this._pageBean.pageSize = result.size;
        this._dataSet = result.data || [];
        this._dataSet.forEach(_row => {
          _row['_deviceType'] = _row.deviceType;
          _row.areaName = _row.areaInfo ? _row.areaInfo.areaName : '';
          _row.deviceType = getDeviceType(this.$nzI18n, _row.deviceType);
          _row['_deviceStatus'] = _row.deviceStatus;
          _row.deviceStatus = getDeviceStatus(this.$nzI18n, _row.deviceStatus);
          _row['iconClass'] = CommonUtil.getFacilityIconClassName(_row._deviceType);
          _row['deviceStatusIconClass'] = FacilityUtilService.getFacilityDeviceStatusClassName(_row._deviceStatus).iconClass;
          _row['deviceStatusColorClass'] = FacilityUtilService.getFacilityDeviceStatusClassName(_row._deviceStatus).colorClass;
        });
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this._tableConfig.isLoading = false;
    });
  }
}
