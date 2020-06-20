import {allTypeCode} from '../../../statistical-report/log-statistical/log-statistical.config';

export class InspectionWorkOrderDetailModel {
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
   * 类型
   */
  public contentType: any;
  /**
   * 部门列表
   */
  public deptList: any;
  /**
   * 设施列表
   */
  public deviceList: any;
  /**
   * 设施名称
   */
  public deviceName: string;
  /**
   * 巡检区域id
   */
  public inspectionAreaId: string;
  /**
   * 巡检区域名称
   */
  public inspectionAreaName: string;
  /**
   * 巡检任务id
   */
  public inspectionTaskId: string;
  /**
   * 任务名称
   */
  public inspectionTaskName: string;
  /**
   * 任务状态
   */
  public inspectionTaskStatus: string;
  /**
   * 任务类型
   */
  public inspectionTaskType: string;
  /**
   * 生成多工单
   */
  public isMultipleOrder: string;
  /**
   * 启用状态
   */
  public isOpen: string;
  /**
   * 巡检全集
   */
  public isSelectAll: string;
  /**
   * 期望用时
   */
  public procPlanDate: number;
  /**
   * 周期
   */
  public taskPeriod: string;
  /**
   * 巡检模板
   */
  public template: any;
  /**
   * 开始时间
   */
  public startTime: number;
  /**
   * 结束时间
   */
  public endTime: number;
  /**
   * 物料
   */
  public materiel: any;
  /**
   * 设备
   */
  public procRelatedEquipment: any;
  /**
   * 设备类型
   */
  public equipmentType: string;
  /**
   * 车辆信息
   */
  public carName: string;
  /**
   * 物料信息
   */
  public materielName: string;
  /**
   * 费用信息
   */
  public costName: string;
}
