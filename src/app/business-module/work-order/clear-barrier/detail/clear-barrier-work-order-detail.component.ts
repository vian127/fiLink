import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {AbstractControl, FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {Result} from '../../../../shared-module/entity/result';
import {ClearBarrierService} from '../../../../core-module/api-service/work-order/clear-barrier';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {ResultCode, WorkOrderConfig} from '../../work-order.config';
import {FormLanguageInterface} from '../../../../../assets/i18n/form/form.language.interface';
import {ClearBarrierWorkOrder} from '../../../../core-module/model/work-order/clear-barrier-work-order';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {PageCondition, QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {AlarmService} from '../../../../core-module/api-service/alarm';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {differenceInCalendarDays} from 'date-fns';
import {CONST_NUMBER} from '../../../../shared-module/const/work-order';
import {getAlarmType} from '../../../facility/share/const/facility.config';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {UserService} from '../../../../core-module/api-service/user/user-manage';
import {FacilityUtilService} from '../../../facility';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ClearBarrierWorkOrderModel} from '../../model/clear-barrier-model/clear-barrier-work-order.model';

/**
 * 新增和编辑销账工单
 */
@Component({
  selector: 'app-clear-barrier-work-order-detail',
  templateUrl: './clear-barrier-work-order-detail.component.html',
  styleUrls: ['./clear-barrier-work-order-detail.component.scss']
})
export class ClearBarrierWorkOrderDetailComponent extends WorkOrderConfig implements OnInit {
  // 单位模板
  @ViewChild('accountabilityUnit') accountabilityUnit: TemplateRef<any>;
  // 关联告警
  @ViewChild('alarmTemp') alarmTemp: TemplateRef<any>;
  // 告警选择
  @ViewChild('alarmSelectorModalTemp') alarmSelectorModalTemp: TemplateRef<any>;
  @ViewChild('selectorModalTemp') selectorModalTemp: TemplateRef<any>;
  // 单选
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // 完成时间选择模板
  @ViewChild('ecTimeTemp') ecTimeTemp: TemplateRef<any>;
  // 开始时间选择模板
  @ViewChild('startTime') startTime: TemplateRef<any>;
  // 状态模板
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  // 单位选择
  @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  // 国际化
  public formLanguage: FormLanguageInterface;
  public alarmLanguage: AlarmLanguageInterface;
  public unitDisabled: boolean;
  public alarmDisabled: boolean;
  // 单位
  public accountabilityUnitList = [];
  // 全选
  public isAllChecked = false;
  public isIndeterminate = false;
  public isLoading = false;
  private selectedAccountabilityUnitIdList = [];
  //  设施类型下拉框
  public selectOption;
  // 列表数据
  public _dataSet = [];
  // 分页
  public pageBean: PageBean = new PageBean(10, 1, 0);
  // 表格配置
  public tableConfig: TableConfig;
  // 查询参数
  public queryCondition: QueryCondition;
  // 表单
  public formColumn: FormItem[] = [];
  public formStatus: FormOperate;
  // 页面标题
  public pageTitle;
  // 页面类型
  public pageType = '';
  // 单位名称
  public selectUnitName = '';
  // 告警
  public alarmName = '';
  public params: ClearBarrierWorkOrder = new ClearBarrierWorkOrder();
  public selectedAlarm: any;
  public _selectedAlarm;
  public selectedAlarmId = null;
  public workOrderId;
  // 表单状态  如果是编辑    1为重新生成 2为待指派 0为其他状态
  public updateStatus;
  private constNumber;
  // 按钮显示
  public isShowBtn: boolean;
  public unitRadioValue: '';
  public selectData: {
    checked: false
    label: '',
    value: ''
  };
  // 树选择器配置
  public treeSelectorConfig: TreeSelectorConfig;
  public treeSetting;
  // 树节点
  public treeNodes = [];
  // 过滤条件
  private filterValue: any;
  // 显示隐藏
  public isVisible: boolean = false;
  constructor(
    public $nzI18n: NzI18nService,
    private $activatedRoute: ActivatedRoute,
    private $router: Router,
    private $modal: NzModalService,
    private $clearBarrierService: ClearBarrierService,
    private $alarmService: AlarmService,
    private $message: FiLinkModalService,
    private $ruleUtil: RuleUtil,
    private $facilityUtilService: FacilityUtilService,
    private $userService: UserService,
  ) {
    super($nzI18n);
  }

  ngOnInit() {
    this.constNumber = CONST_NUMBER;
    this.formLanguage = this.$nzI18n.getLocaleData('form');
    this.alarmLanguage = this.$nzI18n.getLocaleData('alarm');
    this.procType = 'clear_failure';
    this.pageType = this.$activatedRoute.snapshot.url[1].path;
    this.pageTitle = this.getPageTitle(this.pageType);
    this.workOrderTypeListArr = this.workOrderTypeListArr.filter(item => item.value === 'clear_failure');
    this.isShowBtn = true;
    if (this.pageType === 'add') {
    } else {
      this.workOrderId = this.$activatedRoute.snapshot.queryParams.id;
      this.getWorkOrderDetail();
    }
    this.initColumn();
    // this.initTableConfig();
    this.setSelectOption();
    this.initTreeSelectorConfig();
  }

  /**
   * 获取标题
   * param type
   * returns {string}
   */
  private getPageTitle(type): string {
    let title;
    switch (type) {
      case 'add':
        title = this.workOrderLanguage.addClearBarrierWorkOrder;
        break;
      case 'update':
        title = this.workOrderLanguage.modifyClearBarrierWorkOrder;
        break;
      case 'view':
        title = this.workOrderLanguage.viewClearBarrierWorkOrder;
        this.isShowBtn = false;
        break;
      case 'rebuild':
        title = '重新生成工单';
        break;
    }
    return title;
  }

  /**
   * 返回
   */
  goBack() {
    // this.$router.navigate(['/business/work-order/clear-barrier/unfinished']).then();
    window.history.back();
  }

  formInstance(event) {
    this.formStatus = event.instance;
  }

  /**
   * 打开部门选择modal
   */
  showSelectorModal() {
    if (this.unitDisabled) {
      return;
    }
    if (!this.selectedAlarmId) {     // 先选告警
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
    // this.selectUnitName = this.accountabilityUnitList.filter(item => item.checked).map(item => item.label).join(',');
    this.accountabilityUnitList.forEach(v => {
      if (v.value === this.unitRadioValue) {
        this.selectUnitName = v.label;
        this.formStatus.resetControlData('accountabilityDept', v.label);
        this.selectData = v;
      }
    });
    modal.destroy();
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
   * 表单提交按钮检查
   */
  confirmButtonIsGray() {
    if (this.pageType === 'add' && this.formStatus.getValid()) {
      return true;
    } else {
      // if(this.formStatus.group.controls)
      // if (this.formStatus.group.controls['title'].valid && this.formStatus.group.controls['ectime'].valid
      //   && this.formStatus.group.controls['remark'].valid && this.formStatus.group.controls['refAlarm'].valid) {
      //   return true;
      // } else {
      //   return false;
      // }
    }
  }

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
   * 告警选择modal
   */
  showAlarmSelectorModal() {
    this.initTableConfig();
    this.refAlarmList();
    this.queryCondition = new QueryCondition();
    this.resetPageCondition();
    // if(this._selectedAlarm&&)
    if (this.unitDisabled) {
      return;
    }
    const modal = this.$modal.create({
      nzTitle: this.workOrderLanguage.refAlarm,
      nzContent: this.alarmSelectorModalTemp,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzMaskClosable: false,
      nzWidth: 1000,
      nzFooter: [
        {
          label: this.commonLanguage.confirm,
          onClick: () => {
            this.selectAlarm(modal);
          }
        },
        {
          label: this.commonLanguage.cancel,
          type: 'danger',
          onClick: () => {
            this._dataSet = [];
            modal.destroy();
          }
        },
      ],
    });
    modal.afterOpen.subscribe(() => {
      this.refreshData();
    });
  }

  pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 选择告警     只能选单条
   * param modal
   */
  selectAlarm(modal) {
      if (this._selectedAlarm) {
        this.selectedAlarm = CommonUtil.deepClone(this._selectedAlarm);
        this.selectedAlarmId = this.selectedAlarm['id'];
        this.selectUnitName = null;
        this.selectedAccountabilityUnitIdList = [];
        this.accountabilityUnitList = [];
        this.isAllChecked = false;
        this.alarmName = this.selectedAlarm['alarmName'];
        this.formStatus.resetControlData('refAlarm', this.alarmName);
        this.formStatus.resetControlData('equipmentName', this.selectedAlarm.alarmObject);
        this.formStatus.resetControlData('deviceName', this.selectedAlarm.alarmDeviceName);
        modal.destroy();
      } else {
        this.alarmName = this.selectedAlarm['alarmName'];
        this.formStatus.resetControlData('refAlarm', this.selectedAlarm);
        this.$message.warning(this.workOrderLanguage.alarmSelectedError);
      }
  }

  /**
   * 选择告警
   * param event
   * param data
   */
  selectedAlarmChange(event, data) {
    this._selectedAlarm = data;
  }

  /**
   * 获取当前告警
   */
  refreshData() {
    this.tableConfig.isLoading = true;
    this.$clearBarrierService.getRefAlarmInfo(this.queryCondition).subscribe((res: ResultModel<ClearBarrierWorkOrderModel[]>) => {
      this.pageBean.Total = res.totalCount;
      this.tableConfig.isLoading = false;
      this._dataSet = res.data;
      /*this._dataSet.forEach(item => {
        item.deviceTypeName = this.getFacilityTypeName(item.alarmSourceTypeId);
        item.alarmName = getAlarmType(this.$nzI18n, item.alarmCode);
      });*/
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 获取工单详情
   */
  getWorkOrderDetail() {
    this.$clearBarrierService.getWorkOrderDetail(this.workOrderId).subscribe((result: ResultModel<ClearBarrierWorkOrderModel>) => {
      if (result.code === ResultCode.successCode) {
        // this.setWorkOrderData(result.data);
        if (result.data.status === 'assigned') {
          this.updateStatus = this.constNumber.TWO;
        } else if (result.data.status === 'singleBack') {
          this.updateStatus = this.constNumber.ONE;
        } else {
          this.updateStatus = this.constNumber.THREE;
          this.unitDisabled = true;
          this.alarmDisabled = true;
          this.formStatus.group.controls['title'].disable();
          this.formStatus.group.controls['ecTime'].disable();
          this.formStatus.group.controls['supplies'].disable();
        }
        if (this.pageType === 'view') {
          this.isShowBtn = false;
          this.updateStatus = this.constNumber.TWO;
          this.unitDisabled = true;
          this.alarmDisabled = true;
          this.formStatus.group.controls['title'].disable();
          this.formStatus.group.controls['ecTime'].disable();
          this.formStatus.group.controls['supplies'].disable();
          this.formStatus.group.controls['remark'].disable();
        }
        this.setWorkOrderData(result.data);
      }
    }, () => {
    });
  }

  /**
   * 设置数据
   * param data
   */
  setWorkOrderData(data) {
    this.selectedAlarmId = data.refAlarm;
    this.alarmName = data.refAlarmName;
    if (data.procRelatedDepartments) {
      this.selectedAccountabilityUnitIdList = data.procRelatedDepartments.map(item => item.accountabilityDept);
    }
    this.unitRadioValue = data.accountabilityDept;
    this.selectUnitName = data.accountabilityDeptName;
    this.formStatus.resetControlData('title', data['title']);
    this.formStatus.resetControlData('refAlarm', this.selectedAlarm);
    this.formStatus.resetControlData('remark', data['remark']);
    this.formStatus.resetControlData('supplies', data['materiel'][0].materielName);
    /*if (data['ecTime']) {
      this.formStatus.resetControlData('ecTime', new Date(CommonUtil.convertTime(data['ecTime'])));
    }*/
    if (data['expectedCompletedTime']) {
      this.formStatus.resetControlData('ecTime', new Date(CommonUtil.convertTime(data['expectedCompletedTime'])));
    }
    this.selectedAlarm = {
      alarmName: data.refAlarmName,
      alarmSource: data.deviceId,
      alarmSourceTypeId: data.deviceType,
      alarmObject: data.deviceName,
      areaId: data.deviceAreaId,
      areaName: data.deviceAreaName,
      id: data.refAlarm,
      alarmCode: data.refAlarmCode,
      procId: data.procId
    };
  }

  /**
   * 提交
   */
  submit() {
    this.isLoading = true;
    const data = this.setSubmitData();
    const methodName = this.pageType === 'add' ? 'addWorkOrder' : 'updateWorkOrder';
    if (this.formStatus.group.controls.ecTime.value
      && CommonUtil.sendBackEndTime(new Date(this.formStatus.group.controls.ecTime.value).getTime()) < new Date().getTime()
      && (this.updateStatus !== 0 && this.formStatus.group.dirty)) {
      this.$message.warning(this.commonLanguage.expectCompleteTimeMoreThanNowTime);
      this.isLoading = false;
      // this.setWorkOrderData(result.data);
      return null;
    } else {
      if (this.updateStatus === this.constNumber.ONE) {
        data['regenerateId'] = data['procId'];
        data['procId'] = null;
        this.$clearBarrierService.RefundGeneratedAgain(data).subscribe((result: Result) => {
          if (result.code === ResultCode.successCode) {
            this.$router.navigate(['/business/work-order/clear-barrier/unfinished-list']).then();
            if (this.pageType !== 'add') {
              this.$message.success(this.workOrderLanguage.regeneratedSuccessful);
            }
          } else {
            this.isLoading = false;
            this.$message.error(result.msg);
          }
        });
      } else {
        this.$clearBarrierService[methodName](data).subscribe((result: Result) => {
          if (result.code === ResultCode.successCode) {
            this.$router.navigate(['/business/work-order/clear-barrier/unfinished-list']).then();
            if (this.pageType !== 'add') {
              this.$message.success(result.msg);
            }
          } else {
            this.isLoading = false;
            this.$message.error(result.msg);
          }
        }, () => {
          this.isLoading = false;
        });
      }
    }

  }

  /**
   * 设置提交数据
   */
  setSubmitData() {
    const formData = this.formStatus.group.getRawValue();
    /*const ids = this.selectedAccountabilityUnitIdList.map(item => {
      return {accountabilityDept: item};
    });*/
    const data = {
      'title': formData.title,
      'refAlarm': this.selectedAlarmId,
      'refAlarmName': this.alarmName,
      'materiel': [{'materielId': '', 'materielName': formData.supplies, 'materielCode': ''}],
      'deviceId': this.selectedAlarm['alarmSource'],
      'deviceName': this.selectedAlarm['alarmObject'],
      'deviceType': this.selectedAlarm['alarmSourceTypeId'],
      'deviceAreaId': this.selectedAlarm['areaId'],
      'deviceAreaName': this.selectedAlarm['areaName'],
      // 'accountabilityDeptList': ids,
      'remark': formData.remark,
      'refAlarmCode': this.selectedAlarm['alarmCode'],
      'accountabilityDept': this.unitRadioValue,
      'accountabilityDeptName': this.selectUnitName,
      'equipment': [
        {
          'deviceId': this.selectedAlarm['alarmSource'],
          'equipmentId': CommonUtil.getUUid(),
          'equipmentName': CommonUtil.getUUid(),
          'equipmentType': CommonUtil.getUUid(),
        }
      ],
      'procResourceType': '1'
    };
    if (formData.ecTime) {
      data['ecTime'] = CommonUtil.sendBackEndTime(new Date(formData.ecTime).getTime());
      data['expectedCompletedTime'] = CommonUtil.sendBackEndTime(new Date(formData.ecTime).getTime());
    }
    if (this.pageType !== 'add') {
      data['procId'] = this.workOrderId;
    }
    return data;
  }

  /**
   * form配置
   */
  private initColumn() {
    this.formColumn = [
      {  // 工单名称
        label: this.workOrderLanguage.name,
        key: 'title',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [],
      },
      { // 工单类型
        label: this.workOrderLanguage.type, key: 'procType', type: 'input',
        disabled: true,
        initialValue: this.workOrderTypeListArr[0].label, rule: []
      },
      {  // 关联告警
        label: this.workOrderLanguage.relevancyAlarm, key: 'refAlarm', type: 'custom',
        require: true,
        template: this.alarmTemp,
        modelChange: (controls, $event, key) => {
        },
        rule: [{required: true}], asyncRules: []
      },
      {  // 设施
        label: this.workOrderLanguage.deviceName,
        key: 'deviceName',
        type: 'input', placeholder: '',
        disabled: true,
        rule: []
      },
      {  // 设备
        label: this.workOrderLanguage.equipmentName,
        key: 'equipmentName',
        type: 'input', placeholder: '',
        disabled: true,
        rule: []
      },
      {  // 物料
        label: this.workOrderLanguage.supplies,
        key: 'supplies',
        type: 'input',
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      { // 责任单位
        label: this.workOrderLanguage.accountabilityUnitName, key: 'accountabilityDept', type: 'custom',
        template: this.accountabilityUnit,
        modelChange: (controls, $event, key) => {
        },
        openChange: (a, b, c) => {

        },
        rule: [], asyncRules: []
      },
      { // 期望完工时间
        label: this.workOrderLanguage.expectedCompleteTime,
        key: 'ecTime',
        type: 'custom',
        // type: 'time-picker',
        template: this.ecTimeTemp,
        require: true,
        rule: [{required: true}],
        customRules: [{
          code: 'isTime', msg: null, validator: (control: AbstractControl): { [key: string]: boolean } => {
            if (control.value && CommonUtil.sendBackEndTime(new Date(control.value).getTime()) < new Date().getTime()) {
              if (this.formStatus.group.controls['ecTime'].dirty) {
                this.$message.info(this.commonLanguage.expectCompleteTimeMoreThanNowTime);
                return {isTime: true};
              }
            } else {
              return null;
            }
          }
        }]
      },
      {  // 备注
        label: this.workOrderLanguage.remark, key: 'remark', type: 'input',
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }

  /**
   * 日期禁用
   */
  disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) < 0 || CommonUtil.checkTimeOver(current);
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
        return {value: item.alarmName, label: item.alarmName};
      });
      // this.tableConfig.columnConfig[0]['searchConfig']['selectInfo'] = this.selectOption;
      this.tableConfig.columnConfig.forEach(item => {
        if (item.searchKey === 'alarmName') {
          item['searchConfig']['selectInfo'] = arr;
        }
      });
    });
  }

  /**
   * 关联告警选择table配置
   */
  initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: false,
      notShowPrint: true,
      noIndex: true,
      simplePage: true,
      scroll: {x: '650px', y: '600px'},
      columnConfig: [
        {
          title: '',
          type: 'render',
          key: 'selectedAlarmId',
          renderTemplate: this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 42
        },
        {  // 告警名称
          title: this.alarmLanguage.alarmName, key: 'alarmName', width: 150,
          searchable: true,
          searchKey: 'alarmName',
          isShowSort: true,
          searchConfig: {type: 'select', selectType: 'multiple'}
        },
        {  // 工单状态
          title: this.workOrderLanguage.status, key: 'status', width: 120,
          searchable: true,
          searchKey: 'status',
          isShowSort: true,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.selectOption},
          type: 'render',
          renderTemplate: this.statusTemp,
        },
        { // 告警对象
          title: this.alarmLanguage.alarmobject, key: 'alarmObject', width: 108,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {  // 区域
          title: this.alarmLanguage.areaName, key: 'areaName', width: 108,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          // 责任单位
          title: this.workOrderLanguage.accountabilityUnitName, key: 'responsibleDepartment', width: 120,
          searchable: true,
          /*searchConfig: {type: 'render', renderTemplate: this.UnitNameSearch}*/
          searchConfig: {type: 'input'}
        },
        { // 设施类型
          title: this.alarmLanguage.alarmSourceType, key: 'deviceTypeName', width: 108,
          searchable: true,
          searchKey: 'alarmSourceTypeId',
          isShowSort: true,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.facilityTypeListArr}
        },
        {
          // 频次
          title: this.workOrderLanguage.frequency, key: 'alarmHappenCount', width: 90,
          searchable: true,
          isShowSort: true,
          searchKey: 'alarmHappenCount',
          searchConfig: {type: 'input'}
        },
        /*{ // 首次发生时间
          title: this.alarmLanguage.alarmBeginTime, key: 'alarmBeginTime', pipe: 'date', width: 163,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'dateRang'}
        },
        {  // 最近发生时间
          title: this.alarmLanguage.alarmNearTime, key: 'alarmNearTime', pipe: 'date',
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'dateRang'}
        },*/
        {
          title: '', searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 75, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event) => {
        this.queryCondition.filterConditions = event;
        this.refreshData();
      }
    };
  }
  /**
   * 设置类型下拉选项
   */
  setSelectOption() {
    this.selectOption = this.workOrderStatusListArr.filter(item => {
      // 未确认的已退单的工单也会出现在未完工列表
      return item.value !== 'completed';
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
}
