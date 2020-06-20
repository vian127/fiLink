import {Method} from './method';
import {getExecStatus, getPolicyType, getControlType, getStrategyStatus} from './application.config';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {applicationFinal} from './const';

export function instructLightListFmt(data) {
  if (data && data.length > 0) {
    data.forEach(item => {
      // item.isSwitchLight = item.isSwitchLight === '0' ? '关' : '开';
      // item.startTime = Method.dateFmt(item.startTime);
      // item.endTime = Method.dateFmt(item.endTime);
    });
  }
}

/**
 * 策略详情的枚举和多语言
 * @ param item
 * @ param $nzI18n
 */
export function detailsFmt(item, $nzI18n) {
  if (item.strategyType) {
    item.strategyType = getPolicyType($nzI18n, item.strategyType);
  }
  if (item.execStatus) {
    item.execStatus = getExecStatus($nzI18n, item.execStatus);
  }
  if (item.effectivePeriodStart) {
    item.effectivePeriodStart = CommonUtil.dateFmt(applicationFinal.DATE_TYPE, new Date(item.effectivePeriodStart));
  } else {
    item.effectivePeriodStart = '';
  }
  if (item.effectivePeriodEnd) {
    item.effectivePeriodEnd = CommonUtil.dateFmt(applicationFinal.DATE_TYPE, new Date(item.effectivePeriodEnd));
  } else {
    item.effectivePeriodEnd = '';
  }
  if (item.createTime) {
    item.createTime = CommonUtil.dateFmt(applicationFinal.DATE_TYPE, new Date(item.createTime));
  }
  if (item.strategyStatus) {
    item.strategyStatus = getStrategyStatus($nzI18n, item.strategyStatus);
  }
  if (item.controlType) {
    item.controlType = getControlType($nzI18n, item.controlType);
  }
}
