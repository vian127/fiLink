export class InspectionWorkOrderModel {
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
   * 巡检起始时间
   */
  public inspectionStartTime: number;
  public inspectionStartDate: string;
  /**
   * 巡检结束时间
   */
  public inspectionEndTime: number;
  public inspectionEndDate: string;
  /**
   * 期望完工时间
   */
  public expectedCompletedTime: string;
  public ecTime: number;
  /**
   * 创建时间
   */
  public cTime: number;
  public createTime: string;
  /**
   * 剩余天数
   */
  public lastDays: number | string;
  /**
   * 巡检区域id
   */
  public deviceAreaId: string;
  /**
   * 巡检区域名称
   */
  public deviceAreaName: string;
  /**
   * 设施类型编码
   */
  public deviceType: string;
  /**
   * 设施类型编码
   */
  public deviceTypeName: string;
  /**
   * 巡检数量
   */
  public inspectionDeviceCount: number;
  /**
   * 责任单位id
   */
  public accountabilityDept: string;
  /**
   * 责任单位
   */
  public accountabilityDeptName: string;
  /**
   * 责任人id
   */
  public assign: string;
  /**
   * 责任人名称
   */
  public assignName: string;
  /**
   * 退单原因
   */
  public concatSingleBackReason: string;
  public singleBackReason: string;
  /**
   * 转派原因
   */
  public turnReason: string;
  /**
   * 进度
   */
  public progressSpeed: string;
  /**
   * 备注
   */
  public remark: string;
  /**
   * 状态
   */
  public statusName: string;
  /**
   * 状态class
   */
  public statusClass: string;
  /**
   * 样式
   */
  public rowStyle: {};
  /**
   * 样式
   */
  public lastDaysClass: string;
}
