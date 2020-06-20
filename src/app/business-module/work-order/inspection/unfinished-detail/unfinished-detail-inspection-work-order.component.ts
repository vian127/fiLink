import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {NzI18nService, NzFormatEmitEvent} from 'ng-zorro-antd';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {Result} from '../../../../shared-module/entity/result';
import {ResultModel} from '../../../../core-module/model/result.model';
import {PictureViewService} from '../../../../core-module/api-service/facility/picture-view-manage/picture-view.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ImageViewService} from '../../../../shared-module/service/picture-view/image-view.service';
import {ActivatedRoute} from '@angular/router';
import {InspectionService} from '../../../../core-module/api-service/work-order/inspection';
import {WORK_ORDER_DEVICE_TYPE, WORK_ORDER_STATUS, WORK_ORDER_STATUS_CLASS} from '../../../../shared-module/const/work-order';
import {InspectionTaskModel} from '../../model/inspection-model/inspection-task.model';
import {UserService} from '../../../../core-module/api-service/user/user-manage';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {FacilityUtilService} from '../../../facility';
import {InspectionWorkOrderDetailModel} from '../../model/inspection-model/inspection-work-order-detail.model';
import {ResultCode} from '../../work-order.config';
declare var $: any;
@Component({
  selector: 'app-unfinished-detail',
  templateUrl: './unfinished-detail-inspection-work-order.component.html',
  styleUrls: ['./unfinished-detail-inspection-work-order.component.scss']
})
export class UnfinishedDetailInspectionWorkOrderComponent implements OnInit {
  // 进度
  @ViewChild('schedule') schedule: TemplateRef<any>;
  // 状态模板
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  // 单位名称选择
  @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  // 责任人
  @ViewChild('roleTemp') roleTemp: TemplateRef<any>;
  // 是否通过
  @ViewChild('resultTemp') resultTemp: TemplateRef<any>;
  // 国际化
  public InspectionLanguage: InspectionLanguageInterface;
  public facilityLanguage: FacilityLanguageInterface;
  // 页面title
  public pageTitle;
  // 结果集
  public resultData: any;
  // 巡检项列表
  public device_dataSet = [];
  // 任务列表表单配置
  public deviceTableConfig: TableConfig;
  // 任务列表分页
  public devicePageBean: PageBean = new PageBean(10, 1, 1);
  // 工单列表
  public order_dataSet = [];
  // 工单表单配置
  public orderTableConfig: TableConfig;
  // 工单列表分页
  public orderPageBean: PageBean = new PageBean(10, 1, 1);
  // 查询条件
  public queryCondition: QueryCondition = new QueryCondition();
  // 页面类型
  public pageType;
  public modalOpen = false;
  // 任务id
  public inspectionTaskId;
  // form表单
  public formList;
  public btnName;
  // 树组件
  public treeSelectorConfig: TreeSelectorConfig;
  // 单位选择器配置
  private treeSetting: any;
  // 树节点
  public treeNodes = [];
  // 过滤条件
  private filterValue: any;
  // 单位选择器筛选
  public responsibleUnitIsVisible = false;
  // 单位名称
  public selectUnitName;
  // 获取责任人数据
  public roleArray = [];
  // 样式class
  public className = '';
  // 工单表格
  public orderTable = false;
  // 巡检表格
  public inspectTable = false;
  // 巡检报告
  public showReport = false;
  // 报告筛选
  public searchValue = '';
  // loading
  public isSpinning: boolean = true;
  // 滚动加载页码
  public scrollIndex: number = 1;
  // 滚动加载每页大小
  public scrollSize: number = 50;
  // 筛选结果
  public resultOptions = [];
  // 报告树数据
  public reportNodes = [];
  public allReportNodes = [];
  // 图片
  public imgSrc = '';
  // 表格配置
  public reportTableConfig: TableConfig;
  public reportDataSet = [];
  public reportPageBean: PageBean = new PageBean(10, 1, 1);
  constructor(
    private $activatedRoute: ActivatedRoute,
    private $facilityUtilService: FacilityUtilService,
    private $nzI18n: NzI18nService,
    private $pictureViewService: PictureViewService,
    private $message: FiLinkModalService,
    private $imageViewService: ImageViewService,
    private $userService: UserService,
    public $inspectionService: InspectionService,
  ) { }

