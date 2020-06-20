import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {TableConfig} from '../../../../../../shared-module/entity/tableConfig';
import {PageBean} from '../../../../../../shared-module/entity/pageBean';
import {QueryCondition, SortCondition} from '../../../../../../shared-module/entity/queryCondition';
import {WorkOrderLanguageInterface} from '../../../../../../../assets/i18n/work-order/work-order.language.interface';
import { FaultLanguageInterface } from '../../../../../../../assets/i18n/fault/fault-language.interface';
import {
  WORK_ORDER_STATUS,
  WORK_ORDER_STATUS_CLASS,
} from '../../../../../../shared-module/const/work-order';
import {InspectionLanguageInterface} from '../../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {AlarmService} from '../../../../../../core-module/api-service/alarm/alarm-manage';
import {Result} from '../../../../../../shared-module/entity/result';
import {CommonUtil} from '../../../../../../shared-module/util/common-util';
import {CommonLanguageInterface} from '../../../../../../../assets/i18n/common/common.language.interface';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {TroubleService} from '../../../../../../core-module/api-service/trouble/trouble-manage';
import {ResultModel} from '../../../../../../core-module/model/result.model';
import {getAlarmLevel, getHandleStatus, getTroubleSource} from '../../../../../trouble/model/const/trouble.config';
import {AlarmStoreService} from '../../../../../../core-module/store/alarm.store.service';
import {AlarmModel} from '../../../../model/alarm.model';

@Component({
  selector: 'app-redeploy-info',
  templateUrl: './redeploy-info.component.html',
  styleUrls: ['./redeploy-info.component.scss']
})
export class RedeployInfoComponent implements OnInit {
  @Input() alarmId: string;
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  public workLanguage: WorkOrderLanguageInterface;
  public TroubleLanguage: FaultLanguageInterface;
  public InspectionLanguage: InspectionLanguageInterface; // 国际化
  public commonLanguage: CommonLanguageInterface;

  // 关联告警弹窗
  public modalOpen: boolean = false;
  // 关联告警modal内容数据
  public alarmData;
  // 相关性告警数据
  public confirmData: any = [];
  // 销障工单
  public eliminateData: any = [];
  // 故障
  public troubleData: any = [];
  // 销障工单分页
  public eliminatePageBean: PageBean = new PageBean(10, 1, 1);
  // 故障分页
  public troublePageBean: PageBean = new PageBean(10, 1, 1);
  // 销障工单配置
  public eliminateTableConfig: TableConfig;
  // 故障配置
  public troubleTableConfig: TableConfig;
  // 查询条件
  private queryCondition: QueryCondition = new QueryCondition();
  // 故障类型
  private troubleTypeList: any = {};
  public typeStatus: any = {};
  // 处理状态
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  // 关联告警模板
  @ViewChild('refAlarmTemp') refAlarmTemp: TemplateRef<any>;
  // 关联告警modal框内容
  @ViewChild('showAlarmTemp') showAlarmTemp: TemplateRef<any>;
  // 故障级别模板
  @ViewChild('troubleLevelTemp') troubleLevelTemp: TemplateRef<any>;
  // 故障来源
  @ViewChild('troubleSourceTemp') troubleSourceTemp: TemplateRef<any>;
  // 故障类型
  @ViewChild('troubleTypeTemp') troubleTypeTemp: TemplateRef<any>;
  // 故障处理状态
  @ViewChild('handleStatusTemp') handleStatusTemp: TemplateRef<any>;
  constructor(
    public $nzI18n: NzI18nService,
    private $alarmService: AlarmService,
    private $modal: NzModalService,
    private $message: FiLinkModalService,
    public $troubleService: TroubleService,
    public $alarmStoreService: AlarmStoreService,
  ) {
    this.language = this.$nzI18n.getLocaleData('alarm');
    this.workLanguage = this.$nzI18n.getLocaleData('workOrder');
    this.TroubleLanguage = this.$nzI18n.getLocaleData('fault');
    this.InspectionLanguage = this.$nzI18n.getLocaleData('inspection');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
  }

