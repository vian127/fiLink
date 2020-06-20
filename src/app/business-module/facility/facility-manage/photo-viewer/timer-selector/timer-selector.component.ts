import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TimerSelectorService} from './timer-selector.service';
import {DateType, TimeItem} from './timeSelector';
import {CommonUtil} from '../../../../../shared-module/util/common-util';

@Component({
  selector: 'app-timer-selector',
  templateUrl: './timer-selector.component.html',
  styleUrls: ['./timer-selector.component.scss'],
  providers: [TimerSelectorService]
})
export class TimerSelectorComponent implements OnInit, OnChanges {
  @Input() public timeList: Array<TimeItem>;
  @Output() public changeFilter = new EventEmitter();

  constructor(private $timerSelectorService: TimerSelectorService) {
  }

  // 默认值由组件外部传入
  @Input()
  public dateType: DateType = null;
  // 日期
  public date = null;
  @Input()
  public allowClear = false;

  public ngOnInit(): void {
  }

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
   * param item
   */
  public changeDateType(item): void {
    this.dateType = item;
    switch (this.dateType) {
      case DateType.DAY:
        this.date = this.$timerSelectorService.getDayRange();
        break;
      case DateType.WEEK:
        this.date = this.$timerSelectorService.getWeekRange();
        break;
      case DateType.MONTH:
        this.date = this.$timerSelectorService.getMonthRange();
        break;
      case DateType.YEAR:
        this.date = this.$timerSelectorService.getYearRange();
        break;
      case DateType.ONE_WEEK:
        this.date = this.$timerSelectorService.getDateRang(7);
        break;
      case DateType.ONE_MONTH:
        this.date = this.$timerSelectorService.getDateRang(30);
        break;
      case DateType.THREE_MONTH:
        this.date = this.$timerSelectorService.getDateRang(90);
        break;
      default:
        if (this.date.length === 2) {
          this.date = [CommonUtil.dateFmt('yyyy-MM-dd hh:mm:ss', this.date[0]), CommonUtil.dateFmt('yyyy-MM-dd 23:59:59', this.date[1])];
        }
    }
    let startTime, endTime;
    if (this.date.length === 2) {
      startTime = CommonUtil.sendBackEndTime(new Date(this.date[0]).getTime());
      endTime = CommonUtil.sendBackEndTime(new Date(this.date[1]).getTime());
    }
    this.changeFilter.emit({
      startTime: startTime,
      endTime: endTime
    });

  }
}
