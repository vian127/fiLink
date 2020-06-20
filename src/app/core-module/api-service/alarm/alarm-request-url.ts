import {ALARM_CURRENT_SERVER} from '../api-common.config';
import {ALARM_HISTORY_SERVER} from '../api-common.config';
import {
  ALARM_SET_SERVER, DEVICEINFO, USER_SERVER, DEVICE_SERVER,
  COMMON_PREFIX, WORK_ORDER_SERVER, INDEX_WORK_ORDER_SERVER
} from '../api-common.config';

const ALARM_CURRENT = `${ALARM_CURRENT_SERVER}/alarmCurrent`;
const QUERY_ALARM_CURRENT = `${ALARM_CURRENT_SERVER}`;
const ALARM_INDEX_WORK_ORDER_SERVER = `${INDEX_WORK_ORDER_SERVER}/repairOrder`;

// const ALARM_CURRENT = 'alarmCurrent';
// 查询当前告警列表信息
export const QUERY_ALARM_CURRENT_LIST = `${ALARM_CURRENT}/queryAlarmCurrentList`;
// 查询单个当前告警的信息
export const QUERY_ALARM_CURRENT_INFO_BY_ID = `${ALARM_CURRENT}/queryAlarmCurrentInfoById`;
// 批量修改当前告警备注信息
export const UPDATE_ALARM_REMARK = `${ALARM_CURRENT}/updateAlarmRemark`;
// 批量设置当前告警的告警确认状态
export const UPDATE_ALARM_CONFIRM_STATUS = `${ALARM_CURRENT}/updateAlarmConfirmStatus`;
// 批量设置当前告警的告警清除状态
export const UPDATE_ALARM_CLEAN_STATUS = `${ALARM_CURRENT}/updateAlarmCleanStatus`;
// 查询各级别告警总数
export const QUERY_EVERY_ALARM_COUNT = `${ALARM_CURRENT}/queryEveryAlarmCount`;
// websocket-msg
export const WEBSOCKET = `${ALARM_CURRENT}/websocket`;
// 查询告警关联部门
export const QUERY_DEPARTMENT_ID = `${ALARM_CURRENT}/queryDepartmentId`;
// 未查询到当前告警则查询历史告警的关联部门
export const QUERY_DEPARTMENT_HISTORY = `${ALARM_HISTORY_SERVER}/alarmHistory/queryDepartmentHistory`;
// 首页设施详情查看当前告警
export const QUERY_ALARM_DEVICE_ID = `${ALARM_CURRENT}/queryAlarmDeviceId`;

const ALARM_CURRENT_SERVER_TEMPLATE = `${ALARM_CURRENT_SERVER}/alarmQueryTemplate`;
// 当前告警 查询模板列表信息
export const QUERY_TEMPLATE = `${ALARM_CURRENT_SERVER_TEMPLATE}/queryAlarmTemplateList`;
// 当前告警 模板 删除
export const DELETE_ALARM_TEMPLATE_LIST = `${ALARM_CURRENT_SERVER_TEMPLATE}/batchDeleteAlarmTemplate`;
// 当前告警 新增模板
export const ADD_ALARM_TEMPLATE = `${ALARM_CURRENT_SERVER_TEMPLATE}/addAlarmTemplate`;
// 当前告警 编辑模板
export const UPDATE_ALARM_TEMPLATE = `${ALARM_CURRENT_SERVER_TEMPLATE}/updateAlarmTemplate`;
// 当前告警 根据模板查询
export const ALARM_QUERY_TEMPLATE = `${ALARM_CURRENT_SERVER_TEMPLATE}/queryAlarmQueryTemplateById`;
// 当前告警 编辑模板 通过ID查询数据
export const QUERY_ALARM_TEMPLATE_BY_ID = `${ALARM_CURRENT_SERVER_TEMPLATE}/queryAlarmTemplateById`;
// 查询没有关联工单的告警
export const QUERY_ALARM_CURRENT_PAGE = `${ALARM_CURRENT}/queryAlarmCurrentPage`;

