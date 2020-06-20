import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ResultModel} from '../../../../core-module/model/result.model';
import {FacilityConditionModel} from '../../shared/model/facility-condition.model';
import {IndexApiService} from '../../service/index/index-api.service';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {FacilityEquipmentConfig} from '../../index-component/facility-equipment-type/config';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';

/**
 * 设施设备列表组件
 */
@Component({
  selector: 'app-facilities-list',
  templateUrl: './facilities-list.component.html',
  styleUrls: ['./facilities-list.component.scss']
})
export class FacilitiesListComponent implements OnInit, AfterViewInit {
  // 是否显示租赁方
  public isShowLeasee: boolean;
  // ？？？
  isShowNoData;
  // 区域数据
  public areaData: any;
  // 设施选择结果
  public facilityData: any;
  // 设备选择结果
  public equipmentData: any;
  // 设施类型模型
  public FacilityCondition = new FacilityConditionModel;
  // 设备类型模型
  public equipmentCondition = new FacilityConditionModel;
  // 分组类型模型
  public groupCondition = new FacilityConditionModel;
  // 设施类型数据
  public facilityTypeList = [];
  // 设备类型数据
  public equipmentTypeList = [];
  // 分组数据
  public groupList = [];
  // 设施设备类型组件配置
  public facilityEquipmentComponent: FacilityEquipmentConfig;

  constructor(
    private $indexApiService: IndexApiService,
    private $mapStoreService: MapStoreService
  ) {
  }

  ngOnInit(): void {
    this.facilityEquipmentConfig();
  }

  ngAfterViewInit(): void {

  }

  /**
   * 设施设备选择器配置
   */
  facilityEquipmentConfig(): void {
    this.facilityEquipmentComponent = {
      showFacilitiesComponent: true,
      showEquipmentComponent: true,
      showWorkOrderStatusComponent: false,
      showWorkOrderTypeComponent: false,
      facilityTitleName: '设施类型',
      equipmentTitleName: '设备类型',
    };
  }

  /**
   * 区域选择结果
   * param evt
   */
  areaDataChange(evt): void {
    this.areaData = evt;
    // 根据缓存是否调用接口获取数据
    // this.$mapStoreService.isInitLogicFacilityData ? this.getAllFacilityListFromStore() : this.getFacilityType();
    this.getFacilityType();
    // this.$mapStoreService.isInitLogicEquipmentData ? this.getAllEquipemntListFromStore() : this.getEquipmentType();
    this.getEquipmentType();
    this.getGroupData();

  }

  /**
   * 设施类型数据加载
   */
  getFacilityType(): void {
    if (this.areaData) {
      this.FacilityCondition.areaIdList = this.areaData;
      this.$indexApiService.queryDeviceTypeListForPageSelection(this.FacilityCondition).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$mapStoreService.logicFacilityList = result.data.map((item, index) => {
            item.checked = true;
            return item;
          });
          this.$mapStoreService.isInitLogicFacilityData = true;
          this.facilityTypeList = result.data;
          this.facilitiesSelect(result.data);
        }
      });
    }
    // this.facilityTypeList = [
    //   {
    //     'deviceType': '030',
    //     'count': 1
    //   },
    //   {
    //     'deviceType': '060',
    //     'count': 1
    //   }
    // ];
    this.facilitiesSelect(this.facilityTypeList);

  }

  /**
   * 缓存中取设施类型数据
   */
  getAllFacilityListFromStore(): void {
    let ary: any[];
    ary = this.$mapStoreService.logicFacilityList;
    this.facilityTypeList = ary;
  }

  /**
   * 设施选择器选择结果
   * param evt
   */
  facilitiesSelect(evt): void {
    const list = [];
    evt.forEach(item => {
      list.push({deviceType: item.deviceType});
    });
    this.facilityData = list;
  }

  /**
   * 设备类型数据加载
   */
  getEquipmentType(): void {
    if (this.areaData) {
      this.equipmentCondition.areaCodeList = this.areaData;
      this.$indexApiService.queryEquipmentTypeListForPageSelection(this.equipmentCondition).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$mapStoreService.logicEquipmentList = result.data.map((item, index) => {
            item.checked = true;
            return item;
          });
          this.$mapStoreService.isInitLogicEquipmentData = true;
          this.equipmentTypeList = result.data;
          this.equipmentSelect(result.data);
        }
      });
      // this.equipmentTypeList = [
      //   {
      //     'equipmentType': '001',
      //     'count': 1
      //   },
      //   {
      //     'equipmentType': '003',
      //     'count': 6
      //   },
      //   {
      //     'equipmentType': '004',
      //     'count': 1
      //   }
      // ];
      this.equipmentSelect(this.equipmentTypeList);
    }
  }

  /**
   * 获取分组数据
   */
  getGroupData(): void {
    this.$indexApiService.queryGroupInfoList(this.groupCondition).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.groupList = result.data.map(item => {
          return {groupName: item.groupName, groupId: item.groupId};
        });
      }
    });
  }

  /**
   * 缓存中取设备类型数据
   */
  getAllEquipemntListFromStore(): void {
    let ary: any[];
    ary = this.$mapStoreService.logicEquipmentList;
    this.equipmentTypeList = ary;
  }

  /**
   * 设备选择器选择结果
   * param evt
   */
  equipmentSelect(evt): void {
    const list = [];
    evt.forEach(item => {
      list.push({equipmentType: item.equipmentType});
    });
    this.equipmentData = list;
  }

  /**
   * 切换租赁方是否显示
   * param evt
   */
  showLeasee(evt): void {
    if (evt === true) {
      this.isShowLeasee = true;
    } else {
      this.isShowLeasee = false;
    }
  }

  /**
   * 分组数据
   * {string[]} evt
   */
  public selectGroupItem(evt: string[]): void {
    this.groupList = evt;
  }
}
