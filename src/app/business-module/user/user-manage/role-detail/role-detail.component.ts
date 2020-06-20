import {Component, OnInit, TemplateRef, ViewChild, OnDestroy} from '@angular/core';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import {RoleLanguageInterface} from '../../../../../assets/i18n/role/role-language.interface';
import {UserService} from '../../../../core-module/api-service/user/user-manage/user.service';
import {ActivatedRoute, Router, Params} from '@angular/router';
import {Result} from '../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {UserUtilService} from '../../user-util.service';
import {rightTreeNodes} from '../role-list/role.config';
import {DeviceTypeCode, getDeviceType} from '../../../facility/share/const/facility.config';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {CommonUtil} from '../../../../shared-module/util/common-util';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss']
})

export class RoleDetailComponent implements OnInit, OnDestroy {
  language: RoleLanguageInterface;
  formColumn: FormItem[] = [];
  formStatus: FormOperate;
  pageType = 'add';
  pageTitle: string;
  roleId: string;
  isLoading: boolean = false;
  roleInfo = {};
  permissionIds = [];  // 权限id
  deviceTypeIds = [];  // 设施id
  @ViewChild('operateSelector') operateSelector: TemplateRef<any>;
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  permissionName = ''; // 操作权限名称
  leftNodes: any = [];
  rightNodes: any = [];
  _rightNodes: any = [];
  roleSelectorVisible = false;
  roleSelectorConfig = new TreeSelectorConfig();
  pageLoading = false;

