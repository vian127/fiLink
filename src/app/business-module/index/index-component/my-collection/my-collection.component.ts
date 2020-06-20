import {Component, EventEmitter, Input,  OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {Router} from '@angular/router';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {NzI18nService, NzMessageService} from 'ng-zorro-antd';
import {MapService} from '../../../../core-module/api-service/index/map/index';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {Result} from '../../../../shared-module/entity/result';
import {IndexTable} from '../../util/index.table';
import {FACILITY_STATUS_CODE} from '../../../../shared-module/const/facility';

@Component({
  selector: 'app-my-collection',
  templateUrl: '../index-facility-list/facility-list.component.html',
  styleUrls: ['../index-facility-list/facility-list.component.scss']
})
export class MyCollectionComponent extends IndexTable implements OnInit{
  // 首页设施收藏数据缓存
  @Input() indexCacheData;
  // 是否显示更多按钮
  @Input() isShowMore = false;
  // 我的关注回传事件
  @Output() myCollectionEvent = new EventEmitter();
  // 区域级别
  @ViewChild('areaLevelTemp') areaLevelTemp: TemplateRef<any>;
  // 表格
  @ViewChild('xcTable') xcTable: TableComponent;
  // 更多
  public more;
  // 数据集
  public dataSetAll = [];
  // 设施列表
  public facilityList = [];
  // 初次过滤后的数据
  public firstFilterData = [];
  // 设备状态下拉框
  public deviceStatusSelectOption = [];
  // 设备类型下拉框
  public deviceTypeSelectOption = [];
  // 选中的设施类型
  public selectedFacilityType = null;
  // 标题
  public title;
  // 待过滤的设施集
  public _facilities = [];
  // 所有的设施关注数据
  public _data = [];
  // 缓存关注设施数据
  public cacheData = [];
  // 首页选中的设施类型集合
  public selectedFacilityTypeIdsArr;
  // 首页选中的设施状态集合
  public selectedFacilityStatusArr;
  // 首页选中的逻辑区域集合
  public selectedLogicAreaIdsArr;
  // 设施告警code
  public facilityAlarmCode;

  constructor(public $nzI18n: NzI18nService,
              private $message: NzMessageService,
              private $router: Router,
              private $mapService: MapService,
              private $mapStoreService: MapStoreService,
              ) {
    super($nzI18n);
  }

  ngOnInit() {
    this.title = this.indexLanguage.myCollection;
    this.more = this.commonLanguage.more;
    this.facilityAlarmCode = FACILITY_STATUS_CODE.alarm;
    this.setSelectOption();

    // 更新数据
    this.selectedFacilityTypeIdsArr = this.$mapStoreService.facilityTypeList.filter(item => item.checked)
      .map(item => item.value);
    this.selectedFacilityStatusArr = this.$mapStoreService.facilityStatusList.filter(item => item.checked)
      .map(item => item.value);
    this.selectedLogicAreaIdsArr = this.$mapStoreService.logicAreaList.filter(item => item.checked)
      .map(item => item.areaId);
    // 初始化表格
    this.initTableConfig();

    // 首页设施收藏数据缓存
    if (!this.indexCacheData) {
      this.getAllShowData();
    } else {
      this._data = this.indexCacheData;
      this.cacheData = CommonUtil.deepClone(this.indexCacheData);
      this.firstFilter();
    }
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
   * 实时推送更新
   * param type
   * param items
   */
  update(type, items) {
    const index = this.cacheData.findIndex(item => item.deviceId === items.deviceId);
    if (type === 'focusDevice') {
      if (index > -1) {
        this.cacheData.splice(index, 1, items);
      } else {
        this.cacheData.push(items);
      }
    } else if (type === 'unFollowDevice') {
      if (index > -1) {
        this.cacheData.splice(index, 1);
      }
    }
    this.refreshLeftMenu();
    this.myCollectionEvent.emit({type: 'update', data: this.cacheData});
  }

  /**
   * 刷新左侧设施类型统计
   */
  refreshLeftMenu() {
    this._data = CommonUtil.deepClone(this.cacheData);
    this.selectedFacilityTypeIdsArr = this.$mapStoreService.facilityTypeList.filter(item => item.checked)
      .map(item => item.value);
    this.selectedFacilityStatusArr = this.$mapStoreService.facilityStatusList.filter(item => item.checked)
      .map(item => item.value);
    this.selectedLogicAreaIdsArr = this.$mapStoreService.logicAreaList.filter(item => item.checked)
      .map(item => item.areaId);
    this.firstFilter();
  }

  /**
   * 获取所有未过滤的数据
   */
  public getAllShowData() {
    this.$mapService.getAllCollectFacilityList().subscribe((result: Result) => {
      console.log(result);
      if (result.code === 0) {
        this._data = result.data;
        this.cacheData = CommonUtil.deepClone(result.data);
        this.firstFilter();
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
    });
  }

  /**
   * 根据首页的几个筛选组件过滤
   */
  firstFilter() {
    this.firstFilterData = this._data.filter(item => this.checkFacility(item));
    this.ShowFacilityTable();
  }

  /**
   * 校检设施
   * param item
   * returns {boolean}
   */
  checkFacility(item) {
    if (this.selectedFacilityTypeIdsArr.indexOf(item.deviceType) < 0) {
      return false;
    }
    if (this.selectedFacilityStatusArr.indexOf(item.deviceStatus) < 0) {
      return false;
    }
    if (this.$mapStoreService.isInitLogicAreaData
      && this.selectedLogicAreaIdsArr
      && this.selectedLogicAreaIdsArr.indexOf(item.areaId) < 0) {
      return false;
    }
    return true;
  }

  /**
   * 二次过滤判断 （表格内过滤）
   * param item
   * returns {boolean}
   */
  tableCheckFacility(item) {
    const filter = this.queryCondition.filterConditions;
    if (!filter) {
      return true;
    }
    if (filter['deviceStatus'] && filter['deviceStatus'].length > 0 && filter['deviceStatus'].indexOf(item.deviceStatus) < 0) {
      return false;
    }
    if (filter['deviceName'] && !(item.deviceName.includes(filter['deviceName']))) {
      return false;
    }
    if (filter['deviceType'] && filter['deviceType'].length > 0 && filter['deviceType'].indexOf(item.deviceType) < 0) {
      return false;
    }
    return !filter['address'] || item.address.includes(filter['address']);
  }

  /**
   * 显示设施表
   * param id
   * constructor
   */
  ShowFacilityTable() {
    this.queryCondition.filterConditions = [];
    // TODO 目前未提供对应api
    this.xcTable.tableService.resetFilterConditions(this.xcTable.queryTerm);
    this.refreshData();
  }

  /**
   * 刷新数据
   */
  refreshData() {
    this.dataSetAll =  this.firstFilterData.filter(item => {
      return this.tableCheckFacility(item);
    });
    this.sortData();
  }

  /**
   * 将有告警的设施放前面
   */
  sortData() {
    this.dataSetAll = this.dataSetAll.sort((pre, next) => {
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
    this.pageBean.Total = this.dataSetAll.length;
    const startIndex = this.pageBean.pageSize * (this.pageBean.pageIndex - 1);
    const endIndex = startIndex + this.pageBean.pageSize - 1;
    this._dataSet = this.dataSetAll.filter((item, index) => {
      return index >= startIndex && index <= endIndex;
    }).map(item => {
      item.deviceTypeName = this.getFacilityTypeName(item.deviceType);
      item.deviceStatusName = this.getFacilityStatusName(item.deviceStatus);
      return item;
    });
    console.log(this._dataSet);
  }

  /**
   * 关闭
   */
  close() {
    this.myCollectionEvent.emit({type: 'close'});
  }

  /**
   * 初始化表格配置
   */
  initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '440px', y: '250px'},
      topButtons: [],
      simplePage: true,
      noIndex: true,
      searchReturnType: 'object',
      columnConfig: [
        {
          title: this.facilityLanguage.deviceStatus, key: 'deviceStatusName', width: 100, searchKey: 'deviceStatus',
          searchable: true,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.deviceStatusSelectOption}
        },
        {
          title: this.facilityLanguage.deviceName, key: 'deviceName', width: 60,
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
          title: this.facilityLanguage.address, key: 'address', width: 80,
          searchable: true,
          searchConfig: {type: 'input'}
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
            this.myCollectionEvent.emit({type: 'location', id: currentIndex.deviceId});
          }
        },
      ],
      handleSearch: (event) => {
        this.pageBean.pageIndex = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
    };
  }
}
