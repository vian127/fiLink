/**
 * Created by wh1910108 on 2019/6/15.
 */
export class TroubleModel {
  /**
   * 故障编号
   */
  public troubleCode: string;
  /**
   * 处理状态
   */
  public handleStatus: any;
  /**
   * 故障级别
   */
  public troubleLevel: string;
  /**
   * 故障类型
   */
  public troubleType: string;
  /**
   * 故障来源
   */
  public troubleSource: string;
  /**
   * 故障设施名称
   */
  public deviceName: string;
  /**
   * 故障设施ID
   */
  public deviceId: string;
  /**
   * 故障设备名称
   */
  public alarmSourceName: string;
  /**
   * 故障设备ID
   */
  public alarmSourceTypeId: string;
  /**
   * 故障描述
   */
  public troubleDescribe: string;
  /**
   * 填报人
   */
  public reportUserName: string;
  /**
   * 发生时间
   */
  public happenTime: string;
  /**
   * 责任单位名称
   */
  public deptName: string;
  /**
   * 备注
   */
  public troubleRemark: string;
  /**
   * 故障类型value
   */
  public value: string;
  /**
   * 故障类型key
   */
  public key: string;
  /**
   * 故障总数
   */
  public troubleTotal: string;
  /**
   * 紧急故障
   */
  public troubleLevel1: string;
  /**
   * 主要故障
   */
  public troubleLevel2: string;
  /**
   * 次要故障
   */
  public troubleLevel3: string;
  /**
   * 提示故障
   */
  public troubleLevel4: string;
  /**
   * 光交箱
   */
  public opticalBox: string;
  /**
   * 人井
   */
  public manWell: string;
  /**
   * 配线架
   */
  public patchPanel: string;
  /**
   * 接头盒
   */
  public jointClosure: string;
  /**
   * 室外柜
   */
  public outDoorCabinet: string;
  /**
   * 单位id
   */
  public deptId: string;
}
