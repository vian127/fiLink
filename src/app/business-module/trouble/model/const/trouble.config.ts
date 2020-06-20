/**
 * Created by xiaoconghu on 2019/1/14.
 * 故障相关配置文件
 */
import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../../../shared-module/util/common-util';

export const DATE_FORMAT_STR = 'yyyy-MM-dd HH:mm:ss';

export enum DeviceTypeCode {
  Optical_Box = '001', // 光交箱(有锁)(有智能标签)
  Well = '030', // 人井(有锁)
  Distribution_Frame = '060', // 配线架(有智能标签)
  Junction_Box = '090', // 接头盒(有智能标签)
  // Optical_Cable = '120', // 光缆段
  // Splitting_Box = '150', // 分纤箱
  // Parts = '180' ,// 配件
  OUTDOOR_CABINET = '210' // 室外柜 (有锁)
}

export enum CableDeviceTypeCode {
  Optical_Box = '001', // 光交箱(有锁)(有智能标签)
  Distribution_Frame = '060', // 配线架(有智能标签)
  Junction_Box = '090', // 接头盒(有智能标签)
}

export enum SimPackageType {
  One_Year = '1', // 1年
  Three_Year = '3', // 3年
  Five_Year = '5', // 5年
}

export enum DeviceDetailCode {
  passiveLock = '0', // 无源锁
  infrastructureDetails = '1', // 基础设施详情
  basicOperation = '2', // 基本设施操作
  intelligentEntranceGuard = '3', // 智能门禁详情(有没有主控)
  intelligentLabelDetail = '8', // 智能标签详情
  intelligentLabelSetting = '9', // 设施有配置智能标签
  facilityAlarm = '4', // 设施告警
  facilityWorkOrder = '7', // 设施工单
  facilityViewDetailLog = '5', // 设施日志
  facilityImgView = '6' // 设施图片
}

// 光缆级别
export enum cableLevelCode {
  localInterventionTrunkCable = '0', // 本地介入-主干光缆
  localInterventionEndCable = '1', // 本地接入-末端光缆
  firstClassTrunk = '2', // 一级干线
  secondaryTrunk = '3', // 二级干线
  localRelay = '4', // 本地中继
  localCore = '5', // 本地核心
  localConvergence = '6', // 本地汇聚
  tandemCable = '7', // 汇接层光缆
  contactCable = '8', // 联络光缆
  intraOfficeCable = '9', // 局内光缆
}

// 光缆拓扑结构
export enum topologyCode {
  ring = '0',  // 环形
  nonCircular = '1', // 非环形
}

// 布线类型
export enum wiringTypeCode {
  decrement = '0',  // 递减
  notDecrementing = '1', // 不递减
}

// 光缆段状态
export enum cableSectionStatus {
  use = '0', // 使用
  doNotUse = '1', // 未使用
}

// 熔纤设施类型转化
export enum coreDeviceType {
  opticalBox = 'optical box', // 光交箱
  junctionBox = 'junction box', // 接头盒
  DistributionFrame = 'distribution frame', // 配线架
  optical_box = '001', // 光交箱
  junction_box = '090', // 接头盒
  Distribution_Frame = '060' // 配线架
}

// 熔纤本对端框和光缆段
export enum coreCableType {
  localBox = 'localBox', // 本端光缆框
  peerBox = 'peerBox',     // 对端光缆框
  localCableStart = 'localCableStart', // 本端光缆段起始端
  localCableEnd = 'localCableEnd', // 本端光缆段尾端
  peerCableStart = 'peerCableStart', // 对端光缆段起始端
  peerCableEnd = 'peerCableEnd', // 对端光缆段尾端
}

// 告警级别
export enum AlarmLevelCode {
  URGENT = '1', // 紧急
  MAIN = '2', // 主要
  SECONDARY = '3', // 次要
  PROMPT = '4' // 提示
}

// 告警级别名称的转化
export enum AlarmLevelName {
  URGENT = 'urgentAlarmCount', // 紧急
  MAIN = 'mainAlarmCount', // 主要
  SECONDARY = 'minorAlarmCount', // 次要
  PROMPT = 'hintAlarmCount' // 提示
}

// 告警页面里面的禁启用
export enum DisableAndEnable {
  Disable = '2',
  Enable = '1',
}

export enum DeviceStatusCode {
  UNKNOWN = '1', // 未配置
  NORMAL = '2', // 正常
  ALARM = '3',  // 告警
  OFFLINE = '4', // 离线
  OUT_OF_CONTACT = '5', // 失联
}

