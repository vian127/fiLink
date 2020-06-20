import {AfterViewInit, Component, OnInit} from '@angular/core';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {NzI18nService} from 'ng-zorro-antd';
import {
  indexEquipmentComponentType,
  indexFacilityComponentType,
  index_facility_equipment_list,
  index_facility_status
} from '../../shared/const/index-const';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {ResultModel} from '../../../../core-module/model/result.model';
import {IndexApiService} from '../../service/index/index-api.service';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {BusinessFacilityService} from '../../../../shared-module/service/business-facility/business-facility.service';

@Component({
  selector: 'app-my-collection-list',
  templateUrl: './my-collection-list.component.html',
  styleUrls: ['./my-collection-list.component.scss']
})
export class MyCollectionListComponent implements OnInit, AfterViewInit {
// 国际化
  public indexLanguage: IndexLanguageInterface;
  // 设施设备列表枚举
  public facilityEquipmentList = index_facility_equipment_list;
  // 是否展开
  public isExpandFacilityList: boolean;
  // 默认点击的tab页
  public defaultHandleTab: boolean;
  // 默认显示的table表格
  public defaultShowTable: boolean;
  // 设施列表数据集
  public facilityListDataSet = [];
  // 设施列表表格分页
  public facilityListPageBean: PageBean = new PageBean(5, 1, 1);
  // 设施列表表格配置
  public facilityListTableConfig: TableConfig;
  // 设施查询条件
  public facilityQueryCondition: QueryCondition = new QueryCondition();
  // 设备列表数据集
  public equipmentListDataSet = [];
  // 设备列表分页
  public equipmentListPageBean: PageBean = new PageBean(5, 1, 1);
  // 设备列表表格配置
  public equipmentListTableConfig: TableConfig;
  // 设备查询条件
  public equipmentQueryCondition: QueryCondition = new QueryCondition();
  // 区域缓存数据
  public areaStoreData;
  // 设施缓存数据
  public facilityStoreData;
  // 设备缓存数据
  public equipmentStoreData;
  // 设施类型枚举
  public facilityType = indexFacilityComponentType;
  // 设施状态枚举
  public facilityStatus = index_facility_status;
  // 设施状态枚举
  public equipmentType = indexEquipmentComponentType;

  constructor(public $nzI18n: NzI18nService,
              private $indexApiService: IndexApiService,
              private $mapStoreService: MapStoreService,
              private $businessFacilityService: BusinessFacilityService) {
    this.indexLanguage = $nzI18n.getLocaleData('index');
  }

  ngOnInit() {
    this.isExpandFacilityList = true;
    this.defaultHandleTab = true;
    this.defaultShowTable = true;
    this.initFacilityListTable();
    this.initEquipmentListTable();
  }

  ngAfterViewInit(): void {
    // 获取缓存筛选条件
    this.areaStoreData = this.$mapStoreService.areaSelectedResults;
    this.facilityStoreData = this.$mapStoreService.facilityTypeSelectedResults;
    this.equipmentStoreData = this.$mapStoreService.equipmentTypeSelectedResults;
    this.getFacilityListTable();
    this.getEquipmentListTable();
  }

  /**
   * 切换tab页
   */
  tabClick(tabNum: string) {
    if (tabNum === index_facility_equipment_list.facilitiesList) {
      this.defaultShowTable = true;
      this.defaultHandleTab = true;
    }
    if (tabNum === index_facility_equipment_list.equipmentList) {
      this.defaultShowTable = false;
      this.defaultHandleTab = false;
    }
  }