  ngOnInit() {
    this.InspectionLanguage = this.$nzI18n.getLocaleData('inspection');
    this.facilityLanguage = this.$nzI18n.getLocaleData('facility');
    this.btnName = this.InspectionLanguage.handleCancel;
    this.judgePageJump();
    this.initTreeSelectorConfig();
  }
  /**
   * 判断页面跳转
   */
  judgePageJump() {
    this.$activatedRoute.queryParams.subscribe(params => {
      this.pageType = params.status;
      this.inspectionTaskId = params.inspectionTaskId;
      if (this.pageType === 'taskView') {   // 巡检任务
        this.inspectTable = true;
        this.pageTitle = this.InspectionLanguage.inspectionInfo;
        this.initDeviceTable();
        this.getTaskFormData(params.inspectionTaskId);
        this.refreshData();
      } else if (this.pageType === 'unfinishedView') {  // 未完成巡检工单
        this.inspectionTaskId = params.procId;
        this.className = 'wb23';
        this.orderTable = true;
        this.pageTitle = `${this.InspectionLanguage.inspection}` + `${this.InspectionLanguage.inspectionDetail}`;
        this.initOrderTable();
        this.getUnfinishedData(params.procId);
        this.refreshOrderData();
      } else if (this.pageType === 'finished') {  // 已完成工单详情
        this.className = 'wb23';
        this.orderTable = true;
        this.inspectionTaskId = params.procId;
        this.pageTitle = `${this.InspectionLanguage.inspection}` + `${this.InspectionLanguage.inspectionDetail}`;
        this.initOrderTable();
        this.getFinishedOrderData(params.procId);
        this.refreshOrderData();
      } else if (this.pageType === 'checkList') {  // checklist
        this.showReport = true;
        this.inspectionTaskId = params.procId;
        this.pageTitle = this.InspectionLanguage.inspectReport;
        this.initReportTable();
        this.showListModal();
        // this.refreshReportData();
      }
    });
  }

  /**
   * 获取任务详情表单数据
   */
  getTaskFormData(id) {
    const lag = this.InspectionLanguage;
    this.$inspectionService.inquireInspectionTask(id).subscribe((result: ResultModel<InspectionWorkOrderDetailModel>) => {
      if (result.code === ResultCode.successCode) {
        this.resultData = result.data;
        const data = result.data;
        const status = {
          '1': lag.notInspected,
          '2': lag.duringInspection,
          '3': lag.completed
        };
        const name = [];
        (data.deviceList ? data.deviceList : []).forEach(v => {
          name.push(v.deviceName);
        });
        const labelList = [
          {label: lag.inspectionTaskName, value: data.inspectionTaskName},
          {label: lag.inspectionStatus, value: status[data.inspectionTaskStatus]},
          {label: lag.enabledState, value: (data.isOpen === '1') ? lag.enable : lag.disable},
          // --
          {label: lag.inspectionTaskType, value: (data.inspectionTaskType === '1') ? lag.routineInspection : lag.notInspected},
          {label: lag.taskExpectedTime, value: data.procPlanDate},
          {label: lag.inspectionCycle, value: data.taskPeriod},
          // --
          {label: lag.startTime, value: this.formatterDate(data.startTime)},
          {label: lag.endTime, value: this.formatterDate(data.endTime)},
          {label: lag.inspectionArea, value: data.inspectionAreaName},
          // --
          {label: lag.inspectionFacility, value: name.toString()},
          {label: lag.inspectionEquipment, value: data.deviceName},
          {label: lag.isCreatMultiWorkOrder, value: (data.isMultipleOrder === '1') ? lag.right : lag.deny},
          // --
          {label: lag.totalInspectionFacilities, value: data.inspectionDeviceCount},
          {label: lag.responsibleUnit, value: data.accountabilityDeptName}
        ];
        this.formList = labelList;
      }
    });
  }

