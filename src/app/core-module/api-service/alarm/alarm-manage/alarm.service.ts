import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AlarmInterface} from './alarm.interface';
import {Observable} from 'rxjs';
import {
  ADD_ALARM_FILTRATION,
  ADD_ALARM_REMOTE,
  ADD_ALARM_STATISTICAL_TEMPLATE,
  ADD_ALARM_TEMPLATE,
  ADD_ALARM_WORK,
  ADD_CLEAR_FAILURE_PROC,
  ALARM_INCREMENTAL_STATISTICS,
  ALARM_QUERY_TEMPLATE,
  ALARM_STATISTICAL_LIST,
  APDATE_ALARM_FILTRATION,
  APDATE_ALARM_WORK,
  AREA_ALARM_STATISTICS,
  AREA_GET_UNIT,
  AREA_LIST_BY_ID,
  DELETE_ALARM_CURRENTSET,
  DELETE_ALARM_FILTRATION,
  DELETE_ALARM_REMOTE,
  DELETE_ALARM_STATISTICAL,
  DELETE_ALARM_TEMPLATE_LIST,
  DELETE_ALARM_WORK,
  DEVICE_DETAIL_ALARM_STATISTICS,
  EXAMINE_PICTURE,
  EXAMINE_PICTURE_HISTORY,
  QUERY_ALARM_HISTORY_TEMPLATE,
  DELETE_ALARM_HISTORY_TEMPLATE_LIST,
  ADD_ALARM_HISTORY_TEMPLATE,
  UPDATE_ALARM_HISTORY_TEMPLATE,
  QUERY_ALARM_HISTORY_TEMPLATE_BY_ID,
  ALARMM_HISTORY_QUERY_TEMPLATE,
  EXPORT_ALARM_LIST,
  EXPORT_ALARM_STATISTICAL,
  EXPORT_HISTORY_ALARM_LIST,
  INSERR_ALARM_CURRENTSET,
  QUERY_ALARM_CONUT_BY_LEVEL_AND_AREA,
  QUERY_ALARM_CURRENT_INFO_BY_ID,
  QUERY_ALARM_CURRENT_LIST,
  QUERY_ALARM_CURRENT_PAGE,
  QUERY_ALARM_CURRENT_SET_LIST,
  QUERY_ALARM_DELAY,
  QUERY_ALARM_DEVICE_ID,
  QUERY_ALARM_DEVICE_ID_COUNT_HONE_PAGE,
  QUERY_ALARM_FILTRATION,
  QUERY_ALARM_FILTRATION_OBJ,
  QUERY_ALARM_HANDLE,
  QUERY_ALARM_HISTORY_DEVICE_ID,
  QUERY_ALARM_HISTORY_INFO_BY_ID,
  QUERY_ALARM_HISTORY_LIST,
  QUERY_ALARM_ID_COUNT_HONE_PAGE,
  QUERY_ALARM_ID_HONE_PAGE,
  QUERY_ALARM_INFO_BY_ID,
  QUERY_ALARM_LEVEL,
  QUERY_ALARM_LEVEL_BY_ID,
  QUERY_ALARM_LEVEL_LIST,
  QUERY_ALARM_LEVEL_SET_BY_ID,
  QUERY_ALARM_NAME,
  QUERY_ALARM_NAME_STATISTICS,
  QUERY_ALARM_OBJECT_COUNT,
  QUERY_ALARM_OBJECT_COUNT_HONE_PAGE, QUERY_ALARM_ORDER_RULE_BY_DEPT_IDS,
  QUERY_ALARM_REMOTE,
  QUERY_ALARM_REMOTE_BY_ID,
  QUERY_ALARM_SET_LIST,
  QUERY_ALARM_STAt_BY_TEMP_ID,
  QUERY_ALARM_STAt_TEMP,
  QUERY_ALARM_TEMPLATE_BY_ID,
  QUERY_ALARM_USER,
  QUERY_ALARM_WORK,
  QUERY_ALARM_WORK_BY_ID,
  QUERY_DEPARTMENT_HISTORY,
  QUERY_DEPARTMENT_ID,
  QUERY_DEVICE_TYPE_BY_AREAIDS,
  QUERY_EVERY_ALARM_COUNT,
  QUERY_TEMPLATE,
  QUERY_USER_INFOBY_DEPT_AND_DEVICE_TYPE,
  SELECT_ALARM_ENUM,
  SELECT_FOREIGN_AREA_INFO,
  SELECT_FOREIGN_DEVICE_TYPE_INFO,
  UPDATE_ALARM_CLEAN_STATUS,
  UPDATE_ALARM_COLOR_AND_SOUND,
  UPDATE_ALARM_CONFIRM_STATUS,
  UPDATE_ALARM_CURRENTSET,
  UPDATE_ALARM_DELAY,
  UPDATE_ALARM_FILTRATION,
  UPDATE_ALARM_FILTRATION_REMOTE_PUSHTYPE,
  UPDATE_ALARM_FILTRATION_REMOTE_STORED,
  UPDATE_ALARM_FILTRATION_STORED,
  UPDATE_ALARM_FILTRATION_WORK_STORED,
  UPDATE_ALARM_LEVEL,
  UPDATE_ALARM_REMARK,
  UPDATE_ALARM_REMOTE,
  UPDATE_ALARM_STATISTICAL_TEMPLATE,
  UPDATE_ALARM_TEMPLATE,
  UPDATE_HISTORY_ALARM_REMARK,
  WEBSOCKET,
  ORDER_CANCEL_ACCOUNT,
  GET_DIAGNOSTIC_DATA,
  DIAGNOSTIC_UPDATE,
  QUERY_EXPERIENCE_INFO,
  ALARM_TO_TROUBLE,
  ALARM_MIS_JUDGMENT,
  ALARM_PROCESSED,
  ELIMINATE_WORK,
  DELETE_ALARM_SET,
  QUERY_ALARM_TYPE_LIST,
  ALARM_NAME_EXIST,
  ALARM_CODE_EXIST
} from '../alarm-request-url';