  constructor(
    private $nzI18n: NzI18nService,
    private $userService: UserService,
    private $activatedRoute: ActivatedRoute,
    private $router: Router,
    private $message: FiLinkModalService,
    private $userUtilService: UserUtilService,
    private $ruleUtil: RuleUtil
  ) {
  }


  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('role');
    this.$activatedRoute.params.subscribe((params: Params) => {
      this.pageType = params.type;
    });
    this.pageTitle = this.getPageTitle(this.pageType);
    this.pageLoading = true;
    if (this.pageType !== 'add') {
      this.$activatedRoute.queryParams.subscribe(params => {
        this.roleId = params.id;
        this.getPermission().then((data) => {
          this.leftNodes = data;
          this.$userUtilService.getAllDeviceType().then(_data => {
            this.pageLoading = false;
            this.rightNodes = _data;
            this.initRoleSelectorConfig(this.leftNodes, this.rightNodes);
            this.getRoleInfoById(this.roleId);  // 获取单个角色信息
          });
        });
      });
    } else {
      this.getPermission().then((data: any[]) => {
        this.leftNodes = data;
        this.$userUtilService.getAllDeviceType().then(_data => {
          this.pageLoading = false;
          this.rightNodes = _data;
          this.$userUtilService.setRoleTreeNodesStatus(this.leftNodes, []);
          this.$userUtilService.setFacilityTreeNodesStastus(this.rightNodes, []);
          this.initRoleSelectorConfig(this.leftNodes, this.rightNodes);
        });
      });
    }
    this.initColumn();
  }


  queryTreeNode(nodes) {
    this.leftNodes = nodes.map(item => {
      item.name = this.$nzI18n.getLocaleData('setRoleTree')[item.id];
      return item;
      if (item.childPermissionList && item.childPermissionList.length > 0) {
        this.queryTreeNode(item.childPermissionList);
      }
    });
    if (nodes.childPermissionList) {
      this.queryTreeNode(nodes.childPermissionList);
    }
  }


  /**
   * 获取顶级权限
   */
  private getPermission() {
    return new Promise((resolve) => {
      this.$userService.queryTopPermission().subscribe((result: Result) => {
        const data = result.data || [];
        resolve(data);
      });
    });
  }


  formInstance(event) {
    this.formStatus = event.instance;
  }


  /**
   *打开操作模态框
   */
  showSelectorModal() {
    this.roleSelectorVisible = true;
  }


  private initColumn() {
    this.formColumn = [
      {
        label: this.language.roleName,
        key: 'roleName',
        type: 'input',
        require: true,
        rule: [{required: true}, {maxLength: 32},
          this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          // {
          //   asyncRule: (control: FormControl) => {
          //     const params = {
          //       'pageCondition': {
          //         'pageNum': 1,
          //         'pageSize': 10
          //       },
          //       'filterConditions': [{
          //         'filterField': 'role_name',
          //         'operator': 'eq',
          //         'filterValue': control.value
          //       }]
          //     };
          //     return Observable.create(observer => {
          //       this.$userService.verifyRoleInfo(params).subscribe((res: Result) => {
          //         if (res['code'] === 0) {
          //           if (res.data.length === 0) {
          //             observer.next(null);
          //             observer.complete();
          //           } else if (res.data.length > 0) {
          //             if (res.data[0].id === this.roleId) {
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
          //   asyncCode: 'duplicated', msg: this.language.roleNameTips2
          // }
          this.$ruleUtil.getNameAsyncRule(value => this.$userService.verifyRoleInfo(
            {
              'pageCondition': {
                'pageNum': 1,
                'pageSize': 10
              },
              'filterConditions': [{
                'filterField': 'role_name',
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
                  if (res.data[0].id === this.roleId) {
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
        modelChange: (controls, $event, key) => {
        },
        openChange: (a, b, c) => {
        },
      },
      {
        label: this.language.permissionAndFacility, key: 'permissionIds', type: 'custom',
        require: false,
        template: this.operateSelector,
        modelChange: (controls, $event, key) => {
        },
        openChange: (a, b, c) => {
        },
        rule: [],
        asyncRules: []
      },
      {
        label: this.language.remark,
        key: 'remark',
        type: 'input',
        require: false,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      }
    ];
  }


  private getPageTitle(type): string {
    let title;
    switch (type) {
      case 'add':
        title = `${this.language.addUser} ${this.language.role}`;
        break;
      case 'update':
        title = `${this.language.update} ${this.language.role}`;
        break;
    }
    return title;
  }

  goBack() {
    this.$router.navigate(['/business/user/role-list']).then();
  }

  /**
   *新增、修改角色
   */
  submit() {
    this.isLoading = true;
    const roleObj = this.formStatus.getData();
    if (!(!(JSON.stringify(this.roleInfo) === '{}') && this.roleInfo['defaultRole'] && this.roleInfo['defaultRole'] === 1)) {
      roleObj.roleName = CommonUtil.trim(roleObj.roleName);  // 去前后空格
    }
    if (this.pageType === 'add') {
      roleObj.deviceTypeIds = this.deviceTypeIds;
      this.$userService.addRole(roleObj).subscribe((res: Result) => {
        this.isLoading = false;
        if (res['code'] === 0) {
          this.$message.success(res['msg']);
          this.$router.navigate(['/business/user/role-list']).then();
        } else {
          this.$message.error(res['msg']);
        }
      });

    } else if (this.pageType === 'update') {
      if (this.roleInfo['defaultRole'] === 1) {
        roleObj.defaultRole = 1;
      } else {
        roleObj.defaultRole = 0;
      }
      roleObj.id = this.roleId;
      roleObj.deviceTypeIds = this.deviceTypeIds;
      this.$userService.queryRoleInfoById(this.roleId).subscribe((result: Result) => {
        if (result.code === 0) {
          this.$userService.modifyRole(roleObj).subscribe((res: Result) => {
            this.isLoading = false;
            if (res['code'] === 0) {
              this.$message.success(res['msg']);
              this.$router.navigate(['/business/user/role-list']).then();
            } else {
              this.$message.error(res['msg']);
            }
          });
        } else if (result.code === 120610) {
          this.isLoading = false;
          this.$message.info(this.language.roleExistTips);
          this.$router.navigate(['/business/user/role-list']).then();
        }
      });
    }

  }


  /**
   * 获取单个角色信息
   */
  getRoleInfoById(roleId) {
    this.$userService.queryRoleInfoById(roleId).subscribe((res: Result) => {
      const roleInfo = res.data;
      this.roleInfo = roleInfo;
      if (roleInfo.defaultRole === 1) {
        this.formStatus.group.controls['roleName'].disable();
      }
      const permissionSelectData = roleInfo.permissionList;
      const facilitySelectData = roleInfo.roleDevicetypeList;
      const authorityIds = [];   // 角色权限id
      const facilityIds = [];    // 设施id
      this.$userUtilService.queryTreeNodeListId(permissionSelectData, authorityIds);
      this.$userUtilService.queryTreeNodeFacilityId(facilitySelectData, facilityIds);
      this.deviceTypeIds = facilityIds;
      roleInfo.permissionIds = authorityIds;
      this.formStatus.resetData(roleInfo);
      // 递归设置角色权限的选择情况
      this.$userUtilService.setRoleTreeNodesStatus(this.leftNodes, authorityIds);
      // 递归设置设施权限的选择情况
      this.$userUtilService.setFacilityTreeNodesStastus(this.rightNodes, this.deviceTypeIds);
    });
  }

  /**
   * 初始化选择角色权限配置
   */
  initRoleSelectorConfig(leftNodes, rightNodes) {
    this.roleSelectorConfig = {
      width: '800px',
      height: '300px',
      title: this.language.permissionAndFacilities,
      treeLeftSetting: {
        check: {
          enable: true,
          chkStyle: 'checkbox',
          chkboxType: {'Y': 'ps', 'N': 's'},
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
          },
          key: {
            name: 'name',
            children: 'childPermissionList'
          },
        },
        view: {
          showIcon: false,
          showLine: false
        }
      },
      treeRightSetting: {
        check: {
          enable: true,
          chkStyle: 'checkbox',
          chkboxType: {'Y': 'ps', 'N': 's'},
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'deviceTypeId',
          },
          key: {
            name: 'name',
            children: 'childDeviceTypeList'
          },
        },
        view: {
          showIcon: false,
          showLine: false
        }
      },
      rightTitle: this.language.facilities,
      rightNodes: rightNodes,
      leftTitle: this.language.operatePermission,
      leftNodes: leftNodes
    };
  }


  /**
   * 操作权限、设施选中结果
   */
  selectDataChange(event) {
    // 左边树形节点
    if (event.left && event.left.length > 0) {
      const leftData = event.left;
      const permissionIds = [];
      leftData.forEach(item => {
        permissionIds.push(item.id);
      });
      this.$userUtilService.resetLeftTreeNodeStatus(this.leftNodes); // 改变状态前，先重置左树的勾选状态
      this.$userUtilService.setRoleTreeNodesStatus(this.leftNodes, permissionIds);
      this.formStatus.resetControlData('permissionIds', permissionIds);
    } else {
      this.$userUtilService.setRoleTreeNodesStatus(this.leftNodes, []);
      this.formStatus.resetControlData('permissionIds', []);
    }
    // 右边树形节点
    if (event.right && event.right.length > 0) {
      const rightData = event.right;
      this.deviceTypeIds = [];
      rightData.forEach(item => {
        this.deviceTypeIds.push(item.deviceTypeId);
      });
      this.$userUtilService.resetRightTreeNodeStatus(this.rightNodes);  // 改变状态前，先重置右树的勾选状态
      this.$userUtilService.setFacilityTreeNodesStastus(this.rightNodes, this.deviceTypeIds);
    } else {
      this.deviceTypeIds = [];
      this.$userUtilService.setFacilityTreeNodesStastus(this.rightNodes, []);
    }

  }


  ngOnDestroy() {
    // 退出后重置勾选状态
    this.$userUtilService.resetLeftTreeNodeStatus(this.leftNodes);
    this.$userUtilService.resetRightTreeNodeStatus(this.rightNodes);
  }


}


