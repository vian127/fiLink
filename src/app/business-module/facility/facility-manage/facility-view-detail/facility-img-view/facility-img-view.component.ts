import {Component, Input, OnInit} from '@angular/core';
import {Result} from '../../../../../shared-module/entity/result';
import {FacilityService} from '../../../../../core-module/api-service/facility/facility-manage';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {ImageViewService} from '../../../../../shared-module/service/picture-view/image-view.service';

/**
 * 设施详情查看图片板块
 */
@Component({
  selector: 'app-facility-img-view',
  templateUrl: './facility-img-view.component.html',
  styleUrls: ['./facility-img-view.component.scss']
})
export class FacilityImgViewComponent implements OnInit {
  // 设施id
  @Input()
  public deviceId;
  // 设施图标信息
  public devicePicInfo: any[];
  // 设施语言包
  public language: FacilityLanguageInterface;

  constructor(private $facilityService: FacilityService,
              private $imageViewService: ImageViewService,
              private $i18n: NzI18nService) {
  }


  public ngOnInit(): void {
    this.language = this.$i18n.getLocaleData('facility');
    this.getDevicePic();
  }

  // 获取设施图标
  private getDevicePic(): void {
    const body = {
      objectId: this.deviceId,
      picNum: '3' // 查询3张
    };
    // todo 模型
    this.$facilityService.picRelationInfo(body).subscribe((result: Result) => {
      if (result.code === 0 && result.data && result.data.length > 0) {
        this.devicePicInfo = result.data;
        this.devicePicInfo.forEach((item: any) => {
          item.picSize = item.picSize ? (item.picSize / 1000).toFixed(2) + 'kb' : '';
        });
      }
    });
  }

  /**
   * 点击图片
   * param currentImage
   */
  public clickImage(currentImage): void {
    this.$imageViewService.showPictureView(this.devicePicInfo, currentImage);
  }
}
