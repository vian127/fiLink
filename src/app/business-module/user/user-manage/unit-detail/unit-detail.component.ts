import {Component, OnInit, ViewChild} from '@angular/core';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import {UnitLanguageInterface} from '../../../../../assets/i18n/unit/unit-language.interface';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {UserService} from '../../../../core-module/api-service/user/user-manage/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Result} from '../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {UserUtilService} from '../../user-util.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';

@Component({
  selector: 'app-unit-detail',
  templateUrl: './unit-detail.component.html',
  styleUrls: ['./unit-detail.component.scss']
})
export class UnitDetailComponent implements OnInit {
  formColumn: FormItem[] = [];
  formStatus: FormOperate;
  queryCondition: QueryCondition = new QueryCondition();
  public language: UnitLanguageInterface;
  areaSelectorConfig: any = new TreeSelectorConfig();
  isLoading = false;
  pageType = 'add';
  pageTitle: string;
  unitId: string = '';
  areaName = '';
  unitInfo: any = {};
  @ViewChild('department') private departmentTep;
  public departmentList: Array<any> = [];
  private treeNodes: any = [];
  areaSelectVisible: boolean = false;
  deptName: string = '';
  selectUnitName: string = '';
  verifyFatherId = null;
  selectData = [];

  constructor(
    private $nzI18n: NzI18nService,
    private $userService: UserService,
    private $active: ActivatedRoute,
    private $router: Router,
    private $message: FiLinkModalService,
    private $userUtilService: UserUtilService,
    private $ruleUtil: RuleUtil
  ) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('unit');
    this.initColumn();
    this.pageType = this.$active.snapshot.params.type;
    this.pageTitle = this.getPageTitle(this.pageType);
    if (this.pageType !== 'add') {
      this.$active.queryParams.subscribe(params => {
        this.unitId = params.id;
        const unitId = this.unitId;
        this.getDept().then(() => {
          this.getUnitListById(unitId);
        });
      });
    } else {
      this.$userUtilService.getDept().then((data: NzTreeNode[]) => {
        this.treeNodes = data || [];
        this.initAreaSelectorConfig(data);
      });
    }
  }

  getDept() {
    return new Promise((resolve, reject) => {
      this.$userUtilService.getDept().then((data: NzTreeNode[]) => {
        this.treeNodes = data || [];
        this.initAreaSelectorConfig(data);
        resolve();
      });
    });

  }

  formInstance(event) {
    this.formStatus = event.instance;
  }

  /**
   * 打开部门选择器
   */
  showDeptSelectorModal() {
    this.areaSelectorConfig.treeNodes = this.treeNodes;
    this.areaSelectVisible = true;
  }


  /**
   * 部门选中结果
   * param event
   */
  deptSelectChange(event) {
    this.selectData = event;
    if (event[0]) {
      // this.$userUtilService.setAreaNodesStatus(this.treeNodes, event[0].deptFatherId, this.unitInfo.id);
      this.$userUtilService.setAreaNodesStatus(this.treeNodes, event[0].id, this.unitInfo.id);
      this.selectUnitName = event[0].deptName;
      this.unitInfo.deptFatherId = event[0].id; // 单位名称验证传递的参数
    } else {
      this.$userUtilService.setAreaNodesStatus(this.treeNodes, null, this.unitInfo.id);
      this.selectUnitName = '';
      this.unitInfo.deptLevel = 1;
      this.unitInfo.deptFatherId = null;
    }
  }

  /**
   *新增、修改部门
   */
  submit() {
    this.isLoading = true;
    const unitObj = this.formStatus.getData();
    unitObj.deptFatherId = this.unitInfo.deptFatherId;
    if (this.pageType === 'add') {
      if (this.selectData.length === 1) {
        const level = Number(this.selectData[0].deptLevel) + 1;
        unitObj.deptLevel = String(level);
      } else {
        unitObj.deptLevel = '1';
      }
      this.$userService.verifyDeptInfo(unitObj).subscribe((result: Result) => {
        this.isLoading = false;
        if (result['code'] === 0) {
          if (result.data.length === 0) {
            this.$userService.addDept(unitObj).subscribe((res: Result) => {
              if (res['code'] === 0) {
                this.$message.success(this.language.addUnitTips);
                this.$router.navigate(['/business/user/unit-list']).then();
              } else {
                this.$message.error(res['msg']);
              }
            });
          } else if (result.data.length > 0) {
            this.$message.info(this.language.unitNameTips);
          }
        }
      });

    } else if (this.pageType === 'update') {
      if (this.selectData.length === 1) {
        const level = Number(this.selectData[0].deptLevel) + 1;
        unitObj.deptLevel = String(level);
      } else {
        unitObj.deptLevel = String(this.unitInfo.deptLevel);
      }
      unitObj.id = this.unitInfo.id;
      this.$userService.queryDeptInfoById(this.unitId).subscribe((result: Result) => {
        if (result.code === 0) {
          this.$userService.modifyDept(unitObj).subscribe((res: Result) => {
            this.isLoading = false;
            if (res['code'] === 0) {
              this.$message.success(this.language.modifyUnitTips);
              this.$router.navigate(['/business/user/unit-list']).then();
            } else {
              this.$message.error(res['msg']);
            }
          });
        } else if (result.code === 120610) {
          this.isLoading = false;
          this.$message.info(this.language.deptExistTips);
          this.$router.navigate(['/business/user/unit-list']).then();
        }
      });
    }

  }

  private initColumn() {
    this.formColumn = [
      {
        label: this.language.deptName,
        key: 'deptName',
        type: 'input',
        require: true,
        rule: [{required: true}, {maxLength: 32},
          this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$userService.verifyDeptInfo(
            {'deptName': value}),
            res => {
              if (res['code'] === 0) {
                if (res.data.length === 0 || (res.data.length === 1 && res.data[0].id === this.unitId)) {
                  return true;
                }
              } else {
                return false;
              }
            })
        ],
      },
      {
        label: this.language.deptChargeUser,
        key: 'deptChargeUser',
        type: 'input',
        require: false,
        rule: [{minLength: 1}, {maxLength: 32}],
        modelChange: (controls, event, key, formOperate) => {
        }
      },
      {
        label: this.language.deptPhoneNum,
        key: 'deptPhoneNum',
        type: 'input',
        require: false,
        rule: [
          {pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, msg: this.language.phoneNumTips},
        ],
        customRules: [],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$userService.verifyDeptInfo({'deptPhoneNum': value}),
            res => {
              if (res['code'] === 0) {
                if (res.data.length === 0 || (res.data.length === 1 && res.data[0].id === this.unitId)) {
                  return true;
                }
              } else {
                return false;
              }
            }, this.language.phoneNumberTips2)
        ]
      },
      {
        label: this.language.address,
        key: 'address',
        type: 'input',
        require: false,
        rule: [{maxLength: 200}],
        modelChange: (controls, event, key, formOperate) => {
        }
      },
      {
        label: this.language.deptFatherId,
        key: 'deptFatherId',
        type: 'custom',
        require: false,
        rule: [],
        asyncRules: [],
        template: this.departmentTep
      },
      {
        label: this.language.remark,
        key: 'remark',
        type: 'input',
        require: false,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];

  }

  private initAreaSelectorConfig(nodes) {
    this.areaSelectorConfig = {
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


  private getPageTitle(type): string {
    let title;
    switch (type) {
      case 'add':
        title = `${this.language.addUnit} ${this.language.unit}`;
        break;
      case 'update':
        title = `${this.language.update} ${this.language.unit}`;
        break;
    }
    return title;
  }


  goBack() {
    this.$router.navigate(['/business/user/unit-list']).then();
  }


  /**
   * 获取单个部门信息
   *
   */
  public getUnitListById(unitId) {
    this.$userService.queryDeptInfoById(unitId).subscribe((res: Result) => {
      const unitInfo = res.data;
      this.unitInfo = unitInfo;
      this.unitInfo.deptLevel = Number(this.unitInfo.deptLevel);
      this.selectUnitName = unitInfo.parentDepartmentName;
      this.formStatus.resetData(unitInfo);
      // 递归设置部门的选择情况
      this.$userUtilService.setAreaNodesStatus(this.treeNodes, unitInfo.deptFatherId, this.unitInfo.id);
    });
  }


}
