import {Observable} from 'rxjs';

export interface TroubleInterface {
  // 故障列表
  queryTroubleList(body): Observable<Object>;
  // 故障卡片
  queryTroubleLevel(id: string[]): Observable<Object>;
  // 故障详情
  queryTroubleDetail(id: string[]): Observable<Object>;
  // 故障类型
  queryTroubleType(): Observable<Object>;
  // 新增故障
  addTrouble(body): Observable<Object>;
  // 删除故障
  deleteTrouble(body): Observable<Object>;
  // 故障备注
  troubleRemark(body): Observable<Object>;
  // 故障编辑
  updateTrouble(id): Observable<Object>;
  // 查看故障流程
  queryTroubleProcess(id): Observable<Object>;
  // 查看故障历史流程
  queryTroubleProcessHistory(id): Observable<Object>;
  // 获取当前单位的上级单位
  getSuperiorDepartment(id): Observable<Object>;
  // 获取部门id查询责任人
  queryDepartName(id): Observable<Object>;
  // 获取流程图
  getFlowChart(id): Observable<Object>;
  // 故障指派
  troubleAssign(body): Observable<Object>;
  // 故障设施
  queryDevice(body): Observable<Object>;
  // 故障设备
  queryEquipment(body): Observable<Object>;
}

