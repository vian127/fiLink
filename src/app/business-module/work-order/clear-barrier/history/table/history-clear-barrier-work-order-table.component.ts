import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ResultCode, WorkOrderConfig} from '../../../work-order.config';
import {FilterCondition, PageCondition, QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {Result} from '../../../../../shared-module/entity/result';
import {ClearBarrierService} from '../../../../../core-module/api-service/work-order/clear-barrier';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {PictureViewService} from '../../../../../core-module/api-service/facility/picture-view-manage/picture-view.service';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {TreeSelectorConfig} from '../../../../../shared-module/entity/treeSelectorConfig';
import {UserService} from '../../../../../core-module/api-service/user/user-manage';
import {FacilityUtilService} from '../../../../facility';
import {AlarmService} from '../../../../../core-module/api-service/alarm/alarm-manage';
import {ActivatedRoute, Router} from '@angular/router';
import {ImageViewService} from '../../../../../shared-module/service/picture-view/image-view.service';
import {InspectionService} from '../../../../../core-module/api-service/work-order/inspection';
import {WORK_ORDER_STATUS} from '../../../../../shared-module/const/work-order';
import {AlarmObjectConfig} from '../../../../../shared-module/component/alarm/alarmSelectorConfig';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {ClearBarrierWorkOrderModel} from '../../../model/clear-barrier-model/clear-barrier-work-order.model';

/**
 * 历史销账工单表格
 */
@Component({
  selector: 'app-history-clear-barrier-work-order-table',
  templateUrl: './history-clear-barrier-work-order-table.component.html',
  styleUrls: ['./history-clear-barrier-work-order-table.component.scss']
})
export class HistoryClearBarrierWorkOrderTableComponent extends WorkOrderConfig implements OnInit {
  // 状态模板
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  // 单位模板
  @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  // 关联告警模板
  @ViewChild('refAlarmTemp') refAlarmTemp: TemplateRef<any>;
  // 告警弹窗模板
  @ViewChild('showAlarmTemp') showAlarmTemp: TemplateRef<any>;
  // 区域查询模板
  @ViewChild('AreaSearch') areaSearch: TemplateRef<any>;
  // 设施总数模板
  @ViewChild('DeviceNameSearch') deviceNameSearch: TemplateRef<any>;
  // 关联告警modal内容数据
  public alarmData;
  //  设施类型下拉框
  public selectOption;
  // 一天的毫秒数
  public dayTimes;
  // 弹窗显示隐藏
  public isVisible: boolean = false;
  // 树配置
  public treeSelectorConfig: TreeSelectorConfig;
  // 树节点数据
  public treeNodes = [];
  // 单位名称
  public selectUnitName;
  // 树配置
  public treeSetting;
  // 弹窗
  public modalOpen = false;
  // 角色数据
  public roleArr = [];
  // 国际化
  public alarmLanguage;
  // 控制区域显示隐藏
  public areaSelectVisible = false;
  // 区域选择器配置
  public areaSelectorConfig: any = new TreeSelectorConfig();
  // 设施选择器配置
  public deviceObjectConfig: AlarmObjectConfig;
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
  // 过滤数据
  private filterValue: any;
  // 区域筛选值
  private areaFilterValue: any;
  // 区域节点数据
  private areaNodes: any[] = null;
  constructor(
    public $nzI18n: NzI18nService,
    private $clearBarrierService: ClearBarrierService,
    private $message: FiLinkModalService,
    private $pictureViewService: PictureViewService,
    private $facilityUtilService: FacilityUtilService,
    private $userService: UserService,
    private $alarmService: AlarmService,
    private $router: Router,
    private $imageViewService: ImageViewService,
    private $modal: NzModalService,
    private $inspection: InspectionService,
    private $active: ActivatedRoute
  ) {
    super($nzI18n);
  }

  ngOnInit() {
    this.getId();
    this.dayTimes = 1000 * 60 * 60 * 24;
    this.alarmLanguage = this.$nzI18n.getLocaleData('alarm');
    this.setSelectOption();
    this.initTableConfig();
    this.refreshData();
    // this.setExportParamsColumnInfoList();
    this.queryDeptList();
    this.initTreeSelectorConfig();
    this.initAreaSelectorConfig();
    this.initDeviceObjectConfig();
  }

  /**
   * 刷新表格数据
   */
  refreshData() {
    this.tableConfig.isLoading = true;
    this.$clearBarrierService.getHistoryWorkOrderList(this.queryCondition).subscribe((result: ResultModel<ClearBarrierWorkOrderModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCode.successCode) {
        this.pageBean.Total = result.totalCount;
        const data = result.data ? result.data : [];
        data.forEach(item => {
          item.statusName = this.getStatusName(item.status);
          item.deviceTypeName = this.getFacilityTypeName(item.deviceType);
          item.statusClass = this.getStatusClass(item.status);
          if (item.status === WORK_ORDER_STATUS.singleBack) {
            item.isShowTurnBackConfirmIcon = true;
          }
          // 详情
          item.isShowWriteOffOrderDetail = true;
          if (item.refAlarm && item.refAlarmName) {
            item['refAlarmFaultName'] = this.workOrderLanguage.alarm + '：' + item.refAlarmName;
          } else if (item.troubleId && item.troubleName) {
            item['refAlarmFaultName'] = this.workOrderLanguage.fault + '：' + item.troubleName;
          }
        });
        this._dataSet = data;
      } else {
        this.$message.error(result.msg);
      }
    }, err => {
      this.tableConfig.isLoading = false;
    });
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
   * 设置设施类型下拉款选项
   */
  setSelectOption() {
    this.selectOption = this.workOrderStatusListArr.filter(item => {
      return item.value === WORK_ORDER_STATUS.completed || item.value === WORK_ORDER_STATUS.singleBack;
    });
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
   * 根据ID跳转
   */
  getId() {
    if (this.$active.snapshot.queryParams.id) {
      const workOrderId = this.$active.snapshot.queryParams.id;
      this.queryCondition.bizCondition.procIds = [workOrderId];
    }
  }

  /**
   * 导出
   */
  handleExport(event) {
    this.createExportParams(event);
    this.$clearBarrierService.exportHistoryWorkOrder(this.exportParams).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
    });
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
      primaryKey: '06-2-2',
      showSearchSwitch: true,
      showSizeChanger: true,
      showSearchExport: true,
      outHeight: 96,
      scroll: {x: '1800px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          // 工单名称
          title: this.workOrderLanguage.name, key: 'title', width: 150,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
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
        {  // 实际完工时间
          title: this.workOrderLanguage.realCompleteTime, key: 'realityCompletedTime', width: 180,
          configurable: true,
          isShowSort: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        /*{
          // 期望完工时间
          title: this.workOrderLanguage.expectedCompleteTime, key: 'expectedCompletedTime', width: 180,
          configurable: true,
          isShowSort: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },*/
        {
          // 关联告警
          title: this.workOrderLanguage.relevance + this.workOrderLanguage.alarm + '/' + this.workOrderLanguage.fault,
          key: 'refAlarmFaultName', width: 120,
          configurable: true,
          type: 'render',
          renderTemplate: this.refAlarmTemp,
          isShowSort: true,
          searchable: true,
          searchKey: 'refAlarmCodes',
          searchConfig: {type: 'select', selectType: 'multiple'}
        },
        {
          // 设施类型
          title: this.workOrderLanguage.deviceType, key: 'deviceTypeName', width: 120,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'deviceType',
          sortKey: 'deviceType',
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.facilityTypeListArr}
        },
        {
          // 设施名称
          title: this.workOrderLanguage.deviceName, key: 'deviceName', width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.deviceNameSearch},
        },
        {
          // 设施区域
          title: this.workOrderLanguage.deviceArea, key: 'deviceAreaName', width: 120,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.areaSearch},
        },
        {// 设备名称
          title: this.workOrderLanguage.equipmentName, key: 'equipmentName', width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'equipmentName',
          searchConfig: {type: 'input'}
        },
        {// 设备类型
          title: this.workOrderLanguage.equipmentType, key: 'equipmentType', width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'equipmentType',
          searchConfig: {type: 'input'}
        },
        /*{
          // 创建时间
          title: this.workOrderLanguage.createTime, key: 'createTime', width: 180,
          configurable: true,
          isShowSort: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },*/
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
          searchKey: 'assignName',
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.roleArr}
        },
        /*{// 退单原因
          title: this.workOrderLanguage.singleBackReason, key: 'singleBackReason', width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'singleBackReason',
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.singleBackReasonListArr}
        },
        {// 故障原因
          title: this.workOrderLanguage.errorReason, key: 'errorReason', width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'errorReason',
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.errorReasonListArr}
        },
        {// 处理方案
          title: this.workOrderLanguage.processingScheme, key: 'concatProcessingScheme', width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'concatProcessingSchemes',
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.processingSchemeListArr}
        },
        {
          title: this.workOrderLanguage.remark, key: 'remark', width: 200,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },*/

        {
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 80, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [
        { // 重新生成
          text: this.commonLanguage.rebuild,
          key: 'isShowTurnBackConfirmIcon',
          className: 'fiLink-turn-back-confirm',
          needConfirm: true,
          permissionCode: '06-2-1-1-1',
          confirmContent: this.workOrderLanguage.turnBackConfirmContent,
          handle: (currentIndex) => {
            const id = currentIndex.procId;
            this.$router.navigate(['business/work-order/clear-barrier/unfinished-detail/rebuild'], {queryParams: {id}}).then();
          }
        },
        {  // 图片
          text: this.commonLanguage.viewPhoto,
          className: 'fiLink-view-photo',
          permissionCode: '06-2-2-1',
          handle: (currentIndex) => {
            // this.mapVisible = true;
            this.getPicUrlByAlarmIdAndDeviceId(currentIndex.procId, currentIndex.deviceId);
          }
        },
        {
          // 详情
          text: this.commonLanguage.writeOffOrderDetail,
          className: 'fiLink-view-detail',
          handle: (currentIndex) => {
            this.$router.navigate(['business/work-order/clear-barrier/unfinished-detail/view'], {queryParams: {id: currentIndex.procId, type: 'finished'}}).then();
          }
        },
      ],
      sort: (event: SortCondition) => {
        this.handleSort(event);
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
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      handleExport: (event) => {
        this.exportParams.columnInfoList = event.columnInfoList;
        this.exportParams.columnInfoList.forEach(item => {
          if (item.propertyName === 'status') {
            item.isTranslation = 1;
          }
          if (item.propertyName === 'deviceTypeName') {
            item.propertyName = 'deviceType';
            item.isTranslation = 1;
          }
          if (item.propertyName === 'realityCompletedTime') {
            item.propertyName = 'realityCompletedTime';
            item.isTranslation = 1;
          }
          if (item.propertyName === 'equipmentType') {
            item.propertyName = 'equipmentType';
            item.isTranslation = 1;
          }
        });
        this.handleExport(event);
      }
    };
  }

  /**
   * 区域展示
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
}
