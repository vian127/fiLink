import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {FacilityUtilService} from '../../..';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ImageViewService} from '../../../../../shared-module/service/picture-view/image-view.service';
import {EquipmentApiService} from '../../../share/service/equipment/equipment-api.service';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../../../core-module/model/result-code.enum';
import {EquipmentAddInfoModel} from '../../../share/model/equipment-add-info.model';
import {FacilityDetailFormModel} from '../../../share/model/facility-detail-form.model';
import {noImg, realPicNumConst} from '../../../share/const/facility-common.const';
import {ThumbnailComponent} from '../../../common-component/thumbnail/thumbnail.component';
import {CommonUtil} from '../../../../../shared-module/util/common-util';

declare const MAP_TYPE;

/**
 * 设备管理基本信息
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-infrastructure',
  templateUrl: './equipment-infrastructure.component.html',
  styleUrls: ['./equipment-infrastructure.component.scss', '../equipment-view-detail.component.scss'],
})
export class EquipmentInfrastructureComponent implements OnInit, OnDestroy {
  // 传入设备id
  @Input()
  public equipmentId: string = '';
  //  地图组件
  @ViewChild('thumbnail') private thumbnail: ThumbnailComponent;
  // 设备管理国际化
  public language: FacilityLanguageInterface;
  // 无数据图标地址
  public equipmentPicUrl = noImg;
  // 设备详情
  public equipmentDetailInfo: EquipmentAddInfoModel = new EquipmentAddInfoModel();
  // 更新时间
  public updateTime: string = '';
  // 设施信息
  public deviceInfo: FacilityDetailFormModel = new FacilityDetailFormModel;
  // 地图类型
  public mapType: string;
  // 实景图地址
  private equipmentPicList = [];

  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $equipmentApiService: EquipmentApiService,
    private $imageViewService: ImageViewService,
    private $router: Router,
    private $modalService: FiLinkModalService,
  ) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.mapType = MAP_TYPE;
    //  查询实景图列表
    this.getEquipmentPic();
    // 查询设备基础信息
    this.getEquipmentDetail();
  }

  /**
   * 销毁组件
   */
  public ngOnDestroy(): void {
    this.thumbnail = null;
  }

  /**
   *  点击图片事件
   */
  public onClickImage(): void {
    if (!_.isEmpty(this.equipmentPicList)) {
      this.$imageViewService.showPictureView(this.equipmentPicList);
    }
  }

  /**
   *  点击tab 事件
   */
  public onTabChange(event): void {
    // 缩略图tab序号为2，点击时初始化地图
    if (event.index === 2) {
      this.thumbnail.initMap();
    }
  }

  /**
   * 设置设备状态图标样式
   */
  public getStatusIcon(equipmentStatus: string): string {
    // 设置状态样式
    const iconStyle = FacilityUtilService.getFacilityDeviceStatusClassName(equipmentStatus);
    let statusIcon = 'icon-fiLink-l iconfont ';
    if (iconStyle) {
      statusIcon = `${statusIcon} ${iconStyle.iconClass} ${iconStyle.colorClass}`;
    }
    return statusIcon;
  }

  /**
   * 获取设备类型图标
   */
  public getEquipmentTypeIcon(equipmentType: string): string {
    return equipmentType ? CommonUtil.getEquipmentIconClassName(equipmentType) : '';
  }

  /**
   *  查询设备的实景图
   */
  private getEquipmentPic() {
    const queryBody = {
      objectId: this.equipmentId,
      picNum: realPicNumConst // 查询1张
    };
    this.$equipmentApiService.getPicDetailForNew(queryBody).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.equipmentPicList = result.data;
        if (!_.isEmpty(this.equipmentPicList)) {
          this.equipmentPicUrl = _.first(this.equipmentPicList).picUrlBase;
        }
      }
    });
  }

  /**
   * 查询设备详细信息
   */
  private getEquipmentDetail(): void {
    const queryBody = {equipmentId: this.equipmentId};
    this.$equipmentApiService.getEquipmentById(queryBody).subscribe(
      (result: ResultModel<EquipmentAddInfoModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          // 因为后台返回的是一个数组类型的数据，故此处获取第一个元素
          this.equipmentDetailInfo = _.first(result.data);
          if (this.equipmentDetailInfo) {
            this.deviceInfo = this.equipmentDetailInfo.deviceInfo;
            this.updateTime = String(new Date(this.equipmentDetailInfo.updateTime).getTime());
          }
        } else {
          this.$modalService.error(result.msg);
        }
      });
  }
}
