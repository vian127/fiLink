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
import {AlarmNameConfig} from 'src/app/shared-module/component/alarm/alarmSelectorConfig';
import {DisableAndEnable, getAlarmType, getDisableAndEnable} from '../../../../facility/share/const/facility.config';

/**
 * 告警过滤页面
 */
@Component({
  selector: 'alarm-filtration',
  templateUrl: './alarm-filtration.component.html',
  styleUrls: ['./alarm-filtration.component.scss']
})

export class AlarmFiltrationComponent implements OnInit {
  // 表格数据源
  _dataSet = [];
  // 翻页对象
  pageBean: PageBean = new PageBean(10, 1, 1);
  // 表格配置
  tableConfig: TableConfig;
  // 查询条件
  queryCondition: QueryCondition = new QueryCondition();
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 弹窗数据
  particularsData: any = [];
  // 过滤条件
  filterEvent;
  // 详情弹窗
  display = {
    particulars: false
  };
  modalFooter;
  // 勾选的告警名称
  _checkAlarmName = {
    name: '',
    ids: []
  };
  // 告警名称配置
  alarmNameConfig: AlarmNameConfig;
  // 启用，禁用数据
  checkDisableEnableData;
  // 表格启用禁用模板
  @ViewChild('isNoStartTemp') isNoStartTemp: TemplateRef<any>;
  // 表格是否去库存模板
  @ViewChild('isNoStorageTemp') isNoStorageTemp: TemplateRef<any>;
  // 表格过滤条件模板
  @ViewChild('filtrationConditionTemp') filtrationConditionTemp: TemplateRef<any>;
  @ViewChild('particulars') particulars: TemplateRef<any>;
  // 表格告警名称过滤模板
  @ViewChild('alarmName') private alarmName;

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

  ngOnInit() {
    // 初始化表格配置
    this.initTableConfig();
    // 查询表格数据
    this.refreshData();
    // 告警名称配置初始化
    this.initAlarmName();
  }

