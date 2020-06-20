import {Component, OnInit, ViewChild} from '@angular/core';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import {UserLanguageInterface} from '../../../../../assets/i18n/user/user-language.interface';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {UserService} from '../../../../core-module/api-service/user';
import {ActivatedRoute, Router} from '@angular/router';
import {Result} from '../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {UserUtilService} from '../../user-util.service';
import {SecurityPolicyService} from '../../../../core-module/api-service/system-setting/security-policy/security-policy.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {SessionUtil} from '../../../../shared-module/util/session-util';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})

export class AddUserComponent implements OnInit {
  @ViewChild('accountLimit') private accountLimitTemp;
  @ViewChild('department') private departmentTep;
  @ViewChild('telephone') private telephoneTemp;
  @ViewChild('pushTypeTemplate') private pushTypeTemplate;


  formColumn: FormItem[] = [];
  formStatus: FormOperate;
  queryCondition: QueryCondition = new QueryCondition();
  areaSelectorConfig: any = new TreeSelectorConfig();
  public language: UserLanguageInterface;
  public treeNodes: any = [];
  public pageType = 'add';
  public defaultStatus: string = '1';
  // 角色列表
  public roleList: Array<any> = [];
  // 新增用户
  public pageTitle: string;
  // 加载动画
  isLoading = false;
  // 账户有效期
  timeValue: number = null;
  // 时间类型
  timeType: string = 'day';
  // 部门弹框显示
  areaSelectVisible: boolean = false;
  // 部门名称
  deptName: string = '';
  // 所选部门
  selectUnitName: string = '';
  // 用户信息
  userInfo: any = {};
  // 最大用户数
  maxUsers: number;
  // 用户模式
  loginType: string;
  // 用户名长度
  accountMinLength: number;
  // 手机号
  telephone;
  // 手机号校验
  phoneNumberMsg: string = '';
  // 手机号国际码
  countryCode: string = '86';

