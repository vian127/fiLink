import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {AreaService} from '../../../../core-module/api-service/facility';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../core-module/api-service/user/user-manage';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {TreeSelectorComponent} from '../../../../shared-module/component/tree-selector/tree-selector.component';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {FacilityUtilService} from '../../share/service/facility-util.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {InspectionService} from '../../../../core-module/api-service/work-order';
import {AlarmService} from '../../../../core-module/api-service/alarm';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';

declare const $: any;
declare const cityData: any;

/**
 * 新增修改区域组件
 */
@Component({
  selector: 'app-area-detail',
  templateUrl: './area-detail.component.html',
  styleUrls: ['./area-detail.component.scss']
})
export class AreaDetailComponent implements OnInit, AfterViewInit {
  // 责任单位模板
  @ViewChild('accountabilityUnit') private accountabilityUnitTep;
  // 责任单位选择器模板
  @ViewChild('unitTreeSelector') private unitTreeSelector: TreeSelectorComponent;
  // 区域选择器模板
  @ViewChild('areaSelector') private areaSelector;
  // 责任单位自定义模板
  @ViewChild('customTemplate') private customTemplate: TemplateRef<any>;
  // 表单配置
  public formColumn: FormItem[] = [];
  // 表单状态
  public formStatus: FormOperate;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 区域信息
  public areaInfo: any = new AreaModel();
  // 区域选择器显示隐藏
  public areaSelectVisible: boolean = false;
  // 责任单位显示隐藏
  public isVisible = false;
  // 责任单位树配置
  public treeSetting = {};
  // 责任单位数据
  public treeNodes = [];
  // 责任单位树配置
  public treeSelectorConfig: TreeSelectorConfig;
  // 区域id
  public areaId = '';
  // 区域详情页面类型
  public pageType = 'add';
  // 区域详细页面title
  public pageTitle: string;
  // 区域选择器树配置
  public areaSelectorConfig: any = new TreeSelectorConfig();
  // 区域选择器数据
  public selectorData: any = {parentId: '', accountabilityUnit: ''};
  // 区域名称
  public areaName = '';
  // 责任单位禁用
  public unitDisabled = false;
  // 区域禁用
  public areaDisabled = false;
  // 按钮是否加载
  public isLoading = false;
  // 页面是否加载
  public pageLoading = false;
  // 已选择责任单位名称
  public selectUnitName: string = '';
  // 城市选择器的值
  public selectCityInfo = {
    cityName: '',
    districtName: '',
    provinceName: ''
  };
  // 城市选择器禁用
  public cityDisabled = false;
  // 责任单位的选择器树回调
  public treeCallback = {
    beforeCheck: async (treeId, treeNode) => {
      if (treeNode.checked) {
        await this.checkIntercept(treeId, treeNode);
      }
    },
    beforeTableCheck: (treeNode) => {
      return this.checkHasWorkOrderOrRule(treeNode);
    }
  };
  // 区域数据
  private areaNodes: any = [];