const ALARM_HISTORY = `${ALARM_HISTORY_SERVER}/alarmHistory`;
// const ALARM_HISTORY = 'alarmHistory';
// 查询历史告警列表信息
export const QUERY_ALARM_HISTORY_LIST = `${ALARM_HISTORY}/queryAlarmHistoryList`;
// 查询单个历史告警的信息
export const QUERY_ALARM_HISTORY_INFO_BY_ID = `${ALARM_HISTORY}/queryAlarmHistoryInfoByIdFeign`;
// 首页设施详情查看历史告警
export const QUERY_ALARM_HISTORY_DEVICE_ID = `${ALARM_HISTORY}/queryAlarmHistoryDeviceId`;

const ALARM_SET = `${ALARM_SET_SERVER}/alarmSet`;
// const ALARM_SET = 'alarmSet';
// 查询告警级别列表信息
export const QUERY_ALARM_LEVEL_LIST = `${ALARM_SET}/queryAlarmLevelList`;
// 查询当前告警设置列表信息
export const QUERY_ALARM_CURRENT_SET_LIST = `${ALARM_SET}/queryAlarmNamePage`;
// 当前告警设置列表
export const QUERY_ALARM_SET_LIST = `${ALARM_SET}/queryAlarmNameList`;
// 修改告警级别设置信息
export const UPDATE_ALARM_COLOR_AND_SOUND = `${ALARM_SET}/updateAlarmColorAndSound`;
// 告警级别设置
export const UPDATE_ALARM_LEVEL = `${ALARM_SET}/updateAlarmLevel`;

// 新增当前告警设置
export const INSERR_ALARM_CURRENTSET = `${ALARM_SET}/addAlarmName`;
// 修改当前告警设置
export const UPDATE_ALARM_CURRENTSET = `${ALARM_SET}/updateAlarmCurrentSet`;
// 查询单个当前告警设置信息
export const QUERY_ALARM_LEVEL_SET_BY_ID = `${ALARM_SET}/queryAlarmCurrentSetById`;
// 删除当前告警设置
export const DELETE_ALARM_CURRENTSET = `${ALARM_SET}/deleteAlarmCurrentSet`;
// 查询单个当前告警级别设置信息
export const QUERY_ALARM_LEVEL_BY_ID = `${ALARM_SET}/queryAlarmLevelById/`;
// 查询历史告警设置信息
export const QUERY_ALARM_DELAY = `${ALARM_SET}/selectAlarmDelay`;
// 历史告警设置
export const UPDATE_ALARM_DELAY = `${ALARM_SET}/updateAlarmDelay`;
// 历史告警 修改备注
export const UPDATE_HISTORY_ALARM_REMARK = `${ALARM_HISTORY}/batchUpdateAlarmRemark`;
// 告警提示音选择
export const SELECT_ALARM_ENUM = `${ALARM_SET}/selectAlarmEnum`;
// 查询告警名称
export const QUERY_ALARM_NAME = `${ALARM_SET}/queryAlarmName`;
// 查询告警级别
export const QUERY_ALARM_LEVEL = `${ALARM_SET}/queryAlarmLevel`;

const ALARM_FILTER_RULE = `${ALARM_SET_SERVER}/alarmFilterRule`;
// 查询告警过滤
export const QUERY_ALARM_FILTRATION = `${ALARM_FILTER_RULE}/queryAlarmFilterRuleList`;

// 删除告警过滤
export const DELETE_ALARM_FILTRATION = `${ALARM_FILTER_RULE}/batchDeleteAlarmFilterRule`;

// 查询告警对象信息
export const QUERY_ALARM_OBJECT = `${ALARM_FILTER_RULE}/queryDeviceList`;
// 获取告警过滤对象 告警对象
export const QUERY_ALARM_FILTRATION_OBJ = `${DEVICEINFO}/deviceListByPage`;

// 修改代码状态
export const UPDATE_ALARM_FILTRATION = `${ALARM_FILTER_RULE}/batchUpdateAlarmFilterRuleStatus`;

// 修改是否库存
export const UPDATE_ALARM_FILTRATION_STORED = `${ALARM_FILTER_RULE}/batchUpdateAlarmFilterRuleStored`;

// 新增告警过滤
export const ADD_ALARM_FILTRATION = `${ALARM_FILTER_RULE}/addAlarmFilterRule`;

// 修改告警过滤
export const APDATE_ALARM_FILTRATION = `${ALARM_FILTER_RULE}/updateAlarmFilterRule`;

