import {Injectable} from '@angular/core';
import {ClearBarrierInterface} from './clear-barrier.interface';
import {Observable} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {WORK_ORDER_URL} from '../work-order-request-url';

/**
 * 销障工单接口
 */
@Injectable()
export class ClearBarrierService implements ClearBarrierInterface {
  constructor(
    private $http: HttpClient
  ) {
  }

  getUnfinishedWorkOrderList(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_UNFINISHED_CLEAR_BARRIER_WORK_ORDER_LIST_ALL}`, body);
  }

  getHistoryWorkOrderList(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_HISTORY_CLEAR_BARRIER_WORK_ORDER_LIST_ALL}`, body);
  }

  checkName(name, id): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.CHECK_CLEAR_BARRIER_WORK_ORDER_NAME_EXIST}`, {title: name, procId: id});
  }

  getAssignedStatistics(): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_ASSIGNED_CLEAR_BARRIER_WORK_ORDER_STATISTICS}`, {});
  }

  getProcessingStatistics(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_PROCESSING_CLEAR_BARRIER_WORK_ORDER_STATISTICS}`, body);
  }

  getPendingStatistics(): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_PENDING_CLEAR_BARRIER_WORK_ORDER_STATISTICS}`, {});
  }

  getIncreaseStatistics(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_INCREASE_CLEAR_BARRIER_WORK_ORDER_STATISTICS}`, body);
  }

  getUnfinishedStatistics(): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_UNFINISHED_CLEAR_BARRIER_WORK_ORDER_STATISTICS}`, {});
  }

  getHistoryStatistics(): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_HISTORY_CLEAR_BARRIER_WORK_ORDER_STATISTICS}`, {});
  }

  getStatisticsByErrorReason(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_CLEAR_BARRIER_WORK_ORDER_STATISTICS_BY_ERROR_REASON}`, body);
  }

  getStatisticsByProcessingScheme(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_CLEAR_BARRIER_WORK_ORDER_STATISTICS_BY_PROCESSING_SCHEME}`, body);
  }

  getStatisticsByDeviceType(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_CLEAR_BARRIER_WORK_ORDER_STATISTICS_BY_DEVICE_TYPE}`, body);
  }

  getStatisticsByStatus(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.GET_CLEAR_BARRIER_WORK_ORDER_STATISTICS_BY_STATUS}`, body);
  }

  sendBackWorkOrder(id): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.SEND_BACK_CLEAR_BARRIER_WORK_ORDER}`, {procId: id});
  }

  revokeWorkOrder(id): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.REVOKE_CLEAR_BARRIER_WORK_ORDER}`, {procId: id});
  }

  assignWorkOrder(id, departmentList): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.ASSIGN_CLEAR_BARRIER_WORK_ORDER}`, {procId: id, departmentList});
  }

  singleBackConfirm(id): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.SINGLE_BACK_CONFIRM}`, {procId: id});
  }

  getWorkOrderDetailById(id): Observable<Object> {
    return this.$http.get(`${WORK_ORDER_URL.GET_CLEAR_BARRIER_WORK_ORDER_BY_ID}/${id}`);
  }

  addWorkOrder(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.ADD_CLEAR_BARRIER_WORK_ORDER}`, body);
  }

  updateWorkOrder(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.UPDATE_CLEAR_BARRIER_WORK_ORDER}`, body);
  }

  deleteWorkOrder(ids): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.DELETE_CLEAR_BARRIER_WORK_ORDER}`, ids);
  }

  exportUnfinishedWorkOrder(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.EXPORT_UNFINISHED_CLEAR_BARRIER_WORK_ORDER}`, body);
  }

  exportHistoryWorkOrder(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.EXPORT_HISTORY_CLEAR_BARRIER_WORK_ORDER}`, body);
  }

  RefundGeneratedAgain(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.REFUND_GENERATED_AGAIN}`, body);
  }

  getFiveWorkOrder(id): Observable<Object> {
    return this.$http.get(`${WORK_ORDER_URL.GET_FIVE_CLEAR_BARRIER}/${id}`);
  }

  getWorkOrderDetail(id): Observable<Object> {
    return this.$http.get(`${WORK_ORDER_URL.GET_UNFINISHED_CLEAR_BARRIER_WORK_ORDER_DETAIL}/${id}`);
  }
  // 查询未完成详情
  getClearFailureByIdForProcess(id): Observable<Object> {
    return this.$http.get(`${WORK_ORDER_URL.GET_UNFINISHED_WORK_ORDER_DETAIL}/${id}`);
  }
  // 查询历史详情
  getClearFailureByIdForComplete(id): Observable<Object> {
    return this.$http.get(`${WORK_ORDER_URL.GET_HISTORY_WORK_ORDER_DETAIL}/${id}`);
  }
  // 关联告警 REF_ALARM_INFO
  getRefAlarmInfo(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.REF_ALARM_INFO}`, body);
  }
  // 运维建议信息
  getSuggestInfo(code): Observable<Object> {
  return this.$http.get(`${WORK_ORDER_URL.SUGGEST_INFO}/${code}`);
}
}
