import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {FormOperate} from '../../../../../shared-module/component/form/form-opearte.service';
import { FaultLanguageInterface } from '../../../../../../assets/i18n/fault/fault-language.interface';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {getDesignateReason, getDesignateType} from '../../../model/const/trouble.config';
import {TreeSelectorConfig} from '../../../../../shared-module/entity/treeSelectorConfig';
import {UserUtilService} from '../../../../user/user-util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import {TroubleService} from '../../../../../core-module/api-service/trouble/trouble-manage';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {TroubleModel} from '../../../model/trouble.model';
import {HandelStatusList, AssignTypeList, TroubleFlow, AssignReason} from '../../../model/const/trouble-process.const';
@Component({
  selector: 'app-trouble-assign',
  templateUrl: './trouble-assign.component.html',
  styleUrls: ['./trouble-assign.component.scss'],
  providers: [UserUtilService]
})
export class TroubleAssignComponent implements OnInit {
  // 责任单位
  @ViewChild('department') private department;
  // 责任人
  @ViewChild('departNameTemp') private departNameTemp;
  // 标题
  public pageTitle: string = '';
  // 详情id
  public troubleId: string;
  // 流程节点
  public flowId: string;
  // 故障状态
  public handleStatus: string;
  // 流程实例id
  public instanceId: string;
  // 流程节点名称
  public currentHandleProgress: string;
  // 用户信息
  public userInfo: any = {};
  // 用户id
  public userId: string = '';
  // 告警国际化引用
  public language: FaultLanguageInterface;
  public formColumn: FormItem[] = [];
  // 表单操作
  public formStatus: FormOperate;
  // 单位选择器配置信息
  public unitSelectorConfig: any = new TreeSelectorConfig();
  // 责任单位选择器
  public selectorData: any = {parentId: '', accountabilityUnit: ''};
  // 单位选择节点
  private areaNodes: any = [];
  // 责任人选择器配置信息
  public personSelectorConfig: any = new TreeSelectorConfig();
  // 责任人选择器
  public selectorPersonData: any = {parentId: '', accountabilityUnit: ''};
  // 单位弹窗展示
  public unitSelectVisible: boolean = false;
  // 单位名称
  public assignDeptName = '';
  // 责任人弹窗展示
  public isPersonVisible: boolean = false;
  // 责任人
  public assignUserName: string = '';
  // 下拉树设置
  private treeSetting: any;
  // 责任人选择节点
  public treeNodes: any = [];
  // 责任单位和责任人可选
  public isDisable: boolean = false;
  // 指派类型
  public assignType = '';
  // 指派原因
  public assignReason = '';
  // 其他原因
  public otherReason = '';
  public ifSpin: boolean = false;
  constructor(
    public $nzI18n: NzI18nService,
    private $userUtilService: UserUtilService,
    public $router: Router,
    public $active: ActivatedRoute,
    private $modalService: FiLinkModalService,
    public $troubleService: TroubleService,
    public $message: FiLinkModalService,
  ) {
    this.language = this.$nzI18n.getLocaleData('fault');
  }

  ngOnInit() {
    this.pageTitle = this.language.troubleDesignate;
    this.$active.queryParams.subscribe(params => {
      this.troubleId = params.id;
      this.flowId = params.flowId;
      this.handleStatus = params.handleStatus;
      this.instanceId = params.instanceId;
      this.currentHandleProgress = params.handleProgress;
    });
    // 获取用户信息
    if (SessionUtil.getToken()) {
      this.userInfo = SessionUtil.getUserInfo();
      this.userId = this.userInfo['id'];
    }
    // 根据流程节点获取责任单位  节点5获取同级及上级单位
    this.getDepartment(this.flowId);
    // 初始化责任人下拉树
    this.initTreeSelectorConfig();
  }

  /**
   * 根据节点获取单位数据
   */
  getDepartment(flowId) {
    this.ifSpin = true;
    if (flowId === TroubleFlow.FIVE) {
      // 获取当级单位的上级单位 ljurcbpnjFYWNefXuwx
      this.$troubleService.getSuperiorDepartment(this.userId).subscribe((data: NzTreeNode[]) => {
        this.ifSpin = false;
        this.areaNodes = data['data'] || [];
        // // 初始化责任单位
        this.initAreaSelectorConfig(data['data']);
        this.initForm();
      });
    } else {
      this.$userUtilService.getDept().then((data: NzTreeNode[]) => {
        this.ifSpin = false;
        this.areaNodes = data || [];
        // 初始化责任单位
        this.initAreaSelectorConfig(data);
        this.initForm();
      });
    }
  }

