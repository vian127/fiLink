import {NzI18nService} from 'ng-zorro-antd';
import {IndexLanguageInterface} from '../../../assets/i18n/index/index.language.interface';
import {WorkOrderLanguageInterface} from '../../../assets/i18n/work-order/work-order.language.interface';
import {
  FACILITY_STATUS_COLOR,
  FACILITY_STATUS_NAME,
  FACILITY_TYPE_ICON_CLASS,
  FACILITY_TYPE_NAME
} from '../../shared-module/const/facility';
import {
  WORK_ORDER_ERROR_REASON_CODE,
  WORK_ORDER_ERROR_REASON_NAME,
  WORK_ORDER_PROCESSING_SCHEME_CODE,
  WORK_ORDER_PROCESSING_SCHEME_NAME,
  WORK_ORDER_SINGLE_BACK_REASON_CODE,
  WORK_ORDER_SINGLE_BACK_REASON_NAME,
  WORK_ORDER_STATUS,
  WORK_ORDER_STATUS_CLASS,
  WORK_ORDER_TYPE
} from '../../shared-module/const/work-order';
import {TableBasic} from '../../shared-module/component/table/table.basic';
import {FacilityLanguageInterface} from '../../../assets/i18n/facility/facility.language.interface';
import {CommonUtil} from '../../shared-module/util/common-util';

/**
 * 销账工单枚举方法及表格配置
 */
export class WorkOrderConfig extends TableBasic {
  // 国际化
  indexLanguage: IndexLanguageInterface;
  facilityLanguage: FacilityLanguageInterface;
  workOrderLanguage: WorkOrderLanguageInterface;
  facilityTypeListArr: any[];
  facilityStatusListArr: any[];
  workOrderStatusListArr: any[];
  workOrderTypeListArr: any[];
  errorReasonListArr: any[];
  singleBackReasonListArr: any[];
  processingSchemeListArr: any[];
  procType;

  constructor(
    public $nzI18n: NzI18nService
  ) {
    super($nzI18n);
    this.indexLanguage = $nzI18n.getLocaleData('index');
    this.workOrderLanguage = $nzI18n.getLocaleData('workOrder');
    this.facilityLanguage = $nzI18n.getLocaleData('facility');
    this.facilityTypeListArr = this.facilityTypeList();
    this.facilityStatusListArr = this.facilityStatusList();
    this.errorReasonListArr = this.errorReasonList();
    this.singleBackReasonListArr = this.singleBackReasonList();
    this.processingSchemeListArr = this.processingSchemeList();
    this.getWorkOrderStatusListArr();
    this.getWorkOrderTypeList();
  }

  /**
   * 获取设施状态
   */
  facilityStatusList() {
    return Object.keys(FACILITY_STATUS_NAME).filter(key => key !== '0').map(key => {
      return {
        value: key,
        label: this.indexLanguage[FACILITY_TYPE_NAME[key]],
      };
    });
  }

  /**
   * 获取设施类型
   */
  facilityTypeList() {
    return Object.keys(FACILITY_TYPE_NAME).map(key => {
      return {
        value: key,
        label: this.indexLanguage[FACILITY_TYPE_NAME[key]],
      };
    });
  }

  /**
   * 获取故障原因列表
   */
  errorReasonList() {
    return Object.keys(WORK_ORDER_ERROR_REASON_NAME).map(key => {
      return {
        value: WORK_ORDER_ERROR_REASON_CODE[key],
        label: this.workOrderLanguage[WORK_ORDER_ERROR_REASON_NAME[key]],
        // iconClass: FacilityTypeIconClass[key],
        // checked: true,
      };
    });
  }

  /**
   * 获取退单原因列表
   */
  singleBackReasonList() {
    return Object.keys(WORK_ORDER_SINGLE_BACK_REASON_NAME).map(key => {
      return {
        value: WORK_ORDER_SINGLE_BACK_REASON_CODE[key],
        label: this.workOrderLanguage[WORK_ORDER_SINGLE_BACK_REASON_NAME[key]],
      };
    });
  }

  /**
   * 获取处理方案列表
   */
  processingSchemeList() {
    return Object.keys(WORK_ORDER_PROCESSING_SCHEME_NAME).map(key => {
      return {
        value: WORK_ORDER_PROCESSING_SCHEME_CODE[key],
        label: this.workOrderLanguage[WORK_ORDER_PROCESSING_SCHEME_NAME[key]],
      };
    });
  }

  /**
   * 获取设施类型名称
   * param deviceType
   * returns {any | string}
   */
  public getFacilityTypeName(deviceType) {
    return deviceType ? this.indexLanguage[FACILITY_TYPE_NAME[deviceType]] : '';
  }

  /**
   * 获取工单类型名称
   * param status
   * returns {any | string}
   */
  getStatusName(status) {
    return this.workOrderLanguage[WORK_ORDER_STATUS[status]] || '';
  }

