import {Component, EventEmitter, Input, OnDestroy, OnInit, OnChanges, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService, NzMessageService} from 'ng-zorro-antd';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {Router} from '@angular/router';
import {FACILITY_STATUS_CODE} from '../../../../shared-module/const/facility';
import {IndexTable} from '../../util/index.table';
/**
 * 节点设施组件
 */
@Component({
  selector: 'device-node-list',
  templateUrl: './device-node.component.html',
  styleUrls: ['./device-node.component.scss']
})
export class DeviceNodeComponent extends IndexTable implements OnInit, OnDestroy , OnChanges {
  // 节点设施回传事件
  @Output() deviceNodeEvent = new EventEmitter();
  // 节点设施数据
  @Input() fibreData: any[];
  // 模板
  @ViewChild('areaLevelTemp') areaLevelTemp: TemplateRef<any>;
  // 表格
  @ViewChild('xcTable') xcTable: TableComponent;
  // 全部数据
  public dataSetAll = [];
  // 操作数据
  public dataSet = [];
  // 查询条件
  public queryConditions = {};
  // 节点设施列表
  public facilityList = [];
  // 节点设施状态下拉框
  public deviceStatusSelectOption = [];
  // 节点设施类型下拉框
  public deviceTypeSelectOption = [];
  // 标题
  public title;
  // 待过滤的设施集
  public _facilities = [];
  // 设施告警码
  public facilityAlarmCode;

  constructor(public $nzI18n: NzI18nService,
              private $message: NzMessageService,
              private $router: Router,
              private $mapStoreService: MapStoreService,
              ) {
    super($nzI18n);
  }

  ngOnInit() {
    this.facilityAlarmCode = FACILITY_STATUS_CODE.alarm;
    this.title = this.indexLanguage.nodeDevice;
    this.setSelectOption();
    this.initTableConfig();
    this.getAllShowData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.fibreData) {
      this.getAllShowData();
    }
  }

  ngOnDestroy() {
    this.queryConditions = {};
  }

  /**
   * 设置table中下拉选择框内容
   */
  public setSelectOption() {
    this.deviceStatusSelectOption = this.$mapStoreService.facilityStatusList.filter(item => item.checked);
    this.deviceTypeSelectOption = this.$mapStoreService.facilityTypeList.filter(item => item.checked);
    if (this.tableConfig) {
      if (this.tableConfig.columnConfig[0]) {
        this.tableConfig.columnConfig[0]['searchConfig']['selectInfo'] = this.deviceStatusSelectOption;
      }
      if (this.tableConfig.columnConfig[2]) {
        this.tableConfig.columnConfig[2]['searchConfig']['selectInfo'] = this.deviceTypeSelectOption;
      }
      this.xcTable.handleRest();
    }
  }

  /**
   * 分页
   */
  pageChange(event) {
    this.pageBean.pageIndex = event.pageIndex;
    this.pageBean.pageSize = event.pageSize;
    this.showData();
  }

  /**
   * 获取所有未过滤的数据
   */
  public getAllShowData() {
    this.dataSetAll = [];
    this.dataSetAll = this.fibreData;
    this.filterData();
  }

  /**
   * 过滤数据
   */
  filterData() {
    if (this.dataSetAll) {
      this._facilities = this.dataSetAll.filter(item => this.checkFacility(item));
      this.sortData();
    }
  }

  /**
   * 将有告警的设施放前面
   */
  sortData() {
    this.dataSet = this._facilities.sort((pre, next) => {
      let res;
      if (pre['deviceStatus'] !== this.facilityAlarmCode && next['deviceStatus'] === this.facilityAlarmCode) {
        res = 1;
      } else if (pre['deviceStatus'] === this.facilityAlarmCode && next['deviceStatus'] !== this.facilityAlarmCode) {
        res = -1;
      } else {
        res = 0;
      }
      return res;
    });
    this.showData();
  }

  /**
   * 展示数据
   */
  showData() {
    this.pageBean.Total = this.dataSet.length;
    const startIndex = this.pageBean.pageSize * (this.pageBean.pageIndex - 1);
    const endIndex = startIndex + this.pageBean.pageSize - 1;
    this._dataSet = this.dataSet.filter((item, index) => {
      return index >= startIndex && index <= endIndex;
    }).map(item => {
      item.deviceTypeName = this.getFacilityTypeName(item.deviceType);
      item.deviceStatusName = this.getFacilityStatusName(item.deviceStatus);
      return item;
    });
  }

  /**
   * 过滤判断
   * param item
   * returns {boolean}
   */
  checkFacility(item) {
    const filter = this.queryConditions;
    if (!filter) {
      return true;
    }
    if (filter['deviceName'] && !(item.deviceName.includes(filter['deviceName']))) {
      return false;
    }
    if (filter['deviceType'] && filter['deviceType'].length > 0 && filter['deviceType'].indexOf(item.deviceType) < 0) {
      return false;
    }
    return !filter['address'] || item.address.includes(filter['address']);
  }

  close() {
    this.deviceNodeEvent.emit({type: 'close'});
  }


  /**
   * 数据更新
   * param type
   * param ids
   */
  update(type, ids) {
    this.getAllShowData();
  }

  /**
   * 初始化表格配置
   */
  initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '440px', y: '250px'},
      searchReturnType: 'object',
      topButtons: [],
      simplePage: true,
      noIndex: true,
      columnConfig: [
        {
          title: this.facilityLanguage.deviceName, key: 'deviceName', width: 160,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.facilityLanguage.deviceType, key: 'deviceTypeName', width: 100,
          searchKey: 'deviceType',
          searchable: true,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.deviceTypeSelectOption}
        },
        {
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 70, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: true,
      operation: [
        {
          text: this.indexLanguage.location,
          className: 'fiLink-location',
          handle: (currentIndex) => {
            this.deviceNodeEvent.emit({type: 'location', id: currentIndex.deviceId});
          }
        },
      ],
      handleSearch: (event) => {
        this.pageBean.pageIndex = 1;
        this.queryConditions = event;
        this.filterData();
      },
    };
  }
}
