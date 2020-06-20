import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import * as _ from 'lodash';
import {TimerSelectorService} from '../../share/service/timer-selector.service';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {DateTypeEnum, TimeItem} from '../../share/enum/timer.enum';


/**
 * 告警时间选择
 * created by PoHe
 */
@Component({
  selector: 'app-alarm-time-selector',
  templateUrl: './alarm-timer.component.html',
  styleUrls: ['./alarm-timer.component.scss'],
})
export class AlarmTimerComponent implements OnInit, OnChanges {
  // 时间list
  @Input() public timeList: Array<TimeItem>;
  // 修改时间触发事件
  @Output() public changeFilter = new EventEmitter();

  constructor(private $timerSelectorService: TimerSelectorService) {
  }

  // 默认值由组件外部传入
  @Input()
  public dateType: DateTypeEnum = null;
  // 日期
  public date = null;
  @Input()
  public allowClear = false;

  ngOnInit() {
  }

  /**
   * 修改时间事件
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dateType && changes.dateType.currentValue) {
      // 把值传回给父组件需要在下一次变更中体现
      setTimeout(() => {
        this.changeDateType(changes.dateType.currentValue);
      });
    }
  }

  /**
   * 切换日期类型
   */
  public changeDateType(item): void {
    this.dateType = item;
    switch (this.dateType) {
      case DateTypeEnum.day:
        this.date = this.$timerSelectorService.getDayRange();
        break;
      case DateTypeEnum.week:
        this.date = this.$timerSelectorService.getWeekRange();
        break;
      case DateTypeEnum.month:
        this.date = this.$timerSelectorService.getMonthRange();
        break;
      case DateTypeEnum.year:
        this.date = this.$timerSelectorService.getYearRange();
        break;
      case DateTypeEnum.oneWeek:
        this.date = this.$timerSelectorService.getDateRang(7);
        break;
      case DateTypeEnum.oneMonth:
        this.date = this.$timerSelectorService.getDateRang(30);
        break;
      case DateTypeEnum.threeMonth:
        this.date = this.$timerSelectorService.getDateRang(90);
        break;
      default:
        // 既有起始时间又有结束时间
        if (this.date.length === 2) {
          this.date = [CommonUtil.dateFmt('yyyy-MM-dd hh:mm:ss', _.first(this.date)),
            CommonUtil.dateFmt('yyyy-MM-dd 23:59:59', _.last(this.date))];
        }
    }
    let startTime, endTime;
    if (this.date.length === 2) {
      startTime = CommonUtil.sendBackEndTime(new Date(_.first(this.date)).getTime());
      endTime = CommonUtil.sendBackEndTime(new Date(_.last(this.date)).getTime());
    }
    this.changeFilter.emit({
      startTime: startTime,
      endTime: endTime
    });

  }
}
