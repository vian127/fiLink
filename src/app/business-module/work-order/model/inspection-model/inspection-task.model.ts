/**
 * 巡检任务模型
 */
export class InspectionTaskModel {
  /**
   * 任务id
   */
  public inspectionTaskId: string;
  /**
   * 任务名称
   */
  public inspectionTaskName: string;
  /**
   * 任务状态
   */
  public inspectionTaskStatus: string | { code: any; label: string }[];
  /**
   * 启用状态
   */
  public isOpen: string;
  /**
   * 期望用时
   */
  public procPlanDate: number;
  /**
   * 巡检任务类型
   */
  public inspectionTaskType: string | { code: any; label: string }[];
  /**
   * 巡检周期
   */
  public taskPeriod: number;
  /**
   * 起始时间
   */
  public startTime: number;
  /**
   * 结束时间
   */
  public endTime: number;
  /**
   * 巡检区域
   */
  public inspectionAreaName: string;
  /**
   * 巡检区域 id
   */
  public inspectionAreaId: string;
  /**
   * 巡检设施总数
   */
  public inspectionDeviceCount: number;
  /**
   * 责任单位
   */
  public accountabilityDeptName: string;
  /**
   * 巡检全集
   */
  public isSelectAll: string;
  /**
   * 巡检设施
   */
  public deviceName: string;
  /**
   * 是否生成多工单
   */
  public isMultipleOrder: string;
  /**
   * 巡检起始时间
   */
  public inspectionStartTime: number;
  /**
   * 巡检结束时间
   */
  public inspectionEndTime: number;
  /**
   * 设施类型
   */
  public deviceType: string;
  /**
   * 设施类型名称
   */
  public deviceTypeName: string;
  /**
   * 工单id
   */
  public procId: string;
  /**
   * 巡检模板
   */
  // public template: [];
  public template: any;
  /**
   * 设施集合
   */
  public deviceList: any;
  /**
   * 单位集合
   */
  public deptList: any;
  /**
   * 名称
   */
  public title: string;
  /**
   * 状态
   */
  public status: string;
  /**
   * 创建时间
   */
  public cTime: number;
  /**
   * 剩余天数
   */
  public lastDays: number;
  /**
   * 设施区域名称
   */
  public deviceAreaName: string;
  /**
   * 责任人
   */
  public assign: string;
  /**
   * 进度
   */
  public progressSpeed: number;
  /**
   * 备注
   */
  public remark: string;
  /**
   * 转派原因
   */
  public turnReason: string;
  /**
   * 退单原因
   */
  public singleBackReason: string;
  /**
   * 状态名称
   */
  public statusName: string;
  /**
   * 状态class
   */
  public statusClass: string;
  /**
   * 任务开始时间
   */
  public taskStartTime: string;
  /**
   * 任务结束时间
   */
  public taskEndTime: string;
  /**
   * 设施id
   */
  public deviceId: string;
  /**
   * 单位
   */
  public accountabilityDept: string;
  /**
   * 模板名称
   */
  public templateName: string;
}
