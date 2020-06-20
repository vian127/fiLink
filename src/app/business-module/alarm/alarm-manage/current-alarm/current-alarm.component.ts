import {Component, Injectable, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {ActivatedRoute, Router} from '@angular/router';
import {DateHelperService, NzI18nService, NzModalService} from 'ng-zorro-antd';
import {AlarmService} from '../../../../core-module/api-service/alarm';
import {Result} from '../../../../shared-module/entity/result';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmStoreService} from '../../../../core-module/store/alarm.store.service';
import {CurrAlarmServiceService} from './curr-alarm-service.service';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {AlarmNameConfig, AlarmObjectConfig, AreaConfig} from 'src/app/shared-module/component/alarm/alarmSelectorConfig';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {TableService} from 'src/app/shared-module/component/table/table.service';
import {ImageViewService} from '../../../../shared-module/service/picture-view/image-view.service';
import {
  alarmCleanStatus,
  getAlarmCleanStatus,
  getAlarmLevel,
  getAlarmType,
  getDeviceType,
  getIsConfirm
} from '../../../facility/share/const/facility.config';
import {FacilityService} from '../../../../core-module/api-service/facility/facility-manage';
import * as CurrentAlarmUtil from './current-alarm-util';
import {FilterCondition, QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {AlarmHintList} from './const/alarm-hint-list.const';
import {AlarmLevel} from './const/alarm-level.const';
import {ResultModel} from '../../../../core-module/model/result.model';
import {AlarmModel} from '../../model/alarm.model';

/**
 * 当前告警页面
 * 注意: 在这个TS中没有使用到的东西 在current-alarm-util文件中可能用到了 不要轻易删除
 */
@Component({
  selector: 'app-current-alarm',
  templateUrl: './current-alarm.component.html',
  styleUrls: ['./current-alarm.component.scss'],
  providers: [TableService]
})

@Injectable()
export class CurrentAlarmComponent implements OnInit {
  // 当前页面
  public pageType: string = 'alarm';
  // 表格数据
  _dataSet = [];
  // 表格翻页对象
  pageBean: PageBean = new PageBean(10, 1, 1);
  // 表格配置
  tableConfig: TableConfig;
  // 查询条件
  queryCondition: QueryCondition = new QueryCondition();
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  // 遮罩加载
  ifSpin = false;
  // 告警id
  alarmId = null;
  // 设施id
  deviceId = null;
  // token
  token: string = '';
  // 用户信息
  userInfo = {};
  // 用户id
  userId: string = '';
  // 告警确认标志
  confirmFlag = true;
  // 告警清除标志
  cleanFlag = true;
  // 告警类型
  alarmType = [];
  // 备注，工单，模板查询是否可见
  display = {
    remarkTable: false,
    templateTable: false,
    creationWorkOrder: false,
    nameTable: false,
    diagnoseSet: false
  };
  // 修改备注
  checkRemark: any[];
  // 诊断设置
  public checkDiagnose: any[];
  isLoading: boolean = false;
  // 修改备注弹框
  formColumnRemark: FormItem[] = [];
  formStatusRemark: FormOperate;
  // 诊断设置页面表单项
  tableColumnSet: FormItem[] = [];
  formStatusSet: FormOperate;
  // 新增告警页面表单项
  tableColumnAdd: FormItem[] = [];
  formStatusAdd: FormOperate;
  // 点击告警确认
  alarmIds = [];
  // 创建工单的数据
  creationWorkOrderData = {};
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
  // 卡片数据
  sliderConfig = [];
  // 告警提示选择
  alarmHintList = [];
  // 默认选中告警级别
  alarmHintValue = 1;
  // 是否从slide进入标志
  isClickSlider = false;
  // 图片查看加载
  private viewLoading: boolean = false;
  public diagnoseId: string = '';
  // 告警类别
  public alarmTypeList: any = [];
  // 告警类别枚举
  public typeStatus: any = {};
  public isShowTable: boolean = false;
  // 告警级别过滤模板
  @ViewChild('alarmFixedLevelTemp') alarmFixedLevelTemp: TemplateRef<any>;
  // 表格组件引用
  @ViewChild('table') table: TableComponent;
  // 清除状态过滤模板
  @ViewChild('isCleanTemp') isCleanTemp: TemplateRef<any>;
  // 设施类型过滤模板
  @ViewChild('alarmSourceTypeTemp') alarmSourceTypeTemp: TemplateRef<any>;
  // 确认状态过滤模板
  @ViewChild('isConfirmTemp') isConfirmTemp: TemplateRef<any>;
  // 告警名称
  @ViewChild('alarmName') private alarmName;
  // 区域选择
  @ViewChild('areaSelector') private areaSelectorTemp;
  // 告警对象
  @ViewChild('department') private departmentTemp;
  // 告警类别
  @ViewChild('alarmTypeTemp') private alarmTypeTemp;
  // 诊断设置
  @ViewChild('diagnosis') private diagnosis;
  // 告警详情
  @ViewChild('alarmDetailsTemp') private alarmDetailsTemp;
  areaId;
  // 从别的页面跳告警的时候 无数据给提示只给一次
  hasPrompt: boolean = false;

  constructor(public $router: Router,
              public $nzI18n: NzI18nService,
              public $alarmService: AlarmService,
              public $message: FiLinkModalService,
              public $active: ActivatedRoute,
              public $alarmStoreService: AlarmStoreService,
              public $currServive: CurrAlarmServiceService,
              private $dateHelper: DateHelperService,
              private $ruleUtil: RuleUtil,
              private modalService: NzModalService,
              private $facilityService: FacilityService,
              private $imageViewService: ImageViewService) {
    this.language = this.$nzI18n.getLocaleData('alarm');
  }

  ngOnInit() {
    // 告警选择显示初始化
    this.alarmHintList = [
      {label: this.language.displayAlarmLevel, code: AlarmHintList.alarmLevelCode},
      {label: this.language.displayAlarmObjType, code: AlarmHintList.alarmObjTypeCode}
    ];
    // 告警类别
    this.getAlarmTypeList();
    // 表格配置初始化
    CurrentAlarmUtil.initTableConfig(this);
    // 获取用户信息
    if (SessionUtil.getToken()) {
      this.token = SessionUtil.getToken();
      this.userInfo = SessionUtil.getUserInfo();
      this.userId = this.userInfo['id'];
    }
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
    this.refreshData();
    // 修改备注弹框
    this.initFormRemark();
    // 区域
    this.initAreaConfig();
    // 告警名称
    this.initAlarmName();
    // 告警对象
    this.initAlarmObjectConfig();
    // 卡片请求, 默认请求告警级别
    this.queryDeviceTypeCount(AlarmHintList.alarmLevelCode);
    // 诊断设置
    this.initSetForm();
  }
  /**
   * 告警类别
   */
  public getAlarmTypeList() {
    // this.ifSpin = true;
    this.$alarmService.getAlarmTypeList().subscribe((res: ResultModel<AlarmModel[]>) => {
      if (res.code === 0) {
        // this.ifSpin = false;
        const data = res.data;
        const resultData = data.map(item => {
          return ({
            'label': item.value,
            'code': item.key,
          });
        });
        this.alarmTypeList = resultData;
        this.isShowTable = true;
        // 故障类型枚举
        if (data && data.length > 0) {
          data.forEach(item => {
            this.typeStatus[item.key] = item.value;
          });
        }
        CurrentAlarmUtil.initTableConfig(this);
      }
    }, () => {
      // this.ifSpin = false;
    });
  }
  /**
   * 告警对象配置
   */
  initAlarmObjectConfig() {
    this.alarmObjectConfig = {
      clear: !this.checkAlarmObject.ids.length,
      alarmObject: (event) => {
        this.checkAlarmObject = event;
      }
    };
  }

  /**
   * 区域配置
   */
  initAreaConfig() {
    this.areaConfig = {
      clear: !this.areaList.ids.length,
      checkArea: (event) => {
        this.areaList = event;
      }
    };
  }

  /**
   *  告警名称配置
   */
  initAlarmName() {
    this.alarmNameConfig = {
      clear: !this._checkAlarmName.ids.length,
      alarmName: (event) => {
        this._checkAlarmName = event;
      }
    };
  }

  /**
   * 表格翻页
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
   * 备注配置
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
   * 修改备注表单实例
   */
  formInstanceRemark(event) {
    this.formStatusRemark = event.instance;
  }

  /**
   * 诊断弹窗表单实例
   * param event
   */
  formInstanceSet(event) {
    this.formStatusSet = event.instance;
  }
  /**
   * 获取当前告警列表信息
   */
  refreshData() {
    // this.ifSpin = true;
    this.tableConfig.isLoading = true;
    this.$alarmService.queryCurrentAlarmList(this.queryCondition).subscribe((res: Result) => {
      // this.ifSpin = false;
      this.tableConfig.isLoading = false;
      this.giveList(res);
    }, () => {
      // this.ifSpin = false;
      this.tableConfig.isLoading = false;

    });
  }

  /**
   * 请求过来的数据 赋值到列表
   */
  giveList(res) {
    this.pageBean.Total = res.totalCount;
    this.tableConfig.isLoading = false;
    this.pageBean.pageIndex = res.pageNum;
    this.pageBean.pageSize = res.size;
    this._dataSet = res.data || [];
    // 从其他页面跳转到告警第一次没数据给出提示
    const hasId = this.$active.snapshot.queryParams.id || this.$active.snapshot.queryParams.deviceId;
    if ((!this.hasPrompt) && this._dataSet.length === 0 && hasId) {
      this.hasPrompt = true;
      this.$message.info(this.language.noCurrentAlarmData);
    }
    this._dataSet.forEach(item => {
      // 通过首次发生时间计算出告警持续时间
      item.alarmContinousTime = CommonUtil.setAlarmContinousTime(item.alarmBeginTime, item.alarmCleanTime,
        {year: this.language.year, month: this.language.month, day: this.language.day, hour: this.language.hour});
      // 判断创建工单 禁启用
      item.isShowBuildOrder = item.alarmCode === 'orderOutOfTime' ? 'disabled' : true;
      item.isShowLocationIcon = false;
      item.isShowUpdateIcon = false;
      item.isShowViewIcon = false;
      item.isShowBuildOrderIcon = false;
    });
    this._dataSet = res.data.map(item => {
      item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
      item.alarmFixedLevelName = getAlarmLevel(this.$nzI18n, item.alarmFixedLevel);
      item.alarmCleanStatusName = getAlarmCleanStatus(this.$nzI18n, item.alarmCleanStatus);
      item.alarmSourceTypeName = getDeviceType(this.$nzI18n, item.alarmSourceTypeId);
      item.alarmConfirmStatusName = getIsConfirm(this.$nzI18n, item.alarmConfirmStatus);
      item.alarmName = getAlarmType(this.$nzI18n, item.alarmCode);
      return item;
    });
  }

  /**
   *  导出发送请求
   */
  exportAlarm(body) {
    this.$alarmService.exportAlarmList(body).subscribe((res: Result) => {
      if (res.code === 0) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 路由跳转
   */
  private navigateToDetail(url, extras = {}) {
    this.$router.navigate([url], extras).then();
  }

  /**
   * 查看图片
   */
  examinePicture(data) {
    // 查看图片节流阀
    if (this.viewLoading) {
      return;
    }
    this.viewLoading = true;
    this.$alarmService.examinePicture(data.id).subscribe((res: Result) => {
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
   * 模板查询
   */
  templateTable(event) {
    this.display.templateTable = false;
    if (!event) {
      return;
    }
    // 先清空表格里面的查询条件
    this.table.searchDate = {};
    this.table.rangDateValue = {};
    this.table.tableService.resetFilterConditions(this.table.queryTerm);
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
    this.$alarmService.alarmQueryTemplateById(this.templateId, data).subscribe(res => {
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

  /**
   * 告警确认
   */
  alarmComfirm(data) {
    this.confirmFlag = true;
    if (data.length > 0) {
      data.forEach(item => {
        if (item.alarmConfirmStatus === 1) {
          this.confirmFlag = false;
        }
      });

      if (!this.confirmFlag) {
        const alarmIds = [];
        data.forEach(item => {
          if (item.alarmConfirmStatus === 2) {
            alarmIds.push({'id': item.id});
          }
        });
        if (alarmIds.length > 0) {
          this.alarmIds = alarmIds;
          this.popUpConfirm();
        } else {
          this.$message.info(this.language.confirmAgain);
        }
      }
      if (this.confirmFlag) {
        const ids = data.map(item => item.id);
        // const alarmIds = [];
        this.alarmIds = [];
        ids.forEach(item => {
          this.alarmIds.push({'id': item});
        });
        this.popUpConfirm();
      }
    } else {
      this.$message.info(this.language.pleaseCheckThe);
    }
  }

  /**
   *  告警确认 弹框
   */
  popUpConfirm() {
    this.modalService.confirm({
      nzTitle: this.language.prompt,
      nzContent: this.language.alarmAffirm,
      nzOkText: this.language.cancelText,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.language.okText,
      nzOnCancel: () => {
        this.confirmationBoxConfirm('affirm');
      },
    });
  }

  /**
   * 告警清除 弹框
   */
  popUpClean() {
    this.modalService.confirm({
      nzTitle: this.language.prompt,
      nzContent: this.language.alarmAffirmClear,
      nzOkText: this.language.cancelText,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.language.okText,
      nzOnCancel: () => {
        this.confirmationBoxConfirm('cancel');
      },
    });
  }

  /**
   * 点击 确认
   */
  confirmationBoxConfirm(type: string) {
    // this.ifSpin = true;
    this.tableConfig.isLoading = true;
    if (type === 'affirm') {
      // 告警确认
      this.$alarmService.updateAlarmConfirmStatus(this.alarmIds).subscribe((res: Result) => {
        if (res.code === 0) {
          this.$message.success(res.msg);
          this.refreshData();
        } else {
          // this.ifSpin = false;
          this.tableConfig.isLoading = true;
          this.$message.info(res.msg);
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
    } else {
      // 告警清除
      this.$alarmService.updateAlarmCleanStatus(this.alarmIds).subscribe((res: Result) => {
        if (res.code === 0) {
          this.$message.success(res.msg);
          this.refreshData();
          // 重新请求卡片统计
          this.queryDeviceTypeCount(this.alarmHintValue);
          this.$currServive.sendMessage(2);
        } else {
          // this.ifSpin = false;
          this.tableConfig.isLoading = true;
          this.$message.info(res.msg);
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
    }
  }

  /**
   * 告警清除
   */
  alarmClean(data) {
    this.cleanFlag = true;
    if (data.length > 0) {
      data.forEach(item => {
        if (item.alarmCleanStatus === 1 || item.alarmCleanStatus === 2) {
          this.cleanFlag = false;
        }
      });
      if (!this.cleanFlag) {
        const alarmIds = [];
        data.forEach(item => {
          if (item.alarmCleanStatus === 3) {
            alarmIds.push({'id': item.id});
          }
        });
        if (alarmIds.length > 0) {
          this.alarmIds = alarmIds;
          this.popUpClean();
        } else {
          this.$message.info(this.language.cleanAgain);
        }
      }
      if (this.cleanFlag) {
        const ids = data.map(item => item.id);
        this.alarmIds = [];
        ids.forEach(item => {
          this.alarmIds.push({'id': item});
        });
        this.popUpClean();
      }
    } else {
      this.$message.info(this.language.pleaseCheckThe);
      return;
    }
  }

  /**
   * 修改备注
   */
  updateAlarmRemark() {
    const remarkData = this.formStatusRemark.getData().remark;
    const remark = remarkData ? remarkData : null;
    const data = this.checkRemark.map(item => {
      return {id: item.id, remark: remark};
    });
    this.tableConfig.isLoading = true;
    this.$alarmService.updateAlarmRemark(data).subscribe((res: Result) => {
      if (res.code === 0) {
        this.refreshData();
        this.$message.success(res.msg);
      } else {
        this.$message.info(res.msg);
        this.tableConfig.isLoading = false;
      }
      this.display.remarkTable = false;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 点击卡片，数据刷新
   * alarmLevel 为告警级别
   * deviceType 为设施类型
   */
  sliderChange(event) {
    // 清空筛选条件
    CurrentAlarmUtil.clearData(this);
    // 判断点击的是不是告警总数,
    this.table.tableService.resetFilterConditions(this.table.queryTerm);
    // 设置从slide进入的标志
    this.isClickSlider = true;
    if (this.deviceId) {
      const filter = new FilterCondition('alarmSource');
      filter.operator = 'eq';
      filter.filterValue = this.deviceId;
      this.table.queryTerm.set('deviceId', filter);
    }
    if (this.alarmId) {
      const filter = new FilterCondition('id');
      filter.operator = 'eq';
      filter.filterValue = this.alarmId;
      this.table.queryTerm.set('alarmId', filter);
    }
    this.table.handleSetControlData('alarmCleanStatus', [alarmCleanStatus.noClean]);
    if (event.label === this.language.alarmSum) {
      this.table.handleSearch();
    } else {
      // 不是总数是，分为告警级别和设施类型
      // 先清空表格里面的查询条件
      this.table.searchDate = {};
      this.table.rangDateValue = {};
      if (event.type === 'alarmLevel') {
        this.table.handleSetControlData('alarmFixedLevel', [event.levelCode]);
      } else {
        this.table.handleSetControlData('alarmSourceTypeId', [event.levelCode]);
      }
      this.table.handleSearch();
    }
  }

  /**
   * 滑块变化
   * param event
   */
  slideShowChange(event) {
    if (event) {
      this.tableConfig.outHeight = 108;
    } else {
      this.tableConfig.outHeight = 8;
    }
    this.table.calcTableHeight();
  }

  /**
   * 告警级别，告警对象类型切换
   */
  alarmHintValueModelChange() {
    if (this.alarmHintValue === AlarmHintList.alarmLevelCode) {
      this.queryDeviceTypeCount(AlarmHintList.alarmLevelCode);
    } else {
      this.queryDeviceTypeCount(AlarmHintList.alarmObjTypeCode);
    }
  }

  /**
   * 查询告警提示 设施类型总数
   * 1. 为告警级别
   * 2. 设施类型
   */
  private queryDeviceTypeCount(selectType: number) {
    this.sliderConfig = [];
    this.alarmType = [];
    if (selectType === AlarmHintList.alarmLevelCode) {
      // 选择告警级别显示
      if (this.alarmId) {
        // 告警ID
        this.$alarmService.queryAlarmIdHonePage({id: this.alarmId}).subscribe(res => {
          if (res['code'] === 0) {
            CurrentAlarmUtil.lineUpGive(this, 'level', res['data']);
          }
        });
      } else if (this.deviceId) {
        // 选择告警对象类型显示
        this.$alarmService.queryAlarmDeviceIdHonePage({deviceId: this.deviceId}).subscribe(res => {
          if (res['code'] === 0) {
            CurrentAlarmUtil.lineUpGive(this, 'level', res['data']);
          }
        });
      } else {
        const urgentAlarm = CurrentAlarmUtil.cardDataAnalysis(this, 'urgentAlarmCount', 0);
        const mainAlarm = CurrentAlarmUtil.cardDataAnalysis(this, 'mainAlarmCount', 0);
        const secondaryAlarm = CurrentAlarmUtil.cardDataAnalysis(this, 'minorAlarmCount', 0);
        const promptAlarm = CurrentAlarmUtil.cardDataAnalysis(this, 'hintAlarmCount', 0);
        this.alarmType = [urgentAlarm, mainAlarm, secondaryAlarm, promptAlarm];
        CurrentAlarmUtil.assignmentCard(this, 'level');
        // 选择告警级别显示
        this.$alarmService.queryEveryAlarmCount(AlarmLevel.urgentAlarmCode).subscribe(res => {
          if (res['code'] === 0) {
            this.sliderConfig[1]['sum'] = res['data'];
            this.sliderConfig[0]['sum'] += res['data'];
            this.sliderConfig[1]['color'] = this.$alarmStoreService.getAlarmColorByLevel(AlarmLevel.urgentAlarmCode).backgroundColor;
          }
        });
        this.$alarmService.queryEveryAlarmCount(AlarmLevel.mainAlarmCode).subscribe(res => {
          if (res['code'] === 0) {
            this.sliderConfig[2]['sum'] = res['data'];
            this.sliderConfig[0]['sum'] += res['data'];
            this.sliderConfig[2]['color'] = this.$alarmStoreService.getAlarmColorByLevel(AlarmLevel.mainAlarmCode).backgroundColor;
          }
        });
        this.$alarmService.queryEveryAlarmCount(AlarmLevel.minorAlarmCode).subscribe(res => {
          if (res['code'] === 0) {
            this.sliderConfig[3]['sum'] = res['data'];
            this.sliderConfig[0]['sum'] += res['data'];
            this.sliderConfig[3]['color'] = this.$alarmStoreService.getAlarmColorByLevel(AlarmLevel.minorAlarmCode).backgroundColor;
          }
        });
        this.$alarmService.queryEveryAlarmCount(AlarmLevel.hintAlarmCode).subscribe(res => {
          if (res['code'] === 0) {
            this.sliderConfig[4]['sum'] = res['data'];
            this.sliderConfig[0]['sum'] += res['data'];
            this.sliderConfig[4]['color'] = this.$alarmStoreService.getAlarmColorByLevel(AlarmLevel.hintAlarmCode).backgroundColor;
          }
        });
      }
    } else {
      if (this.alarmId) {
        this.$alarmService.queryAlarmIdCountHonePage({id: this.alarmId}).subscribe((result: Result) => {
          // 光交箱
          if (result.code === 0) {
            CurrentAlarmUtil.lineUpGive(this, 'device', result.data);
          }
        });
      } else if (this.deviceId) {
        this.$alarmService.queryAlarmObjectCountHonePage({deviceId: this.deviceId}).subscribe((result: Result) => {
          // 光交箱
          if (result.code === 0) {
            CurrentAlarmUtil.lineUpGive(this, 'device', result.data);
          }
        });
      } else {
        const Optical_Box = CurrentAlarmUtil.cardDataAnalysis(this, 'opticalBok', 0);
        const Well = CurrentAlarmUtil.cardDataAnalysis(this, 'well', 0);
        const Distribution_Frame = CurrentAlarmUtil.cardDataAnalysis(this, 'distributionFrame', 0);
        const Junction_Box = CurrentAlarmUtil.cardDataAnalysis(this, 'junctionBox', 0);
        const OUTDOOR_CABINET = CurrentAlarmUtil.cardDataAnalysis(this, 'splittingBox', 0);
        this.sliderConfig = [Optical_Box, Well, Distribution_Frame, Junction_Box, OUTDOOR_CABINET];
        CurrentAlarmUtil.assignmentCard(this, 'device');
        this.$alarmService.queryAlarmObjectCount('001').subscribe((result: Result) => {
          // 光交箱
          if (result.code === 0) {
            this.sliderConfig[1]['sum'] = result.data;
            this.sliderConfig[0]['sum'] += result.data;
          }
        });
        this.$alarmService.queryAlarmObjectCount('030').subscribe((result: Result) => {
          // 人井
          if (result.code === 0) {
            this.sliderConfig[2]['sum'] = result.data;
            this.sliderConfig[0]['sum'] += result.data;
          }
        });
        this.$alarmService.queryAlarmObjectCount('060').subscribe((result: Result) => {
          // 配线架
          if (result.code === 0) {
            this.sliderConfig[3]['sum'] = result.data;
            this.sliderConfig[0]['sum'] += result.data;
          }
        });
        this.$alarmService.queryAlarmObjectCount('090').subscribe((result: Result) => {
          // 接头盒
          if (result.code === 0) {
            this.sliderConfig[4]['sum'] = result.data;
            this.sliderConfig[0]['sum'] += result.data;
          }
        });
        this.$alarmService.queryAlarmObjectCount('210').subscribe((result: Result) => {
          // 室外柜
          if (result.code === 0) {
            this.sliderConfig[5]['sum'] = result.data;
            this.sliderConfig[0]['sum'] += result.data;
          }
        });
      }
    }
  }

  /**
   * 诊断确认
   */
  setHandle() {
    const setData = this.formStatusSet.getData();
    setData.id = this.diagnoseId;
    this.$alarmService.diagnosticUpdate(setData).subscribe((result: Result) => {
      if (result.code === 0) {
        this.display.diagnoseSet = false;
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }
  /**
   * 诊断取消
   */
  setHandleCancel() {
    this.display.diagnoseSet = false;
    this.tableColumnSet = [];
    this.initSetForm();
  }
  /**
   * 诊断设置
   */
  public initSetForm() {
    this.tableColumnSet = [
      { // 是否自动诊断
        label: this.language.automaticDiagnosis,
        key: 'isAutoDiagnose',
        type: 'radio',
        require: false,
        col: 24,
        initialValue: '0',
        radioInfo: {
          data: [
            {label: this.language.yes, value: '1'},
            {label: this.language.no, value: '0'},
          ],
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, $event, key, formOperate: FormOperate) => {
        },
        rule: [],
        asyncRules: []
      },
      { // 误判阈值
        label: this.language.miscalculationThreshold, key: 'misjudgementThreshold',
        type: 'input', require: false,
        col: 24,
        suffix: '%',
        modelChange: (controls, $event, key) => {
        },
        openChange: (a, b, c) => {
        },
        rule: [], asyncRules: []
      },
      { // 确诊阈值
        label: this.language.diagnosisThreshold, key: 'diagnosticThreshold',
        type: 'input', require: false,
        col: 24,
        suffix: '%',
        modelChange: (controls, $event, key) => {
        },
        openChange: (a, b, c) => {
        },
        rule: [], asyncRules: []
      },
      { // 自动核实派单
        label: this.language.automaticVerifyDispatch,
        key: 'isAutoCheckDispatch',
        type: 'radio',
        require: false,
        col: 24,
        initialValue: '0',
        radioInfo: {
          data: [
            {label: this.language.yes, value: '1'},
            {label: this.language.no, value: '0'},
          ],
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, $event, key, formOperate: FormOperate) => {
        },
        rule: [],
        asyncRules: []
      },
      { // 自动转故障
        label: this.language.automaticTurnFault,
        key: 'isAutoTurnMalfunction',
        type: 'radio',
        require: false,
        col: 24,
        initialValue: '0',
        radioInfo: {
          data: [
            {label: this.language.yes, value: '1'},
            {label: this.language.no, value: '0'},
          ],
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, $event, key, formOperate: FormOperate) => {
        },
        rule: [],
        asyncRules: []
      },
    ];
  }

  /**
   * 告警详情
   *
   */
  getAlarmDetails(data) {
    let alarmDetail = '';
    if (data.alarmProcessing) {
      alarmDetail += data.alarmProcessing + ';';
    }
    if (data.extraMsg) {
      alarmDetail += data.extraMsg;
    }
    return alarmDetail;
  }

  /**
   * 获取诊断数据
   */
  getDiagnosticData() {
    this.ifSpin = true;
    this.$alarmService.getDiagnosticData().subscribe((result: Result) => {
      if (result.code === 0) {
        this.ifSpin = false;
        // 接口返回一个数组,默认取第一条
        const d = result.data[0];
        this.diagnoseId = d.id;
        this.formStatusSet.resetData(d);
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.ifSpin = false;
    });
  }
}