  constructor(
    public $nzI18n: NzI18nService,
    public $userService: UserService,
    public $message: FiLinkModalService,
    public $active: ActivatedRoute,
    public $router: Router,
    public $userUtilService: UserUtilService,
    private $securityPolicyService: SecurityPolicyService,
    private $ruleUtil: RuleUtil
  ) {
  }


  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('user');
    this.$active.params.subscribe(params => {
      this.pageType = params.type;
    });
    this.pageTitle = this.getPageTitle(this.pageType);
    this.$active.queryParams.subscribe(params => {
      this.accountMinLength = Number(params.minLength);
    });
    // 获取所有角色
    this.queryAllRoles();
    // 获取表单信息
    this.getDept();
    // 表单初始化
    this.initForm();

  }

  /**
   * 获取部门信息
   */
  getDept() {
    return new Promise((resolve, reject) => {
      this.$userUtilService.getDept().then((data: NzTreeNode[]) => {
        this.treeNodes = data || [];
        // 选择部门树形选择器
        this.initAreaSelectorConfig(data);
        resolve();
      });
    });
  }

  /**
   * 获取表单信息
   */
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
  areaSelectChange(event) {
    this.userInfo.deptId = event[0].id;
    if (event[0]) {
      this.$userUtilService.setAreaNodesStatus(this.treeNodes, event[0].id);
      this.selectUnitName = event[0].deptName;
      this.formStatus.resetControlData('deptId', this.userInfo.deptId);
    } else {
      this.$userUtilService.setAreaNodesStatus(this.treeNodes, null);
      this.selectUnitName = '';
      this.formStatus.resetControlData('deptId', null);
    }
  }

  /**
   * 表单信息
   */
  public initForm() {
    this.formColumn = [
      {
        // 账号
        label: this.language.userCode,
        key: 'userCode',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          {minLength: this.accountMinLength},
          {maxLength: 32},
          this.$ruleUtil.getNameRule()],
        // 自定义校验规则
        customRules: [this.$ruleUtil.getNameCustomRule()],
        // 异步校验规则
        asyncRules: [
          // {
          //   asyncRule: (control: FormControl) => {
          //     const params = {
          //       'pageCondition': {
          //         'pageNum': 1,
          //         'pageSize': 10
          //       },
          //       'filterConditions': [{
          //         'filterField': 'userCode',
          //         'operator': 'eq',
          //         'filterValue': control.value
          //       }]
          //     };
          //     return Observable.create(observer => {
          //       this.$userService.verifyUserInfo(params).subscribe((res: Result) => {
          //         if (res['code'] === 0) {
          //           if (res.data.length === 0) {
          //             observer.next(null);
          //             observer.complete();
          //           } else if (res.data.length > 0) {
          //             observer.next({ error: true, duplicated: true });
          //             observer.complete();
          //           }
          //         }
          //       });
          //     });
          //   },
          //   asyncCode: 'duplicated', msg: this.language.userCodeTips2
          // }
          this.$ruleUtil.getNameAsyncRule(value => this.$userService.verifyUserInfo(
            {
              'pageCondition': {
                'pageNum': 1,
                'pageSize': 10
              },
              'filterConditions': [{
                'filterField': 'userCode',
                'operator': 'eq',
                'filterValue': value
              }]
            }
            ),
            res => {
              if (res['code'] === 0) {
                if (res.data.length === 0) {
                  return true;
                } else if (res.data.length > 0) {
                  return false;
                }
              } else {
                return false;
              }
            })
        ],
      },
      {
        // 姓名
        label: this.language.userName,
        key: 'userName',
        type: 'input',
        require: true,
        rule: [{required: true}, {maxLength: 32},
          this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: []
      },
      {
        // 昵称
        label: this.language.userNickname,
        key: 'userNickname',
        type: 'input',
        require: false,
        rule: [{maxLength: 32},
          this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: []
      },
      {
        // 用户状态
        label: this.language.userStatus,
        key: 'userStatus',
        type: 'radio',
        require: true,
        rule: [{required: true}],
        initialValue: this.defaultStatus,
        radioInfo: {
          data: [
            // 启用
            {label: this.language.enable, value: '1'},
            // 停用
            {label: this.language.disable, value: '0'},
          ],
          label: 'label',
          value: 'value'
        }
      },
      {
        // 部门
        label: this.language.deptId,
        key: 'deptId',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.departmentTep
      },
      {
        // 角色
        label: this.language.roleId,
        key: 'roleId',
        type: 'select',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        selectInfo: {
          data: this.roleList,
          label: 'label',
          value: 'value'
        }
      },
      {
        // 地址
        label: this.language.address,
        key: 'address',
        type: 'input',
        require: false,
        rule: [{maxLength: 64}],
        asyncRules: []
      },
      {
        // 手机号
        label: this.language.phoneNumber,
        key: 'phoneNumber',
        type: 'custom',
        require: true,
        col: 24,
        rule: [
          {required: true},
        ],
        asyncRules: [],
        template: this.telephoneTemp
      },
      {
        // 邮箱
        label: this.language.email,
        key: 'email',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          {maxLength: 32},
          {pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, msg: this.language.emailTips}],
        // 异步校验规则
        asyncRules: [
          // {
          //   asyncRule: (control: FormControl) => {
          //     const params = {
          //       'pageCondition': {
          //         'pageNum': 1,
          //         'pageSize': 10
          //       },
          //       'filterConditions': [{
          //         'filterField': 'email',
          //         'operator': 'eq',
          //         'filterValue': control.value
          //       }]
          //     };
          //     return Observable.create(observer => {
          //       this.$userService.verifyUserInfo(params).subscribe((res: Result) => {
          //         if (res['code'] === 0) {
          //           if (res.data.length === 0) {
          //             observer.next(null);
          //             observer.complete();
          //           } else if (res.data.length > 0) {
          //             observer.next({ error: true, duplicated: true });
          //             observer.complete();
          //           }
          //         }
          //       });
          //     });
          //   },
          //   asyncCode: 'duplicated', msg: this.language.emailTips2
          // }
          this.$ruleUtil.getNameAsyncRule(value => this.$userService.verifyUserInfo(
            {
              'pageCondition': {
                'pageNum': 1,
                'pageSize': 10
              },
              'filterConditions': [{
                'filterField': 'email',
                'operator': 'eq',
                'filterValue': value
              }]
            }
            ),
            res => {
              if (res['code'] === 0) {
                if (res.data.length === 0) {
                  return true;
                } else if (res.data.length > 0) {
                  return false;
                }
              } else {
                return false;
              }
            })
        ]
      },
      {
        // 推送方式
        label: this.language.pushType,
        key: 'pushType',
        type: 'custom',
        require: false,
        rule: [],
        asyncRules: [],
        template: this.pushTypeTemplate
      },
      {
        // 账户有效期
        label: this.language.countValidityTime,
        key: 'countValidityTime',
        type: 'custom',
        require: false,
        col: 24,
        rule: [],
        asyncRules: [],
        template: this.accountLimitTemp
      },
      {
        // 用户模式
        label: this.language.loginType,
        key: 'loginType',
        type: 'radio',
        require: true,
        rule: [{required: true}],
        initialValue: '1',
        radioInfo: {
          data: [
            // 单用户
            {label: this.language.singleUser, value: '1'},
            // 多用户
            {label: this.language.multiUser, value: '2'},
          ],
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, event, key, formOperate) => {
          if (event === '1') {
            this.formStatus.group.controls['maxUsers'].disable();
            this.formStatus.resetControlData('maxUsers', 1);
          } else {
            this.formStatus.group.controls['maxUsers'].enable();
            this.formStatus.resetControlData('maxUsers', 100);
          }
        }
      },
      {
        // 最多用户数
        label: this.language.maxUsers,
        key: 'maxUsers',
        type: 'input',
        require: false,
        initialValue: 1,
        rule: [
          {pattern: /^([2-9]|[1-9]\d|2|100)$/, msg: this.language.maxUsersTips},
        ],
        asyncRules: []
      },
      {
        // 备注
        label: this.language.userDesc,
        key: 'userDesc',
        type: 'input',
        require: false,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
    setTimeout(() => {
      this.formStatus.group.controls['maxUsers'].disable();
    }, 0);

  }

  /**
   * 选择部门
   */
  private initAreaSelectorConfig(nodes) {
    this.areaSelectorConfig = {
      width: '500px',
      height: '300px',
      title: this.language.departmentSelect,
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
   *新增用户
   */
  submit() {
    // this.isLoading = true;
    const userObj = this.formStatus.getData();
    if (userObj.loginType === '1') {
      userObj.maxUsers = 1;
    }
    userObj.countryCode = this.countryCode;  // 电话号码国际码
    this.$userService.addUser(userObj).subscribe((res: Result) => {
      this.isLoading = false;
      if (res['code'] === 0) {
        this.$router.navigate(['business/user/user-list']).then();
        this.$message.success(this.language.addUserSuccess);
      } else if (res['code'] === 120200) {
        this.$message.info(res['msg']);
      } else if (res['code'] === 120420) {
        this.$message.info(res['msg']);
      } else if (res['code'] === 120430) {
        this.$message.info(res['msg']);
      } else if (res['code'] === 125030) {
        this.$message.info(res['msg']);
      } else if (res['code'] === -1) {
        this.$message.error(this.language.addUserFail);
      } else {
        this.$message.info(res['msg']);
      }
    });
  }

  cancel() {
    this.$router.navigate(['business/user/user-list']).then();
  }

  /**
   * 获取所有角色
   */
  queryAllRoles() {
    const userInfo = SessionUtil.getUserInfo();
    this.$userService.queryAllRoles().subscribe((res: Result) => {
      const roleArray = res.data;
      if (roleArray) {
        if (userInfo.userCode === 'admin') {
          roleArray.forEach(item => {
            // 角色栏下拉框数据
            this.roleList.push({'label': item.roleName, 'value': item.id});
          });
        } else {
          // 非admin用户不能使用超级管理员角色
          const _roleArray = roleArray.filter(item => item.id !== 'superAdmin');
          _roleArray.forEach(item => {
            // 角色栏下拉框数据
            this.roleList.push({'label': item.roleName, 'value': item.id});
          });
        }
      }
    });
  }

  /**
   * 判断页面类型
   */
  private getPageTitle(type): string {
    let title;
    switch (type) {
      case 'add':
        title = `${this.language.addUser} ${this.language.user}`;
        break;
      case 'update':
        title = `${this.language.update} ${this.language.user}`;
        break;
    }
    return title;
  }

  /**
   * 时间类型下拉框
   */
  timeTypeChange() {
    // 当发生改变时为空
    this.timeValue = null;
  }

  /**
   * 输入框输入事件
   */
  onKey(event) {
    const inputValue = String(event.target.value);
    if (!inputValue) {
      this.formStatus.resetControlData('countValidityTime', null);
    } else {
      if (this.timeValue !== null) {
        if (this.timeType === 'year') {
          this.formStatus.resetControlData('countValidityTime', inputValue + 'y');

        } else if (this.timeType === 'month') {
          this.formStatus.resetControlData('countValidityTime', inputValue + 'm');

        } else if (this.timeType === 'day') {
          this.formStatus.resetControlData('countValidityTime', inputValue + 'd');
        }
      }
    }
  }

  /**
   * 初始化手机号码
   */
  getPhoneInit(event) {
    this.telephone = event;
  }


  /**
   * 监听手机号国际码
   */
  getPhone(event) {
    this.countryCode = event.dialCode;
  }

  /**
   * 监听手机号码输入状态
   */
  inputNumberChange(event) {
    this.phoneNumberMsg = '';
    const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    const _reg = /^\d+$/;
    const data = {
      'pageCondition': {
        'pageNum': 1,
        'pageSize': 10
      },
      'filterConditions': [{
        'filterField': 'phoneNumber',
        'operator': 'eq',
        'filterValue': event
      }]
    };
    if (this.countryCode === '86') {
      if (reg.test(event)) {
        this.$userService.verifyUserInfo(data).subscribe((res: Result) => {
          if (res['code'] === 0) {
            if (res.data.length === 0) {
              this.phoneNumberMsg = '';
              this.formStatus.resetControlData('phoneNumber', event);
            } else if (res.data[0].phoneNumber === event) {
              this.phoneNumberMsg = this.language.phoneNumberExistTips;
              this.formStatus.resetControlData('phoneNumber', null);
            }
          } else {
            this.formStatus.resetControlData('phoneNumber', null);
          }
        });
      } else {
        this.phoneNumberMsg = this.language.phoneNumberTips;
        this.formStatus.resetControlData('phoneNumber', null);
      }
    } else {
      if (_reg.test(event)) {
        this.phoneNumberMsg = '';
        this.formStatus.resetControlData('phoneNumber', event);
      } else {
        this.phoneNumberMsg = this.language.phoneNumberTips;
        this.formStatus.resetControlData('phoneNumber', null);
      }
    }

  }

  /**
   * 推送方式勾选回调
   */
  pushTypeCheckChange(event) {
    this.formStatus.getData().pushType = event.toString();
  }


}
