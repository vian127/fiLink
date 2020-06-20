/**
 * 设备详情卡片code
 */
export enum EquipmentDetailCardEnum {
  // 基本详情
  detail = '1',
  // 基本操作
  operate = '2',
  // 上报状态
  reportStatus = '3',
  // 设备告警
  alarm = '4',
  // 设备日志
  equipmentLog = '5',
  // 设备图片
  equipmentImg = '6',
  // 设备工单
  equipmentOrder = '7'
}

/**
 * 操作符号过滤选择
 */
export enum FilterSelectEnum {
  // 等于
  eq = '=',
  // 大于
  gt = '>',
  // 小于
  lt = '<'
}

/**
 * 设备状态
 */
export enum EquipmentStatusEnum {
  // 未配置
  unSet = '1',
  // 正常在线
  online = '2',
  // 告警
  alarm = '3',
  // 故障
  break = '4',
  // 离线
  offline = '5',
  // 失联
  outOfContact = '6',
  // 已拆除
  dismantled = '7'
}