@Injectable()
export class AlarmService implements AlarmInterface {

  constructor(private $http: HttpClient) {
  }

  queryCurrentAlarmList(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_CURRENT_LIST}`, body);
  }

  queryCurrentAlarmInfoById(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_CURRENT_INFO_BY_ID}`, body);
  }

  // 当前告警 修改备注
  updateAlarmRemark(body): Observable<Object> {
    return this.$http.post(`${UPDATE_ALARM_REMARK}`, body);
  }


  updateAlarmConfirmStatus(body): Observable<Object> {
    return this.$http.post(`${UPDATE_ALARM_CONFIRM_STATUS}`, body);
  }

  updateAlarmCleanStatus(body): Observable<Object> {
    return this.$http.post(`${UPDATE_ALARM_CLEAN_STATUS}`, body);
  }

  queryEveryAlarmCount(id: number): Observable<Object> {
    return this.$http.post(`${QUERY_EVERY_ALARM_COUNT}`, id);
  }
  queryAlarmDeviceIdHonePage(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_DEVICE_ID_COUNT_HONE_PAGE}`, body);
  }
  queryAlarmHistoryList(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_HISTORY_LIST}`, body);
  }

  queryAlarmHistoryInfoById(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_HISTORY_INFO_BY_ID}`, body);
  }

  queryAlarmLevelList(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_LEVEL_LIST}`, body);
  }

  queryDepartmentHistory(body): Observable<Object> {
    return this.$http.post(QUERY_DEPARTMENT_HISTORY, body);
  }

  queryAlarmCurrentSetList(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_CURRENT_SET_LIST}`, body);
  }

  queryAlarmCurrentPage(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_CURRENT_PAGE}`, body);
  }

  // 当前告警设置
  queryAlarmSetList(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_SET_LIST}`, body);
  }

  updateAlarmColorAndSound(body): Observable<Object> {
    return this.$http.put(`${UPDATE_ALARM_COLOR_AND_SOUND}`, body);
  }

  updateAlarmLevel(body): Observable<Object> {
    return this.$http.post(`${UPDATE_ALARM_LEVEL}`, body);
  }

  insertAlarmCurrentSet(body): Observable<Object> {
    return this.$http.post(`${INSERR_ALARM_CURRENTSET}`, body);
  }

  updateAlarmCurrentSet(body): Observable<Object> {
    return this.$http.post(`${UPDATE_ALARM_CURRENTSET}`, body);
  }

  queryAlarmLevelSetById(id: string): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_LEVEL_SET_BY_ID}`, [id]);
  }

  deleteAlarmCurrentSet(body): Observable<Object> {
    return this.$http.post(`${DELETE_ALARM_CURRENTSET}`, body);
  }


  queryAlarmLevelById(id: string): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_LEVEL_BY_ID}` + `${id}`, null);
  }

  queryAlarmDelay(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_DELAY}`, body);
  }

  updateAlarmDelay(body): Observable<Object> {
    return this.$http.post(`${UPDATE_ALARM_DELAY}`, body);
  }

  selectAlarmEnum(body): Observable<Object> {
    return this.$http.post(`${SELECT_ALARM_ENUM}`, body);
  }

  websocket(): Observable<Object> {
    return this.$http.get(`${WEBSOCKET}`);
  }

  queryAlarmName(): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_NAME}`, {});
  }

  queryAlarmLevel(): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_LEVEL}`, {});
  }

  queryDepartmentId(body): Observable<Object> {
    return this.$http.post(`${QUERY_DEPARTMENT_ID}`, body);
  }

  queryAlarmObjectList(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_FILTRATION_OBJ}`, body);
  }

  queryAlarmFiltration(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_FILTRATION}`, body);
  }

  // 查询告警远程通知列表所有信息
  queryAlarmRemote(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_REMOTE}`, body);
  }

  // 查询告警转工单列表信息
  queryAlarmWorkOrder(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_WORK}`, body);
  }

  deleteAlarmFiltration(body): Observable<Object> {
    return this.$http.post(`${DELETE_ALARM_FILTRATION}`, body);
  }

  // 告警远程通知 删除
  deleteAlarmRemote(body): Observable<Object> {
    return this.$http.post(`${DELETE_ALARM_REMOTE}`, body);
  }

  // 告警转工单
  deleteAlarmWork(body): Observable<Object> {
    return this.$http.post(`${DELETE_ALARM_WORK}`, body);
  }

  updateStatus(status: number, idArray: any): Observable<Object> {
    return this.$http.post(`${UPDATE_ALARM_FILTRATION}?status=${status}&idArray=${idArray}`, {});
  }

  // 告警远程通知 修改启禁状态
  updateRemoteStatus(status: number, idArray: any): Observable<Object> {
    return this.$http.post(`${UPDATE_ALARM_FILTRATION_REMOTE_STORED}?status=${status}&idArray=${idArray}`, {});
  }

  // 告警转工单 修改启禁状态
  updateWorkStatus(status: number, idArray: any): Observable<Object> {
    return this.$http.post(`${UPDATE_ALARM_FILTRATION_WORK_STORED}?status=${status}&idArray=${idArray}`, {});
  }

  updateAlarmStorage(storage: number, idArray: any): Observable<Object> {
    return this.$http.post(`${UPDATE_ALARM_FILTRATION_STORED}?stored=${storage}&idArray=${idArray}`, {});
  }

  // 告警远程通知 修改推送方式
  updateAlarmRemotePushType(storage: number, idArray: any): Observable<Object> {
    return this.$http.post(`${UPDATE_ALARM_FILTRATION_REMOTE_PUSHTYPE}?pushType=${storage}&idArray=${idArray}`, {});
  }

  addAlarmFiltration(body): Observable<Object> {
    return this.$http.post(`${ADD_ALARM_FILTRATION}`, body);
  }

  // 修改告警过滤信息
  updateAlarmFiltration(body): Observable<Object> {
    return this.$http.post(`${APDATE_ALARM_FILTRATION}`, body);
  }

  // 根据id查询整条数据
  queryAlarmById(id: string[]): Observable<Object> {
    return this.$http.get(`${QUERY_ALARM_INFO_BY_ID}` + `/${id}`);
  }

  // 告警转工单 新增
  addAlarmWork(body): Observable<Object> {
    return this.$http.post(`${ADD_ALARM_WORK}`, body);
  }

  // 告警转工单 编辑
  updateAlarmWork(body): Observable<Object> {
    return this.$http.post(`${APDATE_ALARM_WORK}`, body);
  }

  queryAlarmDeviceId(id): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_DEVICE_ID}/${id}`, {});
  }

  queryAlarmHistoryDeviceId(id): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_HISTORY_DEVICE_ID}/${id}`, {});
  }

  // 告警转工单 根据id查询整条数据
  queryAlarmWorkById(id: string[]): Observable<Object> {
    return this.$http.get(`${QUERY_ALARM_WORK_BY_ID}` + `/${id}`);
  }

  // 告警远程通知 新增页面 请求通知人
  queryUser(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_USER}`, body);
  }

  // 告警远程通知 新增页面 通过区域 设施类型 查询通知人
  queryUserInfoByDeptAndDeviceType(body): Observable<Object> {
    return this.$http.post(`${QUERY_USER_INFOBY_DEPT_AND_DEVICE_TYPE}`, body);
  }

  // 告警远程通知 新增
  addAlarmRemote(body): Observable<Object> {
    return this.$http.post(`${ADD_ALARM_REMOTE}`, body);
  }

  // 告警远程通知 编辑
  updateAlarmRemarklist(body): Observable<Object> {
    return this.$http.post(`${UPDATE_ALARM_REMOTE}`, body);
  }

  // 告警远程通知 根据id查询整条数据
  queryAlarmRemoteById(id: string[]): Observable<Object> {
    return this.$http.get(`${QUERY_ALARM_REMOTE_BY_ID}` + `/${id}`);
  }

  // 告警远程通知 通过ID查询 通知人相关信息
  queryUserById(id: string[]): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_REMOTE_BY_ID}` + `/${id}`, null);
  }

  // 告警远程通知 新增页面 根据通知人查询 区域
  areaListById(id: string[]): Observable<Object> {
    return this.$http.post(`${AREA_LIST_BY_ID}` + `/${id}`, null);
  }

  // 当前告警 查询模板列表信息
  queryAlarmTemplateList(body): Observable<Object> {
    return this.$http.post(`${QUERY_TEMPLATE}`, body);
  }

  // 告警统计 模板查询
  alarmStatisticalList(body): Observable<Object> {
    return this.$http.post(`${ALARM_STATISTICAL_LIST}` + `/${body}`, null);
  }

  // 当前告警 模板列表 删除数据
  deleteAlarmTemplateList(id: string[]): Observable<Object> {
    return this.$http.post(`${DELETE_ALARM_TEMPLATE_LIST}`, id);
  }

  // 告警转工单 获取相关区域
  getArea(id: string[]): Observable<Object> {
    return this.$http.post(`${SELECT_FOREIGN_AREA_INFO}`, id);
  }

  // 告警远程通知 通知区域获取单位
  areaGtUnit(body): Observable<Object> {
    return this.$http.post(`${AREA_GET_UNIT}`, body);
  }

  // 告警远程通知 通过区域获取设施类型
  getDeviceType(body): Observable<Object> {
    return this.$http.post(`${QUERY_DEVICE_TYPE_BY_AREAIDS}`, body);
  }

  // 告警转工单 获取相关设施类型
  getDeviceTypeList(id: string[]): Observable<Object> {
    return this.$http.post(`${SELECT_FOREIGN_DEVICE_TYPE_INFO}`, id);
  }

  // 当前告警 导出
  exportAlarmList(body): Observable<Object> {
    return this.$http.post(`${EXPORT_ALARM_LIST}`, body);
  }

  // 历史告警 导出
  exportHistoryAlarmList(body): Observable<Object> {
    return this.$http.post(`${EXPORT_HISTORY_ALARM_LIST}`, body);
  }

  // 当前告警 查看图片
  examinePicture(alarmId): Observable<Object> {
    return this.$http.get(`${EXAMINE_PICTURE}` + `/${alarmId}`, {});
  }

  // 历史告警 查看图片
  examinePictureHistory(alarmId): Observable<Object> {
    return this.$http.get(`${EXAMINE_PICTURE_HISTORY}` + `/${alarmId}`, {});
  }

  // 当前告警 创建工单
  addClearFailureProc(body): Observable<Object> {
    return this.$http.post(`${ADD_CLEAR_FAILURE_PROC}`, body);
  }

  // 当前告警 模板查询
  alarmQueryTemplateById(id: string, pageCondition): Observable<Object> {
    return this.$http.post(`${ALARM_QUERY_TEMPLATE}` + `/${id}`, pageCondition);
  }

  // 当前告警 新增模板
  addAlarmTemplate(body): Observable<Object> {
    return this.$http.post(`${ADD_ALARM_TEMPLATE}`, body);
  }

  // 当前告警 编辑模板
  updataAlarmTemplate(body): Observable<Object> {
    return this.$http.post(`${UPDATE_ALARM_TEMPLATE}`, body);
  }

  // 当前告警 告警模板 通过ID查询数据
  queryAlarmTemplateById(id: string[]): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_TEMPLATE_BY_ID}` + `/${id}`, null);
  }

  // 历史告警 修改备注
  updateHistoryAlarmRemark(body): Observable<Object> {
    return this.$http.post(`${UPDATE_HISTORY_ALARM_REMARK}`, body);
  }

  // 告警类型统计
  queryAlarmConutByLevelAndArea(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_CONUT_BY_LEVEL_AND_AREA}`, body);
  }

  // 告警处理统计
  queryAlarmHandle(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_HANDLE}`, body);
  }

  // 告警名称统计
  queryAlarmNameStatistics(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_NAME_STATISTICS}`, body);
  }

  // 区域告警比统计
  areaAlarmStatistics(body): Observable<Object> {
    return this.$http.post(`${AREA_ALARM_STATISTICS}`, body);
  }

  // 告警增量统计
  alarmIncrementalStatistics(body): Observable<Object> {
    return this.$http.post(`${ALARM_INCREMENTAL_STATISTICS}`, body);
  }

  // 模板统计删除
  deleteAlarmStatistical(id: string[]): Observable<Object> {
    return this.$http.post(`${DELETE_ALARM_STATISTICAL}`, id);
  }

  // 模板统计新增
  addAlarmStatisticalTemplate(body): Observable<Object> {
    return this.$http.post(`${ADD_ALARM_STATISTICAL_TEMPLATE}`, body);
  }

  // 告警模板 通过ID查询 当条数据
  queryAlarmStatByTempId(id: string[]): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_STAt_BY_TEMP_ID}` + `/${id}`, null);
  }

  // 告警模板 通过选择的模板查询
  queryAlarmStatTemp(id: string[]): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_STAt_TEMP}` + `/${id}`, null);
  }

  // 编辑 告警模板
  updateAlarmStatisticalTemplate(body): Observable<Object> {
    return this.$http.post(`${UPDATE_ALARM_STATISTICAL_TEMPLATE}`, body);
  }

  queryAlarmObjectCount(id: string): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_OBJECT_COUNT}`, id);
  }
  queryAlarmIdCountHonePage(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_ID_COUNT_HONE_PAGE}`, body);
  }
  queryAlarmIdHonePage(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_ID_HONE_PAGE}`, body);
  }
  queryAlarmObjectCountHonePage(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_OBJECT_COUNT_HONE_PAGE}`, body);
  }
  currentLevelStatistics(body): Observable<Object> {
    return this.$http.post(`${DEVICE_DETAIL_ALARM_STATISTICS.currentLevel}`, body);
  }

  historyLevelStatistics(body): Observable<Object> {
    return this.$http.post(`${DEVICE_DETAIL_ALARM_STATISTICS.historyLevel}`, body);
  }

  currentSourceNameStatistics(body): Observable<Object> {
    return this.$http.post(`${DEVICE_DETAIL_ALARM_STATISTICS.currentSourceName}`, body);
  }

  historySourceNameStatistics(body): Observable<Object> {
    return this.$http.post(`${DEVICE_DETAIL_ALARM_STATISTICS.historySourceName}`, body);
  }
  // 告警统计页面
  exportAlarmStatistical(body): Observable<Object> {
    return this.$http.post(`${EXPORT_ALARM_STATISTICAL}`, body);
  }
  queryAlarmSourceIncremental(body): Observable<Object> {
    return this.$http.post(`${DEVICE_DETAIL_ALARM_STATISTICS.alarmSourceIncremental}`, body);
  }

  queryAlarmOrderRuleByDeptIds(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_ORDER_RULE_BY_DEPT_IDS}`, body);
  }
  // 历史告警 查询模板列表信息
  queryHistoryAlarmTemplateList(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_HISTORY_TEMPLATE}`, body);
  }

  // 历史告警 模板列表 删除数据
  deleteHistoryAlarmTemplateList(id: string[]): Observable<Object> {
    return this.$http.post(`${DELETE_ALARM_HISTORY_TEMPLATE_LIST}`, id);
  }

  // 历史告警 新增模板
  addHistoryAlarmTemplate(body): Observable<Object> {
    return this.$http.post(`${ADD_ALARM_HISTORY_TEMPLATE}`, body);
  }

  // 历史告警 编辑模板
  updataHistoryAlarmTemplate(body): Observable<Object> {
    return this.$http.post(`${UPDATE_ALARM_HISTORY_TEMPLATE}`, body);
  }

  // 历史告警 告警模板 通过ID查询数据
  queryHistoryAlarmTemplateById(id: string[]): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_HISTORY_TEMPLATE_BY_ID}` + `/${id}`, null);
  }

  // 历史告警 模板查询 ORDER_CANCEL_ACCOUNT
  alarmHistoryQueryTemplateById(id: string, pageCondition): Observable<Object> {
    return this.$http.post(`${ALARMM_HISTORY_QUERY_TEMPLATE}` + `/${id}`, pageCondition);
  }
  // 派单销障
  orderCancelAccount(body): Observable<Object> {
      return this.$http.post(`${ORDER_CANCEL_ACCOUNT}`, body);
  }
  // 获取诊断设置数据
  getDiagnosticData(): Observable<Object> {
    return this.$http.get(`${GET_DIAGNOSTIC_DATA}`);
  }
  // 诊断设置
  diagnosticUpdate(body): Observable<Object> {
    return this.$http.post(`${DIAGNOSTIC_UPDATE}`, body);
  }
  // 告警建议
  queryExperienceInfo(id): Observable<Object> {
    return this.$http.get(`${QUERY_EXPERIENCE_INFO}` + `/${id}`);
  }
  // 告警转故障
  alarmToTrouble(id): Observable<Object> {
    return this.$http.get(`${ALARM_TO_TROUBLE}` + `/${id}`);
  }
  // 误判
  alarmMisJudgment(id): Observable<Object> {
    return this.$http.get(`${ALARM_MIS_JUDGMENT}` + `/${id}`);
  }
  // 已处理
  alarmProcessed(id): Observable<Object> {
    return this.$http.get(`${ALARM_PROCESSED}` + `/${id}`);
  }
  // 销障工单
  eliminateWork(id): Observable<Object> {
    return this.$http.get(`${ELIMINATE_WORK}` + `/${id}`);
  }
  // 告警设置删除
  deleteAlarmSet(body): Observable<Object> {
    return this.$http.post(`${DELETE_ALARM_SET}`, body);
  }
  // 告警类型
  getAlarmTypeList(): Observable<Object> {
    return this.$http.get(`${QUERY_ALARM_TYPE_LIST}`);
  }
  // 告警名称唯一性
  queryAlarmNameExist(body): Observable<Object> {
    return this.$http.post(`${ALARM_NAME_EXIST}`, body);
  }
  // 告警代码唯一性
  queryAlarmCodeExist(body): Observable<Object> {
    return this.$http.post(`${ALARM_CODE_EXIST}`, body);
  }
}

