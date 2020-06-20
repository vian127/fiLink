import {TableBasic} from '../../../shared-module/component/table/table.basic';
import {NzI18nService} from 'ng-zorro-antd';
import {PageBean} from '../../../shared-module/entity/pageBean';
import {IndexLanguageInterface} from '../../../../assets/i18n/index/index.language.interface';
import {WorkOrderLanguageInterface} from '../../../../assets/i18n/work-order/work-order.language.interface';
import {FacilityLanguageInterface} from '../../../../assets/i18n/facility/facility.language.interface';
import {FACILITY_STATUS_NAME, FACILITY_TYPE_NAME} from '../../../shared-module/const/facility';
import {WORK_ORDER_STATUS} from '../../../shared-module/const/work-order';

export class IndexTable extends TableBasic {
  pageBean: PageBean = new PageBean(5, 1, 0);
  indexLanguage: IndexLanguageInterface;
  workOrderLanguage: WorkOrderLanguageInterface;
  facilityLanguage: FacilityLanguageInterface;
  constructor(
    public $nzI18n: NzI18nService,
  ) {
    super($nzI18n);
    this.indexLanguage = this.$nzI18n.getLocaleData('index');
    this.workOrderLanguage = this.$nzI18n.getLocaleData('workOrder');
    this.facilityLanguage = this.$nzI18n.getLocaleData('facility');
  }

  /**
   * 获取设施类型名称
   */
  getFacilityTypeName(type) {
    return this.indexLanguage[FACILITY_TYPE_NAME[type]] || '';
  }

  /**
   * 获取设施状态名称
   */
  getFacilityStatusName(status) {
    return this.indexLanguage[FACILITY_STATUS_NAME[status]] || '';
  }

  /**
   * 获取工单状态名称
   */
  getWorkOrderStatusName(status) {
    return this.workOrderLanguage[WORK_ORDER_STATUS[status]];
  }
}
