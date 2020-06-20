/**
 * 首页工单类型
 */

export enum IndexWorkOrderTypeEnum {
  /**
   * 巡检
   */
  inspection = 'inspection',
  /**
   * 销障
   */
  clear_failure = 'clear_failure',
  /**
   * 告警确认
   */
  confirm = 'confirm',
  /**
   * 安装
   */
  install = 'install',
  /**
   * 拆除
   */
  removal = 'removal'
}

/**
 * 首页工单状态
 */
export enum IndexWorkOrderStateEnum {
  /**
   * 待指派
   */
  assigned = 'assigned',
  /**
   * 待处理
   */
  pending = 'pending',
  /**
   * 处理中
   */
  processing = 'processing',
  /**
   * 已完成
   */
  completed = 'completed',
  /**
   * 已退单
   */
  singleBack = 'singleBack',
  /**
   * 待审核
   */
  waitConfirm = 'waitConfirm',
  /**
   * 已转派
   */
  unpass = 'unpass',
  /**
   * 审核不通过
   */
  turnProcess = 'turnProcess',
}

/**
 * 首页工单图标
 */
export enum IndexWorkOrderStateIconEnum {
  /**
   * 待指派
   */
  assigned = 'fiLink-assigned-w statistics-assigned-color',
  /**
   * 待处理
   */
  pending = 'fiLink-processed statistics-pending-color',
  /**
   * 处理中
   */
  processing = 'fiLink-processing statistics-processing-color',
  /**
   * 已完成
   */
  completed = 'fiLink-completed statistics-completed-color',
  /**
   * 已退单
   */
  singleBack = 'fiLink-chargeback statistics-singleBack-color',
  /**
   * 待审核
   */
  waitConfirm = 'fiLink-completed statistics-completed-color',
  /**
   * 已转派
   */
  unpass = 'fiLink-completed statistics-completed-color',
  /**
   * 审核不通过
   */
  turnProcess = 'fiLink-filink-yizhuanpai-icon statistics-turnProcessing-color',
}

export enum IndexPageSizeEnum {

  /**
   * 每页一条
   */
  pageSizeOne = 1,

  /**
   * 每页五条
   */
  pageSizeFive = 5,

  /**
   * 每页十条
   */
  pageSizeTen = 10,
}

/**
 * 地图分层类型
 */
export enum IndexLayeredTypeEnum {
  /**
   * 设施分层
   */
  facility = 'facility',
  /**
   * 设备分层
   */
  device = 'equipment'
}

/**
 * 告警类别
 */
export enum IndexAlarmTypeEnum {
  /**
   * 通信告警
   */
  commAlarm = 1,
  /**
   * 业务质量告警
   */
  businessAlarm = 2,
  /**
   * 环境告警
   */
  environmentAlarm = 3,
  /**
   * 电力告警
   */
  powerAlarm = 4,
  /**
   * 安全告警
   */
  safeAlarm = 5,
  /**
   * 设备告警
   */
  equipmentAlarm = 6,
}

/**
 * 工单类型枚举
 */
export enum IndexWorkOrderComponentTypeEnum {
  /**
   * 巡检工单
   */
  inspection = '巡检',
  /**
   * 告警确认工单
   */
  confirm = '告警确认',
  /**
   * 装维工单
   */
  install = '装维',
  /**
   * 拆除工单
   */
  removal = '拆除',
  /**
   * 销障工单
   */
  clear_failure = '销障',
}

export enum IndexWorkOrderComponentStatusEnum {
  /**
   * 待指派
   */
  assigned = '待指派',
  /**
   * 待处理
   */
  pending = '待处理',
  /**
   * 处理中
   */
  processing = '处理中',
  /**
   * 已转派
   */
  turnProcess = '已转派',
  /**
   * 待审核
   */
  waitConfirm = '待审核',
  /**
   * 审核不通过
   */
  unPass = '审核不通过',
  /**
   * 已退单
   */
  singleBack = '已退单',
  /**
   * 已完成
   */
  completed = '已完成',
}

export enum ResultItem {
  /**
   * 待指派
   */
  success = 'success',
  /**
   * 待处理
   */
  error = 'error',

}

/**
 * 分组操作
 */
export enum IndexGroupTypeEnum {
  /**
   * 当前分组
   */
  current = '1',
  /**
   * 新增分组
   */
  create = '2'
}

