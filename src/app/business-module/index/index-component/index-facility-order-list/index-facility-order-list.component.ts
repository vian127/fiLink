import {Component, Input, OnInit, AfterContentInit, TemplateRef, ViewChild, OnDestroy} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexWorkOrderService} from '../../../../core-module/api-service/index/index-work-order';
import {ResultModel} from '../../../../core-module/model/result.model';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {Router} from '@angular/router';
import {ClearWorkOrderModel, InspectionWorkOrderModel} from '../../shared/model/work-order-condition.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {MapCoverageService} from '../../service/map-coverage.service';
import {IndexLayeredTypeEnum, IndexPageSizeEnum, IndexWorkOrderStateEnum, IndexWorkOrderStateIconEnum} from '../../shared/const/index-enum';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';

/**
 * 工单列表组件
 */
@Component({
  selector: 'app-index-facility-order-list',
  templateUrl: './index-facility-order-list.component.html',
  styleUrls: ['./index-facility-order-list.component.scss']
})
export class IndexFacilityOrderListComponent implements OnInit, AfterContentInit, OnDestroy {
  // 是否展示统计按钮
  @Input() isShowStatistics: boolean;
  // 是否展示更多
  @Input() isShowMore: boolean;
  // 是更多按钮的样式
  @Input() isStyleSwitch: boolean;
  // 是否是下拉选择器
  @Input() isSelect: boolean;
  // 设施id
  @Input() facilityId: string;
  // 当前的状态（设施或设备）
  @Input() facilityType: IndexLayeredTypeEnum;
  // 工单状态模板
  @ViewChild('statusTemp') statusTemp: TemplateRef<HTMLDocument>;
  // 工单状态枚举
  private workOrderStateEnum = IndexWorkOrderStateEnum;
  // 工单状态枚举
  private workOrderStateIconEnum = IndexWorkOrderStateIconEnum;
  // 国际化
  private indexLanguage: IndexLanguageInterface;
  // 国际化
  private commonLanguage: CommonLanguageInterface;
  // 更多
  private more: string;
  // 选择的工单类型
  private searchWorkOrderName: string;
  // 标题
  private title: string;
  // 默认显示的表格
  private defaultShowTable: boolean;
  // 巡检工单数据集
  private inspectionWorkOrderDataSet: InspectionWorkOrderModel[] = [];
  // 巡检工单分页
  public inspectionWorkOrderPageBean: PageBean = new PageBean(5, 1, 1);
  // 巡检工单表格配置
  private inspectionWorkOrderTableConfig: TableConfig;
  // 销账工单数据集
  private clearBarrierWorkOrderDataSet: ClearWorkOrderModel[] = [];
  // 销账工单分页
  public clearBarrierWorkOrderPageBean: PageBean = new PageBean(5, 1, 1);
  // 销障工单表格配置
  private clearBarrierWorkOrderTableConfig: TableConfig;
  // 设施巡检查询条件
  private queryInspectionConditionByFacility: QueryCondition = new QueryCondition();
  // 设施销障查询条件
  private queryClearConditionByFacility: QueryCondition = new QueryCondition();
  // 设备巡检查询条件
  private queryInspectionConditionByEquipment: QueryCondition = new QueryCondition();
  // 设备销障查询条件
  private queryClearConditionByEquipment: QueryCondition = new QueryCondition();
  // 当前图层
  private indexType = this.$mapCoverageService.showCoverage;

  public constructor(
    private $router: Router,
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $mapCoverageService: MapCoverageService,
    private $indexWorkOlder: IndexWorkOrderService) {
    this.indexLanguage = $nzI18n.getLocaleData('index');
    this.commonLanguage = $nzI18n.getLocaleData('common');
  }

  public ngOnInit(): void {
    // 巡检工单表格配置加载
    this.initInspectionWorkOrderTable();
    // 销障工单表格配置加载
    this.initClearBarrierWorkOrderTable();
    // 默认选中的表格
    this.defaultShowTable = true;
    // 表格名称国际化
    this.searchWorkOrderName = this.indexLanguage.inspectionWorkOrderTitle;
    // title名称国际化
    this.title = this.indexLanguage.inspectionWorkOrderTitle;
    // more名称国际化
    this.more = this.commonLanguage.more;
    // 巡检分页参数配置
    this.queryInspectionConditionByFacility.pageCondition.pageSize = IndexPageSizeEnum.pageSizeFive;
    // 销障分页参数配置
    this.queryClearConditionByFacility.pageCondition.pageSize = IndexPageSizeEnum.pageSizeFive;
  }

