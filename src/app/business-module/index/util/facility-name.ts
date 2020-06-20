import {NzI18nService} from 'ng-zorro-antd';
import {IndexLanguageInterface} from '../../../../assets/i18n/index/index.language.interface';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {
  FACILITY_TYPE_ICON_CLASS,
  FACILITY_TYPE_NAME,
  FACILITY_STATUS_NAME,
  FACILITY_STATUS_COLOR
} from '../../../shared-module/const/facility';
/**
 * 首页设施的公共方法
 */
export class FacilityName {
  // 国际化
  indexLanguage: IndexLanguageInterface;
  commonLanguage: CommonLanguageInterface;
  facilityTypeListArr: any[];
  facilityStatusListArr: any[];

  constructor(public $nzI18n: NzI18nService) {
    this.indexLanguage = $nzI18n.getLocaleData('index');
    this.commonLanguage = $nzI18n.getLocaleData('common');
    this.facilityTypeListArr = this.facilityTypeList();
    this.facilityStatusListArr = this.facilityStatusList();
  }

  /**
   * 设施状态列表
   * returns {{value: string; label: any; checked: boolean; bgColor: any}[]}
   */
  facilityStatusList() {
    return Object.keys(FACILITY_STATUS_NAME).filter(key => key !== '0').map(key => {
      return {
        value: key,
        label: this.indexLanguage[FACILITY_STATUS_NAME[key]],
        checked: true,
        bgColor: FACILITY_STATUS_COLOR[key]
      };
    });
  }

  /**
   * 设施类型列表
   * returns {{value: string; label: any; iconClass: any; checked: boolean}[]}
   */
  facilityTypeList() {
    return Object.keys(FACILITY_TYPE_NAME).map(key => {
      return {
        value: key,
        label: this.indexLanguage[FACILITY_TYPE_NAME[key]],
        iconClass: FACILITY_TYPE_ICON_CLASS[key],
        checked: true,
      };
    });
  }

  /**
   * 获取设施类型名称
   * param type
   * returns {any | string}
   */
  getFacilityTypeName(type) {
    return this.indexLanguage[FACILITY_TYPE_NAME[type]] || '';
  }

  /**
   * 获取设施状态名称
   * param status
   * returns {any | string}
   */
  getFacilityStatusName(status) {
    return this.indexLanguage[FACILITY_STATUS_NAME[status]] || '';
  }

  /**
   * 获取设施类型图标样式
   * param type
   * returns {any | string}
   */
  getFacilityTypeIconClass(type) {
    return this.indexLanguage[FACILITY_TYPE_ICON_CLASS[type]] || '';
  }
}
