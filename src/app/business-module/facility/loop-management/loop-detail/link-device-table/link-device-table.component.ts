import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {TableComponent} from '../../../../../shared-module/component/table/table.component';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {NzI18nService} from 'ng-zorro-antd';
import {getDeviceStatus, getDeviceType} from '../../../share/const/facility.config';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {FacilityUtilService} from '../../..';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityService} from '../../../../../core-module/api-service/facility/facility-manage';
import {Result} from '../../../../../shared-module/entity/result';

@Component({
  selector: 'app-link-device-table',
  templateUrl: './link-device-table.component.html',
  styleUrls: ['./link-device-table.component.scss']
})
export class LinkDeviceTableComponent implements OnInit, OnDestroy {
  // 弹框是否开启设置
  @Input()
  set xcVisible(params) {
    this.isXcVisible = params;
    this.xcVisibleChange.emit(this.isXcVisible);
  }

  // 选择列表数据
  @Output() selectListDataChange = new EventEmitter<Array<any>>();
  // 弹框开启关闭触发事件
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 列表实例
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // 设施状态
  @ViewChild('deviceStatusTemp') private deviceStatusTemp: TemplateRef<any>;
  // 设施类型模板
  @ViewChild('deviceTypeTemp') private deviceTypeTemp: TemplateRef<any>;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 列表数据
  public dataSet = [];
  // 列表分页实体
  public pageBean: PageBean = new PageBean(10, 1, 1);
  // 列表配置
  public tableConfig: TableConfig;
  // 列表查询条件
  public queryCondition: QueryCondition = new QueryCondition();
  // 弹框是否开启
  public isXcVisible: boolean = false;
  // 选中数据
  public selectListData: Array<any>;

  // 弹框是否开启
  get xcVisible() {
    return this.isXcVisible;
  }

  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $facilityService: FacilityService,
  ) {
  }

  ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData('facility');
    // 表格初始化
    this.initTableConfig();
    // 刷新列表
    this.refreshData();
  }

  /**
   * 表格分页
   */
  public pageChange(event: PageBean): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 确定
   */
  public handleOk(): void {
    this.selectListDataChange.emit(this.selectListData);
    this.xcVisible = false;
  }


  /**
   * 查询数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    // 筛选出智慧功能杆设施
    this.queryCondition.filterConditions.push({filterField: 'deviceType',
      filterValue: ['002'], operator: 'in'});
    this.$facilityService.deviceListByPage(this.queryCondition).subscribe((result: Result) => {
      this.tableConfig.isLoading = false;
      if (result.code) {
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.dataSet = result.data || [];
        this.dataSet.forEach(item => {
          item.areaName = item.areaInfo ? item.areaInfo.areaName : '';
          item['_deviceType'] = item.deviceType;
          item.deviceType = getDeviceType(this.$nzI18n, item.deviceType);
          item['_deviceStatus'] = item.deviceStatus;
          item.deviceStatus = getDeviceStatus(this.$nzI18n, item.deviceStatus);
          item['iconClass'] = CommonUtil.getFacilityIconClassName(item._deviceType);
          item['deviceStatusIconClass'] = FacilityUtilService.getFacilityDeviceStatusClassName(item._deviceStatus).iconClass;
          item['deviceStatusColorClass'] = FacilityUtilService.getFacilityDeviceStatusClassName(item._deviceStatus).colorClass;
        });
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }


  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      primaryKey: ' ',
      isDraggable: true,
      isLoading: true,
      notShowPrint: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '600px', y: '340px'},
      noIndex: false,
      showSearchExport: false,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        { // 资产编号
          title: this.language.deviceCode, key: 'deviceCode', width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 名称
          title: this.language.deviceName, key: 'deviceName', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        { // 类型
          title: this.language.deviceType, key: 'deviceType', width: 150,
          configurable: false,
          type: 'render',
          renderTemplate: this.deviceTypeTemp,
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
          title: this.language.equipmentQuantity,
          key: 'equipmentQuantity', width: 120,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {  // 详细地址
          title: this.language.address, key: 'address', width: 150, configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 状态
          title: this.language.deviceStatus, key: 'deviceStatus', width: 120,
          type: 'render',
          renderTemplate: this.deviceStatusTemp,
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
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      rightTopButtons: [],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 筛选
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      // 点击选择事件
      handleSelect: (event, currentItem) => {
        this.selectListData = event;
      },
    };
  }


  /**
   * 关闭弹框
   */
  public handleCancel(): void {
    this.xcVisible = false;
  }

  /**
   * 销毁钩子
   */
  public ngOnDestroy(): void {
    this.tableComponent = null;
    this.deviceStatusTemp = null;
    this.deviceTypeTemp = null;
  }


}
