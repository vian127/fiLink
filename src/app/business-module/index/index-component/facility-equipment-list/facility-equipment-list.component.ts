import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {
  indexFacilityComponentType,
  index_facility_equipment_list,
  index_facility_status,
  index_num
} from '../../shared/const/index-const';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {ResultModel} from '../../../../core-module/model/result.model';
import {IndexApiService} from '../../service/index/index-api.service';
import {ResultCodeEnum} from 'src/app/core-module/model/result-code.enum';
import {BusinessFacilityService} from '../../../../shared-module/service/business-facility/business-facility.service';

/**
 * 设施设备列表
 */
@Component({
  selector: 'app-facility-equipment-list',
  templateUrl: './facility-equipment-list.component.html',
  styleUrls: ['./facility-equipment-list.component.scss']
})
export class FacilityEquipmentListComponent implements OnInit, OnChanges, AfterViewInit {
  // 设施选择器选择结果
  @Input() facilityData;
  // 设备选择器选择结果
  @Input() equipmentData;
  // 区域选择器选择结果
  @Input() areaData;
  // 设施设备列表回传事件
  @Output() FacilityEquipmentListEvent = new EventEmitter();
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 国际化
  public commonLanguage: CommonLanguageInterface;
  // 设施设备列表枚举
  public facilityEquipmentList = index_facility_equipment_list;
  // 设施类型枚举
  public facilityType = indexFacilityComponentType;
  // 设施状态枚举
  public facilityStatus = index_facility_status;
  // 更多
  public more: string;
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
  // 批量操作按钮是否置灰
  public buttonDisabled = true;
  // 设施列表数是否大于0
  public facilityListNum = false;
  // 设备列表数是否大于0
  public equipmentListNum = false;

  constructor(public $nzI18n: NzI18nService,
              private $indexApiService: IndexApiService,
              private $businessFacilityService: BusinessFacilityService) {
    this.indexLanguage = $nzI18n.getLocaleData('index');
    this.commonLanguage = $nzI18n.getLocaleData('common');
  }

  ngOnInit() {
    this.isExpandFacilityList = true;
    this.defaultHandleTab = true;
    this.defaultShowTable = true;
    this.more = this.commonLanguage.more;
    this.initFacilityListTable();
    this.initEquipmentListTable();
  }

  public ngAfterViewInit(): void {
  }

  public ngOnChanges(): void {
    if (this.facilityData) {
      this.getFacilityListTable();
    }
    if (this.equipmentData) {
      this.getEquipmentListTable();
    }
  }

  /**
   * 切换tab页
   */
  public tabClick(tabNum: string): void {
    if (tabNum === index_facility_equipment_list.facilitiesList) {
      this.defaultShowTable = true;
      this.defaultHandleTab = true;
      // 列表总数是否大于0，大于则批量操作按钮显示
      if (this.facilityListNum === true) {
        this.buttonDisabled = false;
      } else {
        this.buttonDisabled = true;
      }
    }
    if (tabNum === index_facility_equipment_list.equipmentList) {
      this.defaultShowTable = false;
      this.defaultHandleTab = false;
      // 列表总数是否大于0，大于则批量操作按钮显示
      if (this.equipmentListNum === true) {
        this.buttonDisabled = false;
      } else {
        this.buttonDisabled = true;
      }
    }
  }

