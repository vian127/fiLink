import {AfterContentInit, Component, Input, OnChanges, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MapControl} from '../../util/map-control';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexWorkOrderService} from '../../../../core-module/api-service/index/index-work-order';
import {QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {ClearWorkOrderModel, InspectionWorkOrderModel} from '../../shared/model/work-order-condition.model';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {
  IndexPageSizeEnum,
  IndexWorkOrderStateEnum,
  IndexWorkOrderStateIconEnum,
  IndexWorkOrderTypeEnum
} from '../../shared/const/index-enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';

/**
 * 工单列表
 */
@Component({
  selector: 'app-index-order-table',
  templateUrl: './index-order-table.component.html',
  styleUrls: ['./index-order-table.component.scss']
})
export class IndexOrderTableComponent  implements OnInit, OnChanges, AfterContentInit, OnDestroy {
  // 区域数据
  @Input() areaData: string[];
  // 工单类型数据数据
  @Input() orderTypeData = IndexWorkOrderTypeEnum.inspection;
  // 工单状态数据数据
  @Input() orderStateData: string[];
  // 工单显示的工单
  @Input() defaultShowTable = true;
  // 工单名称
  @Input() titleName: string;
  // 表格下拉
  @Input() selectOption: string[];
  // 工单状态模板
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 国际化
  public commonLanguage: CommonLanguageInterface;
  // 工单状态枚举
  private workOrderStateEnum = IndexWorkOrderStateEnum;
  // 工单状态枚举
  private workOrderStateIconEnum = IndexWorkOrderStateIconEnum;
  // 巡检工单表格配置
  private workOrderInspectionTableConfig: TableConfig;
  // 巡检工单数据集
  private workOrderInspectionDataSet: InspectionWorkOrderModel[] = [];
  // 巡检工单分页
  private workOrderInspectionPageBean: PageBean = new PageBean(5, 1, 1);
  // 巡检工单全量查询条件
  private queryInspectionCondition: QueryCondition = new QueryCondition();
  // 销障工单表格配置
  private workOrderClearTableConfig: TableConfig;
  // 销障工单数据集
  private workOrderClearDataSet: ClearWorkOrderModel[] = [];
  // 销障工单分页
  private workOrderClearPageBean: PageBean = new PageBean(5, 1, 1);
  // 销障工单全量查询条件
  private queryClearCondition: QueryCondition = new QueryCondition();

  public constructor(
    private $router: Router,
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $indexWorkOlder: IndexWorkOrderService
  ) {
    this.indexLanguage = $nzI18n.getLocaleData('index');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
  }

  public ngOnInit(): void {
    // 标题名称国际化
    this.titleName = this.indexLanguage.inspectionWorkOrderTitle;
    // 巡检工单表格分页配置
    this.queryInspectionCondition.pageCondition.pageSize = IndexPageSizeEnum.pageSizeFive;
    // 销障工单表格分页配置
    this.queryClearCondition.pageCondition.pageSize = IndexPageSizeEnum.pageSizeFive;
  }

  public ngAfterContentInit(): void {
    // 加载巡检表格配置
    this.initInspectionWorkOrderTable();
    // 加载销障表格配置
    this.initClearWorkOrderTable();
  }

  public ngOnChanges(): void {
    if (this.areaData) {
      // 加载巡检工单
      if (this.orderTypeData === IndexWorkOrderTypeEnum.inspection) {
        this.getInspectionWorkOrderTable(true);
      }
      // 加载消障
      if (this.orderTypeData === IndexWorkOrderTypeEnum.clear_failure) {
        this.getClearWorkOrderTable(true);
      }
    }
  }

  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    this.statusTemp = null;
  }

  /**
   * 跳转至工单列表
   */
  public goToWorkOrderPage(): void {
    if (this.defaultShowTable) {
      // 跳转巡检
      this.$router.navigate([`/business/work-order/inspection/unfinished-list`]).then();
    } else {
      // 跳转销障
      this.$router.navigate([`/business/work-order/clear-barrier/unfinished-list`]).then();
    }
  }

  /**
   * 巡检工单表格数据加载
   */
  private getInspectionWorkOrderTable(para?: boolean): void {
    if (para === true) {
      this.queryInspectionCondition.filterConditions = [];
    }
    // 获取区域
    if (this.areaData && this.areaData.length > 0) {
      this.queryInspectionCondition.filterConditions.push({
        filterField: 'inspectionAreaId', operator: OperatorEnum.in, filterValue: this.areaData
      });
    }
    // 获取工单状态
    if (this.orderStateData && this.orderStateData.length > 0) {
      this.queryInspectionCondition.filterConditions.push({
        filterField: 'status', operator: OperatorEnum.in, filterValue: this.orderStateData
      });
    }
    this.workOrderInspectionTableConfig.isLoading = true;
    // 接口获取巡检工单数据
    this.$indexWorkOlder.queryInspectionListForHome(this.queryInspectionCondition)
      .subscribe((result: ResultModel<InspectionWorkOrderModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.workOrderInspectionPageBean.Total = result.totalCount;
          this.workOrderInspectionPageBean.pageIndex = result.pageNum;
          this.workOrderInspectionPageBean.pageSize = result.size;
          this.workOrderInspectionDataSet = result.data;
          // 数据遍历改造
          this.workOrderInspectionDataSet.forEach(item => {
            item.statusClass = this.getStatusClass(item.status);
            item.statusName = this.getStatusName(item.status);
          });
          this.workOrderInspectionTableConfig.isLoading = false;
        } else {
          this.$message.error(result.msg);
          this.workOrderInspectionTableConfig.isLoading = false;
        }
      }, () => {
        this.workOrderInspectionTableConfig.isLoading = false;
      });
  }

  /**
   * 销障工单表格数据加载
   */
  private getClearWorkOrderTable(para?: boolean): void {
    if (para === true) {
      this.queryClearCondition.filterConditions = [];
    }
    // 获取区域
    if (this.areaData && this.areaData.length > 0) {
      this.queryClearCondition.filterConditions.push({
        filterField: 'deviceAreaId', operator: OperatorEnum.in, filterValue: this.areaData
      });
    }
    // 获取工单状态
    if (this.orderStateData && this.orderStateData.length > 0) {
      this.queryClearCondition.filterConditions.push({
        filterField: 'status', operator: OperatorEnum.in, filterValue: this.orderStateData
      });
    }
    this.workOrderClearTableConfig.isLoading = true;
    // 获取销障工单数据
    this.$indexWorkOlder.queryClearListForHome(this.queryClearCondition).subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.workOrderClearPageBean.Total = result.totalCount;
        this.workOrderClearPageBean.pageIndex = result.pageNum;
        this.workOrderClearPageBean.pageSize = result.size;
        this.workOrderClearDataSet = result.data;
        // 数据遍历改造
        this.workOrderClearDataSet.forEach(item => {
          item.statusClass = this.getStatusClass(item.status);
          item.statusName = this.getStatusName(item.status);
        });
        this.workOrderClearTableConfig.isLoading = false;
      } else {
        this.$message.error(result.msg);
        this.workOrderClearTableConfig.isLoading = false;
      }
    }, () => {
      this.workOrderClearTableConfig.isLoading = false;
    });
  }

  /**
   * 巡检工单表格配置
   */
  private initInspectionWorkOrderTable(): void {
    this.workOrderInspectionTableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '440px', y: '250px'},
      searchReturnType: 'object',
      topButtons: [],
      simplePage: true,
      noIndex: true,
      columnConfig: [
        {
          // 工单ID
          title: '', key: 'procId', width: 100,
          hidden: true
        },
        {
          // 名称
          title: this.indexLanguage.workOrderName, key: 'title', width: 100,
          configurable: false,
          isShowSort: false,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 工单状态
          title: this.indexLanguage.workOrderStatus, key: 'status', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchKey: 'status',
          type: 'render',
          searchConfig: {type: 'select', selectType: 'default', selectInfo: this.selectOption},
          renderTemplate: this.statusTemp,
        },
        {
          // 责任单位
          title: this.indexLanguage.responsibilityUnit, key: 'accountabilityDeptName', width: 100,
          configurable: false,
          isShowSort: false,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 责任人
          title: this.indexLanguage.responsibilityPerson, key: 'assignName', width: 100,
          configurable: false,
          isShowSort: false,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 进度
          title: this.indexLanguage.schedule, key: 'progressSpeed', width: 100,
          configurable: false,
          isShowSort: false,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 操作
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 70, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: true,
      sort: (event: SortCondition) => {
        // 排序
        this.queryInspectionCondition.sortCondition.sortField = event.sortField;
        this.queryInspectionCondition.sortCondition.sortRule = event.sortRule;
        this.getInspectionWorkOrderTable(true);
      },
      operation: [],
      handleSearch: (event) => {
        // 表格检索
        this.queryInspectionCondition.filterConditions = [];
        this.queryInspectionCondition.pageCondition.pageNum = 1;
        // 工单状态查询
        if (event.status) {
          this.queryInspectionCondition.filterConditions.push({
            filterField: 'status', operator: OperatorEnum.in, filterValue: [event.status]
          });
        }
        // 工单名称查询
        if (event.title) {
          this.queryInspectionCondition.filterConditions.push({
            filterField: 'title', operator: OperatorEnum.like, filterValue: event.title
          });
        }
        // 责任单位查询
        if (event.accountabilityDeptName) {
          this.queryInspectionCondition.filterConditions.push({
            filterField: 'accountabilityDeptName', operator: OperatorEnum.like, filterValue: event.accountabilityDeptName
          });
        }
        // 责任人查询
        if (event.assignName) {
          this.queryInspectionCondition.filterConditions.push({
            filterField: 'assignName', operator: OperatorEnum.like, filterValue: event.assignName
          });
        }
        // 进度查询
        if (event.progressSpeed) {
          this.queryInspectionCondition.filterConditions.push({
            filterField: 'progressSpeed', operator: OperatorEnum.eq, filterValue: event.progressSpeed
          });
        }
        this.getInspectionWorkOrderTable(false);
      },
    };
  }

  /**
   * 销障表格配置
   */
  private initClearWorkOrderTable(): void {
    this.workOrderClearTableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '440px', y: '250px'},
      searchReturnType: 'object',
      topButtons: [],
      simplePage: true,
      noIndex: true,
      columnConfig: [
        {
          key: 'procId', width: 100, hidden: true
        },
        {
          // 工单名称
          title: this.indexLanguage.workOrderName, key: 'title', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchKey: 'title',
          searchConfig: {type: 'input'}
        },
        {
          // 工单状态
          title: this.indexLanguage.workOrderStatus, key: 'status', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchKey: 'status',
          type: 'render',
          searchConfig: {type: 'select', selectType: 'default', selectInfo: this.selectOption},
          renderTemplate: this.statusTemp,
        },
        {
          // 责任单位
          title: this.indexLanguage.responsibilityUnit, key: 'accountabilityDeptName', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchKey: 'accountabilityDeptName',
          searchConfig: {type: 'input'}
        },
        {
          // 责任人
          title: this.indexLanguage.responsibilityPerson, key: 'assignName', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchKey: 'assignName',
          searchConfig: {type: 'input'}
        },
        {
          // 剩余天数
          title: this.indexLanguage.remainingDays, key: 'lastDays', width: 80,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchKey: 'lastDays',
          searchConfig: {type: 'input'}
        },
        {
          // 关联故障
          title: this.indexLanguage.associatedFault, key: 'troubleName', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchKey: 'troubleName',
          searchConfig: {type: 'input'}
        },
        {
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 70, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: true,
      operation: [],
      sort: (event: SortCondition) => {
        this.queryClearCondition.sortCondition.sortField = event.sortField;
        this.queryClearCondition.sortCondition.sortRule = event.sortRule;
        this.getClearWorkOrderTable(true);
      },
      handleSearch: (event) => {
        this.queryClearCondition.filterConditions = [];
        this.queryClearCondition.pageCondition.pageNum = 1;

        // 工单状态查询
        if (event.status) {
          this.queryClearCondition.filterConditions.push({
            filterField: 'status', operator: OperatorEnum.in, filterValue: [event.status]
          });
        }
        // 工单名称查询
        if (event.title) {
          this.queryClearCondition.filterConditions.push({
            filterField: 'title', operator: OperatorEnum.like, filterValue: event.title
          });
        }
        // 责任单位查询
        if (event.accountabilityDeptName) {
          this.queryClearCondition.filterConditions.push({
            filterField: 'accountabilityDeptName', operator: OperatorEnum.like, filterValue: event.accountabilityDeptName
          });
        }
        // 责任人查询
        if (event.assignName) {
          this.queryClearCondition.filterConditions.push({
            filterField: 'assignName', operator: OperatorEnum.like, filterValue: event.assignName
          });
        }
        // 剩余天数查询
        if (event.lastDays) {
          this.queryClearCondition.filterConditions.push({
            filterField: 'lastDays', operator: OperatorEnum.eq, filterValue: event.lastDays
          });
        }
        // 关联故障查询
        if (event.troubleName) {
          this.queryClearCondition.filterConditions.push({
            filterField: 'troubleName', operator: OperatorEnum.like, filterValue: event.troubleName
          });
        }
        this.getClearWorkOrderTable(false);
      },
    };
  }

  /**
   * 巡检工单表格分页
   */
  public pageWorkOrderInspection(event: PageBean): void {
    this.queryInspectionCondition.pageCondition.pageNum = event.pageIndex;
    this.queryInspectionCondition.pageCondition.pageSize = event.pageSize;
    this.getInspectionWorkOrderTable(true);
  }

  /**
   * 销障工单表格分页
   */
  public pageWorkOrderClear(event: PageBean): void {
    this.queryClearCondition.pageCondition.pageNum = event.pageIndex;
    this.queryClearCondition.pageCondition.pageSize = event.pageSize;
    this.getClearWorkOrderTable(true);
  }

  /**
   * 获取工单类型样式
   *
   */
  private getStatusClass(status: string) {
    return `iconfont icon-fiLink ${this.workOrderStateIconEnum[status]}`;
  }

  /**
   * 获取工单类型名称
   *
   */
  private getStatusName(status: string) {
    return this.indexLanguage[this.workOrderStateEnum[status]] || '';
  }

}
