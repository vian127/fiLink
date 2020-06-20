import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../shared-module/util/common-util';

export enum JumpType {
  // 跳纤
  FiberJumper = '0',
  // 分光器
  Splitter = '1'
}

export enum RouterConst {
  // 开锁次数统计
  TopLock = 'top-lock',
  // 告警次数统计
  TopAlarm = 'top-alarm',
  // 销障工单统计
  TopWorkOrder = 'top-work-order',
  // 传感数值统计
  TopSensor = 'top-sensor',
  // 端口资源使用率统计
  TopPort = 'top-port',
  // 光交箱
  Optical_Box = '001',
  // 人井
  Well = '030',
  // 配线架
  Distribution_Frame = '060',
  // 室外柜
  OUTDOOR_CABINET = '210',
  Ten = '10',
  Twenty = '20'
}

export function getJumpType(i18n: NzI18nService, code = null, prefix) {
  return CommonUtil.codeTranslate(JumpType, i18n, code, prefix);
}
