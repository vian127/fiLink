import {MapCoverageService} from '../../service/map-coverage.service';

/**
 * 首页大数据标识
 */
export const index_huge_data = '1';
/**
 * 首页设施状态颜色
 */
export const index_device_status_color = '0';
/**
 * 首页设施类型
 */
export const index_facility_type = {
  /**
   * 配线架
   */
  patchPanel: '060',
  /**
   * 光交箱
   */
  opticalBox: '001',
  /**
   * 人井
   */
  manWell: '030',
  /**
   * 接头盒
   */
  jointClosure: '090',
  /**
   * 室外柜
   */
  outDoorCabinet: '210',
  /**
   * 智慧杆
   */
  wisdom: '002',
  /**
   * 配电箱
   */
  distributionPanel: '003',

};

export const indexFacilityComponentType = {
  /**
   * 配线架
   */
  '060': '配线架',
  /**
   * 光交箱
   */
  '001': '光交箱',
  /**
   * 智慧杆
   */
  '002': '智慧杆',
  /**
   * 配电箱
   */
  '003': '配电箱',
  /**
   * 人井
   */
  '030': '人井',
  /**
   * 接头盒
   */
  '090': '接头盒',
  /**
   * 分纤箱
   */
  '150': '分纤箱',
};

export const indexFacilityIconStyle = {
  /**
   * 配线架
   */
  '060': 'fiLink-patchPanel',
  /**
   * 光交箱
   */
  '001': 'fiLink-opticalBox',
  /**
   * 智慧杆
   */
  '002': 'fiLink-wisdom',
  /**
   * 配电箱
   */
  '003': 'fiLink-distributionPanel',
  /**
   * 人井
   */
  '030': 'fiLink-manWell-p',
  /**
   * 接头盒
   */
  '090': 'fiLink-jointClosure-m',
  /**
   * 分纤箱
   */
  '150': 'fiLink-fiberBox-m',
}

export const indexEquipmentComponentType = {
  /**
   * 网关
   */
  '001': '网关',
  /**
   * 单灯控制器
   */
  '002': '单灯控制器',
  /**
   * 集中控制器
   */
  '003': '集中控制器',
  /**
   * 信息屏
   */
  '004': '信息屏',
  /**
   * 摄像头
   */
  '005': '摄像头',
};

/**
 * 首页左侧面板三个tab页
 */
export const index_left_panel = {
  /**
   * 设施列表
   */
  facilitiesList: 0,
  /**
   * 我的关注
   */
  myCollection: 1,
  /**
   * 拓扑高亮
   */
  toLogicalHighLighting: 2,
};

/**
 * 首页左侧面板告警chat
 */
export const index_alarm_chat = {
  /**
   * 一周
   */
  oneWeek: 1,
  /**
   * 一月
   */
  oneMonth: 2,
  /**
   * 三月
   */
  threeMonth: 3,
};

/**
 * 首页左侧面板告警chat
 */
export const index_day_number = {
  /**
   * 一周
   */
  oneWeek: 7,
  /**
   * 一月
   */
  oneMonth: 30,
  /**
   * 三月
   */
  threeMonth: 90,
};



/**
 * 地图分层类型
 */
export const index_layered_type = {
  /**
   * 设施分层
   */
  facility: '1',
  /**
   * 设备分层
   */
  device: '2'
};

/**
 * 地图分层类型
 */
export const index_coverage_type = {
  /**
   * 设施分层
   */
  facility: 'facility',
  /**
   * 设备分层
   */
  device: 'equipment'
};


/**
 * 首页设施详情四个tab页
 */
export const index_facility_panel = {

  /**
   * 设施详情
   */
  facilityDetail: 0,
  /**
   * 设施告警
   */
  facilityAlarm: 1,
  /**
   * 日志和工单
   */
  logAndOrderTab: 2,
  /**
   * 实景图
   */
  RealSceneTab: 3,
};

/**
 * 首页更新数据类型
 */
export const index_update_type = {
  /**
   * 没有修改的更新
   */
  noUpdate: 1,
  /**
   * 有修改更新
   */
  haveUpdate: 2,

  /**
   * 推送修改更新
   */
  webUpdate: 3,
};

/**
 * 首页大数据标识
 * 0 无效  1异常  2正常
 */
export const lock_status_type = {
  /**
   * 无效
   */
  invalid: '0',
  /**
   * 异常
   */
  unusual: '1',

  /**
   * 正常
   */
  normal: '2',

};

/**
 * 首页设施类型配置
 */
export const index_facility_config = {
  /**
   * 没有修改的更新
   */
  noChecked: '0',
  /**
   * 有修改更新
   */
  checked: '1',
};

/**
 * 首页卡片类型
 */
export const index_card_type = {
  /**
   * 设施总数
   */
  deviceCount: 0,
  /**
   * 类型总数
   */
  typeCount: 1,
  /**
   * 设施状态
   */
  deviceStatus: 2,
  /**
   * 告警总数
   */
  alarmCount: 3,
  /**
   * 告警增量
   */
  alarmIncrement: 4,
  /**
   * 工单增量
   */
  workIncrement: 5,
  /**
   * 繁忙TOP
   */
  busyTop: 6,
  /**
   * 告警TOP
   */
  alarmTop: 7,
};


/**
 * 首页地图点击事件回传
 */