  /**
   * 获取责任人数据
   */
  getDutyData(id) {
    // 单位id 008Utxxm82jk1BfJRfa
    this.$troubleService.queryDepartName(id).subscribe((data: NzTreeNode[]) => {
      this.treeNodes = data['data'] || [];
      // 初始化责任人
      this.initAreaSelectorConfig(data['data']);
    });
  }
  /**
   * 根据流程展示对应的指派类型
   * @param flowId:流程节点 handleStatus: 故障状态
   */
  getAssign(handleStatus, flowId, superiorDept) {
    // 故障状态
    const assignData = getDesignateType(this.$nzI18n);
    const assignReasonData = getDesignateReason(this.$nzI18n);
    const assignList = {
      assignTypeList: [],
      assignReasonList: []
    };
    if (typeof assignData !== 'string') {
      assignList.assignTypeList = assignData.filter(item => {
        if (handleStatus === HandelStatusList.unCommit) {
            // return item.code === '0';
          return item.code === AssignTypeList.initial;
        } else if (handleStatus === HandelStatusList.commit && flowId === TroubleFlow.FIVE) {
          if (superiorDept.length > 0) {
            // return item.code === '1' || item.code === '2';
            return item.code === AssignTypeList.duty || item.code === AssignTypeList.reportResponsibleLeaders;
          } else {
            // return item.code === '3';
            return item.code === AssignTypeList.troubleRepulse;
          }
        } else if (handleStatus === HandelStatusList.processing) {
          if (flowId === TroubleFlow.SEVEN) {
            // return item.code === '4' || item.code === '6';
            return item.code === AssignTypeList.coordinateSuccessful || item.code === AssignTypeList.coordinateFailChargeback;
          } else if (flowId === TroubleFlow.EIGHT) {
            // return item.code === '2'
            return item.code === AssignTypeList.reportResponsibleLeaders;
          } else {
            // return item.code === '4' || item.code === '5';
            return item.code === AssignTypeList.coordinateSuccessful || item.code === AssignTypeList.coordinateFailConstraint;
          }
        } else {
          // return item.code !== '0';
          return item.code !== AssignTypeList.initial;
        }
      });
    }
    if (typeof assignReasonData !== 'string') {
      assignList.assignReasonList = assignReasonData.filter(item => {
        if (handleStatus === HandelStatusList.unCommit) {
          return item.code === AssignReason.initial;
        } else {
          return item.code !== AssignReason.initial;
        }
      });
    }
    return assignList;
  }
  /**
   * 打开单位选择器
   */
  showAreaSelectorModal() {
    this.unitSelectorConfig.treeNodes = this.areaNodes;
    this.unitSelectVisible = true;
  }
  /**
   * 单位选中结果
   * param event
   */
  unitSelectChange(event) {
    if (event[0]) {
      this.$userUtilService.setAreaNodesStatus(this.areaNodes, event[0].id);
      this.assignDeptName = event[0].deptName;
      this.selectorData.parentId = event[0].id;
      this.formStatus.resetControlData('assignDeptId', event[0].id);
      // 获取责任人
      this.getDutyData(this.selectorData.parentId);
    } else {
      this.$userUtilService.setAreaNodesStatus(this.areaNodes, null);
      this.assignDeptName = '';
      this.selectorData.parentId = null;
      this.formStatus.resetControlData('assignDeptId', null);
    }
    this.assignUserName = '';
    this.selectorPersonData.parentId = null;
  }
  /**
   * 责任人选中结果
   */
  selectDataChange(event) {
    if (event[0]) {
      this.$userUtilService.setAreaNodesStatus([this.treeNodes], event[0].id);
      this.assignUserName = event[0].deptName;
      this.selectorPersonData.parentId = event[0].id;
      this.formStatus.resetControlData('assignUserId', event[0].id);
    } else {
      this.$userUtilService.setAreaNodesStatus(this.treeNodes, null);
      this.assignUserName = '';
      this.selectorPersonData.parentId = null;
      this.formStatus.resetControlData('assignUserId', null);
    }
  }
  /**
   * 指派
   */
  submit() {
    // this.isLoading = true;
    const assignData = this.formStatus.getData();
    assignData.troubleId = this.troubleId;
    assignData.assignDeptName = this.assignDeptName;
    assignData.assignUserName = this.assignUserName;
    assignData.instanceId = this.instanceId;
    assignData.currentHandleProgress = this.currentHandleProgress;
    assignData.progessNodeId = this.flowId;
    this.$troubleService.troubleAssign(assignData).subscribe((res: ResultModel<TroubleModel>) => {
      if (res.code === 0) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    });
  }
  /**
   * 表单初始化
   */
  formInstance(event) {
    this.formStatus = event.instance;
  }
  /**
   * 取消
   */
  cancel() {
    window.history.back();
  }
  // 指派
  public initForm() {
    const assignData = this.getAssign(this.handleStatus, this.flowId, this.areaNodes);
    this.formColumn = [
      {
        // 指派类型
        label: this.language.designateType,
        key: 'assignType',
        require: true,
        col: 20,
        type: 'select',
        selectInfo: {
          data: assignData.assignTypeList,
          // data: assignData,
          label: 'label',
          value: 'code',
        },
        rule: [{required: true}],
        modelChange: (controls, event, key, formOperate) => {
          if (event === AssignTypeList.troubleRepulse) {
            this.isDisable = true;
            this.formColumn.forEach(item => {
              if (item.key === 'assignDeptId' || item.key === 'person') {
                  item.require = false;
              }
            });
          } else {
            this.isDisable = false;
            this.formColumn.forEach(item => {
                item.require = true;
            });
          }
          this.assignType = event;
        }
      },
      {
        // 责任单位
        label: this.language.responsibleUnit,
        key: 'assignDeptId',
        type: 'custom',
        require: true,
        rule: [],
        asyncRules: [],
        template: this.department
      },
      { // 责任人
        label: this.language.person,
        key: 'assignUserId',
        type: 'custom',
        require: true,
        rule: [],
        asyncRules: [],
        template: this.departNameTemp
      },
      { // 指派原因
        label: this.language.designateReason,
        key: 'assignReason',
        require: true,
        col: 18,
        type: 'select',
        selectInfo: {
          data: assignData.assignReasonList,
          label: 'label',
          value: 'code',
        },
        rule: [{required: true}],
        modelChange: (controls, event, key, formOperate) => {
          if (event === '3') {
              this.setFormItem(this.formColumn, 'otherReason', false);
          } else {
            this.setFormItem(this.formColumn, 'otherReason', true);
          }
          this.assignReason = event;
        }
      }, { // 其他
        label: this.language.otherReason, key: 'otherReason',
        type: 'input', require: true,
        col: 24,
        hidden: false,
        modelChange: (controls, $event, key) => {
          this.otherReason = $event;
        },
        openChange: (a, b, c) => {
        },
        rule: [], asyncRules: []
      }
    ];
    this.setFormItem(this.formColumn, 'otherReason', true);
  }

