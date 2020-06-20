export const WORK_ORDER_STATUS = {
  'assigned': 'assigned',   // 待指派
  'pending': 'pending',   // 待处理
  'processing': 'processing',   // 处理中
  'completed': 'completed',   // 已完成
  'singleBack': 'singleBack',   // 已退单
  'turnProcessing': 'turnProcessing' // 已转派
};

export const WORK_ORDER_STATUS_CLASS = {
  'assigned': 'fiLink-assigned-w statistics-assigned-color',
  'pending': 'fiLink-processed statistics-pending-color',
  'processing': 'fiLink-processing statistics-processing-color',
  'turnProcessing': 'fiLink-filink-yizhuanpai-icon statistics-turnProcessing-color',
  'completed': 'fiLink-completed statistics-completed-color',
  'singleBack': 'fiLink-chargeback statistics-singleBack-color',
};

export const WORK_ORDER_TYPE = [
  {
    'value': 'clear_failure',
    'label': 'clearBarrier'
  },
  {
    'value': 'inspection',
    'label': 'inspection'
  }
];

export const WORK_ORDER_ERROR_REASON_CODE = {
  other: '0', // 0 其他
  personDamage: '1', // 1 人为损坏
  RoadConstruction: '2', // 2 道路施工
  stealWear: '3', // 3 盗穿
  clearBarrier: '4' // 4 销障
};

export const WORK_ORDER_ERROR_REASON_NAME = {
  other: 'other',
  personDamage: 'personDamage',
  RoadConstruction: 'RoadConstruction',
  stealWear: 'stealWear',
  clearBarrier: 'clearBarrier'
};

export const WORK_ORDER_SINGLE_BACK_REASON_CODE = {
  other: '0', // 0 其他
  FalsePositives: '1' // 1人为损坏
};

export const WORK_ORDER_SINGLE_BACK_REASON_NAME = {
  other: 'other',
  FalsePositives: 'FalsePositives'
};

export const WORK_ORDER_PROCESSING_SCHEME_NAME = {
  other: 'other',
  repair: 'repair',
  destruction: 'destruction'
};

export const WORK_ORDER_PROCESSING_SCHEME_CODE = {
  other: '0', // 0-其他（对应故障原因-其他)
  repair: '1', // 1-报修（对应故障原因-人为损坏，道路施工，盗穿）
  destruction: '2' // 2 - 现场销障（对应故障原因-销障）
};

export const WORK_ORDER_UNFINISHED_INSPECTION_NUMBER = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  StrZero: '0',
  StrOne: '1'
};

export const WORK_ORDER_DEVICE_TYPE = {
  patchPanel: '060',
  opticalBox: '001',
  manWell: '030',
  jointClosure: '090',
  outDoorCabinet: '210',
  wisdom: '002', // 智慧杆
  distributionPanel: '003' // 配电箱
};

export const WORK_ORDER_NORMAL_AND_ABNORMAL = {
  normal: '正常',
  abnormal: '异常'
};

export const CONST_NUMBER = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4
};

export const SEARCH_NUMBER = [
  {label: '>', value: 'gt'},
  {label: '=', value: 'eq'},
  {label: '<', value: 'lt'}
];
