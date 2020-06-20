import {Component, Input} from '@angular/core';
import {AlarmService} from '../../../../core-module/api-service/alarm/alarm-manage/index';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {IndexTable} from '../../util/index.table';

/*
 * 设施告警组件
 */
@Component({
  selector: 'app-facility-alarm-panel',
  templateUrl: './facility-alarm-panel.component.html',
  styleUrls: ['./facility-alarm-panel.component.scss'],
})
export class FacilityAlarmPanelComponent extends IndexTable {
  // 设施id
  @Input() facilityId: string;

  public constructor(public $nzI18n: NzI18nService,
              private $router: Router,
              public $alarmService: AlarmService,
  ) {
    super($nzI18n);
  }

  /**
   * 跳转至当前告警列表，并过滤出该设施的告警
   */
  public goToCurrentAlarmList(): void {
    this.$router.navigate([`/business/alarm/current-alarm`], {queryParams: {deviceId: this.facilityId}}).then();
  }

  /**
   * 跳转至历史告警列表，并过滤出该设施的告警
   */
  public goToHistoryAlarmList(): void {
    this.$router.navigate([`/business/alarm/history-alarm`], {queryParams: {deviceId: this.facilityId}}).then();
  }
}
