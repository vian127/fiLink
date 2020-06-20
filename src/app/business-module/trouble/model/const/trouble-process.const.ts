/**
 * 故障状态
 */
export const HandelStatusList = {
  unCommit: 'uncommit', // 未提交
  commit: 'commit',  // 已提交
  processing: 'processing', // 处理中
  done: 'done', //  已完成
  undone: 'undone' // 已打回
};
/**
 * 指派类型
 */
export const AssignTypeList = {
  initial: '0', // 初始指派
  duty: '1',  // 责任上报
  reportResponsibleLeaders: '2', // 上报分管领导
  troubleRepulse: '3', // 故障打回
  coordinateSuccessful: '4', // 协调成功
  coordinateFailConstraint: '5', // 协调不成功强制指派,
  coordinateFailChargeback: '6'  // 协调不成功退单
};
/**
 * 流程节点
 */
export const TroubleFlow = {
  ONE: 'sid-528B7184-B251-4556-A6BC-293385BF0CCA',
  TWO: 'sid-C4B4A170-C173-4EAC-95C5-3871C99AE6DF',
  THREE: 'sid-2D4C5B6D-A68D-41FD-A0D9-7779525F0E97',
  FOUR: 'sid-889B319A-0BE1-498C-AD4F-3C5794683914',
  FIVE: 'sid-0FC7F325-66DC-402D-99CA-E480C370F85B',
  SIX: 'sid-685F95E0-9706-4E42-9E71-5FFCC9EDA10E',
  SEVEN: 'sid-94C31000-7BF9-4BFF-89C7-313ED5C0E11D',
  EIGHT: 'sid-7EF192AF-9381-4455-BA0D-9F57357B4DCA',
  NINE: 'sid-A92BB01F-33F7-41A9-AB92-1220C409AC01',
  TEN: 'sid-261B1F5C-840F-44BA-B02C-C0730AC7EBAF',
  ELEVEN: 'sid-856121C2-4BA0-4323-8FA3-3075F83DD493',
  TWELVE: 'sid-9101F8C2-153C-4A11-974C-7E2C24EA4FA5',
};
/**
 * 指派原因
 */
export const AssignReason = {
  initial: '0',  // 初始指派
  againDesignate: '1',  // 指派错误，需重新指派
  coordinate: '2', // 责任无法确定,需上级协调
  other: '3', // 其他
};
