import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DateHelperService, NzI18nService} from 'ng-zorro-antd';
import {FacilityService} from '../../../../../core-module/api-service/facility/facility-manage';
import {Result} from '../../../../../shared-module/entity/result';
import {FacilityInfo} from '../../../../../core-module/model/facility/facility';
import {getDeviceStatus, getDeviceType} from '../../../share/const/facility.config';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ImageViewService} from '../../../../../shared-module/service/picture-view/image-view.service';
import {ThumbnailComponent} from '../../../common-component/thumbnail/thumbnail.component';
import {PictureInfo} from '../../photo-viewer/photo-viewer-entity';
import {ResultCodeEnum} from '../../../../../core-module/model/result-code.enum';
import {ResultModel} from '../../../../../core-module/model/result.model';

declare const MAP_TYPE;

/**
 * 设施详情基础信息组件
 */
@Component({
  selector: 'app-infrastructure-details',
  templateUrl: './infrastructure-details.component.html',
  styleUrls: ['./infrastructure-details.component.scss']
})
export class InfrastructureDetailsComponent implements OnInit, OnDestroy {
  // 设施id
  @Input()
  public deviceId: string;
  // 设施类型
  @Input()
  public deviceType: string;
  // 设施信息
  public facilityInfo: FacilityInfo = new FacilityInfo();
  // 无数据图标地址
  public devicePicUrl = 'assets/img/facility/no_img_6.svg';
  // 详情展示一期或二期
  public deviceDetailType: boolean;
  // 地图类型
  private mapType: string;
  // 设施语言包
  public language: FacilityLanguageInterface;
  public baseInfo: { point?, positionBase: string, deviceType: string, deviceStatus: string };
  // 轮询实例
  private loopTimer;
  // 设施图标列表
  private devicePicList: Array<PictureInfo>;
  @ViewChild('thumbnail') public thumbnail: ThumbnailComponent;

  constructor(private $facilityService: FacilityService,
              private $modalService: FiLinkModalService,
              private $nzI18n: NzI18nService,
              private $dateHelper: DateHelperService,
              private $imageViewService: ImageViewService) {
  }

  public ngOnInit(): void {
    this.mapType = MAP_TYPE;
    this.language = this.$nzI18n.getLocaleData('facility');
    this.getFacilityInfo();
    this.getDevicePic();
    this.deviceDetailType = ['001', '030', '060', '090', '210'].includes(this.deviceType);
  }

  /**
   * 获取设备信息
   */
  public getFacilityInfo(): void {
    this.$facilityService.queryDeviceById({deviceId: this.deviceId}).subscribe((result: ResultModel<FacilityInfo>) => {
      if (result.code === ResultCodeEnum.success) {
        this.facilityInfo = result.data.pop();
        // 初始化缩略图基本信息
        this.baseInfo = {
          positionBase: this.facilityInfo.positionBase,
          deviceType: this.facilityInfo.deviceType,
          deviceStatus: this.facilityInfo.deviceStatus,
        };
        // 翻译设施类型
        if (this.facilityInfo.deviceType) {
          this.facilityInfo.deviceType = getDeviceType(this.$nzI18n, this.facilityInfo.deviceType);
        }
        // 翻译设施状态
        if (this.facilityInfo.deviceStatus) {
          this.facilityInfo.deviceStatusZh = getDeviceStatus(this.$nzI18n, this.facilityInfo.deviceStatus);
        }
      } else if (result.code === 130204) {
        this.$modalService.error(result.msg);
        window.history.go(-1);
      }
      // 开启定时器轮询
      if (!this.loopTimer) {
        this.loopTimer = window.setInterval(() => {
          this.getFacilityInfo();
        }, 60000);
      }
    });
  }

  /**
   * 初化地图
   */
  public selectChange(event): void {
    if (event.index === 2) {
      this.thumbnail.initMap();
    }
  }

  /**
   * 点击图标
   */
  public clickImage(): void {
    if (this.devicePicList && this.devicePicList.length > 0) {
      this.$imageViewService.showPictureView(this.devicePicList);
    }
  }

  /**
   * 组件销毁清除定时器
   */
  public ngOnDestroy(): void {
    if (this.loopTimer) {
      window.clearInterval(this.loopTimer);
    }
  }

  /**
   * 获取设施图标
   */
  private getDevicePic(): void {
    const body = {
      objectId: this.deviceId,
      picNum: '1' // 查询1张
    };
    this.$facilityService.picRelationInfo(body).subscribe((result: Result) => {
      if (result.code === 0 && result.data && result.data.length > 0) {
        this.devicePicList = result.data;
        this.devicePicUrl = result.data[0].picUrlBase;
      }
    });
  }
}