  /**
   * 设施表格配置
   */
  private initFacilityListTable(): void {
    this.facilityListTableConfig = {
      isDraggable: true,
      isLoading: false,
      notShowPrint: true,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      searchReturnType: 'object',
      scroll: {x: '800', y: '400px'},
      noIndex: true,
      columnConfig: [
        // {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 50, hidden: true},
        {
          title: this.indexLanguage.deviceName, key: 'deviceName', width: 100,
          configurable: false,
          isShowSort: false,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.indexLanguage.facilityTypeTitle, key: 'deviceType', width: 100,
          configurable: false,
          isShowSort: false,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.indexLanguage.address, key: 'address', width: 100,
          configurable: false,
          isShowSort: false,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.indexLanguage.facilityStatusTitle, key: 'deviceStatus', width: 100,
          configurable: false,
          isShowSort: false,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// 操作
          title: this.indexLanguage.operation, key: '', width: 80,
          configurable: false,
          searchable: true,
          searchConfig: {type: 'operate'},
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      operation: [
        {
          // 定位
          text: this.indexLanguage.location,
          permissionCode: '',
          className: 'fiLink-filink-location-icon',
          handle: (currentIndex) => {
            this.$businessFacilityService.eventEmit.emit({positionBase: currentIndex.positionBase, id: currentIndex.deviceId});
          }
        },
        {
          // 取消关注
          text: this.indexLanguage.unsubscribe,
          permissionCode: '',
          className: 'fiLink-turn-back-confirm',
          handle: (currentIndex) => {
            this.$indexApiService.deviceDelCollectingById(currentIndex.deviceId).subscribe((result: ResultModel<any>) => {
              if (result.code === ResultCodeEnum.success) {
                console.log(result.data);
              }
            });
          }
        },
      ],
      showPagination: true,
      simplePage: true,
      bordered: false,
      showSearch: false,
    };
  }

  /**
   * 设施表格数据加载
   */
  getFacilityListTable(): void {
    this.facilityQueryCondition.bizCondition = {
      'area': this.areaStoreData ? this.areaStoreData : [],
      'device': this.facilityStoreData ? this.facilityStoreData : [],
      'group': []
    };
    this.facilityQueryCondition.pageCondition.pageSize = 5;
    this.$indexApiService.queryCollectingDeviceList(this.facilityQueryCondition).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.facilityListDataSet = result.data;
        result.data.forEach(item => {
          item.deviceType = this.facilityType[item.deviceType];
          item.deviceStatus = this.facilityStatus[item.deviceStatus];
        });
      }
    });
  }

  /**
   * 设施工单表格分页
   */
  pageFacilityList(event) {
    this.facilityListPageBean.pageIndex = event.pageIndex;
    this.facilityListPageBean.pageSize = event.pageSize;
  }

  /**
   * 设备表格配置
   */
  private initEquipmentListTable(): void {
    this.equipmentListTableConfig = {
      isDraggable: true,
      isLoading: false,
      notShowPrint: true,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      searchReturnType: 'object',
      scroll: {x: '600', y: '400px'},
      noIndex: true,
      columnConfig: [
        // {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 50, hidden: false},
        {
          title: this.indexLanguage.equipmentName, key: 'equipmentName', width: 100,
          configurable: false,
          isShowSort: false,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.indexLanguage.affiliatedFacilities, key: 'deviceName', width: 100,
          configurable: false,
          isShowSort: false,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.indexLanguage.equipmentTypeTitle, key: 'equipmentType', width: 100,
          configurable: false,
          isShowSort: false,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.indexLanguage.address, key: 'address', width: 100,
          configurable: false,
          isShowSort: false,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// 操作
          title: this.indexLanguage.operation, key: '', width: 80,
          configurable: false,
          searchable: true,
          searchConfig: {type: 'operate'},
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      operation: [
        {
          // 定位
          text: this.indexLanguage.location,
          permissionCode: '',
          className: 'fiLink-filink-location-icon',
          handle: (currentIndex) => {
            this.$businessFacilityService.eventEmit.emit({positionBase: currentIndex.positionBase, id: currentIndex.equipmentId});
          }
        },
        {
          // 取消关注
          text: this.indexLanguage.unsubscribe,
          permissionCode: '',
          className: 'fiLink-turn-back-confirm',
          handle: (currentIndex) => {
            this.$indexApiService.equipmentDelCollectingById(currentIndex.equipmentId).subscribe((result: ResultModel<any>) => {
              if (result.code === ResultCodeEnum.success) {
                console.log(result.data);
              }
            });
          }
        },
      ],
      showPagination: true,
      simplePage: true,
      bordered: false,
      showSearch: false,
    };

  }

  /**
   * 设备表格数据加载
   */
  getEquipmentListTable(): void {
    this.equipmentQueryCondition.bizCondition = {
      'area': this.areaStoreData ? this.areaStoreData : [],
      'equipment': this.equipmentStoreData ? this.equipmentStoreData : [],
      'group': []
    };
    this.equipmentQueryCondition.pageCondition.pageSize = 5;
    this.$indexApiService.queryCollectingEquipmentList(this.equipmentQueryCondition).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.equipmentListDataSet = result.data;
        result.data.forEach(item => {
          item.equipmentType = this.equipmentType[item.equipmentType];
        });
      }
    });
  }

  /**
   * 设备表格分页
   */
  pageEquipmentList(event) {
    this.equipmentListPageBean.pageIndex = event.pageIndex;
    this.equipmentListPageBean.pageSize = event.pageSize;
  }

}