  /**
   * 控制表单某个展示或隐藏
   */
  setFormItem (formList, key, type) {
    if (formList && formList.length > 0) {
      formList.forEach(item => {
        if (item.key === key ) {
          item.hidden = type;
        }
      });
    }
  }

  /**
   * 责任人选择框
   * param nodes
   */
  showDutyNameSelectorModal() {
    if (this.assignDeptName === '') {
      this.isPersonVisible = false;
      this.personSelectorConfig.treeNodes = this.treeNodes;
      this.$modalService.info(this.language.pleaseSelectUnit);
    } else {
        this.personSelectorConfig.treeNodes = this.treeNodes;
        this.isPersonVisible = true;
    }
  }
  /**
   * 初始化单位选择器配置
   * param nodes
   */
  private initAreaSelectorConfig(nodes) {
    this.unitSelectorConfig = {
      width: '500px',
      height: '300px',
      title: this.language.unitSelect,
      treeSetting: {
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
      },
      treeNodes: nodes
    };
  }
  /**
   * 初始化责任人选择器配置
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
    this.personSelectorConfig = {
      title: this.language.person,
      width: '500px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        // {
        //   title: this.facilityLanguage.deptName, key: 'deptName', width: 100,
        // },
        // {
        //   title: this.facilityLanguage.deptLevel, key: 'deptLevel', width: 100,
        // },
        // {
        //   title: this.facilityLanguage.parentDept, key: 'parentDepartmentName', width: 100,
        // }
      ]
    };
  }
  /**
   * 表单提交按钮检查
   */
  confirmButtonIsGray() {
      if (this.assignType) {
        if ( this.assignType === AssignTypeList.troubleRepulse) {
          } else {
              if (this.assignDeptName && this.assignUserName) {
              } else {
                return true;
              }
        }
        if (this.assignReason) {
          if (this.assignReason === AssignReason.other) {
            if (this.otherReason) {
              return false;
            } else {
              return true;
            }
          }
          return false;
        } else {
          return true;
        }
      } else {
          return true;
      }
  }
}
