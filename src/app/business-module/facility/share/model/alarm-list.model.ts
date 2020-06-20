/**
 * 告警列表实体
 */
export class AlarmListModel {
  /**
   * 主键id
   */
  public id: string;

  /**
   * Trap oid
   */
  public trapOid: string;

  /**
   * 告警名称
   */
  public alarmName: string;

  /**
   * 告警名称id   没有
   */
  public alarmNameId: string;

  /**
   * 是否存在关联工单  没有
   */
  public Boolean: boolean;

  /**
   * 告警编码
   */
  public alarmCode: string;

  /**
   * 告警内容
   */
  public alarmContent: string;

  /**
   * 告警类型
   */
  public alarmType: number;

  /**
   * 告警源(设备id)
   */
  public alarmSource: string;

  /**
   * 告警源类型
   */
  public alarmSourceType: string;

  /**
   * 告警源类型id
   */
  public alarmSourceTypeId: string;

  /**
   * 区域id
   */
  public areaId: string;

  /**
   * 区域名称
   */
  public areaName: string;

  /*
  * 工单ID
  * */
  public orderId: string;

  /**
   * 地址
   */
  public address: string;

  /**
   * 告警级别
   */
  public alarmFixedLevel: string;

  /**
   * 告警对象
   */
  public alarmObject: string;

  /**
   * 单位id，多个单位ID用逗号隔开
   */
  public responsibleDepartmentId: string;

  /**
   * 负责单位名称，多个单位名称用逗号隔开,跟单位ID 按顺序一一对应
   */
  public responsibleDepartment: string;

  /**
   * 提示音 0是否 1是有
   */
  public prompt: string;

  /**
   * 告警发生时间
   */
  public alarmBeginTime: number;

  /**
   * 最近发生时间
   */
  public alarmNearTime: number;

  /**
   * 网管接收时间
   */
  public alarmSystemTime: number;

  /**
   * 网管最近接收时间
   */
  public alarmSystemNearTime: number;

  /**
   * 告警持续时间
   */
  public alarmContinousTime: number;

  /**
   * 告警发生次数
   */
  public alarmHappenCount;

  /**
   * 告警清除状态，2是设备清除，1是已清除，3是未清除
   */
  public alarmCleanStatus: number;

  /**
   * 告警清除时间
   */
  public alarmCleanTime: number;

  /**
   * 告警清除类型
   */
  public alarmCleanType: number;

  /**
   * 告警清除责任人id
   */
  public alarmCleanPeopleId: string;

  /**
   * 告警清除责任人
   */
  public alarmCleanPeopleNickname: string;

  /**
   * 告警确认状态,1是已确认，2是未确认
   */
  public alarmConfirmStatus: number;

  /**
   * 告警确认时间
   */
  public alarmConfirmTime: number;

  /**
   * 告警确认人id
   */
  public alarmConfirmPeopleId: string;

  /**
   * 告警确认人
   */
  public alarmConfirmPeopleNickname: string;

  /**
   * 附加消息
   */
  public extraMsg: string;

  /**
   * 处理信息
   */
  public alarmProcessing: string;

  /**
   * 备注
   */
  public remark: string;

  /**
   * 门编号
   */
  public doorNumber: string;

  /**
   * 门名称
   */
  public doorName: string;

  /**
   * 是否存在关联的告警图片
   */
  public isPicture: boolean;

  /**
   * 主控id
   */
  public  controlId: string;


  /**
   * 设备id
   */
  public  alarmEquipmentId: string;

  /**
   * 设备名称
   */
  public alarmEquipmentName: string;
}
