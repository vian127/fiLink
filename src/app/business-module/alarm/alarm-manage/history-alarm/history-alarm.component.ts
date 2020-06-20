import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {ActivatedRoute, Router} from '@angular/router';
import {DateHelperService, NzI18nService} from 'ng-zorro-antd';
import {AlarmService} from '../../../../core-module/api-service/alarm';
import {Result} from '../../../../shared-module/entity/result';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {FilterCondition, QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmStoreService} from '../../../../core-module/store/alarm.store.service';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {AlarmNameConfig, AlarmObjectConfig, AreaConfig} from 'src/app/shared-module/component/alarm/alarmSelectorConfig';
import {ImageViewService} from '../../../../shared-module/service/picture-view/image-view.service';
import {getAlarmCleanStatus, getAlarmLevel, getAlarmType, getDeviceType, getIsConfirm} from '../../../facility/share/const/facility.config';

/**
 * 历史告警页面
 */
@Component({
  selector: 'app-history-alarm',
  templateUrl: './history-alarm.component.html',
  styleUrls: ['./history-alarm.component.scss']
})
export class HistoryAlarmComponent implements OnInit {
  // 表格数据源
  _dataSet = [];
  // 翻页对象
  pageBean: PageBean = new PageBean(10, 1, 1);
  // 表格配置项
  tableConfig: TableConfig;
  // 查询条件
  queryCondition: QueryCondition = new QueryCondition();
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 告警id
  alarmId = null;
  // 设施id
  deviceId = null;
  // 修改备注弹窗标志、历史告警模板查询是否可见
  display = {
    remarkTable: false,
    historyAlarmTemplateTable: false,
  };
  // 修改备注
  checkRemark: any[];

  // 修改备注表单项
  formColumnRemark: FormItem[] = [];

  // 修改备注表单实例
  formStatusRemark: FormOperate;
  // 告警名称配置
  alarmNameConfig: AlarmNameConfig;
  // 勾选的告警名称
  _checkAlarmName = {
    name: '',
    ids: []
  };
  // 区域配置
  areaConfig: AreaConfig;
  // 区域
  areaList = {
    ids: [],
    name: ''
  };
  // 告警对象配置
  alarmObjectConfig: AlarmObjectConfig;
  checkAlarmObject = {
    ids: [],
    name: ''
  };
  // 模板ID
  templateId: any;
  // 表格告警级别过滤模板
  @ViewChild('alarmFixedLevelTemp') alarmFixedLevelTemp: TemplateRef<any>;
  // 表格清除状态过滤模板
  @ViewChild('alarmCleanStatusTemp') alarmCleanStatusTemp: TemplateRef<any>;
  // 表格确认状态过滤模板
  @ViewChild('alarmConfirmStatusTemp') alarmConfirmStatusTemp: TemplateRef<any>;
  // 表格设施类型过滤模板
  @ViewChild('alarmSourceTypeTemp') alarmSourceTypeTemp: TemplateRef<any>;
  // 表格告警名称过滤模板
  @ViewChild('alarmName') private alarmName;
  // 表格区域过滤模板
  @ViewChild('areaSelector') private areaSelectorTemp;
  // 表格告警对象过滤模板
  @ViewChild('department') private departmentTemp;
  // 责任单位
  @ViewChild('unitTemp') private unitTemp;
  @ViewChild('alarmContinueTimeTemp') private alarmContinueTimeTemp;
  // 查看图片加载
  private viewLoading: boolean = false;

  constructor(public $router: Router,
              public $nzI18n: NzI18nService,
              public $alarmService: AlarmService,
              public $message: FiLinkModalService,
              public $active: ActivatedRoute,
              public $alarmStoreService: AlarmStoreService,
              private $dateHelper: DateHelperService,
              private $ruleUtil: RuleUtil,
              private $imageViewService: ImageViewService) {
    this.language = this.$nzI18n.getLocaleData('alarm');
  }

