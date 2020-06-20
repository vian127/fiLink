import {Component, Input, Output, ViewChild, EventEmitter, OnInit} from '@angular/core';
import {FormItem} from '../../form/form-config';
import {FormOperate} from '../../form/form-opearte.service';
import {Result} from '../../../entity/result';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {AlarmService} from '../../../../core-module/api-service/alarm';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {RuleUtil} from '../../../util/rule-util';
import {AbstractControl} from '@angular/forms';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {differenceInCalendarDays} from 'date-fns';
import {CommonUtil} from '../../../util/common-util';
import {UserService} from '../../../../core-module/api-service/user/user-manage';
import {TreeSelectorConfig} from '../../../entity/treeSelectorConfig';
import {FacilityUtilService} from '../../../../business-module/facility';
import {TreeSelectorComponent} from '../../tree-selector/tree-selector.component';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {InspectionService} from '../../../../core-module/api-service/work-order/inspection';

@Component({
  selector: 'app-create-work-order',
  templateUrl: './create-work-order.component.html',
  styleUrls: ['./create-work-order.component.scss']
})
export class CreateWorkOrderComponent implements OnInit {
  formColumn: FormItem[] = [];
  formStatus: FormOperate;
  // 责任单位禁用
  unitDisabled = false;
  // 责任单位显示隐藏
  isVisible = false;
  // 责任单位树配置
  treeSelectorConfig: TreeSelectorConfig;
  // 责任单位树配置
  treeSetting = {};
  // 已选择责任单位名称
  selectUnitName = '';
  // 责任单位数据
  treeNodes = [];
  isLoading: boolean = false;
  display = {
    creationWorkOrder: false
  };
  // 责任单位选择数据
  departmentId;
  // 设施语言包
  public languageuUnit: FacilityLanguageInterface;
  // 工单国际化
  InspectionLanguage: InspectionLanguageInterface;
  ecTimeModel;
  // 创建工单的数据
  _creationWorkOrderData = {};

  public language: AlarmLanguageInterface;
  private firstChange: boolean = true;
  private commonLanguage: CommonLanguageInterface;
  @ViewChild('ecTimeTemp') private ecTimeTemp;
  @ViewChild('accountabilityUnit') private accountabilityUnitTep;
  @ViewChild('unitTreeSelector') private unitTreeSelector: TreeSelectorComponent;

  constructor(public $message: FiLinkModalService,
              public $alarmService: AlarmService,
              public $nzI18n: NzI18nService,
              private $ruleUtil: RuleUtil,
              private $userService: UserService,
              private $facilityUtilService: FacilityUtilService,
              private $inspectionService: InspectionService,) {
    this.language = this.$nzI18n.getLocaleData('alarm');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.languageuUnit = this.$nzI18n.getLocaleData('facility');
    this.InspectionLanguage = this.$nzI18n.getLocaleData('inspection');
  }

  @Input()
  areaId; // 区域Id

  @Input()
  set creationWorkOrderData(creationWorkOrderData) {
    if (creationWorkOrderData) {
      this.initTreeSelectorConfig();
      this._creationWorkOrderData = creationWorkOrderData;
      setTimeout(() => {
        this.display.creationWorkOrder = true;
      }, 0);
      this.initForm();
    }
  }

  @Output() close = new EventEmitter();

  // 关闭弹框
  closePopUp() {
    this.display.creationWorkOrder = false;
    this.close.emit();
  }

  ngOnInit() {
    this.queryDeptList();
  }

