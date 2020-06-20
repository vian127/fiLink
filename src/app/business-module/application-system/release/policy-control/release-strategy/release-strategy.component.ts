import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Method} from '../../../model/const/method';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {Result} from '../../../../../shared-module/entity/result';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {ApplicationService} from '../../../server';

@Component({
  selector: 'app-release-strategy',
  templateUrl: './release-strategy.component.html',
  styleUrls: ['./release-strategy.component.scss']
})
export class ReleaseStrategyComponent implements OnInit {
  instructInfo = {
    switches: '0',
    playType: '1',
    volume: '0',
    light: '0',
  };
  _dataSet = [];
  // 分页实体
  pageBean: PageBean = new PageBean(10, 1, 1);
  // 表格配置
  tableConfig: TableConfig;
  // 选中的节目id
  selectedProgramId = '';
  // 节目列表
  programList = [];
  // 选中的节目
  selectedProgram = {
    programId: '',
    playSort: '1',
    duration: '',
    programName: ''
  };
  language: OnlineLanguageInterface;
  queryCondition: QueryCondition = new QueryCondition();
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // 时间格式处理
  methodFun = Method;
  strategyPlayPeriodRefList = [];
  strategyProgRelationList = [];
  time: Date | null = null;
  dateRange = [];
  playStartTime = 0;
  playEndTime = 0;
  isShowPattern = false;
  isShowProgram = false;
  @Output() notify = new EventEmitter();

  constructor(
    public $nzI18n: NzI18nService,
    public $applicationService: ApplicationService,
    public $router: Router,
  ) {
    this.language = this.$nzI18n.getLocaleData('online');
  }

  ngOnInit() {
    this.initTableConfig();
    this.refreshData();
  }

  pageChange(event) {
    console.log(event);
  }

  onChange(result: Date): void {
    this.playStartTime = new Date(result[0]).getTime();
    this.playEndTime = new Date(result[1]).getTime();
    this.strategyPlayPeriodRefList.push({
      playStartTime: this.playStartTime,
      playEndTime: this.playEndTime
    });
    console.log(this.strategyPlayPeriodRefList);
    this.isShowPattern = false;
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
          key: 'selectedProgramId',
          renderTemplate: this.radioTemp,
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
   * 删除指定的播放时段
   * @ param index 索引
   */
  handleDeletePlay(index) {
    this.strategyPlayPeriodRefList.splice(index, 1);
  }

  /**
   *选择节目名称
   */
  handleProgramOk() {
    this.strategyProgRelationList.push({
      programId: this.selectedProgram.programId,
      playSort: '1',
      playTime: this.selectedProgram.duration
    });
    this.isShowProgram = false;
  }

  /**
   * 选中的节目
   * @ param event
   * @ param item
   */
  selectedProgramChange(event, item) {
    this.selectedProgram = item;
    this.programList.push(item);
  }

  /**
   * 删除选中的节目
   * @ param index 节目序号
   */
  handleDeleteProgram(index) {
    this.strategyProgRelationList.splice(index, 1);
    this.programList.splice(index, 1);
  }

  /**
   * 取消节目
   */
  handleProgramCancel() {
    this.isShowProgram = false;
  }

  /**
   * 刷新表格数据
   */
  private refreshData() {
    this.tableConfig.isLoading = true;
    this.$applicationService.getReleaseContentList(this.queryCondition).subscribe((res: Result) => {
      this.tableConfig.isLoading = false;
      this._dataSet = res.data;
      this.pageBean.Total = res.totalCount;
      this.pageBean.pageIndex = res.pageNum;
      this.pageBean.pageSize = res.size;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
}
