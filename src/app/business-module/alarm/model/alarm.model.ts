/**
 * Created by wh1910108 on 2020/6/10.
 */
export class AlarmModel {
  /**
   * 故障类型key
   */
  public key: string;
  /**
   * 故障类型value
   */
  public value: string;
  /**
   * 故障等级样式
   */
  public style: string;
  /**
   * 故障等级
   */
  public troubleLevel: string;
  /**
   * 处理状态名称
   */
  public handleStatusName: string | { code: any; label: string }[];
  /**
   * 处理状态
   */
  public handleStatus: string;
  /**
   * 故障等级名称
   */
  public troubleLevelName: string | { code: any; label: string }[];
  /**
   * 故障来源名称
   */
  public troubleSourceTypeName: string | { code: any; label: string }[];
  /**
   * 故障来源
   */
  public troubleSource: string;
  /**
   * 销障工单状态
   */
  public status: string;
  /**
   * 销障工单状态名称
   */
  public statusName: string;
  /**
   * 销障工单状态样式
   */
  public statusClass: string;
}
