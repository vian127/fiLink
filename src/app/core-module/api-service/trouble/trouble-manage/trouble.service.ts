import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TroubleInterface} from './trouble.interface';
import {Observable} from 'rxjs';
import {
  QUERY_TROUBLE_LIST,
  QUERY_TROUBLE_DETAIL,
  QUERY_TROUBLE_SHOW_TYPE,
  QUERY_TROUBLE_TYPE,
  ADD_TROUBLE,
  DELETE_TROUBLE,
  TROUBLE_REMARK,
  UPDATE_TROUBLE,
  QUERY_TROUBLE_PROCESS,
  QUERY_TROUBLE_PROCESS_HISTORY,
  GET_SUPERIOR_DEPARTMENT,
  GET_FLOWCHART,
  QUERY_DEPART_NAME,
  TROUBLE_ASSIGN,
  QUERY_DEVICE_LIST,
  QUERY_EQUIPMENT_LIST
} from '../trouble-request-url';

@Injectable()
export class TroubleService implements TroubleInterface {

  constructor(private $http: HttpClient) {
  }
  // 故障列表
  queryTroubleList(body): Observable<Object> {
    return this.$http.post(`${QUERY_TROUBLE_LIST}`, body);
  }
  // 故障卡片
  queryTroubleLevel(id): Observable<Object> {
    return this.$http.get(`${QUERY_TROUBLE_SHOW_TYPE}/${id}`);
  }
  // 故障详情
  queryTroubleDetail(id): Observable<Object> {
    return this.$http.get(`${QUERY_TROUBLE_DETAIL}/${id}`);
  }
  // 故障类型
  queryTroubleType(): Observable<Object> {
    return this.$http.get(`${QUERY_TROUBLE_TYPE}`);
  }
  // 新增故障
  addTrouble(body): Observable<Object> {
    return this.$http.post(`${ADD_TROUBLE}`, body);
  }
  // 删除故障
  deleteTrouble(body): Observable<Object> {
    return this.$http.post(`${DELETE_TROUBLE}`, body);
  }
  // 故障备注
  troubleRemark(body): Observable<Object> {
    return this.$http.post(`${TROUBLE_REMARK}`, body);
  }
  // 编辑故障
  updateTrouble(id): Observable<Object> {
    return this.$http.get(`${UPDATE_TROUBLE}/${id}`);
  }
  // 查看故障流程
  queryTroubleProcess(id): Observable<Object> {
    return this.$http.get(`${QUERY_TROUBLE_PROCESS}/${id}`);
  }
  // 查看故障历史流程
  queryTroubleProcessHistory(id): Observable<Object> {
    return this.$http.get(`${QUERY_TROUBLE_PROCESS_HISTORY}/${id}`);
  }
  // 获取当前单位上级单位
  getSuperiorDepartment(id): Observable<Object> {
    return this.$http.get(`${GET_SUPERIOR_DEPARTMENT}/${id}`);
  }
  // 获取部门id查询责任人
  queryDepartName(id): Observable<Object> {
    return this.$http.get(`${QUERY_DEPART_NAME}/${id}`);
  }
  // 获取流程图
  getFlowChart(id): Observable<Object> {
    return this.$http.get(`${GET_FLOWCHART}/${id}`, {responseType: 'blob'});
  }
  // 故障指派
  troubleAssign(body): Observable<Object> {
    return this.$http.post(`${TROUBLE_ASSIGN}`, body);
  }
  // 故障设施
  queryDevice(body): Observable<Object> {
    return this.$http.post(`${QUERY_DEVICE_LIST}`, body);
  }
  // 故障设备
  queryEquipment(body): Observable<Object> {
    return this.$http.post(`${QUERY_EQUIPMENT_LIST}`, body);
  }
}

