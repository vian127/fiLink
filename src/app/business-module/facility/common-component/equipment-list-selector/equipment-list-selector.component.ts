import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityUtilService} from '../..';
import {EquipmentApiService} from '../../share/service/equipment/equipment-api.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {FilterCondition, QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {ResultModel} from '../../../../core-module/model/result.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment-list.model';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';

/**
 * 设施选择
 * created by PoHe
 */
@Component({
  selector: 'equipment-list-selector-component',
  templateUrl: './equipment-list-selector.component.html',
  styleUrls: ['./equipment-list-selector.component.scss']
})
export class EquipmentListSelectorComponent implements OnInit, OnDestroy {
  // 弹框显示状态
  @Input()
  set equipmentVisible(params) {
    this._equipmentVisible = params;
    this.equipmentVisibleChange.emit(this._equipmentVisible);
  }

  // 是否请求针对网关配置已有设备的列表信息
  @Input() public isGatewayConfig: boolean = false;

  // 设备过滤条件
  @Input()
  public filterConditions: FilterCondition[];
  // 设备id
  @Input()
  public selectEquipmentId: string = '';
  // 显示隐藏变化
  @Output() public equipmentVisibleChange = new EventEmitter<any>();
  // 选中的值变化
  @Output() public selectDataChange = new EventEmitter<any>();
  // 设备类型
  @ViewChild('_equipmentTypeTemp') private _equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  设备状态模版
  @ViewChild('_equipmentStatusTemp') private _equipmentStatusTemp: TemplateRef<HTMLDocument>;
  // 表格实例
  @ViewChild('tableComponent') private _tableComponent: TableComponent;
  // 单选按钮
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // 显示隐藏
  public _equipmentVisible = false;

  // 获取modal框显示状态
  get equipmentVisible() {
    return this._equipmentVisible;
  }

  // 设备列表结果集
  public _dataSet = [];
  // 分页参数
  public _pageBean: PageBean = new PageBean();
  // 表格配置
  public _tableConfig: TableConfig = new TableConfig();
  // 列表查询条件
  public _queryCondition: QueryCondition = new QueryCondition();
  // 设施国际化
  public _language: FacilityLanguageInterface;
  // 公共国际化
  public _commonLanguage: CommonLanguageInterface;
  // 已选数据
  public _selectedData = [];