  /**
   * 设施表格配置
   */
  public initFacilityListTable(): void {
    this.facilityListTableConfig = {
      isDraggable: true,
      isLoading: true,
      notShowPrint: true,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      searchReturnType: 'object',
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 50, hidden: true},
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
          title: this.indexLanguage.facilityStatusTitle, key: 'deviceStatus', width: 150,
          configurable: false,
          isShowSort: false,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// 操作
          title: this.indexLanguage.operation, key: '', width: 80,
          searchable: true,
          searchConfig: {type: 'operate'},
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      simplePage: true,
      bordered: false,
      showSearch: false,
      operation: [
        {
          // 定位
          text: this.indexLanguage.location,
          permissionCode: '06-1-1-6',
          className: 'fiLink-filink-location-icon',
          handle: (currentIndex) => {
            this.$businessFacilityService.eventEmit.emit({positionBase: currentIndex.positionBase, id: currentIndex.deviceId});
          }
        },
      ],
    };
  }

  /**
   * 设施表格数据加载
   */
  public getFacilityListTable(): void {
    const list = [];
    if (this.areaData) {
      this.areaData.forEach(item => {
        list.push({areaCode: item});
      });
      this.facilityQueryCondition.bizCondition = {
        'area': list,
        'device': this.facilityData,
        'group': []
      };
      this.facilityQueryCondition.pageCondition.pageSize = 5;
      this.facilityListTableConfig.isLoading = true;
      this.$indexApiService.queryDeviceList(this.facilityQueryCondition).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          result.data.forEach(item => {
            item.deviceType = this.facilityType[item.deviceType];
            item.deviceStatus = this.facilityStatus[item.deviceStatus];
          });
          if (result.data.length > index_num.numZero) {
            this.facilityListNum = true;
          } else {
            this.facilityListNum = false;
          }
          this.facilityListDataSet = result.data;
          this.facilityListTableConfig.isLoading = false;
        } else {
          this.facilityListTableConfig.isLoading = false;
        }
      });
    }
  }

  /**
   * 设施工单表格分页
   */
  public pageFacilityList(event): void {
    this.facilityListPageBean.pageIndex = event.pageIndex;
    this.facilityListPageBean.pageSize = event.pageSize;
  }

  /**
   * 设备表格配置
   */
  public initEquipmentListTable(): void {
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
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 50, hidden: false},
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
        {
          title: this.indexLanguage.equipmentStatus, key: 'equipmentStatus', width: 100,
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
      showPagination: true,
      simplePage: true,
      bordered: false,
      showSearch: false,
      operation: [{
        // 定位
        text: this.indexLanguage.location,
        permissionCode: '06-1-1-6',
        className: 'fiLink-filink-location-icon',
        handle: (currentIndex) => {
          this.$businessFacilityService.eventEmit.emit({positionBase: currentIndex.positionBase, id: currentIndex.equipmentId});
        }
      }],
    };
  }

  /**
   * 设备表格数据加载
   */
  public getEquipmentListTable(): void {
    const list = [];
    if (this.areaData) {
      this.areaData.forEach(item => {
        list.push({areaCode: item});
      });
      this.equipmentQueryCondition.bizCondition = {
        'area': list,
        'equipment': this.equipmentData,
        'group': []
      };
      this.equipmentQueryCondition.pageCondition.pageSize = 5;
      this.equipmentListTableConfig.isLoading = true;
      this.$indexApiService.queryEquipmentList(this.equipmentQueryCondition).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          // result.data.forEach(item => {
          //   item.deviceType = this.facilityType[item.deviceType];
          //   item.deviceStatus = this.facilityStatus[item.deviceStatus];
          // });
          if (result.data.length > index_num.numZero) {
            this.equipmentListNum = true;
          } else {
            this.equipmentListNum = false;
          }
          this.equipmentListDataSet = result.data;
          this.equipmentListTableConfig.isLoading = false;
        } else {
          this.equipmentListTableConfig.isLoading = false;

        }
      });
    }
  }

  /**
   * 设备表格分页
   */
  public pageEquipmentList(event): void {
    this.equipmentListPageBean.pageIndex = event.pageIndex;
    this.equipmentListPageBean.pageSize = event.pageSize;
  }

  /**
   * 跳转至更多
   */
  public goToFacilityList(): void {
    // this.$router.navigate([`/business/facility/facility-list`], {}).then();
  }

  /**
   * 批量操作按钮
   */
  public handleBatchOperation(): void {
    this.FacilityEquipmentListEvent.emit();
  }
}
