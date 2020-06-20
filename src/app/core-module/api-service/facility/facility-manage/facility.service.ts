import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FacilityInterface} from './facility.interface';
import {
  ADD_CABLE,
  ADD_DEVICE,
  DELETE_CABLE_BY_ID,
  DELETE_DEVICE_BY_IDS,
  DEVICE_CAN_CHANGE_DETAIL,
  DEVICE_LOG_LIST_BY_PAGE,
  DEVICE_LOG_TIME,
  EXPORT_DEVICE_LIST,
  EXPORT_LOG_LIST,
  FIND_DEVICE_BY_ID,
  GET_CABLE_LIST,
  GET_CABLE_SEGMENT_LIST,
  GET_DETAIL_CODE,
  GET_DEVICE_STRATEGY,
  GET_PRAMS_CONFIG,
  GET_SMART_LABEL_LIST,
  PIC_RELATION_INFO,
  QUERY_CABLE_BY_ID,
  QUERY_DEVICE_NAME_IS_EXIST,
  QUERY_DEVICE_TYPE_COUNT,
  QUERY_HEARTBEAT_TIME,
  SET_DEVICE_STRATEGY,
  UPDATE_CABLE,
  UPDATE_DEVICE_BY_ID,
  GET_THE_FUSE_INFORMATION,
  GET_THE_FUSED_FIBER_INFORMATION,
  SAVE_THE_CORE_INFORMATION,
  QUERY_TOPOLOGY_BY_ID,
  GET_TOPOLGY,
  GET_OPTICCABLESECTIONID,
  EXPORT_CABLE_LIST,
  EXPORT_CABLE_SECTION_LIST,
  UPDATE_CABLEQUERYBYID,
  GET_PORT_CABLE_CORE_INFORMATION,
  FIND_FO_BYOPTIC_CABLE,
  DELETE_CABLE_SECTION_BY_ID,
  CHECK_CABLE_NAME,
  DELETE_RFID_INFO_BY_ID,
  DEVICEID_CHECK_USER_IF_DEVICE_PERMISSION,
  DEVICEID_CHECK_USER_IF_DEVICEDATA,
  DEVICE_LIST_BY_Lock_PAGE,
  UPDATE_SIM_PACKAGE,
  EXPERT_CONTROL,
  GET_CONTROL_BY_PACKAGE,
  DEVICE_LIST_BY_PAGE,
  GET_MODEL,
  AUTO_DEVICE_NAME,
  QUERY_MOUNT_EQUIPMENT, GET_PROJECT_LIST,
} from '../facility-request-url';
import {Observable} from 'rxjs';

/**
 * Created by xiaoconghu on 2019/1/14.
 */
@Injectable()
export class FacilityService implements FacilityInterface {
  constructor(private $http: HttpClient) {
  }

  deviceListOfLockByPage(body): Observable<Object> {
    return this.$http.post(`${DEVICE_LIST_BY_Lock_PAGE}`, body);
  }

  addDevice(body): Observable<Object> {
    return this.$http.post(`${ADD_DEVICE}`, body);

  }

  // 删除设施
  // deleteDeviceDyIds(body): Observable<Object> {
  //   return this.$http.post(`${DELETE_DEVICE_BY_IDS}`, body);
  // }


  queryDeviceById(body): Observable<Object> {
    return this.$http.post(`${FIND_DEVICE_BY_ID}`, body);

  }

  getDeviceStrategy(body): Observable<Object> {
    return this.$http.post(`${GET_DEVICE_STRATEGY}`, body);

  }

  setDeviceStrategy(body): Observable<Object> {
    return this.$http.post(`${SET_DEVICE_STRATEGY}`, body);

  }

  queryDeviceNameIsExist(body): Observable<Object> {
    return this.$http.post(`${QUERY_DEVICE_NAME_IS_EXIST}`, body);

  }

  queryDeviceLogListByPage(body): Observable<Object> {
    return this.$http.post(`${DEVICE_LOG_LIST_BY_PAGE}`, body);
  }

  getDetailCode(body): Observable<Object> {
    return this.$http.post(`${GET_DETAIL_CODE}`, body);
  }

  deviceCanChangeDetail(body): Observable<Object> {
    return this.$http.get(`${DEVICE_CAN_CHANGE_DETAIL}/${body}`);
  }

  getPramsConfig(body): Observable<Object> {
    return this.$http.get(`${GET_PRAMS_CONFIG}/${body}`);
  }

  exportDeviceList(body): Observable<Object> {
    return this.$http.post(`${EXPORT_DEVICE_LIST}`, body);
  }

  exportLogList(body): Observable<Object> {
    return this.$http.post(`${EXPORT_LOG_LIST}`, body);
  }

  queryHeartbeatTime(body): Observable<Object> {
    return this.$http.get(`${QUERY_HEARTBEAT_TIME}/${body}`);
  }

  picRelationInfo(body): Observable<Object> {
    return this.$http.post(`${PIC_RELATION_INFO}`, body);
  }

  // 获取光缆信息列表 GET_CABLE_SEGMENT_LIST
  getCableList(body): Observable<Object> {
    return this.$http.post(`${GET_CABLE_LIST}`, body);
  }

  // 新增光缆信息
  addCable(body): Observable<Object> {
    return this.$http.post(`${ADD_CABLE}`, body);
  }

  // 根据光缆id查询详情
  queryCableById(id): Observable<Object> {
    return this.$http.get(`${QUERY_CABLE_BY_ID}/${id}`);
  }

