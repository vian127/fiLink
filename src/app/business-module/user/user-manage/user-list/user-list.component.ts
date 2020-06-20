import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {Router} from '@angular/router';
import {DateHelperService, NzI18nService, NzModalService, UploadFile} from 'ng-zorro-antd';
import {UserService} from '../../../../core-module/api-service/user';
import {Result} from '../../../../shared-module/entity/result';
import {UserLanguageInterface} from '../../../../../assets/i18n/user/user-language.interface';
import {QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {DateFormatString} from '../../../../shared-module/entity/dateFormatString';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {DownloadService} from './download.service';
import {SecurityPolicyService} from '../../../../core-module/api-service/system-setting/security-policy/security-policy.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {AreaLevel, getAreaLevel} from '../../../facility/share/const/facility.config';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {AreaService} from '../../../../core-module/api-service/facility';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {FacilityUtilService} from '../../../facility/share/service/facility-util.service';
import {UserUtilService} from '../../user-util.service';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {
  // 用户列表信息
  _dataSet = [];
  // 分页数据
  pageBean: PageBean = new PageBean(10, 1, 1);
  tableConfig: TableConfig;
  // 查询条件
  queryCondition: QueryCondition = new QueryCondition();
  // 过滤条件
  filterObject = {};
  // 流水查询权限控制
  operationDis: boolean = true;
  securityDis: boolean = true;
  // 国际化
  language: UserLanguageInterface;
  areaLanguage: FacilityLanguageInterface;
  commonLanguage: CommonLanguageInterface;
  // 部门查询（暂废）
  deptArray: Array<any> = [];
  // 用户id
  userId: string = '';
  flag: boolean = true;
  // 重置密码
  defaultPassWord: null;
  fileList: UploadFile[] = [];
  fileArray = [];
  fileType: string;
  AreaLevel;
  accountMinLength: number = 1;
  roleArray = [];
  // 区域选择器
  areaSelectVisible: boolean = false;
  areaInfo: any = new AreaModel();
  areaSelectorConfig: any = new TreeSelectorConfig();
  areaNodes: any = [];
  // 责任单位选择器
  isVisible: boolean = false;
  selectUnitName: string = '';
  treeSelectorConfig: TreeSelectorConfig;
  treeNodes = [];
  treeSetting = {};
  filterValue: any;
  radioValue: string;
  useLanguage;
  @ViewChild('userStatusTemp') userStatusTemp: TemplateRef<any>;
  @ViewChild('departmentTemp') departmentTemp: TemplateRef<any>;
  @ViewChild('roleTemp') roleTemp: TemplateRef<any>;
  @ViewChild('loginTypeTemp') loginTypeTemp: TemplateRef<any>;
  @ViewChild('importTemp') importTemp: TemplateRef<any>;
  @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  @ViewChild('selectLogTemp') selectLogTemp: TemplateRef<any>;

  constructor(public $router: Router,
              public $nzI18n: NzI18nService,
              public $userService: UserService,
              public $message: FiLinkModalService,
              public $nzModalService: NzModalService,
              private $dateHelper: DateHelperService,
              private $downloadService: DownloadService,
              private $securityPolicyService: SecurityPolicyService,
              private $areaService: AreaService,
              private $facilityUtilService: FacilityUtilService,
              private $userUtilService: UserUtilService) {
    this.language = this.$nzI18n.getLocaleData('user');
    this.areaLanguage = this.$nzI18n.getLocaleData('facility');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
  }


  ngOnInit() {
    this.useLanguage = this.$nzI18n.getLocale();
    this.initTableConfig();
    this.initTreeSelectorConfig();
    this.queryDeptList();
    this.refreshData();
    this.queryUserPassWord();
    this.queryAccountSecurity();
    this.queryAllRoles();
    this.AreaLevel = AreaLevel;
    this.getLogRole();
  }

  /**
   * 获取流水查询权限
   * param event
   */
  getLogRole() {
    const menuList = JSON.parse(localStorage.getItem('menuList'));
    menuList.map(item => {
      if (item.menuId === '06') {
        item.children.map(_item => {
          if (_item.menuId === '6-2') {
            _item.children.map(__item => {
              if (__item.menuId === '6-2-1') {
                this.operationDis = false;
              } else if (__item.menuId === '6-2-3') {
                this.securityDis = false;
              }
            });
          }
        });
      }
    });
  }

  pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }


  /**
   * 获取用户列表信息
   */
  refreshData() {
    this.tableConfig.isLoading = true;
    this.$userService.queryUserLists(this.queryCondition).subscribe((res: Result) => {
      this.tableConfig.isLoading = false;
      this._dataSet = res.data.data;
      this.pageBean.Total = res.data.totalCount;
      this.pageBean.pageIndex = res.data.pageNum;
      this.pageBean.pageSize = res.data.size;
      this._dataSet.forEach(item => {
        // 账号有效期
        if (item.countValidityTime && item.createTime) {
          const validTime = item.countValidityTime;
          const createTime = item.createTime;
          const endVal = validTime.charAt(validTime.length - 1);
          const fontVal = validTime.substring(0, validTime.length - 1);
          const now = new Date(createTime);
          if (endVal === 'y') {
            const year_date = now.setFullYear(now.getFullYear() + Number(fontVal));
            item.countValidityTime = this.$dateHelper.format(new Date(year_date), DateFormatString.DATE_FORMAT_STRING_SIMPLE);
          } else if (endVal === 'm') {
            const week_date = now.setMonth(now.getMonth() + Number(fontVal));
            item.countValidityTime = this.$dateHelper.format(new Date(week_date), DateFormatString.DATE_FORMAT_STRING_SIMPLE);
          } else if (endVal === 'd') {
            const day_date = now.setDate(now.getDate() + Number(fontVal));
            item.countValidityTime = this.$dateHelper.format(new Date(day_date), DateFormatString.DATE_FORMAT_STRING_SIMPLE);
          }
        }
        // 上一次登录时间
        if (item.lastLoginTime) {
          item.lastLoginTime = this.$dateHelper.format(new Date(item.lastLoginTime), DateFormatString.DATE_FORMAT_STRING);
        }
        // admin账号默认启用状态，不能被禁用操作
        if (item.userCode === 'admin') {
          item.isDisabled = true;
        }
      });
      // 解决nz-switch刚刚进页面的时候出现动画问题
      if (!this.tableConfig.showPagination) {
        setTimeout(() => {
          this.tableConfig.showPagination = true;
        });
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });

  }

  /**
   * 表格数据
   */
  private initTableConfig() {
    this.tableConfig = {
      primaryKey: '01-1',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '2200px', y: '340px'},
      noIndex: true,
      showSearchExport: true,
      notShowPrint: true,
      columnConfig: [
        // 选择
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 62},
        // 序号
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        // 账号
        {
          title: this.language.userCode, key: 'userCode', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        // 姓名
        {
          title: this.language.userName, key: 'userName', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 昵称
        {
          title: this.language.userNickname, key: 'userNickname', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 用户状态
        {
          title: this.language.userStatus, key: 'userStatus', width: 120, isShowSort: true,
          searchable: true, configurable: true,
          type: 'render',
          minWidth: 80,
          renderTemplate: this.userStatusTemp,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.language.disable, value: '0'},
              {label: this.language.enable, value: '1'}
            ]
          }
        },
        // 角色
        {
          title: this.language.role, key: 'role', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          type: 'render',
          renderTemplate: this.roleTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: this.roleArray
          }
        },
        // 单位/部门
        {
          title: this.language.unit, key: 'department', width: 200, configurable: true,
          searchKey: 'departmentNameList',
          searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.UnitNameSearch},
          type: 'render',
          renderTemplate: this.departmentTemp
        },
        // 手机号
        {
          title: this.language.phoneNumber, key: 'phoneNumber', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 邮箱
        {
          title: this.language.email, key: 'email', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 推送方式
        {
          title: this.language.pushType, key: 'pushType', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 地址
        {
          title: this.language.address, key: 'address', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 最后一次登录时间
        {
          title: this.language.lastLoginTime, key: 'lastLoginTime', width: 180, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // 最后一次登录IP
        {
          title: this.language.lastLoginIp, key: 'lastLoginIp', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 用户模式
        {
          title: this.language.loginType, key: 'loginType', width: 120, isShowSort: true,
          searchable: true, configurable: true,
          type: 'render',
          renderTemplate: this.loginTypeTemp,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.language.singleUser, value: '1'},
              {label: this.language.multiUser, value: '2'}
            ]
          }
        },
        // 最多用户数
        {
          title: this.language.maxUsers, key: 'maxUsers', width: 120, isShowSort: true, configurable: true
        },
        // 账户有效期
        {
          title: this.language.countValidityTime, key: 'countValidityTime', width: 150, configurable: true
        },
        // 备注
        {
          title: this.language.userDesc, key: 'userDesc', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 操作
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        }
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [
        // 表格头部新增按钮
        {
          text: '+  ' + this.language.addUser,
          permissionCode: '01-1-1',
          handle: (currentIndex) => {
            this.openAddUser();
          }
        },
        // 表格头部删除按钮
        {
          text: this.language.deleteHandle,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '01-1-3',
          handle: (data) => {
            this.flag = true;
            data.forEach(item => {
              if (item.userName === 'admin') {
                this.flag = false;
              }
            });
            if (!this.flag) {
              this.$message.info(this.language.defaultUserTips);
            }
            if (this.flag) {
              const ids = data.map(item => item.id);
              const params = {'firstArrayParameter': ids};
              this.$userService.deleteUser(params).subscribe((res: Result) => {
                if (res['code'] === 120210) {
                  this.$nzModalService.confirm({
                    nzTitle: this.language.deleteOnlineUserTips,
                    nzContent: '',
                    nzMaskClosable: false,
                    nzOkText: this.language.cancelText,
                    nzCancelText: this.language.okText,
                    nzOkType: 'danger',
                    nzOnOk: () => {
                    },
                    nzOnCancel: () => {
                      const onlineParams = {'firstArrayParameter': ids, 'flag': true};
                      this.$userService.deleteUser(onlineParams).subscribe((result: Result) => {
                        if (result.code === 0) {
                          this.$message.success(this.language.deleteOnlineUserSuccessTips);
                          this.goToFirstPage();
                        } else {
                          this.$message.error(this.language.deleteOnlineUserFailTips);
                        }
                      });
                    }
                  });
                } else if (res['code'] === 120220) {
                  this.$message.info(this.language.defaultUserTips);
                } else if (res['code'] === 120280) {
                  this.$message.info(res.msg);
                } else if (res['code'] === 120300) {
                  this.$message.info(res.msg);
                  this.goToFirstPage();
                } else if (res['code'] === 120540) {  // 已启用不能被删除
                  this.$message.info(res.msg);
                } else if (res['code'] === 125500) {  // 有工单的不能删
                  this.$message.info(res.msg);
                } else if (res['code'] === 0) {
                  this.$message.success(this.language.deleteUserSuccess);
                  this.goToFirstPage();
                } else {
                  this.$message.error(this.language.deleteUserFail);
                }
              });
            }

          }
        }
      ],
      operation: [
        // 查看区域
        {
          text: this.language.viewArea,
          className: 'fiLink-view-area',
          // permissionCode: '',
          handle: (currentIndex) => {
            this.$userService.queryUserInfoById(currentIndex.id).subscribe((res: Result) => {
              if (res.code === 120310) {
                this.$message.info(this.language.existTips);
                this.goToFirstPage();
              } else {
                this.$facilityUtilService.getArea().then((data) => {
                  this.areaNodes = data;
                  this.initAreaSelectorConfig(data);
                  this.queryAreaByDeptId(currentIndex.deptId);
                });
              }
            });
          }
        },
        // 重置密码
        {
          text: this.language.resetPassword,
          className: 'fiLink-password-reset',
          permissionCode: '01-1-4',
          handle: (data) => {
            this.$userService.queryUserInfoById(data.id).subscribe((res: Result) => {
              if (res.code === 120310) {
                this.$message.info(this.language.existTips);
                this.goToFirstPage();
              } else {
                this.userId = data.id;
                const params = {'userId': this.userId};
                this.$nzModalService.confirm({
                  nzTitle: this.language.resetPasswordTitle,
                  nzContent: this.language.resetPasswordContent + this.defaultPassWord,
                  nzMaskClosable: false,
                  nzOkText: this.language.cancelText,
                  nzCancelText: this.language.okText,
                  nzOkType: 'danger',
                  nzOnOk: () => {
                  },
                  nzOnCancel: () => {
                    this.$userService.restPassword(params).subscribe((result: Result) => {
                      if (result.code === 0) {
                        this.$message.success(this.language.resetSuccessTips);
                      } else {
                        this.$message.error(this.language.resetFailTips);
                      }
                    });
                  }
                });

              }
            });
          }
        },
        // 编辑
        {
          text: this.language.update,
          className: 'fiLink-edit',
          permissionCode: '01-1-2',
          handle: (currentIndex) => {
            this.$userService.queryUserInfoById(currentIndex.id).subscribe((res: Result) => {
              if (res.code === 120310) {
                this.$message.info(this.language.existTips);
                this.goToFirstPage();
              } else {
                this.openModifyUser(currentIndex.id);
              }
            });
          }
        },
        // 删除
        {
          text: this.language.deleteHandle,
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          permissionCode: '01-1-3',
          handle: (currentIndex) => {
            this.$userService.queryUserInfoById(currentIndex.id).subscribe((response: Result) => {
              if (response.code === 120310) {
                this.$message.info(this.language.existTips);
                this.goToFirstPage();
              } else {
                const userName = currentIndex.userName;
                if (userName && userName === 'admin') {
                  this.$message.info(this.language.defaultUserTips);
                  return;
                } else {
                  const params = {'firstArrayParameter': [currentIndex.id]};
                  this.$userService.deleteUser(params).subscribe((res: Result) => {
                    if (res['code'] === 120210) {
                      this.$nzModalService.confirm({
                        nzTitle: this.language.deleteOnlineUserTips,
                        nzContent: '',
                        nzMaskClosable: false,
                        nzOkText: this.language.cancelText,
                        nzCancelText: this.language.okText,
                        nzOkType: 'danger',
                        nzOnOk: () => {
                        },
                        nzOnCancel: () => {
                          const onlineParams = {'firstArrayParameter': [currentIndex.id], 'flag': true};
                          this.$userService.deleteUser(onlineParams).subscribe((result: Result) => {
                            if (result.code === 0) {
                              this.$message.success(this.language.deleteOnlineUserSuccessTips);
                              this.goToFirstPage();
                            } else {
                              this.$message.error(this.language.deleteOnlineUserFailTips);
                            }
                          });
                        }
                      });
                    } else if (res['code'] === 120220) {
                      this.$message.info(this.language.defaultUserTips);
                    } else if (res['code'] === 120280) {
                      this.$message.info(res.msg);
                    } else if (res['code'] === 120300) {
                      this.$message.info(res.msg);
                      this.goToFirstPage();
                    } else if (res['code'] === 120540) {  // 已启用不能被删除
                      this.$message.info(res.msg);
                    } else if (res['code'] === 125500) {  // 有工单的不能删
                      this.$message.info(res.msg);
                    } else if (res['code'] === 0) {
                      this.$message.success(this.language.deleteUserSuccess);
                      this.goToFirstPage();
                    } else {
                      this.$message.error(this.language.deleteUserFail);
                    }
                  });
                }
              }
            });
          }
        }
      ],
      leftBottomButtons: [
        // 表格左下启用按钮
        {
          text: this.language.enable,
          canDisabled: true,
          permissionCode: '01-1-5',
          handle: (data) => {
            const ids = [];
            const newArray = data.filter(item => item.userStatus === '0');
            newArray.forEach(item => {
              ids.push(item.id);
            });
            if (ids.length === 0) {
              this.$message.info(this.language.enableTips);
            } else {
              this._dataSet.forEach(item => {
                ids.forEach(child => {
                  if (child === item.id) {
                    item.clicked = true;
                  }
                });
              });
              this.$userService.updateUserStatus(1, ids)
                .subscribe((res: Result) => {
                  if (res.code === 0) {
                    this._dataSet.forEach(item => {
                      item.clicked = false;
                      ids.forEach(child => {
                        if (child === item.id) {
                          item.userStatus === '1' ? item.userStatus = '0' : item.userStatus = '1';
                        }
                      });
                    });
                    this.$message.success(`${this.language.userStatusIsEnabledSuccessfully}`);
                  } else {
                    this.$message.error(res.msg);
                  }
                });
            }
          }
        },
        // 表格左下停用按钮
        {
          text: this.language.disable,
          canDisabled: true,
          permissionCode: '01-1-5',
          handle: (data) => {
            const ids = [];
            const newArray = data.filter(item => item.userStatus === '1');
            newArray.forEach(item => {
              ids.push(item.id);
            });
            if (ids.length === 0) {
              this.$message.info(this.language.disableTips);
            } else {
              this._dataSet.forEach(item => {
                ids.forEach(child => {
                  if (child === item.id) {
                    item.clicked = true;
                  }
                });
              });
              this.$userService.updateUserStatus(0, ids)
                .subscribe((res: Result) => {
                  if (res.code === 0) {
                    this._dataSet.forEach(item => {
                      item.clicked = false;
                      ids.forEach(child => {
                        if (child === item.id) {
                          item.userStatus === '1' ? item.userStatus = '0' : item.userStatus = '1';
                        }
                      });
                    });
                    this.$message.success(`${this.language.userStatusDisabledSuccessfully}`);
                  } else {
                    this.$message.error(res.msg);
                  }
                });
            }
          }
        }
      ],
      rightTopButtons: [
        // 导入
        {
          text: this.language.importUser,
          iconClassName: 'fiLink-import',
          permissionCode: '01-1-6',
          handle: (data) => {
            const modal = this.$nzModalService.create({
              nzTitle: this.language.selectImport,
              nzContent: this.importTemp,
              nzOkType: 'danger',
              nzClassName: 'custom-create-modal',
              nzFooter: [
                {
                  label: this.language.okText,
                  onClick: () => {
                    this.importUser();
                    modal.destroy();
                  }
                },
                {
                  label: this.language.cancelText,
                  type: 'danger',
                  onClick: () => {
                    this.fileList = [];
                    modal.destroy();
                  }
                },
              ]
            });
          }
        },
        // 下载模板
        {
          text: this.language.downloadTemplate,
          iconClassName: 'fiLink-download',
          permissionCode: '01-1-7',
          handle: (data) => {
            this.downloadExcelFile();
          }
        },
        // 流水查询
        {
          text: this.language.flowSearch,
          iconClassName: 'fiLink-search-water',
          permissionCode: '01-1-8',
          handle: (data) => {
            const ids = [];
            data.forEach(item => {
              ids.push(item.id);
            });
            if (ids.length > 0) {
              const modal = this.$nzModalService.create({
                nzTitle: this.language.flowSearch,
                nzContent: this.selectLogTemp,
                nzOkType: 'danger',
                nzClassName: 'custom-create-modal',
                nzFooter: [
                  {
                    label: this.language.okText,
                    onClick: () => {
                      if (this.radioValue === 'operation') {
                        // 跳转到操作日志
                        this.$router.navigate(['/business/system/log'], {queryParams: {id: ids, name: 'user'}}).then();
                      } else if (this.radioValue === 'security') {
                        // 跳转到安全日志
                        this.$router.navigate(['/business/system/log/security'], {queryParams: {id: ids, name: 'user'}}).then();
                      }
                      modal.destroy();
                      this.radioValue = '';
                    }
                  },
                  {
                    label: this.language.cancelText,
                    type: 'danger',
                    onClick: () => {
                      modal.destroy();
                      this.radioValue = '';
                    }
                  },
                ]
              });
            } else {
              this.$message.info(this.language.selectedUsersTips);
            }
          }
        }
      ],
      // 排序事件
      sort: (event: SortCondition) => {
        const obj = {};
        obj['sortProperties'] = event.sortField;
        obj['sort'] = event.sortRule;
        if (obj['sortProperties'] === 'userNickname') {
          obj['sortProperties'] = 'user_nickname';
        }
        if (obj['sortProperties'] === 'userName') {
          obj['sortProperties'] = 'user_name';
        }
        if (obj['sortProperties'] === 'userCode') {
          obj['sortProperties'] = 'user_code';
        }
        if (obj['sortProperties'] === 'userStatus') {
          obj['sortProperties'] = 'user_status';
        }
        if (obj['sortProperties'] === 'loginType') {
          obj['sortProperties'] = 'login_type';
        }
        if (obj['sortProperties'] === 'lastLoginTime') {
          obj['sortProperties'] = 'last_login_time';
        }
        if (obj['sortProperties'] === 'lastLoginIp') {
          obj['sortProperties'] = 'last_login_ip';
        }
        if (obj['sortProperties'] === 'maxUsers') {
          obj['sortProperties'] = 'max_users';
        }
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      },
      // 搜索事件
      handleSearch: (event) => {
        const obj = {};
        event.forEach(item => {
          if (item.operator === 'gte') {
            obj['lastLoginTime'] = item.filterValue;
          } else if (item.operator === 'lte') {
            obj['lastLoginTimeEnd'] = item.filterValue;
          } else if (item.filterField === 'role') {
            obj['roleNameList'] = item.filterValue;
          } else {
            obj[item.filterField] = item.filterValue;
          }
        });
        if (event.length === 0) {
          this.selectUnitName = '';
        }
        // 没有值的时候重置已选数据
        // if (!event.departmentNameList) {
        //   this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, []);
        // }
        this.queryCondition.pageCondition.pageNum = 1;
        this.filterObject = obj;
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      },
      // 导出事件
      handleExport: (event) => {
        console.log(event);
        for (let i = 0; i < event.columnInfoList.length; i++) {
          if (event.columnInfoList[i].propertyName === 'area') {
            event.columnInfoList.splice(i, 1);
            i--;
          }
          if (event.columnInfoList[i].propertyName === 'userStatus') {
            event.columnInfoList[i].isTranslation = 1;
          }
          if (event.columnInfoList[i].propertyName === 'role') {
            event.columnInfoList[i].isTranslation = 1;
          }
          if (event.columnInfoList[i].propertyName === 'department') {
            event.columnInfoList[i].isTranslation = 1;
          }
          if (event.columnInfoList[i].propertyName === 'lastLoginTime') {
            event.columnInfoList[i].isTranslation = 1;
          }
          if (event.columnInfoList[i].propertyName === 'loginType') {
            event.columnInfoList[i].isTranslation = 1;
          }
          if (event.columnInfoList[i].propertyName === 'countValidityTime') {
            event.columnInfoList[i].isTranslation = 1;
          }
        }

        // 处理参数
        const body = {
          queryCondition: new QueryCondition(),
          columnInfoList: event.columnInfoList,
          excelType: event.excelType
        };
        const obj = {};
        // 处理选择的项目
        if (event.selectItem.length > 0) {
          body.queryCondition.bizCondition['ids'] = event.selectItem.map(item => item.id);
        } else {
          // 处理查询条件
          event.queryTerm.forEach(item => {
            if (item.filterField === 'lastLoginTime') {
              obj['lastLoginTime'] = item.filterValue;
              obj['lastLoginTimeRelation'] = item.operator;
            } else if (item.filterField === 'role') {
              obj['roleNameList'] = item.filterValue;
            } else {
              obj[item.filterField] = item.filterValue;
            }
          });
          body.queryCondition.bizCondition = obj;
        }
        this.exportUser(body);
      }
    };

  }


  /**
   * 跳转新增用户页面
   */
  public openAddUser() {
    this.$router.navigate(['business/user/add-user/add'], {
      queryParams: {minLength: this.accountMinLength}
    }).then();
  }

  /**
   * 跳转修改用户页面
   */
  public openModifyUser(userId) {
    this.$router.navigate(['business/user/modify-user/update'], {
      queryParams: {id: userId}
    }).then();
  }


  /**
   * 用户状态操作
   */
  clickSwitch(data) {
    let statusValue;
    this._dataSet.forEach(item => {
      if (item.id === data.id) {
        item.clicked = true;
      }
    });
    data.userStatus === '1' ? statusValue = '0' : statusValue = '1';
    this.$userService.updateUserStatus(statusValue, [data.id]).subscribe((res: Result) => {
      if (res.code === 0) {
        this._dataSet.forEach(item => {
          item.clicked = false;
          if (item.id === data.id) {
            item.userStatus === '1' ? item.userStatus = '0' : item.userStatus = '1';
          }
        });
      } else {
        this.$message.error(res.msg);
      }
    });
  }


  // /**
  //  * 查询所有部门(暂时废弃)
  //  */
  // queryAllDept() {
  //   this.$userService.queryTotalDepartment().subscribe((res: Result) => {
  //     if (res.data) {
  //       res.data.forEach(item => {
  //         this.deptArray.push({ 'label': item.deptName, 'value': item.deptName });
  //       });
  //     }
  //   });
  // }

  /**
   * 查询用户默认密码
   */
  queryUserPassWord() {
    this.$userService.queryPassword().subscribe((res: Result) => {
      this.defaultPassWord = res.data;
    });
  }

  // 跳第一页
  goToFirstPage() {
    this.queryCondition.pageCondition.pageNum = 1;
    this.refreshData();
  }

  // 上传文件
  beforeUpload = (file: UploadFile): boolean => {
    this.fileArray = this.fileArray.concat(file);
    if (this.fileArray.length > 1) {
      this.fileArray.splice(0, 1);
    }
    this.fileList = this.fileArray;
    const fileName = this.fileList[0].name;
    const index = fileName.lastIndexOf('\.');
    this.fileType = fileName.substring(index + 1, fileName.length);
    return false;
  };


  /**
   * 导入用户
   */
  importUser() {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    if (this.fileList.length === 1) {
      if (this.fileType === 'xls' || this.fileType === 'xlsx') {
        this.$userService.importUser(formData).subscribe((res: Result) => {
          this.fileList = [];
          this.fileType = null;
          if (res.code === 0) {
            this.$message.success(res.msg);
            this.refreshData();
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.$message.info(this.language.fileTypeTips);
      }

    } else {
      this.$message.info(this.language.selectFileTips);
    }

  }

  /**
   * 导出用户
   */
  exportUser(body) {
    this.$userService.exportUserList(body).subscribe((res: Result) => {
      if (res.code === 0) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    });
  }


  /**
   * 下载用户模板
   */
  downloadExcelFile() {
    this.$downloadService.downloadTemplate().subscribe((result: any) => {
      const data = result;
      const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none');
      a.setAttribute('href', objectUrl);
      a.setAttribute('download', 'userTemplate.xlsx');
      a.click();
      document.body.removeChild(a);
      // 释放URL地址
      URL.revokeObjectURL(objectUrl);
    });

  }


  /**
   * 查询账号安全策略
   */
  queryAccountSecurity() {
    this.$securityPolicyService.queryAccountSecurity().subscribe((res: Result) => {
      this.accountMinLength = res.data.minLength;
    });
  }


  /**
   * 查询角色
   */
  queryAllRoles() {
    this.$userService.queryAllRoles().subscribe((res: Result) => {
      const roleArr = res.data;
      if (roleArr) {
        roleArr.forEach(item => {
          this.roleArray.push({'label': item.roleName, 'value': item.roleName});
        });
      }

    });
  }


  /**
   * 初始化选择区域配置
   */
  private initAreaSelectorConfig(nodes) {
    this.areaSelectorConfig = {
      width: '500px',
      height: '300px',
      title: this.language.viewArea,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'checkbox',
          chkboxType: {'Y': 'ps', 'N': 'ps'}
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'areaId',
          },
          key: {
            name: 'areaName',
            children: 'children'
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
   * 区域选中结果
   */
  areaSelectChange(event) {
  }


  /**
   * 根据部门id获取区域详情
   */
  private queryAreaByDeptId(id) {
    this.$areaService.queryAreaByDeptId([id]).subscribe((result: Result) => {
      if (result.code === 0) {
        const areaInfo = result.data;
        const areaIds = [];
        areaInfo.forEach(item => {
          areaIds.push(item.areaId);
        });
        if (areaInfo.length > 0 && areaIds.length > 0) {
          // 递归设置区域的选择情况
          this.$userUtilService.setDeptAreaNodesStatus(this.areaNodes, areaIds);
          this.areaSelectorConfig.treeNodes = this.areaNodes;
          this.areaSelectVisible = true;
        } else {
          this.$message.info(this.language.areaInfoTips);
        }
      } else {
        this.$message.error(result.msg);
      }
    });
  }


  /**
   * 打开责任单位选择器
   */
  showModal(filterValue) {
    if (!this.selectUnitName) {
      this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, []);
    }
    this.filterValue = filterValue;
    if (!this.filterValue['filterValue']) {
      this.filterValue['filterValue'] = [];
    }
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isVisible = true;
  }

  /**
   * 责任单位选择结果
   * param event
   */
  selectDataChange(event) {
    let selectArr = [];
    let selectNameArr = [];
    this.selectUnitName = '';
    if (event.length > 0) {
      selectArr = event.map(item => {
        this.selectUnitName += `${item.deptName},`;
        return item.id;
      });
      selectNameArr = event.map(item => {
        return item.deptName;
      });
    } else {
    }
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    if (selectArr.length === 0) {
      this.filterValue['filterValue'] = null;
    } else {
      this.filterValue['filterValue'] = selectNameArr;
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
      title: `${this.areaLanguage.selectUnit}`,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.areaLanguage.deptName, key: 'deptName', width: 100,
        },
        {
          title: this.areaLanguage.deptLevel, key: 'deptLevel', width: 100,
        },
        {
          title: this.areaLanguage.parentDept, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }

  /**
   * 查询所有的区域
   */
  private queryDeptList() {
    this.$userService.queryAllDepartment().subscribe((result: Result) => {
      this.treeNodes = result.data || [];
    });
  }

}
