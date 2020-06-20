import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, DateHelperService, NzModalService} from 'ng-zorro-antd';
import {AlarmService} from '../../../../../core-module/api-service/alarm';
import {Result} from '../../../../../shared-module/entity/result';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmStoreService} from '../../../../../core-module/store/alarm.store.service';
import {DateFormatString} from '../../../../../shared-module/entity/dateFormatString';
import {getDeviceType, getAlarmLevel, getDisableAndEnable, DisableAndEnable} from '../../../../facility/share/const/facility.config';
import {AreaConfig, User} from 'src/app/shared-module/component/alarm/alarmSelectorConfig';

/**
 * 告警设置-告警远程通知
 */
@Component({
  selector: 'app-alarm-remote-notification',
  templateUrl: './alarm-remote-notification.component.html',
  styleUrls: ['./alarm-remote-notification.component.scss']
})

export class AlarmRemoteNotificationComponent implements OnInit {
  _dataSet = [];
  pageBean: PageBean = new PageBean(10, 1, 1);
  tableConfig: TableConfig;
  queryCondition: QueryCondition = new QueryCondition();
  public language: AlarmLanguageInterface;

  filterEvent;
  // 区域
  areaList = {
    ids: [],
    name: ''
  };
  areaConfig: AreaConfig;
  // 勾选的通知人
  checkAlarmNotifier = {
    name: '',
    ids: []
  };
  alarmUserConfig: User;
  checkDisableEnableData;
  @ViewChild('isNoStartTemp') isNoStartTemp: TemplateRef<any>;
  @ViewChild('isNoStorageTemp') isNoStorageTemp: TemplateRef<any>;
  @ViewChild('alarmDefaultLevelTemp') alarmDefaultLevelTemp: TemplateRef<any>;
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  @ViewChild('areaSelector') private areaSelectorTemp;
  @ViewChild('notifierTemp') notifierTemp: TemplateRef<any>;

