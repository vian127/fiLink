import {Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {EquipmentApiService} from '../../../share/service/equipment/equipment-api.service';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {ResultModel} from '../../../../../core-module/model/result.model';

/**
 * 设备上报状态信息
 * created by PoHe
 */
@Component({
  selector: 'app-report-status-information',
  templateUrl: './report-status-information.component.html',
  styleUrls: ['./report-status-information.component.scss',
    '../equipment-view-detail.component.scss']
})
export class ReportStatusInformationComponent implements OnInit {
  // 传入设备id
  @Input()
  public equipmentId: string;
  // 传入设备型号
  @Input()
  public equipmentType: string;
  // 设备管理国际化
  public language: FacilityLanguageInterface;
  // 性能结果集
  public performanceList = [];

  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $equipmentApiService: EquipmentApiService
  ) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.queryPerformData();
  }

  /**
   * 查询设备的传感值
   */
  private queryPerformData(): void {
    this.$equipmentApiService.queryPerformData({
      equipmentType: this.equipmentType,
      equipmentId: this.equipmentId
    }).subscribe((result: ResultModel<any>) => {
        this.performanceList = result.data.performanceList || [];
    });
  }
}
