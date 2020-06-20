import { Component, OnInit } from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
@Component({
  selector: 'app-alarm-diagnose',
  templateUrl: './diagnose-details.component.html',
  styleUrls: ['./diagnose-details.component.scss']
})
export class DiagnoseDetailsComponent implements OnInit {
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  public pageType: string = 'alarm';
  public areaId: string;
  public alarmId: string;
  public alarmCode: string;
  constructor(
    public $nzI18n: NzI18nService,
    private $active: ActivatedRoute,
  ) {
    this.language = this.$nzI18n.getLocaleData('alarm');
  }

  ngOnInit() {
    this.$active.queryParams.subscribe(params => {
      this.pageType = params.type;
      this.areaId = params.areaId;
      this.alarmId = params.alarmId;
      this.alarmCode = params.alarmCode;
    });
  }

}