  /**
   * 构造器
   */
  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $facilityUtilService: FacilityUtilService,
              private $equipmentAipService: EquipmentApiService) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this._language = this.$nzI18n.getLocaleData('facility');
    this._commonLanguage = this.$nzI18n.getLocaleData('common');
    // 初始化表格
    this.initTableConfig();
    // 刷新列表数据
    this.isGatewayConfigList();
  }

  /**
   *  是否请求可做网关配置已有设备列表
   */
  public isGatewayConfigList(): void {
    if (this.isGatewayConfig) {
      this.queryConfigEquipmentInfo();
    } else {
      // 刷新列表数据
      this.refreshData();
    }
  }

  /**
   * 销毁组件
   */
  public ngOnDestroy(): void {
    this._equipmentTypeTemp = null;
    this._equipmentStatusTemp = null;
    this._tableComponent = null;
  }

  /**
   * 单选设备
   */
  public onEquipmentChange(event, data): void {
    this.selectEquipmentId = event;
    this._selectedData = data;
  }

  /**
   * 切换分页触发事件
   */
  public pageChange(event: PageBean): void {
    this._queryCondition.pageCondition.pageNum = event.pageIndex;
    this._queryCondition.pageCondition.pageSize = event.pageSize;
    this.isGatewayConfigList();
  }

  /**
   * 确定选择设备
   */
  public handleOk(): void {
    if (this._selectedData) {
      this.selectDataChange.emit(this._selectedData);
      this.equipmentVisible = false;
    }
  }

  /**
   *  初始化表格
   */
  private initTableConfig(): void {
    this._tableConfig = {
      primaryKey: '03-1',
      isDraggable: false,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: false,
      notShowPrint: true,
      scroll: {x: '600px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        {
          title: this._language.select,
          type: 'render',
          renderTemplate: this.radioTemp,
          fixedStyle: {
            fixedLeft: true,
            style: {left: '0px'}
          },
          width: 62
        },
        {
          type: 'serial-number',
          width: 62,
          title: this._language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 名称
          title: this._language.name,
          key: 'equipmentName',
          width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 类型
          title: this._language.type,
          key: 'equipmentType',
          isShowSort: true,
          type: 'render',
          width: 200,
          searchable: true,
          renderTemplate: this._equipmentTypeTemp,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.$facilityUtilService.getEquipmentType(this.$nzI18n),
            label: 'label',
            value: 'code'
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
          title: this._language.status,
          key: 'equipmentStatus',
          width: 200,
          type: 'render',
          renderTemplate: this._equipmentStatusTemp,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.$facilityUtilService.getEquipmentStatus(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        {
          title: this._commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      // 排序
      sort: (event: SortCondition) => {
        this._queryCondition.sortCondition.sortField = event.sortField;
        this._queryCondition.sortCondition.sortRule = event.sortRule;
        this.isGatewayConfigList();
      },
      // 过滤查询
      handleSearch: (event: FilterCondition[]) => {
        this._queryCondition.pageCondition.pageNum = 1;
        this._queryCondition.filterConditions = event;
        this.isGatewayConfigList();
      }
    };
  }

  /**
   * 查询列表
   */
  private refreshData(): void {
    this._queryCondition.filterConditions = this._queryCondition.filterConditions.concat(this.filterConditions);
    this._tableConfig.isLoading = true;
    this.$equipmentAipService.equipmentListByPage(this._queryCondition).subscribe(
      (result: ResultModel<EquipmentListModel[]>) => {
        this._tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this._pageBean.Total = result.totalCount;
          this._pageBean.pageIndex = result.pageNum;
          this._pageBean.pageSize = result.size;
          this._dataSet = result.data;
          // 处理各种状态的显示情况
          this._dataSet.forEach(row => {
            // 设备类型国际化转换
            row.equipmentTypeName = this.$facilityUtilService.getEquipmentType(this.$nzI18n, row.equipmentType);
            // 设备状态国际化转换
            row.equipmentStatusName = row.equipmentStatus === null ? ''
              : this.$facilityUtilService.getEquipmentStatus(this.$nzI18n, row.equipmentStatus);
            row.deviceName = row.deviceInfo ? row.deviceInfo.deviceName : '';
            row.address = row.deviceInfo ? row.deviceInfo.address : '';
            // 设置设备的状态和图标
            const iconStyle = FacilityUtilService.getFacilityDeviceStatusClassName(row.equipmentStatus);
            row.statusIconClass = iconStyle.iconClass;
            row.statusColorClass = iconStyle.colorClass;
            // 设置设备类型的图标
            row.iconClass = CommonUtil.getEquipmentIconClassName(row.equipmentType);
          });
        } else {
          this._tableConfig.isLoading = false;
          this.$message.error(result.msg);
        }
      }, () => {
        this._tableConfig.isLoading = false;
      });
  }

  /**
   * 网关配置已有设备列表接口请求
   */
  private queryConfigEquipmentInfo(): void {
    this._tableConfig.isLoading = true;
    this.$equipmentAipService.queryConfigEquipmentInfo(this._queryCondition).subscribe(
      (result: ResultModel<EquipmentListModel[]>) => {
        this._tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this._pageBean.Total = result.totalCount;
          this._pageBean.pageIndex = result.pageNum;
          this._pageBean.pageSize = result.size;
          this._dataSet = result.data;
          // 处理各种状态的显示情况
          this._dataSet.forEach(row => {
            // 设备类型国际化转换
            row.equipmentTypeName = this.$facilityUtilService.getEquipmentType(this.$nzI18n, row.equipmentType);
            // 设备状态国际化转换
            row.equipmentStatusName = row.equipmentStatus === null ? ''
              : this.$facilityUtilService.getEquipmentStatus(this.$nzI18n, row.equipmentStatus);
            row.deviceName = row.deviceInfo ? row.deviceInfo.deviceName : '';
            row.address = row.deviceInfo ? row.deviceInfo.address : '';
            // 设置设备的状态和图标
            const iconStyle = FacilityUtilService.getFacilityDeviceStatusClassName(row.equipmentStatus);
            row.statusIconClass = iconStyle.iconClass;
            row.statusColorClass = iconStyle.colorClass;
            // 设置设备类型的图标
            row.iconClass = CommonUtil.getEquipmentIconClassName(row.equipmentType);
          });
        } else {
          this._tableConfig.isLoading = false;
          this.$message.error(result.msg);
        }

      }, () => {
        this._tableConfig.isLoading = false;
      });
  }

}
