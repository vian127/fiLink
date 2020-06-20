import {
  ALARM_SET,
  APPLICATION,
  EQUIPMENT_SERVER, GROUP_SERVER_YQ,
  RELEASE_CONTENT_SERVER,
} from '../../../core-module/api-service/api-common.config';

// 策略列表
export const LIGHTING_POLICY_LIST = `${APPLICATION}/strategy/queryStrategyList`;
// 信息发布获取内容列表
export const RELEASE_CONTENT_LIST_GET = `${RELEASE_CONTENT_SERVER}/program/queryProgramList`;
// 删除策略
export const LIGHTING_POLICY_DELETE = `${APPLICATION}/strategy/deleteLightStrategy`;
// 删除联动策略
export const DELETE_LINKAGE_STRATEGY = `${APPLICATION}/strategy/deleteLinkageStrategy`;
// 删除联动策略
export const DELETE_INFO_STRATEGY = `${APPLICATION}/strategy/deleteInfoStrategy`;
// 信息发布删除列表
export const RELEASE_CONTENT_LIST_DELETE = `${RELEASE_CONTENT_SERVER}/program/deleteProgram`;
// 信息发布更新列表状态
export const RELEASE_CONTENT_STATE_UPDATE = `${RELEASE_CONTENT_SERVER}/program/updateProgramState`;
// 告警列表
export const ALARM_LEVEL_LIST = `${ALARM_SET}/alarmSet/queryAlarmLevelList`;
// 照明策略详情
export const LIGHTING_POLICY_EDIT = `${APPLICATION}/strategy/queryLightStrategyById`;
// 信息发布
export const RELEASE_POLICY_DETAILS = `${APPLICATION}/strategy/queryInfoStrategyById`;
// 信息发布新增
export const RELEASE_POLICY_ADD = `${APPLICATION}/strategy/addInfoStrategy`;
// 信息发布编辑
export const RELEASE_POLICY_EDIT = `${APPLICATION}/strategy/modifyInfoStrategy`;
// 安防策略详情
export const SECURITY_POLICY_DETAILS = `${APPLICATION}/strategy/querySecurityStrategyById`;
// 联动策略详情
export const LINKAGE_DETAILS = `${APPLICATION}/strategy/queryLinkageStrategyById`;
// 验证策略名称是否存在
export const CHECK_STRATEGY_NAME_EXIST = `${APPLICATION}/strategy/checkStrategyNameExist`;
// 照明下发
export const DISTRIBUTE_LIGHT = `${APPLICATION}/strategy/distributeLightStrategy`;
// 信息发布下发
export const DISTRIBUTE_RELEASE = `${APPLICATION}/strategy/distributeInfoStrategy`;
// 联动策略下发
export const DISTRIBUTE_LINKAGE = `${APPLICATION}/strategy/distributeLinkageStrategy`;
// 设备列表
export const EQUIPMENT_LIST_PAGE = `${EQUIPMENT_SERVER}/equipmentInfo/equipmentListByPage`;
// 分组列表
export const GROUP_LIST_PAGE = `${GROUP_SERVER_YQ}/groupInfo/queryGroupInfoList`;
// 设备开关
export const EQUIPMENT_SWITCH_LIGHT = `${APPLICATION}/lightSingleCtrl/switchLight`;
// 设备调光
export const EQUIPMENT_DIMMING_LIGHT = `${APPLICATION}/lightSingleCtrl/dimmingLight`;
// 单控数量和集控数量
export const CONTROL_EQUIPMENT_COUNT = `${EQUIPMENT_SERVER}/equipmentInfo/getControlEquipmentCount`;
// 智慧杆数量
export const DEVICE_FUNCTION_POLE = `${EQUIPMENT_SERVER}/deviceInfo/queryDeviceMulitFunctionPole`;
// 安防新增
export const ADD_SECURITY_STRATEGY = `${APPLICATION}/strategy/addSecurityStrategy`;
// 联动策略的新增
export const LINKAGE_ADD = `${APPLICATION}/strategy/addLinkageStrategy`;
// 联动策略编辑
export const LINKAGE_EDIT = `${APPLICATION}/strategy/modifyLinkageStrategy`;
// 信息发布编辑列表内容
export const RELEASE_PROGRAM_EDIT = `${RELEASE_CONTENT_SERVER}/program/updateProgram`;
// 信息发布通过节目查看节目信息
export const RELEASE_PROGRAM_LOOK = `${RELEASE_CONTENT_SERVER}/program/queryProgramDetailById`;
// 信息新增节目信息
export const RELEASE_PROGRAM_ADD = `${RELEASE_CONTENT_SERVER}/program/insertProgram`;
// 信息新增审核(发起审核)
export const RELEASE_WORK_PROGRAM_ADD = `${RELEASE_CONTENT_SERVER}/programWorkOrder/addWorkProgram`;
// 信息发布获取内容审核列表
export const RELEASE_PROGRAMME_WORK_LIST_GET = `${RELEASE_CONTENT_SERVER}/programWorkOrder/queryProgrammeWorkList`;
// 信息发布工单审核操作
export const RELEASE_WORK_ORDER = `${RELEASE_CONTENT_SERVER}/programWorkOrder/auditWorkOrder`;
// 信息发布通过审核查看审核信息
export const RELEASE_WORK_ORDER_DETAIL = `${RELEASE_CONTENT_SERVER}/programWorkOrder/queryProgrammeWorkById`;
// 策略新增
export const LIGHTING_POLICY_ADD = `${APPLICATION}/strategy/addLightStrategy`;
// 策略编辑
export const LIGHTING_MODIFY_STRATEGY = `${APPLICATION}/strategy/modifyLightStrategy`;
// 策略启用禁用
export const LIGHTING_ENABLE_DISABLE = `${APPLICATION}/strategy/enableOrDisableStrategy`;
// 安防获取通道列表
export const SECURITY_PASSAGEWAY_LIST_GET = `${RELEASE_CONTENT_SERVER}/cameraWorkbench/queryChannelListByEquipmentId`;
// 获取配置信息
export const SECURITY_CONFIGURATION_GET = `${RELEASE_CONTENT_SERVER}/cameraWorkbench/queryConfiguration`;
// 亮灯率统计
export const LIGHTING_RATE_STATISTICS = `${APPLICATION}/lightStatisticsPart/getLightingRateStatisticsData`;
// 用电量统计
export const ELECT_CONS_STATISTICS = `${APPLICATION}/lightStatisticsPart/getElectConsStatisticsData`;
// 获取摄像头流地址
export const SECURITY_CONNECTION_CAMERA_GET = `${RELEASE_CONTENT_SERVER}/camera/queryCameraPlayStream`;
// 新增/修改配置信息
export const SECURITY_CONFIGURATION_SAVE = `${RELEASE_CONTENT_SERVER}/cameraWorkbench/saveConfiguration`;
// 新增/修改通道列表
export const SECURITY_CHANNEL = `${RELEASE_CONTENT_SERVER}/cameraWorkbench/saveChannel`;
// 安防上传文件（基础配置专用）
export const UPLOAD_SSL_FILE = `${RELEASE_CONTENT_SERVER}/cameraWorkbench/uploadSslFile`;
// 摄像头云台控制
export const CLOUD_CONTROL = `${RELEASE_CONTENT_SERVER}/cameraWorkbench/cloudControl`;



