export enum DateType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  ONE_WEEK = 'oneWeek',
  ONE_MONTH = 'oneMonth',
  THREE_MONTH = 'threeMonth'
}

export interface TimeItem {
  label: string;
  value: DateType.DAY | DateType.WEEK | DateType.MONTH | DateType.YEAR | DateType.ONE_WEEK | DateType.ONE_MONTH | DateType.THREE_MONTH;
}
