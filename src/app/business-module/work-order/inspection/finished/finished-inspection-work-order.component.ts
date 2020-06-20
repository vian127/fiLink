import {Component, OnInit, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {ActivatedRoute, Router} from '@angular/router';
import {FilterCondition, QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {Result} from '../../../../shared-module/entity/result';
import {InspectionService} from '../../../../core-module/api-service/work-order/inspection';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ExportParams} from '../../../../shared-module/entity/exportParams';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {PictureViewService} from '../../../../core-module/api-service/facility/picture-view-manage/picture-view.service';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {FacilityUtilService} from '../../../facility';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {UserService} from '../../../../core-module/api-service/user/user-manage';
import {ImageViewService} from '../../../../shared-module/service/picture-view/image-view.service';
import {
  WORK_ORDER_UNFINISHED_INSPECTION_NUMBER,
  WORK_ORDER_STATUS,
  WORK_ORDER_DEVICE_TYPE,
  WORK_ORDER_STATUS_CLASS,
  SEARCH_NUMBER
} from '../../../../shared-module/const/work-order';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {WorkOrderLanguageInterface} from '../../../../../assets/i18n/work-order/work-order.language.interface';
import {ChartColor} from '../../../../shared-module/const/chart-color.config';
import {ChartUtil} from '../../../../shared-module/util/chart-util';
import {ClearBarrierService} from '../../../../core-module/api-service/work-order/clear-barrier';
import {FACILITY_TYPE_NAME} from '../../../../shared-module/const/facility';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {ResultCode} from '../../work-order.config';

/**
 * 完工巡检记录
 */
@Component({
  selector: 'app-finished-inspection-work-order',
  templateUrl: './finished-inspection-work-order.component.html',
  styleUrls: ['./finished-inspection-work-order.component.scss']
})
export class FinishedInspectionWorkOrderComponent implements OnInit, AfterViewInit {
  // 表格模板
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // 状态模板
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  // 单位选择模板
  @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  // 角色选择模板
  @ViewChild('roleTemp') roleTemp: TemplateRef<any>;
  // 巡检
  @ViewChild('inspectionQuantityFilter') inspectionQuantityFilter: TemplateRef<any>;
  // 区域选择
  @ViewChild('AreaSearch') areaSearch: TemplateRef<any>;
  // 选值范围
  public searchNumber = SEARCH_NUMBER;
  // 工单状态码
  public WorkOrder = WORK_ORDER_UNFINISHED_INSPECTION_NUMBER;
  // 已完成巡检信息列表
  public isVisible = false;
  // 责任单位
  public responsibleUnitIsVisible = false;
  // title已完成巡检信息
  public title;
  // 完工记录列表数据存放
  public tableDataSet = [];
  // 已完成列表数据存放
  public seeDataSet = [];
  // 获取责任人数据
  public roleArray = [];
  // 分页
  public pageBean: PageBean = new PageBean(10, 1, 1); // 分页
  public seePageBean: PageBean = new PageBean(10, 1, 1); // 分页
  // 完工记录列表
  public tableConfig: TableConfig;
  // 已完成列表
  public seeTableConfig: TableConfig;
  // 已完成巡检信息ID
  public completedWorkOrderID;
  // 导出
  public exportParams: ExportParams = new ExportParams();
  // 国际化
  public InspectionLanguage: InspectionLanguageInterface;
  public facilityLanguage: FacilityLanguageInterface;
  public indexLanguage: IndexLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 查询参数模型
  public queryCondition: QueryCondition = new QueryCondition();
  // 树属性设置
  public treeSetting;
  // 树配置
  public treeSelectorConfig: TreeSelectorConfig;
  // 树节点数据
  public treeNodes = [];
  // 单位名称
  public selectUnitName;
  // 巡检数量input值
  public deviceCountInputValue;
  // 巡检数量input值
  public deviceCountSelectValue = 'eq';
  // 区域选择器配置
  public areaSelectorConfig: any = new TreeSelectorConfig();
  // 控制区域显示隐藏
  public areaSelectVisible = false;
  // 弹框过滤条件
  public filterObj = {
    areaName: '',
    areaId: '',
  };
  private filterValue: any;
  private areaFilterValue: any;
  private areaNodes: any[] = null;
  public  workOrderLanguage: WorkOrderLanguageInterface;
  // 设施类型统计报表显示的类型  chart 图表   text 文字
  public deviceTypeStatisticsChartType;
  // 工单状态统计报表显示的类型  chart 图表   text 文字
  public statusStatisticsChartType;
  public barChartOption;
  // 图形大小
  public canvasLength = 140;
  public canvasRadius = 70;
  // 已完工工单百分比
  public completedPercent;
  // 已退单工单百分比
  public singleBackPercent;

  constructor(private $nzI18n: NzI18nService,
              private $router: Router,
              private $inspection: InspectionService,
              public $message: FiLinkModalService,
              private $pictureViewService: PictureViewService,
              private $activatedRoute: ActivatedRoute,
              private $facilityUtilService: FacilityUtilService,
              private $userService: UserService,
              private $imageViewService: ImageViewService,
              private $clearBarrierService: ClearBarrierService,
  ) {
  }

  ngOnInit() {
    this.InspectionLanguage = this.$nzI18n.getLocaleData('inspection');
    this.facilityLanguage = this.$nzI18n.getLocaleData('facility');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.indexLanguage = this.$nzI18n.getLocaleData('index');
    this.workOrderLanguage = this.$nzI18n.getLocaleData('workOrder');
    this.initTableConfig();
    this.refreshData();
    this.seeInitTableConfig();
    this.initTreeSelectorConfig();
    this.initAreaSelectorConfig();
    this.canvasLength = this.canvasRadius * 2;
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getStatisticsByDeviceType();
      this.getStatisticsByStatus();
    }, 0);
  }

  /**
   * 显示巡检完工记录列表数据
   */
  public refreshData() {
    // 别的页面跳转过来参数拼接
    if ('id' in this.$activatedRoute.snapshot.queryParams) {
      if (!this.queryCondition.filterConditions.some(item => item.filterField === 'optObjId')) {
        this.queryCondition.bizCondition.procIds = [this.$activatedRoute.snapshot.queryParams.id];
      }
    } else {
      this.queryCondition.filterConditions = this.queryCondition.filterConditions.filter(item => item.filterField !== 'optObjId');
    }
    this.tableConfig.isLoading = true;
    this.$inspection.getFinishedList(this.queryCondition).subscribe((result: Result) => {
      if (result.code === ResultCode.successCode) {
        this.pageBean.Total = result.totalCount;
        this.tableConfig.isLoading = false;
        const data = result.data;
        data.forEach(item => {
          item.statusName = this.getStatusName(item.status);
          item.statusClass = this.getStatusClass(item.status);
          if (item.status === 'singleBack') {
            item.isShowTurnBackConfirmIcon = true;
          }
        });
        this.tableDataSet = result.data;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  searchChange(event, f) {
    if (event === 'lt' || event === 'gt') {
      event = '';
    }
    this.deviceCountInputValue = event || f.filterValue;
    // this.deviceCountSelectValue = f.operator;
  }

  /**
   * 显示已完成工单列表数据
   */
  public refreshCompleteData(id?) {
    this.seeTableConfig.isLoading = true;
    // this.queryCondition.bizCondition.procId = id;
    this.queryCondition.sortCondition = new SortCondition();
    this.queryCondition.filterConditions.push({
      filterField: 'procId',
      filterValue: id,
      operator: 'eq'
    });
    this.$inspection.getUnfinishedCompleteList(this.queryCondition).subscribe((result: Result) => {
      if (result.code === ResultCode.successCode) {
        for (let i = 0; i < result.data.length; i++) {
          if (result.data[i].result === this.WorkOrder.StrZero) {
            result.data[i].result = this.InspectionLanguage.normal;
          } else if (result.data[i].result === this.WorkOrder.StrOne) {
            result.data[i].result = this.InspectionLanguage.abnormal;
          }
        }
        this.tableConfig.isLoading = false;
        this.seePageBean.Total = result.totalCount;
        this.seeTableConfig.isLoading = false;
        this.seeDataSet = result.data;
      }
    }, () => {
      this.seeTableConfig.isLoading = false;
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '06-1-3',
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: true,
      scroll: {x: '1600px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {// 工单名称
          title: this.InspectionLanguage.workOrderName, key: 'title', width: 150,
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// 工单状态
          title: this.InspectionLanguage.workOrderStatus, key: 'status', width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'status',
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.InspectionLanguage.completed, value: WORK_ORDER_STATUS.completed},
              {label: this.InspectionLanguage.singleBack, value: WORK_ORDER_STATUS.singleBack},
            ]
          },
          type: 'render',
          renderTemplate: this.statusTemp,
        },
        {// 巡检起始时间
          title: this.InspectionLanguage.inspectionStartTime, key: 'inspectionStartTime', width: 180,
          pipe: 'date',
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'inspectionStartTime',
          searchConfig: {type: 'dateRang'}
        },
        {// 巡检结束时间
          title: this.InspectionLanguage.inspectionEndTime, key: 'inspectionEndTime', width: 180,
          pipe: 'date',
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'inspectionEndTime',
          searchConfig: {type: 'dateRang'}
        },
        {// 创建时间
          title: this.InspectionLanguage.creationTime, key: 'cTime', width: 180,
          pipe: 'date',
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'creatTime',
          searchConfig: {type: 'dateRang'}
        },
        {// 实际完成时间
          title: this.InspectionLanguage.actualTime, key: 'rcTime', width: 180,
          pipe: 'date',
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'rcTime',
          searchConfig: {type: 'dateRang'}
        },
        {// 巡检区域
          title: this.InspectionLanguage.inspectionArea, key: 'deviceAreaName', width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.areaSearch},
        },
        {// 设施类型
          title: this.InspectionLanguage.facilityType, key: 'deviceTypeName', width: 150,
          configurable: true,
          // type: 'render',
          searchable: true,
          searchKey: 'deviceTypeName',
          // renderTemplate: this.deviceTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.InspectionLanguage.patchPanel, value: WORK_ORDER_DEVICE_TYPE.patchPanel},
              {label: this.InspectionLanguage.opticalBox, value: WORK_ORDER_DEVICE_TYPE.opticalBox},
              {label: this.InspectionLanguage.manWell, value: WORK_ORDER_DEVICE_TYPE.manWell},
              {label: this.InspectionLanguage.jointClosure, value: WORK_ORDER_DEVICE_TYPE.jointClosure},
              {label: this.InspectionLanguage.outDoorCabinet, value: WORK_ORDER_DEVICE_TYPE.outDoorCabinet},
            ]
          },
        },
        {// 巡检数量
          title: this.InspectionLanguage.numberOfInspections, key: 'inspectionDeviceCount', width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.inspectionQuantityFilter}
        },
        {// 责任单位
          title: this.InspectionLanguage.responsibleUnit, key: 'accountabilityDeptName', width: 150,
          configurable: true,
          searchable: true,
          searchKey: 'accountabilityDeptList',
          searchConfig: {type: 'render', renderTemplate: this.UnitNameSearch}
        },
        {// 责任人
          title: this.InspectionLanguage.responsible, key: 'assignName', width: 150,
          configurable: true,
          searchable: true,
          searchKey: 'assigns',
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.roleArray, renderTemplate: this.roleTemp}
        },
        {// 备注
          title: this.InspectionLanguage.remark, key: 'remark', width: 150,
          configurable: true,
          isShowSort: true,
          // searchable: true,
          // searchConfig: {type: 'input'}
        },
        {// 退单原因
          title: this.InspectionLanguage.retreatSingleReason, key: 'singleBackUserDefinedReason', width: 200,
          configurable: true,
          isShowSort: true,
          // searchable: true,
          // searchKey: 'concatSingleBackReason',
          // searchConfig: {
          //   type: 'select', selectType: 'multiple', selectInfo: [
          //     {label: this.InspectionLanguage.FalsePositives, value: '1'},
          //     {label: this.InspectionLanguage.other, value: '0'},
          //   ]
          // },
        },
        {// 操作
          title: this.InspectionLanguage.operate, searchable: true, configurable: false,
          searchConfig: {type: 'operate'}, key: '', width: 180, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [
        {
          // 查看已完成信息
          text: this.InspectionLanguage.viewDetail,
          permissionCode: '06-1-3-2',
          className: 'fiLink-ref-order',
          handle: (currentIndex) => {
            this.title = this.InspectionLanguage.completeInspectionInformation;
            this.isVisible = true;
            this.completedWorkOrderID = currentIndex.procId;
            const id = currentIndex.procId;
            this.refreshCompleteData(id);
          }
        },
        { // 查看巡检报告
          text: this.InspectionLanguage.inspectReport,
          permissionCode: '06-1-1-7',
          className: 'fiLink-reports',
          handle: (currentIndex) => {
            const id = currentIndex.procId;
            this.$router.navigate([`/business/work-order/inspection/unfinished-detail/inspectReport`],
              {queryParams: {procId: id, status: 'checkList'}}).then();
          }
        },
        { // 详情
          text: this.InspectionLanguage.inspectionDetail,
          permissionCode: '06-1-1-10',
          className: 'fiLink-view-detail',
          handle: (currentIndex) => {
            const id = currentIndex.procId;
            this.$router.navigate([`/business/work-order/inspection/unfinished-detail/finishedView`],
              {queryParams: {procId: id, status: 'finished'}});
          }
        },
        {
          text: this.InspectionLanguage.regenerate,
          permissionCode: '06-1-1-1-1',
          className: 'fiLink-turn-back-confirm',
          key: 'isShowTurnBackConfirmIcon',
          confirmContent: this.InspectionLanguage.isItRegenerated,
          handle: (currentIndex) => {
            const id = currentIndex.procId;
            const status = currentIndex.status;
            this.$router.navigate([`/business/work-order/inspection/unfinished-detail/updates`],
              {queryParams: {procId: id, status: status}}).then();
          }
        }
      ],
      sort: (event) => {
        this.handleSort(event);
        this.refreshData();
      },
      handleSearch: (event) => {
        if (!event.deviceAreaName) {
          this.filterObj.areaName = '';
          this.$facilityUtilService.setAreaNodesStatus(this.areaNodes || [], null);
        }
        if (!event.accountabilityDeptList) {
          this.selectUnitName = '';
          this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, []);
        }
        if (!event.inspectionDeviceCount) {
          this.deviceCountInputValue = '';
          this.deviceCountSelectValue = 'eq';
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      handleExport: (event) => {
        this.exportParams.columnInfoList = event.columnInfoList;
        this.exportParams.columnInfoList.forEach(item => {
          if (item.propertyName === 'status' || item.propertyName === 'inspectionStartTime' ||
            item.propertyName === 'inspectionEndTime' || item.propertyName === 'cTime' || item.propertyName === 'rcTime') {
            item.isTranslation = 1;
          }
          if (item.propertyName === 'deviceTypeName') {
            item.columnName = this.InspectionLanguage.facilityType;
            item.propertyName = 'deviceType';
            item.isTranslation = 1;
          }
          // if (item.propertyName === 'concatSingleBackReason') {
          //   item.columnName = this.InspectionLanguage.retreatSingleReason;
          //   item.propertyName = 'singleBackReason';
          //   item.isTranslation = 1;
          // }
        });
        this.createExportParams(event);
        this.$inspection.completionRecordExport(this.exportParams).subscribe((result: Result) => {
          if (result.code === this.WorkOrder.ZERO) {
            this.$message.success(result.msg);
          } else {
            this.$message.error(result.msg);
          }
        }, () => {
        });
      },
      openTableSearch: (event) => {
        this.getAllUser();
      }
    };
  }

  /**
   * 生成导出条件
   */
  createExportParams(event) {
    // this.queryCondition.sortCondition = new SortCondition();
    this.exportParams.queryCondition = this.queryCondition;
    if (event.selectItem.length > this.WorkOrder.ZERO) {
      this.exportParams.queryCondition.bizCondition.procIds = event.selectItem.map(item => item.procId);
    }
    this.exportParams.excelType = event.excelType;
  }

  /**
   * 初始化已完成巡检信息列表配置
   */
  private seeInitTableConfig() {
    this.seeTableConfig = {
      isDraggable: false,
      primaryKey: '06-1-3-1',
      isLoading: false,
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      notShowPrint: true,
      scroll: {x: '1600px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {// 巡检设施
          title: this.InspectionLanguage.inspectionFacility, key: 'deviceName', width: 200,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// 巡检结果
          title: this.InspectionLanguage.inspectionResults, key: 'result', width: 200,
          searchable: true, configurable: true, isShowSort: true,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.InspectionLanguage.normal, value: this.WorkOrder.StrZero},  // 正常
              {label: this.InspectionLanguage.abnormal, value: this.WorkOrder.StrOne},   // 异常
            ]
          },
        },
        {// 异常详情
          title: this.InspectionLanguage.exceptionallyDetailed, key: 'exceptionDescription', width: 200,
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 巡检时间
          title: this.InspectionLanguage.inspectionTime, key: 'inspectionTime', width: 200,
          pipe: 'date',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'dateRang'}
        },
        {// 责任人
          title: this.InspectionLanguage.responsible, key: 'updateUserName', width: 200,
          configurable: true,
          searchable: true,
          searchKey: 'updateUser',
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.roleArray, renderTemplate: this.roleTemp}
        },
        {// 资源匹配情况
          title: this.InspectionLanguage.matchingOfResources, key: 'resourceMatching', width: 200,
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 关联图片
          title: this.InspectionLanguage.relatedPictures, searchable: true,
          searchConfig: {type: 'operate'}, width: 200, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: true,
      showSearch: false,
      operation: [
        {
          text: this.InspectionLanguage.viewDetail,
          className: 'fiLink-view-photo',
          handle: (currentIndex) => {
            this.getPicUrlByAlarmIdAndDeviceId(currentIndex.procId, currentIndex.deviceId);
          }
        },
      ],
      sort: (event) => {
        this.handleSort(event);
        this.refreshCompleteData(this.completedWorkOrderID);
      },
      handleSearch: (event) => {
        if (!event.accountabilityUnit) {
          this.selectUnitName = '';
          this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, []);
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshCompleteData(this.completedWorkOrderID);
      },
      openTableSearch: (event) => {
        this.getAllUser();
      }
    };
  }

  /**
   * 关联图片
   */
  getPicUrlByAlarmIdAndDeviceId(procId, deviceId) {
    this.$pictureViewService.getPicUrlByAlarmIdAndDeviceId(procId, deviceId).subscribe((result: Result) => {
      if (result.code === this.WorkOrder.ZERO) {
        if (result.data.length === this.WorkOrder.ZERO) {
          this.$message.warning(this.InspectionLanguage.noPicturesYet);
        } else {
          this.$imageViewService.showPictureView(result.data);
        }
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
    });
  }

  /**
   * 完工记录分页
   */
  pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 已完工分页
   */
  seePageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshCompleteData(this.completedWorkOrderID);
  }

  /**
   * 排序
   * param event
   */
  handleSort(event) {
    this.queryCondition.sortCondition.sortField = event.sortField;
    this.queryCondition.sortCondition.sortRule = event.sortRule;
  }

  /**
   * 隐藏弹框
   */
  close() {
    this.isVisible = false;
    this.seePageBean = new PageBean(10, 1, 1);
    this.tableComponent.handleRest();
   // this.seeInitTableConfig();
  }

  /**
   * 跳转到详情
   * param url
   */
  private navigateToDetail(url, extras = {}) {
    this.$router.navigate([url], extras).then();
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
   * 打开责任单位选择器
   */
  showModal(filterValue) {
    if (this.treeNodes.length === 0) {
      this.queryDeptList().then((bool) => {
        if (bool === true) {
          this.filterValue = filterValue;
          if (!this.filterValue['filterValue']) {
            this.filterValue['filterValue'] = [];
          }
          this.treeSelectorConfig.treeNodes = this.treeNodes;
          this.responsibleUnitIsVisible = true;
        }
      });
    } else {
      this.responsibleUnitIsVisible = true;
    }
  }

  /**
   * 责任单位选择结果
   * param event
   */
  selectDataChange(event) {
    let selectArr = [];
    this.selectUnitName = '';
    if (event.length > this.WorkOrder.ZERO) {
      selectArr = event.map(item => {
        this.selectUnitName += `${item.deptName},`;
        return item.id;
      });
    } else {
    }
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    if (selectArr.length === this.WorkOrder.ZERO) {
      this.filterValue['filterValue'] = null;
    } else {
      this.filterValue['filterValue'] = selectArr;
    }
    this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, selectArr);
  }

  /**
   * 初始化单位选择器配置
   */
  private initTreeSelectorConfig() {
    this.treeSetting = {
      check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: {'Y': '', 'N': ''},
      },
      data: {
        simpleData: {
          enable: true,
          idKey: 'id',
          pIdKey: 'deptFatherId',
          rootPid: null
        },
        key: {
          name: 'deptName',
          children: 'childDepartmentList'
        },
      },
      view: {
        showIcon: false,
        showLine: false
      }
    };
    this.treeSelectorConfig = {
      title: `${this.facilityLanguage.selectUnit}`,
      width: '480px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.facilityLanguage.deptName, key: 'deptName', width: 100,
        },
        {
          title: this.facilityLanguage.deptLevel, key: 'deptLevel', width: 100,
        },
        {
          title: this.facilityLanguage.parentDept, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }

  /**
   * 查询所有的区域
   */
  private queryDeptList() {
    return new Promise((resolve, reject) => {
      this.$userService.queryAllDepartment().subscribe((result: Result) => {
        this.treeNodes = result.data || [];
        resolve(true);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * 获得所有的责任人
   */
  getAllUser() {
    this.$inspection.queryAllUser(null).subscribe((result: Result) => {
      const roleArr = result.data;
      if (roleArr) {
        roleArr.forEach(item => {
          this.roleArray.push({'label': item.userName, 'value': item.id});
        });
      }
    });
  }


  /**
   * 设施区域弹框
   */
  showArea(filterValue) {
    this.areaFilterValue = filterValue;
    // 当区域数据不为空的时候
    if (this.areaNodes) {
      this.areaSelectorConfig.treeNodes = this.areaNodes;
      this.areaSelectVisible = true;
    } else {
      // 查询区域列表
      this.$facilityUtilService.getArea().then((data: any[]) => {
        this.areaNodes = data;
        this.areaSelectorConfig.treeNodes = this.areaNodes;
        this.$facilityUtilService.setAreaNodesStatus(this.areaNodes, null);
        this.areaSelectVisible = true;
      });
    }
  }

  /**
   * 区域选择监听
   * param item
   */
  areaSelectChange(item) {
    if (item && item[0]) {
      this.filterObj.areaId = item[0].areaId;
      this.filterObj.areaName = item[0].areaName;
      this.areaFilterValue['filterValue'] = item[0].areaId;
      this.$facilityUtilService.setAreaNodesStatus(this.areaNodes, item[0].areaId, item[0].areaId);
    } else {
      this.filterObj.areaId = '';
      this.filterObj.areaName = '';
      this.areaFilterValue['filterValue'] = null;
    }
  }

  /**
   * 初始化选择区域配置
   * param nodes
   */
  private initAreaSelectorConfig() {
    this.areaSelectorConfig = {
      width: '500px',
      height: '300px',
      title: `${this.InspectionLanguage.area}`,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'checkbox',
          chkboxType: {'Y': '', 'N': ''},
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'areaId',
          },
          key: {
            name: 'areaName'
          },
        },

        view: {
          showIcon: false,
          showLine: false
        }
      },
      treeNodes: this.areaNodes || []
    };
  }

  /**
   * input赋值
   */
  setInputValue(value) {
    return value = value.replace(/\D/g, '');
  }
  /**
   * echarts 图表
   */
  /**
   * 获取设施类型统计
   */
  getStatisticsByDeviceType() {
    this.$clearBarrierService.getStatisticsByDeviceType({
      'bizCondition': {
        'procType': 'clear_failure',
        'statisticalType': '2'
      }
    }).subscribe((result: Result) => {
      if (result.code === 0) {
        if (result.data.length === 0) {
          this.deviceTypeStatisticsChartType = 'text';
        } else {
          this.deviceTypeStatisticsChartType = 'chart';
          const name = [], data = [];
          result.data.forEach(item => {
            name.push(this.getFacilityTypeName(item.deviceType));
            data.push(
              {
                value: item.orderCount, itemStyle: {
                  color: ChartColor[item.deviceType]
                }
              });
          });
          this.barChartOption = ChartUtil.setWorkBarChartOption(data, name);
        }
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
    });
  }
  /**
   * 获取工单状态统计
   */
  getStatisticsByStatus() {
    this.$clearBarrierService.getStatisticsByStatus({
      'bizCondition': {
        'procType': 'clear_failure',
        'statisticalType': '2'
      }
    }).subscribe((result: Result) => {
      if (result.code === 0) {
        if (result.data.hisTotalCount === 0) {
          this.statusStatisticsChartType = 'text';
        } else {
          this.statusStatisticsChartType = 'chart';
          let completedCount: number;
          let singleBackCount: number;
          result.data.map(item => {
            if (item.status !== 'singleBack') {
              completedCount = item.orderCount;
            } else {
              singleBackCount = item.orderCount;
            }
          });
          let totalCount = 0;
          if (result.data.length) {
            totalCount = result.data.reduce((a, b) => a.orderCount + b.orderCount);
          }
          setTimeout(() => {
            this.getPercent('canvas_completed', '#339eff', completedCount, totalCount);
            this.getPercent('canvas_singleBack', '#65d688', singleBackCount, totalCount);
            this.completedPercent = totalCount !== 0 ? (100 * completedCount / totalCount).toFixed(2) + '%' : 0 + '%';
            this.singleBackPercent = totalCount !== 0 ? (100 * singleBackCount / totalCount).toFixed(2) + '%' : 0 + '%';
          }, 0);
        }
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
    });
  }

  // 计算环的角度
  getPercent(id, color, num = 0, total) {
    const endingAngle = (-0.5 + (num / total) * 2) * Math.PI;
    this.drawCircle(id, color, endingAngle);
  }

  // 画环
  drawCircle(id, color, endingAngle = 1.5 * Math.PI, startingAngle = -0.5 * Math.PI) {
    try {
      const canvas = document.getElementById(id);
      const context = canvas['getContext']('2d');
      const centerX = this.canvasRadius;
      const centerY = this.canvasRadius;
      context.beginPath();
      context.lineWidth = 8;
      context.strokeStyle = '#eff0f4';
      // 创建变量,保存圆弧的各方面信息
      const radius = this.canvasRadius - context.lineWidth / 2;
      // 画完整的环
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      context.stroke();

      context.beginPath();
      // 画部分的环
      // context.lineWidth = 3;completedPercent
      context.strokeStyle = color;
      context.arc(centerX, centerY, radius, startingAngle, endingAngle);
      context.stroke();
    } catch (e) {

    }
  }
  /**
   * 获取设施类型名称
   * param deviceType
   * returns {any | string}
   */
  public getFacilityTypeName(deviceType) {
    return deviceType ? this.indexLanguage[FACILITY_TYPE_NAME[deviceType]] : '';
  }
}
