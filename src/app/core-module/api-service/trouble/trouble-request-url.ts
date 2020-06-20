import {TROUBLE_SERVER, USER_SERVER, WORK_FLOW, DEVICE_SERVER_XKD} from '../api-common.config';

// 故障列表
export const QUERY_TROUBLE_LIST = `${TROUBLE_SERVER}/trouble/troubleListByPage`;
// 故障卡片
export const QUERY_TROUBLE_SHOW_TYPE = `${TROUBLE_SERVER}/trouble/countTroubleByType`;
// 故障详情
export const QUERY_TROUBLE_DETAIL = `${TROUBLE_SERVER}/trouble/queryTroubleById`;
// 故障类型
export const QUERY_TROUBLE_TYPE = `${TROUBLE_SERVER}/trouble/queryTroubleTypeList`;
// 新增故障
export const ADD_TROUBLE = `${TROUBLE_SERVER}/trouble/addTrouble`;
// 删除故障
export const DELETE_TROUBLE = `${TROUBLE_SERVER}/trouble/deleteTroubleByIds`;
// 故障备注
export const TROUBLE_REMARK = `${TROUBLE_SERVER}/trouble/updateTroubleRemark`;
// 编辑故障
export const UPDATE_TROUBLE = `${TROUBLE_SERVER}/trouble/updateTroubleById`;
// 查看故障流程
export const QUERY_TROUBLE_PROCESS = `${TROUBLE_SERVER}/trouble/queryTroubleProcess`;
// 查看故障历史流程
export const QUERY_TROUBLE_PROCESS_HISTORY = `${TROUBLE_SERVER}/trouble/queryTroubleProcesslistHistory`;
// 获取当前单位上级单位
export const GET_SUPERIOR_DEPARTMENT = `${USER_SERVER}/department/superiorDepartment`;
// 根据ID查询部门责任人
export const QUERY_DEPART_NAME = `${USER_SERVER}/department/queryDepartmentById`;
// 获取流程图
export const GET_FLOWCHART = `${WORK_FLOW}/process/flowChart`;
// 故障指派
export const TROUBLE_ASSIGN = `${TROUBLE_SERVER}/trouble/assignTrouble`;
// 故障设施
export const QUERY_DEVICE_LIST = `${DEVICE_SERVER_XKD}/deviceInfo/deviceListByPage`;
// 故障设备
export const QUERY_EQUIPMENT_LIST = `${DEVICE_SERVER_XKD}/equipmentInfo/equipmentListByPage`;
