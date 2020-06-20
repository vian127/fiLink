import {Observable} from 'rxjs';

/**
 * Created by xiaoconghu on 2019/1/14.
 */
export interface FacilityInterface {
  /**
   * 新增设施信息
   * param body
   * returns {Observable<Object>}
   */
  addDevice(body): Observable<Object>;

  /**
   * 删除设施
   * param body
   * returns {Observable<Object>}
   */

  // deleteDeviceDyIds(body): Observable<Object>;

  /**
   * 查看设施详情
   * param body
   * returns {Observable<Object>}
   */
  queryDeviceById(body): Observable<Object>;

  /**
   * 获取设施配置策略
   * param body
   * returns {Observable<Object>}
   */
  getDeviceStrategy(body): Observable<Object>;

  /**
   * 设置设施配置策略
   * param body
   * returns {Observable<Object>}
   */
  setDeviceStrategy(body): Observable<Object>;

  /**
   * 查询设施名称是否存在
   * param body
   * returns {Observable<Object>}
   */
  queryDeviceNameIsExist(body): Observable<Object>;

  /**
   * 查询设施日志
   * param body
   * returns {Observable<Object>}
   */
  queryDeviceLogListByPage(body): Observable<Object>;

  /**
   * 获取详情页的code码
   * param body
   * returns {Observable<Object>}
   */
  getDetailCode(body): Observable<Object>;

  /**
   * 查询设施详情是否可以修改
   * param body
   * returns {Observable<Object>}
   */
  deviceCanChangeDetail(body): Observable<Object>;

  /**
   * 获取配置参数
   * param body
   * returns {Observable<Object>}
   */
  getPramsConfig(body): Observable<Object>;

  /**
   * 导出设施列表
   * param body
   * returns {Observable<Object>}
   */
  exportDeviceList(body): Observable<Object>;

  /**
   * 导出设施日志列表
   * param body
   * returns {Observable<Object>}
   */
  exportLogList(body): Observable<Object>;

  /**
   * 查询心跳时间
   * param body
   * returns {Observable<Object>}
   */
  queryHeartbeatTime(body): Observable<Object>;

  /**
   * 查询设施图片
   * param body
   * returns {Observable<Object>}
   */
  picRelationInfo(body): Observable<Object>;

  /**
   * 获取光缆列表 getCableSementList
   * param body
   * returns {Observable<Object>}
   */
  getCableList(body): Observable<Object>;

  /**
   * 新增光缆信息
   * param body
   * returns {Observable<Object>}
   */
  addCable(body): Observable<Object>;

  /**
   * 光缆名称校验
   * param body
   * returns {Observable<Object>}
   */
  checkCableName(name, id): Observable<Object>;

  /**
   * 根据光缆id查询详情
   * param body
   * returns {Observable<Object>}
   */
  queryCableById(id): Observable<Object>;

  /**
   * 修改光缆信息
   * param body
   * returns {Observable<Object>}
   */
  updateCable(body): Observable<Object>;

  /**
   * 删除光缆信息 deleteCableSectionById
   * param body queryCableById
   * returns {Observable<Object>}
   */
  deleteCableById(id): Observable<Object>;

  /**
   * 导出光缆列表 exportCableSectionList
   * param body
   * returns {Observable<Object>}
   */
  exportCableList(body): Observable<Object>;

  /**
   * 获取光缆段列表
   * param body
   * returns {Observable<Object>}
   */
  getCableSegmentList(body): Observable<Object>;

  /**
   * 删除光缆信息
   * param body queryCableById
   * returns {Observable<Object>}
   */
  deleteCableSectionById(id): Observable<Object>;

  /**
   * 导出光缆段列表
   * param body
   * returns {Observable<Object>}
   */
  exportCableSectionList(body): Observable<Object>;

  /**
   * 根据光缆段id查询查看智能标签列表
   * param body checkCableName
   * returns {Observable<Object>}
   */
  getSmartLabelList(body): Observable<Object>;

  /**
   * 智能标签列表删除
   * param body checkCableName
   * returns {Observable<Object>}
   */
  deleteSmartLabelInfo(body): Observable<Object>;

  /**
   * 根据此设施内获取熔纤信息
   * param body
   * returns {Observable<Object>}
   */
  getTheFuseInformation(body): Observable<Object>;

  /**
   * 获取设施内成端信息
   * param body
   * returns {Observable<Object>}
   */
  getPortCableCoreInformation(body): Observable<Object>;

  /**
   * 获取不在此设施熔纤信息
   * param body
   * returns {Observable<Object>}
   */
  getTheFusedFiberInformation(body): Observable<Object>;

  /**
   * 保存熔纤信息
   * param body
   * returns {Observable<Object>}
   */
  saveTheCoreInformation(body): Observable<Object>;

  /**
   * 根据设施id查询当前用户是否存在全部设施权限
   * param body
   * returns {Observable<Object>}
   */
  deviceIdCheckUserIfDevicePermission(body): Observable<Object>;

  /**
   * 根据设施id查询当前用户有权限的设施信息
   * param body
   * returns {Observable<Object>}
   */
  deviceIdCheckUserIfDeviceData(body): Observable<Object>;

  /**
   * 查询最后一条设施日志时间
   * param id
   * returns {Observable<Object>}
   */
  deviceLogTime(id): Observable<Object>;

  /**
   * 查询设施类型数量
   * returns {Observable<Object>}
   */
  queryDeviceTypeCount(): Observable<Object>;

  /**
   * 查询单个光缆信息
   * returns {Observable<Object>}
   */
  queryTopologyById(id): Observable<Object>;

  // 获取拓扑光缆
  opticCableSectionByIdForTopology(body): Observable<Object>;

  // 根据光缆ID显示高亮
  cableSectionId(id): Observable<Object>;

  /**
   * 根据id光缆段gis坐标微调
   * returns {Observable<Object>}
   */
  updateCableQueryById(body): Observable<Object>;

  /**
   * 根据id光缆段gis坐标微调详情
   * returns {Observable<Object>}
   */
  findFindCable(id): Observable<Object>;


  /**
   * 查询设施列表
   * param body
   * returns {Observable<Object>}
   */
  deviceListByPage(body): Observable<Object>;

  /**
   * 根据设施类型获取型号相关信息
   * param body
   * returns {Observable<Object>}
   */
  getModelByType(body): Observable<Object>;

  /**
   * 设施名称自动生成
   * param body
   * returns {Observable<Object>}
   */
  getDeviceAutoName(body): Observable<Object>;

  /**
   * 挂载设备概览列表
   * param body
   * returns {Observable<Object>}
   */
  queryMountEquipment(body): Observable<Object>;

  /**
   * 修改设施信息
   * param body
   * returns {Observable<Object>}
   */
  updateDeviceById(body): Observable<Object>;

  /**
   * 删除设施
   * param body
   * returns {Observable<Object>}
   */
  deleteDeviceDyIds(body): Observable<Object>;

}
