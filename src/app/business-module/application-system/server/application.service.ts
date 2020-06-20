import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  LIGHTING_POLICY_LIST,
  LIGHTING_POLICY_EDIT,
  RELEASE_CONTENT_LIST_GET,
  RELEASE_CONTENT_LIST_DELETE,
  RELEASE_CONTENT_STATE_UPDATE,
  CHECK_STRATEGY_NAME_EXIST,
  LINKAGE_DETAILS,
  LINKAGE_ADD,
  DISTRIBUTE_LIGHT,
  ALARM_LEVEL_LIST,
  DISTRIBUTE_RELEASE,
  DISTRIBUTE_LINKAGE,
  LINKAGE_EDIT,
  RELEASE_POLICY_EDIT,
  RELEASE_PROGRAM_EDIT,
  RELEASE_PROGRAM_LOOK,
  RELEASE_PROGRAM_ADD,
  RELEASE_PROGRAMME_WORK_LIST_GET,
  RELEASE_POLICY_ADD,
  RELEASE_POLICY_DETAILS,
  ADD_SECURITY_STRATEGY,
  SECURITY_POLICY_DETAILS,
  LIGHTING_MODIFY_STRATEGY,
  RELEASE_WORK_ORDER,
  RELEASE_WORK_PROGRAM_ADD,
  LIGHTING_ENABLE_DISABLE,
  LIGHTING_POLICY_DELETE,
  LIGHTING_POLICY_ADD,
  RELEASE_WORK_ORDER_DETAIL,
  EQUIPMENT_LIST_PAGE,
  DELETE_LINKAGE_STRATEGY,
  DELETE_INFO_STRATEGY,
  CONTROL_EQUIPMENT_COUNT,
  DEVICE_FUNCTION_POLE,
  SECURITY_PASSAGEWAY_LIST_GET,
  SECURITY_CONFIGURATION_GET,
  SECURITY_CONNECTION_CAMERA_GET,
  SECURITY_CONFIGURATION_SAVE,
  SECURITY_CHANNEL,
  UPLOAD_SSL_FILE,
  EQUIPMENT_SWITCH_LIGHT,
  EQUIPMENT_DIMMING_LIGHT,
  LIGHTING_RATE_STATISTICS,
  GROUP_LIST_PAGE,
  ELECT_CONS_STATISTICS,
  CLOUD_CONTROL,
} from './application-url';
import {ApplicationInterface} from './application.interface';

@Injectable()
export class ApplicationService implements ApplicationInterface {
  constructor(
    private $http: HttpClient
  ) {
  }

  /**
   * 获取策略控制列表
   * @ param body
   */
  getLightingPolicyList(body): Observable<Object> {
    return this.$http.post(`${LIGHTING_POLICY_LIST}`, body);
  }

  /**
   * 告警列表
   * @ param body
   */
  getAlarmLevelList(body): Observable<Object> {
    return this.$http.post(`${ALARM_LEVEL_LIST}`, body);
  }

  /**
   * 策略编辑
   * @ param body
   */
  modifyLightStrategy(body): Observable<Object> {
    return this.$http.post(`${LIGHTING_MODIFY_STRATEGY}`, body);
  }

  /**
   * 信息发布策略编辑
   * @ param body
   */
  modifyReleaseStrategy(body): Observable<Object> {
    return this.$http.post(`${RELEASE_POLICY_EDIT}`, body);
  }

  /**
   * 设备列表
   */
  equipmentListByPage(body): Observable<Object> {
    return this.$http.post(`${EQUIPMENT_LIST_PAGE}`, body);
  }

  /**
   * 分组列表
   * @ param body
   */
  queryGroupInfoList(body): Observable<Object> {
    return this.$http.post(`${GROUP_LIST_PAGE}`, body);
  }
  /**
   * 照明策略下发
   * @ param body
   */
  distributeLightStrategy(body): Observable<Object> {
    return this.$http.post(`${DISTRIBUTE_LIGHT}`, body);
  }

  /**
   * 信息发布策略下发
   * @ param body
   */
  distributeInfoStrategy(body): Observable<Object> {
    return this.$http.post(`${DISTRIBUTE_RELEASE}`, body);
  }

