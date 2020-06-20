/**
 * 工单状态模型
 */
export class WorkOrderStateModel {
  /**
   * 告警名称
   */
  public alarmName: string;
  /**
   * 设备ID
   */
  public equipmentId: string;
  /**
   * 设备名称
   */
  public equipmentName: string;
  /**
   * 设备类型
   */
  public equipmentType: string;

  /**
   * 设施ID
   */
  public deviceId: string;

  /**
   * 设施名称
   */
  public deviceName: string;
  /**
   * 告警类别
   */
  public alarmType: string;

  /**
   * 责任单位
   */
  public accountabilityUnit: string;
}
