import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {strategyList, execStatus, controlType, strategyStatus} from './const';

/**
 * 策略类型枚举
 * @ param i18n
 * @ param code
 */
export function getPolicyType(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(strategyList, i18n, code, 'application.policyControl');
}

/**
 * 执行状态枚举
 * @ param i18n
 * @ param code
 */
export function getExecStatus(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(execStatus, i18n, code, 'application.execStatus');
}

/**
 * 控制类型
 * @ param i18n
 * @ param code
 */
export function getControlType(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(controlType, i18n, code, 'application.controlType');
}

/**
 *策略状态
 * @ param i18n
 * @ param code
 */
export function getStrategyStatus(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(strategyStatus, i18n, code, 'application.strategyStatus');
}