  /**
   * 联动策略下发
   * @ param body
   */
  distributeLinkageStrategy(body): Observable<Object> {
    return this.$http.post(`${DISTRIBUTE_LINKAGE}`, body);
  }

  /**
   * 新增联动策略
   * @ param body
   */
  addLinkageStrategy(body): Observable<Object> {
    return this.$http.post(`${LINKAGE_ADD}`, body);
  }

  /**
   * 编辑联动策略
   * @ param body
   */
  modifyLinkageStrategy(body): Observable<Object> {
    return this.$http.post(`${LINKAGE_EDIT}`, body);
  }

  /**
   * 信息发布获取内容列表
   * @ param body
   */
  getReleaseContentList(body): Observable<Object> {
    return this.$http.post(`${RELEASE_CONTENT_LIST_GET}`, body);
  }

  /**
   * 设备开关
   * @ param body
   */
  switchLight(body): Observable<Object> {
    return this.$http.post(`${EQUIPMENT_SWITCH_LIGHT}`, body);
  }

  /**
   * 亮灯率统计
   * @ param body
   */
  getLightingRateStatisticsData(body): Observable<Object> {
    return this.$http.post(`${LIGHTING_RATE_STATISTICS}`, body);
  }

  /**
   * 用电量统计
   * @ param body
   */
  getElectConsStatisticsData(body): Observable<Object> {
    return this.$http.post(`${ELECT_CONS_STATISTICS}`, body);
  }
  /**
   * 设备调光
   * @ param body
   */
  dimmingLight(body): Observable<Object> {
    return this.$http.post(`${EQUIPMENT_DIMMING_LIGHT}`, body);
  }

  /**
   * 信息发布删除列表
   * @ param body
   */
  deleteReleaseContentList(body): Observable<Object> {
    return this.$http.post(`${RELEASE_CONTENT_LIST_DELETE}`, body);
  }

  /**
   * 策略启用禁用
   * @ param body
   */
  enableOrDisableStrategy(body): Observable<Object> {
    return this.$http.post(`${LIGHTING_ENABLE_DISABLE}`, body);
  }

  /**
   * 信息发布更新列表状态
   * @ param body
   */
  updateReleaseContentState(body): Observable<Object> {
    return this.$http.post(`${RELEASE_CONTENT_STATE_UPDATE}`, body);
  }

  /**
   * 策略详情
   * @ param id
   */
  getLightingPolicyDetails(id): Observable<Object> {
    return this.$http.get(`${LIGHTING_POLICY_EDIT}/${id}`);
  }

  /**
   * 策略详情
   * @ param id
   */
  checkStrategyNameExist(name): Observable<Object> {
    return this.$http.get(`${CHECK_STRATEGY_NAME_EXIST}/${name}`);
  }

  /**
   * 联动详情
   * @ param id
   */
  getLinkageDetails(id): Observable<Object> {
    return this.$http.get(`${LINKAGE_DETAILS}/${id}`);
  }

  /**
   * 安防策略详情
   * @ param id
   */
  getSecurityPolicyDetails(id): Observable<Object> {
    return this.$http.get(`${SECURITY_POLICY_DETAILS}/${id}`);
  }

  /**
   * 信息发布
   * @ param id
   */
  getReleasePolicyDetails(id): Observable<Object> {
    return this.$http.get(`${RELEASE_POLICY_DETAILS}/${id}`);
  }

  /**
   * 安防策略新增
   * @ param body
   */
  securityPolicyAdd(body): Observable<Object> {
    return this.$http.post(`${ADD_SECURITY_STRATEGY}`, body);
  }

  /**
   * 信息发布新增
   * @ param body
   */
  releasePolicyAdd(body): Observable<Object> {
    return this.$http.post(`${RELEASE_POLICY_ADD}`, body);
  }

  /**
   * 信息发布编辑列表内容
   * @ param body
   */
  editReleaseProgram(body): Observable<Object> {
    return this.$http.post(`${RELEASE_PROGRAM_EDIT}`, body);
  }

