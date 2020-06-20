import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ResultCode, WorkOrderConfig} from '../../work-order.config';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {ClearBarrierService} from '../../../../core-module/api-service/work-order/clear-barrier';
import {Result} from '../../../../shared-module/entity/result';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ClearBarrierWorkOrderModel} from '../../model/clear-barrier-model/clear-barrier-work-order.model';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {PictureViewService} from '../../../../core-module/api-service/facility/picture-view-manage/picture-view.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ImageViewService} from '../../../../shared-module/service/picture-view/image-view.service';
import {FACILITY_TYPE_NAME} from '../../../../shared-module/const/facility';
import {AlarmLevelCode, getAlarmLevel} from '../../../facility/share/const/facility.config';

@Component({
  selector: 'app-unfinished-detail',
  templateUrl: './unfinished-detail-clear-barrier-work-order.component.html',
  styleUrls: ['./unfinished-detail-clear-barrier-work-order.component.scss']
})
export class UnfinishedDetailClearBarrierWorkOrderComponent extends WorkOrderConfig implements OnInit {
  // 告警弹窗
  @ViewChild('refAlarm') refAlarm: TemplateRef<any>;
  // 级别
  @ViewChild('alarmLevel') alarmLevel: TemplateRef<any>;
  // 国际化
  public InspectionLanguage: InspectionLanguageInterface;
  public alarmLanguage: AlarmLanguageInterface;
  // 页面title
  public pageTitle;
  // 页面类型
  public pageType;
  // 工单详情数据
  public resultData: any = {
    title: '',  // 工单名称
    status: '', // 工单状态
    deviceName: '', // 设施名称
    createTime: '', // 创建时间
    expectedCompletedTime: '', // 期望完工时间
    startTime: '', // 起始时间
    lastDays: '', // 剩余天数
    deviceAreaName: '', // 设施区域
    troubleName: '', // 关联故障
    procType: '', // 工单类型
    accountabilityDeptName: '', // 责任单位
    assignName: '', // 责任人
    remark: '', // 备注
    turnReason: '', // 转派原因
    singleBackReason: '', // 退单原因
  };
  // 关联故障或告警
  public refFaultAndAlarm;
  // 显示剩余天数
  public isFinished: boolean = false;
  // 列表数据
  public alarm_dataSet = [];
  public fault_dataSet = [];
  // 表格配置
  public alarmTableConfig: TableConfig;
  public faultTableConfig: TableConfig;
  // 列表分页
  public alarmPageBean: PageBean = new PageBean(10, 1, 1);
  public faultPageBean: PageBean = new PageBean(10, 1, 1);
  // 查询条件
  public queryCondition: QueryCondition = new QueryCondition();
  // 表格显示
  public isShowTable: boolean = true;
  // 弹窗
  public modalOpen = false;
  // 设施类型
  public facilityTypeListArr: any = [];
  public facilityTypeNames: object = {};
  // 告警id
  public refAlarmId;
  // 故障id
  public faultId;
  constructor(
    public $nzI18n: NzI18nService,
    private $modelService: NzModalService,
    private $message: FiLinkModalService,
    private $pictureViewService: PictureViewService,
    private $imageViewService: ImageViewService,
    private $clearBarrierService: ClearBarrierService,
    private $activatedRoute: ActivatedRoute,
  ) {
    super($nzI18n);
    this.facilityTypeListArr = this.facilityTypeList();
  }

  ngOnInit() {
    this.InspectionLanguage = this.$nzI18n.getLocaleData('inspection');
    this.alarmLanguage = this.$nzI18n.getLocaleData('alarm');
    this.getPageTitle();
    this.initAlarmTableConfig();
    this.initFaultTableConfig();
    this.facilityTypeListArr.forEach(v => {
      this.facilityTypeNames[v.value] = v.label;
    });
  }