  /**
   * 获取未完成工单详情表单数据
   */
  getUnfinishedData(id) {
    const lag = this.InspectionLanguage;
    this.$inspectionService.getUpdateWorkUnfinished(id).subscribe((result: ResultModel<InspectionWorkOrderDetailModel>) => {
      if (result.code === ResultCode.successCode) {
        const data = result.data;
        const labelList = [
          {label: lag.inspection + lag.workOrderName, value: data.title},
          {label: lag.inspection + lag.workOrderStatus, value: lag[data.status]},
          {label: lag.startTime, value: this.formatterDate(data.createTime)},
          // --
          {label: lag.inspectionEndTime, value: this.formatterDate(data.expectedCompletedTime)},
          {label: lag.creationTime, value: this.formatterDate(data.createTime)},
          {label: lag.daysRemaining, value: data.lastDays},
          // --
          {label: lag.inspectionArea, value: data.deviceAreaName},
          {label: lag.facilityType, value: data.deviceType},
          {label: lag.equipmentType, value: (data.procRelatedEquipment.length > 0) ? data.procRelatedEquipment[0].equipmentType : ''},
          // --
          {label: lag.deviceTotal, value: data.inspectionDeviceCount},
          {label: lag.responsibleUnit, value: data.accountabilityDeptName},
          {label: lag.responsible, value: data.assign},
          // --
          {label: lag.carInfo, value: ''},
          {label: lag.materielInfo, value: (data.materiel.length > 0) ? data.materiel[0].materielName : ''},
          {label: lag.speedOfProgress, value: data.progressSpeed, isProgress: true},
          // --
          {label: lag.remark, value: data.remark},
          {label: lag.reasonsForTransfer, value: data.turnReason},
          {label: lag.retreatSingleReason, value: data.singleBackReason},
        ];
        this.formList = labelList;
      }
    });
  }

  /**
   * 已完工详情
   */
  getFinishedOrderData(id) {
    const lag = this.InspectionLanguage;
    this.$inspectionService.getFinishedDetail(id).subscribe((result: ResultModel<InspectionWorkOrderDetailModel>) => {
      if (result.code === ResultCode.successCode) {
        const data = result.data;
        const labelList = [
          {label: lag.inspection + lag.workOrderName, value: data.title},
          {label: lag.inspection + lag.workOrderStatus, value: lag[data.status]},
          {label: lag.startTime, value: this.formatterDate(data.createTime)},
          // --
          {label: lag.inspectionEndTime, value: this.formatterDate(data.expectedCompletedTime)},
          {label: lag.creationTime, value: this.formatterDate(data.createTime)},
          {label: lag.actualTime, value: this.formatterDate(data.createTime)},
          // --
          {label: lag.inspectionArea, value: data.deviceAreaName},
          {label: lag.facilityType, value: data.deviceType},
          {label: lag.equipmentType, value: data.equipmentType},
          // --
          {label: lag.deviceTotal, value: data.inspectionDeviceCount},
          {label: lag.responsibleUnit, value: data.accountabilityDeptName},
          {label: lag.responsible, value: data.assign},
          // --
          {label: lag.carInfo, value: data.carName},
          {label: lag.materielInfo, value: data.materielName},
          {label: lag.feeInformation, value: data.costName},
          // --
          {label: lag.remark, value: data.remark},
          {label: lag.retreatSingleReason, value: data.singleBackReason},
          {label: lag.reasonsForTransfer, value: data.turnReason},
        ];
        this.formList = labelList;
      }
    });
  }
  /**
   * 返回
   */
  goBack() {
    window.history.back();
  }

