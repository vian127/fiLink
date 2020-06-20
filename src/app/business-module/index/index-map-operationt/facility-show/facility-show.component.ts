import {Component, ElementRef, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {MapControl} from '../../util/map-control';
import {MapDeviceType} from '../../shared/model/map-bubble.model';
import {FacilityConditionModel} from '../../shared/model/facility-condition.model';
import {indexEquipmentComponentType, indexFacilityComponentType, indexFacilityIconStyle} from '../../shared/const/index-const';
import {IndexApiService} from '../../service/index/index-api.service';
import {MapCoverageService} from '../../service/map-coverage.service';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {ResultModel} from '../../../../core-module/model/result.model';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {ZoomSliderService} from '../../../../shared-module/service/map-service/b-map/zoom-slider.service';
import {MapConfig} from '../../../../shared-module/service/map-service/b-map/b-map.config';
import {BusinessFacilityService} from '../../../../shared-module/service/business-facility/business-facility.service';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';

/**
 * 设施展示
 */
@Component({
  selector: 'app-facility-show',
  templateUrl: './facility-show.component.html',
  styleUrls: ['./facility-show.component.scss']
})
export class FacilityShowComponent extends MapControl implements OnInit {
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 查询条件
  queryCondition: QueryCondition = new QueryCondition();
  // 设施设备卡是否显示
  public isShowFacilityEquipmentCard: boolean = false;
  // 显示设施选项
  public facilityRadioGroup: boolean = true;
  // 显示设备选项
  public equipmentRadioGroup: boolean = false;
  // 设施设备taps切换值
  public radioValue: string = 'A';
  // 设备单选按钮值
  public equipmentRadioValue: string = 'A';
  // 设施复选框按钮值
  public facilityCheckValue;
  // 设施类型缓存
  public localstorageFaciities;
  // 设施类型模型
  public FacilityCondition = new FacilityConditionModel;
  // 设备类型模型
  public equipmentCondition = new FacilityConditionModel;
  // 缩放级别滑动条
  public sliderValue: number;
  // 是否展示缩放级别滑动条
  public showSlider: boolean = false;
  // 设施类型数据
  public deviceTypeList: MapDeviceType[] = [];
  // 设备类型数据
  public equipmentTypeList;
  // 设施类型常量
  public indexDeviceType = indexFacilityComponentType;
  // 设施类型常量
  public indexEquipmentType = indexEquipmentComponentType;
  // 设施类型图标样式常量
  public indexDeviceIcon = indexFacilityIconStyle;


  constructor(public $nzI18n: NzI18nService,
              private el: ElementRef,
              private $zoomSliderService: ZoomSliderService,
              private $mapCoverageService: MapCoverageService,
              private $indexApiService: IndexApiService,
              private $businessFacilityService: BusinessFacilityService) {
    super($nzI18n);
  }

  public ngOnInit(): void {
    // 获取设施类型数据
    this.getDeviceDataList();
    // 获取设备类型数据
    this.getEquipmentDataList();
  }

  /**
   * 是否显示缩放条
   */
  public showZoom(): void {
    this.showSlider = !this.showSlider;
  }

  /**
   * 缩放条change
   * param evt
   */
  private sliderChange(evt: number): void {
    // @ts-ignore
    MapConfig.defaultZoom = evt;
  }

  /**
   * 获取设施类型数据
   */
  private getDeviceDataList() {
    this.FacilityCondition.areaIdList = [];
    this.$indexApiService.queryDeviceTypeListForPageSelection(this.FacilityCondition).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.deviceTypeList = result.data.map(item => {
          // 设施类型为智慧杆为默认选择
          if (item.deviceType === '002') {
            return {deviceType: item.deviceType, isModel: true};
          } else {
            return {deviceType: item.deviceType, isModel: false};
          }
        });
      }
    });
  }

  /**
   * 获取设备类型数据
   */
  private getEquipmentDataList() {
    this.equipmentCondition.areaCodeList = [];
    this.$indexApiService.queryEquipmentTypeListForPageSelection(this.equipmentCondition).subscribe((result: ResultModel<any>) => {
      console.log(result);
      if (result.code === ResultCodeEnum.success) {
        this.equipmentTypeList = result.data;
      }
    });
  }

  /**
   * 展示设施设备选择卡
   */
  public showFacilityAndEquipmentCard(): void {
    // this.facilityCheckValue = {
    //   multifunctionBillot: false, // 多功能杆
    //   distributionBox: false, // 配电箱
    //   cable: false, // 电缆
    //   optical: false, // 光纤
    //   pipeline: false, // 管道
    // };
    // const facilitiesJsonData = localStorage.getItem('facilitiesJsonData'); // 读取字符串数据
    // this.localstorageFaciities = JSON.parse(facilitiesJsonData);
    // this.localstorageFaciities.forEach(item => {
    //   switch (item.deviceType) {
    //     case '智慧多功能杆':
    //       this.facilityCheckValue.multifunctionBillot = true;
    //       break;
    //     case '配电箱':
    //       this.facilityCheckValue.distributionBox = true;
    //       break;
    //     case '电缆':
    //       this.facilityCheckValue.cable = true;
    //       break;
    //     case '光纤':
    //       this.facilityCheckValue.optical = true;
    //       break;
    //     case '管道':
    //       this.facilityCheckValue.pipeline = true;
    //       break;
    //   }
    // });
    this.isShowFacilityEquipmentCard = !this.isShowFacilityEquipmentCard;
  }

  /**
   * 显示设施部分
   */
  public showFacilityCard(): void {
    this.$mapCoverageService.showCoverage = 'facility';
    this.facilityRadioGroup = true;
    this.equipmentRadioGroup = false;
    this.$businessFacilityService.eventEmit.emit({mapShowType: 'facility'});
  }

  /**
   * 显示设备部分
   */
  public showEquipmentCard(): void {
    this.$mapCoverageService.showCoverage = 'equipment';
    this.facilityRadioGroup = false;
    this.equipmentRadioGroup = true;
    this.$businessFacilityService.eventEmit.emit({mapShowType: 'equipment'});

  }

  /**
   * 选中设备变化时的回调
   */
  public equipmentCheckChange(evt: string) {
    this.$businessFacilityService.eventEmit.emit({equipmentType: evt});
  }

  /**
   * 选中设施变化时的回调
   */
  public facilityCheckChange(evt: string[]) {
    this.$businessFacilityService.eventEmit.emit({deviceType: evt});
  }
}
