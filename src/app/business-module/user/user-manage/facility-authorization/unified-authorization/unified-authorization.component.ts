import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {Router} from '@angular/router';
import {NzI18nService, NzMessageService, NzTreeNode, DateHelperService, NzModalService} from 'ng-zorro-antd';
import {Result} from '../../../../../shared-module/entity/result';
import {FacilityAuthLanguageInterface} from '../../../../../../assets/i18n/facility-authorization/facilityAuth-language.interface';
import {FilterCondition, QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-opearte.service';
import {UserService} from '../../../../../core-module/api-service/user';
import {FacilityService} from '../../../../../core-module/api-service/facility/facility-manage';
import {FacilityUtilService} from '../../../../facility/share/service/facility-util.service';
import {DateFormatString} from '../../../../../shared-module/entity/dateFormatString';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {DeviceTypeCode, getDeployStatus, getDeviceStatus, getDeviceType, wellCover} from '../../../../facility/share/const/facility.config';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {UserUtilService} from '../../../user-util.service';
import {DoorNumber, getDoorNumber} from '../../../user.config';

@Component({
  selector: 'app-unified-authorization',
  templateUrl: './unified-authorization.component.html',
  styleUrls: ['./unified-authorization.component.scss']
})
export class UnifiedAuthorizationComponent implements OnInit {
  @ViewChild('authUserTemp') authUserTemp: TemplateRef<any>;
  @ViewChild('userTemp') userTemp: TemplateRef<any>;
  @ViewChild('authStatusTemp') authStatusTemp: TemplateRef<any>;
  @ViewChild('facilityListTemp') facilityListTemp: TemplateRef<any>;
  @ViewChild('deviceStatusTemp') deviceStatusTemp: TemplateRef<any>;
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  @ViewChild('doorLocksTemp') doorLocksTemp: TemplateRef<any>;
  @ViewChild('thTemplate') thTemplate: TemplateRef<any>;
  @ViewChild('termTemp') termTemp: TemplateRef<any>;
  language: FacilityAuthLanguageInterface;
  facilityLanguage: FacilityLanguageInterface;
  pageBean: PageBean = new PageBean(10, 1, 1);
  tableConfig: TableConfig;
  queryCondition: QueryCondition = new QueryCondition();
  filterObject = {};
  facilityDataSet = [];
  facilityPageBean: PageBean = new PageBean(10, 1, 1);
  facilityTableConfig: TableConfig;
  facilityQueryCondition: QueryCondition = new QueryCondition();
  formColumn: FormItem[] = [];
  formStatus: FormOperate;
  // 表格总数据
  _dataSet = [];
  // 拷贝对象
  query_Conditions = {};
  // 拷贝对象
  _query_Conditions_ = {};
  authName: string = '';
  // 表格数据
  deviceIds = [];
  devicesAndDoorsData = [];

  constructor(public $router: Router,
              public $nzI18n: NzI18nService,
              public $message: FiLinkModalService,
              public $userService: UserService,
              public $facilityUtilService: FacilityUtilService,
              public $dateHelper: DateHelperService,
              private $facilityService: FacilityService,
              private $modal: NzModalService,
              private $userUtilService: UserUtilService) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('facilityAuth');
    this.facilityLanguage = this.$nzI18n.getLocaleData('facility');
    this.initTableConfig();
    this.refreshData();
  }


  pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }


  /**
   * 获取统一授权列表信息
   */
  refreshData() {
    this.tableConfig.isLoading = true;
    this.$userService.queryUnifyAuthList(this.queryCondition).subscribe((res: Result) => {
      this.tableConfig.isLoading = false;
      this._dataSet = res.data.data;
      this.pageBean.Total = res.data.totalCount;
      this.pageBean.pageIndex = res.data.pageNum;
      this.pageBean.pageSize = res.data.size;
      this._dataSet.forEach(item => {
        // 授权时间
        if (item.createTime) {
          item.createTime = this.$dateHelper.format(new Date(item.createTime), DateFormatString.DATE_FORMAT_STRING);
        }
        // 权限生效时间
        if (item.authEffectiveTime) {
          item.authEffectiveTime = this.$dateHelper.format(new Date(item.authEffectiveTime), DateFormatString.DATE_FORMAT_STRING);
        }
        // 权限失效时间
        if (item.authExpirationTime) {
          item.authExpirationTime = this.$dateHelper.format(new Date(item.authExpirationTime), DateFormatString.DATE_FORMAT_STRING);
        }

      });
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }


  /**
   * 刷新设施列表数据
   */
  private _refreshData(body?) {
    this.facilityTableConfig.isLoading = true;
    this.$facilityService.deviceListByPage(body || this.facilityQueryCondition).subscribe((result: Result) => {
      this.facilityPageBean.Total = result.totalCount;
      this.facilityPageBean.pageIndex = result.pageNum;
      this.facilityPageBean.pageSize = result.size;
      this.facilityTableConfig.isLoading = false;
      this.facilityDataSet = result.data;
      this.facilityDataSet.forEach(item => {
        item.areaName = item.areaInfo ? item.areaInfo.areaName : '';
        item['_deviceType'] = item.deviceType;
        item.deviceType = getDeviceType(this.$nzI18n, item.deviceType);
        item['_deviceStatus'] = item.deviceStatus;
        item.deviceStatus = getDeviceStatus(this.$nzI18n, item.deviceStatus);
        item.deployStatus = getDeployStatus(this.$nzI18n, item.deployStatus);
        item['iconClass'] = CommonUtil.getFacilityIconClassName(item._deviceType);
        // 门锁
        item._lockList = this.getLockList(item.lockList, item._deviceType);
        item['deviceStatusIconClass'] = FacilityUtilService.getFacilityDeviceStatusClassName(item._deviceStatus).iconClass;
        item['deviceStatusColorClass'] = FacilityUtilService.getFacilityDeviceStatusClassName(item._deviceStatus).colorClass;
        setTimeout(() => {
          if (this.devicesAndDoorsData.length > 0 && item._lockList && item._lockList.length > 0) {
            for (let i = 0; i < this.devicesAndDoorsData.length; i++) {
              const iDeviceId = this.devicesAndDoorsData[i].deviceId;
              const iDoorId = this.devicesAndDoorsData[i].doorId;
              for (let t = 0; t < item._lockList.length; t++) {
                if (iDeviceId === item._lockList[t].deviceId && iDoorId === item._lockList[t].value) {
                  // 勾选数据
                  item._lockList[t].checked = true;
                }
              }
            }
          }
        }, 0);
      });
    }, () => {
      this.facilityTableConfig.isLoading = false;
    });
  }


  facilityPageChange(event) {
    this.facilityQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.facilityQueryCondition.pageCondition.pageSize = event.pageSize;
    this._refreshData();
  }

  /**
   * 统一授权列表
   */
  private initTableConfig() {
    this.tableConfig = {
      primaryKey: '01-5-1',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '340px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 62},
        {
          // 序号
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          // 授权任务名称
          title: this.language.name, key: 'name', width: 200, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          // 授权用户
          title: this.language.authUser, key: 'authUser', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.authUserTemp,
          searchConfig: {type: 'input'}
        },
        {
          // 期限
          title: this.language.term, key: 'authExpirationTime', width: 100,
          type: 'render', configurable: true,
          renderTemplate: this.termTemp
        },
        {
          // 授权时间
          title: this.language.createTime, key: 'createTime', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        {
          // 被授权用户
          title: this.language.user, key: 'user', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.userTemp,
          searchConfig: {type: 'input'}
        },
        {
          // 权限生效时间
          title: this.language.authEffectiveTime, key: 'authEffectiveTime', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        {
          // 权限失效时间
          title: this.language.authExpirationTime, key: 'authExpirationTime', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        {
          // 权限
          title: this.language.authStatus, key: 'authStatus', width: 100, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.authStatusTemp,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.language.takeEffect, value: 2},
              {label: this.language.prohibit, value: 1}
            ]
          },
          handleFilter: ($event) => {
          },
        },
        {
          // 备注
          title: this.language.remark, key: 'remark', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [
        {
          // 新增
          text: '+  ' + this.language.add,
          permissionCode: '01-5-1-2',
          handle: (currentIndex) => {
            this.$router.navigate(['business/user/unified-details/add']).then();
          }
        },
        {
          // 删除
          text: this.language.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          confirmContent: this.language.deleteAuthorizationTaskTips,
          canDisabled: true,
          permissionCode: '01-5-1-4',
          handle: (data) => {
            const ids = [];
            data.map(item => {
              ids.push(item.id);
            });
            this.$userService.deleteUnifysAuthByIds(ids).subscribe((res: Result) => {
              if (res.code === 0) {
                this.$message.success(res.msg);
                this.goToFirstPage();
              } else if (res.code === 120360) {
                this.$message.info(res.msg);
                // 当前任务时间未过期，不可删除
              } else if (res.code === 120370) {
                this.$message.info(res.msg);
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        }
      ],
      operation: [
        {
          // 编辑
          text: this.language.modify,
          className: 'fiLink-edit',
          permissionCode: '01-5-1-3',
          handle: (currentIndex) => {
            this.$userService.queryUnifyAuthById(currentIndex.id).subscribe((res: Result) => {
              if (res.code === 0) {
                this.openUnifiedDetails(currentIndex.id);
              } else if (res.code === 120610) {
                this.$message.info(this.language.AuthExistTips);
                this.goToFirstPage();
              }
            });

          }
        },
        {
          // 授权范围
          text: this.language.authRange,
          className: 'fiLink-authority',
          permissionCode: '01-5-1-7',
          handle: (currentIndex) => {
            this.initFacilityTableConfig();
            this.$userService.queryUnifyAuthById(currentIndex.id).subscribe((res: Result) => {
              if (res.code === 0) {
                // 置空
                this.facilityQueryCondition.filterConditions = [];
                this.queryAuthInfoById(currentIndex.id);
              } else if (res.code === 120610) {
                this.$message.info(this.language.AuthExistTips);
                this.goToFirstPage();
              }
            });
          }
        },
        {
          // 删除
          text: this.language.delete,
          needConfirm: true,
          confirmContent: this.language.deleteAuthorizationTaskTips,
          className: 'fiLink-delete red-icon',
          permissionCode: '01-5-1-4',
          handle: (currentIndex) => {
            this.$userService.queryUnifyAuthById(currentIndex.id).subscribe((result: Result) => {
              if (result.code === 0) {
                this.$userService.deleteUnifysAuthById(currentIndex.id).subscribe((res: Result) => {
                  if (res.code === 0) {
                    this.$message.success(res.msg);
                    this.goToFirstPage();
                  } else if (res.code === 120360) {
                    this.$message.info(res.msg);
                    // 当前任务时间未过期，不可删除
                  } else if (res.code === 120370) {
                    this.$message.info(res.msg);
                  } else {
                    this.$message.error(res.msg);
                  }
                });
              } else if (result.code === 120610) {
                this.$message.info(this.language.AuthExistTips);
                this.goToFirstPage();
              }
            });
          }
        }
      ],
      leftBottomButtons: [
        {
          // 启用
          text: this.language.takeEffect,
          canDisabled: true,
          permissionCode: '01-5-1-6',
          handle: (data) => {
            if (data.length > 0) {
              const ids = [];
              const newArray = data.filter(item => item.authStatus === 1);
              newArray.forEach(item => {
                ids.push(item.id);
              });
              const params = {idArray: ids, authStatus: 2};
              if (ids.length === 0) {
                this.$message.info(this.language.effectStatusTips);
              } else {
                this.$userService.batchModifyUnifyAuthStatus(params).subscribe((res: Result) => {
                  if (res.code === 0) {
                    this.$message.success(res.msg);
                    this.goToFirstPage();
                  } else if (res.code === 120360) {
                    this.$message.info(res.msg);
                  } else {
                    this.$message.error(res.msg);
                  }
                });
              }
            } else {
              return;
            }
          }
        },
        {
          // 禁用
          text: this.language.prohibit,
          canDisabled: true,
          permissionCode: '01-5-1-6',
          handle: (data) => {
            if (data.length > 0) {
              const ids = [];
              const newArray = data.filter(item => item.authStatus === 2);
              newArray.forEach(item => {
                ids.push(item.id);
              });
              const params = {idArray: ids, authStatus: 1};
              if (ids.length === 0) {
                this.$message.info(this.language.disabledStatusTips);
              } else {
                this.$userService.batchModifyUnifyAuthStatus(params).subscribe((res: Result) => {
                  if (res.code === 0) {
                    this.$message.success(res.msg);
                    this.goToFirstPage();
                  } else if (res.code === 120360) {
                    this.$message.info(res.msg);
                  } else {
                    this.$message.error(res.msg);
                  }
                });
              }
            } else {
              return;
            }
          }
        },
      ],
      sort: (event: SortCondition) => {
        const obj = {};
        obj['sortProperties'] = event.sortField;
        obj['sort'] = event.sortRule;
        if (obj['sortProperties'] === 'authUser') {
          obj['sortProperties'] = 'authUserName';
        }
        if (obj['sortProperties'] === 'user') {
          obj['sortProperties'] = 'userName';
        }
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      },
      handleSearch: (event) => {
        const obj = {};
        event.forEach(item => {
          if (item.operator === 'gte' && item.filterField === 'createTime') {
            obj['createTime'] = item.filterValue;
          } else if (item.operator === 'gte' && item.filterField === 'authEffectiveTime') {
            obj['authEffectiveTime'] = item.filterValue;
          } else if (item.operator === 'gte' && item.filterField === 'authExpirationTime') {
            obj['authExpirationTime'] = item.filterValue;
          } else if (item.operator === 'lte' && item.filterField === 'createTime') {
            obj['createTimeEnd'] = item.filterValue;
          } else if (item.operator === 'lte' && item.filterField === 'authEffectiveTime') {
            obj['authEffectiveTimeEnd'] = item.filterValue;
          } else if (item.operator === 'lte' && item.filterField === 'authExpirationTime') {
            obj['authExpirationTimeEnd'] = item.filterValue;
          } else if (item.filterField === 'authUser') {
            obj['authUserName'] = item.filterValue;
          } else if (item.filterField === 'user') {
            obj['userName'] = item.filterValue;
          } else {
            obj[item.filterField] = item.filterValue;
          }
        });
        this.queryCondition.pageCondition.pageNum = 1;
        this.filterObject = obj;
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      }
    };
  }

  /**
   * 授权范围列表
   */
  private initFacilityTableConfig() {
    // 设施列表配置
    this.facilityTableConfig = {
      primaryKey: '03-1',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1504px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      notShowPrint: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          // 名称
          title: this.facilityLanguage.deviceName, key: 'deviceName', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          // 类型
          title: this.facilityLanguage.deviceType, key: 'deviceType', width: 200,
          configurable: true,
          type: 'render',
          renderTemplate: this.deviceTypeTemp,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: getDeviceType(this.$nzI18n), label: 'label', value: 'code'}
        },
        {
          // 门锁
          title: this.language.lockList, key: '_lockList', width: 340,
          type: 'render',
          minWidth: 340,
          // thTemplate: this.thTemplate,
          renderTemplate: this.doorLocksTemp
        },
        {
          // 状态
          title: this.facilityLanguage.deviceStatus, key: 'deviceStatus', width: 100,
          type: 'render',
          renderTemplate: this.deviceStatusTemp,
          configurable: true,
          isShowSort: true,
          searchable: true,
          minWidth: 80,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: getDeviceStatus(this.$nzI18n), label: 'label', value: 'code'}
        },
        {
          // 资产编号
          title: this.facilityLanguage.deviceCode, key: 'deviceCode', width: 200,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          // 所属区域
          title: this.facilityLanguage.parentId, key: 'areaName', width: 200,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        {
          // 部署状态
          title: this.facilityLanguage.deployStatus, key: 'deployStatus', configurable: true, width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: getDeployStatus(this.$nzI18n), label: 'label', value: 'code'}
        },
        {
          // 备注
          title: this.facilityLanguage.remarks, key: 'remarks', width: 100,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          // 操作
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      rightTopButtons: [],
      sort: (event: SortCondition) => {
        this.facilityQueryCondition.sortCondition.sortField = event.sortField;
        this.facilityQueryCondition.sortCondition.sortRule = event.sortRule;
        this._refreshData();
      },
      handleSearch: (event) => {
        this.facilityQueryCondition.pageCondition.pageNum = 1;
        if (event.length === 0) {
          this._refreshData(this.query_Conditions);
          this._query_Conditions_['filterConditions'] = [];
          this._query_Conditions_ = CommonUtil.deepClone(this.query_Conditions);
        } else {
          this._query_Conditions_['filterConditions'] = [];
          this._query_Conditions_ = CommonUtil.deepClone(this.query_Conditions);
          event.forEach(item => {
            this._query_Conditions_['filterConditions'].push(item);
          });
          this._refreshData(this._query_Conditions_);
        }
      }
    };
  }

  /**
   * 跳转修改统一授权页面
   */
  private openUnifiedDetails(userId) {
    this.$router.navigate(['business/user/unified-details/update'], {
      queryParams: {id: userId}
    }).then();
  }


  /**
   * 跳转到第一页
   */
  goToFirstPage() {
    this.queryCondition.pageCondition.pageNum = 1;
    this.refreshData();
  }


  checkDoorOptions(event) {
  }


  /**
   *设施下的门锁
   */
  getLockList(data, deviceType) {
    if (data && data.length > 0) {
      const lockData = [];
      data.forEach(e => {
        // 当设施为人井的时候过滤掉外盖
        if (deviceType === DeviceTypeCode.well && e.doorNum === wellCover.outCover) {
        } else {
          lockData.push(
            {
              label: getDoorNumber(this.$nzI18n, e.doorNum),
              value: e.doorNum,
              checked: false,
              deviceId: e.deviceId
            }
          );
        }

      });
      lockData.sort(this.$userUtilService.sort);
      return lockData;
    }
  }

  // 查询单个统一授权信息
  queryAuthInfoById(id) {
    // 先置空
    this.deviceIds = [];
    this.$userService.queryUnifyAuthById(id).subscribe((res: Result) => {
      this.devicesAndDoorsData = res.data.authDeviceList;
      const data = res.data.authDeviceList;
      data.forEach(item => {
        this.deviceIds.push(item.deviceId);
      });
      // 创建模态框
      const modal = this.$modal.create({
        nzTitle: this.language.unifiedAuthRange,
        nzContent: this.facilityListTemp,
        nzOkText: this.language.cancel,
        nzCancelText: this.language.confirm,
        nzOkType: 'danger',
        nzClassName: 'custom-create-modal',
        nzMaskClosable: false,
        nzWidth: '1000',
        nzFooter: [
          {
            label: this.language.confirm,
            show: false,
            onClick: () => {
              this.facilityQueryCondition.pageCondition.pageNum = 1;
              this.devicesAndDoorsData = [];
              modal.destroy();
            }
          },
          {
            label: this.language.cancel,
            show: false,
            type: 'danger',
            onClick: () => {
              this.facilityQueryCondition.pageCondition.pageNum = 1;
              this.devicesAndDoorsData = [];
              modal.destroy();
            }
          },
        ]
      });
      //  创建查询条件
      const query_Conditions = [
        {
          filterField: 'deviceId',
          operator: 'in',
          filterValue: this.deviceIds,
        }
      ];
      query_Conditions.forEach(item => {
        this.facilityQueryCondition.filterConditions.push(item);
      });
      this._refreshData();
      // 用户过滤时重置
      this.query_Conditions = CommonUtil.deepClone(this.facilityQueryCondition);
      // 用户过滤时重置
      this._query_Conditions_ = CommonUtil.deepClone(this.facilityQueryCondition);
    });
  }


  /**
   * 未过期样式检测
   */
  unexpiredCheck(time) {
    const nowTime = CommonUtil.getTimeStamp(new Date());
    const expirationTime = CommonUtil.getTimeStamp(new Date(time));
    if (expirationTime > nowTime) {
      return true;
    }
  }

  /**
   *过期样式检测
   */
  expiredCheck(time) {
    const nowTime = CommonUtil.getTimeStamp(new Date());
    const expirationTime = CommonUtil.getTimeStamp(new Date(time));
    if (expirationTime < nowTime) {
      return true;
    }
  }

  /**
   * 长期有效样式检测
   */
  longTermCheck(time) {
    if (time === null) {
      return true;
    }
  }


  /**
   * 检测授权时间是否过期
   */
  checkExpirationTime(time) {
    const unexpired = this.language.config.unexpired;
    const expired = this.language.config.expired;
    const nowTime = CommonUtil.getTimeStamp(new Date());
    const expirationTime = CommonUtil.getTimeStamp(new Date(time));
    try {
      if (time) {
        if (expirationTime > nowTime) {
          return unexpired;
        } else {
          return expired;
        }
      } else {
        return unexpired;
      }
    } catch (err) {
    }
  }


}
