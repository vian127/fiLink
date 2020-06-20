import {Component, Input, OnInit} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {Result} from '../../../../../../shared-module/entity/result';
import {FacilityService} from '../../../../../../core-module/api-service/facility/facility-manage';
import {ImageViewService} from '../../../../../../shared-module/service/picture-view/image-view.service';
@Component({
  selector: 'app-alarm-img-view',
  templateUrl: './alarm-img-view.component.html',
  styleUrls: ['./alarm-img-view.component.scss']
})
export class AlarmImgViewComponent implements OnInit {
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  // 设施图标信息
  public alarmPicInfo: any[];
  // @Input() deviceId;
  constructor(
    public $nzI18n: NzI18nService,
    private $facilityService: FacilityService,
    private $imageViewService: ImageViewService,
  ) {
    this.language = this.$nzI18n.getLocaleData('alarm');
  }
  ngOnInit() {
    this.getDevicePic();
  }
  // 获取图片
  private getDevicePic() {
    const body = {
      deviceId: 'ltWfjVGVihRyxznX3Wh',
      picNum: '3' // 查询3张
    };
    this.$facilityService.picRelationInfo(body).subscribe((result: Result) => {
      if (result.code === 0 && result.data && result.data.length > 0) {
        this.alarmPicInfo = result.data;
        this.alarmPicInfo.forEach((item: any) => {
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
    this.$imageViewService.showPictureView(this.alarmPicInfo, currentImage);
  }
}
