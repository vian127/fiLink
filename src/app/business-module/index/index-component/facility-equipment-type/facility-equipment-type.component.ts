import {AfterContentInit, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {
  indexEquipmentComponentType,
  indexFacilityComponentType,
  index_facility_equipment_type,
} from '../../shared/const/index-const';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import * as lodash from 'lodash';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {FacilityEquipmentConfig} from './config';
import {SetEquipmentDataModel, SetFacilityDataModel, SetWorkOrderStatusDataModel} from '../../shared/model/log-operating.model';
import {IndexWorkOrderComponentStatusEnum, IndexWorkOrderComponentTypeEnum, IndexWorkOrderTypeEnum} from '../../shared/const/index-enum';

/**
 * 设施设备类型选择
 */
@Component({
  selector: 'app-facility-equipment-type',
  templateUrl: './facility-equipment-type.component.html',
  styleUrls: ['./facility-equipment-type.component.scss']
})
export class FacilityEquipmentTypeComponent implements OnInit, AfterContentInit, OnChanges {
  // 配置
  @Input() facilityEquipmentConfig: FacilityEquipmentConfig;
  // 区域数据
  @Input() areaData: string[];
  // 设施数据
  @Input() setFacilityData: SetFacilityDataModel[] = [];
  // 设备数据
  @Input() setEquipmentData: SetEquipmentDataModel[] = [];
  // 工单状态数据
  @Input() setWorkOrderStatusData: SetWorkOrderStatusDataModel[] = [];
  // 工单数据
  @Input() setWorkOrderData: string[];
  // 设施的选择结果
  @Output() facilitiesData = new EventEmitter();
  // 设备的选择结果
  @Output() equipmentData = new EventEmitter();
  // 工单类型的选择结果
  @Output() workOrderTypeData = new EventEmitter();
  // 工单状态的选择结果
  @Output() workOrderStatusData = new EventEmitter();
  // 设施设备切换显示租赁方
  @Output() facilitiesOrEquipment = new EventEmitter();
  // 设施设备枚举
  public facilityEquipmentType = index_facility_equipment_type;
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 设施类型是否全选
  public isFacilityTypeAllChecked = true;
  // 设备类型是否全选
  public isEquipmentTypeAllChecked = true;
  // 工单状态是否全选
  public isWorkOrderStatusAllChecked = true;
  // 是否展开的设施或设备
  public isExpandFacilityEquipment = true;
  // 设施选择结果
  public FacilityDataList = [];
  // 设施类型全选总数
  public FacilityCheckNum: number = 0;
  // 设备选择结果
  public EquipmentDataList: string[];
  // 工单状态选择结果
  public workOrderStatusDataList: string[];
  // 工单类型选择结果
  public workOrderTypeDataList: string[];
  // 设备类型全选总数
  public EquipmentCheckNum: number = 0;
  // 工单状态全选总数
  public workOrderStatusCheckNum: number = 0;
  // 设施类型枚举
  public facilityEnum = indexFacilityComponentType;
  // 设备类型枚举
  public equipmentEnum = indexEquipmentComponentType;
  // 工单类型枚举
  public workOrderTypeEnum = IndexWorkOrderComponentTypeEnum;
  // 工单状态枚举
  public workOrderStatusEnum = IndexWorkOrderComponentStatusEnum;
  // 默认选中的工单类型
  public orderTypeRadioValue = IndexWorkOrderTypeEnum.inspection;
  // change触发类型
  public changeType = 0;

  constructor(
    public $nzI18n: NzI18nService,
    private $mapStoreService: MapStoreService) {
    this.indexLanguage = $nzI18n.getLocaleData('index');
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
  }

  ngOnChanges(): void {
    if (this.setFacilityData && this.setFacilityData.length > 0) {
      this.facilityTypeChange(true, undefined, 1);
    }
    if (this.setEquipmentData && this.setEquipmentData.length > 0) {
      this.equipmentTypeChange(true, undefined, 1);
    }
    if (this.setWorkOrderStatusData && this.setWorkOrderStatusData.length > 0) {
      this.workOrderStatusChange(true, undefined, 1);
    }
  }

  /**
   *  设施类型checkbox全选/反选
   */
  facilityTypeChange(event, type?, change?): void {
    const storeData = this.$mapStoreService.facilityTypeSelectedResults;
    this.FacilityCheckNum = 0;
    let facilityNum = 0;
    // 计算设施总数
    this.setFacilityData.forEach(item => {
      facilityNum += item.count;
    });
    const facilitiesSelect = [];
    if (!type && !storeData || storeData.length === 0) {
      // 全选和去全选
      this.setFacilityData.forEach(item => {
        if (event === true) {
          item.checked = true;
          facilitiesSelect.push({deviceType: item.deviceType});
          this.FacilityCheckNum += item.count;
        } else {
          item.checked = false;
        }
      });
    } else if (type) {
      // 点击某个设施类型，变化总数
      this.setFacilityData.forEach((item) => {
        if (item.checked === true) {
          this.FacilityCheckNum += item.count;
          facilitiesSelect.push({deviceType: item.deviceType});
        }
      });
    }
    // 没有勾选的设施类型时，全选去勾选
    if (this.FacilityCheckNum < facilityNum) {
      this.isFacilityTypeAllChecked = false;
    } else if (this.FacilityCheckNum === facilityNum) {
      this.isFacilityTypeAllChecked = true;
    }
    // 读取缓存数据
    if (storeData && storeData.length > 0 && !type) {
      this.setFacilityData.forEach(item => {
        storeData.forEach(storeItem => {
          if (item.deviceType === storeItem.deviceType) {
            item.checked = true;
            facilitiesSelect.push({deviceType: item.deviceType});
          } else {
            item.checked = false;
            this.isFacilityTypeAllChecked = false;
          }
        });
      });
    }
    if (!change) {
      this.changeType = 1;
      this.FacilityDataList = facilitiesSelect;
      this.checkShake();
    } else {
      this.facilitiesData.emit(this.FacilityDataList);
      this.$mapStoreService.facilityTypeSelectedResults = this.FacilityDataList;
    }
  }


  /**
   *  设备类型checkbox全选/反选
   */
  equipmentTypeChange(event, type?, change?): void {
    const storeData = this.$mapStoreService.equipmentTypeSelectedResults;
    this.EquipmentCheckNum = 0;
    let equipmentNum = 0;
    // 计算设备总数
    this.setEquipmentData.forEach(item => {
      equipmentNum += item.count;
    });
    const equipmentSelect = [];
    if (!type && !storeData || storeData.length === 0) {
      // 全选和去全选
      this.setEquipmentData.forEach(item => {
        if (event === true) {
          item.checked = true;
          equipmentSelect.push({deviceType: item.deviceType});
          this.EquipmentCheckNum += item.count;
        } else {
          item.checked = false;
        }
      });
    } else if (type) {
      // 点击某个设备类型，变化总数
      this.setEquipmentData.forEach((item) => {
        if (item.checked === true) {
          this.EquipmentCheckNum += item.count;
          equipmentSelect.push({equipmentType: item.equipmentType});
        }
      });
    }
    // 没有勾选的设施类型时，全选去勾选
    if (this.EquipmentCheckNum < equipmentNum) {
      this.isEquipmentTypeAllChecked = false;
    } else if (this.EquipmentCheckNum === equipmentNum) {
      this.isEquipmentTypeAllChecked = true;
    }
    // 读取缓存数据
    if (storeData && storeData.length > 0 && !type) {
      this.setEquipmentData.forEach(item => {
        storeData.forEach(storeItem => {
          if (item.equipmentType === storeItem.equipmentType) {
            item.checked = true;
            equipmentSelect.push({equipmentType: item.equipmentType});
          } else {
            item.checked = false;
            this.isEquipmentTypeAllChecked = false;
          }
        });
      });
    }
    if (!change) {
      this.changeType = 2;
      this.EquipmentDataList = equipmentSelect;
      this.checkShake();
    } else {
      this.equipmentData.emit(this.EquipmentDataList);
      this.$mapStoreService.equipmentTypeSelectedResults = this.EquipmentDataList;
    }
  }

  /**
   *  工单状态checkbox全选/反选
   */
  workOrderStatusChange(event, type?, change?): void {
    // const storeData = this.$mapStoreService.workOrderTypeSelectedResults;
    const storeData = null;
    this.workOrderStatusCheckNum = 0;
    let workOrderStatusNum = 0;
    // 计算设备总数
    this.setWorkOrderStatusData.forEach(item => {
      workOrderStatusNum += item.count;
    });
    const workOrderStatusSelect = [];
    if (!type && !storeData) {
      // 全选和去全选
      this.setWorkOrderStatusData.forEach(item => {
        if (event === true) {
          item.checked = true;
          workOrderStatusSelect.push(item.procType);
          this.workOrderStatusCheckNum += item.count;
        } else {
          item.checked = false;
        }
      });
    } else if (type) {
      // 点击某个设备类型，变化总数
      this.setWorkOrderStatusData.forEach((item) => {
        if (item.checked === true) {
          this.workOrderStatusCheckNum += item.count;
          workOrderStatusSelect.push(item.procType);
        }
      });
    }
    // 没有勾选的设施类型时，全选去勾选
    if (this.workOrderStatusCheckNum < workOrderStatusNum) {
      this.isWorkOrderStatusAllChecked = false;
    } else if (this.workOrderStatusCheckNum === workOrderStatusNum) {
      this.isWorkOrderStatusAllChecked = true;
    }
    // 读取缓存数据
    if (storeData && storeData.length > 0 && !type) {
      this.setWorkOrderStatusData.forEach(item => {
        storeData.forEach(storeItem => {
          if (item.procType === storeItem.procType) {
            item.checked = true;
            workOrderStatusSelect.push(item.procType);
          } else {
            item.checked = false;
            this.isWorkOrderStatusAllChecked = false;
          }
        });
      });
    }
    if (!change) {
      this.changeType = 3;
      this.workOrderStatusDataList = workOrderStatusSelect;
      this.checkShake();
    } else {
      this.workOrderStatusData.emit(this.workOrderStatusDataList);
      this.$mapStoreService.workOrderStatusSelectedResults = this.workOrderStatusDataList;
    }
  }

  /**
   * 工单选择结果
   */
  workOrderTypeChange(evt): void {
    this.workOrderTypeDataList = evt;
    this.changeType = 4;
    this.checkShake();
  }

  /**
   *  设施设备类型选择切换
   */
  tabClick(tabNum: string): void {
    if (tabNum === index_facility_equipment_type.facilityTypeTitle) {
      this.isExpandFacilityEquipment = true;
      this.facilitiesOrEquipment.emit(false);
    }
    if (tabNum === index_facility_equipment_type.equipmentTypeTitle) {
      this.isExpandFacilityEquipment = false;
      this.facilitiesOrEquipment.emit(true);
    }
  }

  /**
   * 防抖
   */
  checkShake = lodash.debounce(() => {
    switch (this.changeType) {
      case 1:
        this.facilitiesData.emit(this.FacilityDataList);
        this.$mapStoreService.facilityTypeSelectedResults = this.FacilityDataList;
        break;
      case 2:
        this.equipmentData.emit(this.EquipmentDataList);
        this.$mapStoreService.equipmentTypeSelectedResults = this.EquipmentDataList;
        break;
      case 3:
        this.workOrderStatusData.emit(this.workOrderStatusDataList);
        this.$mapStoreService.workOrderStatusSelectedResults = this.workOrderStatusDataList;
        break;
      case 4:
        this.workOrderTypeData.emit(this.workOrderTypeDataList);
        this.$mapStoreService.workOrderTypeSelectedResults = this.workOrderTypeDataList;
        break;
    }
  }, 2000, {leading: false, trailing: true});
}