  /**
   * 时间格式转化
   */
  formatterDate(time) {
    if (!time) {
      return;
    }
    const date = new Date(time);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const mm = date.getMinutes();
    const s = date.getSeconds();
    // 设置小于10的数字
    function setNum(t) {
      return t < 10 ? '0' + t : t;
    }
    return (y + '-' + setNum(m) + '-' + setNum(d) + ' ' + setNum(h) + ':' + setNum(mm) + ':' + setNum(s));
  }
  /***
   *  分页显示
   */
  devicePageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 刷新及初始化表格数据
   */
  refreshData() {
    this.deviceTableConfig.isLoading = true;
    // this.queryCondition.bizCondition.inspectionTaskId = this.inspectionTaskId;
    this.queryCondition.filterConditions.push({
      filterField: 'inspectionTaskId',
      operator: 'eq',
      filterValue: this.inspectionTaskId
    });
    this.$inspectionService.getDetailList(this.queryCondition).subscribe((result: ResultModel<InspectionTaskModel[]>) => {
      if (result.code === ResultCode.successCode) {
        const data = result.data;
        this.deviceTableConfig.isLoading = false;
        data.forEach(item => {
          item.statusName = this.getStatusName(item.status);
          item.statusClass = this.getStatusClass(item.status);
        });
        this.device_dataSet = data;
      }
    }, () => {
      this.deviceTableConfig.isLoading = false;
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
   * 初始化任务表格配置
   */
  initDeviceTable() {
    this.deviceTableConfig = {
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      notShowPrint: true,
      simplePage: true,
      searchReturnType: 'object',
      scroll: {x: '1000px', y: '305px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        { // 工单名称
          title: this.InspectionLanguage.workOrderName, key: 'title',
          configurable: true, width: 160,
          isShowSort: true,
          searchable: true,
          searchKey: 'title',
          searchConfig: {type: 'input'}
        },
        { // 工单状态
          title: this.InspectionLanguage.workOrderStatus, key: 'status',
          configurable: true, width: 160,
          isShowSort: true,
          searchable: true,
          searchKey: 'status',
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.InspectionLanguage.assigned, value: WORK_ORDER_STATUS.assigned},
              {label: this.InspectionLanguage.pending, value: WORK_ORDER_STATUS.pending},
              {label: this.InspectionLanguage.processing, value: WORK_ORDER_STATUS.processing},
              {label: this.InspectionLanguage.turnProcessing, value: WORK_ORDER_STATUS.turnProcessing},
              {label: this.InspectionLanguage.singleBack, value: WORK_ORDER_STATUS.singleBack},
            ]
          },
          type: 'render',
          renderTemplate: this.statusTemp,
        },
        { // 巡检起始时间
          title: this.InspectionLanguage.inspectionStartTime, key: 'inspectionStartTime',
          configurable: true, width: 160,
          pipe: 'date',
          isShowSort: true,
          searchable: true,
          searchKey: 'inspectionStartTime',
          searchConfig: {type: 'dateRang'}
        },
        { // 期望完工时间
          title: this.InspectionLanguage.inspectionEndTime, key: 'inspectionEndTime',
          pipe: 'date', width: 160,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'inspectionEndTime',
          searchConfig: {type: 'dateRang'}
        },
        { // 设施类型
          title: this.InspectionLanguage.facilityType, key: 'deviceType',
          configurable: true, width: 160,
          isShowSort: true,
          searchable: true,
          searchKey: 'deviceTypeName',
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
        { // 设备类型
          title: this.InspectionLanguage.equipmentType, key: 'deviceType',
          configurable: true, width: 160,
          isShowSort: true,
          searchable: true,
          searchKey: 'deviceType',
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
        { // 责任单位
          title: this.InspectionLanguage.responsibleUnit, key: 'accountabilityDeptName',
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'accountabilityDeptList',
          searchConfig: {type: 'render', renderTemplate: this.UnitNameSearch}
        },
        {// 操作
          title: this.InspectionLanguage.operate, key: '', width: 80,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'operate'},
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [
        {
          text: this.InspectionLanguage.relatedPictures,
          className: 'fiLink-view-photo',
          permissionCode: '06-2-2-1',
          handle: (currentIndex) => {
            // currentIndex.procId = 'nQoxqjxR4FniyDFaTq6';
            // currentIndex.deviceId = 'CQGFxzr45rNLLk70ukl';
            currentIndex.deviceId = '';
            this.getPicUrlByAlarmIdAndDeviceId(currentIndex.procId, currentIndex.deviceId);
          }
        },
      ],
      sort: (event) => {
        this.handleSort(event);
        this.refreshData();
      },
      handleSearch: (event) => {
        /*this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;*/
        this.handleSearch(event);
        this.refreshData();
      }
    };
  }
  /**
   * 排序
   * param event
   */
  handleSort(event) {
    this.queryCondition.sortCondition.sortField = event.sortField;
    this.queryCondition.sortCondition.sortRule = event.sortRule;
  }
  handleSearch(event) {
    this.queryCondition.bizCondition = this.setBizCondition(event);
    this.queryCondition.pageCondition.pageNum = 1;
  }
  setBizCondition(event) {
    const _bizCondition = CommonUtil.deepClone(event);
    _bizCondition.inspectionTaskId = this.inspectionTaskId;
    return _bizCondition;
  }
  /**
  * 查看关联图片
  * param ids
  */
  getPicUrlByAlarmIdAndDeviceId(procId, deviceId) {
    if (this.modalOpen) {
      return;
    }
    this.modalOpen = true;
    this.$pictureViewService.getPicUrlByAlarmIdAndDeviceId(procId, deviceId).subscribe((result: Result) => {
      this.modalOpen = false;
      if (result.code === ResultCode.successCode) {
        if (result.data.length === 0) {
          this.$message.warning(this.InspectionLanguage.noPicture);
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
   * 工单列表数据
   */
  refreshOrderData() {
    this.orderTableConfig.isLoading = false;
    this.queryCondition.filterConditions.push({
      filterField: 'procId',
      operator: 'eq',
      filterValue: this.inspectionTaskId
    });
    this.$inspectionService.queryProcInspectionByProcInspectionId(this.queryCondition).subscribe((result: ResultModel<InspectionTaskModel[]>) => {
      if (result.code === ResultCode.successCode) {
        this.order_dataSet = result.data;
        this.orderTableConfig.isLoading = false;
      }
    }, () => {
      this.orderTableConfig.isLoading = false;
    });
  }
  /**
   * 工单表格配置
   */
  initOrderTable() {
    this.orderTableConfig = {
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      notShowPrint: true,
      simplePage: true,
      scroll: {x: '1000px', y: '305px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        { // 巡检设施
          title: this.InspectionLanguage.setDevice, key: 'deviceName',
          configurable: true, width: 170,
          isShowSort: true,
          searchable: true,
          searchKey: 'deviceName',
          searchConfig: {type: 'input'}
        },
        { // 巡检结果
          title: this.InspectionLanguage.inspectionResults, key: 'result',
          configurable: true, width: 170,
          isShowSort: true,
          searchable: true,
          searchKey: 'result',
          searchConfig: {type: 'input'}
        },
        { // 异常详细
          title: this.InspectionLanguage.exceptionallyDetailed, key: 'exceptionDescription',
          configurable: true, width: 170,
          isShowSort: true,
          searchable: true,
          searchKey: 'exceptionDescription',
          searchConfig: {type: 'input'}
        },
        { // 巡检时间
          title: this.InspectionLanguage.inspectionTime, key: 'inspectionTime',
          pipe: 'date', width: 170,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'inspectionTime',
          searchConfig: {type: 'dateRang'}
        },
        { // 责任人
          title: this.InspectionLanguage.responsible, key: 'assignName',
          configurable: true, width: 170,
          searchable: true,
          searchKey: 'assignName',
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.roleArray, renderTemplate: this.roleTemp}
        },
        { // 资源匹配情况
          title: this.InspectionLanguage.matchingOfResources, key: 'resourceMatching',
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'resourceMatching',
          searchConfig: {type: 'input'}
        },
        {// 操作
          title: this.InspectionLanguage.operate, key: '', width: 80,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'operate'},
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [
        {
          text: this.InspectionLanguage.relatedPictures,
          className: 'fiLink-view-photo',
          permissionCode: '06-2-2-1',
          handle: (currentIndex) => {
            // currentIndex.procId = 'nQoxqjxR4FniyDFaTq6';
            // currentIndex.deviceId = 'CQGFxzr45rNLLk70ukl';
            currentIndex.deviceId = '';
            this.getPicUrlByAlarmIdAndDeviceId(currentIndex.procId, currentIndex.deviceId);
          }
        },
      ],
      sort: (event) => {
        this.handleSort(event);
        this.refreshOrderData();
      },
      openTableSearch: (event) => {
        this.getAllUser();
      },
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshOrderData();
      }
    };
  }
  orderPageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshOrderData();
  }
  /**
   * 查询所有的单位
   */
  private queryAllDeptList() {
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
   * 打开责任单位选择器
   */
  showModal(filterValue) {
    if (this.treeNodes.length === 0) {
      this.$userService.queryAllDepartment().subscribe((result: Result) => {
        if (result.code === ResultCode.successCode) {
          this.treeNodes = result.data || [];
          this.filterValue = filterValue;
          if (!this.filterValue['filterValue']) {
            this.filterValue['filterValue'] = [];
          }
          this.treeSelectorConfig.treeNodes = result.data;
          this.responsibleUnitIsVisible = true;
        }
      }, (error) => { });
    } else {
      this.responsibleUnitIsVisible = true;
    }
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
      title: '',
      width: '400px',
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
   * 部门筛选选择结果
   */
  departmentSelectDataChange(event) {
    let selectArr = [];
    this.selectUnitName = '';
    if (event.length > 0) {
      selectArr = event.map(item => {
        this.selectUnitName += `${item.deptName},`;
        return item.id;
      });
    } else {
    }
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    if (selectArr.length === 0) {
      this.filterValue['filterValue'] = null;
    } else {
      this.filterValue['filterValue'] = selectArr;
    }
    this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, selectArr);
  }
  /**
   * 获得所有的责任人
   */
  getAllUser() {
    this.$inspectionService.queryAllUser(null).subscribe((result: Result) => {
      const roleArr = result.data;
      if (roleArr) {
        roleArr.forEach(item => {
          this.roleArray.push({'label': item.userName, 'value': item.id});
        });
      }
    });
  }

  /**
   * 报告筛选
   */
  onInputValue(event) {
    const value = CommonUtil.trim(event.value);
    if (value) {
      this.reportNodes.forEach(v => {
        if (v.children) {
          v.children.forEach(item => {
            if (item.title.indexOf(value) > -1) {
              this.resultOptions.push(item);
            }
          });
        }
      });
      console.log(this.resultOptions);
    }
  }

  /**
   * 筛选结果
   */
  changeResult(data) {
    this.searchValue = data.title;
    // 刷新表格查询设备
    const param = {
      'procId': this.inspectionTaskId,
      'deviceId': data.deviceId,
      'equipmentId': data.equipmentId
    };
    this.refreshReportData(param);
  }
  /**
   * 打开checklist
   */
  showListModal() {
    const param = {
      'procId': 'F4UZrevlltBh5x6Aa26',
      'deviceName': '设',
      'pageNum': 1,
      'pageSize': 5
    };
    this.$inspectionService.getDeviceList(param).subscribe((result: Result) => {
      if (result.code === ResultCode.successCode) {
        const list = result.data.procRelatedDevices || [];
        const that = this;
        list.forEach((v, i) => {
          v['key'] = v.deviceId;
          v['title'] = v.deviceName;
          if (v.equipment && v.equipment.length > 0) {
            v.equipment.forEach(item => {
              item['key'] = item.equipmentId;
              item['title'] = item.equipmentName;
              item['deviceId'] = v.deviceId;
              item['isLeaf'] = true;
            });
            if (i === 0) {
              const data = {
                'procId': that.inspectionTaskId,
                'deviceId': v.equipment.deviceId,
                'equipmentId': v.equipment.equipmentId
              };
              this.refreshReportData(data);
            }
          }
          v['children'] = v.equipment;
        });
        this.reportNodes = list;
        this.reportNodes = [];
        this.getTreeData(500);
        this.nextPage();
      }
    }, (result) => {
      this.$message.error(result.msg);
    });
  }
  /**
   * 初始化checklist树选择器配置
   */
  getTreeData(len) {
    const list = [];
    for (let i = 0; i < len; i++) {
      const data = {
        key: CommonUtil.getUUid(),
        title: (i + 1) + '设施' + (CommonUtil.getUUid()).substring(0, 5),
        deviceId: CommonUtil.getUUid(),
      };
      const n = Math.floor(Math.random() * 4) + 2;
      if (i % n === 0) {
        data['children'] = [];
        for (let k = 0; k < n; k++) {
          data['children'].push({
            key: CommonUtil.getUUid(),
            title: '设 备' + (CommonUtil.getUUid()).substring(0, 5),
            deviceId: data.deviceId,
            equipmentId: CommonUtil.getUUid(),
            isLeaf: true
          });
        }
      } else {
        data['isLeaf'] = true;
      }
      list.push(data);
    }
    this.allReportNodes = list;
    this.sliceDate();
  }
  sliceDate() {
    if (this.scrollIndex > Math.ceil(this.allReportNodes.length / this.scrollIndex)) {
      return;
    }
    this.isSpinning = true;
    this.reportNodes = this.allReportNodes.slice(0, this.scrollIndex * this.scrollSize);
    setTimeout(() => {
      this.isSpinning = false;
    }, 1500);
    console.log(this.reportNodes);
  }
  nextPage() {
    const that = this;
    $('#tree-warp').scroll(function(e) {
      const timer = setTimeout(function() {
        const event = e;
        const domHeight = $(event.target)[0].clientHeight;
        const topHeight = event.target.scrollTop;
        const scrollHeight = event.target.scrollHeight;
        if (scrollHeight > domHeight && (topHeight + domHeight === scrollHeight)) {
          that.scrollIndex++;
          that.sliceDate();
        }
        clearTimeout(timer);
      }, 1500);
    });
  }
  /**
   * 节点选择
   */
  clickNodes(event: NzFormatEmitEvent) {
    const data = event.node.origin;
    if (data && data.equipmentId) {
      const param = {
        'procId': this.inspectionTaskId,
        'deviceId': data.deviceId,
        'equipmentId': data.equipmentId
      };
      this.refreshReportData(param);
    }
  }
  /**
   * 初始化报告表格
   */
  initReportTable() {
    this.reportTableConfig = {
      isDraggable: false,
      isLoading: true,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: false,
      showSearchExport: false,
      notShowPrint: false,
      simplePage: true,
      scroll: {x: '1000px', y: '305px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {// 巡检项名称
          title: this.InspectionLanguage.inspectionItem,
          key: 'inspectionItemName', width: 100,
        },
        {// 是否通过
          title: this.InspectionLanguage.isPass,
          key: 'inspectionValue', width: 80,
          type: 'render',
          renderTemplate: this.resultTemp,
        },
        {// 备注
          title: this.InspectionLanguage.remark,
          key: 'remark', width: 190,
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      sort: (event) => {},
      openTableSearch: (event) => {},
      handleSearch: (event) => {}
    };
  }
  tableHeight() {
    const timers = setTimeout(() => {
      const dom = <HTMLElement>document.querySelector('.ant-table-scroll');
      dom.style.height = '450px';
    }, 500);
  }
  /**
   * 报告表格分页
   */
  reportPageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshReportData();
  }

  /**
   * 获取报告表格数据
   */
  refreshReportData(data?) {
    const param = {
      'procId': '6KC5kgbXjWVw66x15CJ',
      'deviceId': '1258',
      'equipmentId': '00232'
    };
    this.reportTableConfig.isLoading = false;
    this.$inspectionService.getEquipmentList(param).subscribe((result: Result) => {
      if (result.code === ResultCode.successCode) {
        const list = result.data || [];
        list.forEach(v => {
          if (v.inspectionValue === '1') {
            v.statusName = this.InspectionLanguage.passed;
            v.statusClass = 'iconfont icon-fiLink fiLink-success';
          } else if (v.inspectionValue === '0') {
            v.statusName = this.InspectionLanguage.notPass;
            v.statusClass = 'iconfont icon-fiLink fiLink-fail';
          } else {
            v.statusName = '';
            v.statusClass = '';
          }
        });
        this.reportDataSet = list;
        this.tableHeight();
        this.reportTableConfig.isLoading = false;
      }
    }, () => {
      this.reportTableConfig.isLoading = false;
    });
  }
}
