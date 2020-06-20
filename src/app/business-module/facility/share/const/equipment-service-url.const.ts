import {
  ALARM_CURRENT_SERVER,
  ALARM_HISTORY_SERVER,
  DEVICE_SERVER,
  INDEX_DEVICE_STRATEGY_SERVER,
  INDEX_WORK_ORDER_SERVER,
  LOG_SERVER
} from '../../../../core-module/api-service/api-common.config';

/**
 * 后端服务api路径常量
 */
export const equipmentServiceUrlConst = {
  // 获取设备列表
  equipmentListByPage: `${DEVICE_SERVER}/equipmentInfo/equipmentListByPage`,
  // 查询设备统计
  equipmentCount: `${DEVICE_SERVER}/statistics/queryEquipmentTypeCount`,
  // 自动生成设备名称
  getEquipmentName: `${DEVICE_SERVER}/equipmentInfo/getEquipmentName`,
  // 查询设备名称是否已经存在
  queryEquipmentNameIsExist: `${DEVICE_SERVER}/equipmentInfo/queryEquipmentNameIsExist`,
  // 查询资产编码是否存在
  queryEquipmentCodeIsExist: `${DEVICE_SERVER}/equipmentInfo/queryEquipmentCodeIsExist`,
  // 根据设备id查询设备信息
  getEquipmentById: `${DEVICE_SERVER}/equipmentInfo/queryEquipmentInfoById`,
  // 增加设备
  addEquipment: `${DEVICE_SERVER}/equipmentInfo/addEquipment`,
  // 修改设备
  updateEquipmentById: `${DEVICE_SERVER}/equipmentInfo/updateEquipment`,
  // 删除设备
  deleteEquipmentByIds: `${DEVICE_SERVER}/equipmentInfo/deleteEquipmentByIds`,
  // 根据设施id查询挂载位置
  findMountPositionById: `${DEVICE_SERVER}/poleInfo/findMountPositionById`,
  // 根据设备类型查询设备型号信息
  getDeviceModelByType: `${DEVICE_SERVER}/deviceInfo/getDeviceModelByType`,
  // 上传图片
  equipmentRefImg: `${DEVICE_SERVER}/picRelationInfo/uploadImageForLive`,
  // 查询网关端口
  queryGatewayPort: `${DEVICE_SERVER}/equipmentInfo/queryGatewayPort`,
  // 查询设备的传感知信息
  queryPerformData: `${INDEX_DEVICE_STRATEGY_SERVER}/equipPerform/queryPerformData`,
  // 查询当前告警列表5条
  getAlarmInfoListByEquipmentId: `${ALARM_CURRENT_SERVER}/alarmCurrent/queryAlarmEquipmentId`,
  // 查询告警名称统计
  queryAlarmNameStatistics: `${ALARM_CURRENT_SERVER}/alarmStatistics/queryAlarmCurrentSourceName`,
  // 查询当前告警的级别统计
  queryCurrentAlarmLevelStatistics: `${ALARM_CURRENT_SERVER}/alarmStatistics/queryAlarmCurrentSourceLevel`,
  // 查询告警增量统计
  queryAlarmSourceIncremental: `${ALARM_CURRENT_SERVER}/alarmStatistics/queryAlarmSourceIncremental`,
  // 查询历史告警列表5条
  getAlarmHisInfoListById: `${ALARM_HISTORY_SERVER}/alarmHistory/queryAlarmHistoryEquipmentId`,
  // 历史告警名称统计
  queryAlarmHistorySourceName: `${ALARM_CURRENT_SERVER}/alarmStatistics/queryAlarmHistorySourceName`,
  // 历史告警级别统计
  queryAlarmHistorySourceLevel: `${ALARM_CURRENT_SERVER}/alarmStatistics/queryAlarmHistorySourceLevel`,
  // 查询销障列表
  queryClearList: `${INDEX_WORK_ORDER_SERVER}/device/queryClearListByEquipmentIdForDevice`,
  // 查询巡检工单
  queryInspectionList: `${INDEX_WORK_ORDER_SERVER}/device/queryInspectionListByIdForDevice`,
  // 撤回工单
  revokeProc: `${INDEX_WORK_ORDER_SERVER}/revokeProc`,
  // 查询操作日志
  findOperateLog: `${LOG_SERVER}/log/findOperateLog`,
  // 导出设备数据
  exportEquipmentData: `${DEVICE_SERVER}/deviceInfo/exportDeviceList`,
  // 查询设备日志
  queryEquipmentLog: `${DEVICE_SERVER}/deviceLog/deviceLogListByPage`,
  // 根据设备id查询设备的最近的三张图片
  getPicDetailForNew: `${DEVICE_SERVER}/picRelationInfo/getPicDetailForNew`,
  // 上传设备图片
  uploadImageForLive: `${DEVICE_SERVER}/picRelationInfo/uploadImageForLive`,
  // 查询设备模型的详细卡片code
  getDetailCode: `${DEVICE_SERVER}/equipmentProtocol/getDetailCode`,


  // 查询初始化网关端口拓扑
  queryGatewayPortInfoTopology: `/${DEVICE_SERVER}/gatewayPortInfo/queryGatewayPortInfoTopology`,
  // 保存网关端口拓扑
  saveGatewayPortInfo: `/${DEVICE_SERVER}/gatewayPortInfo/saveGatewayPortInfo`,
  // 清除网关端口信息
  deleteGatewayPortInfo: `/${DEVICE_SERVER}/gatewayPortInfo/deleteGatewayPortInfo`,
  // 拖动设备位置
  updateEquipmentPosition: `/${DEVICE_SERVER}/gatewayPortInfo/updateEquipmentPosition`,
  // 修改连线信息
  updateLineName: `/${DEVICE_SERVER}/gatewayPortInfo/updateLineName`,
  // 修改节点信息
  updateNodeName: `/${DEVICE_SERVER}/gatewayPortInfo/updateNodeName`,
  // 获取网关配置已有设备列表
  queryConfigureEquipmentInfo: `/${DEVICE_SERVER}/equipmentInfo/queryConfigureEquipmentInfo`,
};