// 根据id 查询数据
export const QUERY_ALARM_INFO_BY_ID = `${ALARM_FILTER_RULE}/queryAlarmFilterRuleById`;

const ALARM_FILTER_REMOTE = `${ALARM_SET_SERVER}/alarmForwardRule`;
// 查询告警远程通知列表数据
export const QUERY_ALARM_REMOTE = `${ALARM_FILTER_REMOTE}/queryAlarmForwardRuleList`;

// 告警远程通知 修改启禁状态
export const UPDATE_ALARM_FILTRATION_REMOTE_STORED = `${ALARM_FILTER_REMOTE}/batchUpdateAlarmForwardRuleStatus`;
// 告警远程通知 修改推送方式
export const UPDATE_ALARM_FILTRATION_REMOTE_PUSHTYPE = `${ALARM_FILTER_REMOTE}/batchUpdateAlarmForwardRulePushType`;

// 告警远程通知 删除
export const DELETE_ALARM_REMOTE = `${ALARM_FILTER_REMOTE}/batchDeleteAlarmForwardRule`;
const USER = `${USER_SERVER}/user`;
// 告警远程通知 新增页面 请求通知人
export const QUERY_ALARM_USER = `${USER}/queryUserByField `;
// 告警远程通知 通过区域 和 设施类型 查询通知人
export const QUERY_USER_INFOBY_DEPT_AND_DEVICE_TYPE = `${USER}/queryUserInfoByDeptAndDeviceType `;
// 告警远程通知 新增
export const ADD_ALARM_REMOTE = `${ALARM_FILTER_REMOTE}/addAlarmForwardRule`;
// 告警远程通知 编辑 通过ID 查询相关数据
export const QUERY_ALARM_REMOTE_BY_ID = `${ALARM_FILTER_REMOTE}/queryAlarmForwardId`;
// 告警远程通知 编辑
export const UPDATE_ALARM_REMOTE = `${ALARM_FILTER_REMOTE}/updateAlarmForwardRule`;

export const AREA_LIST_BY_ID_SERVER = `${DEVICE_SERVER}/areaInfo`;
// 告警远程通知 通过 通知人查询区域
export const AREA_LIST_BY_ID = `${AREA_LIST_BY_ID_SERVER}/selectForeignAreaInfo`;

const ALARM_WORK_ORDER = `${ALARM_SET_SERVER}/alarmOrderRule`;
// 请求告警转工单 列表数据
export const QUERY_ALARM_WORK = `${ALARM_WORK_ORDER}/queryAlarmOrderRuleList`;
// 删除告警转工单
export const DELETE_ALARM_WORK = `${ALARM_WORK_ORDER}/batchDeleteAlarmOrderRule`;
// 告警转工单 修改启禁状态
export const UPDATE_ALARM_FILTRATION_WORK_STORED = `${ALARM_WORK_ORDER}/batchUpdateAlarmOrderRuleStatus`;
// 告警转工单 新增
export const ADD_ALARM_WORK = `${ALARM_WORK_ORDER}/addAlarmOrderRule`;
// 告警转工单 编辑
export const APDATE_ALARM_WORK = `${ALARM_WORK_ORDER}/updateAlarmOrderRule`;
// 告警转工单 编辑 通过ID查询数据
export const QUERY_ALARM_WORK_BY_ID = `${ALARM_WORK_ORDER}/queryAlarmOrderRule`;

const AREA_INFO = `${COMMON_PREFIX}${DEVICE_SERVER}/areaInfo`;
// 告警转工单获取 所有区域
export const SELECT_FOREIGN_AREA_INFO = `${AREA_INFO}/selectForeignAreaInfoForPageSelection`;

// 告警远程通知 通过区域获取单位
export const AREA_GET_UNIT = `${AREA_INFO}/selectAreaDeptInfoByAreaIdsForPageSelection`;
// 告警远程通知 通过区域获取设施类型
export const QUERY_DEVICE_TYPE_BY_AREAIDS = `${DEVICE_SERVER}/${DEVICEINFO}/queryDeviceTypesByAreaIds`;

export const QUERY_USER_SERVER = `${USER_SERVER}/user`;
// 根据通知人请求 设施类型
export const SELECT_FOREIGN_DEVICE_TYPE_INFO = `${QUERY_USER_SERVER}/queryUserDetailByIds`;

