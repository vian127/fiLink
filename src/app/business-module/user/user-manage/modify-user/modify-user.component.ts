import {Component, OnInit, ViewChild} from '@angular/core';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import {UserLanguageInterface} from '../../../../../assets/i18n/user/user-language.interface';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../core-module/api-service/user/user-manage/user.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {Result} from '../../../../shared-module/entity/result';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {UserUtilService} from '../../user-util.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {TelephoneInputComponent} from '../../../../shared-module/component/telephone-input/telephone-input.component';
import {UpdateUserNameService} from './update-username-service';
import {SessionUtil} from '../../../../shared-module/util/session-util';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.scss']
})

export class ModifyUserComponent implements OnInit {
  public userId: string = '';
  userInfo: any = {};
  formColumn: FormItem[];
  formStatus: FormOperate;
  queryCondition: QueryCondition = new QueryCondition();
  areaSelectorConfig: any = new TreeSelectorConfig();
  public language: UserLanguageInterface;
  public pageType = 'update';
  public pageTitle: string;
  public defaultStatus: string = '1'; // 默认状态
  public roleList: Array<any> = [];
  public treeNodes: any = [];
  isLoading = false;
  timeValue: number = null;
  timeType: string = 'day';
  @ViewChild('accountLimit') private accountLimitTemp;
  @ViewChild('department') private departmentTep;
  @ViewChild('telephone') private telephoneTemp;
  @ViewChild('telephoneInput') private telephoneInput: TelephoneInputComponent;
  @ViewChild('pushTypeTemplate') private pushTypeTemplate;
  areaSelectVisible: boolean = false;
  deptName: string = '';
  selectUnitName: string = '';
  userDisable: string;
  maxUsers: number;
  loginType: string;
  telephone;
  phoneNumberMsg: string = '';
  countryCode: string = '86';
  _phoneNum: string = '';
  phoneValue: string = '';
  // 推送方式
  pushTypeSelect = {
    // 推送方式邮箱
    pushTypeMail: false,
    // 推送方式短信
    pushTypeNote: false
  };

  constructor(
    public $nzI18n: NzI18nService,
    public $userService: UserService,
    public $message: FiLinkModalService,
    private $active: ActivatedRoute,
    private $router: Router,
    private $userUtilService: UserUtilService,
    private $ruleUtil: RuleUtil,
    private $updateUserNameService: UpdateUserNameService
  ) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('user');
    this.$active.params.subscribe(params => {
      this.pageType = params.type;
    });
    this.pageTitle = this.getPageTitle(this.pageType);
    this.$active.queryParams.subscribe(queryParams => {
      this.userId = queryParams.id;
      this.getDept().then(() => {
        this.getUserInfoById(this.userId);
      });
    });
    this.queryAllRoles();
    this.initForm();
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

