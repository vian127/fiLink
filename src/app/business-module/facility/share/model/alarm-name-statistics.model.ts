/**
 *  告警名称统计
 */
export class AlarmNameStatisticsModel {

  /**
   * 通信中断
   */
  public communicationInterrupt: number;

  /**
   *  电量告警
   */
  public electricity: number;

  /**
   * 应急开锁告警
   */
  public emergencyLock: number;

  /**
   * 高温告警
   */
  public highTemperature: number;

  /**
   * 湿度
   */
  public humidity: number;

  /**
   * 非法开盖（内盖）
   */
  public illegalOpeningInnerCover: number;

  /**
   * 水浸
   */
  public leach: number;

  public  lean: number;

  /**
   * 低温告警
   */
  public lowTemperature: number;

  /**
   *未关门
   */
  public notClosed: number;

  /**
   * 工单超时告警
   */
  public orderOutOfTime: number;

  /**
   * 撬门
   */
  public pryDoor: number;

  /**
   * 撬锁
   */
  public pryLock: number;
  /**
   * 震动告警
   */
  public shake: number;

  /**
   * 未关锁
   */
  public unLock: number;

  /**
   * 非法开门
   */
  public violenceClose: number;
}
