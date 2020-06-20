import {Injectable} from '@angular/core';
import {CommonUtil} from '../../../../shared-module/util/common-util';


@Injectable()
export class TimerSelectorService {
  currentTime;
  constructor() {
    this.currentTime = CommonUtil.getCurrentTime();
  }

  /**
   * 获取本日日期范围
   */
  getDayRange() {
    const now = this.currentTime;
    const date = [];
    date.push(CommonUtil.dateFmt('yyyy/MM/dd 00:00:00', now));
    date.push(CommonUtil.dateFmt('yyyy/MM/dd 23:59:59', now));
    return date;
  }

  /**
   * 获取本周日期范围
   */
  getWeekRange() {
    const now = this.currentTime;
    const w = now.getDay();
    const date = [];
    date.push(CommonUtil.dateFmt('yyyy/MM/dd 00:00:00', new Date(CommonUtil.funDate(1 - w))));
    date.push(CommonUtil.dateFmt('yyyy/MM/dd 23:59:59', new Date(CommonUtil.funDate(7 - w))));
    return date;
  }

  /**
   * 获取本月日期范围
   */
  getMonthRange() {
    const now = this.currentTime;
    const date = [];
    const d = this.isBigMonth(now.getMonth() + 1) ? 31 : 30;
    date.push(CommonUtil.dateFmt('yyyy/MM/01 00:00:00', now));
    date.push(CommonUtil.dateFmt(`yyyy/MM/${d} 23:59:59`, now));
    return date;
  }

  /**
   * 获取本年日期范围
   */
  getYearRange() {
    const now = this.currentTime;
    const date = [];
    date.push(CommonUtil.dateFmt('yyyy/01/01 00:00:00', now));
    date.push(CommonUtil.dateFmt('yyyy/12/31 23:59:59', now));
    return date;
  }

  /**
   * 获取几天前的时间范围
   * 当前日期往前推多少天例如 2019/6/18 7 =》 2019/6/11 - /2019/6/17
   */
  getDateRang(day: number) {
    const date = [];
    date.push(CommonUtil.dateFmt('yyyy/MM/dd 00:00:00', new Date(CommonUtil.funDate(-day + 1))));
    date.push(CommonUtil.dateFmt('yyyy/MM/dd 23:59:59', new Date()));
    return date;
  }

  /**
   * 判断大小月
   * param month
   */
  private isBigMonth(month) {
    return [1, 3, 5, 7, 8, 10, 12].includes(Number.parseInt(month, 0));
  }
}
