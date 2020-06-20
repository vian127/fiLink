/**
 * 应用系统里面的路由配置
 */
export enum routerJump {
  LIGHTING_POLICY_CONTROL = 'business/application/lighting/policy-control',
  LIGHTING_POLICY_CONTROL_ADD = 'business/application/lighting/policy-control/add',
  LIGHTING_POLICY_CONTROL_EDIT = 'business/application/lighting/policy-control/edit',
  LIGHTING_WORKBENCH = 'business/application/lighting/workbench',
  RELEASE_WORKBENCH = 'business/application/release/workbench',
  STRATEGY = '/business/application/strategy/list',
  STRATEGY_ADD = '/business/application/strategy/add',
  STRATEGY_EDIT = '/business/application/strategy/edit',
  STRATEGY_DETAILS = '/business/application/strategy/details',
  RELEASE_POLICY_CONTROL = 'business/application/release/policy-control',
  RELEASE_WORKBENCH_ADD = 'business/application/release/policy-control/add',
  RELEASE_WORKBENCH_DETAILS = 'business/application/release/details',
  RELEASE_WORKBENCH_EDIT = 'business/application/release/policy-control/edit',
  SECURITY_WORKBENCH = 'business/application/security/workbench',
  SECURITY_POLICY_CONTROL = 'business/application/security/policy-control',
  SECURITY_POLICY_CONTROL_ADD = 'business/application/security/policy-control/add',
  SECURITY_POLICY_CONTROL_DETAILS = 'business/application/security/details',
  SECURITY_POLICY_CONTROL_EDIT = 'business/application/security/policy-control/edit',
  LIGHTING_DETAILS = 'business/application/lighting/details'
}

/**
 * 当前步骤的常量
 */
export enum finalValue {
  STEPS_FIRST = 1,
  STEPS_SECOND = 2,
  STEPS_THIRD = 3
}

/**
 * 步骤条切换样式
 */
export enum classStatus {
  STEPS_FINISH = 'finish',
  STEPS_ACTIVE = 'active'
}

/**
 * 区分三个平台的常量
 */
export enum applicationFinal {
  LIGHTING = 'lighting',
  RELEASE = 'release',
  SECURITY = 'security',
  DATE_TYPE = 'yyyy-MM-dd hh:mm:ss',
}

/**
 * 视频常量
 */
export enum videoFormat {
  '.mp4'
}

/**
 * 图片常量
 */
export enum pictureFormat {
  '.jpeg',
  '.png',
  '.jpg'
}

/**
 * 计算文件大小常量
 */
export enum calculationFileSize {
  kb = 1024,
  mb = 1048576,
  week_time = 7 * 24 * 60 * 60 * 1000,
}

/**
 * 策略列表枚举
 */
export const strategyList = {
  lighting: '1',
  centralizedControl: '2',
  information: '3',
  broadcast: '4',
  linkage: '5'
};

export const execStatus = {
  free: '0',
  implement: '1'
};
/**
 * 控制类型
 */
export const controlType = {
  platform: '1',
  equipment: '2'
};
/**
 * 策略状态
 */
export const strategyStatus = {
  open: '1',
  close: '2'
};

/**
 * 开启/关闭
 */
export enum SwitchAction {
  open = 'open',
  close = 'close'
}

/**
 * 上电/下电
 */
export enum Electric {
  up = 'up',
  down = 'down'
}


