import {Component, Input, OnInit} from '@angular/core';
import { FaultLanguageInterface } from '../../../../../../../assets/i18n/fault/fault-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {Result} from '../../../../../../shared-module/entity/result';
import {FacilityService} from '../../../../../../core-module/api-service/facility/facility-manage';
import {ImageViewService} from '../../../../../../shared-module/service/picture-view/image-view.service';
@Component({
  selector: 'app-trouble-img-view',
  templateUrl: './trouble-img-view.component.html',
  styleUrls: ['./trouble-img-view.component.scss']
})
export class TroubleImgViewComponent implements OnInit {
  @Input() deviceId: any;
  // 告警国际化引用
  public language: FaultLanguageInterface;
  // 设施图标信息
  public troublePicInfo: any[];
  constructor(
    public $nzI18n: NzI18nService,
    private $facilityService: FacilityService,
    private $imageViewService: ImageViewService,
  ) {
    this.language = this.$nzI18n.getLocaleData('fault');
  }

  ngOnInit() {
    this.getDevicePic();
  }
  // 获取图片
  private getDevicePic() {
    const body = {
      deviceId: this.deviceId,
      picNum: '3' // 查询3张
    };
    this.$facilityService.picRelationInfo(body).subscribe((result: Result) => {
      if (result.code === 0 && result.data && result.data.length > 0) {
        this.troublePicInfo = result.data;
        this.troublePicInfo.forEach((item: any) => {
          item.picSize = item.picSize ? (item.picSize / 1000).toFixed(2) + 'kb' : '';
        });
      }
    });
  }
  /**
   * 点击图片
   * param currentImage
   */
  clickImage(currentImage) {
    this.$imageViewService.showPictureView(this.troublePicInfo, currentImage);
  }
}
