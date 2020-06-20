import {Observable} from 'rxjs';

/**
 * 巡检工单接口
 */
export interface InspectionInterface {
  /**
   * 新增巡检任务列表
   * param body
   */
  getWorkOrderList(body): Observable<Object>;

  /**
   * 新增巡检任务路径
   * param body
   */
  insertWorkOrder(body): Observable<Object>;

  /**
   * 删除巡检任务
   * param body
   */
  deleteWorkOrderByIds(body): Observable<Object>;

  /**
   * 编辑巡检任务
   * param body
   */
  updateInspectionTask(body): Observable<Object>;

  /**
   * 查询巡检任务接口
   * param body
   */
  inquireInspectionTask(id): Observable<Object>;

  /**
   * 启用巡检任务
   * param body
   */
  enableInspectionTask(body): Observable<Object>;

  /**
   * 禁用巡检任务
   * param body
   */
  disableInspectionTask(body): Observable<Object>;

  /**
   * 巡检任务关联工单
   * param body
   */
  associatedWorkOrder(body): Observable<Object>;

  /**
   * 巡检任务关联巡检设施
   * param body
   */
  inspectionFacility(body): Observable<Object>;

  /**
   * 巡检任务导出
   * param body
   */
  exportInspectionTask(body): Observable<Object>;

  /**
   * 检验名称是否存在
   * param name
   * param id
   * returns {Observable<Object>}
   */
  checkName(name, id): Observable<Object>;

  /**
   * 获取未完成巡检工单列表
   * param body
   */
  getUnfinishedList(body): Observable<Object>;

  /**
   * 新增巡检工单
   * param body
   */
  addWorkUnfinished(body): Observable<Object>;

  /**
   * 编辑巡检工单
   * param body
   */
  updateWorkUnfinished(body): Observable<Object>;

  /**
   * 编辑巡检工单后台返回数据
   * param body
   */
  getUpdateWorkUnfinished(id): Observable<Object>;

  /**
   * 删除未完成巡检工单
   * param body
   */
  deleteUnfinishedOrderByIds(body): Observable<Object>;

  /**
   * 已完成巡检信息列表
   * param body
   */
  getUnfinishedCompleteList(body): Observable<Object>;

  /**
   * 巡检完工记录列表
   * param body
   */
  getFinishedList(body): Observable<Object>;

  /**
   * 退单确认
   */
  singleBackToConfirm(body): Observable<Object>;

  /**
   * 指派
   */
  assignedUnfinished(id, departmentList): Observable<Object>;

  /**
   * 重新生成
   */
  inspectionRegenerate(body): Observable<Object>;

  /**
   * 未完工工单撤回
   */
  unfinishedWorkOrderWithdrawal(body): Observable<Object>;

  /**
   * 未完工导出
   */
  unfinishedExport(body): Observable<Object>;

  /**
   * 完工记录导出接口
   */
  completionRecordExport(body): Observable<Object>;

  /**
   * 首页设施巡检工单
   * param id
   * returns {Observable<Object>}
   */
  getFiveWorkOrder(id): Observable<Object>;

  /**
   * 根据区域ID查询责任单位
   */
  queryResponsibilityUnit(body): Observable<Object>;

  /**
   * 告警转工单责任单位查询
   */
  alarmQueryResponsibilityUnit(body): Observable<Object>;

  /**
   * 查询已巡检数量和未巡检数量
   */
  queryProcInspectionByProcInspectionId(body): Observable<Object>;

  /**
   * 查询所有用户
   */
  queryAllUser(body): Observable<Object>;

  /**
   * 通过责任单位id查询责任单位下是否有工单
   * param body
   * returns {Observable<Object>}
   */
  existsWorkOrderForDeptIds(body): Observable<Object>;
}
