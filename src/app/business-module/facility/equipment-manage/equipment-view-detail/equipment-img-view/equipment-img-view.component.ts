import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {ImageViewService} from '../../../../../shared-module/service/picture-view/image-view.service';
import {EquipmentApiService} from '../../../share/service/equipment/equipment-api.service';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../../../core-module/model/result-code.enum';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {binarySystemConst, fixedLengthConst, pictureNumConst} from '../../../share/const/facility-common.const';

/**
 *  设备图片组件
 *  created by PoHe
 */
@Component({
  selector: 'app-equipment-img-view',
  templateUrl: './equipment-img-view.component.html',
  styleUrls: ['./equipment-img-view.component.scss']
})
export class EquipmentImgViewComponent implements OnInit {

  // 入参设备id
  @Input()
  public equipmentId: string = '';
  // 设备国际化
  public language: FacilityLanguageInterface;
  // 设备信息
  public equipmentPicInfo: any[];

  /**
   * 构造器
   */
  constructor(private $nzI18n: NzI18nService,
              private $router: Router,
              private $equipmentApiService: EquipmentApiService,
              private $imageService: ImageViewService) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.getPicDetailForNew();
  }


  /**
   *  点击照片事件
   */
  public onClickImage(item): void {
    this.$imageService.showPictureView(this.equipmentPicInfo, item);
  }

  /**
   * 查询更多图片
   */
  public onClickShowMore(): void {
    this.$router.navigate(['business/facility/photo-viewer'],
      {queryParams: {id: this.equipmentId}}).then();
  }

  /**s
   * 查询三张最近的图片
   */
  private getPicDetailForNew(): void {
    const tempBody = {picNum: pictureNumConst, objectId: this.equipmentId};
    this.$equipmentApiService.getPicDetailForNew(tempBody).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.equipmentPicInfo = result.data || [];
        this.equipmentPicInfo.forEach((item) => {
          item.picSize = item.picSize ? `${(item.picSize / binarySystemConst).toFixed(fixedLengthConst)}kb` : '';
        });
      }
    });
  }
}
