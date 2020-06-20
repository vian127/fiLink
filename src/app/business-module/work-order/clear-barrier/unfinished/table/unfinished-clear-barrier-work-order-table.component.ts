import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {FilterCondition, PageCondition, QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {Colour, ResultCode, WorkOrderConfig} from '../../../work-order.config';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {Result} from '../../../../../shared-module/entity/result';
import {PictureViewService} from '../../../../../core-module/api-service/facility/picture-view-manage/picture-view.service';
import {AlarmService} from '../../../../../core-module/api-service/alarm';
import {ActivatedRoute, Router} from '@angular/router';
import {ClearBarrierService} from '../../../../../core-module/api-service/work-order/clear-barrier';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {TreeSelectorConfig} from '../../../../../shared-module/entity/treeSelectorConfig';
import {FacilityUtilService} from '../../../../facility';
import {UserService} from '../../../../../core-module/api-service/user/user-manage';
import {ImageViewService} from '../../../../../shared-module/service/picture-view/image-view.service';
import {InspectionService} from '../../../../../core-module/api-service/work-order/inspection';
import {TableComponent} from '../../../../../shared-module/component/table/table.component';
import {SEARCH_NUMBER, WORK_ORDER_STATUS} from '../../../../../shared-module/const/work-order';
import {AlarmObjectConfig} from '../../../../../shared-module/component/alarm/alarmSelectorConfig';
import {getAlarmType} from '../../../../facility/share/const/facility.config';
import {IndexMissionService} from '../../../../../core-module/mission/index.mission.service';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {ClearBarrierWorkOrderModel} from '../../../model/clear-barrier-model/clear-barrier-work-order.model';

/**
 * 未完工销账工单表格
 */
@Component({
  selector: 'app-unfinished-clear-barrier-work-order-table',
  templateUrl: './unfinished-clear-barrier-work-order-table.component.html',
  styleUrls: ['./unfinished-clear-barrier-work-order-table.component.scss']
})
export class UnfinishedClearBarrierWorkOrderTableComponent extends WorkOrderConfig implements OnInit, OnChanges {
  @Output() workOrderEvent = new EventEmitter();
  @Input() slideShowChangeData;
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  @ViewChild('selectorModalTemp') selectorModalTemp: TemplateRef<any>;
  // 底部按钮
  @ViewChild('footerTemp') footerTemp: TemplateRef<any>;
  // 单位模板
  @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  // 关联告警
  @ViewChild('refAlarmTemp') refAlarmTemp: TemplateRef<any>;
  // 告警信息
  @ViewChild('showAlarmTemp') showAlarmTemp: TemplateRef<any>;
  @ViewChild('remainingDaysFilter') remainingDaysFilter: TemplateRef<any>;
  // 撤回
  @ViewChild('singleBackTemp') singleBackTemp: TemplateRef<any>;
  // 表格
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // 区域筛选
  @ViewChild('AreaSearch') areaSearch: TemplateRef<any>;
  // 选择设施名称
  @ViewChild('DeviceNameSearch') deviceNameSearch: TemplateRef<any>;
  // 运维建议
  @ViewChild('suggestModalTemp') suggestModalTemp: TemplateRef<any>;
  //  设施类型下拉框
  public selectOption;
  // 一天的毫秒数
  public dayTimes;
  // modal框节流阀
  public modalOpen = false;
  // 选中告警id
  public selectedAlarmId;
  // 指派工单对应id
  public selectedWorkOrderId;
  // 全选
  public isAllChecked = false;
  public isIndeterminate = false;
  // 角色数据
  public roleArr = [];
  // 选中单位id
  public selectedAccountabilityUnitIdList = [];
  // 单位列表
  public accountabilityUnitList = [];
  // 退单确认modal
  public singleBackConfirmModal;
  // clickPicInfo: any = {};
  public bigPicList = [];
  // 弹窗显隐
  public isVisible: boolean = false;
  // 树选择器配置
  public treeSelectorConfig: TreeSelectorConfig;
  // 树节点
  public treeNodes = [];
  // 选中单位名称
  public selectUnitName;
  // 数配置
  public treeSetting;
  // 关联告警
  public refAlarmArr: any[];
  // 跳转过来的ID
  public workOrderId;
  // 跳转过来的设施ID
  public deviceId;
  // 跳转过来的告警ID
  public refAlarmId;
  // 告警数据
  public alarmData;
  // 点击指派后按钮的状态
  public isAssignLoading: boolean;
  public alarmLanguage;
  // 剩余天数select值
  public lastDaySelectValue = 'eq';
  // 剩余天数
  public lastDaysInputValue;
  // 控制区域显示隐藏
  public areaSelectVisible = false;
  // 区域选择器配置
  public areaSelectorConfig: any = new TreeSelectorConfig();
  // 设施选择器配置
  public deviceObjectConfig: AlarmObjectConfig;
  // 判断数据是否存在
  public isPresence: boolean;
  // 过滤条件
  public filterObj = {
    picName: '',
    deviceName: '',
    deviceCode: '',
    areaName: '',
    resource: null,
    areaId: '',
    deviceIds: [],
    deviceTypes: []
  };
  public checkList = [];
  // 勾选的设施对象
  public checkDeviceObject = {
    name: '',
    ids: []
  };
  private filterValue: any;
  private areaFilterValue: any;
  // 区域节点数据
  private areaNodes: any[] = null;
  // 告警或故障
  public alarmTitle;
  // 建议列表
  public suggestList: any = [];
  // 条件
  public searchNumber = SEARCH_NUMBER;
  // 状态
  constructor(
    public $nzI18n: NzI18nService,
    private $indexMissionService: IndexMissionService,
    private $clearBarrierService: ClearBarrierService,
    private $router: Router,
    private $modal: NzModalService,
    private $alarmService: AlarmService,
    private $message: FiLinkModalService,
    private $pictureViewService: PictureViewService,
    private $facilityUtilService: FacilityUtilService,
    private $userService: UserService,
    private $active: ActivatedRoute,
    private $imageViewService: ImageViewService,
    private $inspection: InspectionService,
  ) {
    super($nzI18n);
  }

  ngOnInit() {
    this.dayTimes = 1000 * 60 * 60 * 24;
    this.alarmLanguage = this.$nzI18n.getLocaleData('alarm');
    this.setSelectOption();
    this.getId();
    this.initTableConfig();
    this.refreshData();
    this.initTreeSelectorConfig();
    this.initAreaSelectorConfig();
    this.initDeviceObjectConfig();
  }

  /**
   * 推送监听，实现实时刷新
   */
  public facilityChangeHook() {
    this.$indexMissionService.clearBarrierChangeHook.subscribe(data => {
      const isHave = this._dataSet.filter(_item => _item.procId === JSON.parse(data).procId);
      if (data && isHave.length > 0) {
        const that = this;
        setTimeout(function () {
          that.tableComponent.handleSearch();
        }, 1000);
      }
    });
  }

  /**
   * 刷新图表
   */
  refreshChart() {
    this.workOrderEvent.emit(true);
  }

  /**
   * 获取跳转页面的id
   */
  getId() {
    if (this.$active.snapshot.queryParams.id) {
      this.workOrderId = this.$active.snapshot.queryParams.id;
      console.log(this.workOrderId);
      this.queryCondition.bizCondition.procIds = [this.workOrderId];
    }
    if (this.$active.snapshot.queryParams.deviceId) {
      this.deviceId = this.$active.snapshot.queryParams.deviceId;
      this.queryCondition.bizCondition.deviceIds = [this.deviceId];
    }
    if (this.$active.snapshot.queryParams.alarmId) {
      this.refAlarmId = this.$active.snapshot.queryParams.alarmId;
      this.queryCondition.bizCondition.refAlarm = this.refAlarmId;
    }
  }

  /**
   * 获取未完工工单列表
   */
  refreshData() {
    this.tableConfig.isLoading = true;
    this.$clearBarrierService.getUnfinishedWorkOrderList(this.queryCondition).subscribe((result: ResultModel<ClearBarrierWorkOrderModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCode.successCode) {
        this.pageBean.Total = result.totalCount;
        const data = result.data;
        data.forEach(item => {
          item.statusName = this.getStatusName(item.status);
          // 剩余天数大于三天
          if (item.lastDays && item.lastDays > 3) {
            // 超过期望完工时间
          } else if (item.lastDays <= 0) {
            item.rowStyle = {color: Colour.overdueTime};
            // 剩余天数小于3天
          } else if (item.lastDays && item.lastDays <= 3 && item.lastDays > 0) {
            item.rowStyle = {color: Colour.estimatedTime};
          } else {
            item.lastDaysClass = '';
          }
          item.deviceTypeName = this.getFacilityTypeName(item.deviceType);
          item.statusClass = this.getStatusClass(item.status);
          // item.refAlarmName = getAlarmType(this.$nzI18n, item.refAlarmCode);
          this.setIconStatus(item);
          if (item.refAlarm && item.refAlarmName) {
            item['refAlarmFaultName'] = this.workOrderLanguage.alarm + '：' + item.refAlarmName;
          } else if (item.troubleId && item.troubleName) {
            item['refAlarmFaultName'] = this.workOrderLanguage.fault + '：' + item.troubleName;
          }
        });
        this._dataSet = data;
        this.facilityChangeHook();
      } else {
        this.$message.error(result.msg);
      }
    }, err => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 设置表格操作图标样式
   * param item
   */
  setIconStatus(item) {
    // 只有待指派能删
    item.isShowDeleteIcon = item.status === WORK_ORDER_STATUS.assigned ? true : false;
    // 已退单不可编辑
    item.isShowEditIcon = item.status !== WORK_ORDER_STATUS.singleBack;
    // 待处理可以撤回;
    item.isShowRevertIcon = item.status === WORK_ORDER_STATUS.pending ? true : false;
    // 待指派可以指派
    item.isShowAssignIcon = item.status === WORK_ORDER_STATUS.assigned ? true : false;
    // 工单状态为已退单且未确认   isCheckSingleBack = 0 未确认  1已确认
    // item.isShowTurnBackConfirmIcon = true;
    item.isShowTurnBackConfirmIcon = (item.status === WORK_ORDER_STATUS.singleBack && item.isCheckSingleBack !== 1);
    // 详情
    item.isShowWriteOffOrderDetail = true;
  }

  /**
   * 新增销障工单
   */
  private addWorkOrder() {
    this.navigateToDetail(`business/work-order/clear-barrier/unfinished-detail/add`);
  }

  /**
   * 跳转
   * param url
   */
  private navigateToDetail(url, extras = {}) {
    this.$router.navigate([url], extras).then();
  }

  /**
   * 设置设施类型下拉款选项
   */
  setSelectOption() {
    this.selectOption = this.workOrderStatusListArr.filter(item => {
      // 未确认的已退单的工单也会出现在未完工列表
      return item.value !== 'completed';
    });
  }

  /**
   * 工单类型过滤
   * param status
   */
  filterByStatus(status) {
    if (status && status !== 'all') {
      this.tableComponent.tableService.resetFilterConditions(this.tableComponent.queryTerm);
      this.queryCondition.bizCondition.statusList = [status];
      this.tableComponent.handleSetControlData('status', [status]);
      this.tableComponent.handleSearch();
    } else if (status === 'all') {
      this.queryCondition.bizCondition = {};
      this.tableComponent.handleSetControlData('status', null);
    }
    this.refreshData();
  }

  /**
   * 删除工单
   * param ids
   */
  deleteWorkOrder(ids) {
    this.$clearBarrierService.deleteWorkOrder(ids).subscribe((result: Result) => {
      if (result.code === ResultCode.successCode) {
        this.$message.success(result.msg);
        this.resetPageCondition();
        this.refreshData();
        this.refreshChart();
      } else {
        this.$message.error(result.msg);
        // this.resetPageCondition();
      }
    }, () => {
    });
  }

  /**
   * 指派工单
   * param ids
   */
  assignWorkOrder(id, modal) {
    const arr = this.selectedAccountabilityUnitIdList.map(item => {
      return {accountabilityDept: item};
    });
    this.isAllChecked = false;
    this.accountabilityUnitList = [];
    this.selectedAccountabilityUnitIdList = [];
    this.isAssignLoading = false;
    modal.destroy();
    modal.loading = true;
    if (arr.length > 0) {
      this.$clearBarrierService.assignWorkOrder(id, arr).subscribe((result: Result) => {
        if (result.code === ResultCode.successCode) {
          this.$message.success(result.msg);
          this.refreshData();
          this.refreshChart();
        } else {
          this.$message.error(result.msg);
          this.refreshData();
          this.refreshChart();
        }
      }, () => {
      });
    } else {
      this.$message.warning(this.workOrderLanguage.pleaseSelectUnit);
      modal.destroy();
    }
  }

  /**
   * 撤回工单
   * param ids
   */
  revokeWorkOrder(id) {
    this.$clearBarrierService.revokeWorkOrder(id).subscribe((result: Result) => {
      if (result.code === ResultCode.successCode) {
        this.isAllChecked = false;
        this.accountabilityUnitList = [];
        this.selectedAccountabilityUnitIdList = [];
        this.$message.success(result.msg);
        this.refreshData();
        this.refreshChart();
      } else {
        this.$message.error(result.msg);
        this.refreshData();
        this.refreshChart();
      }
    }, () => {
    });
  }

  /**
   * 打开退单确认modal
   */
  openSingleBackConfirmModal() {
    this.singleBackConfirmModal = this.$modal.create({
      nzTitle: this.workOrderLanguage.singleBackConfirm,
      nzContent: this.singleBackTemp,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzMaskClosable: false,
      nzFooter: this.footerTemp
    });
  }

  /**
   * 关闭退单确认modal
   */
  closeSingleBackConfirmModal() {
    this.singleBackConfirmModal.destroy();
  }

  /**
   * 退单确认
   * param ids
   */
  singleBackConfirm() {
    this.$clearBarrierService.singleBackConfirm(this.selectedWorkOrderId).subscribe((result: Result) => {
      if (result.code === ResultCode.successCode) {
        this.closeSingleBackConfirmModal();
        this.refreshData();
        this.refreshChart();
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
    });
  }

  /**
   * 重新编辑
   */
  rebuild() {
    this.closeSingleBackConfirmModal();
    this.goToDetail(this.selectedWorkOrderId);
  }

  /**
   * 查看图片
   * param ids
   */
  // getPicUrlByAlarmIdAndDeviceId(procId, deviceId) {
  //   this.$pictureViewService.getPicUrlByAlarmIdAndDeviceId(procId, deviceId).subscribe((result: Result) => {
  //     if (result.code === 0) {
  //       if (result.data.length === 0) {
  //         this.$message.warning(this.workOrderLanguage.noPictureNow);
  //       } else {
  //         this.$imageViewService.showPictureView(result.data);
  //       }
  //     } else {
  //       this.$message.error(result.msg);
  //       this.refreshData();
  //     }
  //   }, () => {
  //   });
  // }

  /**
   * 跳转至详情页面进行编辑
   * param id
   */
  goToDetail(id) {
    this.navigateToDetail('business/work-order/clear-barrier/unfinished-detail/update', {queryParams: {id}});
  }
  /**
   * 跳转至详情页面进行查看
   * param id
   */
  goToDetailView(id) {
    this.navigateToDetail('business/work-order/clear-barrier/unfinished-detail/view', {queryParams: {id}});
  }

  /**
   * 生成导出条件
   */
  createExportParams(event) {
    this.exportParams.queryCondition = new QueryCondition();
    // this.exportParams.queryCondition = this.queryCondition;
    if (event.selectItem.length > 0) {
      this.exportParams.queryCondition.bizCondition.procIds = event.selectItem.map(item => item.procId);
    } else {
      this.exportParams.queryCondition.bizCondition = this.queryCondition.bizCondition;
    }
    this.exportParams.excelType = event.excelType;
  }


  /**
   * 导出
   */
  handleExport(event) {
    this.createExportParams(event);
    this.$clearBarrierService.exportUnfinishedWorkOrder(this.exportParams).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
    });
  }


  /**
   * 打开关联告警modal
   */
  showRefAlarmModal(data) {
    if (this.modalOpen) {
      return;
    }
    this.modalOpen = true;
    const refAlarmQueryCondition = new QueryCondition();
    refAlarmQueryCondition.filterConditions.push({filterField: 'id', operator: 'eq', filterValue: data.refAlarm});
    this.$alarmService.queryCurrentAlarmList(refAlarmQueryCondition).subscribe((result: Result) => {
      this.modalOpen = false;
      if (result.code === 0 && result.data.length > 0) {
        this.alarmData = result.data[0];
        this.alarmData.alarmName = getAlarmType(this.$nzI18n, this.alarmData.alarmCode);
        Object.keys(this.alarmData).forEach(item => {
          if (item === 'alarmContinousTime') {
            this.alarmData['alarmContinousTime'] = CommonUtil.setAlarmContinousTime(this.alarmData['alarmBeginTime'],
              this.alarmData['alarmCleanTime'],
              {month: this.alarmLanguage.month, day: this.alarmLanguage.day, hour: this.alarmLanguage.hour});
          }
        });
        const modal = this.$modal.create({
          nzTitle: this.workOrderLanguage.refAlarm,
          nzContent: this.showAlarmTemp,
          nzWidth: 700,
          nzMaskClosable: true,
          nzFooter: [
            {
              label: this.commonLanguage.confirm,
              type: 'primary',
              onClick: () => {
                modal.destroy();
              }
            },
            {
              label: this.commonLanguage.cancel,
              type: 'danger',
              onClick: () => {
                modal.destroy();
              }
            },
          ]
        });
      } else {
        this.$alarmService.queryAlarmHistoryList(refAlarmQueryCondition).subscribe((result_his: Result) => {
          if (result_his.code === 0 && result_his.data.length > 0) {
            this.alarmData = result_his.data[0];
            this.alarmData.alarmName = getAlarmType(this.$nzI18n, this.alarmData.alarmCode);
            Object.keys(this.alarmData).forEach(item => {
              if (item === 'alarmContinousTime') {
                this.alarmData['alarmContinousTime'] = CommonUtil.setAlarmContinousTime(this.alarmData['alarmBeginTime'],
                  this.alarmData['alarmCleanTime'],
                  {month: this.alarmLanguage.month, day: this.alarmLanguage.day, hour: this.alarmLanguage.hour});
              }
            });
            const modal = this.$modal.create({
              nzTitle: this.workOrderLanguage.refAlarm,
              nzContent: this.showAlarmTemp,
              nzWidth: 700,
              nzFooter: [
                {
                  label: this.commonLanguage.confirm,
                  type: 'primary',
                  onClick: () => {
                    modal.destroy();
                  }
                },
                {
                  label: this.commonLanguage.cancel,
                  type: 'danger',
                  onClick: () => {
                    modal.destroy();
                  }
                },
              ]
            });
          } else {
            this.$message.info('暂无数据');
            return;
          }
        });
      }
    });
  }


  /**
   * 打开部门选择modal
   */
  showSelectorModal() {
    if (!this.selectedAlarmId) {   // 先选告警
      this.$message.warning(this.workOrderLanguage.alarmSelectedError);
      return;
    }
    const modal = this.$modal.create({
      nzTitle: this.workOrderLanguage.accountabilityUnitName,
      nzContent: this.selectorModalTemp,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzMaskClosable: false,
      nzFooter: [
        {
          label: this.commonLanguage.confirm,
          onClick: () => {
            this.selectAccountabilityUnit(modal);
          }
        },
        {
          label: this.commonLanguage.cancel,
          type: 'danger',
          onClick: () => {
            modal.destroy();
          }
        },
      ],
    });
    modal.afterOpen.subscribe(() => {
      this.getAccountabilityUnitList();
    });
  }

  /**
   * 选择单位
   */
  selectAccountabilityUnit(modal) {
    this.selectedAccountabilityUnitIdList = this.accountabilityUnitList.filter(item => item.checked).map(item => item.value);
    this.assignWorkOrder(this.selectedWorkOrderId, modal);
  }

  /**
   * 获取告警关联设施对应的单位
   */
  getAccountabilityUnitList() {
    this.$alarmService.queryDepartmentId([this.selectedAlarmId]).subscribe((result: Result) => {
      if (result.code === 0 && result.data.length > 0) {
        this.accountabilityUnitList = result.data.map(item => {
          return {
            value: item.responsibleDepartmentId,
            checked: this.selectedAccountabilityUnitIdList.indexOf(item.responsibleDepartmentId) > -1,
            label: item.responsibleDepartment,
          };
        });
      } else {
        this.$alarmService.queryDepartmentHistory([this.selectedAlarmId]).subscribe((result_his: Result) => {
          if (result.code === 0) {
            this.accountabilityUnitList = result_his.data.map(item => {
              return {
                value: item.responsibleDepartmentId,
                checked: this.selectedAccountabilityUnitIdList.indexOf(item.responsibleDepartmentId) > -1,
                label: item.responsibleDepartment,
              };
            });
          } else {
            this.$message.error(result.msg);
          }
        });
      }
    }, () => {
    });
  }

  /**
   * 单位选择改变
   */
  change() {
    const _isAllChecked = this.accountabilityUnitList.every(item => item.checked);
    const _isAllUnchecked = this.accountabilityUnitList.every(item => !item.checked);
    if (_isAllChecked) {
      this.isAllChecked = true;
      this.isIndeterminate = false;
    } else if (_isAllUnchecked) {
      this.isAllChecked = false;
      this.isIndeterminate = false;
    } else {
      this.isAllChecked = false;
      this.isIndeterminate = true;
    }
  }

  /**
   * 全选
   * param event
   */
  checkAll(event) {
    this.isIndeterminate = false;
    this.accountabilityUnitList.forEach(item => {
      item.checked = event;
    });
  }

  /**
   * 打开责任单位选择器
   */
  showModal(filterValue) {
    if (this.treeSelectorConfig.treeNodes.length === 0) {
      this.queryDeptList().then((bool) => {
        if (bool === true) {
          this.filterValue = filterValue;
          if (!this.filterValue['filterValue']) {
            this.filterValue['filterValue'] = [];
          }
          this.treeSelectorConfig.treeNodes = this.treeNodes;
          this.isVisible = true;
        }
      });
    } else {
      this.isVisible = true;
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
      title: `${this.facilityLanguage.selectUnit}`,
      width: '1000px',
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
   * 获得所有的责任人
   */
  getAllUser() {
    this.$inspection.queryAllUser(null).subscribe((result: Result) => {
      result.data.forEach(item => {
        this.roleArr.push({'label': item.userName, 'value': item.id});
      });
    });
  }

  /**
   * 责任单位选择结果
   * param event
   */
  selectDataChange(event) {
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
   * 查询所有的区域
   */
  private queryDeptList() {
    return new Promise((resolve, reject) => {
      this.$userService.queryAllDepartment().subscribe((result: Result) => {
        this.treeNodes = result.data || [];
        this.accountabilityUnitList = result.data || [];
        resolve(true);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * 获取关联告警下拉框数据
   */
  refAlarmList() {
    const alarmQueryCondition = new QueryCondition();
    alarmQueryCondition.pageCondition = new PageCondition(1, 20);
    this.$alarmService.queryAlarmCurrentSetList(alarmQueryCondition).subscribe((result: Result) => {
      const data = result.data;
      const arr = data.map(item => {
        return {value: item.alarmCode, label: item.alarmName};
      });
      // this.tableConfig.columnConfig[0]['searchConfig']['selectInfo'] = this.selectOption;
      this.tableConfig.columnConfig.forEach(item => {
        if (item.searchKey === 'refAlarmCodes') {
          item['searchConfig']['selectInfo'] = arr;
        }
      });
    });
  }

  /**
   * 初始化表格配置
   */
  initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      showSearchExport: true,
      primaryKey: '06-2-1',
      outHeight: 55,
      scroll: {x: '1800px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          // 工单名称
          title: this.workOrderLanguage.name, key: 'title', width: 150,
          configurable: false,
          searchable: true,
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
          searchConfig: {type: 'input'}
        },
        {
          // 工单状态
          title: this.workOrderLanguage.status, key: 'status', width: 120,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'status',
          minWidth: 100,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.selectOption},
          type: 'render',
          renderTemplate: this.statusTemp,
        },
        {
          // 设施名称
          title: this.workOrderLanguage.deviceName, key: 'deviceName', width: 150,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.deviceNameSearch},
        },
        {// 设备名称
          title: this.workOrderLanguage.equipmentName, key: 'equipmentName', width: 150,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 设施类型
          title: this.workOrderLanguage.deviceType, key: 'deviceTypeName', width: 120,
          configurable: true,
          searchable: true,
          searchKey: 'deviceType',
          sortKey: 'deviceType',
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.facilityTypeListArr}
        },
        {
          // 设施区域
          title: this.workOrderLanguage.deviceArea, key: 'deviceAreaName', width: 120,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.areaSearch},
        },
        {
          // 关联告警 故障
          title: this.workOrderLanguage.relevance + this.workOrderLanguage.alarm + '/' + this.workOrderLanguage.fault,
          key: 'refAlarmFaultName', width: 120,
          configurable: true,
          type: 'render',
          renderTemplate: this.refAlarmTemp,
          searchable: true,
          searchKey: 'refAlarmCodes',
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.refAlarmArr}
        },
        {
          // 责任单位
          title: this.workOrderLanguage.accountabilityUnitName, key: 'accountabilityDeptName', width: 120,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.UnitNameSearch}
        },
        {
          // 责任人
          title: this.workOrderLanguage.assignName, key: 'assignName', width: 140,
          configurable: true,
          searchable: true,
          searchKey: 'assigns',
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.roleArr}
        },
        {
          // 期望完工时间
          title: this.workOrderLanguage.expectedCompleteTime, key: 'expectedCompletedTime', width: 180,
          configurable: true,
          isShowSort: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {// 操作
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 180, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          text: '+  ' + this.workOrderLanguage.addWorkOrder,
          permissionCode: '06-2-1-1',
          handle: (currentIndex) => {
            this.addWorkOrder();
          }
        },
        {
          text: this.commonLanguage.deleteBtn,
          btnType: 'danger',
          canDisabled: true,
          needConfirm: true,
          permissionCode: '06-2-1-5',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          handle: (data) => {
            const ids = data.filter(item => item.checked).map(item => item.procId);
            this.deleteWorkOrder(ids);
          }
        }
      ],
      operation: [
        {
          // 详情
          text: this.commonLanguage.writeOffOrderDetail,
          className: 'fiLink-view-detail',
          handle: (currentIndex) => {
            // this.goToDetailView(currentIndex.procId);
            this.navigateToDetail('business/work-order/clear-barrier/unfinished-detail/view', {queryParams: {id: currentIndex.procId, type: 'unfinished'}});
          }
        },
        {
          // 退单
          text: this.commonLanguage.turnBackConfirm,
          key: 'isShowTurnBackConfirmIcon',
          className: 'fiLink-turn-back-confirm',
          permissionCode: '06-2-1-6',
          handle: (currentIndex) => {
            this.selectedWorkOrderId = currentIndex.procId;
            this.openSingleBackConfirmModal();
          }
        },
        {
          // 编辑
          text: this.commonLanguage.edit,
          permissionCode: '06-2-1-2',
          className: 'fiLink-edit',
          key: 'isShowEditIcon',
          handle: (currentIndex) => {
            // this.mapVisible = true;
            // 如果工单不存在，则不允许编辑
            if (currentIndex.status !== 'assigned') {
              this.$message.error(this.workOrderLanguage.noEdit);
              return;
            }
            this.$clearBarrierService.getWorkOrderDetail(currentIndex.procId).subscribe((result: Result) => {
              if (result.code === 0) {
                this.goToDetail(currentIndex.procId);
              } else {
                this.$message.error(result.msg);
                this.refreshData();
              }
            });

          },
        },
        {
          // 撤回
          text: this.commonLanguage.revert,
          permissionCode: '06-2-1-3',
          key: 'isShowRevertIcon',
          className: 'fiLink-revert',
          needConfirm: true,
          confirmContent: this.workOrderLanguage.isRevertWorkOrder,
          disabledClassName: 'fiLink-revert disabled-icon',
          handle: (currentIndex) => {
            this.revokeWorkOrder(currentIndex.procId);
          }
        },
        {
          // 指派
          text: this.commonLanguage.assign,
          key: 'isShowAssignIcon',
          className: 'fiLink-assigned',
          permissionCode: '06-2-1-4',
          disabledClassName: 'fiLink-assigned disabled-icon',
          handle: (currentIndex) => {
            this.selectedAlarmId = currentIndex.refAlarm;
            this.selectedWorkOrderId = currentIndex.procId;
            this.showSelectorModal();
          }
        },
        {
          // 删除
          text: this.commonLanguage.deleteBtn,
          key: 'isShowDeleteIcon',
          permissionCode: '06-2-1-5',
          className: 'fiLink-delete red-icon',
          disabledClassName: 'fiLink-delete disabled-red-icon',
          needConfirm: true,
          handle: (currentIndex) => {
            const ids = [];
            ids.push(currentIndex.procId);
            this.checkData(ids).then((bool) => {
              if (bool === true) {
                this.deleteWorkOrder(ids);
              } else {
                this.$message.error(this.commonLanguage.thisWorkOrderHasBeenDeleted);
                this.refreshData();
              }
            });
          }
        },
        { // 运维建议
          text: this.workOrderLanguage.suggest,
          className: 'fiLink-jianyi',
          handle: (currentIndex) => {
            this.showSuggestINfo(currentIndex);
          }
        },
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      openTableSearch: (event) => {
        this.refAlarmList();
        this.getAllUser();
      },
      handleSearch: (event) => {
        if (!event.accountabilityDeptName) {
          this.selectUnitName = '';
          this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, []);
        }
        if (!event.deviceAreaName) {
          this.filterObj.areaName = '';
          this.$facilityUtilService.setAreaNodesStatus(this.areaNodes || [], null);
        }
        if (!event.deviceName) {
          this.filterObj.deviceName = '';
          this.filterObj.deviceIds = [];
          this.initDeviceObjectConfig();
        }
        if (event.lastDay !== null) {
        }
        if (!event.lastDay) {
          this.lastDaysInputValue = '';
          this.queryCondition.bizCondition.lastDays = '';
          this.lastDaySelectValue = 'eq';
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      handleExport: (event) => {
        this.exportParams.columnInfoList = event.columnInfoList;
        this.exportParams.columnInfoList.forEach(item => {
          if (item.propertyName === 'status' || item.propertyName === 'cTime' || item.propertyName === 'ecTime') {
            item.isTranslation = 1;
          }
          if (item.propertyName === 'deviceTypeName') {
            item.propertyName = 'deviceType';
            item.isTranslation = 1;
          }
          if (item.propertyName === 'expectedCompletedTime') {
            item.propertyName = 'expectedCompletedTime';
            item.isTranslation = 1;
          }
        });
        this.handleExport(event);
      }
    };
  }

  /**
   * 检查数据是否存在
   */
  checkData(ids) {
    return new Promise((resolve, reject) => {
      this.$clearBarrierService.getUnfinishedWorkOrderList(this.queryCondition).subscribe((result: Result) => {
        for (let j = 0; j < ids.length; j++) {
          for (let i = 0; i < result.data.length; i++) {
            if (result.data[i].procId === ids[j]) {
              this.isPresence = true;
              break;
            } else {
              this.isPresence = false;
            }
          }
        }
        if (this.isPresence === true) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, (error) => {
        reject(error);
      });
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
      this.$facilityUtilService.setAreaNodesStatus(this.areaNodes, null);
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
      //  title: `${this.language.select}${this.language.area}`,
      title: '区域选择',
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
   * 设施选择器
   */
  initDeviceObjectConfig() {
    this.deviceObjectConfig = {
      clear: !this.filterObj.deviceIds.length,
      alarmObject: (event) => {
        this.checkDeviceObject = event;
        this.filterObj.deviceIds = event.ids;
        this.filterObj.deviceName = event.name;
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.tableConfig) {
      this.slideShowChange(this.slideShowChangeData);
    }
  }

  /**
   * 滑块变化
   * param event
   */
  slideShowChange(event) {
    if (event) {
      this.tableConfig.outHeight = 108;
    } else {
      this.tableConfig.outHeight = 8;
    }
    this.tableComponent.calcTableHeight();
  }

  /**
   * value值
   */
  setValue(value) {
    return value.replace(/\D/g, '');
  }
  /**
   * 运维建议
   */
  showSuggestINfo(data) {
    this.$clearBarrierService.getSuggestInfo('orderOutOfTime').subscribe((result: Result) => {
      if (result.code === 0) {
        const list = [];
        this.alarmTitle = '告警原因：';
        result.data.forEach(v => {
          list.push({
            name: `${v.breakdownReason}（${v.percentage}%）`,
            planSuggest: v.maintenanceProgramAdvise.split('，'),
            resourcesSuggest: v.resourceNeedAdvise.split('，')
          });
        });
        this.suggestList = list;
        this.getSuggestList();
      }
    }, () => {
      this.$message.error('error');
    });
  }

  /**
   * 运维建议
   */
  getSuggestList () {
    const modals = this.$modal.create({
      nzTitle: this.workOrderLanguage.suggest,
      nzWidth: 800,
      nzContent: this.suggestModalTemp,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzMaskClosable: false,
      nzFooter: [
        {
          label: this.commonLanguage.cancel,
          type: 'danger',
          onClick: () => {
            modals.destroy();
          }
        },
      ],
    });
    modals.afterOpen.subscribe(() => {
      /*this.alarmTitle = '告警原因：';
      this.suggestList = [
        {name: '线路过载（10%）', planSuggest: ['检查线路', '检查设备', '加强防水、绝缘'], resourcesSuggest: ['电气工程师2名', '通信工程师1名']},
        {name: '线路短路（10%）', planSuggest: ['检查线路', '检查设备', '加强防水、绝缘'], resourcesSuggest: ['电气工程师2名', '通信工程师1名']},
        {name: '线路漏电（80%）', planSuggest: ['检查线路', '检查设备', '加强防水、绝缘'], resourcesSuggest: ['电气工程师2名', '通信工程师1名']}
      ];*/
    });
  }
}
