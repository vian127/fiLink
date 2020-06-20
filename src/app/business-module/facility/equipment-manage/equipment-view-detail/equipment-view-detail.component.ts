import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {EquipmentApiService} from '../../share/service/equipment/equipment-api.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {EquipmentDetailCardEnum} from '../../share/enum/equipment.enum';

/**
 * 设备详细信息
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-view-detail',
  templateUrl: './equipment-view-detail.component.html',
  styleUrls: ['./equipment-view-detail.component.scss']
})
export class EquipmentViewDetailComponent implements OnInit {

  // 设备管理国际化实例
  public language: FacilityLanguageInterface;
  // 设备id
  public equipmentId: string = '';
  // 设备类型
  public equipmentType: string = '';
  // 设备型号
  public equipmentModel: string = '';
  // 设备详情的code
  public equipmentDetailCodes: string[] = [];
  // 设备详情卡片枚举
  public equipmentDetailCardEnum = EquipmentDetailCardEnum;


  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $equipmentApiService: EquipmentApiService,
    private $active: ActivatedRoute,
  ) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    // 获取参数
    this.$active.queryParams.subscribe(params => {
      this.equipmentId = params.equipmentId;
      this.equipmentType = params.equipmentType;
      this.equipmentModel = params.equipmentModel;
    });
    // 查询设备型号的详情code便于根据code显示卡片
    this.getDetailCode();
  }

  /**
   * 根据设备型号查询动态的卡片信息
   */
  private getDetailCode(): void {
    this.$equipmentApiService.getDetailCode({equipmentModel: this.equipmentModel}).subscribe(
      (res: ResultModel<any>) => {
        if (res.code === ResultCodeEnum.success) {
          this.equipmentDetailCodes = res.data.map(item => {
            return item.id;
          }) || [];
        }
      });
  }
}