  /**
   * 获取退单原因名称
   * param status
   * returns {any | string}
   */
  geterrorReasonName(status) {
    let errorName;
    Object.keys(WORK_ORDER_ERROR_REASON_CODE).forEach(item => {
      if (WORK_ORDER_ERROR_REASON_CODE[item] === status) {
        errorName = this.workOrderLanguage[item];
      }
    });
    return errorName;
  }

  /**
   * 获取退单原因名称
   * param status
   * returns {any | string}
   */
  getSchemeName(status) {
    let errorName;
    Object.keys(WORK_ORDER_PROCESSING_SCHEME_CODE).forEach(item => {
      if (WORK_ORDER_PROCESSING_SCHEME_CODE[item] === status) {
        errorName = this.workOrderLanguage[item];
      }
    });
    return errorName;
  }

  /**
   * 获取工单类型样式
   * param status
   * returns {string}
   */
  getStatusClass(status) {
    return `iconfont icon-fiLink ${WORK_ORDER_STATUS_CLASS[status]}`;
  }

  /**
   * 获取工单状态列表
   */
  getWorkOrderStatusListArr() {
    const arr = [];
    for (const key in WORK_ORDER_STATUS) {
      if (WORK_ORDER_STATUS.hasOwnProperty(key)) {
        arr.push({
          value: key,
          label: this.getStatusName(key)
        });
      }
    }
    this.workOrderStatusListArr = arr;
  }

  /**
   * 获取工单类型列表
   */
  getWorkOrderTypeList() {
    this.workOrderTypeListArr = WORK_ORDER_TYPE.map(item => {
      return {
        value: item.value,
        label: this.workOrderLanguage[item.label]
      };
    });
  }
}

/**
 * 工单状态
 */
export enum WorkOrderStatus {
  assigned = 'assigned',   // 待指派
  pending = 'pending',   // 待处理
  processing = 'processing',   // 处理中
  completed = 'completed',   // 已完成
  singleBack = 'singleBack',   // 已退单
  turnProcessing = 'turnProcessing'  // 已转派'
}

/**
 * 工单状态对应的图标
 */
export enum workOrderStatusIcon {
  assigned = 'fiLink-assigned-w statistics-assigned-color',
  pending = 'fiLink-processed statistics-pending-color',
  processing = 'fiLink-processing statistics-processing-color',
  completed = 'fiLink-completed statistics-completed-color',
  singleBack = 'fiLink-chargeback statistics-singleBack-color',
  turnProcessing = 'fiLink-processing statistics-processing-color',
}

/**
 * 巡检任务状态
 */
export enum inspectionTaskStatus {
  notInspected = '1',    // 未巡检
  duringInspection = '2', // 巡检中
  completed = '3',  // 已完成
}

/**
 * 巡检任务类型
 */
export enum inspectionTaskType {
  routineInspection = '1',  // 例行巡检
}

/**
 * 工单巡检结果
 */
export enum WorkOrderResult {
  normal = '0',   // 正常
  abnormal = '1',   // 异常
}

/**
 * 启用状态
 */
export enum EnableStatus {
  disable = '0',   // 禁用
  enable = '1',   // 启用
}

/**
 * 启用权限
 */
export enum EnablePermission {
  disable = '06-1-2-7',   // 禁用code
  enable = '06-1-2-6',   // 启用code
}

/**
 * 是否巡检全集
 */
export enum IsSelectAll {
  right = '1',   // 是
  deny = '0',   // 否
}

/**
 * 操作符
 */
export enum Operate {
  equal = 'eq' // 默认等于
}


export function workOrderStatus(i18n: NzI18nService, code = null, prefix = 'inspection') {
  return CommonUtil.codeTranslate(WorkOrderStatus, i18n, code, prefix);
}

export function taskStatus(i18n: NzI18nService, code = null, prefix = 'inspection') {
  return CommonUtil.codeTranslate(inspectionTaskStatus, i18n, code, prefix);
}

export function taskType(i18n: NzI18nService, code = null, prefix = 'inspection') {
  return CommonUtil.codeTranslate(inspectionTaskType, i18n, code, prefix);
}

export function workOrderResult(i18n: NzI18nService, code = null, prefix = 'inspection') {
  return CommonUtil.codeTranslate(WorkOrderResult, i18n, code, prefix);
}

export function getEnableStatus(i18n: NzI18nService, code = null, prefix = 'inspection') {
  return CommonUtil.codeTranslate(EnableStatus, i18n, code, prefix);
}


/**
 * 颜色
 */
export enum Colour {
  // 超过期望完工时间
  overdueTime = '#FF0000',
  // 剩余天数小于3天
  estimatedTime = '#895e3f'
}

/**
 * 结果状态码
 */
export enum ResultCode {
  successCode = '00000',
}