  public ngAfterContentInit(): void {
    console.log(this.indexType);
    // 设施图层
    if (this.indexType === IndexLayeredTypeEnum.facility) {
      // 加载设施巡检工单
      this.getInspectionWorkOrderTable();
      // 加载设施销障工单
      this.getClearBarrierWorkOrderTable();
    }
    // 设备图层
    if (this.indexType === IndexLayeredTypeEnum.device) {
      // 加载设备巡检工单
      this.getInspectionListByEquipmentIdForHome();
      // 加载设备巡检工单
      this.getClearListByEquipmentIdForHome();
    }
  }

  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    // 销毁工单状态转换模板
    this.statusTemp = null;
  }

  /**
   *  选择巡检工单
   */
  public searchCheckingWorkOrder(): void {
    // 选中改变defaultShowTable状态
    this.defaultShowTable = true;
    // 改变选中巡检工单名称国际化
    this.searchWorkOrderName = this.indexLanguage.inspectionWorkOrderTitle;
  }

  /**
   *  选择销障工单
   */
  public searchPinDisabledWorkOrder(): void {
    // 选中改变defaultShowTable状态
    this.defaultShowTable = false;
    // 改变选中销障工单名称国际化
    this.searchWorkOrderName = this.indexLanguage.clearBarrierWorkOrderTitle;
  }

  /**
   * 巡检工单表格配置
   */
  private initInspectionWorkOrderTable(): void {
    this.inspectionWorkOrderTableConfig = {
      isDraggable: true,
      isLoading: false,
      notShowPrint: true,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      searchReturnType: 'object',
      scroll: {x: '400', y: '400px'},
      noIndex: true,
      columnConfig: [
        {
          // 工单名称
          title: this.indexLanguage.workOrderName, key: 'title', width: 100,
          configurable: false,
          searchable: false,
          searchConfig: {type: 'input'}
        },
        {
          // 工单状态
          title: this.indexLanguage.workOrderStatus, key: 'status', width: 100,
          configurable: false,
          searchable: false,
          searchKey: 'status',
          type: 'render',
          renderTemplate: this.statusTemp,
        },
        {
          // 责任单位
          title: this.indexLanguage.responsibilityUnit, key: 'accountabilityDeptName', width: 100,
          configurable: false,
          searchable: false,
          searchConfig: {type: 'input'}
        },
        {
          // 责任人
          title: this.indexLanguage.responsibilityPerson, key: 'assignName', width: 100,
          configurable: false,
          searchable: false,
          searchConfig: {type: 'input'}
        },
        {
          // 进度
          title: this.indexLanguage.schedule, key: 'progressSpeed', width: 100,
          configurable: false,
          searchable: false,
          searchConfig: {type: 'input'}
        }
      ],
      showPagination: false,
      simplePage: false,
      bordered: false,
      showSearch: false,
      operation: [],
    };
  }

  /**
   * 销障表格配置
   */
  private initClearBarrierWorkOrderTable(): void {
    this.clearBarrierWorkOrderTableConfig = {
      isDraggable: true,
      isLoading: false,
      notShowPrint: true,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      searchReturnType: 'object',
      scroll: {x: '400', y: '400px'},
      noIndex: true,
      columnConfig: [
        {
          // 工单名称
          title: this.indexLanguage.workOrderName, key: 'title', width: 100,
          configurable: false,
          searchable: false,
        },
        {
          // 工单状态
          title: this.indexLanguage.workOrderStatus, key: 'status', width: 100,
          configurable: false,
          searchable: false,
          searchKey: 'status',
          type: 'render',
          renderTemplate: this.statusTemp,
        },
        {
          // 责任单位
          title: this.indexLanguage.responsibilityUnit, key: 'accountabilityDeptName', width: 100,
          configurable: false,
          searchable: false,
        },
        {
          // 责任人
          title: this.indexLanguage.responsibilityPerson, key: 'assignName', width: 100,
          configurable: false,
          searchable: false,
        },
        {
          // 剩余天数
          title: this.indexLanguage.remainingDays, key: 'lastDays', width: 80,
          configurable: false,
          searchable: false,
        },
        {
          // 关联故障
          title: this.indexLanguage.associatedFault, key: 'troubleName', width: 100,
          configurable: false,
          searchable: false,
        },
      ],
      showPagination: false,
      simplePage: false,
      bordered: false,
      showSearch: false,
      operation: [],
    };
  }

  /**
   * 设施巡检工单表格数据加载
   */
  private getInspectionWorkOrderTable(): void {
    this.queryInspectionConditionByFacility.filterConditions = [];
    // 参数赋值
    this.queryInspectionConditionByFacility.filterConditions.push(
      {
        filterField: 'procRelatedDevices.deviceId',
        operator: OperatorEnum.eq,
        filterValue: this.facilityId
      }
    );
    this.inspectionWorkOrderTableConfig.isLoading = true;
    // 接口获取设施巡检工单表格数据
    this.$indexWorkOlder.queryInspectionListByDeviceIdForHome(this.queryInspectionConditionByFacility)
      .subscribe((result: ResultModel<InspectionWorkOrderModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.inspectionWorkOrderDataSet = result.data;
          // 表格数据转换
          this.inspectionWorkOrderDataSet.forEach(item => {
            item.statusClass = this.getStatusClass(item.status);
            item.statusName = this.getStatusName(item.status);
          });
          this.inspectionWorkOrderTableConfig.isLoading = false;
        } else {
          this.$message.error(result.msg);
          this.inspectionWorkOrderTableConfig.isLoading = false;
        }
      }, () => {
        this.inspectionWorkOrderTableConfig.isLoading = false;
      });
  }

  /**
   * 设施销障工单表格数据加载
   */
  private getClearBarrierWorkOrderTable(): void {
    this.queryClearConditionByFacility.filterConditions = [];
    // 查询参数赋值
    this.queryClearConditionByFacility.filterConditions.push(
      {
        filterField: 'deviceId',
        operator: OperatorEnum.eq,
        filterValue: this.facilityId
      }
    );
    this.clearBarrierWorkOrderTableConfig.isLoading = true;
    // 接口获取设施销障工单表格
    this.$indexWorkOlder.queryClearListByDeviceIdForHome(this.queryClearConditionByFacility)
      .subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.clearBarrierWorkOrderDataSet = result.data;
          // 表格数据转换
          this.clearBarrierWorkOrderDataSet.forEach(item => {
            item.statusClass = this.getStatusClass(item.status);
            item.statusName = this.getStatusName(item.status);
          });
          this.clearBarrierWorkOrderTableConfig.isLoading = false;
        } else {
          this.$message.error(result.msg);
          this.clearBarrierWorkOrderTableConfig.isLoading = false;
        }
      }, () => {
        this.clearBarrierWorkOrderTableConfig.isLoading = false;
      });
  }

  /**
   * 设备巡检工单表格数据加载
   */
  private getInspectionListByEquipmentIdForHome(): void {
    this.queryInspectionConditionByEquipment.filterConditions = [];
    // 查询参数配置
    this.queryInspectionConditionByEquipment.filterConditions.push(
      {
        filterField: 'procRelatedEquipment.equipmentId',
        operator: OperatorEnum.eq,
        filterValue: this.facilityId
      }
    );
    this.inspectionWorkOrderTableConfig.isLoading = true;
    // 接口获取备巡检工单表格数据
    this.$indexWorkOlder.queryInspectionListByEquipmentIdForHome(this.queryInspectionConditionByEquipment)
      .subscribe((result: ResultModel<InspectionWorkOrderModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.inspectionWorkOrderDataSet = result.data;
          // 表格数据转换
          this.inspectionWorkOrderDataSet.forEach(item => {
            item.statusClass = this.getStatusClass(item.status);
            item.statusName = this.getStatusName(item.status);
          });
          this.inspectionWorkOrderTableConfig.isLoading = false;
        } else {
          this.$message.error(result.msg);
          this.inspectionWorkOrderTableConfig.isLoading = false;
        }
      }, () => {
        this.inspectionWorkOrderTableConfig.isLoading = false;
      });
  }

  /**
   * 设备销账工单表格数据加载
   */
  private getClearListByEquipmentIdForHome(): void {
    this.queryClearConditionByEquipment.filterConditions = [];
    // 参数配置
    this.queryClearConditionByEquipment.filterConditions.push(
      {
        filterField: 'equipment.equipmentId',
        operator: OperatorEnum.eq,
        filterValue: this.facilityId
      }
    );

    this.clearBarrierWorkOrderTableConfig.isLoading = true;
    this.$indexWorkOlder.queryClearListByEquipmentIdForHome(this.queryClearConditionByEquipment)
      .subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.clearBarrierWorkOrderDataSet = result.data;
          // 表格数据转换
          this.clearBarrierWorkOrderDataSet.forEach(item => {
            item.statusClass = this.getStatusClass(item.status);
            item.statusName = this.getStatusName(item.status);
          });
          this.clearBarrierWorkOrderTableConfig.isLoading = false;
        } else {
          this.$message.error(result.msg);
          this.clearBarrierWorkOrderTableConfig.isLoading = false;
        }
      }, () => {
        this.clearBarrierWorkOrderTableConfig.isLoading = false;
      });
  }

  /**
   * 获取工单类型名称
   *
   */
  private getStatusName(status: string) {
    return this.indexLanguage[this.workOrderStateEnum[status]] || '';
  }

  /**
   * 获取工单类型样式
   * param status
   * returns {string}
   */
  private getStatusClass(status: string) {
    return `iconfont icon-fiLink ${this.workOrderStateIconEnum[status]}`;
  }

  /**
   * 跳转至工单列表
   */
  public goToWorkOrderPage(): void {
    if (this.defaultShowTable) {
      // 跳转巡检工单
      this.$router.navigate([`/business/work-order/inspection/unfinished-list`]).then();
    } else {
      // 跳转销障工单
      this.$router.navigate([`/business/work-order/clear-barrier/unfinished-list`]).then();
    }
  }
}
