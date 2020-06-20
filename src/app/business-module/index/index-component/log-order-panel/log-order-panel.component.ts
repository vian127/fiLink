import {Component, Input} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {DeviceDetailCode} from '../../../facility/share/const/facility.config';
import {IndexTable} from '../../util/index.table';

/**
 * 日志和工单组件
 */
@Component({
  selector: 'app-log-order-panel',
  templateUrl: './log-order-panel.component.html',
  styleUrls: ['./log-order-panel.component.scss']
})
export class LogOrderPanelComponent extends IndexTable {
  // 设施id
  @Input() facilityId: string;
  // 设施设备类型id
  @Input() facilityType: string;
  // 权限code
  @Input() facilityPowerCode = [];

  constructor(
    public $nzI18n: NzI18nService,
    private $router: Router,
  ) {
    super($nzI18n);
  }

  /**
   * 跳转
   */
  navigatorTo(url) {
    this.$router.navigate([url], {queryParams: {id: this.facilityId}}).then();
  }

  /**
   * 跳转至设施日志列表
   */
  goToFacilityLogList() {
    this.$router.navigate([`/business/facility/facility-log`], {queryParams: {id: this.facilityId}}).then();
  }

}
