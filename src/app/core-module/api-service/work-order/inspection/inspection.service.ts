import {InspectionInterface} from './inspection.interface';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {Injectable} from '@angular/core';
import {WORK_ORDER_URL} from '../work-order-request-url';
import {ORDER_MANAGE} from '../../api-common.config';
import {QUERY_AREA_BY_DEPT_ID} from '../../facility/facility-request-url';

/**
 * 巡检工单接口
 */
@Injectable()
export class InspectionService implements InspectionInterface {
  constructor(private $http: HttpClient) {
  }

  // 巡检任务列表
  getWorkOrderList(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_INSPECTION_WORK_ORDER_LIST_ALL}`, body);
  }

  // 新增巡检任务路径
  insertWorkOrder(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.ADD_INSPECTION_WORK_ORDER}`, body);
  }

  // 删除巡检任务
  deleteWorkOrderByIds(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.DELETE_INSPECTION_WORK_ORDER}`, body);
  }

  // 编辑巡检任务
  updateInspectionTask(body): Observable<Object> {
    return this.$http.put(`${WORK_ORDER_URL.UPDATE_INSPECTION_WORK_ORDER}`, body);
  }

  // 查询巡检任务接口
  inquireInspectionTask(id): Observable<Object> {
    return this.$http.get(`${WORK_ORDER_URL.INQUIRE_INSPECTION_WORK_ORDER}/${id}`);
  }

  // 启用巡检任务
  enableInspectionTask(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.ENABLE_INSPECTION_TASKS}`, body);
  }

  // 禁用巡检任务
  disableInspectionTask(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.DISABLE_INSPECTION_TASKS}`, body);
  }

  // 巡检任务中关联工单
  associatedWorkOrder(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.ASSOCIATED_WORK_ORDER}`, body);
  }

  // 巡检任务关联巡检设施
  inspectionFacility(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.INSPECTION_FACILITY}`, body);
  }

  // 巡检任务名称校验
  checkName(name, id): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.QUERY_INSPECTION_TASK_IS_EXISTS}`,
      {inspectionTaskName: name, inspectionTaskId: id});
  }

  // 巡检任务导出
  exportInspectionTask(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.EXPORT_INSPECTION_TASK}`, body);
  }

  // 未完工巡检工单列表
  getUnfinishedList(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_INSPECTION_WORK_UNFINISHED_LIST_ALL}`, body);
  }

  // 新增巡检工单
  addWorkUnfinished(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.ADD_INSPECTION_WORK_UNFINISHED}`, body);
  }

  // 编辑巡检工单
  updateWorkUnfinished(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.UPDATE_INSPECTION_WORK_UNFINISHED}`, body);
  }

  // 编辑巡检工单后台返回数据
  getUpdateWorkUnfinished(id): Observable<Object> {
    return this.$http.get(`${WORK_ORDER_URL.GET_UPDATE_INSPECTION_WORK_UNFINISHED_LIST}/${id}`);
  }

  // 删除未完成巡检工单
  deleteUnfinishedOrderByIds(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.DELETE_INSPECTION_WORK_UNFINISHED}`, body);
  }

  // 已完成巡检信息列表
  getUnfinishedCompleteList(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_INSPECTION_COMPLETE_UNFINISHED_LIST}`, body);
  }

  // 巡检完工记录列表
  getFinishedList(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_INSPECTION_WORK_FINISHED_LIST_ALL}`, body);
  }

  // 退单确认
  singleBackToConfirm(id): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.SINGLE_BACK_TO_CONFIRM_UNFINISHED}`, {procId: id});
  }

  // 指派
  assignedUnfinished(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.ASSIGNED_UNFINISHED}`, body);
  }

  // 重新生成
  inspectionRegenerate(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.INSPECTION_WORK_UNFINISHED_REGENERATE}`, body);
  }

  // 未完工工单撤回
  unfinishedWorkOrderWithdrawal(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.UNFINISHED_WORK_ORDER_WITHDRAWAL}`, body);
  }

  // 未完工导出
  unfinishedExport(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.UNFINISHED_EXPORT}`, body);
  }

  // 完工记录导出接口
  completionRecordExport(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.COMPLETION_RECORD_EXPORT}`, body);
  }

  getFiveWorkOrder(id): Observable<Object> {
    return this.$http.get(`${WORK_ORDER_URL.GET_FIVE_INSPECTION}/${id}`);
  }

  // 根据区域ID查询责任单位
  queryResponsibilityUnit(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.QUERY_RESPONSIBILITY_UNIT}`, body);
  }

  // 告警转工单责任单位查询
  alarmQueryResponsibilityUnit(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.ALARM_QUERY_RESPONSIBILITY_UNIT}`, body);
  }

  // 查询已巡检数量和未巡检数量
  queryProcInspectionByProcInspectionId(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.QUERY_PROC_INSPECTION_BY_PROC_INSPECTION}`, body);
  }

  // 查询所有用户
  queryAllUser(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.QUERY_ALL_USER_INFO}`, body);
  }

  existsWorkOrderForDeptIds(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.EXISTS_WORK_ORDER_FOR_DEPT_IDS}`, body);
  }
  // 巡检模板列表
  queryInspectionTemplateList(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_INSPECT_TEMPLATE}`, body);
  }
  // 巡检项数量
  getInspectionTotal(id) {
    return this.$http.get(`${WORK_ORDER_URL.GET_INSPECT_TOTAL}/${id}`);
  }
  // 新增巡检模板
  addInspectionTemplate(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.ADD_INSPECT_TEMPLATE}`, body);
  }
  // 查询单个模板
  getTemplateInfo(id) {
    return this.$http.get(`${WORK_ORDER_URL.GET_TEMPLATE_INFO}/${id}`);
  }
  // 编辑模板
  updateTemplate(body): Observable<Object> {
    return this.$http.put(`${WORK_ORDER_URL.EDIT_INSPECT_TEMPLATE}`, body);
  }
  // 校验模板名称唯一性
  checkTemplateName(name, id): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.CHECK_INSPECT_TEMPLATE}`, {templateName: name, templateId: id});
  }
  // 删除模板
  deleteTemplate(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.DELETE_INSPECT_TEMPLATE}`, body);
  }
  // 选择巡检模板  SELECT_INSPECT_TEMPLATE
  selectTemplate(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.SELECT_INSPECT_TEMPLATE}`, body);
  }
  // 获取任务详情内工单列表
  getDetailList(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_TABLE_LIST}`, body);
  }
  // 根据部门id查区域信息
  queryAreaByDeptId(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.QUERY_AREA_BY_DEPT_ID}`, body);
  }
  // 已完工详情
  getFinishedDetail(id) {
    return this.$http.get(`${WORK_ORDER_URL.GET_FINISHED_DETAIL}/${id}`);
  }
  // checklist 查询设施
  getDeviceList(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.QUERY_DEVICE_LIST}`, body);
  }
  // checklist 查询设备
  getEquipmentList(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.QUERY_EQUIPMENT_LIST}`, body);
  }
}