  ngOnInit() {
    // 初始化表格配置
    this.initTableConfig();
    // 获取告警id
    if (this.$active.snapshot.queryParams.id) {
      this.alarmId = this.$active.snapshot.queryParams.id;
      const filter = new FilterCondition('id');
      filter.operator = 'eq';
      filter.filterValue = this.alarmId;
      this.queryCondition.filterConditions = [filter];
    }
    // 获取设备deviceId
    if (this.$active.snapshot.queryParams.deviceId) {
      this.deviceId = this.$active.snapshot.queryParams.deviceId;
      const filter = new FilterCondition('alarmSource');
      filter.operator = 'eq';
      filter.filterValue = this.deviceId;
      this.queryCondition.filterConditions = [filter];
    }
    this.queryCondition.pageCondition.pageSize = this.pageBean.pageSize;
    this.queryCondition.pageCondition.pageNum = this.pageBean.pageIndex;
    // 数据刷新
    this.refreshData();
    // 修改备注弹框
    this.initFormRemark();
    // 区域
    this.initAreaConfig();
    // 告警名称
    this.initAlarmName();
    // 告警对象
    this.initAlarmObjectConfig();
  }

  /**
   * 告警对象初始化
   */
  initAlarmObjectConfig() {
    const clear = this.checkAlarmObject.ids.length ? false : true;
    this.alarmObjectConfig = {
      clear: clear,
      alarmObject: (event) => {
        this.checkAlarmObject = event;
      }
    };
  }

  /**
   * 区域配置初始化
   */
  initAreaConfig() {
    const clear = this.areaList.ids.length ? false : true;
    this.areaConfig = {
      clear: clear,
      checkArea: (event) => {
        this.areaList = event;
      }
    };
  }

  /**
   * 告警名称配置初始化
   */
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
   * 表格翻页刷新数据
   */
  pageChange(event) {
    if (!this.templateId) {
      this.queryCondition.pageCondition.pageNum = event.pageIndex;
      this.queryCondition.pageCondition.pageSize = event.pageSize;
      this.refreshData();
    } else {
      const data = {
        queryCondition: {},
        pageCondition: {
          'pageNum': event.pageIndex,
          'pageSize': this.pageBean.pageSize
        }
      };
      this.templateList(data);
    }
  }

