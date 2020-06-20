/**
 * 工单列表筛选条件模型
 */
export class WorkOrderConditionModel {
  /**
   * 项目id
   */
  public projectId: string[];
  /**
   * 区域id
   */
  public areaId: string[];
  /**
   * 工单类型
   */
  public procType: string;
  /**
   * 工单状态
   */
  public status: string[];

  /**
   *  销账工单区域id
   */
  public deviceAreaIdList: string[];

  /**
   *  区域id
   */
  public areaIdList: string[];

}

/**
 * 巡检工单表格模型
 */
export class InspectionWorkOrderModel {
  /**
   * 工单编号
   */
  public procId: string;
  /**
   * 标题
   */
  public title: string;
  /**
   * 工单状态
   */
  public status: string;
  /**
   * 责任单位id
   */
  public accountabilityDept: string;
  /**
   * 责任单位名称
   */
  public accountabilityDeptName: string;
  /**
   * 责任人id
   */
  public assign: string;
  /**
   * 责任人名字
   */
  public assignName: string;
  /**
   * 进度
   */
  public progressSpeed: string;

  /**
   * 状态样式
   */
  public statusClass: string;

  /**
   * 状态国际化
   */
  public statusName: string;
}

/**
 * 销障工单表格模型
 */
export class ClearWorkOrderModel {
  /**
   * 工单编号
   */
  public procId: string;
  /**
   * 标题
   */
  public title: string;
  /**
   * 工单状态
   */
  public status: string;
  /**
   * 责任单位id
   */
  public accountabilityDept: string;
  /**
   * 责任单位名称
   */
  public accountabilityDeptName: string;
  /**
   * 责任人id
   */
  public assign: string;
  /**
   * 责任人名字
   */
  public assignName: string;
  /**
   * 剩余天数
   */
  public lastDays: string;
  /**
   * 关联故障Id
   */
  public troubleId: string;
  /**
   * 关联故障code
   */
  public troubleCode: string;
  /**
   * 关联故障名称
   */
  public troubleName: string;
  /**
   * 关联告警id
   */
  public refAlarm: string;
  /**
   * 关联告警名称
   */
  public refAlarmName: string;
  /**
   * 关联告警code
   */
  public refAlarmCode: string;

  /**
   * 状态样式
   */
  public statusClass: string;

  /**
   * 状态国际化
   */
  public statusName: string;
}

/**
 * 工单类型模型
 */
export class WorkOrderTypeModel {
  /**
   * 工单数量
   */
  public count: number;
  /**
   * 工单类型
   */
  public procType: string;
}


/**
 * 工单状态模型
 */
export class WorkOrderStateResultModel {
  /**
   * 工单数量
   */
  public count: number;
  /**
   * 工单状态
   */
  public status: string;
  /**
   * 工单名称
   */
  public statusName: string;
}


/**
 * 工单状态模型
 */
export class WorkOrderStateModel {
  /**
   * 工单数量
   */
  public count: number;
  /**
   * 工单状态
   */
  public procType: string;
  /**
   * 工单名称
   */
  public statusName: string;
}