  public initForm() {
    this.formColumn = [
      {
        label: this.language.userCode,
        key: 'userCode',
        type: 'input',
        disabled: true,
        require: true,
        rule: [{required: true}, {maxLength: 32},
          this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
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
                  if (res.data[0].id === this.userId) {
                    return true;
                  } else {
                    return false;
                  }
                }
              } else {
                return false;
              }
            })
        ],
      },
      {
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
        label: this.language.userStatus,
        key: 'userStatus',
        type: 'radio',
        require: true,
        rule: [{required: true}],
        initialValue: this.defaultStatus,
        radioInfo: {
          data: [
            {label: this.language.enable, value: '1'},
            {label: this.language.disable, value: '0'},
          ],
          label: 'label',
          value: 'value'
        }
      },
      {
        label: this.language.deptId,
        key: 'deptId',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.departmentTep
      },
      {
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
        label: this.language.address,
        key: 'address',
        type: 'input',
        require: false,
        rule: [],
        asyncRules: []
      },
      {
        label: this.language.phoneNumber,
        key: 'phoneNumber',
        type: 'custom',
        require: true,
        rule: [
          {required: true},
        ],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$userService.verifyUserInfo(
            {
              'pageCondition': {
                'pageNum': 1,
                'pageSize': 10
              },
              'filterConditions': [{
                'filterField': 'phoneNumber',
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
                  if (res.data[0].id === this.userId) {
                    return true;
                  } else {
                    this.phoneNumberMsg = this.language.phoneNumberExistTips;
                    return false;
                  }
                }
              } else {
                return false;
              }
            })
        ],
        template: this.telephoneTemp
      },
      {
        label: this.language.email,
        key: 'email',
        type: 'input',
        require: true,
        rule: [{required: true}, {maxLength: 32},
          this.$ruleUtil.getMailRule()
        ],
        customRules: [],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$userService.queryEmailIsExist(
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
                  if (res.data[0].id === this.userId) {
                    return true;
                  } else {
                    return false;
                  }
                }
              } else {
                return false;
              }
            })

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
          //             if (res.data[0].id === this.userId) {
          //               observer.next(null);
          //               observer.complete();
          //             } else {
          //               observer.next({ error: true, duplicated: true });
          //               observer.complete();
          //             }
          //           }
          //         }
          //       });
          //     });
          //   },
          //   asyncCode: 'duplicated', msg: this.language.emailTips2
          // }
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
        label: this.language.loginType,
        key: 'loginType',
        type: 'radio',
        require: true,
        rule: [{required: true}],
        radioInfo: {
          data: [
            {label: this.language.singleUser, value: '1'},
            {label: this.language.multiUser, value: '2'},
          ],
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, event, key, formOperate) => {
          this.loginType = event;
          if (event === '1') {
            this.formStatus.group.controls['maxUsers'].disable();
            this.formStatus.resetControlData('maxUsers', 1);
            this.maxUsers = 1;
          } else {
            this.formStatus.group.controls['maxUsers'].enable();
            this.formStatus.resetControlData('maxUsers', 100);
          }
        }
      },
      {
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
        label: this.language.userDesc,
        key: 'userDesc',
        type: 'input',
        require: false,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
    setTimeout(() => {
      if (this.userDisable === '1') {
        this.formStatus.group.controls['maxUsers'].disable();
      } else {
        this.formStatus.group.controls['maxUsers'].enable();
      }
    }, 380);

  }

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
   * 根据id获取用户详情
   */
  getUserInfoById(userId) {
    this.$userService.queryUserInfoById(userId).subscribe((res: Result) => {
      const userInfo = res.data;
      switch (userInfo.pushType) {
        case '0,1':
          this.pushTypeSelect.pushTypeMail = true;
          this.pushTypeSelect.pushTypeNote = true;
          break;
        case '0':
          this.pushTypeSelect.pushTypeMail = true;
          break;
        case '1':
          this.pushTypeSelect.pushTypeNote = true;
          break;
      }
      this.phoneValue = res.data.phoneNumber;
      if (userInfo.countryCode) {
        this.telephoneInput.telephoneCode = `${'+'}${userInfo.countryCode}`; // 国际码
      }
      this.telephoneInput._phoneNum = userInfo.phoneNumber; // 电话号码
      const validityTime = res['data'].countValidityTime;
      if (validityTime) {
        const endVal = validityTime.charAt(validityTime.length - 1);
        const fontValue = validityTime.substring(0, validityTime.length - 1);
        if (endVal === 'y') {
          this.timeType = 'year';
        } else if (endVal === 'm') {
          this.timeType = 'month';
        } else if (endVal === 't') {
          this.timeType = 'day';
        } else {
          this.timeType = 'day';
        }
        this.timeValue = fontValue;
      } else {
        userInfo.countValidityTime = null;
        this.timeValue = null;
        this.timeType = 'day';
      }
      this.userDisable = userInfo.loginType;
      this.selectUnitName = userInfo.department.deptName;
      setTimeout(() => {
        this.formStatus.resetData(userInfo);
      }, 0);
      // 递归设置部门的选择情况
      this.$userUtilService.setAreaNodesStatus(this.treeNodes, userInfo.deptId);
    });

  }

  /**
   * 修改用户
   */
  submit() {
    // this.isLoading = true;
    const results = this.formStatus.getData();
    results.id = this.userId;
    if (this.loginType === '1') {
      results.maxUsers = this.maxUsers;
    }
    const teleCode = this.telephoneInput.telephoneCode;
    results.countryCode = teleCode.substr(1, teleCode.length - 1);  // 电话号码国际码
    this.$userService.queryUserInfoById(this.userId).subscribe((result: Result) => {
      if (result.code === 120310) {
        this.isLoading = false;
        this.$message.info(this.language.existTips);
        this.$router.navigate(['/business/user/user-list']).then();
      } else {
        this.$userService.modifyUser(results).subscribe((res: Result) => {
          this.isLoading = false;
          if (res['code'] === 0) {
            this.$message.success(this.language.modifyUserSuccess);
            this.$router.navigate(['business/user/user-list']).then();
            const userInfo = SessionUtil.getUserInfo();
            const userName = res.data.userName;
            if (results.id === userInfo.id) {
              this.$updateUserNameService.sendMessage(userName);  // 更新用户姓名
            }
          } else if (res['code'] === 120200) {
            this.$message.info(res['msg']);
          } else if (res['code'] === 120420) {
            this.$message.info(res['msg']);
          } else if (res['code'] === 120430) {
            this.$message.info(res['msg']);
          } else {
            this.$message.error(this.language.modifyUserFail);
          }
        });
      }
    });
  }


  private getPageTitle(type): string {
    let title;
    switch (type) {
      case 'add':
        title = `${this.language.addUser}${this.language.user}`;
        break;
      case 'update':
        title = `${this.language.update}${this.language.user}`;
        break;
    }
    return title;
  }

  cancel() {
    this.$router.navigate(['/business/user/user-list']).then();
  }


  /**
   * 时间类型下拉框
   */
  timeTypeChange() {
    this.timeValue = null;  // 当发生改变时为空
    this.formStatus.resetControlData('countValidityTime', null);
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
   * 获取所有角色
   */
  queryAllRoles() {
    const userInfo = SessionUtil.getUserInfo();
    this.$userService.queryAllRoles().subscribe((res: Result) => {
      const roleArray = res.data;
      if (roleArray) {
        if (userInfo.userCode === 'admin') {
          roleArray.forEach(item => {
            this.roleList.push({'label': item.roleName, 'value': item.id});
          });
        } else {
          // 非admin用户不能使用超级管理员角色
          const _roleArray = roleArray.filter(item => item.id !== '89914a2b42e24c4a8a9');
          _roleArray.forEach(item => {
            this.roleList.push({'label': item.roleName, 'value': item.id});
          });
        }
      }
    });
  }


  /**
   * 初始化电话号码
   */
  getPhoneInit(event) {
    this.telephone = event;
  }


  /**
   * 获取电话号码国际码
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
    if (this.telephoneInput.telephoneCode === '+86') {
      if (reg.test(event)) {
        this.$userService.verifyUserInfo(data).subscribe((res: Result) => {
          if (res['code'] === 0) {
            if (res.data.length === 0) {
              this.formStatus.resetControlData('phoneNumber', event);
            } else if (res.data.length > 0) {
              this.formStatus.resetControlData('phoneNumber', event);
            } else if (res.data.length > 0 && (res.data[0].phoneNumber === this.phoneValue)) {
              this.formStatus.resetControlData('phoneNumber', null);
            }
          } else {
            this.formStatus.resetControlData('phoneNumber', null);
          }
        });
      } else {
        this.formStatus.resetControlData('phoneNumber', null);
      }
    } else {
      if (_reg.test(event)) {
        this.formStatus.resetControlData('phoneNumber', event);
      } else {
        this.formStatus.resetControlData('phoneNumber', null);
      }

    }
  }


  /**
   * 推送方式勾选回调
   */
  pushTypeCheckChange(event) {
    this.formStatus.getData().pushType = event.toString();
    console.log(this.formStatus.getData().pushType);
  }


}
