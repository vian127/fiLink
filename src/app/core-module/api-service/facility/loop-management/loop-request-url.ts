// 资产管理服务
const DEVICE_SERVER = 'filink-device-server-rcf';

export const DEVICE_SERVER_MAP = 'filink-device-server-lcw';

/**
 * 回路后端服务api路径常量
 */
export const LoopRequestUrlConst = {
  // 获取回路列表
  queryLoopListByPage: `${DEVICE_SERVER}/loopInfo/loopListByPage`,
  // 查询设施的区域信息
  queryLoopMapByArea: `${DEVICE_SERVER_MAP}/deviceInfo/queryDevicePolymerizationList`,
  // 根据区域id查询设施信息
  queryLoopMapByDevice: `${DEVICE_SERVER_MAP}/deviceInfo/queryDevicePolymerizations`,

};
