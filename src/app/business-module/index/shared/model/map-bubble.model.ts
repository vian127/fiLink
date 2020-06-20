/**
 * 地图气泡模型
 */
export class MapBubbleModel {
  /**
   * 设施总数
   */
  public count: string;
  /**
   * 各类设施总数
   */
  public deviceTotal: string;
  /**
   * 各类告警总数
   */
  public alarmTotal: string;

}

/**
 * 地图分层设施类型模型
 */
export class MapDeviceType {
  /**
   * 设施类型
   */
  public deviceType: string;

  /**
   * 是否选中
   */
  public isModel: boolean;
}
