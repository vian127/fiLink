import {Observable} from 'rxjs';

export interface ApplicationInterface {
  /**
   * 获取策略控制列表
   * @ param body
   */
  getLightingPolicyList(body): Observable<Object>;

  /**
   * 告警列表
   * @ param body
   */
  getAlarmLevelList(body): Observable<Object>;

  /**
   * 亮灯率统计
   * @ param body
   */
  getLightingRateStatisticsData(body): Observable<Object>;

  /**
   * 用电量统计
   * @ param body
   */
  getElectConsStatisticsData(body): Observable<Object>;

  /**
   * 设备开关
   * @ param body
   */
  switchLight(body): Observable<Object>;

  /**
   * 设备调光
   * @ param body
   */
  dimmingLight(body): Observable<Object>;

  /**
   * 策略新增
   * @ param body
   */
  lightingPolicyAdd(body): Observable<Object>;

  /**
   * 单控数量和集控数量
   * @ param body
   */
  getControlEquipmentCount(body): Observable<Object>;

  /**
   * 智慧杆数量
   * @ param body
   */
  queryDeviceFunctionPole(body): Observable<Object>;

  /**
   * 删除联动策略
   * @ param body
   */
  deleteLinkageStrategy(body): Observable<Object>;

  /**
   * 删除信息发布策略
   * @ param body
   */
  deleteInfoStrategy(body): Observable<Object>;

  /**
   * 新增联动策略
   * @ param body
   */
  addLinkageStrategy(body): Observable<Object>;

  /**
   * 联动编辑策略
   * @ param body
   */
  modifyLinkageStrategy(body): Observable<Object>;

  /**
   * 安防策略新增
   * @ param body
   */
  securityPolicyAdd(body): Observable<Object>;

  /**
   * 策略启用禁用
   * @ param body
   */
  enableOrDisableStrategy(body): Observable<Object>;

  /**
   * 策略编辑
   * @ param body
   */
  modifyLightStrategy(body): Observable<Object>;

  /**
   * 删除策略
   * @ param body
   */
  deleteLightStrategy(body): Observable<Object>;

  /**
   * 信息发布获取内容列表
   * @ param body
   */
  getReleaseContentList(body): Observable<Object>;

  /**
   * 信息发布删除列表
   * @ param body
   */
  deleteReleaseContentList(body): Observable<Object>;


  /**
   * 信息发布更新列表状态
   * @ param body
   */
  updateReleaseContentState(body): Observable<Object>;

  /**
   * 照明策略下发
   * @ param body
   */
  distributeLightStrategy(body): Observable<Object>;

  /**
   * 设备列表
   * @ param body
   */
  equipmentListByPage(body): Observable<Object>;

  /**
   * 分组列表
   * @ param body
   */
  queryGroupInfoList(body): Observable<Object>;

  /**
   * 信息发布策略下发
   * @ param body
   */
  distributeInfoStrategy(body): Observable<Object>;

  /**
   * 联动策略下发
   * @ param body
   */
  distributeLinkageStrategy(body): Observable<Object>;

  /**
   * 验证策略名称是否存在
   * @ param name
   */
  checkStrategyNameExist(name): Observable<Object>;

  /**
   * 策略详情接口
   * @ param id
   */
  getLightingPolicyDetails(id): Observable<Object>;

  /**
   * 安防策略详情
   * @ param id
   */
  getSecurityPolicyDetails(id): Observable<Object>;

  /**
   * 联动策略详情
   * @ param id
   */
  getLinkageDetails(id): Observable<Object>;

  /**
   * 信息发布
   * @ param id
   */
  getReleasePolicyDetails(id): Observable<Object>;

  /**
   * 信息发布编辑列表内容
   * @ param body
   */
  editReleaseProgram(body): Observable<Object>;

  /**
   * 信息发布通过节目查看节目信息
   * @ param body
   */
  lookReleaseProgram(body): Observable<Object>;

  /**
   * 信息新增节目信息
   * @ param body
   */
  addReleaseProgram(body): Observable<Object>;

  /**
   * 信息发布
   * @ param body
   */
  releasePolicyAdd(body): Observable<Object>;

  /**
   * 信息策略编辑
   * @ param body
   */
  modifyReleaseStrategy(body): Observable<Object>;

  /**
   * 信息新增审核(发起审核)
   * @ param body
   */
  addReleaseWorkProgram(body): Observable<Object>;

  /**
   * 信息发布获取内容审核列表
   * @ param body
   */
  getReleaseProgramWorkList(body): Observable<Object>;

  /**
   * 信息发布工单审核操作
   * @ param body
   */
  releaseWorkOrder(body): Observable<Object>;

  /**
   * 信息发布通过审核查看审核信息
   * @ param body
   */
  lookReleaseWorkOrder(body): Observable<Object>;

  /**
   * 安防获取通道列表
   * @ param body
   */
  getSecurityPassagewayList(body): Observable<Object>;

  /**
   * 获取配置信息
   * @ param body
   */
  getSecurityConfiguration(body): Observable<Object>;

  /**
   * 获取摄像头流地址
   * @ param body
   */
  getSecurityCamera(body): Observable<Object>;

  /**
   * 新增/修改配置信息
   * @ param body
   */
  saveSecurityConfiguration(body): Observable<Object>;

  /**
   * 新增/修改通道列表
   * @ param body
   */
  securityChannel(body): Observable<Object>;

  /**
   * 安防上传文件（基础配置专用）
   * @ param body
   */
  uploadSslFile(body): Observable<Object>;

  /**
   * 安防上传文件（基础配置专用）
   * @ param body
   */
  cloudControl(body): Observable<Object>;

}