  /**
   * 获取告警过滤列表信息
   */
  refreshData(filterEvent?) {
    this.tableConfig.isLoading = true;
    const data = filterEvent ? {'bizCondition': filterEvent} : {'bizCondition': {}};
    data.bizCondition = {
      ...data.bizCondition,
      'sortProperties': this.queryCondition.sortCondition.sortField,
      'sort': this.queryCondition.sortCondition.sortRule
    };
    this.$alarmService.queryAlarmFiltration(data).subscribe((res: Result) => {
      this.tableConfig.isLoading = false;
      if (res.code === 0) {
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageSize = res.data.length;
        this._dataSet = res.data.map(item => {
          item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
          item.alarmName = item.alarmFilterRuleNameList.map(items => {
            return items.alarmName && items.alarmName.alarmName;
          }).join(',');
          // 过滤条件
          if (item.alarmFilterRuleNames && item.alarmFilterRuleNames.length) {
            const namesArr = [];
            item.alarmFilterRuleNames.forEach(__item => {
              namesArr.push(getAlarmType(this.$nzI18n, __item));
            });
            item.alarmName = namesArr.join(',');
          }
          item.status = item.status + '';
          // 切换启用禁用权限
          this.switchStatusRole(item);
          item.stored = item.stored + '';
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

  /**
   * 表格配置初始化
   */
  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '02-3-3',
      showSearchSwitch: true,
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
          title: this.language.name, key: 'ruleName',
          width: 150,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
        },
        {
          // 过滤条件
          title: this.language.filterConditions,
          key: 'alarmName',
          configurable: true,
          width: 200,
          searchable: true,
          type: 'render',
          // searchConfig: { type: 'input' },
          searchConfig: {
            type: 'render',
            selectInfo: this._checkAlarmName.ids,
            renderTemplate: this.alarmName
          },
          renderTemplate: this.filtrationConditionTemp,
        },
        {
          title: this.language.opertionUser, key: 'operationUser', width: 120, isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.openStatus, key: 'status', width: 120, isShowSort: true,
          searchable: true,
          configurable: true,
          type: 'render',
          renderTemplate: this.isNoStartTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.language.disable, value: '2'},
              {label: this.language.enable, value: '1'}
            ]
          },
          handleFilter: ($event) => {
          },
        },
        {
          title: this.language.createTime, key: 'createTime',
          width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {
          // 是否库存
          title: this.language.isNoStored, key: 'stored', width: 140, isShowSort: true,
          searchable: true,
          configurable: true,
          type: 'render',
          renderTemplate: this.isNoStorageTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.language.yes, value: 1},
              {label: this.language.no, value: 2}
            ]
          },
          handleFilter: ($event) => {
            console.log('www', $event);
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
      operation: [
        {
          text: this.language.particulars,
          className: 'icon-fiLink iconfont fiLink-view-detail',
          handle: (data) => {
            this.clickFiltration(data);
          }
        },
        {
          // 编辑
          text: this.language.update,
          permissionCode: '02-3-3-4',
          className: 'fiLink-edit',
          handle: (currentIndex) => {
            this.$router.navigate(['business/alarm/alarm-filtration/update'], {
              queryParams: {id: currentIndex.id}
            }).then();
          }
        },
        {
          text: this.language.deleteHandle,
          permissionCode: '02-3-3-5',
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
          permissionCode: '02-3-3-1',
          handle: () => {
            this.$router.navigate(['business/alarm/alarm-filtration/add']).then();
          }
        }, {
          // 删除
          text: this.language.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '02-3-3-5',
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
          permissionCode: '02-3-3-2',
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
          permissionCode: '02-3-3-3',
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
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        // this.refreshData();
        this.refreshData(this.filterEvent);
      },
      handleSearch: (event) => {
        if (!event.length) {
          // 清除告警名称和区域
          this._checkAlarmName = {
            name: '',
            ids: []
          };
          this.filterEvent = {};
          this.initAlarmName();
          this.refreshData();
        } else {
          const filterEvent = {};
          event.forEach((item, index) => {
            filterEvent[item.filterField] = item.filterValue;
            if (item.filterField === 'status') {
              // 启用状态
              filterEvent['statusArray'] = item.filterValue;
              delete filterEvent['status'];
            }
            if (item.filterField === 'stored') {
              // 是否存库
              filterEvent['storedArray'] = item.filterValue;
              delete filterEvent['stored'];
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
            if (this._checkAlarmName && this._checkAlarmName.ids && this._checkAlarmName.ids.length) {
              // 告警名称
              filterEvent['alarmFilterRuleNameList'] = this._checkAlarmName.ids;
            }
          });
          this.filterEvent = filterEvent;
          this.refreshData(filterEvent);
        }
      }
    };
  }

  /**
   * 分页数据查询
   * param event
   */
  pageChange(event) {
  }

  /**
   * 点击过滤 弹框，显示告警详情
   * param data
   */
  clickFiltration(data) {
    this.display.particulars = true;
    this.particularsData = [
      {name: this.language.alarmobject, value: data.alarmFilterRuleSourceName},
      {name: this.language.alarmName, value: data.alarmName},
      {name: this.language.startTime, value: this.$dateHelper.format(new Date(data.beginTime), DateFormatString.DATE_FORMAT_STRING)},
      {
        name: this.language.endTime, value:
          this.$dateHelper.format(new Date(data.endTime), DateFormatString.DATE_FORMAT_STRING)
      },
    ];
  }

  /**
   * 启用弹框 弹框
   */
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

  /**
   * 禁用弹框
   */
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
        this.checkDisableEnable(2);
      },
    });
  }

  /**
   * 批量禁用与启用
   * param {any | any} type
   */
  checkDisableEnable(type: 1 | 2) {
    const ids = this.checkDisableEnableData.map(item => item.id);
    this.$alarmService.updateStatus(type, ids)
      .subscribe((res: Result) => {
        this.refreshData(this.filterEvent);
      });
  }

  /**
   * 告警名称配置
   */
  initAlarmName() {
    // const clear = this._checkAlarmName.ids.length ? false : true;
    this.alarmNameConfig = {
      clear: !this._checkAlarmName.ids.length,
      alarmName: (event) => {
        this._checkAlarmName = event;
      }
    };
  }

  /**
   *  启用和禁用 的开关
   *  param data
   */
  clickSwitch(data) {
    if (data && data.id) {
      let statusValue;
      this._dataSet = this._dataSet.map(item => {
        if (data.id === item.id) {
          item.clicked = true;
          if (data.status === '1') {
            item.status = '2';
            statusValue = item.status;
          } else if (data.status === '2') {
            item.status = '1';
            statusValue = item.status;
          }
          this.switchStatusRole(item);
          return item;
        } else {
          return item;
        }
      });
      this.$alarmService.updateStatus(statusValue, [data.id])
        .subscribe((res: Result) => {
          // this.refreshData();
        });
    }
  }

  /**
   * 是否入库点击，刷新数据
   * param data
   * param {any | any} type
   */
  clickIsNoStorageTemp(data, type: 1 | 2) {
    if (data && data.id) {
      this.$alarmService.updateAlarmStorage(type, [data.id]).subscribe((result: Result) => {
        // this.refreshData();
        this.refreshData(this.filterEvent);
      });
    }
  }

  /**
   * 切换权限
   * param item
   */
  switchStatusRole(item: any) {
    item.statusName = getDisableAndEnable(this.$nzI18n, item.status);
    if (item.status === DisableAndEnable.Disable) {
      // 启用权限
      item['appAccessPermission'] = '02-3-3-2';
    } else if (item.status === DisableAndEnable.Enable) {
      // 禁用权限
      item['appAccessPermission'] = '02-3-3-3';
    }
  }

  /**
   * 删除模板
   * param ids
   */
  delTemplate(ids) {
    this.$alarmService.deleteAlarmFiltration(ids).subscribe((result: Result) => {
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

}
