import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {DeviceTypeCode} from '../../../facility/share/const/facility.config';
import {CONST_NUMBER} from '../../../../shared-module/const/work-order';

/**
 * 关联告警显示组件
 */
@Component({
  selector: 'app-ref-alarm',
  templateUrl: './ref-alarm.component.html',
  styleUrls: ['./ref-alarm.component.scss']
})
export class RefAlarmComponent implements OnInit, OnChanges {
  @Input() refAlarmMessage;
  language;
  public deviceType;
  public constNumber;
  constructor(private $Nz18n: NzI18nService) {
  }

  ngOnInit() {
    this.deviceType = DeviceTypeCode;
    this.constNumber = CONST_NUMBER;
    this.language = this.$Nz18n.getLocale();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.refAlarmMessage) {
    }
  }

}