export const index_map_type = {
  /**
   * 区域聚合点击事件
   */
  areaPoint: 'areaPoint',
  /**
   * 地图点击事件
   */
  mapClick: 'mapClick',
  /**
   * 点击聚合点
   */
  clickClusterer: 'clickClusterer',
  /**
   * 点击设施
   */
  selected: 'selected',
  /**
   * 点击地图空白
   */
  mapBlackClick: 'mapBlackClick',
  /**
   * 城市控件打开与关闭
   */
  cityListControlStatus: 'cityListControlStatus',
  /**
   * 城市切换
   */
  cityChange: 'cityChange',
  /**
   * 地图拖动
   */
  mapDrag: 'mapDrag',
  /**
   * 重置设施id
   */
  resetFacilityId: 'resetFacilityId',
  /**
   * 拓扑高亮
   */
  showLight: 'showLight',
};

/**
 * 首页设施类型
 */
export const index_facility_event = {
  /**
   * 关闭
   */
  close: 'close',
  /**
   * 设置
   */
  setting: 'setting',
  /**
   * 设置
   */
  refresh: 'refresh',
  /**
   * 更新
   */
  update: 'update',
  /**
   * 定位
   */
  location: 'location',
  /**
   * 关注设施
   */
  focusDevice: 'focusDevice',
  /**
   * 不关注设施
   */
  unFollowDevice: 'unFollowDevice',
  /**
   * 是否是拓扑高亮
   */
  isTopog: 'isTopog'
};

/**
 * 首页设施设备类型
 */
export const index_facility_equipment_type = {
  /**
   * 设施类型
   */
  facilityTypeTitle: '1',
  /**
   * 设备类型
   */
  equipmentTypeTitle: '2'
};

/**
 * 首页设施设备列表
 */
export const index_facility_equipment_list = {
  /**
   * 设施列表
   */
  facilitiesList: '1',
  /**
   * 设备列表
   */
  equipmentList: '2'
};

/**
 * 首页详情卡安装数量和空闲数量
 */
export const index_install_num = {
  /**
   * 设施列表
   */
  installNum: '1',
  /**
   * 设备列表
   */
  freeNum: '2'
};

/**
 * 首页详情卡能耗统计
 */
export const index_energy_statistics = {
  /**
   * 年
   */
  year: '1',
  /**
   * 月
   */
  month: '2',
  /**
   * 日
   */
  day: '3'
};

/**
 * 首页工单和状态
 */
export const index_order_state_type = {
  /**
   * 工单状态
   */
  workOrderState: '1',
  /**
   * 工单类型
   */
  workOrderType: '2'
};

/**
 * 首页左侧面板三个tab页
 */
export const index_operational_data_left_panel_item = {
  /**
   * 设施设备列表
   */
  facilitiesList: 0,
  /**
   * 我的关注
   */
  myCollection: 1,
  /**
   * 工单列表
   */
  workOrderList: 2,

  /**
   * 未知状态
   */
  unknown: 4,
};

export const index_facility_status = {
  '1': '未知',
  '2': '正常',
  '3': '告警',
  '4': '故障',
  '5': '已拆除',
};

export const index_num = {
  strZero: '0',
  numZero: 0
};

/**
 * 首页工单类型
 */
export const index_work_order_type = {
  /**
   * 巡检
   */
  inspection: 'inspection',
  /**
   * 销障
   */
  clear_failure: 'clear_failure',
  /**
   * 告警确认
   */
  confirm: 'confirm',
  /**
   * 安装
   */
  install: 'install',
  /**
   * 拆除
   */
  removal: 'removal'
};


/**
 * 首页工单类型
 */
export const index_work_order_state = {
  /**
   * 待指派
   */
  assigned: 'assigned',
  /**
   * 待处理
   */
  pending: 'pending',
  /**
   * 处理中
   */
  processing: 'processing',
  /**
   * 已完成
   */
  completed: 'completed',
  /**
   * 已退单
   */
  singleBack: 'singleBack',
  /**
   * 待审核
   */
  waitConfirm: 'waitConfirm',
  /**
   * 已转派
   */
  unpass: 'unpass',
  /**
   * 审核不通过
   */
  turnProcess: 'turnProcess',
};
/**
 * 首页工单图标
 */

export const index_work_order_state_icon = {
  /**
   * 待指派
   */
  assigned: 'fiLink-assigned-w statistics-assigned-color',
  /**
   * 待处理
   */
  pending: 'fiLink-processed statistics-pending-color',
  /**
   * 处理中
   */
  processing: 'fiLink-processing statistics-processing-color',
  /**
   * 已完成
   */
  completed: 'fiLink-completed statistics-completed-color',
  /**
   * 已退单
   */
  singleBack: 'fiLink-chargeback statistics-singleBack-color',
  /**
   * 待审核
   */
  waitConfirm: 'fiLink-completed statistics-completed-color',
  /**
   * 已转派
   */
  unpass: 'fiLink-completed statistics-completed-color',
  /**
   * 审核不通过
   */
  turnProcess: 'fiLink-filink-yizhuanpai-icon statistics-turnProcessing-color',
};

/*
  分页控制参数
 */
export const index_page = {
  /**
   * 1
   */
  one: 1,
  /**
   * 5
   */
  five: 5,
  /**
   * 10
   */
  ten: 10
};

/*
  告警类别
 */
export const index_alarm_type = {
  /**
   * 通信告警
   */
  1: 'commAlarm',
  /**
   * 业务质量告警
   */
  2: 'businessAlarm',
  /**
   * 环境告警
   */
  3: 'environmentAlarm',
  /**
   * 电力告警
   */
  4: 'powerAlarm',
  /**
   * 安全告警
   */
  5: 'safeAlarm',
  /**
   * 设备告警
   */
  6: 'equipmentAlarm',
};

/**
 * 分组操作
 */
export const index_group_type = {
  /**
   * 当前分组
   */
  current: '1',
  /**
   * 新增分组
   */
  create: '2'
};
