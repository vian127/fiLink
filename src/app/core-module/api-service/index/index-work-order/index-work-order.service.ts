import {IndexWorkOrderInterface} from './index-work-order.interface';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  INDEX_WORK_ORDER_SERVER,
  ALARM_CURRENT_SERVER_DJ,
  ALARM_HISTORY_SERVER_DJ,
  EQUIPMENT_SERVER
} from '../../api-common.config';
import {
  ClearWorkOrderModel,
  InspectionWorkOrderModel,
  WorkOrderConditionModel, WorkOrderStateModel, WorkOrderStateResultModel,
  WorkOrderTypeModel
} from '../../../../business-module/index/shared/model/work-order-condition.model';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {ResultModel} from '../../../model/result.model';
import {LogModel} from '../../../../business-module/index/shared/model/log-operating.model';
import {AlarmModel} from '../../../../business-module/index/shared/model/area-facility-model';

@Injectable()
export class IndexWorkOrderService implements IndexWorkOrderInterface {
  constructor(private $http: HttpClient) {
  }

  // 首页工单数量统计
  queryProcCountOverviewForHome(body: WorkOrderConditionModel): Observable<ResultModel<WorkOrderTypeModel[]>> {
    return this.$http.post<ResultModel<WorkOrderTypeModel[]>>(`${INDEX_WORK_ORDER_SERVER}/home/queryProcCountOverviewForHome`, body);
  }

  // 首页销障工单列表
  queryClearListForHome(body: QueryCondition): Observable<ResultModel<ClearWorkOrderModel[]>> {
    return this.$http.post<ResultModel<ClearWorkOrderModel[]>>(`${INDEX_WORK_ORDER_SERVER}/home/queryClearListForHome`, body);
  }

  // 首页根据设施id查询销障工单的信息
  queryClearListByDeviceIdForHome(body: QueryCondition): Observable<ResultModel<ClearWorkOrderModel[]>> {
    return this.$http.post<ResultModel<ClearWorkOrderModel[]>>(`${INDEX_WORK_ORDER_SERVER}/home/queryClearListByDeviceIdForHome`, body);
  }

  // 获取设备详情卡中巡检工单列表
  queryInspectionListByEquipmentIdForHome(body: QueryCondition): Observable<ResultModel<InspectionWorkOrderModel[]>> {
    return this.$http.post<ResultModel<InspectionWorkOrderModel[]>>
    (`${INDEX_WORK_ORDER_SERVER}/home/queryInspectionListByEquipmentIdForHome`, body);
  }

  // 获取设备详情卡中销障工单列表
  queryClearListByEquipmentIdForHome(body: QueryCondition): Observable<ResultModel<ClearWorkOrderModel[]>> {
    return this.$http.post<ResultModel<ClearWorkOrderModel[]>>(`${INDEX_WORK_ORDER_SERVER}/home/queryClearListByEquipmentIdForHome`, body);
  }

  // 查询巡检工单列表
  queryInspectionListForHome(body: QueryCondition): Observable<ResultModel<InspectionWorkOrderModel[]>> {
    return this.$http.post<ResultModel<InspectionWorkOrderModel[]>>(`${INDEX_WORK_ORDER_SERVER}/home/queryInspectionListForHome`, body);
  }

  // 首页查询工单状态统计
  queryListOverviewGroupByProcStatusForHome(body: WorkOrderConditionModel): Observable<ResultModel<WorkOrderStateResultModel[]>> {
    return this.$http.post<ResultModel<WorkOrderStateResultModel[]>>
    (`${INDEX_WORK_ORDER_SERVER}/home/queryListOverviewGroupByProcStatusForHome`, body);
  }

  // 获取设施详情卡中巡检工单列表
  queryInspectionListByDeviceIdForHome(body: QueryCondition): Observable<ResultModel<InspectionWorkOrderModel[]>> {
    return this.$http.post<ResultModel<InspectionWorkOrderModel[]>>
    (`${INDEX_WORK_ORDER_SERVER}/home/queryInspectionListByDeviceIdForHome`, body);
  }

  // 获取设施详情卡中当前告警列表
  getAlarmInfoListById(body: QueryCondition): Observable<ResultModel<AlarmModel[]>> {
    return this.$http.post<ResultModel<AlarmModel[]>>(`${ALARM_CURRENT_SERVER_DJ}/alarmCurrent/getAlarmInfoListById`, body);
  }

  // 获取设施详情卡中历史告警列表
  getAlarmHisInfoListById(body: QueryCondition): Observable<ResultModel<AlarmModel[]>> {
    return this.$http.post<ResultModel<AlarmModel[]>>(`${ALARM_HISTORY_SERVER_DJ}/alarmHistory/getAlarmHisInfoListById`, body);
  }

  // 获取详情卡中日志列表
  deviceLogListByPage(body: QueryCondition): Observable<ResultModel<LogModel[]>> {
    return this.$http.post<ResultModel<LogModel[]>>(`${EQUIPMENT_SERVER }/deviceLog/deviceLogListByPage`, body);
  }
}

