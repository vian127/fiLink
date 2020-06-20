/**
 * 策略控制列表
 */
export class PolicyControl {
  /**
   * 策略名称
   */
  public strategyName: string;
  /**
   * 策略状态
   */
  public strategyStatus: number;
  /**
   * 策略类型
   */
  public strategyType: number;
  /**
   * 有效期
   */
  public effectivePeriodTime: string;
  /**
   * 执行状态
   */
  public execStatus: number;
  /**
   * 执行周期
   */
  public execCron: string;
  /**
   * 创建时间
   */
  public createDate: string;
  /**
   * 申请人
   */
  public applyBy: string;
  /**
   * 备注
   */
  public remark: string;
}

/**
 * 智慧杆数量
 */
export class EquipmentCountList {
  /**
   * 单控数量
   */
  public singleControllerCount: number;
  /**
   * 集中数量
   */
  public centralControllerCount: number;
}

/**
 * 选中的设备
 */
export class DimmingLight {
  /**
   * 设备id
   */
  groupId: string;
}
