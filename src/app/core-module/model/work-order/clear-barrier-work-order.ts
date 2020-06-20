export class ClearBarrierWorkOrder {
  title: string;    // 名称
  procType: string;  // 工单类型
  refAlarm: string;   // 管理告警
  procId?: string;    // 工单id
  status?: string;    // 工单状态
  deviceId: string;   // 设施id
  deviceName?: string;   // 设施名称
  deviceType?: string;   // 设施类型
  deviceAreaId?: string; // 设施区域id
  deviceAreaName?: string;   // 设施区域名称
  cTime?: number;            // 创建时间
  refAlarmName?: string;     // 管理告警名称
  accountabilityDept?: string; // 单位id
  accountabilityUnitName?: string;   // 单位名称
  ecTime?: string;  // 期望完工时间
  lastDays?: string;   // 剩余天数
  remark?: string;     // 备注
  turnReason?: string;   // 转派原因
  constructor() {
    this.procType = 'clear_failure';
  }
}

