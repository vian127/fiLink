import {NzI18nService} from 'ng-zorro-antd';
/* *
 * 默认设施图标大小
 */
export const MAP_ICON_CONFIG = {
  // 默认设施图标大小
  defaultIconSize: '18-24',
  iconConfig: [{
    value: '18-24',
    label: '18*24'
  }, {
    value: '24-32',
    label: '24*32'
  }]
};

/**
 * 告警数量
 */
export enum alarmCount {
  // 紧急告警数量
  urgentAlarmCount = 'urgentAlarmCount',
  // 主要告警数量
  mainAlarmCount = 'mainAlarmCount',
  // 次要告警数量
  minorAlarmCount = 'minorAlarmCount',
  // 提示告警数量
  hintAlarmCount = 'hintAlarmCount',
}

/**
 * 告警颜色
 */
export enum alarmCountColor {
  // 紧急告警数量
  urgentAlarmCount = '#e61017',
  // 主要告警数量
  mainAlarmCount = '#ff6600',
  // 次要告警数量
  minorAlarmCount = '#f1c620',
  // 提示告警数量
  hintAlarmCount = '#58c1f0',
}

/**
 * 获取告警数量
 */
export function getAlarmCount(i18n: NzI18nService, code = null) {
  return this.codeTranslate(alarmCount, i18n, code, 'index');
}

/**
 * 首页根据设施id和缓存data查询设施名称
 */
export function getAlarmIdFromName(id: string, data: any): string {
  let alarmName = '';
  data.filter(item => {
    if (item.deviceId === id) {
      alarmName = item.deviceName ;
    }
  });
  return  alarmName;
}