  /**
   * 禁用时间
   * param {Date} current
   * returns {boolean}
   */
  disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) < 0 || CommonUtil.checkTimeOver(current);
  };

  // 创建工单表单
  public initForm() {
    this.formColumn = [
      {
        // 工单名称
        label: this.language.workOrderName,
        key: 'createWork',
        type: 'input',
        require: true,
        col: 18,
        // width: 300,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          {maxLength: 32},
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      {
        // 期待完工时长(天)
        label: this.language.lastDays,
        key: 'ecTime',
        type: 'custom',
        template: this.ecTimeTemp,
        require: true,
        customRules: [{
          code: 'isTime', msg: null
          , validator: (control: AbstractControl): { [key: string]: boolean } => {
            if (control.value && CommonUtil.sendBackEndTime(+control.value) < new Date().getTime()) {
              if (this.formStatus.group.controls['ecTime'].dirty) {
                this.$message.info(this.commonLanguage.expectCompleteTimeMoreThanNowTime);
                return {isTime: true};
              }
            } else {
              return null;
            }
          }
        }],
        rule: [{required: true}],
      },
      {
        // 责任单位
        label: this.language.responsibleUnit,
        key: 'accountabilityUnit',
        type: 'custom',
        require: false,
        rule: [],
        asyncRules: [],
        template: this.accountabilityUnitTep
      },
    ];
  }

  // 创建工单弹框
  formInstance(event) {
    this.formStatus = event.instance;
  }

  /**
   * 打开责任单位选择器
   */
  showModal() {
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isVisible = true;
  }

  /**
   * 责任单位选择结果
   * param event
   */
  selectDataChange(event) {
    this.selectUnitName = '';
    const selectArr = event.map(item => {
      this.selectUnitName += `${item.deptName},`;
      return item.id;
    });
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, selectArr);
    this.departmentId = selectArr[0];
  }

  /**
   * 初始化树选择器配置
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
          enable: false,
          idKey: 'id',
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
      title: `${this.language.selectUnit}`,
      width: '500px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: `${this.languageuUnit.deptName}`, key: 'deptName', width: 100,
        },
        {
          title: `${this.languageuUnit.deptLevel}`, key: 'deptLevel', width: 100,
        },
        {
          title: `${this.languageuUnit.parentDept}`, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }


  /**
   * 根据区域ID查询责任单位
   */
  private queryDeptList() {
    return new Promise((resolve, reject) => {
      const id = [this.areaId];
      if (id.length !== 0) {
        this.$inspectionService.queryResponsibilityUnit(id).subscribe((result: Result) => {
          if (result.code === 0) {
            const deptData = result.data || [];
            // const deptData = arrDept.filter(item => {
            //   if (item.hasThisArea === true) {
            //     return item;
            //   }
            // });
            this.treeNodes = deptData;
            resolve(deptData);
          }
        });
      } else {
        this.isVisible = false;
        this.$message.info(`${this.InspectionLanguage.pleaseSelectTheAreaInformationFirstTip}`);
      }
    });
  }

  // 创建工单 点击 确定
  submitWork() {
    const alarmObj = this.formStatus.getData();
    //  期待完工时间 不能小于当前时间
    const time = +new Date();
    if (CommonUtil.sendBackEndTime(+alarmObj.ecTime) < time) {
      this.$message.info(this.commonLanguage.expectCompleteTimeMoreThanNowTime);
      this.ecTimeModel = '';
      this.formStatus.resetControlData('ecTime', null);
    } else {
      const workOrderData = {
        'title': alarmObj.createWork,
        'refAlarm': this._creationWorkOrderData['id'],
        'refAlarmName': this._creationWorkOrderData['alarmName'],
        'refAlarmCode': this._creationWorkOrderData['_alarmCode'],
        'ecTime': CommonUtil.sendBackEndTime(+alarmObj.ecTime),
        'deviceId': this._creationWorkOrderData['alarmSource'],
        'deviceName': this._creationWorkOrderData['alarmObject'],
        'deviceType': this._creationWorkOrderData['alarmSourceTypeId'],
        'deviceAreaId': this._creationWorkOrderData['areaId'],
        'deviceAreaName': this._creationWorkOrderData['areaName'],
        'accountabilityDeptList': [],
        'remark': this._creationWorkOrderData['remark'],
      };
      if (this.departmentId) {
        workOrderData.accountabilityDeptList.push({'accountabilityDept': this.departmentId});
      }
      this.isLoading = true;
      this.$alarmService.addClearFailureProc(workOrderData).subscribe((res: Result) => {
        this.isLoading = false;
        if (res.code === 0) {
          this.closePopUp();
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    }
  }

  // 期待完工时间
  ecTimeOnOk(event) {
    if (event) {
      return;
    }
    this.formStatus.resetControlData('ecTime', this.ecTimeModel);
  }

}