  /**
   * 获取历史告警列表信息
   */
  refreshData() {
    this.tableConfig.isLoading = true;
    this.$alarmService.queryAlarmHistoryList(this.queryCondition).subscribe((res: Result) => {
      this.giveList(res);
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  giveList(res) {
    this.tableConfig.isLoading = false;
    this.pageBean.Total = res.totalCount;
    this.pageBean.pageIndex = res.pageNum;
    this.pageBean.pageSize = res.size;
    this._dataSet = res.data || [];
    this._dataSet = res.data.map(item => {
      item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
      item.alarmFixedLevelName = getAlarmLevel(this.$nzI18n, item.alarmFixedLevel);
      item.alarmCleanStatusName = getAlarmCleanStatus(this.$nzI18n, item.alarmCleanStatus);
      item.alarmSourceTypeName = getDeviceType(this.$nzI18n, item.alarmSourceTypeId);
      item.alarmConfirmStatusName = getIsConfirm(this.$nzI18n, item.alarmConfirmStatus);
      item.alarmName = getAlarmType(this.$nzI18n, item.alarmCode);
      return item;
    });
    this._dataSet.forEach(item => {
      // 告警持续时间
      item.alarmContinousTime = CommonUtil.setAlarmContinousTime(item.alarmBeginTime, item.alarmCleanTime,
        {year: this.language.year, month: this.language.month, day: this.language.day, hour: this.language.hour});
      // 判断创建工单 禁启用
      item.isShowBuildOrder = item.alarmCode === 'orderOutOfTime' ? 'disabled' : true;
    });
  }

  /**
   * 表格配置项初始化
   */
  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '02-2',
      showSearchSwitch: true,
      showSizeChanger: true,
      noIndex: true,
      showSearchExport: true,
      scroll: {x: '1200px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 60},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '60px'}}
        },
        {
          title: this.language.alarmName, key: 'alarmName', width: 140,
          searchable: true, searchKey: 'alarmNameId',
          searchConfig: {
            type: 'render',
            renderTemplate: this.alarmName
          },
          fixedStyle: {fixedLeft: true, style: {left: '122px'}}
        },
        {
          title: this.language.alarmFixedLevel, key: 'alarmFixedLevel', width: 100,
          type: 'render',
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: getAlarmLevel(this.$nzI18n), label: 'label', value: 'code'
          },
          renderTemplate: this.alarmFixedLevelTemp
        },
        {
          title: this.language.alarmobject, key: 'alarmObject', width: 150,
          searchable: true,
          configurable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.departmentTemp
          },
        },
        {
          title: this.language.area, key: 'areaName', width: 120,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.areaSelectorTemp
          },
        },
        {
          title: this.language.address, key: 'address', width: 150,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.responsibleDepartment, key: 'responsibleDepartment', width: 120,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.alarmSourceType, key: 'alarmSourceTypeId', width: 120,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.alarmSourceTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: getDeviceType(this.$nzI18n), label: 'label', value: 'code'
          }
        },
        {
          title: this.language.alarmHappenCount, key: 'alarmHappenCount', width: 80, isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.alarmCleanStatus, key: 'alarmCleanStatus', width: 125, isShowSort: true,
          type: 'render',
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.language.isClean, value: 1},
              {label: this.language.deviceClean, value: 2}
            ]
          },
          renderTemplate: this.alarmCleanStatusTemp
        },
        {
          title: this.language.alarmConfirmStatus, key: 'alarmConfirmStatus', width: 120, isShowSort: true,
          type: 'render',
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.language.isConfirm, value: 1},
              {label: this.language.noConfirm, value: 2}
            ]
          },
          renderTemplate: this.alarmConfirmStatusTemp
        },
        {
          title: this.language.alarmBeginTime, key: 'alarmBeginTime', width: 180, isShowSort: true,
          searchable: true,
          configurable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {
          title: this.language.alarmNearTime, key: 'alarmNearTime', width: 180, isShowSort: true,
          searchable: true,
          configurable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {
          title: this.language.alarmContinousTime, key: 'alarmContinousTime',
          width: 110,
          configurable: true,
        },
        {
          title: this.language.alarmConfirmTime, key: 'alarmConfirmTime', width: 180, isShowSort: true,
          searchable: true,
          configurable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {
          title: this.language.alarmCleanTime, key: 'alarmCleanTime', width: 180, isShowSort: true,
          searchable: true,
          configurable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {
          title: this.language.alarmCleanPeopleNickname, key: 'alarmCleanPeopleNickname', width: 120,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.alarmConfirmPeopleNickname, key: 'alarmConfirmPeopleNickname', width: 120,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.alarmAdditionalInformation, key: 'extraMsg', width: 200,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.alarmProcessing, key: 'alarmProcessing', width: 200,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.remark, key: 'remark', width: 200,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {
            type: 'operate', customSearchHandle: () => {
              this.display.historyAlarmTemplateTable = true;
            }
          }, key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      showEsPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [
        {
          // 定位
          text: this.language.location,
          key: 'isShowBuildOrder',
          className: 'fiLink-location',
          permissionCode: '02-2-2',
          disabledClassName: 'fiLink-location disabled-icon',
          handle: (e) => {
            console.log('定位', e);
            this.navigateToDetail('business/index', {queryParams: {id: e.alarmSource}});
          }
        },
        // {
        //   // 修改备注
        //   text: this.language.updateRemark,
        //   permissionCode: '02-2-1',
        //   className: 'fiLink-edit',
        //   handle: (currentIndex) => {
        //     this.formStatusRemark.resetControlData('remark', currentIndex.remark);
        //     this.display.remarkTable = true;
        //     this.checkRemark = [currentIndex];
        //   }
        // },
        {
          // 查看图片
          text: this.language.viewPicture,
          className: 'fiLink-view-photo',
          permissionCode: '02-2-3',
          handle: (e) => {
            // 查看图片
            this.examinePicture(e);
          }
        },
      ],
      leftBottomButtons: [
        {
          text: this.language.historyAlarmSet, handle: (e) => {
            this.$router.navigate(['business/alarm/history-alarm-set']).then();
          }
        },
        // 暂时去掉勾选备注
        // {
        //   // 勾选备注
        //   text: this.language.updateRemark,
        //   permissionCode: '02-2-1',
        //   handle: (data) => {
        //     if (data && data.length) {
        //       this.display.remarkTable = true;
        //       this.checkRemark = data;
        //       this.formStatusRemark.resetControlData('remark', '');
        //     } else {
        //       this.$message.info(this.language.pleaseCheckThe);
        //     }
        //   }
        // }
      ],
      sort: (event: SortCondition) => {
        if (event.sortField === 'alarmContinousTime') {
          // 当进行告警持续时间排序时 传给后台的是 alarmContinousTime 这个参数
          this.queryCondition.sortCondition.sortField = 'alarmContinousTime';
        } else {
          this.queryCondition.sortCondition.sortField = event.sortField;
        }
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event) => {
        // 点击表格里的重置或查询，清掉存在的deviceId或alarmId等条件
        this.queryCondition.filterConditions = [];
        if (!event.length) {
          //  告警名称 区域  告警对象 清空
          this.areaList = {
            ids: [],
            name: ''
          };
          this._checkAlarmName = {
            name: '',
            ids: []
          };
          this.checkAlarmObject = {
            ids: [],
            name: ''
          };
          // 区域
          this.initAreaConfig();
          // 告警名称
          this.initAlarmName();
          // 告警对象
          this.initAlarmObjectConfig();
          this.queryCondition.pageCondition = {pageSize: this.pageBean.pageSize, pageNum: 1};
          this.refreshData();
        } else {
          const filterEvent = [];
          event.forEach(item => {
            switch (item.filterField) {
              case 'alarmHappenCount':
                // 频次
                filterEvent.push({
                  'filterField': 'alarmHappenCount',
                  'filterValue': Number(item.filterValue) ? Number(item.filterValue) : 0,
                  'operator': 'eq',
                });
                break;
              case 'alarmName':
                // 告警名称
                if (this._checkAlarmName.name) {
                  filterEvent.push({
                    'filterField': 'alarmName',
                    'filterValue': this._checkAlarmName.name.split(','),
                    'operator': 'in',
                  });
                }
                break;
              case 'alarmNameId':
                // 告警名称
                if (this._checkAlarmName.name) {
                  filterEvent.push({
                    'filterField': 'alarmNameId',
                    'filterValue': this._checkAlarmName.ids,
                    'operator': 'in',
                  });
                }
                break;
              case 'alarmObject':
                // 告警对象
                if (this.checkAlarmObject.name) {
                  filterEvent.push({
                    'filterField': 'alarmSource',
                    'filterValue': this.checkAlarmObject.ids,
                    'operator': 'in',
                  });
                }
                break;
              case 'areaName':
                // 区域
                if (this.areaList.name) {
                  filterEvent.push({
                    'filterField': 'areaId',
                    'filterValue': this.areaList.ids,
                    'operator': 'in',
                  });
                }
                break;
              default:
                filterEvent.push(item);
            }
          });
          this.pageBean = new PageBean(this.queryCondition.pageCondition.pageSize, 1, 1);
          this.queryCondition.pageCondition = {pageSize: this.pageBean.pageSize, pageNum: this.pageBean.pageIndex};
          this.queryCondition.filterConditions = filterEvent;
          this.refreshData();
        }
      },
      handleExport: (event) => {
        const propertyName = ['alarmFixedLevel', 'alarmSourceTypeId', 'alarmCleanStatus', 'alarmConfirmStatus',
          'alarmBeginTime', 'alarmNearTime', 'alarmConfirmTime', 'alarmCleanTime', 'alarmContinousTime'];
        for (let i = 0; i < event.columnInfoList.length; i++) {
          if (propertyName.indexOf(event.columnInfoList[i].propertyName) !== -1) {
            event.columnInfoList[i].isTranslation = 1;
          }
        }
        // 处理参数
        const body = {
          queryCondition: this.queryCondition,
          columnInfoList: event.columnInfoList,
          excelType: event.excelType
        };
        // 处理选择的项目
        if (event.selectItem.length > 0) {
          event.queryTerm['alarmIds'] = event.selectItem.map(item => item.id);
          body.queryCondition.filterConditions = [];
          body.queryCondition.filterConditions.push({filterField: 'id', operator: 'in', filterValue: event.queryTerm['alarmIds']});
        }
        this.$alarmService.exportHistoryAlarmList(body).subscribe((res: Result) => {
          if (res.code === 0) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    };
  }

  /**
   * 路由跳转
   * param url
   * param {{}} extras
   */
  private navigateToDetail(url, extras = {}) {
    this.$router.navigate([url], extras).then();
  }

  /**
   * 查看图片
   * param data
   */
  examinePicture(data) {
    // 查看图片节流阀
    if (this.viewLoading) {
      return;
    }
    this.viewLoading = true;
    this.$alarmService.examinePictureHistory(data.id).subscribe((res: Result) => {
      this.viewLoading = false;
      if (res.code === 0) {
        if (res.data.length === 0) {
          this.$message.warning(this.language.noPicturesYet);
        } else {
          this.$imageViewService.showPictureView(res.data);
        }
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.viewLoading = false;
    });
  }

  /**
   *  表单备注项初始化
   */
  public initFormRemark() {
    this.formColumnRemark = [
      {
        // 备注
        label: this.language.remark,
        key: 'remark',
        type: 'textarea',
        width: 1000,
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }

  /**
   * 修改备注并刷新数据
   */
  updateAlarmRemark() {
    const remarkData = this.formStatusRemark.getData().remark;
    const remark = remarkData ? remarkData : null;
    const data = this.checkRemark.map(item => {
      return {id: item.id, remark: remark};
    });
    this.$alarmService.updateHistoryAlarmRemark(data).subscribe((res: Result) => {
      if (res.code === 0) {
        this.refreshData();
        this.$message.success(res.msg);
      } else {
        this.$message.info(res.msg);
      }
      this.display.remarkTable = false;
    });
  }

  /**
   * 修改备注表单实例
   * param event
   */
  formInstanceRemark(event) {
    this.formStatusRemark = event.instance;
  }

  /**
   * 历史告警设置
   */
  navigateToLevelSet() {
    this.$router.navigate(['business/alarm/history-alarm-set']).then();
  }


  /**
   * 模板查询
   */
  templateTable(event) {
    this.display.historyAlarmTemplateTable = false;
    if (!event) {
      return;
    }
    const data = {
      queryCondition: {},
      pageCondition: {
        'pageNum': 1,
        'pageSize': this.pageBean.pageSize
      }
    };
    if (event) {
      this.tableConfig.isLoading = true;
      this.templateId = event.id;
      this.templateList(data);
    }
  }

  /**
   * 模板查询 请求
   */
  templateList(data) {
    // 点击确认进入

    this.tableConfig.isLoading = true;
    this.$alarmService.alarmHistoryQueryTemplateById(this.templateId, data).subscribe(res => {
      if (res['code'] === 0) {
        this.giveList(res);
      } else if (res['code'] === 170219) {
        this._dataSet = [];
        this.tableConfig.isLoading = false;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
  toAlarmDiagnose() {
    this.$router.navigate(['business/alarm/history-diagnose-details'],
      {queryParams: {id: '12313', type: 'history'}}).then();
  }
}
