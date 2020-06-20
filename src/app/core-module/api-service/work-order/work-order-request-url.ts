import {
  DEVICE_SERVER, USER_SERVER,
  WORK_ORDER_SERVER, INSPRCTION_TEMP,
  ORDER_MANAGE,
} from '../api-common.config';

const BASE = `${WORK_ORDER_SERVER}/procBase`;
const CLEAR_BARRIER = `${WORK_ORDER_SERVER}/procClearFailure`;
const INSPECTION = `${WORK_ORDER_SERVER}/procInspection`;
const INSPECTION_TASK = `${ORDER_MANAGE}/inspectionTask`;
const ALARM_SERVER = `${DEVICE_SERVER}`;
const INSPRCTIONTEMP = `${ORDER_MANAGE}/inspectionTemplate`;
const ORDER_MANAGES = `${ORDER_MANAGE}/repairOrder`;
/**
 * 巡检工单接口
 */
export const WORK_ORDER_URL = {
  // 获取历史销障工单列表
  GET_HISTORY_CLEAR_BARRIER_WORK_ORDER_LIST_ALL: `${ORDER_MANAGES}/queryListHistoryClearFailureByPage`,
  // 获取未完成销障工单列表
  GET_UNFINISHED_CLEAR_BARRIER_WORK_ORDER_LIST_ALL: `${ORDER_MANAGES}/queryListClearFailureProcessByPage`,
  // 获取未完成销障工单详情
  GET_UNFINISHED_CLEAR_BARRIER_WORK_ORDER_DETAIL: `${ORDER_MANAGES}/getClearFailureById`,
  // 获取未完成销障工单详情 2
  GET_UNFINISHED_WORK_ORDER_DETAIL: `${ORDER_MANAGES}/getClearFailureByIdForProcess`,
  // 历史详情
  GET_HISTORY_WORK_ORDER_DETAIL: `${ORDER_MANAGES}/getClearFailureByIdForComplete`,
  // 新增销障工单
  ADD_CLEAR_BARRIER_WORK_ORDER: `${ORDER_MANAGES}/addClearFailureProc`,
  // 修改销障工单
  UPDATE_CLEAR_BARRIER_WORK_ORDER: `${ORDER_MANAGES}/updateClearFailureProcById`,
  // 销账工单列表待指派状态统计
  GET_ASSIGNED_CLEAR_BARRIER_WORK_ORDER_STATISTICS: `${ORDER_MANAGES}/queryCountClearFailureProcByAssigned`,
  // 销账工单列表待处理状态统计
  GET_PENDING_CLEAR_BARRIER_WORK_ORDER_STATISTICS: `${ORDER_MANAGES}/queryCountClearFailureProcByPending`,
  // 销账工单列表处理中状态统计
  // GET_PROCESSING_CLEAR_BARRIER_WORK_ORDER_STATISTICS: `${ORDER_MANAGES}/queryCountClearFailureProcByProcessing`,
  GET_PROCESSING_CLEAR_BARRIER_WORK_ORDER_STATISTICS: `${ORDER_MANAGE}/procStatistical/queryListProcOverviewGroupByProcStatus`,
  // 销账工单列表今日新增统计
  GET_INCREASE_CLEAR_BARRIER_WORK_ORDER_STATISTICS: `${ORDER_MANAGE}/procStatistical/queryNowDateAddOrderCount`,
  // 销账工单未完工列表状态总数统计
  GET_UNFINISHED_CLEAR_BARRIER_WORK_ORDER_STATISTICS: `${ORDER_MANAGES}/queryCountListProcUnfinishedProcStatus`,
  // 故障原因统计的销障工单信息
  GET_CLEAR_BARRIER_WORK_ORDER_STATISTICS_BY_ERROR_REASON: `${ORDER_MANAGE}/procStatistical/queryListProcOverviewGroupByProcErrorReason`,
  // 处理方案统计的销障工单信息
  GET_CLEAR_BARRIER_WORK_ORDER_STATISTICS_BY_PROCESSING_SCHEME: `${ORDER_MANAGE}/procStatistical/queryListProcOverviewGroupByProcProcessingScheme`,
  // 设施类型统计的销障工单信息
  GET_CLEAR_BARRIER_WORK_ORDER_STATISTICS_BY_DEVICE_TYPE: `${ORDER_MANAGE}/procStatistical/queryListProcOverviewGroupByProcDeviceType`,
  // 工单状态统计的销障工单信息
  GET_CLEAR_BARRIER_WORK_ORDER_STATISTICS_BY_STATUS: `${ORDER_MANAGE}/procStatistical/queryListProcOverviewGroupByProcStatus`,
  // 销账工单历史列表总数统计
  GET_HISTORY_CLEAR_BARRIER_WORK_ORDER_STATISTICS: `${ORDER_MANAGES}/queryCountListProcHisProc`,
  // 校验销障工单名是否存在
  CHECK_CLEAR_BARRIER_WORK_ORDER_NAME_EXIST: `${ORDER_MANAGES}/queryTitleIsExists`,
  // 获取销障工单详情
  GET_CLEAR_BARRIER_WORK_ORDER_BY_ID: `${ORDER_MANAGES}/getProcessByProcId`,
  // 删除销障工单
  DELETE_CLEAR_BARRIER_WORK_ORDER: `${ORDER_MANAGES}/deleteProc`,
  // 退单
  SEND_BACK_CLEAR_BARRIER_WORK_ORDER: `${ORDER_MANAGES}/chargeProc`,
  // 撤回工单
  REVOKE_CLEAR_BARRIER_WORK_ORDER: `${ORDER_MANAGES}/revokeProc`,
  // 指派工单
  ASSIGN_CLEAR_BARRIER_WORK_ORDER: `${ORDER_MANAGES}/assignProc`,
  // 退单确认
  SINGLE_BACK_CONFIRM: `${ORDER_MANAGES}/checkSingleBack`,
  // 查询责任单位下是否有工单
  EXISTS_WORK_ORDER_FOR_DEPT_IDS: `${ORDER_MANAGES}/existsProcForDeptIdsAndAreaId`,
  // 导出未完工销障工单
  EXPORT_UNFINISHED_CLEAR_BARRIER_WORK_ORDER: `${ORDER_MANAGES}/exportClearFailureProcUnfinished`,
  // 导出历史销障工单
  EXPORT_HISTORY_CLEAR_BARRIER_WORK_ORDER: `${ORDER_MANAGES}/exportClearFailureProcHistory`,
  // 首页设施销障工单
  GET_FIVE_CLEAR_BARRIER: `${ORDER_MANAGES}/queryClearFailureProcTopFive`,
  // 退单重新生成
  REFUND_GENERATED_AGAIN: `${ORDER_MANAGES}/regenerateClearFailureProc`,

  // 新增巡检任务列表
  GET_INSPECTION_WORK_ORDER_LIST_ALL: `${INSPECTION_TASK}/queryListInspectionTaskByPage`,
  // 新增巡检任务路径
  ADD_INSPECTION_WORK_ORDER: `${INSPECTION_TASK}/insertInspectionTask`,
  // 删除巡检任务
  DELETE_INSPECTION_WORK_ORDER: `${INSPECTION_TASK}/deleteInspectionTaskByIds`,
  // 编辑巡检任务
  UPDATE_INSPECTION_WORK_ORDER: `${INSPECTION_TASK}/updateInspectionTask`,
  // 查询巡检任务接口
  INQUIRE_INSPECTION_WORK_ORDER: `${INSPECTION_TASK}/getInspectionTaskById`,
  // 启用巡检任务状态
  ENABLE_INSPECTION_TASKS: `${INSPECTION_TASK}/openInspectionTaskBatch`,
  // 停用巡检任务状态
  DISABLE_INSPECTION_TASKS: `${INSPECTION_TASK}/closeInspectionTaskBatch`,
  // 巡检任务关联工单
  ASSOCIATED_WORK_ORDER: `${ORDER_MANAGE}/procInspection/queryListInspectionTaskRelationProcByPage`,
  // 巡检任务关联巡检设施
  INSPECTION_FACILITY: `${INSPECTION_TASK}/inspectionTaskRelationDeviceList`,
  // 巡检任务导出接口
  EXPORT_INSPECTION_TASK: `${INSPECTION_TASK}/exportInspectionTask`,
  // 巡检任务名称校验接口
  QUERY_INSPECTION_TASK_IS_EXISTS: `${INSPECTION_TASK}/queryInspectionTaskIsExists`,
  // 未完工巡检工单列表
  GET_INSPECTION_WORK_UNFINISHED_LIST_ALL: `${ORDER_MANAGE}/inspectionOrder/queryListInspectionProcessByPage`,
  // 新增巡检工单
  ADD_INSPECTION_WORK_UNFINISHED: `${ORDER_MANAGE}/inspectionOrder/insertInspectionProc`,
  // 编辑巡检工单
  UPDATE_INSPECTION_WORK_UNFINISHED: `${ORDER_MANAGE}/inspectionOrder/updateInspectionProc`,
  // 编辑巡检工单后台返回数据
  GET_UPDATE_INSPECTION_WORK_UNFINISHED_LIST: `${ORDER_MANAGE}/inspectionOrder/getInspectionProcById`,
  // 删除未完成巡检工单
  DELETE_INSPECTION_WORK_UNFINISHED: `${ORDER_MANAGE}/procBase/deleteProc`,
  // 已完成巡检信息列表
  GET_INSPECTION_COMPLETE_UNFINISHED_LIST: `${ORDER_MANAGE}/inspectionOrder/queryListCompleteInspectionByPage`,
  // 巡检完工记录列表
  GET_INSPECTION_WORK_FINISHED_LIST_ALL: `${ORDER_MANAGE}/inspectionOrder/queryListInspectionCompleteRecordByPage`,
  // 退单确认
  SINGLE_BACK_TO_CONFIRM_UNFINISHED: `${ORDER_MANAGE}/procBase/checkSingleBack`,
  // 指派
  ASSIGNED_UNFINISHED: `${ORDER_MANAGE}/procBase/assignProc`,
  // 重新生成
  INSPECTION_WORK_UNFINISHED_REGENERATE: `${ORDER_MANAGE}/inspectionOrder/regenerateInspectionProc`,
  // 未完工工单撤回
  UNFINISHED_WORK_ORDER_WITHDRAWAL: `${ORDER_MANAGE}/procBase/revokeProc`,
  // 未完工导出
  UNFINISHED_EXPORT: `${ORDER_MANAGE}/inspectionOrder/exportListInspectionProcess`,
  // 完工记录导出接口
  COMPLETION_RECORD_EXPORT: `${ORDER_MANAGE}/inspectionOrder/exportListInspectionComplete`,
  // 首页设施巡检工单
  GET_FIVE_INSPECTION: `${INSPECTION}/queryProcInspectionTopFive`,
  // 根据区域ID查询责任单位
  QUERY_RESPONSIBILITY_UNIT: `${USER_SERVER}/department/queryAllDepartmentForPageSelection`,
  // 告警转工单责任单位查询
  ALARM_QUERY_RESPONSIBILITY_UNIT: `${ALARM_SERVER}/areaInfo/getCommonDeptByAreaId`,
  // 查询已巡检数量和未巡检数量
  QUERY_PROC_INSPECTION_BY_PROC_INSPECTION: `${ORDER_MANAGE}/inspectionOrder/queryListCompleteInspectionByPage`,
  // 查询所有用户
  QUERY_ALL_USER_INFO: `${USER_SERVER}/user/queryAllUserInfo`,
  // 巡检模板列表
  GET_INSPECT_TEMPLATE: `${INSPRCTIONTEMP}/queryListTemplateByPage`,
  // 获取巡检项最大个数
  GET_INSPECT_TOTAL: `${INSPRCTIONTEMP}/queryInspectionItemConfig`,
  // 新增巡检模板
  ADD_INSPECT_TEMPLATE: `${INSPRCTIONTEMP}/insertTemplate`,
  // 获取模板信息
  GET_TEMPLATE_INFO: `${INSPRCTIONTEMP}/queryTemplateById`,
  // 编辑模板
  EDIT_INSPECT_TEMPLATE: `${INSPRCTIONTEMP}/updateInspectionTemplate`,
  // 校验模板名称唯一性
  CHECK_INSPECT_TEMPLATE: `${INSPRCTIONTEMP}/queryTemplateExists`,
  // 删除模板
  DELETE_INSPECT_TEMPLATE: `${INSPRCTIONTEMP}/deleteInspectionTemplate`,
  // 选择模板
  SELECT_INSPECT_TEMPLATE: `${INSPRCTIONTEMP}/queryInspectionTemplateForPageSelection`,
  // 获取任务详情内工单列表
  GET_TABLE_LIST: `${ORDER_MANAGE}/inspectionOrder/queryListInspectionTaskRelationProcByPage`,
  // 关联告警
  REF_ALARM_INFO: `filink-alarmcurrent-server-dj1/alarmCurrent/queryAlarmCurrentList`,
  // 运维建议
  SUGGEST_INFO: `filink-alarmcurrent-server-dj/alarmExperience/queryExperienceInfo`,
  // 根据部门id查区域信息
  QUERY_AREA_BY_DEPT_ID: `${DEVICE_SERVER}/areaInfo/selectAreaInfoByDeptIdsForView`,
  // 详情
  GET_FINISHED_DETAIL: `${ORDER_MANAGE}/inspectionOrder/getInspectionProcByIdForComplete`,
  // checklist 查询设施
  QUERY_DEVICE_LIST: `${ORDER_MANAGE}/inspectionOrder/queryInspectionCheckList`,
  // checklist 查询设备
  QUERY_EQUIPMENT_LIST: `${ORDER_MANAGE}/inspectionOrder/queryInspectionItemByProcId`,
};
