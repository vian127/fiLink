import {USER_SERVER, DEVICE_SERVER} from '../api-common.config';

const USER = `${USER_SERVER}/user`;
// const USER = 'user';
// 查询用户信息列表(按框架组件要求的)
export const QUERY_USER_LIST = `${USER}/queryUserList`;
// 查询用户列表(后端重写自定义的)
export const QUERY_USER_LISTS = `${USER}/queryUserByField`;
// 查询用户列表(带权限)
export const QUERY_USER_BY_PERMISSION = `${USER}/queryUserByPermission`;

// 查询单个用户信息
export const QUERY_USER_INFO_BY_ID = `${USER}/queryUserInfoById/`;
// 新增单个用户
export const INSERT_USER = `${USER}/insert`;
// 修改用户
export const UPDATE_USER = `${USER}/update`;
// 删除用户
export const DELETE_USER = `${USER}/deleteByIds`;
// 用户状态修改
export const UPDATE_USER_STATUS = `${USER}/updateUserStatus`;
// 用户校验
export const VERIFY_USER_INFO = `${USER}/verifyUserInfo`;
// 邮箱校验
export const QUERY_EMAIL_IS_EXIST = `${USER}/queryEmailIsExist`;
// 重置密码
export const RESET_PASSWORD = `${USER}/resetPWD`;
// 修改密码
export const MODIFY_PASSWORD = `${USER}/modifyPWD`;
// 查询用户默认密码
export const QUERY_PASSWORD = `${USER}/queryUserDefaultPWD`;

export const LOGOUT = `${USER}/logout`;
// 在线用户信息列表
export const GET_ONLINE_USER = `${USER}/getOnLineUser`;
// 强制下线在线用户
export const OFFLINE = `${USER}/forceOffline`;

// 导入用户
export const IMPORT_USER = `${USER}/importUserInfo`;
// 导出用户
export const EXPORT_USER = `${USER}/exportUserList`;


const DEPARTMENT = `${USER_SERVER}/department`;
// const DEPARTMENT = 'department';
// 查询部门列表信息
export const QUERY_DEPT_LIST = `${DEPARTMENT}/queryDeptList`;
// 不分页查询部门信息
export const QUERY_ALL_DEPARTMENT = `${DEPARTMENT}/queryTotalDepartment`;
// 查询单个部门信息
export const QUERY_DEPT_INFO_BY_ID = `${DEPARTMENT}/queryDeptInfoById/`;
// 新增单个部门
export const INSERT_DEPT = `${DEPARTMENT}/insert`;
// 删除部门
export const DELETE_DEPT = `${DEPARTMENT}/deleteByIds`;
// 修改部门信息
export const UPDATE_DEPT = `${DEPARTMENT}/update`;
// 查询所有单位/部门(无分页)
export const QUERY_TOTAL_DEPT = `${DEPARTMENT}/queryTotalDepartment`;
// 查询所有部门(有分页)
export const QUERY_ALL_DEPT = `${DEPARTMENT}/queryDepartmentList`;
// 单位部门校验
export const VERIFY_DEPT_INFO = `${DEPARTMENT}/verifyDeptInfo`;
// 用户列表所有部门(平级)
export const QUERY_TOTAL_DEPARTMENT = `${DEPARTMENT}/conditionDepartment`;

const ROLE = `${USER_SERVER}/role`;
// const ROLE = 'role';
// 查询角色列表信息
export const QUERY_ROLE_LIST = `${ROLE}/queryRoleList`;
// 查询角色新接口
export const QUERY_ROLES_LIST = `${ROLE}/queryRoleByField`;
// 查询单个角色信息
export const QUERY_ROLE_INFO_BY_ID = `${ROLE}/queryRoleInfoById/`;
// 查询所有角色(无分页)
export const QUERY_ALL_ROLES = `${ROLE}/queryAllRoles`;
// 新增单个角色
export const INSERT_ROLE = `${ROLE}/insert`;
// 修改角色信息
export const UPDATE_ROLE = `${ROLE}/update`;
// 删除角色
export const DELETE_ROLE = `${ROLE}/deleteByIds`;
// 角色校验
export const VERIFY_ROLE_INFO = `${ROLE}/verifyRoleInfo`;


// 统一授权
const UNIFY_AUTH = `${USER_SERVER}/unifyauth`;
// 查询统一授权列表
export const QUERY_UNIFY_AUTH_LIST = `${UNIFY_AUTH}/queryUnifyAuthByCondition`;

// 新增统一授权
export const ADD_UNIFY_AUTH = `${UNIFY_AUTH}/addUnifyAuth`;

// 查询单个统一授权信息
export const QUERY_UNIFY_AUTH_BY_ID = `${UNIFY_AUTH}/queryUnifyAuthById`;

// 修改统一授权信息
export const MODIFY_UNIFY_AUTH = `${UNIFY_AUTH}/modifyUnifyAuth`;

// 删除单个统一授权信息
export const DELETE_UNIFY_AUTH_BY_ID = `${UNIFY_AUTH}/deleteUnifyAuthById`;

// 批量删除统一授权信息
export const DELETE_UNIFY_AUTH_BY_IDS = `${UNIFY_AUTH}/batchDeleteUnifyAuth`;

// 批量生效/禁用统一授权信息状态
export const BATCH_MODIFY_UNIFY_AUTH_STATUS = `${UNIFY_AUTH}/batchModifyUnifyAuthStatus`;


// 临时授权
const TEMP_AUTH = `${USER_SERVER}/tempauth`;
// 查询临时授权列表
export const QUERY_TEMP_AUTH_LIST = `${TEMP_AUTH}/queryTempAuthByCondition`;

// 审核单个临时授权
export const AUDING_TEMP_AUTH_BY_ID = `${TEMP_AUTH}/audingTempAuth`;

// 批量审核临时授权
export const AUDING_TEMP_AUTH_BY_IDS = `${TEMP_AUTH}/batchAudingTempAuthByIds`;

// 删除单个临时授权信息
export const DELETE_TEMP_AUTH_BY_ID = `${TEMP_AUTH}/deleteTempAuthById`;

// 批量删除统一授权信息
export const DELETE_TEMP_AUTH_BY_IDS = `${TEMP_AUTH}/batchDeleteTempAuth`;

// 查询单个临时授权信息
export const QUERY_TEMP_AUTH_BY_ID = `${TEMP_AUTH}/queryTempAuthById`;


// 权限
const PERMISSION = `${USER_SERVER}/permission`;

// 查询顶级权限
export const QUERY_TOP_PERMISSION = `${PERMISSION}/queryTopPermission`;

// 设施
const DEVICEINFO = `${DEVICE_SERVER}/deviceInfo`;

// 根据设施ids查询设备信息
export const GET_DEVICE_BY_IDS = `${DEVICEINFO}/getDeviceByIds`;

// 获取所有的设施集
export const GET_DEVICE_TYPE = `${DEVICE_SERVER}/deviceConfig/getDeviceType`;

// 查询统一授权信息
export const QUERY_USER_UNIFY_AUTH_BY_ID = `${UNIFY_AUTH}/queryUserAuthInfoById`;

// 授权名称校验
export const QUERY_AUTH_BY_NAME = `${UNIFY_AUTH}/queryAuthByName`;


