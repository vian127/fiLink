import {Observable} from 'rxjs';
import {QueryCondition} from '../../../../../shared-module/entity/queryCondition';
import {QueryAlarmStatisticsModel} from '../../model/query-alarm-statistics.model';

/**
 * 设备管理服务接口
 */
export interface EquipmentApiInterface {


  /**
   *  查询设备列表
   */
  equipmentListByPage(body): Observable<Object>;

  /**
   * 查询设备统计
   */
  equipmentCount(): Observable<Object>;

  /**
   *  自动生成设备名称
   */
  getEquipmentName(temp: { equipmentName: string }): Observable<Object>;

  /**
   *  查询设备名称是否已经存在
   */
  queryEquipmentNameIsExist(body): Observable<Object>;

  /**
   * 查询资产编码是否存在
   */
  queryEquipmentCodeIsExist(body): Observable<Object>;

  /**
   * 增加设备
   */
  addEquipment(body): Observable<Object>;

  /**
   * 修改设备
   */
  updateEquipmentById(body): Observable<Object>;

  /**
   * 删除设备
   */
  deleteEquipmentByIds(body): Observable<Object>;

  /**
   * 根据设备id查询设备详情
   */
  getEquipmentById(equipmentId): Observable<Object>;

  /**
   * 根据设施id查询挂载位置
   */
  findMountPositionById(equipment): Observable<Object>;

  /**
   * 选择类型后获取型号信息
   */
  getDeviceModelByType(body): Observable<Object>;

  /**
   * 查询网关端口
   */
  queryGatewayPort(body): Observable<Object>;

  /**
   *  查询设备的传感值接口
   */
  queryPerformData(body): Observable<Object>;

  /**
   *  查询设备当前告警
   */
  queryEquipmentCurrentAlarm(equipmentId: string): Observable<Object>;

  /*
  * 查询销障工单
   */
  queryClearList(body): Observable<Object>;

  /**
   * 查询巡检工单
   */
  queryInspectionList(body): Observable<Object>;

  /**
   * 撤回工单
   */
  revokeProc(body): Observable<Object>;

  /**
   *  查询操作日志列表
   */
  findOperateLog(body: QueryCondition): Observable<Object>;

  /**
   * 获取告警名称统计
   */
  queryAlarmNameStatistics(body: QueryAlarmStatisticsModel): Observable<Object>;

  /**
   * 查询告警增量统计
   */
  queryAlarmSourceIncremental(body: QueryAlarmStatisticsModel): Observable<Object>;

  /**
   * 查询告警等级统计
   */
  queryCurrentAlarmLevelStatistics(body: QueryAlarmStatisticsModel): Observable<Object>;

  /**
   * 查询历史告警列表数据
   */
  queryHistoryAlarmList(equipmentId: string): Observable<Object>;

  /**
   * 查询历史告警名称统计
   */
  queryAlarmHistorySourceName(body: QueryAlarmStatisticsModel): Observable<Object>;

  /**
   * 查询历史告警级别统计
   */
  queryAlarmHistorySourceLevel(body: QueryAlarmStatisticsModel): Observable<Object>;

  /**
   * 导出数据
   */
  exportEquipmentData(body): Observable<Object>;

  /**
   * 查询设备日志
   */
  queryEquipmentLog(body: QueryCondition): Observable<Object>;

  /**
   * 根据设备id查询设备的最近的三张图片
   */
  getPicDetailForNew(body): Observable<Object>;

  /**
   * 查询设备模型的详情卡片code
   */
  getDetailCode(body): Observable<Object>;


  /**
   * 根据设备id查询设备的最近的三张图片
   */
  getPicDetailForNew(body): Observable<Object>;


  /**
   * 查询网关端口拓扑
   */
  queryGatewayPortInfoTopology(body): Observable<Object>;

  /**
   * 保存网关端口拓扑
   */
  saveGatewayPortInfo(body): Observable<Object>;

  /**
   * 清除网关端口信息
   */
  deleteGatewayPortInfo(body): Observable<Object>;

  /**
   * 拖动设备位置
   */
  updateEquipmentPosition(body): Observable<Object>;

  /**
   * 修改连线信息
   */
  updateLineName(body): Observable<Object>;

  /**
   *  修改节点信息
   */
  updateNodeName(body): Observable<Object>;

  /**
   * 获取网关配置已有设备列表
   */
  queryConfigEquipmentInfo(body): Observable<Object>;

}