  /**
   * 获取title 及 参数
   */
  getPageTitle() {
    this.pageTitle = this.workOrderLanguage.orderDetail;
    this.$activatedRoute.queryParams.subscribe(params => {
      this.pageType = params.type;
      this.refFaultAndAlarm = this.workOrderLanguage.relevancyAlarm + '/' + this.workOrderLanguage.fault;
      if (params.id && this.pageType === 'unfinished') {
        this.getFromData(params.id);
        this.isFinished = false;
      } else if (this.pageType === 'finished') {
        this.getFinishedData(params.id);
        this.isFinished = true;
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
   * 历史详情数据
   */
  getFinishedData(id) {
    this.$clearBarrierService.getClearFailureByIdForComplete(id).subscribe((result: ResultModel<ClearBarrierWorkOrderModel>) => {
      if (result.code === ResultCode.successCode) {
        this.resultData = result.data;
        if (result.data.troubleId) {
          this.faultId = result.data.troubleId;
          this.checkTableType('fault');
          if (result.data.troubleName) {
            this.resultData['refAlarmFaultName'] = this.workOrderLanguage.fault + '：' + result.data.troubleName;
          }
        }
        if (result.data.refAlarm) {
          this.refAlarmId = result.data.refAlarm;
          this.checkTableType('alarm');
          if (result.data.refAlarmName) {
            this.resultData['refAlarmFaultName'] = this.workOrderLanguage.alarm + '：' + result.data.refAlarmName;
          }
        }
      }
    }, err => {
      console.log('error');
    });
  }
  /**
   * 未完工表单数据
   */
  getFromData(id) {
    this.$clearBarrierService.getClearFailureByIdForProcess(id).subscribe((result: ResultModel<ClearBarrierWorkOrderModel>) => {
      if (result.code === ResultCode.successCode) {
        this.resultData = result.data;
        if (result.data.troubleId) {
          this.checkTableType('fault');
          this.faultId = result.data.troubleId;
          if (result.data.troubleName) {
            this.resultData['refAlarmFaultName'] = this.workOrderLanguage.fault + '：' + result.data.troubleName;
          }
        }
        if (result.data.refAlarm) {
          this.refAlarmId = result.data.refAlarm;
          this.checkTableType('alarm');
          // this.checkTableType('fault');
          if (result.data.refAlarmName) {
            this.resultData['refAlarmFaultName'] = this.workOrderLanguage.alarm + '：' + result.data.refAlarmName;
          }
        }
      }
    }, err => {
      console.log('error');
    });
  }

  /**
   * 判断加载哪种表格
   */
  checkTableType(type) {
    if (type === 'alarm') {
      this.isShowTable = true;
      const timer = setTimeout(() => {
        this.refreshAlarmData();
        clearTimeout(timer);
      }, 500);
    } else if (type === 'fault') {
      this.isShowTable = false;
      const timer = setTimeout(() => {
        this.refreshFaultData();
        clearTimeout(timer);
      }, 500);
    }
  }
  /**
   * 时间转化
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
    // tslint:disable-next-line:max-line-length
    return (y + '-' + setNum(m) + '-' + setNum(d) + ' ' + setNum(h) + ':' + setNum(mm) + ':' + setNum(s));
  }

  /**
   * 查看告警
   */
  showAlarmInfo(id) {
    const modal = this.$modelService.create({
      nzTitle: this.refFaultAndAlarm,
      nzContent: this.refAlarm,
      nzWidth: 800,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzMaskClosable: false,
      nzFooter: [
        /*{
          label: this.InspectionLanguage.handleOk,
          onClick: () => {
            alert('789');
          }
        },*/
        {
          label: this.InspectionLanguage.handleCancel,
          type: 'danger',
          onClick: () => {
            modal.destroy();
          }
        }
      ]
    });
    modal.afterOpen.subscribe(() => {
      // 5
    });
  }

  /**
   * 分页
   */
  tablePageChange(event, type) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    if (type === 1) {
      // 刷新告警表格
      this.refreshAlarmData();
    } else if (type === 2) {
      // 刷新故障表格
      this.refreshFaultData();
    }
  }
  handleSort(event) {
    this.queryCondition.sortCondition.sortField = event.sortField;
    this.queryCondition.sortCondition.sortRule = event.sortRule;
  }

  /**
   * 告警数据
   */
  refreshAlarmData() {
    // this.alarm_dataSet = this.getTestData();
    this.alarmTableConfig.isLoading = false;
    const refAlarmQueryCondition = new QueryCondition();
    refAlarmQueryCondition.filterConditions.push({filterField: 'id', operator: 'eq', filterValue: this.refAlarmId});
    this.$clearBarrierService.getRefAlarmInfo(refAlarmQueryCondition).subscribe((result: Result) => {
      if (result.code === ResultCode.successCode) {
        this.alarm_dataSet = result.data ? result.data : [];
        this.alarm_dataSet.forEach(item => {
          item.levelName = getAlarmLevel(this.$nzI18n, item.alarmFixedLevel);
          item.levelClass = `level${item.alarmFixedLevel}`;
        });
      }
    });
  }
  /**
   * 故障数据
   */
  refreshFaultData() {
    this.fault_dataSet = this.getTestData();
    this.faultTableConfig.isLoading = false;
  }
  /**
   * 初始化告警表格
   */
  initAlarmTableConfig() {
    this.alarmTableConfig = {
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
        { // 告警名称
          title: this.workOrderLanguage.alarmName, key: 'alarmName',
          configurable: true, width: 170,
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
        },
        { // 告警级别
          title: this.alarmLanguage.alarmFixedLevel, key: 'levelName',
          configurable: true, width: 170,
          type: 'render',
          renderTemplate: this.alarmLevel,
        },
        { // 告警对象
          title: this.alarmLanguage.alarmobject, key: 'alarmObject',
          configurable: true, width: 170,
        },
        { // 区域
          title: this.alarmLanguage.areaName, key: 'areaName', width: 170,
          configurable: true,
        },
        { // 责任单位
          title: this.alarmLanguage.responsibleDepartment, key: 'responsibleDepartment',
          configurable: true, width: 170,
        },
        { // 设施类型
          title: this.workOrderLanguage.deviceType, key: 'alarmSourceType',
          configurable: true, width: 170,
        },
        { // 频次
          title: this.alarmLanguage.alarmHappenCount, key: 'alarmHappenCount',
          configurable: true, width: 170,
        },
        { // 清除状态
          title: this.alarmLanguage.alarmCleanStatus, key: 'alarmCleanStatus',
          configurable: true, width: 170,
        },
        { // 确认状态
          title: this.alarmLanguage.alarmConfirmStatus, key: 'alarmConfirmStatus',
          configurable: true, width: 170,
        },
        { // 首次发生时间
          title: this.alarmLanguage.alarmBeginTime, key: 'alarmBeginTime',
          configurable: true, width: 170,
        },
        { // 最近发生时间
          title: this.alarmLanguage.alarmNearTime, key: 'alarmNearTime',
          configurable: true, width: 170,
        },
        { // 确认时间
          title: this.alarmLanguage.alarmConfirmTime, key: 'alarmConfirmTime',
          configurable: true, width: 170,
        },
        { // 确认用户
          title: this.alarmLanguage.alarmConfirmPeopleNickname, key: 'alarmConfirmPeopleNickname',
          configurable: true, width: 170,
        },
        { // 告警附加信息
          title: this.alarmLanguage.alarmAdditionalInformation, key: 'remark',
          configurable: true, width: 210,
        },
        {// 操作
          title: this.InspectionLanguage.operate, key: '',
          configurable: true, width: 80,
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
        {  // 图片
          text: this.commonLanguage.viewPhoto,
          className: 'fiLink-view-photo',
          permissionCode: '06-2-2-1',
          handle: (currentIndex) => {
            if (!currentIndex.isPicture) {
              this.$message.error(this.workOrderLanguage.noPictureNow);
            } else {
              this.getPicUrlByAlarmIdAndDeviceId(currentIndex.procId, currentIndex.deviceId);
            }
          }
        },
      ],
      sort: (event) => {
        this.handleSort(event);
        this.refreshAlarmData();
      },
      openTableSearch: (event) => {
        // this.getAllUser();
      },
      /*handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshAlarmData();
      }*/
    };
  }
  /**
   * 查看图片
   * param ids
   */
  getPicUrlByAlarmIdAndDeviceId(procId, deviceId) {
    if (this.modalOpen) {
      return;
    }
    this.modalOpen = true;
    this.$pictureViewService.getPicUrlByAlarmIdAndDeviceId(procId, deviceId).subscribe((result: Result) => {
      this.modalOpen = false;
      if (result.code === 0) {
        if (result.data.length === 0) {
          this.$message.warning(this.workOrderLanguage.noPictureNow);
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
   * 初始化故障表格
   */
  initFaultTableConfig() {
    this.faultTableConfig = {
      isLoading: true,
      isDraggable: true,
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      notShowPrint: true,
      simplePage: true,
      scroll: {x: '1000px', y: '305px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        { // 故障编号
          title: this.workOrderLanguage.faultCode, key: 'title',
          configurable: true, width: 150,
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
          isShowSort: true,
          searchable: true,
          searchKey: 'title',
          searchConfig: {type: 'input'}
        },
        { // 故障级别
          title: this.workOrderLanguage.faultLevel, key: 'status',
          configurable: true, width: 170,
          isShowSort: true,
          searchable: true,
          searchKey: 'status',
          searchConfig: {type: 'input'}
        },
        { // 故障类型
          title: this.workOrderLanguage.faultType, key: 'inspectionEndTime',
          pipe: 'date', width: 170,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'inspectionEndTime',
          searchConfig: {type: 'dateRang'}
        },
        { // 故障来源
          title: this.workOrderLanguage.faultSource, key: 'deviceTypes',
          configurable: true, width: 170,
          isShowSort: true,
          searchable: true,
          searchKey: 'deviceType',
          searchConfig: {type: 'input'}
        },
        { // 故障设施
          title: this.workOrderLanguage.faultDevice, key: 'deviceTypes',
          configurable: true, width: 170,
          searchable: true,
          searchKey: 'deviceType',
          searchConfig: {type: 'input'}
        },
        { // 故障设备
          title: this.workOrderLanguage.faultEquipment, key: 'deviceTypes',
          configurable: true, width: 170,
          searchable: true,
          searchKey: 'deviceType',
          searchConfig: {type: 'input'}
        },
        { // 故障描述
          title: this.workOrderLanguage.faultDesc, key: 'deviceTypes',
          configurable: true, width: 170,
          searchable: true,
          searchKey: 'deviceType',
          searchConfig: {type: 'input'}
        },
        { // 填报人
          title: this.workOrderLanguage.informant, key: 'deviceTypes',
          configurable: true, width: 170,
          searchable: true,
          searchKey: 'deviceType',
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
      operation: [],
      sort: (event) => {
        this.handleSort(event);
        this.refreshFaultData();
      },
      openTableSearch: (event) => {
        // this.getAllUser();
      },
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshFaultData();
      }
    };
  }
  getTestData() {
    const list = [];
    const data = {id: '', title: 'asd', status: '123', inspectionStartTime: 1591062662756, inspectionEndTime: 1591804290000, deviceTypes: '456'};
    const n = Math.floor(Math.random() * 5) + 5;
    for (let k = 0; k < n; k++) {
      list.push({
        id: CommonUtil.getUUid(),
        title: 'asd',
        status: '123',
        inspectionStartTime: 1591062662756,
        inspectionEndTime: 1591804290000,
        deviceTypes: '456'
      });
    }
    return list;
  }
}
