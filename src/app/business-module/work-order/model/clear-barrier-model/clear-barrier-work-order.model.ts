export class ClearBarrierWorkOrderModel {
  /**
   * 工单id
   */
  public procId: string;
  /**
   * 工单名称
   */
  public title: string;
  /**
   * 状态
   */
  public status: string;
  /**
   * 状态名称
   */
  public statusName: string;
  /**
   *状态class
   */
  public statusClass: string;
  /**
   *行样式
   */
  public rowStyle: object;
  /**
   *剩余天数class
   */
  public lastDaysClass: string;
  /**
   * 设施id
   */
  public deviceId: string;
  /**
   * 设施名称
   */
  public deviceName: string;
  /**
   * 设施类型编码
   */
  public deviceType: string;
  /**
   * 设施类型编码
   */
  public deviceTypeName: string;
  /**
   * 设备列表
   */
  public equipment: any;
  /**
   * 设施区域id
   */
  public deviceAreaId: string;
  /**
   * 设施区域名称
   */
  public deviceAreaName: string;
  /***
   * 创建时间
   */
  public createTime: number;
  /**
   * 告警id
   */
  public refAlarmId: string;
  /**
   * 关联告警名称
   */
  public refAlarmName: any;
  /**
   * 关联告警名称
   */
  public refAlarm: string;
  /**
   * 关联告警编码
   */
  public refAlarmCode: string;
  /**
   * 责任单位id
   */
  public accountabilityDept: string;
  /**
   * 责任单位
   */
  public accountabilityDeptName: string;
  /**
   * 责任人
   */
  public assign: string;
  /**
   * 责任人姓名
   */
  public assignName: string;
  /**
   * 期望完工
   */
  public expectedCompletedTime: number;
  /**
   * 剩余天数
   */
  public lastDays: number;
  /**
   * 备注
   */
  public remark: string;
  /**
   *流程类型
   */
  public procType: string;
  /**
   * 关联故障
   */
  public troubleId: string;
  /**
   * 关联故障名称
   */
  public troubleName: string;
  /**
   * 关联故障code
   */
  public troubleCode: string;
  /**
   * 设备名称
   */
  public equipmentName: string;
  /**
   * 设备类型
   */
  public equipmentType: string;
  /**
   * 运维建议
   */
  public maintenanceAdvice: string;
  /**
   * 转派原因
   */
  public turnReason: string;
  /**
   *工单来源类型
   */
  public procResourceType: string;
  /**
   *车辆名称
   */
  public carName: string;
  /**
   *物料名称
   */
  public materielName: string;
  /**
   *拼接退单原因
   */
  public concatSingleBackReason: string;
  /**
   * 拼接故障原因
   */
  public concatErrorReason: string;
  /**
   * 拼接处理方案
   */
  public concatProcessingScheme: string;
  /**
   * 工单评价
   */
  public evaluateInfo: string;
  /**
   * 费用信息
   */
  public costName: string;
  /**
   * 实际完工时间
   */
  public realityCompletedTime: string;
  /**
   * 告警/故障名称
   */
  public refAlarmFaultName: string;
  /**
   * 按钮禁用
   */
  public isShowTurnBackConfirmIcon: boolean;
  public isShowWriteOffOrderDetail: boolean;
}