  ngOnInit() {
    this.initEliminateTableConfig();
    this.initTroubleTableConfig();
    this.refreshData();
  }
  /**
   * 刷新数据
   */
  private refreshData() {
    // 销障工单
    this.getWorkData();
    // 故障类型
    this.getTroubleType();
    // 故障数据
    this.getTroubleData();
  }
  /**
   * 销障工单
   * @param alarmId: string  1212121
   */
  getWorkData() {
    this.$alarmService.eliminateWork(this.alarmId).subscribe((res: ResultModel<AlarmModel[]>) => {
      if (res.code === '00000') {
        this.eliminateData = res.data.map(item => {
          item.statusName = this.getStatusName(item.status);
          item.statusClass = this.getStatusClass(item.status);
          return item;
        });
      }
    }, () => {
    });
  }
  /**
   * 故障类型
   */
  getTroubleType() {
    this.$troubleService.queryTroubleType().subscribe((res: ResultModel<AlarmModel[]>) => {
      if (res.code === 0) {
        // this.ifSpin = false;
        const data = res.data;
        // 故障类型枚举
        if (data && data.length > 0) {
          data.forEach(item => {
            this.typeStatus[item.key] = item.value;
          });
        }
      }
    }, () => {
      // this.ifSpin = false;
    });
  }