// 当前告警 导出
export const EXPORT_ALARM_LIST = `${ALARM_CURRENT}/exportAlarmList`;

const PIC_RELATION_INFO = `${DEVICE_SERVER}/picRelationInfo`;
// 当前告警 查看图片
export const EXAMINE_PICTURE = `${PIC_RELATION_INFO}/getPicUrlByAlarmId`;

const PROC_CLEAR_FAILURE = `${WORK_ORDER_SERVER}/procClearFailure`;
// 当前告警 创建工单
export const ADD_CLEAR_FAILURE_PROC = `${PROC_CLEAR_FAILURE}/addClearFailureProc`;

// 历史告警 导出
export const EXPORT_HISTORY_ALARM_LIST = `${ALARM_HISTORY}/exportAlarmList`;
// 历史告警 查看图片
export const EXAMINE_PICTURE_HISTORY = `${PIC_RELATION_INFO}/getPicUrlByAlarmId`;

const ALARM_HISTORY_SERVER_TEMPLATE = `${ALARM_HISTORY_SERVER}/alarmQueryTemplate`;

// 历史告警 根据模板查询
export const ALARMM_HISTORY_QUERY_TEMPLATE = `${ALARM_HISTORY_SERVER_TEMPLATE}/queryAlarmQueryTemplateById`;
// 历史告警 查询模板列表信息
export const QUERY_ALARM_HISTORY_TEMPLATE = `${ALARM_HISTORY_SERVER_TEMPLATE}/queryAlarmTemplateList`;

// 历史告警 模板 删除
export const DELETE_ALARM_HISTORY_TEMPLATE_LIST = `${ALARM_HISTORY_SERVER_TEMPLATE}/batchDeleteAlarmTemplate`;

// 历史告警 新增模板
export const ADD_ALARM_HISTORY_TEMPLATE = `${ALARM_HISTORY_SERVER_TEMPLATE}/addAlarmTemplate`;

// 历史告警 编辑模板
export const UPDATE_ALARM_HISTORY_TEMPLATE = `${ALARM_HISTORY_SERVER_TEMPLATE}/updateAlarmTemplate`;

// 历史告警 编辑模板 通过ID查询数据
export const QUERY_ALARM_HISTORY_TEMPLATE_BY_ID = `${ALARM_HISTORY_SERVER_TEMPLATE}/queryAlarmTemplateById`;

const ALARM_STATISTICS = `${ALARM_CURRENT_SERVER}/alarmStatistics`;
// 告警类型统计
export const QUERY_ALARM_CONUT_BY_LEVEL_AND_AREA = `${ALARM_STATISTICS}/queryAlarmConutByLevelAndArea`;

// 告警处理统计
export const QUERY_ALARM_HANDLE = `${ALARM_STATISTICS}/queryAlarmHandleStatistics`;

// 告警名称统计
export const QUERY_ALARM_NAME_STATISTICS = `${ALARM_STATISTICS}/queryAlarmNameStatistics`;

// 区域告警比统计
export const AREA_ALARM_STATISTICS = `${ALARM_STATISTICS}/queryAreaAlarmStatistics`;

// 告警增量统计
export const ALARM_INCREMENTAL_STATISTICS = `${ALARM_STATISTICS}/queryAlarmIncrementalStatistics`;

// 告警统计 模板
export const ALARM_STATISTICAL_LIST = `${ALARM_STATISTICS}/queryAlarmStatisticsTempList`;
// 统计模板删除
export const DELETE_ALARM_STATISTICAL = `${ALARM_STATISTICS}/deleteManyAlarmStatisticsTemp`;
// 统计模板新增
export const ADD_ALARM_STATISTICAL_TEMPLATE = `${ALARM_STATISTICS}/addAlarmStatisticsTemp`;
// 统计模板 通过ID查询
export const QUERY_ALARM_STAt_BY_TEMP_ID = `${ALARM_STATISTICS}/queryAlarmStatById`;
// 统计模板 编辑
export const UPDATE_ALARM_STATISTICAL_TEMPLATE = `${ALARM_STATISTICS}/updateAlarmStatisticsTemp`;
// 通过统计模板查询
export const QUERY_ALARM_STAt_TEMP = `${ALARM_STATISTICS}/queryAlarmStatByTempId`;
// 当前告警 卡片 通过设施查询
export const QUERY_ALARM_OBJECT_COUNT = `${ALARM_CURRENT}/queryAlarmObjectCount`;
// 告警统计 导出
export const EXPORT_ALARM_STATISTICAL = `${ALARM_STATISTICS}/exportAlarmStatisticsList`;
// 当前告警页面 首页选择告警ID 进入设施类型 卡牌发送请求
export const QUERY_ALARM_ID_COUNT_HONE_PAGE = `${ALARM_CURRENT}/queryAlarmIdCountHonePage`;
// 当前告警页面 首页选择告警ID 进入告警级别 卡牌发送请求
export const QUERY_ALARM_ID_HONE_PAGE = `${ALARM_CURRENT}/queryAlarmIdHonePage`;

