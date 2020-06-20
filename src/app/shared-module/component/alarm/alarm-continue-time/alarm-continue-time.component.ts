import { Component, OnInit, Input } from '@angular/core';
import {AlarmLanguageInterface} from 'src/assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmContinueTimeConfig} from '../alarmSelectorConfig';

@Component({
  selector: 'app-alarm-continue-time',
  templateUrl: './alarm-continue-time.component.html',
  styleUrls: ['./alarm-continue-time.component.scss']
})
export class AlarmContinueTimeComponent implements OnInit {

  public language: AlarmLanguageInterface;
  _type: 'form' | 'table' = 'table';
  selectType: 'gt' | 'lt' | 'eq' = 'eq';
  alarmTime = {
    time: undefined,
    type: 'lt'
  };
  @Input()
  filterValue;
  _alarmContinueTimeConfig: AlarmContinueTimeConfig;
  @Input()
  set alarmContinueTimeConfig(alarmContinueTimeConfig: AlarmContinueTimeConfig) {
    if (alarmContinueTimeConfig) {
      this._alarmContinueTimeConfig = alarmContinueTimeConfig;
      this.setData(alarmContinueTimeConfig);
    }
  }

  // 输入框的值
  inputValue: number;
  constructor(
    public $nzI18n: NzI18nService,
  ) {
    this.language = this.$nzI18n.getLocaleData('alarm');
  }

  setData(event) {
    // 获取类型
    if (event.type) {
      this._type = event.type;
    }
    // 获取默认数据
    if (event.initialValue ) {
      this.alarmTime = event.initialValue;
      // this.checkAlarmNameBackups = event.initialValue;
      this.inputValue = event.initialValue['time'];
      this.selectType = event.initialValue['type'];
    }
    if (event.clear) {
      this.alarmTime = {
        time: undefined,
        type: 'lt'
     };
     this.inputValue = undefined;
     this.selectType = 'eq';
    }
  }

  keyupInput() {
    this.alarmTime = {
       time: Number(this.inputValue),
       type: this.selectType
    };
    if ( this._type === 'table' ) {
      this.filterValue['filterValue'] = this.alarmTime.time;
      this.filterValue['operator'] = this.selectType;
    }
    this._alarmContinueTimeConfig.checkAlarmContinueTime(this.alarmTime);
  }

  ngOnInit() {
  }

}
