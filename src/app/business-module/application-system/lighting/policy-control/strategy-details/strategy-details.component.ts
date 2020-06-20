import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {Result} from '../../../../../shared-module/entity/result';
import {UserService} from '../../../../../core-module/api-service/user/user-manage';
import {NzI18nService} from 'ng-zorro-antd';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {Router} from '@angular/router';
import {finalValue} from '../../../model/const/const';
import {ApplicationService} from '../../../server';
import {Method} from '../../../model/const/method';

@Component({
  selector: 'app-strategy-details',
  templateUrl: './strategy-details.component.html',
  styleUrls: ['./strategy-details.component.scss']
})
export class StrategyDetailsComponent implements OnInit {
  dateRange = [];
  // 处理数据格式方法
  methodFun = Method;
  // 选中的设备id
  selectedEquipmentId = '';
  // 事件源id
  selectedReportId = '';
  // 选中事件源
  selectEquipment = {
    equipmentName: ''
  };
  // 选中的设备
  selectReport = {
    id: '',
    alarmLevelName: ''
  };
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  @ViewChild('radioReportTemp') radioReportTemp: TemplateRef<any>;
  instructLightList = [];
  params = {
    startTime: 0,
    endTime: 0,
    sensor: '',
    lightIntensity: 0,
    switchLight: '0',
    light: 0,
    refType: '',
    alarmId: '',
    eventId: null
  };
  alarmName = '';
  isShowDetails = false;
  isStrategy = false;
  isSource = false;
  isShowContent = false;
  _dataSet = [];
  reportData = [];
  pageBean: PageBean = new PageBean(10, 1, 1);
  tableConfig: TableConfig;
  tableEquipment: TableConfig;
  language: OnlineLanguageInterface;
  queryCondition: QueryCondition = new QueryCondition();
  @Output() notify = new EventEmitter();
  @Input() stepsSecondParams;

  constructor(
    public $nzI18n: NzI18nService,
    public $router: Router,
    public $applicationService: ApplicationService,
    public $userService: UserService,
  ) {
    this.language = this.$nzI18n.getLocaleData('online');
  }

  ngOnInit() {
    this.initTableConfig();
    this.initEquipment();
  }

  onChange(result: Date): void {
    this.params.startTime = new Date(result[0]).getTime();
    this.params.endTime = new Date(result[1]).getTime();
  }

  pageChange(event) {
    console.log(event);
  }

  /**
   * 选择设备
   * @ param event
   * @ param data
   */
  selectedEquipmentChange(event, data) {
    this.selectEquipment = data;
  }

  /**
   * 选中事件源
   * @ param event
   * @ param data
   */
  selectedReportChange(event, data) {
    this.selectReport = data;
  }

  private initEquipment() {
    this.tableEquipment = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {
          title: '',
          type: 'render',
          key: 'selectedEquipmentId',
          renderTemplate: this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 42
        },
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          title: '资产编号', key: 'equipmentCode', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          title: '名称', key: 'equipmentName', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.getAlarmLevelList();
      },
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.getAlarmLevelList();
      }
    };
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {
          title: '',
          type: 'render',
          key: 'selectedReportId',
          renderTemplate: this.radioReportTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 42
        },
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          title: '告警级别', key: 'alarmLevelCode', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          title: '告警级别', key: 'alarmLevelName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      }
    };
  }

  getAlarmLevelList() {
    this.tableEquipment.isLoading = true;
    this.$applicationService.getAlarmLevelList(this.queryCondition).subscribe((res: Result) => {
      this.tableEquipment.isLoading = false;
      this.reportData = res.data;
      this.pageBean.Total = res.data.length;
      this.pageBean.pageIndex = 1;
      this.pageBean.pageSize = res.data.length;
    }, () => {
      this.tableEquipment.isLoading = false;
    });
  }

  /**
   * 刷新表格数据
   */
  private refreshData() {
    this.tableConfig.isLoading = true;
    this.$applicationService.equipmentListByPage(this.queryCondition).subscribe((res: Result) => {
      this.tableConfig.isLoading = false;
      this._dataSet = res.data;
      this.pageBean.Total = res.totalCount;
      this.pageBean.pageIndex = res.pageNum;
      this.pageBean.pageSize = res.size;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  handleCancel() {
    this.isStrategy = false;
    this.isSource = false;
  }

  /**
   * 光照强度
   */
  handleClickStrategy() {
    this.isStrategy = true;
    this.refreshData();
  }

  /**
   * 事件源
   */
  handleSource() {
    this.isSource = true;
    this.getAlarmLevelList();
  }

  /**
   * 选中设备列表
   */
  handleEquipmentOk() {
    this.params.sensor = this.selectEquipment.equipmentName;
    this.isStrategy = false;
  }

  /**
   * 选中事件源
   */
  handleReportOk() {
    this.params.refType = '1';
    this.params.alarmId = this.selectReport.id;
    this.alarmName = this.selectReport.alarmLevelName;
    this.isSource = false;
  }

  handNextSteps() {
    this.notify.emit(finalValue.STEPS_THIRD);
  }

  handPrevSteps() {
    this.notify.emit(finalValue.STEPS_FIRST);
  }

  /**
   * 保存操作
   */
  handSave() {
    this.params.switchLight = this.params.switchLight ? '1' : '0';
    this.instructLightList.push(this.params);
    this.params = {
      startTime: 0,
      endTime: 0,
      sensor: '',
      lightIntensity: 0,
      switchLight: '0',
      light: 0,
      refType: '',
      alarmId: '',
      eventId: null
    };
    this.alarmName = '';
    console.log(this.instructLightList);
    this.isShowContent = true;
    this.isShowDetails = false;
  }
}