export enum PartsTypeCode {
  bluetoothKey = '1',
  mechanicalKey = '2',
  labelGun = '3'
}

export enum DeployStatus {
  NONE = '0', // 无
  DEPLOYED = '1', // 已部防
  NODEFENCE = '2', // 未部防
  NOTUSED = '3', // 停用
  MAIINTENANCE = '4', // 维护
  DISMANTLE = '5', // 拆除
  DEPLOYING = '6' // 部署中
}


export const FacilityDeployStatusClassName = {
  '1': {
    className: 'icon-l icon_deploy_arm',
    name: 'arm'
  },        // 布防
  '2': {
    className: 'icon-l icon_deploy_unarm',
    name: 'unarm'
  },      // 未布防
  '3': {
    className: 'icon-l icon_deploy_disable',
    name: 'disable'
  },    // 停用
  '4': {
    className: 'icon-l icon_deploy_maintain',
    name: 'maintain'
  },   // 维护
  '5': {
    className: 'icon-l icon_deploy_remove',
    name: 'remove'
  },     // 拆除
  '6': {
    className: 'iconfont icon-fiLink fiLink-deploying',
    name: 'deploying'
  },    // 无
  '0': {
    className: '',
    name: ''
  }
};

export const FacilityStatusColor = {
  '2': '#36D1C9', // 正常
  '3': '#FB7356', // 告警
  '4': '#959595', // 离线
  '5': '#F8C032', // 失联
  '1': '#35AACE' // 未配置
};
export const AreaLevel = {
  AREA_LEVEL_ONE: 1,
  AREA_LEVEL_TWO: 2,
  AREA_LEVEL_THREE: 3,
  AREA_LEVEL_FOUR: 4,
  AREA_LEVEL_FIVE: 5
};

export enum AreaLevelEnum {
  AREA_LEVEL_ONE = 1,
  AREA_LEVEL_TWO = 2,
  AREA_LEVEL_THREE = 3,
  AREA_LEVEL_FOUR = 4,
  AREA_LEVEL_FIVE = 5
}

export const logType = {
  event: '1',
  // alarm: '2'
};
export const alarmCleanStatus = {
  noClean: 3,
  isClean: 1,
  deviceClean: 2,
};
export const isConfirm = {
  isConfirm: 1,
  noConfirm: 2
};
export const nodeObjectType = {
  PASSIVE_LOCK: '0', // 无源锁
  MECHANICAL_LOCK_CYLINDER: '1', // 机械锁芯
  ELECTRONIC_LOCK_CYLINDER: '2' // 电子锁芯
};
// 走向
export const TemplateTrend = {
  TEMPLATE_TREND_COL: 0,
  TEMPLATE_TREND_ROW: 1
};
// 编号规则
export const TemplateCodeRule = {
  leftUp: 0,
  leftDown: 1,
  rightUp: 2,
  rightDown: 3
};

export enum sensorValue {
  temperature = 'temperature',
  humidity = 'humidity',
  electricity = 'electricity',
  lean = 'lean',
  leach = 'leach'
}

export enum alarmNameHomePageEnum {
  // 撬门
  pryDoor = 'pryDoor',
  // 撬锁
  pryLock = 'pryLock',
  // 湿度
  humidity = 'humidity',
  // 高温
  highTemperature = 'highTemperature',
  // 低温
  lowTemperature = 'lowTemperature',
  // 通信中断
  communicationInterrupt = 'communicationInterrupt',
  // 水浸
  leach = 'leach',
  // 未关门
  notClosed = 'notClosed',
  // 未关锁
  unLock = 'unLock',
  // 倾斜
  lean = 'lean',
  // 震动
  shake = 'shake',
  // 电量
  electricity = 'electricity',
  // 非法开门
  violenceClose = 'violenceClose',
  // 非法开盖（内盖）
  illegalOpeningInnerCover = 'illegalOpeningInnerCover',
  // 工单超时
  orderOutOfTime = 'orderOutOfTime',
  //  应急开锁告警
  emergencyLock = 'emergencyLock',
}


