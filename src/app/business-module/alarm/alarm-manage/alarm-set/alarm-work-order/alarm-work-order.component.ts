import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {ActivatedRoute, Router} from '@angular/router';
import {DateHelperService, NzI18nService, NzModalService} from 'ng-zorro-antd';
import {AlarmService} from '../../../../../core-module/api-service/alarm';
import {Result} from '../../../../../shared-module/entity/result';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmStoreService} from '../../../../../core-module/store/alarm.store.service';
import {DisableAndEnable, getAlarmType, getDeviceType} from '../../../../facility/share/const/facility.config';
import {AlarmNameConfig, AreaConfig, UnitConfig} from 'src/app/shared-module/component/alarm/alarmSelectorConfig';
import {InspectionLanguageInterface} from '../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {TreeSelectorConfig} from '../../../../../shared-module/entity/treeSelectorConfig';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {FacilityUtilService} from '../../../../facility';
import {UserService} from '../../../../../core-module/api-service/user/user-manage';

/**
 * 告警设置-告警转工单
 */
@Component({
  selector: 'app-alarm-work-order',
  templateUrl: './alarm-work-order.component.html',
  styleUrls: ['./alarm-work-order.component.scss']
})

export class AlarmWorkOrderComponent implements OnInit {

  _dataSet = [];
  pageBean: PageBean = new PageBean(10, 1, 1);
  tableConfig: TableConfig;
  queryCondition: QueryCondition = new QueryCondition();
  public language: AlarmLanguageInterface;
  public inspectionLanguage: InspectionLanguageInterface; // 国际化
  public facilityLanguage: FacilityLanguageInterface;
  treeNodes = [];
  responsibleUnitIsVisible = false;
  selectUnitName;
  treeSelectorConfig: TreeSelectorConfig;
  private filterValue: any;
  private treeSetting: any;
  filterEvent;
  // 区域
  areaList = {
    ids: [],
    name: ''
  };
  // 责任单位
  unitList = {
    ids: [],
    name: ''
  };
  areaConfig: AreaConfig;
  alarmNameConfig: AlarmNameConfig;
  unitConfig: UnitConfig;
  // 勾选的告警名称
  _checkAlarmName = {
    name: '',
    ids: []
  };
  checkDisableEnableData;
  // 期待完工用时
  completionTimeInputValue; // 期待完工用时输入值
  completionTimeSelectedValue = 'eq';
  @ViewChild('isNoStartTemp') isNoStartTemp: TemplateRef<any>;
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  @ViewChild('areaSelector') private areaSelectorTemp;
  @ViewChild('alarmName') private alarmName;
  @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  // @ViewChild('completionTime') private completionTime;
  @ViewChild('completionTime') completionTimeTemp: TemplateRef<any>;     // 期待完工用时

