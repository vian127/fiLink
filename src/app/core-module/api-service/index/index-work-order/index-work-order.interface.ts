import {Observable} from 'rxjs';
import {
  ClearWorkOrderModel, InspectionWorkOrderModel,
  WorkOrderConditionModel, WorkOrderStateResultModel,
  WorkOrderTypeModel
} from '../../../../business-module/index/shared/model/work-order-condition.model';
import {ResultModel} from '../../../model/result.model';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {AlarmModel} from '../../../../business-module/index/shared/model/area-facility-model';
import {LogModel} from '../../../../business-module/index/shared/model/log-operating.model';

export interface IndexWorkOrderInterface {
  /**
   * 首页工单数量统计
   * returns {Observable<Object>}
   */
  queryProcCountOverviewForHome(body: WorkOrderConditionModel): Observable<ResultModel<WorkOrderTypeModel[]>>;

  /**
   * 首页销障工单列表
   * returns {Observable<Object>}
   */
  queryClearListForHome(body: QueryCondition): Observable<ResultModel<ClearWorkOrderModel[]>>;

  /**
   * 首页根据设施id查询销障工单的信息
   * returns {Observable<Object>}
   */
  queryClearListByDeviceIdForHome(body: QueryCondition): Observable<ResultModel<ClearWorkOrderModel[]>>;

  /**
   * 获取设备详情卡中巡检工单列表
   * returns {Observable<Object>}
   */
  queryInspectionListByEquipmentIdForHome(body: QueryCondition): Observable<ResultModel<InspectionWorkOrderModel[]>>;

  /**
   * 获取设备详情卡中巡检工单列表
   * returns {Observable<Object>}
   */
  queryClearListByEquipmentIdForHome(body: QueryCondition): Observable<ResultModel<ClearWorkOrderModel[]>>;


  /**
   * 查询巡检工单列表
   * returns {Observable<Object>}
   */
  queryInspectionListForHome(body: QueryCondition): Observable<ResultModel<InspectionWorkOrderModel[]>>;

  /**
   * 查询各工单类型及其下工单数量
   * returns {Observable<Object>}
   */
  queryListOverviewGroupByProcStatusForHome(body: WorkOrderConditionModel): Observable<ResultModel<WorkOrderStateResultModel[]>>;

  /**
   * 查询各工单类型及其下工单数量
   * returns {Observable<Object>}
   */
  queryInspectionListByDeviceIdForHome(body: QueryCondition): Observable<ResultModel<InspectionWorkOrderModel[]>>;

  /**
   * 获取设施详情卡中当前告警列表
   * returns {Observable<Object>}
   */
  getAlarmInfoListById(body: QueryCondition): Observable<ResultModel<AlarmModel[]>>;

  /**
   * 获取设施详情卡中历史告警列表
   * returns {Observable<Object>}
   */
  getAlarmHisInfoListById(body: QueryCondition): Observable<ResultModel<AlarmModel[]>>;

  /**
   * 获取详情卡中日志列表
   * returns {Observable<Object>}
   */
  deviceLogListByPage(body: QueryCondition): Observable<ResultModel<LogModel[]>>;
}
