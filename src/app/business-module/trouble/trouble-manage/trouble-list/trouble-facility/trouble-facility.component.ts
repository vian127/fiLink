import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FaultLanguageInterface} from '../../../../../../assets/i18n/fault/fault-language.interface';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TroubleFacilityConfig} from './troubleFacilityConfig';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {TroubleService} from '../../../../../core-module/api-service/trouble/trouble-manage';
import {Result} from '../../../../../shared-module/entity/result';
@Component({
  selector: 'app-trouble-facility',
  templateUrl: './trouble-facility.component.html',
  styleUrls: ['./trouble-facility.component.scss']
})
export class TroubleFacilityComponent implements OnInit {
  @Input() placeholder;
  @Input() title;
  @Input() filterValue;
  @Input() set troubleFacilityConfig(troubleFacilityConfig: TroubleFacilityConfig) {
    if (troubleFacilityConfig) {
      // this.initTableConfig();
      this._troubleFacilityConfig = troubleFacilityConfig;
      this.setData();
    }
  }
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // 状态
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  public tableConfig: TableConfig;
  public language: FaultLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  public facilityLanguage: FacilityLanguageInterface;
  public _type: 'form' | 'table' = 'table';
  // 勾选的故障设施对象
  checkObject = {
    deviceName: '',
    deviceId: '',
    deviceType: '',
    areaId: '',
    area: '',
  };
  // 选择器数据备份
  checkObjectBackups = {
    deviceName: '',
    deviceId: '',
    deviceType: '',
    areaId: '',
    area: '',
  };
  // 设施数据
  public _dataSet: any = [];
  public selectedId = null;
  pageBeanObject: PageBean = new PageBean(10, 1, 0);
  queryConditionObj: QueryCondition = new QueryCondition();
  _troubleFacilityConfig: TroubleFacilityConfig;
  // 表格显示
  public isVisible: boolean = false;
  constructor(
    public $nzI18n: NzI18nService,
    public $troubleService: TroubleService,
  ) {
    this.language = this.$nzI18n.getLocaleData('fault');
    this.facilityLanguage = this.$nzI18n.getLocaleData('facility');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
  }

  ngOnInit() {
    this.initTableConfig();
  }
  setData() {
    if (this._troubleFacilityConfig.type) {
      this._type = this._troubleFacilityConfig.type;
    }
    if (this._troubleFacilityConfig.initialValue && this._troubleFacilityConfig.initialValue.ids
      && this._troubleFacilityConfig.initialValue.ids.length) {
      this.checkObject = this.clone(this._troubleFacilityConfig.initialValue);
      this.checkObjectBackups = this.clone(this._troubleFacilityConfig.initialValue);
    }
    // 外面清空清空所有数据
    if (this._troubleFacilityConfig.clear) {
      this.queryConditionObj.pageCondition.pageNum = 1;
      this.checkObject = {
        deviceName: '',
        deviceId: '',
        deviceType: '',
        areaId: '',
        area: '',
      };
      this.checkObjectBackups = {
        deviceName: '',
        deviceId: '',
        deviceType: '',
        areaId: '',
        area: '',
      };
    }
  }
  // 关闭弹窗
  closeObj() {
    this.checkObjectBackups = this.clone(this.checkObject);
    this.isVisible = false;
    this.pageBeanObject = new PageBean(10, 1, 1);
  }
  // 克隆数据
  clone(data) {
    return JSON.parse(JSON.stringify(data));
  }
  /**
   * 表格数据
   */
  refreshData() {
    this.tableConfig.isLoading = true;
    this.$troubleService.queryDevice(this.queryConditionObj).subscribe((res: Result) => {
      if (res['code'] === '00000') {
        this.pageBeanObject.Total = res.totalCount;
        this.pageBeanObject.pageIndex = res.pageNum;
        this.pageBeanObject.pageSize = res.size;
        this._dataSet = res.data || [];
        this.tableConfig.isLoading = false;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
  objConfirm() {
    this.checkObject = this.clone(this.checkObjectBackups);
    if (this._type === 'table') {
      if (this.filterValue) {
        this.filterValue['filterValue'] = this.checkObject.deviceId;
      }
    }
    this.isVisible = false;
    this.pageBeanObject = new PageBean(10, 1, 1);
    this._troubleFacilityConfig.facilityObject(this.checkObject);
  }
  /**
   * 选择器里面清空已选数据
   * 只清空选择器数据
   */
  clearSelectData() {
    this.checkObjectBackups = {
      deviceName: '',
      deviceId: '',
      deviceType: '',
      areaId: '',
      area: '',
    };
    this.selectedId = '';
    this.refreshData();
  }
  // 告警对象列表弹框分页
  pageChange(event) {
    this.queryConditionObj.pageCondition.pageNum = event.pageIndex;
    this.queryConditionObj.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
  /**
   * 关联告警选择table配置
   */
  initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: false,
      notShowPrint: true,
      noIndex: true,
      scroll: {x: '650px', y: '600px'},
      columnConfig: [
        {
          title: '',
          type: 'render',
          key: 'selectedTroubleId',
          renderTemplate: this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 42
        },
        {// 资产编号
          title: this.facilityLanguage.deviceCode, key: 'deviceCode', width: 150,
          searchable: true,
          searchKey: 'alarmName',
          isShowSort: true,
          searchConfig: {type: 'select', selectType: 'multiple'}
        },
        {// 名称
          title: this.facilityLanguage.name, key: 'deviceName', width: 120,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 状态
          title: this.facilityLanguage.status, key: 'deviceStatus', width: 108,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 型号
          title: this.facilityLanguage.model, key: 'deviceModel', width: 163,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 供应商
          title: this.facilityLanguage.supplierName, key: 'supplier',
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 报废年限
          title: this.facilityLanguage.scrapTime, key: 'scrapTime', width: 108,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 设备数量
          title: this.facilityLanguage.equipmentQuantity, key: 'equipmentQuantity', width: 108,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 业务状态
          title: this.facilityLanguage.businessStatus, key: 'businessStatus', width: 108,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 详细地址
          title: this.facilityLanguage.address, key: 'address', width: 108,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 所属项目
          title: this.facilityLanguage.project, key: 'projectName', width: 108,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 所属区域
          title: this.facilityLanguage.areaId, key: 'areaName', width: 108,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 权属公司
          title: this.facilityLanguage.company, key: 'company', width: 108,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 安装日期
          title: this.facilityLanguage.installTime, key: 'installationDate',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 备注
          title: this.facilityLanguage.remarks, key: 'remarks',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          title: '', searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 75, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      sort: (event: SortCondition) => {
        this.queryConditionObj.sortCondition.sortField = event.sortField;
        this.queryConditionObj.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event) => {
        this.queryConditionObj.filterConditions = event;
        this.refreshData();
      }
    };
  }
  /**
   * 选择设施
   * param event
   * param data
   */
  selectedChange(event, data) {
    if (data) {
      this.checkObjectBackups = {
        deviceName: data.deviceName,
        deviceId: data.deviceId,
        deviceType: data.deviceType,
        areaId: data.areaInfo['areaId'],
        area: data.areaInfo['areaName'],
      };
    }
  }
}