  constructor(public $router: Router,
              public $nzI18n: NzI18nService,
              public $alarmService: AlarmService,
              public $message: FiLinkModalService,
              public $active: ActivatedRoute,
              public $alarmStoreService: AlarmStoreService,
              private $dateHelper: DateHelperService,
              private $userService: UserService,
              private $facilityUtilService: FacilityUtilService,
              private modalService: NzModalService) {
    this.language = this.$nzI18n.getLocaleData('alarm');
    this.inspectionLanguage = this.$nzI18n.getLocaleData('inspection');
    this.facilityLanguage = this.$nzI18n.getLocaleData('facility');
  }

  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      primaryKey: '02-3-5',
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      scroll: {x: '1200px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          // 名称
          title: this.language.name, key: 'orderName',
          width: 150,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          // 告警名称
          title: this.language.alarmName, key: 'alarmName',
          width: 200,
          configurable: true,
          searchable: true,
          // searchConfig: { type: 'input' },
          searchConfig: {
            type: 'render',
            selectInfo: this.areaList.ids,
            renderTemplate: this.alarmName
          }
        },
        {
          // 工单类型
          title: this.language.workOrderType, key: 'orderType',
          width: 200,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              // 1 是巡检工单 2 是销障工单
              // { label: this.language.pollingWork, value: 1 },
              {label: this.language.eliminateWork, value: 2},
            ]
          },
        },
        {
          // 区域
          title: this.language.area,
          key: 'areaName',
          width: 200,
          configurable: true,
          searchable: true,
          // searchConfig: { type: 'input' },
          searchConfig: {
            type: 'render',
            selectInfo: this.areaList.ids,
            renderTemplate: this.areaSelectorTemp
          },
        },
        {
          // 设施类型
          title: this.language.alarmSourceType, key: 'alarmOrderRuleDeviceTypeList', width: 230, isShowSort: true,
          type: 'render',
          configurable: true,
          renderTemplate: this.deviceTypeTemp,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: getDeviceType(this.$nzI18n), label: 'label', value: 'code'
          }
        },
        {
          // 触发条件
          title: this.language.triggerCondition, key: 'triggerType', isShowSort: true,
          width: 180,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              // 0 是告警发生时触发 1 是启用状态时触发
              {label: this.language.alarmHappenedTrigger, value: 0},
              // { label: this.language.startUsingTrigger, value: 1 },
            ]
          },
        },
        {
          // 创建时间
          title: this.language.createTime, key: 'createTime',
          width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {
          // 期待完工时长(天)
          title: this.language.expectAccomplishTime, key: 'completionTime', isShowSort: true,
          width: 140,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.completionTimeTemp},
          // searchConfig: {type: 'input'} departmentName
        },
        {
          // 责任单位
          title: this.language.responsibleUnit,
          key: 'departmentName',
          width: 200,
          configurable: true,
          searchable: true,
          searchKey: 'departmentIdList',
          searchConfig: {
            type: 'render',
            selectInfo: this.unitList.ids,
            renderTemplate: this.UnitNameSearch
          },
        },
        {
          // 启用 和 禁用
          title: this.language.openStatus, key: 'status', width: 120, isShowSort: true,
          searchable: true,
          configurable: true,
          type: 'render',
          renderTemplate: this.isNoStartTemp,
          searchConfig: {
            type: 'select', selectInfo: [
              // 1 是启用 2 是关闭
              {label: this.language.disable, value: '2'},
              {label: this.language.enable, value: '1'}
            ]
          },
          handleFilter: ($event) => {
          },
        },
        {
          title: this.language.remark, key: 'remark', width: 200, isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '',
          width: 120, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      // searchReturnType: 'object',
      operation: [
        {
          // 编辑
          text: this.language.update,
          className: 'fiLink-edit',
          permissionCode: '02-3-5-4',
          handle: (currentIndex) => {
            this.$router.navigate(['business/alarm/alarm-work-order/update'], {
              queryParams: {id: currentIndex.id}
            }).then();
          }
        },
        {
          // 删除
          text: this.language.deleteHandle,
          permissionCode: '02-3-5-5',
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          handle: (data) => {
            if (data.status === '1') {
              this.$message.warning(this.language.openStateDisableDelect);
            } else {
              const ids = data.id;
              if (ids) {
                this.delTemplate([ids]);
              }
            }
          }
        }
      ],
      topButtons: [
        {
          // 新增
          text: '+      ' + this.language.add,
          permissionCode: '02-3-5-1',
          handle: () => {
            this.$router.navigate(['business/alarm/alarm-work-order/add']).then();
          }
        }, {
          // 批量删除
          text: this.language.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '02-3-5-5',
          handle: (data) => {
            if (data.find(item => item.status === '1')) {
              this.$message.warning(this.language.openStateDisableDelect);
            } else {
              const ids = data.map(item => item.id);
              if (ids) {
                this.delTemplate(ids);
              }
            }
          }
        }
      ],
      leftBottomButtons: [
        {
          text: this.language.enable,
          permissionCode: '02-3-5-2',
          canDisabled: true,
          handle: (e) => {
            if (e && e.length) {
              this.checkDisableEnableData = e;
              this.enablePopUpConfirm();
            } else {
              this.$message.info(this.language.pleaseCheckThe);
            }
          }
        },
        {
          text: this.language.disable,
          permissionCode: '02-3-5-3',
          canDisabled: true,
          handle: (e) => {
            if (e && e.length) {
              // this.checkDisableEnable(e, 2);
              this.checkDisableEnableData = e;
              this.disablePopUpConfirm();
            } else {
              this.$message.info(this.language.pleaseCheckThe);
            }
          }
        }
      ],
      sort: (event: SortCondition) => {
        console.log(this.filterEvent);
        // this.queryCondition.filterConditions = this.filterEvent;
        if (event.sortField === 'alarmOrderRuleDeviceTypeList') {
          this.queryCondition.sortCondition.sortField = 'deviceTypeId';
        } else {
          this.queryCondition.sortCondition.sortField = event.sortField;
        }
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        // this.refreshData();
        this.refreshData(this.filterEvent);
      },
      handleSearch: (event) => {
        // 重置告警名称
        if (!event.length) {
          this.completionTimeSelectedValue = 'eq';
          this.filterEvent = '';
          // 清除告警名称和区域
          this._checkAlarmName = {
            name: '',
            ids: []
          };
          this.initAlarmName();
          this.areaList = {
            ids: [],
            name: ''
          };
          // 区域
          this.initAreaConfig();
          this.unitList = {
            ids: [],
            name: ''
          };
          this.selectUnitName = '';
          this.initUnitConfig();
          this.refreshData();
        } else {
          let filterEvent = {};
          event.forEach((item, index) => {
            filterEvent[item.filterField] = item.filterValue;
            if (item.filterField === 'alarmOrderRuleDeviceTypeList') {
              // 设施类型
              filterEvent = {
                deviceTypeId: filterEvent['alarmOrderRuleDeviceTypeList']
              };
            }
            if (item.filterField === 'createTime') {
              //  创建时间
              event.forEach(itemTime => {
                if (itemTime.operator === 'gte') {
                  filterEvent['createTime'] = itemTime.filterValue;
                }
                if (itemTime.operator === 'lte') {
                  filterEvent['createTimeEnd'] = itemTime.filterValue;
                }
              });
              // filterEvent['createTime'] = event[0].filterValue;
              // filterEvent['createTimeEnd'] = event[1].filterValue;
              delete event[index + 1];
            }
            if (item.filterField === 'orderType') {
              // 工单类型
              filterEvent['orderTypeList'] = item.filterValue;
              delete filterEvent['orderType'];
            }
            if (item.filterField === 'status') {
              // 是否启用
              filterEvent['statusArray'] = [item.filterValue];
              delete filterEvent['status'];
            }
            if (item.filterField === 'triggerType') {
              // 触发条件
              filterEvent['triggerTypeArray'] = item.filterValue;
              delete filterEvent['triggerType'];
            }
            // 期待完工时长
            this.completionTimeInputValue = item.filterField;
            item.completionTimeOperate = this.completionTimeSelectedValue;
            if (item.filterField === 'completionTime') {
              //  Number(item.filterValue);
              // if (!Number.isInteger(item.filterValue)) {
              filterEvent['completionTime'] = item.filterValue;
              filterEvent['completionTimeOperate'] = item.completionTimeOperate;
              // }
            }
          });
          // 设施总数
          if (this.areaList && this.areaList.ids && this.areaList.ids.length) {
            // 区域
            filterEvent['alarmOrderRuleArea'] = this.areaList.ids;
            delete filterEvent['areaName'];
          }
          if (this._checkAlarmName && this._checkAlarmName.ids && this._checkAlarmName.ids.length) {
            // 告警名称
            filterEvent['alarmOrderRuleNameList'] = this._checkAlarmName.ids;
          }
          this.filterEvent = filterEvent;
          this.refreshData(filterEvent);
        }
      }
    };
  }

  /**
   * 删除模板
   * param ids
   */
  delTemplate(ids) {
    this.$alarmService.deleteAlarmWork(ids).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
        this.pageBean.pageIndex = 1;
        // this.refreshData();
        this.refreshData(this.filterEvent);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 获取告警列表信息
   */
  refreshData(filterEvent?) {
    this.tableConfig.isLoading = true;
    const data = filterEvent ? {'bizCondition': filterEvent} : {'bizCondition': {}};
    data.bizCondition = {
      ...data.bizCondition,
      'sortProperties': this.queryCondition.sortCondition.sortField,
      'sort': this.queryCondition.sortCondition.sortRule
    };
    this.$alarmService.queryAlarmWorkOrder(data).subscribe((res: Result) => {
      this.tableConfig.isLoading = false;
      if (res.code === 0) {
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageSize = res.data.length;
        this._dataSet = res.data.map(item => {
          item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
          // if (item.createTime) {
          //   item.createTime = this.$dateHelper.format(new Date(item.createTime), DateFormatString.DATE_FORMAT_STRING);
          // }
          // 工单类型
          if (item.orderType === 2) {
            item.orderType = this.language.eliminateWork;
          } else if (item.orderType === 1) {
            item.orderType = this.language.pollingWork;
          }
          // 触发条件
          if (item.triggerType === 0) {
            item.triggerType = this.language.alarmHappenedTrigger;
            // } else if (item.triggerType === 1) {
            //     item.triggerType = this.language.startUsingTrigger;
          }
          item.status = item.status + '';
          // 切换启用禁用权限
          this.switchStatusRole(item);
          item.pushType = item.pushType + '';
          // 告警名称
          if (item.alarmOrderRuleNames && item.alarmOrderRuleNames.length) {
            const namesArr = [];
            item.alarmOrderRuleNames.forEach(__item => {
              namesArr.push(getAlarmType(this.$nzI18n, __item));
            });
            item.alarmName = namesArr.join(',');
          }
          // 设施类型
          if (item.alarmOrderRuleDeviceTypeList && item.alarmOrderRuleDeviceTypeList[0]
            && item.alarmOrderRuleDeviceTypeList[0].deviceTypeId) {
            item.alarmOrderRuleDeviceTypeList.forEach(type => {
              const deviceType = type.deviceTypeId;
              // type['_deviceType'] = deviceType;
              type.deviceType = getDeviceType(this.$nzI18n, deviceType);
              // type['iconClass'] = CommonUtil.getFacilityIconClassName(type._deviceType);
            });
          }
          // 区域
          if (item.alarmOrderRuleAreaName && item.alarmOrderRuleAreaName.length) {
            item.areaName = item.alarmOrderRuleAreaName.join(',');
          }
          return item;
        });
      } else {
        // 请求错误
        this.$message.success(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  // 启用弹框 弹框
  enablePopUpConfirm() {
    this.modalService.confirm({
      nzTitle: this.language.prompt,
      nzContent: this.language.isNoAllEnable,
      nzOkText: this.language.cancelText,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.language.okText,
      nzOnCancel: () => {
        // this.confirmationBoxConfirm('affirm');
        this.checkDisableEnable(1);
      },
    });
  }

  // 禁用弹框
  disablePopUpConfirm() {
    this.modalService.confirm({
      nzTitle: this.language.prompt,
      nzContent: this.language.isNoAllDisable,
      nzOkText: this.language.cancelText,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.language.okText,
      nzOnCancel: () => {
        // this.confirmationBoxConfirm('affirm');
        this.checkDisableEnable(2);
      },
    });
  }

  // 批量禁用与启用
  checkDisableEnable(type: 1 | 2) {
    const ids = this.checkDisableEnableData.map(item => item.id);
    this.$alarmService.updateWorkStatus(type, ids)
      .subscribe((res: Result) => {
        // this.refreshData();
        this.refreshData(this.filterEvent);
      });
  }

  // 禁启状态
  clickSwitch(data) {
    if (data && data.id) {
      let statusValue;
      this._dataSet = this._dataSet.map(item => {
        if (data.id === item.id) {
          item.clicked = true;
          if (data.status === '1') {
            item.status = '2';
          } else if (data.status === '2') {
            item.status = '1';
          }
          this.switchStatusRole(item);
          statusValue = item.status;
          return item;
        } else {
          return item;
        }
      });
      this.$alarmService.updateWorkStatus(statusValue, [data.id])
        .subscribe((res: Result) => {
          // this.refreshData();
        });
    }
  }

  pageChange(event) {
  }

  // 区域
  initAreaConfig() {
    const clear = this.areaList.ids.length ? false : true;
    this.areaConfig = {
      clear: clear,
      checkArea: (event) => {
        this.areaList = event;
      }
    };
  }

  // 责任单位
  initUnitConfig() {
    const clear = this.unitList.ids.length ? false : true;
    this.unitConfig = {
      clear: clear,
      checkUnit: (event) => {
        this.unitList = event;
      }
    };
  }

  // 告警名称
  initAlarmName() {
    const clear = this._checkAlarmName.ids.length ? false : true;
    this.alarmNameConfig = {
      clear: clear,
      alarmName: (event) => {
        this._checkAlarmName = event;
      }
    };
  }

  /**
   * 切换权限
   * param item
   */
  switchStatusRole(item) {
    if (item.status === DisableAndEnable.Disable) {
      // 启用权限
      item['appAccessPermission'] = '02-3-5-2';
    } else if (item.status === DisableAndEnable.Enable) {
      // 禁用权限
      item['appAccessPermission'] = '02-3-5-3';
    }
  }

  /**
   * 打开责任单位选择器
   */
  showModal(filterValue) {
    if (this.treeNodes.length === 0) {
      this.queryAllDeptList().then((bool) => {
        if (bool === true) {
          this.filterValue = filterValue;
          if (!this.filterValue['filterValue']) {
            this.filterValue['filterValue'] = [];
          }
          this.treeSelectorConfig.treeNodes = this.treeNodes;
          this.responsibleUnitIsVisible = true;
        }
      });
    } else {
      this.responsibleUnitIsVisible = true;
    }
  }

  /**
   * 部门筛选选择结果
   */
  departmentSelectDataChange(event) {
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
   * 查询所有的单位
   */
  private queryAllDeptList() {
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
      title: this.facilityLanguage.accountabilityUnit,
      width: '400px',
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

  ngOnInit() {
    this.initTableConfig();
    this.refreshData();
    // 区域
    this.initAreaConfig();
    this.initUnitConfig();
    // 告警名称
    this.initAlarmName();
    this.initTreeSelectorConfig();
  }

}