  // 光缆名称校验
  checkCableName(name, id): Observable<Object> {
    return this.$http.post(`${CHECK_CABLE_NAME}`, {opticCableName: name, opticCableId: id});
  }

  // 编辑光缆信息
  updateCable(body): Observable<Object> {
    return this.$http.post(`${UPDATE_CABLE}`, body);
  }

  // 删除光缆信息 DELETE_CABLE_SECTION_BY_ID
  deleteCableById(id): Observable<Object> {
    return this.$http.get(`${DELETE_CABLE_BY_ID}/${id}`);
  }

  // 导出光缆列表
  exportCableList(body): Observable<Object> {
    return this.$http.post(`${EXPORT_CABLE_LIST}`, body);
  }

  // 获取光缆段信息列表
  getCableSegmentList(body): Observable<Object> {
    return this.$http.post(`${GET_CABLE_SEGMENT_LIST}`, body);
  }

  // 删除光缆段信息
  deleteCableSectionById(id): Observable<Object> {
    return this.$http.get(`${DELETE_CABLE_SECTION_BY_ID}/${id}`);
  }

  // 导出光缆列表
  exportCableSectionList(body): Observable<Object> {
    return this.$http.post(`${EXPORT_CABLE_SECTION_LIST}`, body);
  }

  // 获取拓扑光缆
  opticCableSectionByIdForTopology(body): Observable<object> {
    return this.$http.post(`${GET_TOPOLGY}`, body);
  }

  // 获取智能标签列表
  getSmartLabelList(body): Observable<Object> {
    return this.$http.post(`${GET_SMART_LABEL_LIST}`, body);
  }

  // 获取智能标签列表删除
  deleteSmartLabelInfo(body): Observable<Object> {
    return this.$http.post(`${DELETE_RFID_INFO_BY_ID}`, body);
  }

  // 获取熔纤信息
  getTheFuseInformation(body): Observable<Object> {
    return this.$http.post(`${GET_THE_FUSE_INFORMATION}`, body);
  }

  // 获取不在设施熔纤信息
  getTheFusedFiberInformation(body): Observable<Object> {
    return this.$http.post(`${GET_THE_FUSED_FIBER_INFORMATION}`, body);
  }

  // 获取设施里的成端的信息
  getPortCableCoreInformation(body): Observable<Object> {
    return this.$http.post(`${GET_PORT_CABLE_CORE_INFORMATION}`, body);
  }

  // 保存熔纤信息
  saveTheCoreInformation(body): Observable<Object> {
    return this.$http.post(`${SAVE_THE_CORE_INFORMATION}`, body);
  }

  // 根据设施id查询当前用户是否存在全部设施权限
  deviceIdCheckUserIfDevicePermission(body): Observable<Object> {
    return this.$http.post(`${DEVICEID_CHECK_USER_IF_DEVICE_PERMISSION}`, body);
  }

  // 根据设施id查询当前用户有权限的设施信息
  deviceIdCheckUserIfDeviceData(body): Observable<Object> {
    return this.$http.post(`${DEVICEID_CHECK_USER_IF_DEVICEDATA}`, body);
  }

  deviceLogTime(id): Observable<Object> {
    return this.$http.get(`${DEVICE_LOG_TIME}/${id}`);
  }

  queryDeviceTypeCount(): Observable<Object> {
    return this.$http.get(`${QUERY_DEVICE_TYPE_COUNT}`);
  }

  queryTopologyById(id): Observable<Object> {
    return this.$http.get(`${QUERY_TOPOLOGY_BY_ID}/${id}`);
  }

  cableSectionId(id): Observable<Object> {
    return this.$http.get(`${GET_OPTICCABLESECTIONID}/${id}`);
  }

  updateCableQueryById(body): Observable<Object> {
    return this.$http.post(`${UPDATE_CABLEQUERYBYID}`, body);
  }

  findFindCable(id): Observable<Object> {
    return this.$http.get(`${FIND_FO_BYOPTIC_CABLE}/${id}`);
  }
  updateSimPackage(body): Observable<Object> {
    return this.$http.post(`${UPDATE_SIM_PACKAGE}`, body);
  }
  getControlByPackage(body): Observable<Object> {
    return this.$http.post(`${GET_CONTROL_BY_PACKAGE}`, body);
  }
  expertControl(body): Observable<Object> {
    return this.$http.post(`${EXPERT_CONTROL}`, body);
  }



  // 设施列表请求
  deviceListByPage(body): Observable<Object> {
    return this.$http.post(`${DEVICE_LIST_BY_PAGE}`, body);
  }

  // 根据设施类型获取型号相关信息
  getModelByType(body): Observable<Object> {
    return this.$http.post(`${GET_MODEL}`, body);
  }
  // 设施名称自动生成
  getDeviceAutoName(body): Observable<Object> {
    return this.$http.post(`${AUTO_DEVICE_NAME}`, body);
  }

  //  挂载设备概览列表
  queryMountEquipment(body): Observable<Object> {
    return this.$http.post(`${QUERY_MOUNT_EQUIPMENT}`, body);
  }

  // 编辑设施
  updateDeviceById(body): Observable<Object> {
    return this.$http.put(`${UPDATE_DEVICE_BY_ID}`, body);
  }

  // 删除设施
  deleteDeviceDyIds(body): Observable<Object> {
    return this.$http.post(`${DELETE_DEVICE_BY_IDS}`, body);
  }

  // 获取项目列表
  getProjectList(body): Observable<Object> {
    return this.$http.post(`${GET_PROJECT_LIST}`, body);
  }
}
