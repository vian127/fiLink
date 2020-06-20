import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {Result} from '../../../../../shared-module/entity/result';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {ApplicationService} from '../../../server';
import {NzI18nService} from 'ng-zorro-antd';

@Component({
  selector: 'app-strategy-management-details',
  templateUrl: './strategy-management-details.component.html',
  styleUrls: ['./strategy-management-details.component.scss']
})
export class StrategyManagementDetailsComponent implements OnInit {
  // 选择单控，多控，信息屏
  targetType = '002';
  // 应用范围设备列表显隐
  isStrategy = false;
  // 告警列表显隐
  isSource = false;
  // 设备列表单选
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // 告警列表单选
  @ViewChild('radioReportTemp') radioReportTemp: TemplateRef<any>;
  // 选中的设备id
  selectedEquipmentId = '';
  // 事件源id
  selectedReportId = '';
  // 节目弹框显示
  isShowProgram = false;
  // 节目id
  selectedProgramId = '';
  // 节目名称
  programName = '';
  // 选中事件源
  selectEquipment = {
    equipmentId: '',
    equipmentName: ''
  };
  // 选中的设备
  selectReport = {
    id: '',
    alarmLevelName: ''
  };
  // 选中的节目
  selectedProgram = {};
  // 设备表格配置
  equipmentTable: TableConfig;
  // 设备列表显隐
  isMultiEquipment = false;
  // 设备列表数据集合
  _dataSet = [];
  // 告警列表数据集合
  reportData = [];
  // 节目列表数据集合
  programData = [];
  // 选中的设备列表
  multiEquipmentData = [];
  // 节目表格配置
  tableProgram: TableConfig;
  // 节目列表单选
  @ViewChild('radioProgramTemp') radioProgramTemp: TemplateRef<any>;
  // 分页参数
  pageBean: PageBean = new PageBean(10, 1, 1);
  // 选择设备表格配置
  tableConfig: TableConfig;
  // 设备表格配置
  tableEquipment: TableConfig;
  // 表格多语言
  language: OnlineLanguageInterface;
  // 表格查询条件
  queryCondition: QueryCondition = new QueryCondition();
  // 策略详情的参数
  linkageStrategyInfo = {
    equipmentId: '',
    conditionType: '',
    conditionId: '',
    targetType: ''
  };
  // 单灯和集控的参数
  instructLightBase = {
    switchLight: true,
    light: '0'
  };
  // 信息屏参数
  instructInfoBase = {
    programId: '',
    volume: '0',
    light: '0'
  };

  constructor(
    public $nzI18n: NzI18nService,
    public $applicationService: ApplicationService
  ) {
    this.language = this.$nzI18n.getLocaleData('online');
  }

  ngOnInit() {
    // 设备列表配置
    this.initEquipment();
    // 告警列表配置
    this.initTableConfig();
    // 节目列表配置
    this.initTableProgram();
    // 设备列表
    this.refreshData();
    // 告警列表
    this.getAlarmLevelList();
    // 节目列表
    this.getProgramData();
  }

  /**
   * 设备列表
   */
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
   * 选中的节目
   * @ param event
   * @ param item
   */
  selectedProgramChange(event, item) {
    this.selectedProgram = item;
    this.instructInfoBase.programId = item.programId;
    this.programName = item.programName;
  }
  /**
   *选中节目提交
   */
  handleProgramOk() {
    this.isShowProgram = false;
  }

  /**
   * 节目列表
   */
  getProgramData() {
    this.tableProgram.isLoading = true;
    this.$applicationService.getReleaseContentList(this.queryCondition).subscribe((res: Result) => {
      this.tableProgram.isLoading = false;
      this.programData = res.data;
      this.pageBean.Total = res.totalCount;
      this.pageBean.pageIndex = res.pageNum;
      this.pageBean.pageSize = res.size;
    }, () => {
      this.tableProgram.isLoading = false;
    });
  }

  /**
   * 节目表格配置
   */
  initTableProgram() {
    this.tableProgram = {
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
          key: 'selectedProgramId',
          renderTemplate: this.radioProgramTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 42
        },
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          title: '名称', key: 'programName', width: 150, isShowSort: true,
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
      leftBottomButtons: [],
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

  /**
   * 多选
   */
  handleMultiEquipmentOk(data) {
    this.multiEquipmentData = data;
    this.isMultiEquipment = false;
  }

  /**
   * 分页查询事件
   * @ param event
   */
  pageChange(event) {
    console.log(event);
  }

  /**
   * 添加设备
   */
  handleAddEquipment() {
    this.isMultiEquipment = true;
    this.equipmentTable = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
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
      leftBottomButtons: [
        {
          className: 'small-button',
          permissionCode: '03-1-16',
          text: '确认', handle: (event) => {
            this.handleMultiEquipmentOk(event);
          }
        },
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.getAlarmLevelList();
      },
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.getAlarmLevelList();
      },
    }
    ;
  }

  /**
   * 取消操作
   */
  handleCancel() {
    this.isStrategy = false;
    this.isSource = false;
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

  /**
   * 点击设备弹出框
   */
  handleEquipment() {
    this.isStrategy = true;
  }

  /**
   * 点击告警弹出框
   */
  handleReport() {
    this.isSource = true;
  }

  /**
   * 设备列表的确认事件
   */
  handleEquipmentOk() {
    this.linkageStrategyInfo.equipmentId = this.selectedEquipmentId;
    this.isStrategy = false;
  }

  /**
   * 告警列表的确认事件
   */
  handleReportOk() {
    this.linkageStrategyInfo.conditionId = this.selectedReportId;
    this.linkageStrategyInfo.conditionType = '1';
    this.isSource = false;
  }

  /**
   * 告警列表
   */
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
}