  constructor(public $router: Router,
              public $nzI18n: NzI18nService,
              public $alarmService: AlarmService,
              public $message: FiLinkModalService,
              public $active: ActivatedRoute,
              public $alarmStoreService: AlarmStoreService,
              private $dateHelper: DateHelperService,
              private modalService: NzModalService) {
    this.language = this.$nzI18n.getLocaleData('alarm');
  }

  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      primaryKey: '02-3-4',
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
          title: this.language.name, key: 'ruleName',
          width: 150,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
        },
        {
          // 通知人
          title: this.language.notifier, key: 'user',
          width: 200,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'render',
            selectInfo: this.checkAlarmNotifier.ids,
            renderTemplate: this.notifierTemp
          }
        },
        {
          // 区域
          title: this.language.area,
          key: 'alarmName',
          configurable: true,
          width: 200,
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
          title: this.language.alarmSourceType, key: 'alarmForwardRuleDeviceTypeList', width: 230, isShowSort: true,
          type: 'render',
          configurable: true,
          renderTemplate: this.deviceTypeTemp,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: getDeviceType(this.$nzI18n), label: 'label', value: 'code'
          }
          // selectType: 'multiple',
        },
        {
          // 设施对象
          title: this.language.deviceObject, key: 'alarmForwardRuleDeviceObjectList', width: 230, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          // 设备类型
          title: this.language.equipmentType, key: 'alarmForwardRuleEquipmentTypeList', width: 230, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          // 设施对象
          title: this.language.equipmentObject, key: 'alarmForwardRuleEquipmentObjectList', width: 230, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.language.openStatus, key: 'status', width: 120, isShowSort: true,
          searchable: true,
          configurable: true,
          type: 'render',
          renderTemplate: this.isNoStartTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              // 1 是启用 2 是关闭
              {label: this.language.disable, value: '2'},
              {label: this.language.enable, value: '1'}
            ]
          },
          handleFilter: ($event) => {
          },
        },
        {
          // 告警级别
          title: this.language.alarmFixedLevel, key: 'alarmForwardRuleLevels',
          width: 220, isShowSort: true,
          configurable: true,
          type: 'render',
          renderTemplate: this.alarmDefaultLevelTemp,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: getAlarmLevel(this.$nzI18n), label: 'label', value: 'code'
          },
        },
        // {
        //   // 推送方式
        //   title: this.language.pushType, key: 'pushType', width: 150, isShowSort: true,
        //   searchable: true,
        //   type: 'render',
        //   configurable: true,
        //   renderTemplate: this.isNoStorageTemp,
        //   searchConfig: {
        //     // 2 是邮件 1 是短信
        //     type: 'select', selectType: 'multiple', selectInfo: [
        //       {label: this.language.mail, value: '2'},
        //       {label: this.language.note, value: '1'}
        //     ]
        //   },
        //   handleFilter: ($event) => {
        //     console.log('www', $event);
        //   },
        // },
        {
          title: this.language.createTime, key: 'createTime',
          width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
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
      operation: [
        {
          // 编辑
          text: this.language.update,
          permissionCode: '02-3-4-4',
          className: 'fiLink-edit',
          handle: (currentIndex) => {
            this.$router.navigate(['business/alarm/alarm-remote-notification/update'], {
              queryParams: {id: currentIndex.id}
            }).then();
          }
        },
        {
          text: this.language.deleteHandle,
          permissionCode: '02-3-4-5',
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
          text: '+    ' + this.language.add,
          permissionCode: '02-3-4-1',
          handle: () => {
            this.$router.navigate(['business/alarm/alarm-remote-notification/add']).then();
          }
        }, {
          // 删除
          text: this.language.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '02-3-4-5',
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
          permissionCode: '02-3-4-2',
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
          permissionCode: '02-3-4-3',
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
        this.queryCondition.filterConditions = this.filterEvent;
        if (event.sortField === 'alarmForwardRuleLevels') {
          this.queryCondition.sortCondition.sortField = 'alarmLevelId';
        } else if (event.sortField === 'alarmForwardRuleDeviceTypeList') {
          this.queryCondition.sortCondition.sortField = 'deviceTypeId';
        } else {
          this.queryCondition.sortCondition.sortField = event.sortField;
        }
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        // this.refreshData();
        this.refreshData(this.filterEvent);
      },
      handleSearch: (event) => {
        // 重置区域和通知人
        if (!event.length) {
          this.areaList = {
            ids: [],
            name: ''
          };
          // 区域
          this.initAreaConfig();
          this.checkAlarmNotifier = {
            ids: [],
            name: ''
          };
          this.initAlarmUserConfig();
          this.filterEvent = {};
          this.refreshData();
        } else {
          const filterEvent = {};
          event.forEach((item, index) => {
            filterEvent[item.filterField] = item.filterValue;
            if (item.filterField === 'alarmForwardRuleDeviceTypeList') {
              // 设施类型
              filterEvent['deviceTypeId'] = filterEvent['alarmForwardRuleDeviceTypeList'];
              delete filterEvent['alarmForwardRuleDeviceTypeList'];
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
            if (item.filterField === 'alarmForwardRuleLevels') {
              // 告警级别
              filterEvent['alarmLevelId'] = filterEvent['alarmForwardRuleLevels'];
              delete filterEvent['alarmForwardRuleLevels'];
            }
            if (item.filterField === 'status') {
              // 启用状态
              filterEvent['statusArray'] = item.filterValue;
              delete filterEvent['status'];
            }
            if (item.filterField === 'pushType') {
              // 推送方式
              filterEvent['pushTypeArray'] = item.filterValue;
              delete filterEvent['pushType'];
            }
          });
          if (this.areaList && this.areaList.ids && this.areaList.ids.length) {
            // 区域
            filterEvent['alarmForwardRuleAreaList'] = this.areaList.ids;
            delete filterEvent['alarmName'];
          }
          if (this.checkAlarmNotifier && this.checkAlarmNotifier.ids && this.checkAlarmNotifier.ids.length) {
            // 通知人
            filterEvent['alarmForwardRuleUserList'] = this.checkAlarmNotifier.ids;
            delete filterEvent['user'];
          }
          this.filterEvent = filterEvent;
          this.refreshData(filterEvent);
        }
      }
    };
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
    this.$alarmService.queryAlarmRemote(data).subscribe((res: Result) => {
      this.tableConfig.isLoading = false;
      if (res.code === 0) {
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageSize = res.data.length;
        this._dataSet = res.data.map(item => {
          item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
          // if (item.createTime) {
          //   item.createTime = this.$dateHelper.format(new Date(item.createTime), DateFormatString.DATE_FORMAT_STRING);
          // }
          // 通知人
          if (item.alarmForwardRuleUserName && item.alarmForwardRuleUserName.length) {
            item.user = item.alarmForwardRuleUserName.join(',');
          }
          // 区域
          if (item.alarmForwardRuleAreaName && item.alarmForwardRuleAreaName.length) {
            item.alarmName = item.alarmForwardRuleAreaName.join(',');
          }
          if (item.alarmForwardRuleLevels && item.alarmForwardRuleLevels.length) {
            // 告警级别
            item.alarmForwardRuleLevels.forEach(levels => {
              levels.alarmDefaultLevel = levels.alarmLevelId;
              levels.defaultStyle = this.$alarmStoreService.getAlarmColorByLevel(levels.alarmLevelId);
              levels.style = this.$alarmStoreService.getAlarmColorByLevel(levels.alarmLevelId);
            });
          }
          // 设施类型
          if (item.alarmForwardRuleDeviceTypeList && item.alarmForwardRuleDeviceTypeList[0]
            && item.alarmForwardRuleDeviceTypeList[0].deviceTypeId) {
            item.alarmForwardRuleDeviceTypeList.forEach(type => {
              const deviceType = type.deviceTypeId;
              type.deviceType = getDeviceType(this.$nzI18n, deviceType);
              return type;
            });
          }
          item.status = item.status + '';
          // 切换启用禁用权限
          this.switchStatusRole(item);
          item.pushType = item.pushType + '';
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
    this.$alarmService.updateRemoteStatus(type, ids)
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
          statusValue = item.status;
          this.switchStatusRole(item);
          return item;
        } else {
          return item;
        }
      });
      this.$alarmService.updateRemoteStatus(statusValue, [data.id])
        .subscribe((res: Result) => {
          // this.refreshData();
        });
    }
  }

  /**
   * 删除模板
   * param ids
   */
  delTemplate(ids) {
    this.$alarmService.deleteAlarmRemote(ids).subscribe((result: Result) => {
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

  // 选择推送方式
  clickIsNoStorageTemp(data, type: 1 | 2) {
    if (data && data.id) {
      this.$alarmService.updateAlarmRemotePushType(type, [data.id]).subscribe((result: Result) => {
        //  this.refreshData();
        this.refreshData(this.filterEvent);
      });
    }
  }

  pageChange(event) {
  }

  // 区域
  initAreaConfig() {
    // const clear = this.areaList.ids.length ? false : true;
    this.areaConfig = {
      clear: !this.areaList.ids.length,
      checkArea: (event) => {
        this.areaList = event;
      }
    };
  }

  // 通知人
  initAlarmUserConfig() {
    // const clear = this.checkAlarmNotifier.ids.length ? false : true;
    this.alarmUserConfig = {
      clear: !this.checkAlarmNotifier.ids.length,
      checkUser: (event) => {
        this.checkAlarmNotifier = event;
        this.initAreaConfig();
      }
    };
  }

  /**
   * 切换权限
   * param item
   */
  switchStatusRole(item: any) {
    item.statusName = getDisableAndEnable(this.$nzI18n, item.status);
    if (item.status === DisableAndEnable.Disable) {
      // 启用权限
      item['appAccessPermission'] = '02-3-4-2';
    } else if (item.status === DisableAndEnable.Enable) {
      // 禁用权限
      item['appAccessPermission'] = '02-3-4-3';
    }
  }

  ngOnInit() {
    this.initTableConfig();
    this.refreshData();
    // 通知人
    this.initAlarmUserConfig();
    // 区域
    this.initAreaConfig();
  }

}
