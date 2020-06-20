import {DEVICE_SERVER} from '../../../../core-module/api-service/api-common.config';

/**
 * 分组管理后台api 访问地址
 */
export const GroupServiceUrlConst = {
  // 校验分组名称是否重复
  checkGroupInfoByName: `${DEVICE_SERVER}/groupInfo/checkGroupInfoByName/`,
  // 查询分组列表
  queryGroupInfoList: `${DEVICE_SERVER}/groupInfo/queryGroupInfoList`,
  // 新增分组信息
  addGroupInfo: `${DEVICE_SERVER}/groupInfo/addGroupInfo`,
  // 删除分组
  delGroupInfByIds: `${DEVICE_SERVER}/groupInfo/delGroupInfByIds`,
  // 查询分组详情中的设施列表
  queryGroupDeviceInfoList: `${DEVICE_SERVER}/groupInfo/queryGroupDeviceInfoList`,
  // 查询分组详情中的设备列表
  queryGroupEquipmentInfoList: `${DEVICE_SERVER}/groupInfo/queryGroupEquipmentInfoList`,
  // 快速分组选择设备
  quickSelectGroupEquipmentInfoList: `${DEVICE_SERVER}/groupInfo/quickSelectGroupEquipmentInfoList`,
  // 快速分组时选择设施
  quickSelectGroupDeviceInfoList: `${DEVICE_SERVER}/groupInfo/quickSelectGroupDeviceInfoList`,
  // 修改功能查询分组下的设施和设备id
  queryGroupDeviceAndEquipmentByGroupInfoId: `${DEVICE_SERVER}/groupInfo/queryGroupDeviceAndEquipmentByGroupInfoId`,
  // 修改分组信息
  updateGroupInfo: `${DEVICE_SERVER}/groupInfo/updateGroupInfo`
};
