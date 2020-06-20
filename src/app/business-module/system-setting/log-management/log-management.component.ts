import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {ColumnConfigService} from '../column-config.service';
import {ActivatedRoute, UrlSegment} from '@angular/router';
import {LogManageService} from '../../../core-module/api-service/system-setting/log-manage/log-manage.service';
import {TimerSelectorService} from '../../facility/facility-manage/photo-viewer/timer-selector/timer-selector.service';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {Result} from '../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {BasicConfig} from '../../basic-config';
import {QueryCondition} from '../../../shared-module/entity/queryCondition';
import {TableComponent} from '../../../shared-module/component/table/table.component';
import {index_day_number} from '../../index/shared/const/index-const';


@Component({
  selector: 'app-log-management',
  templateUrl: './log-management.component.html',
  styleUrls: ['./log-management.component.scss'],
  providers: [TimerSelectorService]
})
export class LogManagementComponent extends BasicConfig implements OnInit, AfterViewInit {
  // 日志类型
  public optType = 'operate';
  // 导出日志类型
  public exportLog: string;
  // 主键
  public primaryKey = '';
  // 当前默认事件
  public countTime;
  // 危险级别
  @ViewChild('dangerLevel') private dangerLevel;
  // 操作结果
  @ViewChild('optResult') private optResult;
  // 操作类型
  @ViewChild('optType') private optTypeTem;
  // 表单模板
  @ViewChild('tableComponent') tableComponent: TableComponent;

  constructor(public $nzI18n: NzI18nService,
              private $timerSelectorService: TimerSelectorService,
              private $columnConfigService: ColumnConfigService,
              private $message: FiLinkModalService,
              private $logManageService: LogManageService,
              private $activatedRoute: ActivatedRoute,
  ) {
    super($nzI18n);
  }

  ngOnInit() {
    // 初始化一周的事件
    this.initSetting();
    // 初始化表格
    this.initTable();
  }

  ngAfterViewInit() {
    // 时间初始化
    this.tableComponent.rangDateValue['optTime'] = [new Date(this.countTime[0]), new Date(this.countTime[1])];
  }

  /**
   * 初始化默认设置
   */
  initSetting() {
    this.countTime = this.$timerSelectorService.getDateRang(index_day_number.oneWeek);
    const event = [
      {
        filterValue: CommonUtil.getTimeStamp(new Date(this.countTime[0])),
        filterField: 'optTime',
        operator: 'gte', // 起始时间,
        extra: 'LT_AND_GT'
      },
      {
        filterValue: CommonUtil.getTimeStamp(new Date(this.countTime[1])),
        filterField: 'optTime',
        operator: 'lte', // 结束时间
        extra: 'LT_AND_GT'
      }
    ];
    this.queryConditions.filterConditions = event;
  }

  /**
   * 初始化表格
   */
  initTable() {
    this.tableConfig = {
      isDraggable: true,
      primaryKey: '',
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      showSearchExport: true,
      scroll: {x: '2000px', y: '325px'},
      columnConfig: this.$columnConfigService.getLogManagementColumnConfig(
        {dangerLevel: this.dangerLevel, optResult: this.optResult, optType: this.optTypeTem}),
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      sort: (e) => {
        this.queryConditions.sortCondition = e;
        this.createQueryConditions(false);
        this.searchList();
      },
      handleSearch: (event) => {
        this.createQueryConditions(true);
        this.handleSearch(event);
      },
      // 导出任务
      handleExport: (event) => {
        event.columnInfoList.map(item => {
          if (item.propertyName === 'optTime') {
            return item.isTranslation = 1;
          }
        });
        const body = {
          queryCondition: new QueryCondition(),
          columnInfoList: event.columnInfoList,
          excelType: event.excelType,
        };
        body.columnInfoList.forEach(item => {
          if (item.propertyName === 'dangerLevel' || item.propertyName === 'optType' || item.propertyName === 'optResult') {
            item.isTranslation = 1;
          }
        });
        // 处理选择的项目
        if (event.selectItem.length > 0) {
          event.queryTerm['logIds'] = event.selectItem.map(item => item.logId);
          body.queryCondition.filterConditions = [];
          body.queryCondition.filterConditions.push({filterField: 'logId', operator: 'in', filterValue: event.queryTerm['logIds']});
        } else {
          body.queryCondition.filterConditions = this.queryConditions.filterConditions;
        }
        this.$logManageService[this.exportLog](body).subscribe((result: Result) => {
          if (result.code === 0) {
            this.$message.success(result.msg);
          } else {
            this.$message.info(result.msg);
          }
        });
      }
    };
    // 判断页面  用户日志和系统日志 没有操作类型
    this.$activatedRoute.url.subscribe((urlSegmentList: Array<UrlSegment>) => {
      if (urlSegmentList.find(urlSegment => urlSegment.path === 'security' || urlSegment.path === 'system')) {
        if (urlSegmentList.find(urlSegment => urlSegment.path === 'security')) {
          this.optType = 'security';
        } else {
          this.optType = 'system';
        }
        this.tableConfig.columnConfig = this.tableConfig.columnConfig.filter(item => item.key !== 'optType');
      }
    });
    this.$activatedRoute.queryParams.subscribe(result => {
      this.createQueryConditions(false);
      this.searchList();
    });
  }


