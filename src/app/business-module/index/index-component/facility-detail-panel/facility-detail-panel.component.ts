import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {FacilityService} from '../../../../core-module/api-service/facility/facility-manage/index';
import {ImageViewService} from '../../../../shared-module/service/picture-view/image-view.service';
import {SmartService} from '../../../../core-module/api-service/facility/smart/smart.service';
import {OdnDeviceService} from '../../../../core-module/api-service/statistical/odn-device/index';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {DateHelperService, NzI18nService, NzModalService} from 'ng-zorro-antd';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {LockService} from '../../../../core-module/api-service/lock/index';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {MapService} from '../../../../core-module/api-service/index/map/index';
import {DateFormatString} from '../../../../shared-module/entity/dateFormatString';
import {FacilityName} from '../../util/facility-name';
import {DEVICE_CODE, FACILITY_STATUS_COLOR} from '../../../../shared-module/const/facility';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {DeviceDetailCode} from '../../../facility/share/const/facility.config';
import {index_install_num, index_layered_type, index_num} from '../../shared/const/index-const';
import {IndexApiService} from '../../service/index/index-api.service';
import {ResultModel} from '../../../../core-module/model/result.model';
import {FacilitiesDetailsModel} from '../../shared/model/facilities-details.model';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {MapCoverageService} from '../../service/map-coverage.service';
import {IndexFacilityService} from '../../../../core-module/api-service/index/facility';


/**
 * 设施详情组件
 */