export enum alarmNameColorEnum {
  // 撬门
  pryDoor = '#2e5ed8',
  // 撬锁
  pryLock = '#9109e7',
  // 湿度
  humidity = '#53e93a',
  // 高温
  highTemperature = '#dc0c0c',
  // 低温
  lowTemperature = '#00a2e6',
  // 通信中断
  communicationInterrupt = '#acacab',
  // 水浸
  leach = '#9b600b',
  // 未关门
  notClosed = '#e9611d',
  // 未关锁
  unLock = '#f53d5c',
  // 倾斜
  lean = '#8390ab',
  // 震动
  shake = '#045c66',
  // 电量
  electricity = '#179003',
  // 非法开门
  violenceClose = '#660d04',
  // 非法开盖（内盖）
  illegalOpeningInnerCover = '#fee901',
  // 工单超时
  orderOutOfTime = '#f6b55a',
  //  应急开锁告警
  emergencyLock = '#a2000d',
}

// 主控类型
export enum HostTypeEnum {
  // 无源锁
  PassiveLock = '0',
  // 机械锁芯
  MechanicalLock = '1',
  // 电子锁芯
  ElectronicLock = '2'
}

export enum moduleTypeCode {
  // 2G
  G2 = '1',
  // nb
  NB = '2',
  // 4G
  G4 = '3'
}

export enum moduleTypeName {
  G2 = '2G',
  NB = 'NB',
  G4 = '4G'
}

// 供电方式
export enum sourceType {
  // 适配器
  adapter = '0',
  // 可充电电池
  rechargeableBattery = '1',
  // 不可充电电池
  NonRechargeableBattery = '2'
}

// 太阳能电池
export enum solarCell {
  // 已安装
  Installed = '0',
  // 未安装
  NotInstalled = '1',
  // 不支持
  notSupport = '2'
}

// 开锁状态
export enum lockStatusEnum {
  // 锁开
  lockOpen = '1',
  // 锁关
  lockOff = '2',
  // 锁失效
  lockInvalid = '0'
}

export enum operatorEnum {
  //  移动
  mobile = '0',
  // 电信
  telecommunications = '1',
  // 联通
  Unicom = '2',
  // 未知
  unknown = '3'
}

// 激活状态
export enum activeStatusEnum {
  // 休眠
  dormancy = '0',
  // 激活
  active = '1'
}

export enum wellCover {
  innerCover = '1',
  outCover = '2',
}

// 处理状态
export enum handleStatusEnum {
  uncommit = 'uncommit', // 未提交
  commit = 'commit',  // 已提交
  processing = 'processing', // 处理中
  done = 'done', //  已完成
  undone = 'undone' // 已打回
}
// 故障类型
export enum troubleTypeEnum {
  communication = '1',  // 通信故障
  qualityService = '2',  // 业务质量故障
  environment = '3', // 环境故障
  electricityTrouble = '4', // 电力故障
  safety = '5',  // 安全故障
  equipment = '6', // 设备故障
}

// 故障来源
export enum troubleSourceEnum {
  App = 'App',  // App报修
  complaint = 'complaint', // 投诉
  alarm = 'alarm' // 告警
}

// 指派类型
export enum designateTypeEnum {
  initial = '0', // 初始指派
  duty = '1',  // 责任上报
  reportResponsibleLeaders = '2', // 上报分管领导
  troubleRepulse = '3', // 故障打回
  coordinateSuccessful = '4', // 协调成功
  coordinateFailConstraint = '5', // 协调不成功强制指派
  coordinateFailChargeback = '6', // 协调不成功退单
}

// 指派原因
export enum designateReasonEnum {
  initial = '0',  // 初始指派
  againDesignate = '1',  // 指派错误，需重新指派
  coordinate = '2', // 责任无法确定,需上级协调
  other = '3', // 其他
}

/**
 * 获取告警类型
 */
export function getAlarmType(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(alarmNameHomePageEnum, i18n, code);
}
export function getDeviceType(i18n: NzI18nService, code = null): any {
  return CommonUtil.codeTranslate(DeviceTypeCode, i18n, code);
}
export function getAlarmLevel(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(AlarmLevelCode, i18n, code);
}
export function getDeviceStatus(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(DeviceStatusCode, i18n, code);
}
export function getDeployStatus(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(DeployStatus, i18n, code);
}
export function getHandleStatus(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(handleStatusEnum, i18n, code);
}
export function getTroubleType(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(troubleTypeEnum, i18n, code);
}
export function getTroubleSource(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(troubleSourceEnum, i18n, code);
}
export function getDesignateType(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(designateTypeEnum, i18n, code, 'fault.config');
}
export function getDesignateReason(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(designateReasonEnum, i18n, code, 'fault.config');
}
