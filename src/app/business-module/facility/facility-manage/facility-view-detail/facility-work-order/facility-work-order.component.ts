import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {WorkOrderLanguageInterface} from '../../../../../../assets/i18n/work-order/work-order.language.interface';
import workOrder from '../../../../../../assets/i18n/work-order/work-order.zh_CN';
import {InspectionTableComponent} from '../../../../index/index-component/log-order-panel/inspection-table/inspection-table.component';

@Component({
  selector: 'app-facility-work-order',
  templateUrl: './facility-work-order.component.html',
  styleUrls: ['./facility-work-order.component.scss']
})
export class FacilityWorkOrderComponent implements OnInit, AfterViewInit {
  // 设施id
  @Input()
  public deviceId;
  // 是否有主控
  @Input()
  public hasControl: boolean;
  // 巡检工单列表实例
  @ViewChild('inspectionTable') public inspectionTable: InspectionTableComponent;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 工单语言包
  public workOrderLanguage: WorkOrderLanguageInterface;
  public tableFieldWidth = {
    title: 100,
    statusName: 100,
    ecTime: 150,
    accountabilityDeptName: 80,
    result: 100
  };

  constructor(private $router: Router, private $nzI18n: NzI18nService) {
  }

  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.workOrderLanguage = this.$nzI18n.getLocaleData('workOrder');
  }

  public ngAfterViewInit(): void {
    // 设置巡检工单的table适配所有宽度
    setTimeout(() => {
      this.inspectionTable.setTableConfigIsDraggable(this.hasControl);
    });
  }

  /**
   * 导航跳转
   * param url
   */
  public navigatorTo(url): void {
    this.$router.navigate([url], {queryParams: {deviceId: this.deviceId}}).then();
  }
}