  /**
   * 故障数据
   */
  getTroubleData() {
    const filterData = {
      filterConditions: [
        {filterField: 'alarmId', operator: 'eq', filterValue: this.alarmId},
        {filterField: 'troubleSource', operator: 'eq', filterValue: 'alarm'}
      ],
      pageCondition: { pageNum: 1, pageSize: 100},
      bizCondition: {}, sortCondition: {}
    };
    this.$troubleService.queryTroubleList(filterData).subscribe((res: ResultModel<AlarmModel[]>) => {
      // this.ifSpin = false;
      this.eliminateTableConfig.isLoading = false;
      this.troubleData = res.data || [];
      this.troubleData = res.data.map(item => {
        item.style = this.$alarmStoreService.getAlarmColorByLevel(item.troubleLevel);
        item.handleStatusName = getHandleStatus(this.$nzI18n, item.handleStatus);
        item.troubleLevelName = getAlarmLevel(this.$nzI18n, item.troubleLevel);
        item.troubleSourceTypeName = getTroubleSource(this.$nzI18n, item.troubleSource);
        return item;
      });
    }, () => {
      // this.ifSpin = false;
      this.eliminateTableConfig.isLoading = false;

    });
  }
  getStatusName(status) {
    return this.InspectionLanguage[WORK_ORDER_STATUS[status]];
  }
  /**
   * 工单类型小图标
   */
  getStatusClass(status) {
    return `iconfont icon-fiLink ${WORK_ORDER_STATUS_CLASS[status]}`;
  }
  /**
   * 销障工单列表配置
   */
  private initEliminateTableConfig() {
    this.eliminateTableConfig = {
      // isDraggable: true,
      isLoading: false,
      showPagination: false,
      bordered: false,
      showSearch: false,
      scroll: {x: '512px', y: '600px'},
      columnConfig: [
        {title: this.workLanguage.name, key: 'title', isShowSort: true},
        {title: this.workLanguage.status, key: 'status', isShowSort: true,
          type: 'render',
          renderTemplate: this.statusTemp,
        },
        {title: this.workLanguage.refAlarm, key: 'refAlarm', isShowSort: true,
          type: 'render',
          renderTemplate: this.refAlarmTemp
        },
        {title: this.workLanguage.deviceName, key: 'deviceName', isShowSort: true},
        {title: this.workLanguage.deviceArea, key: 'deviceAreaName', isShowSort: true},
        {title: this.workLanguage.equipmentName, key: 'equipmentName', isShowSort: true},
        {title: this.workLanguage.equipmentType, key: 'equipmentType', isShowSort: true},
        {title: this.workLanguage.accountabilityUnitName, key: 'accountabilityDeptName', isShowSort: true},
        {title: this.workLanguage.assignName, key: 'assignName', isShowSort: true},
      ],
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
      },
      handleSearch: (event) => {
      }
    };
  }
  /**
   * 故障列表配置
   */
  private initTroubleTableConfig() {
    this.troubleTableConfig = {
      // isDraggable: true,
      isLoading: false,
      showPagination: false,
      bordered: false,
      showSearch: false,
      scroll: {x: '512px', y: '600px'},
      columnConfig: [
        {title: this.TroubleLanguage.troubleCode, key: 'troubleCode', isShowSort: false},
        {title: this.TroubleLanguage.status, key: 'status', isShowSort: false,
          type: 'render',
          renderTemplate: this.handleStatusTemp
        },
        {title: this.TroubleLanguage.troubleLevel, key: 'troubleLevel', isShowSort: false,
          type: 'render',
          renderTemplate: this.troubleLevelTemp
        },
        {title: this.TroubleLanguage.troubleType, key: 'troubleType', isShowSort: false,
          type: 'render',
          renderTemplate: this.troubleTypeTemp
        },
        {title: this.TroubleLanguage.troubleSource, key: 'troubleSource', isShowSort: false,
          type: 'render',
          renderTemplate: this.troubleSourceTemp
        },
        {title: this.TroubleLanguage.troubleFacility, key: 'troubleFacility', isShowSort: false},
        {title: this.TroubleLanguage.troubleEquipment, key: 'troubleEquipment', isShowSort: false},
        {title: this.TroubleLanguage.troubleDescribe, key: 'troubleDescribe', isShowSort: false},
        {title: this.TroubleLanguage.reportUserName, key: 'reportUserName', isShowSort: false},
      ],
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
      },
      handleSearch: (event) => {
      }
    };
  }
  /**
   * 确认告警
   */
  confirmPageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
  }
  /**
   * 销障工单
   */
  eliminatePageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
  }
  /**
   * 故障
   */
  troublePageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
  }
  /**
   * 打开关联告警modal
   * @param procId:string  5ed8a298710d3187050c42ac
   */
  showRefAlarmModal(data) {
    if (this.modalOpen) {
      return;
    }
    this.modalOpen = true;
    const refAlarmQueryCondition = new QueryCondition();
    refAlarmQueryCondition.filterConditions.push({filterField: 'id', operator: 'eq', filterValue: data.procId});
    this.$alarmService.queryCurrentAlarmList(refAlarmQueryCondition).subscribe((result: Result) => {
      this.modalOpen = false;
      if (result.code === 0 && result.data.length > 0) {
        this.alarmData = result.data[0];
        Object.keys(this.alarmData).forEach(item => {
          if (item === 'alarmContinousTime') {
            this.alarmData['alarmContinousTime'] = CommonUtil.setAlarmContinousTime(this.alarmData['alarmBeginTime'],
              this.alarmData['alarmCleanTime'],
              {month: this.language.month, day: this.language.day, hour: this.language.hour});
          }
        });
        const modal = this.$modal.create({
          nzTitle: this.workLanguage.refAlarm,
          nzContent: this.showAlarmTemp,
          nzWidth: 700,
          nzMaskClosable: true,
          nzFooter: [
            {
              label: this.commonLanguage.okText,
              type: 'primary',
              onClick: () => {
                modal.destroy();
              }
            },
            {
              label: this.commonLanguage.cancelText,
              type: 'danger',
              onClick: () => {
                modal.destroy();
              }
            },
          ]
        });
      } else {
        this.$alarmService.queryAlarmHistoryList(refAlarmQueryCondition).subscribe((result_his: Result) => {
          if (result_his.code === 0 && result_his.data.length > 0) {
            this.alarmData = result_his.data[0];
            Object.keys(this.alarmData).forEach(item => {
              if (item === 'alarmContinousTime') {
                this.alarmData['alarmContinousTime'] = CommonUtil.setAlarmContinousTime(this.alarmData['alarmBeginTime'],
                  this.alarmData['alarmCleanTime'],
                  {month: this.language.month, day: this.language.day, hour: this.language.hour});
              }
            });
            const modal = this.$modal.create({
              nzTitle: this.workLanguage.refAlarm,
              nzContent: this.showAlarmTemp,
              nzWidth: 700,
              nzFooter: [
                {
                  label: this.commonLanguage.okText,
                  type: 'primary',
                  onClick: () => {
                    modal.destroy();
                  }
                },
                {
                  label: this.commonLanguage.cancelText,
                  type: 'danger',
                  onClick: () => {
                    modal.destroy();
                  }
                },
              ]
            });
          } else {
            this.$message.info('暂无数据');
            return;
          }
        });
      }
    });
  }
}