  /**
   * 查询日志列表
   */
  searchList() {
    let httpName = '';
    if (this.optType === 'security') {
      // 安全日志
      httpName = 'findSecurityLog';
      this.exportLog = 'exportSecurityLogExport';
      this.primaryKey = '04-2-1';
    } else if (this.optType === 'system') {
      // 系统日志
      httpName = 'findSystemLog';
      this.exportLog = 'exportSysLogExport';
      this.primaryKey = '04-2-2';
    } else {
      // 操作日志
      httpName = 'findOperateLog';
      this.exportLog = 'exportOperateLogExport';
      this.primaryKey = '04-2-3';
    }
    this.tableConfig.isLoading = true;
    this.tableConfig.primaryKey = this.primaryKey;
    this.$logManageService[httpName](this.queryConditions).subscribe((result: Result) => {
      this.tableConfig.isLoading = false;
      if (result.code === 0) {
        this._dataSet = result.data;
        this.pageBean.Total = result.totalCount;
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 创建查询条件 分页
   */
  pageChange(event) {
    this.queryConditions.pageCondition = {
      pageNum: event.pageIndex,
      pageSize: event.pageSize
    };
    this.searchList();
  }


  /**
   * 创建查询条件  主要是条件拼接
   */
  createQueryConditions(isHandleSearch?: boolean) {

    if (isHandleSearch) {
      this.queryConditions.pageCondition = {
        pageNum: 1,
        pageSize: this.pageBean.pageSize
      };
    } else {
      this.queryConditions.pageCondition = {
        pageNum: this.pageBean.pageIndex,
        pageSize: this.pageBean.pageSize
      };
    }

    // 默认操作时间降序
    if (!this.queryConditions.sortCondition['sortField']) {
      this.queryConditions.sortCondition = {
        sortField: 'optTime',
        sortRule: 'desc'
      };
    }

    // 别的页面跳转过来参数拼接
    if (isHandleSearch) {
      if (!this.queryConditions.filterConditions.some(item => item.filterField === 'optObjId')) {
        this.queryConditions.filterConditions = this.queryConditions.filterConditions.filter(item => item.filterField !== 'optObjId');
      }
    } else {
      if ('id' in this.$activatedRoute.snapshot.queryParams) {
        const ids = this.$activatedRoute.snapshot.queryParams.id;
        if (ids instanceof Array) {
          if (!this.queryConditions.filterConditions.some(item => item.filterField === 'optObjId') &&
            !this.queryConditions.filterConditions.some(item => item.filterField === 'optUserCode')) {
            this.queryConditions.filterConditions.push({
              filterField: 'optUserCode',
              filterValue: ids,
              operator: 'in'
            });
          }
        } else {
          if (!this.queryConditions.filterConditions.some(item => item.filterField === 'optObjId')) {
            this.queryConditions.filterConditions.push({
              filterField: 'optObjId',
              filterValue: this.$activatedRoute.snapshot.queryParams.id,
              operator: 'eq'
            });
          }
        }

      } else {
        this.queryConditions.filterConditions = this.queryConditions.filterConditions.filter(item => item.filterField !== 'optObjId');
      }
    }
  }

}