// 当前告警页面 首页选择更多信息 进入 设施类型 卡牌发送请求
export const QUERY_ALARM_OBJECT_COUNT_HONE_PAGE = `${ALARM_CURRENT}/queryAlarmObjectCountHonePage`;
// 当前告警页面 首页通过选择更多信息进去 卡牌 请求 告警级别
export const QUERY_ALARM_DEVICE_ID_COUNT_HONE_PAGE = `${ALARM_CURRENT}/queryAlarmDeviceIdHonePage`;
// 设施详情单个设施告警的统计相关url
export const DEVICE_DETAIL_ALARM_STATISTICS = {
  // 设施统计当前告警级别信息
  currentLevel: `${ALARM_STATISTICS}/queryAlarmCurrentDeviceLevel`,
  // 设施统计历史告警级别信息
  historyLevel: `${ALARM_STATISTICS}/queryAlarmHistoryDeviceLevel`,
  // 设施统计当前告警名称信息
  currentSourceName: `${ALARM_STATISTICS}/queryAlarmCurrentDeviceName`,
  // 设施统计历史告警名称信息
  historySourceName: `${ALARM_STATISTICS}/queryAlarmHistoryDeviceName`,
  //  设施统计告警增量
  alarmSourceIncremental: `${ALARM_STATISTICS}/queryAlarmDeviceIncremental`
};
// 查询责任单位下是否有告警转工单规则
export const QUERY_ALARM_ORDER_RULE_BY_DEPT_IDS = `${ALARM_SET_SERVER}/alarmOrderRule/queryAlarmOrderRuleByAreaDeptIds`;
// 派单销障
export const ORDER_CANCEL_ACCOUNT = `${ALARM_CURRENT}/alarmDiagnoseSetting/alarmToSelling`;
// 诊断设置数据
export const GET_DIAGNOSTIC_DATA = `${QUERY_ALARM_CURRENT}/alarmDiagnoseSetting/queryDiagnoseSettingList`;
// 诊断设置更新
export const DIAGNOSTIC_UPDATE = `${QUERY_ALARM_CURRENT}/alarmDiagnoseSetting/updateDiagnoseSetting`;
// 告警建议
export const QUERY_EXPERIENCE_INFO = `${QUERY_ALARM_CURRENT}/alarmExperience/queryExperienceInfo`;
// 告警转故障
export const ALARM_TO_TROUBLE = `${QUERY_ALARM_CURRENT}/alarmDiagnoseSetting/alarmToTrouble`;
// 误判
export const ALARM_MIS_JUDGMENT = `${ALARM_CURRENT}/alarmMisjudgment`;
// 已处理
export const ALARM_PROCESSED = `${ALARM_CURRENT}/alarmProcessed`;
// 销障工单
export const  ELIMINATE_WORK = `${ALARM_INDEX_WORK_ORDER_SERVER}/queryListRepairOrderByAlarmIdForAlarm`;
// 告警设置删除
export const  DELETE_ALARM_SET = `${ALARM_SET}/deleteAlarmNameById`;
// 告警类型
export const  QUERY_ALARM_TYPE_LIST = `${ALARM_CURRENT}/queryAlarmTypeList`;
// 查询告警名称唯一性
export const  ALARM_NAME_EXIST = `${ALARM_SET}/alarmNameExist`;
// 查询告警代码唯一性
export const  ALARM_CODE_EXIST = `${ALARM_SET}/alarmCodeExist`;
