import {Component, Input, OnInit} from '@angular/core';
import { FaultLanguageInterface } from '../../../../../../../assets/i18n/fault/fault-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {ChartUtil} from '../../../../../../shared-module/util/chart-util';
import {ClearBarrierService} from '../../../../../../core-module/api-service/work-order/clear-barrier';
import {WorkOrderConfig} from '../../../../../work-order/work-order.config';
@Component({
  selector: 'app-fault-experience',
  templateUrl: './fault-experience.component.html',
  styleUrls: ['./fault-experience.component.scss']
})
export class FaultExperienceComponent implements OnInit {
  @Input() alarmCode: string;
  // 告警国际化引用
  public language: FaultLanguageInterface;
  public updateTime: any = new Date().getTime();
  workOrderConfig = new WorkOrderConfig(this.$nzI18n);
  constructor(
    public $nzI18n: NzI18nService,
  ) {
    this.language = this.$nzI18n.getLocaleData('fault');
  }

  ngOnInit() {}
}