  constructor(private $nzI18n: NzI18nService,
              private $areaService: AreaService,
              private $active: ActivatedRoute,
              private $modalService: FiLinkModalService,
              private $facilityUtilService: FacilityUtilService,
              private $userService: UserService,
              private $inspectionService: InspectionService,
              private $alarmService: AlarmService,
              private $ruleUtil: RuleUtil,
              private $router: Router) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.initTreeSelectorConfig();
    this.initColumn();
    // this.queryDeptList();
    this.pageType = this.$active.snapshot.params.type;
    this.pageTitle = this.getPageTitle(this.pageType);
    if (this.pageType !== 'add') {
      this.$active.queryParams.subscribe(params => {
        this.areaId = params.id;
        this.pageLoading = true;
        this.$areaService.queryNameCanChange(this.areaId).subscribe((result: ResultModel<any>) => {
          if (result.code !== ResultCodeEnum.success) {
            this.modifyPermission();
          }
        });
        this.queryDeptList().then(() => {
          this.$facilityUtilService.getArea().then((data) => {
            this.areaNodes = data;
            this.initAreaSelectorConfig(data);
            this.queryAreaById();
          });
        });
      });
    } else {
      this.queryDeptList().then(() => {
        this.$facilityUtilService.getArea().then((data) => {
          this.areaNodes = data;
          // 递归设置区域的选择情况
          this.$facilityUtilService.setAreaNodesStatusUnlimited(this.areaNodes, null, null);
          this.initAreaSelectorConfig(data);
        });
      });
    }

  }

  /**
   * 表单实例返回
   * param event
   */
  public formInstance(event): void {
    this.formStatus = event.instance;
  }

  /**
   * 打开责任单位选择器
   */
  public showModal(): void {
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isVisible = true;
  }

  /**
   * 打开区域选择器
   */
  public showAreaSelectorModal() {
    if (this.areaDisabled) {
      return;
    }
    this.areaSelectorConfig.treeNodes = this.areaNodes;
    this.areaSelectVisible = true;
  }

  /**
   * 责任单位选择结果
   * param event
   */
  public selectDataChange(event) {
    this.selectUnitName = '';
    const selectArr = event.map(item => {
      this.selectUnitName += `${item.deptName},`;
      return item.id;
    });
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, selectArr);
    this.formStatus.resetControlData('accountabilityUnit', selectArr);
  }

  /**
   * 区域选中结果
   * param event
   */
  public areaSelectChange(event) {
    if (event[0]) {
      this.$facilityUtilService.setAreaNodesStatusUnlimited(this.areaNodes, event[0].areaId, this.areaInfo.areaId);
      this.areaName = event[0].areaName;
      this.selectorData.parentId = event[0].areaId;
    } else {
      this.$facilityUtilService.setAreaNodesStatusUnlimited(this.areaNodes, null, this.areaInfo.areaId);
      this.areaName = '';
      this.selectorData.parentId = null;
    }
  }

  /**
   * 点击新增区域
   */
  public addArea() {
    this.isLoading = true;
    const data = this.formStatus.group.getRawValue();
    data['provinceName'] = this.selectCityInfo.provinceName;
    data['cityName'] = this.selectCityInfo.cityName;
    data['districtName'] = this.selectCityInfo.districtName;
    data.parentId = this.selectorData.parentId;
    if (this.pageType === 'add') {
      // 新增区域
      this.$areaService.addArea(data).subscribe((result: ResultModel<string>) => {
        this.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.$router.navigate(['/business/facility/area-list']).then();
          this.$modalService.success(result.msg);
        } else {
          this.$modalService.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    } else if (this.pageType === 'update') {
      // 修改区域
      data['areaId'] = this.areaId;
      this.$areaService.updateAreaById(data).subscribe((result: ResultModel<string>) => {
        this.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.$router.navigate(['/business/facility/area-list']).then();
          this.$modalService.success(result.msg);
        } else {
          this.$modalService.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    }
  }

  /**
   * 取消返回
   */
  public goBack(): void {
    this.$router.navigate(['/business/facility/area-list']).then();
  }

  public ngAfterViewInit(): void {
  }

  /**
   * 城市选择器值变化
   * param event
   */
  public cityInfoChange(event) {
    this.selectCityInfo = event;
  }

  /**
   * 根据id获取区域详情
   */
  private queryAreaById() {
    this.$areaService.queryAreaById(this.areaId).subscribe((result: ResultModel<AreaModel>) => {
      this.pageLoading = false;
      if (result.code === ResultCodeEnum.success) {
        const areaInfo = result.data || new AreaModel();
        this.areaInfo = areaInfo;
        this.areaName = this.areaInfo.parentName;
        this.selectorData.parentId = this.areaInfo.parentId;
        this.selectUnitName = this.areaInfo.accountabilityUnitName;
        this.formStatus.resetData(areaInfo);
        if (areaInfo.provinceName && areaInfo.cityName && areaInfo.districtName) {
          const info = {
            provinceName: result.data.provinceName,
            cityName: result.data.cityName,
            districtName: result.data.districtName
          };
          this.selectCityInfo = info;
        }

        // 递归设置区域的选择情况
        this.$facilityUtilService.setAreaNodesStatusUnlimited(this.areaNodes, areaInfo.parentId, areaInfo.areaId);
        // 递归设置树的节点状态
        this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, areaInfo.accountabilityUnit || []);
      } else if (result.code === '130109') {
        this.$modalService.error(result.msg);
        this.goBack();
      }

    });
  }

  /**
   * 获取所有单位
   */
  private queryDeptList() {
    return new Promise((resolve, reject) => {
      this.$userService.queryAllDepartment().subscribe((result: ResultModel<any[]>) => {
        this.treeNodes = result.data || [];
        resolve();
      });
    });
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
      title: `${this.language.selectUnit}`,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: `${this.language.deptName}`, key: 'deptName', width: 100,
        },
        {
          title: `${this.language.deptLevel}`, key: 'deptLevel', width: 100,
        },
        {
          title: `${this.language.parentDept}`, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }

  /**
   * 初始化表单配置
   */
  private initColumn() {
    this.formColumn = [
      {
        label: this.language.areaName,
        key: 'areaName',
        type: 'input',
        require: true,
        rule: [{required: true}, {maxLength: 32},
          this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$areaService.queryAreaNameIsExist(
            {areaId: this.areaId, areaName: value}),
            res => res.code === ResultCodeEnum.success)
        ],
      },
      {
        label: this.language.parentId, key: 'parentId', type: 'custom',
        template: this.areaSelector,
        rule: [], asyncRules: []
      },
      {
        label: this.language.region,
        key: 'managementFacilities',
        type: 'custom',
        rule: [],
        template: this.customTemplate
      },
      {
        label: this.language.address,
        key: 'address',
        type: 'input',
        require: false,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        modelChange: (controls, event, key, formOperate) => {
        }
      },
      {
        label: this.language.accountabilityUnit,
        key: 'accountabilityUnit',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.accountabilityUnitTep
      },
      {
        label: this.language.remarks, key: 'remarks', type: 'input',
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        modelChange: (controls, event, key, formOperate) => {
        }
      },
    ];
  }

  /**
   * 初始化选择区域配置
   * param nodes
   */
  private initAreaSelectorConfig(nodes) {
    this.areaSelectorConfig = {
      width: '500px',
      height: '300px',
      title: `${this.language.select}${this.language.area}`,
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
      treeNodes: nodes
    };
  }

  /**
   * 获取页面类型(add/update)
   * param type
   * returns {string}
   */
  private getPageTitle(type): string {
    let title;
    switch (type) {
      case'add':
        title = `${this.language.addArea}${this.language.area}`;
        break;
      case 'update':
        title = `${this.language.modify}${this.language.area}`;
        break;
    }
    return title;
  }

  /**
   * 处理区域能否修改
   */
  private modifyPermission() {
    this.formStatus.group.disable();
    this.formStatus.group.controls['areaName'].enable();
    this.formStatus.group.controls['remarks'].enable();
    this.unitDisabled = true;
    this.areaDisabled = true;
    this.cityDisabled = true;
  }

  /**
   * 责任单位树点击拦截
   * param treeId
   * param treeNode
   * returns {boolean}
   */
  private async checkIntercept(treeId, treeNode) {
    if (this.areaInfo && this.areaInfo.accountabilityUnit.includes(treeNode.id)) {
      const hasWorkOrderOrRule = await this.checkHasWorkOrderOrRule([treeNode.id]);
      if (hasWorkOrderOrRule) {
        this.unitTreeSelector.treeInstance.checkNode(treeNode, true, false, true);
        this.$modalService.error(this.language.accountabilityUnitCheckMsg);
      }
    }
  }

  /**
   * 检查是否有工单或者告警转工单
   * param treeNode
   * returns {Promise<any>}
   */
  private checkHasWorkOrderOrRule(deptIdList: string[]) {
    return new Promise((resolve, reject) => {
      if (!this.areaId) {
        resolve(false);
        return;
      }
      // 判断传入单位id是否为区域本来就有单位
      if (!this.checkArrHasRepeat(this.areaInfo.accountabilityUnit, deptIdList)) {
        resolve(false);
        return;
      }
      // 查询责任单位下面是否有工单
      this.$inspectionService.existsWorkOrderForDeptIds({deptIdList: deptIdList, areaId: this.areaId})
        .subscribe((result: ResultModel<boolean>) => {
          let hasWorkOrderOrRule: boolean = false;
          if (result.code === '0') {
            hasWorkOrderOrRule = result.data;
            if (!hasWorkOrderOrRule) {
              // 查询责任单位下面是否有告警转工单规则
              this.$alarmService.queryAlarmOrderRuleByDeptIds({
                deptIdList: deptIdList,
                areaId: this.areaId
              }).subscribe((_result: ResultModel<boolean>) => {
                if (_result.code === '0') {
                  hasWorkOrderOrRule = _result.data;
                  resolve(hasWorkOrderOrRule);
                } else {
                  reject();
                }
              });
            } else {
              resolve(hasWorkOrderOrRule);
            }
          } else {
            reject();
          }
        });
    });
  }

  /**
   * 判断两个数组中是否有重复的值
   * param arr
   * param _arr
   */
  private checkArrHasRepeat(arr: string[], _arr: string[]): boolean {
    let repeated = false;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < _arr.length; j++) {
        if (_arr[j] === arr[i]) {
          repeated = true;
          return repeated;
        }
      }
    }
  }
}
