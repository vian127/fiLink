import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {AlarmService} from '../../../../../core-module/api-service/alarm/alarm-manage';
import {FacilityUtilService} from '../../..';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {EquipmentApiService} from '../../../share/service/equipment/equipment-api.service';
import {AlarmStoreService} from '../../../../../core-module/store/alarm.store.service';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {DeviceChartUntil} from '../../../facility-manage/facility-view-detail/device-chart-until';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {getAlarmCleanStatus, getAlarmLevel} from '../../../share/const/facility.config';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {statisticsTypeConst} from '../../../share/const/facility-common.const';
import {FormOperate} from '../../../../../shared-module/component/form/form-opearte.service';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {QueryAlarmStatisticsModel} from '../../../share/model/query-alarm-statistics.model';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {AlarmLevelStatisticsModel} from '../../../share/model/alarm-level-statistics.model';
import {AlarmNameStatisticsModel} from '../../../share/model/alarm-name-statistics.model';
import {ResultCodeEnum} from '../../../../../core-module/model/result-code.enum';
import {AlarmListModel} from '../../../share/model/alarm-list.model';
import {DateTypeEnum, TimeItem} from '../../../share/enum/timer.enum';

/**
 * 设备告警
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-alarm',
  templateUrl: './equipment-alarm.component.html',
  styleUrls: ['./equipment-alarm.component.scss']
})
export class EquipmentAlarmComponent implements OnInit {
  // 入参设备id
  @Input()
  public equipmentId: string = '';
  // 设备类型
  @Input()
  public equipmentType: string = '';
  // 告警级别模板
  @ViewChild('alarmFixedLevelTemp') public alarmFixedLevelTemp: TemplateRef<HTMLDocument>;
  // 清除状态模板
  @ViewChild('isCleanTemp') public isCleanTemp: TemplateRef<HTMLDocument>;
  // 告警国际化
  public language: AlarmLanguageInterface;
  // 设备管理国际化
  public equipmentLanguage: FacilityLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 当前告警列表数据
  public currentAlarmDataSet = [];
  // 历史告警
  public historyAlarmDataSet = [];
  // 列表分页实体
  public pageBean: PageBean = new PageBean(5);
  // 当前告警列表查询条件
  public queryCondition: QueryCondition = new QueryCondition();
  // 列表配置
  public tableConfig: TableConfig;
  // 历史告警列表配置
  public historyTableConfig: TableConfig;
  // 页面是否加载
  public pageLoading = false;
  // 当前告警饼图配置
  public chartOption = {};
  // 当前告警环图配置
  public ringOption = {};
  // 告警增量配置
  public columnarOption = {};
  // 历史告警环图配置
  public ringOptionHistory = {};
  // 历史告警饼图配置
  public chartOptionHistory = {};
  // 时间选择器数据
  public timeList: TimeItem[] = [];
  // 时间选择器默认值
  public dateType: DateTypeEnum;
  // 告警分类
  public alarmType: string = 'current';
  // 当前告警对象
  public currentAlarmData;
  // 备注显示隐藏
  public remarkFormModal: boolean = false;
  // 修改备注弹框保存按钮的状态
  public remarkFormSaveLoading: boolean = false;
  // 备注表单
  public formColumnRemark: FormItem[] = [];
  // 是否显示创建工单的弹框
  public creatWorkOrderShow: boolean = false;
  // 创建工单传入的区域id
  public areaId: string;
  // 创建工单数据
  public createWorkOrderData = {};
  // 备注表单状态
  public formRemark: FormOperate;


  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $alarmService: AlarmService,
    private $ruleUtil: RuleUtil,
    private $router: Router,
    private $alarmStoreService: AlarmStoreService,
    private $equipmentApiService: EquipmentApiService,
    private $facilityUtilService: FacilityUtilService
  ) {
  }

  /**
   *  初始化组件
   */
  public ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('alarm');
    this.equipmentLanguage = this.$nzI18n.getLocaleData('facility');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    // 初始化时间选择器列表
    this.timeList = this.$facilityUtilService.getTimeList();
    this.dateType = _.first(this.timeList).value;
    // 初始化配置
    this.initTableConfig();
    // 初始化备注表单
    this.initRemarkForm();
    // 查询告警列表
    this.queryCurrentAlarmByEquipment();
  }

  /**
   * 触发事件选择器
   * 此处
   */
  public changeFilter(event: {startTime: number, endTime: number}): void {
    // 实例化告警等级和增量的查询条件
    const queryBody = new QueryAlarmStatisticsModel();
    queryBody.beginTime = new Date(event.startTime).getTime();
    queryBody.endTime = new Date(event.endTime).getTime();
    queryBody.equipmentId = this.equipmentId;
    queryBody.statisticsType = statisticsTypeConst.equipment;
    queryBody.equipmentType = this.equipmentType;
    // 查询当前告警统计
    this.getCurrentSourceNameStatistics(queryBody);
    this.getCurrentLevelStatistics(queryBody);
    this.queryAlarmSourceIncremental(queryBody);
    // 查询历史告警统计
    this.getHistorySourceNameStatistics(queryBody);
    this.queryAlarmHistorySourceLevel(queryBody);
  }

  /**
   * 切换告警的tab
   */
  public onChangeTab(type: string): void {
    this.alarmType = type;
    if (this.alarmType === 'current') {
      this.queryCurrentAlarmByEquipment();
    } else {
      this.queryHistoryAlarmList();
    }
  }

  /**
   * 跳转更多的告警
   */
  public onClickShowMore(): void {
    const routerPath = this.alarmType === 'current' ?
      'business/alarm/current-alarm' : 'business/alarm/history-alarm';
    this.$router.navigate([routerPath],
      {queryParams: {deviceId: this.equipmentId}}).then();
  }

  /**
   * 实例化修改备注表单
   */
  public formInstanceRemark(event: { instance: FormOperate }): void {
    this.formRemark = event.instance;
  }

  /**
   * 确认修改备注
   */
  public onClickUpdateRemark(): void {
    const updateData = [{
      id: this.currentAlarmData.id,
      remark: this.formRemark.getData('remarks') || null
    }];
    this.remarkFormSaveLoading = true;
    this.$alarmService.updateAlarmRemark(updateData).subscribe(
      (result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.remarkFormSaveLoading = false;
          this.remarkFormModal = false;
          this.$message.success(result.msg);
          // 修改备注成功就刷新告警列表
          this.queryCurrentAlarmByEquipment();
        } else {
          this.$message.error(result.msg);
          this.remarkFormSaveLoading = false;
        }
      }, () => {
        this.remarkFormSaveLoading = false;
      });
  }

  /**
   * 获取当前告警名称环形图
   */
  private getCurrentSourceNameStatistics(body): void {
    this.$equipmentApiService.queryAlarmNameStatistics(body).subscribe(
      (result: ResultModel<AlarmNameStatisticsModel>) => {
        if (result.code === ResultCodeEnum.success) {
          const arr = this.$facilityUtilService.handelAlarmName(result.data);
          this.ringOption = DeviceChartUntil.setAlarmNameStatisticsChartOption(this.language.currentAlarm, arr);
        }
      });
  }

  /**
   * 历史告警名称环形图
   */
  private getHistorySourceNameStatistics(body: QueryAlarmStatisticsModel): void {
    this.$equipmentApiService.queryAlarmHistorySourceName(body).subscribe(
      (result: ResultModel<AlarmNameStatisticsModel>) => {
        if (result.code === ResultCodeEnum.success) {
          const tempArr = this.$facilityUtilService.handelAlarmName(result.data);
          this.ringOptionHistory = DeviceChartUntil.setAlarmNameStatisticsChartOption(this.language.currentAlarm, tempArr);
        }
      });
  }

  /**
   * 历史告警等级饼图
   */
  private queryAlarmHistorySourceLevel(body: QueryAlarmStatisticsModel): void {
    this.$equipmentApiService.queryAlarmHistorySourceLevel(body).subscribe(
      (result: ResultModel<AlarmLevelStatisticsModel>) => {
        if (result.code === ResultCodeEnum.success) {
          // 获取告警等级饼状图样式
          const currentData = this.$facilityUtilService.handleAlarmLevelData(result);
          const data = currentData.data;
          const color = currentData.color;
          this.chartOptionHistory = DeviceChartUntil.setAlarmLevelStatisticsChartOption(this.language.currentAlarm, data, color);
        }
      });
  }

  /**
   * 设备当前告警级别统计
   */
  private getCurrentLevelStatistics(body: QueryAlarmStatisticsModel): void {
    // 调用后台设备当前告警的接口
    this.$equipmentApiService.queryCurrentAlarmLevelStatistics(body).subscribe(
      (result: ResultModel<AlarmLevelStatisticsModel>) => {
        if (result.code === ResultCodeEnum.success) {
          // 处理告警级别统计的颜色
          const currentData = this.$facilityUtilService.handleAlarmLevelData(result);
          const data = currentData.data;
          const color = currentData.color;
          this.chartOption = DeviceChartUntil.setAlarmLevelStatisticsChartOption(this.language.currentAlarm, data, color);
        }
      });
  }


  /**
   * 查询告警增量统计
   */
  private queryAlarmSourceIncremental(body: QueryAlarmStatisticsModel) {
    this.$equipmentApiService.queryAlarmSourceIncremental(body).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        const data = result.data || [];
        const seriesData = this.$facilityUtilService.sortAlarmData(data);
        this.columnarOption = DeviceChartUntil.setAlarmSourceIncrementalChartOption(seriesData);
      }
    });
  }

  /**
   * 查询历史告警记录
   */
  private queryHistoryAlarmList(): void {
    this.historyTableConfig.isLoading = true;
    this.$equipmentApiService.queryHistoryAlarmList(this.equipmentId).subscribe(
      (result: ResultModel<AlarmListModel[]>) => {
        this.historyTableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.historyAlarmDataSet = result.data || [];
          if (!_.isEmpty(this.historyAlarmDataSet)) {
            // 设置告警等级国际化，状态国际化和告警等级的样式
            this.historyAlarmDataSet.forEach(item => {
              item.alarmLevelName = getAlarmLevel(this.$nzI18n, item.alarmFixedLevel);
              item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
              item.alarmCleanStatusName = getAlarmCleanStatus(this.$nzI18n, item.alarmCleanStatus);
            });
          }
        }
      }, () => {
        this.historyTableConfig.isLoading = false;
      });
  }

  /**
   * 初始化表格参数
   */
  private initTableConfig(): void {
    const tempColumn = [
      //  序号
      {
        type: 'serial-number',
        width: 62,
        title: this.language.serialNumber,
        fixedStyle: {fixedLeft: true, style: {left: '0px'}}
      },
      {
        title: this.language.alarmName,
        key: 'alarmName',
        width: 140,
        isShowSort: true,
        fixedStyle: {fixedLeft: true, style: {left: '62px'}}
      },
      {
        // 告警级别
        title: this.language.alarmFixedLevel,
        key: 'alarmFixedLevel',
        width: 100,
        isShowSort: true,
        type: 'render',
        renderTemplate: this.alarmFixedLevelTemp
      },
      {
        // 频次
        title: this.language.alarmHappenCount,
        key: 'alarmHappenCount',
        width: 80,
        isShowSort: true,
      },
      {
        // 清除状态
        title: this.language.alarmCleanStatus,
        key: 'alarmCleanStatus',
        width: 120,
        isShowSort: true,
        type: 'render',
        renderTemplate: this.isCleanTemp,
      },
      {
        // 清除用户
        title: this.language.alarmCleanPeopleNickname,
        key: 'alarmCleanPeopleNickname',
        width: 120,
        isShowSort: true,
      },
      {
        // 最近发生时间
        title: this.language.alarmNearTime,
        key: 'alarmNearTime',
        width: 180,
        isShowSort: true,
        pipe: 'date',
      },
      {
        // 清除时间
        title: this.language.alarmCleanTime,
        key: 'alarmCleanTime',
        width: 180,
        isShowSort: true,
        pipe: 'date',
      },
      {
        // 告警附加信息
        title: this.language.alarmAdditionalInformation,
        key: 'extraMsg',
        width: 150,
        isShowSort: true,
      },
      {
        title: this.language.alarmobject,
        key: 'alarmObject',
        width: 120,
      },
      { // 备注
        title: this.language.remark,
        key: 'remark',
        width: 200,
        isShowSort: true,
      }
    ];
    const currentAlarmOperate = [{
      // 操作
      title: this.commonLanguage.operate, searchable: false,
      searchConfig: {
        type: 'operate'
      },
      key: '',
      width: 120,
      fixedStyle: {fixedRight: true, style: {right: '0px'}}
    }];
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '1000px', y: '400px'},
      topButtons: [],
      noIndex: true,
      columnConfig: _.concat(tempColumn, currentAlarmOperate),
      showPagination: false,
      bordered: false,
      showSearch: false,
      operation: [
        { // 告警清除
          text: this.language.alarmClean,
          className: 'fiLink-clear',
          handle: (data: AlarmListModel) => {
            const temp = [{id: data.id}];
            this.handelClearAlarm(temp);
          }
        },
        { // 修改备注
          text: this.language.updateRemark,
          className: 'fiLink-edit',
          handle: (data: AlarmListModel) => {
            this.formRemark.resetData({remarks: data.remark});
            this.currentAlarmData = data;
            this.alarmType = 'current';
            this.remarkFormModal = true;
          }
        },
        { // 创建工单
          text: this.language.buildOrder,
          className: 'fiLink-create',
          handle: (data: AlarmListModel) => {
            this.creatWorkOrderShow = true;
            this.areaId = data.areaId;
            this.alarmType = 'current';
            this.createWorkOrderData = data;
          }
        },
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryCurrentAlarmByEquipment();
      },
    };
    this.historyTableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '1000px', y: '400px'},
      topButtons: [],
      noIndex: true,
      columnConfig: _.cloneDeep(tempColumn),
      showPagination: false,
      bordered: false,
      showSearch: false,
      operation: []
    };
  }

  /**
   * 清除告警
   */
  private handelClearAlarm(data: {id: string}[]): void {
    this.$alarmService.updateAlarmCleanStatus(data).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(res.msg);
        this.queryCurrentAlarmByEquipment();
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 查询当前告警列表数据
   */
  private queryCurrentAlarmByEquipment(): void {
    this.tableConfig.isLoading = true;
    this.$equipmentApiService.queryEquipmentCurrentAlarm(this.equipmentId).subscribe(
      (result: ResultModel<AlarmListModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.currentAlarmDataSet = result.data;
          this.tableConfig.isLoading = false;
          // 处理当前告警的级别名称状态名称和级别图标
          if (!_.isEmpty(this.currentAlarmDataSet)) {
            this.currentAlarmDataSet.forEach(item => {
              item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
              item.alarmLevelName = getAlarmLevel(this.$nzI18n, item.alarmFixedLevel);
              item.alarmCleanStatusName = getAlarmCleanStatus(this.$nzI18n, item.alarmCleanStatus);
            });
          }
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

  /**
   * 初始化备注表单
   */
  private initRemarkForm(): void {
    this.formColumnRemark = [
      {
        label: this.language.remark, key: 'remarks', type: 'textarea',
        col: 24,
        width: 500,
        labelWidth: 76,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()]
      }
    ];
  }
}