  /**
   * 信息发布通过节目查看节目信息
   * @ param body
   */
  lookReleaseProgram(id): Observable<Object> {
    return this.$http.get(`${RELEASE_PROGRAM_LOOK}/${id}`);
  }

  /**
   * 信息新增节目信息
   * @ param body
   */
  addReleaseProgram(body): Observable<Object> {
    return this.$http.post(`${RELEASE_PROGRAM_ADD}`, body);
  }

  /**
   * 信息新增审核(发起审核)
   * @ param body
   */
  addReleaseWorkProgram(body): Observable<Object> {
    return this.$http.post(`${RELEASE_WORK_PROGRAM_ADD}`, body);
  }

  /**
   * 信息发布获取内容审核列表
   * @ param body
   */
  getReleaseProgramWorkList(body): Observable<Object> {
    return this.$http.post(`${RELEASE_PROGRAMME_WORK_LIST_GET}`, body);
  }

  /**
   * 信息发布工单审核操作
   * @ param body
   */
  releaseWorkOrder(body): Observable<Object> {
    return this.$http.post(`${RELEASE_WORK_ORDER}`, body);
  }

  /**
   * 策略新增
   * @ param body
   */
  lightingPolicyAdd(body): Observable<Object> {
    return this.$http.post(`${LIGHTING_POLICY_ADD}`, body);
  }

  /**
   * 删除策略
   * @ param body
   */
  deleteLightStrategy(body): Observable<Object> {
    return this.$http.post(`${LIGHTING_POLICY_DELETE}`, body);
  }

  /**
   * 删除联动策略
   * @ param body
   */
  deleteLinkageStrategy(body): Observable<Object> {
    return this.$http.post(`${DELETE_LINKAGE_STRATEGY}`, body);
  }

  /**
   * 单控数量和集控数量
   * @ param body
   */
  getControlEquipmentCount(body): Observable<Object> {
    return this.$http.post(`${CONTROL_EQUIPMENT_COUNT}`, body);
  }

  /**
   * 智慧杆数量
   * @ param body
   */
  queryDeviceFunctionPole(body): Observable<Object> {
    return this.$http.post(`${DEVICE_FUNCTION_POLE}`, body);
  }

  /**
   * 删除信息发布策略
   * @ param body
   */
  deleteInfoStrategy(body): Observable<Object> {
    return this.$http.post(`${DELETE_INFO_STRATEGY}`, body);
  }

  /**
   * 信息发布通过审核查看审核信息
   * @ param body
   */
  lookReleaseWorkOrder(id): Observable<Object> {
    return this.$http.get(`${RELEASE_WORK_ORDER_DETAIL}/${id}`);
  }

  /**
   * 安防获取通道列表
   * @ param body
   */
  getSecurityPassagewayList(id): Observable<Object> {
    return this.$http.get(`${SECURITY_PASSAGEWAY_LIST_GET}/${id}`);
  }

  /**
   * 获取配置信息
   * @ param body
   */
  getSecurityConfiguration(id): Observable<Object> {
    return this.$http.get(`${SECURITY_CONFIGURATION_GET}/${id}`);
  }

  /**
   * 获取摄像头流地址
   * @ param body
   */
  getSecurityCamera(body): Observable<Object> {
    return this.$http.post(`${SECURITY_CONNECTION_CAMERA_GET}`, body);
  }

  /**
   * 新增/修改配置信息
   * @ param body
   */
  saveSecurityConfiguration(body): Observable<Object> {
    return this.$http.post(`${SECURITY_CONFIGURATION_SAVE}`, body);
  }

  /**
   * 新增/修改通道列表
   * @ param body
   */
  securityChannel(body): Observable<Object> {
    return this.$http.post(`${SECURITY_CHANNEL}`, body);
  }

  /**
   * 安防上传文件（基础配置专用）
   * @ param body
   */
  uploadSslFile(body): Observable<Object> {
    return this.$http.post(`${UPLOAD_SSL_FILE}`, body);
  }

  /**
   * 摄像头云台控制
   * @ param body
   */
  cloudControl(body): Observable<Object> {
    return this.$http.post(`${CLOUD_CONTROL}`, body);
  }
}
