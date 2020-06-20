import {Observable} from 'rxjs';

/**
 * 销障工单接口
 */
export interface ClearBarrierInterface {
  /**
   * 获取未完工销障工单
   * param body
   * returns {Observable<Object>}
   */
  getUnfinishedWorkOrderList(body): Observable<Object>;

  /**
   * 获取历史销障工单
   * param body
   * returns {Observable<Object>}
   */
  getHistoryWorkOrderList(body): Observable<Object>;

  /**
   * 检验名称是否存在
   * param name
   * param id
   * returns {Observable<Object>}
   */
  checkName(name, id): Observable<Object>;

  /**
   * 新增销障工单
   * param body
   * returns {Observable<Object>}
   */
  addWorkOrder(body): Observable<Object>;

  /**
   * 获取销障工单详情
   * param id
   * returns {Observable<Object>}
   */
  getWorkOrderDetailById(id): Observable<Object>;

  /**
   * 编辑销障工单
   * param body
   * returns {Observable<Object>}
   */
  updateWorkOrder(body): Observable<Object>;

  /**
   * 删除销障工单
   * param body
   * returns {Observable<Object>}
   */
  deleteWorkOrder(body): Observable<Object>;

  /**
   * 销账工单列表待指派状态统计
   * returns {Observable<Object>}
   */
  getAssignedStatistics(): Observable<Object>;

  /**
   * 销账工单列表待处理状态统计
   * returns {Observable<Object>}
   */
  getPendingStatistics(): Observable<Object>;

  /**
   * 销账工单列表处理中状态统计
   * returns {Observable<Object>}
   */
  getProcessingStatistics(body): Observable<Object>;

  /**
   * 销账工单列表今日新增统计
   * returns {Observable<Object>}
   */
  getIncreaseStatistics(body): Observable<Object>;

  /**
   * 销账工单未完工列表状态总数统计
   * returns {Observable<Object>}
   */
  getUnfinishedStatistics(): Observable<Object>;

  /**
   * 销账工单历史列表总数统计
   * returns {Observable<Object>}
   */
  getHistoryStatistics(): Observable<Object>;

  /**
   * 故障原因统计的销障工单信息
   * returns {Observable<Object>}
   */
  getStatisticsByErrorReason(body): Observable<Object>;

  /**
   * 处理方案统计的销障工单信息
   * returns {Observable<Object>}
   */
  getStatisticsByProcessingScheme(body): Observable<Object>;

  /**
   * 设施类型统计的销障工单信息
   * returns {Observable<Object>}
   */
  getStatisticsByDeviceType(body): Observable<Object>;

  /**
   * 工单状态统计的销障工单信息
   * returns {Observable<Object>}
   */
  getStatisticsByStatus(body): Observable<Object>;

  /**
   * 退单
   * param body
   * returns {Observable<Object>}
   */
  sendBackWorkOrder(body): Observable<Object>;

  /**
   * 撤回工单
   * param body
   * returns {Observable<Object>}
   */
  revokeWorkOrder(body): Observable<Object>;

  /**
   * 指派工单
   * param body
   * param ids
   * returns {Observable<Object>}
   */
  assignWorkOrder(body, ids): Observable<Object>;

  /**
   * 退单确认
   * param body
   * returns {Observable<Object>}
   */
  singleBackConfirm(body): Observable<Object>;

  /**
   * 导出未完工销障工单
   * param body
   * returns {Observable<Object>}
   */
  exportUnfinishedWorkOrder(body): Observable<Object>;

  /**
   * 导出历史销障工单
   * param body
   * returns {Observable<Object>}
   */
  exportHistoryWorkOrder(body): Observable<Object>;

  /**
   * 退单重新生成
   */
  RefundGeneratedAgain(body): Observable<Object>;

  /**
   * 首页设施销障工单
   * param id
   * returns {Observable<Object>}
   */
  getFiveWorkOrder(id): Observable<Object>;

  /**
   * 查询未完成工单详情
   */
  getClearFailureByIdForProcess(id): Observable<Object>;

  /**
   * 查询历史工单详情
   */
  getClearFailureByIdForComplete(id): Observable<Object>;

  /**
   * 关联告警
   */
  getRefAlarmInfo(body): Observable<Object>;
}