@Component({
  selector: 'app-facility-detail-panel',
  templateUrl: './facility-detail-panel.component.html',
  styleUrls: ['./facility-detail-panel.component.scss']
})
export class FacilityDetailPanelComponent extends FacilityName implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  // 设施id
  @Input() facilityId: string;
  // 设施类型
  @Input() facilityType: string;
  // 是否显示实景图信息
  @Input() isShowBusinessPicture: boolean;
  // 权限code
  @Input() facilityPowerCode = [];
  // 设施详情回传
  @Output() facilityDetailEvent = new EventEmitter();
  // 权限码
  public powerCode = DeviceDetailCode;
  // 设施信息
  public facilityInfo: FacilitiesDetailsModel;
  // 主控信息列表
  public monitorInfoList: Array<[]> = [];
  // 版本号
  public serialNum;
  // 是否收藏设施
  public isCollected = false;
  // 心跳时间
  public heartbeatTime;
  // 是否显示下拉框   有主控信息时显示下拉框
  public isShowSelect = false;
  // 监控信息下拉
  public controlOption = [];
  // 选中的设备id
  public selectedControlId;
  // 选中的设备类型
  public selectedType;
  // 主控类型
  public hostType = '1';
  // 供电方式
  public sourceType;
  // 国际化
  public language: FacilityLanguageInterface;
  // 轮询
  public timer;
  // 设施图片列表
  public devicePicList = [];
  // 设施图片url
  public devicePicUrl = '';
  // 当前地图分层类型
  public indexType = this.$mapCoverageService.showCoverage;
  // 设施设备图层类型
  public coverageType;
  // 安装数量和空闲数量模拟数据集
  public facilityInfoList = [];
  // 安装数量/空余数量tab选择状态
  public isHandleInstallNum: boolean;
  // 安装数量/空余数量枚举
  public installNumEnum = index_install_num;

  constructor(public $nzI18n: NzI18nService,
              private $facilityService: FacilityService,
              private $lockService: LockService,
              private $router: Router,
              private $mapService: MapService,
              private $smartService: SmartService,
              private $modal: NzModalService,
              private $message: FiLinkModalService,
              private $dateHelper: DateHelperService,
              private $odnDeviceService: OdnDeviceService,
              private $mapStoreService: MapStoreService,
              private $imageViewService: ImageViewService,
              private $indexApiService: IndexApiService,
              private $indexFacilityService: IndexFacilityService,
              private $mapCoverageService: MapCoverageService
  ) {
    super($nzI18n);
  }

  /**
   * 页面初始化加载
   */
  public ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData('facility');
    // 设备信息tab
    this.isHandleInstallNum = true;
    // 页面初始化
    this.getAllData(this);
  }

  /**
   * 页面加载完成后
   */
  public ngAfterViewInit(): void {
    // 详情接口轮询
    const that = this;
    this.timer = setInterval(function () {
      that.getAllData(that);
    }, 20000);
  }

  /**
   * changes监听
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.facilityId && changes.facilityId.previousValue) {
      // 当设施id发生变化的时候，关闭定时器
      if (this.timer) {
        clearInterval(this.timer);
      }
      // 如果设施id为空
      if (!this.facilityId) {
        return;
      }
      this.getFacilityDetail(this.facilityId);
      this.getEquipmentListByDeviceId(this.facilityId);
      this.getDevicePic(this.facilityId);
      this.getHeartbeatTime();
    }
  }

  /**
   * 销毁指令
   */
  public ngOnDestroy(): void {
    // 清除定时
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  /**
   * 测试指令
   * param evt
   */
  public testInstruction(code, url): void {
    console.log(code, url);
  }

  /**
   * 更新收藏状态
   * param type 推送类型
   */
  public updateCollectionStatus(type): void {
    this.isCollected = type === 'focusDevice';
  }

  /**
   * 获取详情
   * param id
   */
  public getFacilityDetail(id): void {
    if (this.indexType === 'facility') {
      const body = {deviceId: id};
      this.$indexApiService.queryDeviceById(body).subscribe((result: ResultModel<FacilitiesDetailsModel>) => {
        if (result.code === ResultCodeEnum.success) {
          const _facilityInfo = result.data;
          _facilityInfo['facilityName'] = _facilityInfo['deviceName'];
          _facilityInfo['facilityTypeName'] = this.getFacilityTypeName(_facilityInfo['deviceType']);
          _facilityInfo['text'] = this.getFacilityStatusName(_facilityInfo['deviceStatus']);
          _facilityInfo['bgColor'] = FACILITY_STATUS_COLOR[_facilityInfo['deviceStatus']];
          _facilityInfo['facilityTypeClassName'] = CommonUtil.getFacilityIconClassName(_facilityInfo.deviceType);
          // 0 未收藏 1 已收藏
          this.isCollected = ('' + _facilityInfo['isCollecting']) !== '0';
          this.facilityInfo = _facilityInfo;
        } else {
          this.$message.error(result.msg);
          clearInterval(this.timer);
          this.$mapStoreService.deleteMarker(this.facilityId);
          this.facilityDetailEvent.emit({type: 'refresh', data: ''});
        }
      });
    } else {
      const body = {equipmentId: id};
      this.$indexApiService.queryDeviceById(body).subscribe((result: ResultModel<FacilitiesDetailsModel>) => {
        if (result.code === ResultCodeEnum.success) {
          const _facilityInfo = result.data;
          _facilityInfo['facilityName'] = _facilityInfo['equipmentName'];
          _facilityInfo['facilityTypeName'] = this.getFacilityTypeName(_facilityInfo['equipmentType']);
          _facilityInfo['text'] = this.getFacilityStatusName(_facilityInfo['equipmentStatus']);
          _facilityInfo['bgColor'] = FACILITY_STATUS_COLOR[_facilityInfo['equipmentStatus']];
          _facilityInfo['facilityTypeClassName'] = CommonUtil.getFacilityIconClassName(_facilityInfo.equipmentType);
          // 0 未收藏 1 已收藏
          this.isCollected = ('' + _facilityInfo['isCollecting']) !== '0';
          this.facilityInfo = _facilityInfo;

          // 查询监控状态数据
          this.getPerformData(id, this.facilityInfo.equipmentCode);
        } else {
          this.$message.error(result.msg);
          clearInterval(this.timer);
          this.$mapStoreService.deleteMarker(this.facilityId);
          this.facilityDetailEvent.emit({type: 'refresh', data: ''});
        }
      });
    }
  }


  /**
   * 获取监控信息监控状态
   * param id
   */
  public getEquipmentListByDeviceId(id) {
    // 查询监控信息
    if (this.indexType === 'facility') {
      const body = {deviceId: id};
      this.$indexApiService.queryEquipmentListByDeviceId(body).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {

          // 假数据
          // const result = {
          //   data: this.deviceData
          // };

          // 显示下拉
          this.isShowSelect = true;
          // 监控信息下拉框数据
          this.controlOption = result.data;
          // 默认选择第一条设备监控信息
          if (this.controlOption[0]) {
            this.selectedControlId = this.controlOption[0]['equipmentId'];
            this.selectedType = this.controlOption[0]['equipmentType'];
            this.getPerformData(this.selectedControlId, this.selectedType);
          }
          const _facilityInfoList = [];
          // 设备信息数据处理
          result.data.forEach(item => {
            _facilityInfoList.push({
              facilityName: CommonUtil.getEquipmentIconClassName(item.equipmentType),
              value: index_num.numZero
            });
          });
          // 数组中对象去重
          const list = this.filterRepeat(_facilityInfoList, 'facilityName');
          // 记录重复设备信息
          _facilityInfoList.forEach((item, index) => {
            list.forEach(_item => {
              if (item.facilityName === _item.facilityName) {
                _item.value++;
              }
            });
          });
          this.facilityInfoList = list;
        }
      });
    }
  }

  /**
   * 获取监控信息监控状态
   * param id
   * param type
   */
  public getPerformData(id, type?): void {

    // 假数据
    // this.monitorInfoList = this.equipmentData;

    const body = {
      equipmentId: id,
      equipmentType: type
    };
    // this.$indexApiService.queryPerformData(body).subscribe((result: ResultModel<any>) => {
    //   if (result.code === ResultCodeEnum.success) {
    //     this.monitorInfoList = result.data.performanceList;
    //   }
    // });

  }

  /**
   * 获取设施图片
   * param id
   */
  public getDevicePic(id): void {
    const body = {
      objectId: id,
      objectType: this.coverageType,
      resource: '3',
    };
    // if (this.facilityPowerCode.includes(this.powerCode.infrastructureDetails)) {
    this.$indexApiService.getPicDetail(body).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success && result.data) {
        this.devicePicList = result.data.picUrlBase;
      } else {
        this.devicePicUrl = 'assets/img/facility/no_img_6.svg';
      }
    });
    // }
  }

  /**
   * 收藏或取消收藏
   */
  public collectionChange(): void {
    if (this.isCollected) {
      this.unCollect();
    } else {
      this.collect();
    }
  }

  /**
   * 取消关注
   */
  public unCollect(): void {
    const body = {
      id: this.facilityId,
      type: this.coverageType
    };
    this.$indexApiService.delCollectingById(body).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.indexLanguage.unCollectSuccess);
        this.isCollected = false;
        this.facilityDetailEvent.emit({type: 'unFollowDevice', data: this.setFacilityInfo()});
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 添加关注
   */
  public collect(): void {
    const body = {
      id: this.facilityId,
      type: this.coverageType
    };
    this.$indexApiService.addCollectingById(body).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.indexLanguage.collectSuccess);
        this.isCollected = true;
        this.facilityDetailEvent.emit({type: 'focusDevice', data: this.setFacilityInfo()});
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
    });
  }


  /**
   * 对象根据某一属性去重去重
   */
  public filterRepeat(arr, props) {
    return arr.reduce(function (prev, element) {
      if (!prev.find(el => el[props] === element[props])) {
        prev.push(element);
      }
      return prev;
    }, []);
  }

  /**
   * 设备设施排序
   */
  public filterTypeSort(arr): void {
    // 权重排序标准
    const arrSort = [DEVICE_CODE.ateway, DEVICE_CODE.screen, DEVICE_CODE.camera, DEVICE_CODE.lamp, DEVICE_CODE.centralized];
    // 循环添加权重值
    arr.forEach(item => {
      Object.keys(DEVICE_CODE).map(key => {
        if (item.code === key) {
          item.number = DEVICE_CODE[key];
        }
      });
    });
    // 排序
    arr = arr.sort((prev, next) => {
      return arrSort.indexOf(prev.number) - arrSort.indexOf(next.number);
    });
    // 删除权重值
    arr.forEach(item => {
      delete item.number;
    });
    return arr;
  }


  /**
   * 切换监控显示
   */
  public changeControl(event): void {
    let type = '';
    this.controlOption.forEach(item => {
      if (item.equipmentId === event) {
        type = item.equipmentType;
      }
    });
    this.getPerformData(event, type);
  }

  /**
   * 跳转至设施详情页面
   */
  public goToFacilityDetailById(): void {
    this.$router.navigate([`/business/facility/facility-detail-view`],
      {queryParams: {id: this.facilityId, deviceType: this.facilityInfo['deviceType']}}).then();
  }

  /**
   * 跳转至设备详情页面
   */
  public goToDeviceDetailById(): void {
    // this.$router.navigate([`/business/facility/facility-detail-view`],
    //   {queryParams: {id: this.facilityId, deviceType: this.facilityInfo['deviceType']}}).then();
  }


  public setFacilityInfo() {
    return {
      deviceId: this.facilityInfo['deviceId'],
      deviceType: this.facilityInfo['deviceType'],
      deviceName: this.facilityInfo['deviceName'],
      deviceStatus: this.facilityInfo['deviceStatus'],
      deviceCode: this.facilityInfo['deviceCode'],
      address: this.facilityInfo['address'],
      positionBase: this.facilityInfo['positionBase'],
      areaId: this.facilityInfo['areaId'],
      areaName: this.facilityInfo['areaName']
    };
  }

  /**
   * 获取心跳时间
   */
  public getHeartbeatTime(): void {
    if (this.facilityPowerCode.includes(this.powerCode.intelligentEntranceGuard)) {
      this.$facilityService.queryHeartbeatTime(this.facilityId).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          if (result.data && result.data.recentLogTime) {
            this.heartbeatTime = this.$dateHelper.format(new Date(result.data.recentLogTime), DateFormatString.DATE_FORMAT_STRING);
          } else {
            this.heartbeatTime = 'NA';
          }
        }
      });
    }
  }


  /**
   * 切换设备信息tab页
   */
  public tabClick(tabNum): void {
    if (tabNum === index_install_num.installNum) {
      this.isHandleInstallNum = true;
    }
    if (tabNum === index_install_num.freeNum) {
      this.isHandleInstallNum = false;
    }
  }

  /**
   *
   * 轮询设施详情
   */
  private getAllData(that): void {
    // 判断当前地图图层
    if (this.indexType === 'facility') {
      this.coverageType = index_layered_type.facility;
    } else {
      this.coverageType = index_layered_type.device;
    }
    // 如果设施id为空
    if (!that.facilityId) {
      // 当设施id发生变化的时候，关闭定时器
      if (that.timer) {
        clearInterval(that.timer);
      }
      return;
    }
    that.getFacilityDetail(that.facilityId);
    that.getEquipmentListByDeviceId(that.facilityId);
    that.getDevicePic(that.facilityId);
    that.getHeartbeatTime();
  }


}
