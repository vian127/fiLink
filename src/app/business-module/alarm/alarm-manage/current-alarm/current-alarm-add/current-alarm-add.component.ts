import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-opearte.service';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {UserService} from '../../../../../core-module/api-service/user';
import {ActivatedRoute, Router} from '@angular/router';
import {Result} from '../../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmService} from '../../../../../core-module/api-service/alarm';
import {FacilityService} from '../../../../../core-module/api-service/facility/facility-manage';
import {TableComponent} from 'src/app/shared-module/component/table/table.component';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {NzI18nService, toBoolean} from 'ng-zorro-antd';
import {getAlarmLevel, getDeviceType} from '../../../../facility/share/const/facility.config';
import {QueryCondition} from '../../../../../shared-module/entity/queryCondition';
import {TreeSelectorConfig} from '../../../../../shared-module/entity/treeSelectorConfig';
import {AlarmNameConfig, AlarmObjectConfig, AreaConfig, UnitConfig} from 'src/app/shared-module/component/alarm/alarmSelectorConfig';
import {CommonUtil} from '../../../../../shared-module/util/common-util';

/**
 * 当前告警、历史告警页面 模板 新增和编辑
 */

@Component({
  selector: 'app-current-alarm-add',
  templateUrl: './current-alarm-add.component.html',
  styleUrls: ['./current-alarm-add.component.scss']
})
export class CurrentAlarmAddComponent implements OnInit {
  // 表单项配置
  formColumn: FormItem[] = [];
  // 表单对象
  formStatus: FormOperate;
  // 查询条件
  queryCondition: QueryCondition = new QueryCondition();
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  // 默认新增页面标志
  public pageType = 'add';
  // 是否存库 默认 是
  public defaultStatus: string = '1';
  // 启用状态 默认 启用
  public isNoStartData: string = '1';
  // 勾选的责任单位
  checkUnit = {
    name: '',
    ids: []
  };
  // 勾选的告警对象
  checkAlarmObject = {
    name: '',
    ids: []
  };
  // 勾选的告警名称
  checkAlarmName = {
    name: '',
    ids: []
  };
  // 时间model
  timeModel = {
    firstTimeModel: [],
    notarizeTimeModel: [],
    recentlyTimeModel: [],
    clearTimeModel: []
  };
  // 标题
  title: string = '';
  // 编辑id
  updateParamsId;
  isLoading: boolean = false;
  // 区域
  areaSelectorConfig: any = new TreeSelectorConfig();
  areaList = {
    ids: [],
    name: ''
  };
  isHistoryAlarmTemplateTable: boolean = false; // 是否历史告警模板
  areaConfig: AreaConfig;
  // 告警名称
  alarmNameConfig: AlarmNameConfig;
  // 告警对象
  alarmObjectConfig: AlarmObjectConfig;
  // 责任单位
  unitConfig: UnitConfig;
  // 创建信息
  createData;
  // 首次发生时间表单项模板
  @ViewChild('firstTimeTemp') private firstTimeTemp;
  // 确认发生时间表单项模板
  @ViewChild('notarizeTimeTemp') private notarizeTimeTemp;
  // 最近发生时间表单项模板
  @ViewChild('recentlyTimeTemp') private recentlyTimeTemp: TableComponent;
  // 清除时间表单项模板
  @ViewChild('clearTimeTemp') private clearTimeTemp: TableComponent;
  // 告警名称表单项模板
  @ViewChild('alarmName') private alarmName;
  // 告警对象选择表单项模板
  @ViewChild('department') private departmentTep;
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  // 区域表单项模板
  @ViewChild('areaSelector') private areaSelector;
  // 责任单位
  @ViewChild('unitTemp') private unitTemp;
  @ViewChild('alarmContinueTimeTemp') private alarmContinueTimeTemp;

  constructor(
    public $nzI18n: NzI18nService,
    public $userService: UserService,
    public $message: FiLinkModalService,
    public $active: ActivatedRoute,
    public $router: Router,
    public $alarmService: AlarmService,
    public $facilityService: FacilityService,
    private $ruleUtil: RuleUtil,
  ) {
    this.language = this.$nzI18n.getLocaleData('alarm');
  }

  ngOnInit() {
    // debugger;
    // 表单初始化
    this.initForm();
    if (this.$active.snapshot.queryParams.isHistoryAlarmTemplateTable) {
      this.isHistoryAlarmTemplateTable = this.$active.snapshot.queryParams.isHistoryAlarmTemplateTable;
    }
    // 路由参数
    this.pageType = this.$active.snapshot.params.type;
    if (this.pageType === 'add') {
      // 新建
      this.title = this.language.addAtPresentAlarm;
    } else {
      // 编辑
      this.title = this.language.updateAtPresentAlarm;
      this.$active.queryParams.subscribe(params => {
        this.updateParamsId = params.id;
        setTimeout(() => {
          this.getAlarmData(params.id, params.isHistoryAlarmTemplateTable);
        }, 200);
      });
    }
    // 区域
    this.initAreaConfig();
    // 告警名称
    this.initAlarmName();
    // 告警对象
    this.initAlarmObjectConfig();
    // 责任单位
    this.initUnitConfig();
  }

  /**
   * 责任单位
   */
  initUnitConfig() {
    this.unitConfig = {
      type: 'form',
      initialValue: this.checkUnit,
      checkUnit: (event) => {
        this.checkUnit = event;
        const names = this.checkUnit.name.split(',');
        const departmentList = this.checkUnit.ids.map((id, index) => {
          return {'departmentName': names[index], 'departmentId': id};
        });
        this.formStatus.resetControlData('departmentList', departmentList);
      }
    };
  }

  /**
   * 告警对象
   */
  initAlarmObjectConfig() {
    this.alarmObjectConfig = {
      type: 'form',
      initialValue: this.checkAlarmObject, // 默认值
      alarmObject: (event) => {
        this.checkAlarmObject = event;
        const names = this.checkAlarmObject.name.split(',');
        const alarmObjectList = this.checkAlarmObject.ids.map((id, index) => {
          return {'deviceName': names[index], 'deviceId': id};
        });
        this.formStatus.resetControlData('alarmObjectList', alarmObjectList);
      }
    };
  }

  /**
   * 告警名称
   */
  initAlarmName() {
    this.alarmNameConfig = {
      type: 'form',
      initialValue: this.checkAlarmName,
      alarmName: (event) => {
        this.checkAlarmName = event;
        const names = this.checkAlarmName.name.split(',');
        const alarmNameList = this.checkAlarmName.ids.map((id, index) => {
          return {'alarmName': names[index], 'alarmNameId': id};
        });
        this.formStatus.resetControlData('alarmNameList', alarmNameList);
      }
    };
  }

  /**
   * 区域
   */
  initAreaConfig() {
    this.areaConfig = {
      type: 'form',
      initialValue: this.areaList,
      checkArea: (event) => {
        this.areaList = event;
        const names = this.areaList.name.split(',');
        const areaNameList = this.areaList.ids.map((id, index) => {
          return {'areaName': names[index], 'areaId': id};
        });
        this.formStatus.resetControlData('areaNameList', areaNameList);
      }
    };
  }

  /**
   * 表单初始化
   */
  public initForm() {
    this.formColumn = [
      {
        // 模板名称
        label: this.language.templateName,
        key: 'templateName',
        type: 'input',
        col: 12,
        require: true,
        width: 300,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      {
        // 频次
        label: this.language.alarmHappenCount,
        key: 'alarmHappenCount',
        type: 'input',
        width: 300,
        col: 12,
        rule: [
          {maxLength: 8},
          {pattern: /^\+?[1-9][0-9]*$/, msg: this.language.enterAlarmHappenCount},
          {min: 1, msg: this.language.enterAlarmHappenCount},
          this.$ruleUtil.getRemarkMaxLengthRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      {
        // 告警级别
        label: this.language.alarmFixedLevel,
        key: 'alarmFixedLevel',
        type: 'select',
        width: 300,
        col: 12,
        rule: [],
        asyncRules: [],
        allowClear: true,
        selectType: 'multiple',
        selectInfo: {
          data: getAlarmLevel(this.$nzI18n),
          label: 'label',
          value: 'code'
        },
      },
      {
        // 首次发生时间
        label: this.language.alarmBeginTime,
        key: 'alarmBeginTime',
        type: 'custom',
        col: 12,
        template: this.firstTimeTemp,
        rule: [],
        asyncRules: []
      },
      {
        // 设施类型
        label: this.language.alarmSourceType,
        key: 'alarmSourceTypeId',
        type: 'select',
        col: 12,
        selectType: 'multiple',
        width: 420,
        selectInfo: {
          data: getDeviceType(this.$nzI18n),
          label: 'label',
          value: 'code'
        },
        allowClear: true,
        rule: [],
      },
      {
        // 确认时间
        label: this.language.alarmConfirmTime,
        key: 'alarmConfirmTime',
        type: 'custom',
        col: 12,
        template: this.notarizeTimeTemp,
        rule: [],
        asyncRules: []
      },
      {
        // 确认状态
        label: this.language.alarmConfirmStatus,
        key: 'alarmConfirmStatus',
        type: 'select',
        width: 300,
        col: 12,
        allowClear: true,
        selectInfo: {
          data: [
            {label: this.language.isConfirm, value: 1},
            {label: this.language.noConfirm, value: 2},
          ],
          label: 'label',
          value: 'value'
        },
        rule: [
          RuleUtil.getNamePatternRule()
        ],
      },
      {
        // 确认用户
        label: this.language.alarmConfirmPeopleNickname,
        key: 'alarmConfirmPeopleNickname',
        type: 'input',
        width: 300,
        col: 12,
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()
        ],
      },
      {
        // 清除用户
        label: this.language.alarmCleanPeopleNickname,
        key: 'alarmCleanPeopleNickname',
        type: 'input',
        col: 12,
        width: 300,
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()
        ],
      },
      {
        // 告警名称
        label: this.language.alarmName,
        key: 'alarmNameList',
        col: 12,
        width: 300,
        type: 'custom',
        rule: [],
        asyncRules: [],
        template: this.alarmName
      },
      {
        // 备注
        label: this.language.remark,
        key: 'remark',
        type: 'input',
        // require: true,
        width: 300,
        col: 12,
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      {
        // 区域
        label: this.language.area,
        key: 'areaNameList',
        type: 'custom',
        width: 300,
        col: 12,
        rule: [],
        asyncRules: [],
        template: this.areaSelector,
      },
      {
        // 责任单位
        label: this.language.responsibleDepartment,
        key: 'departmentList',
        type: 'input',
        width: 300,
        col: 12,
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()
        ],
      },
      {
        // 告警对象
        label: this.language.alarmobject,
        key: 'alarmObjectList',
        type: 'custom',
        width: 300,
        col: 12,
        rule: [],
        asyncRules: [],
        template: this.departmentTep
      },
      {
        // 清除状态
        label: this.language.alarmCleanStatus,
        key: 'alarmCleanStatus',
        type: 'select',
        width: 300,
        col: 12,
        allowClear: true,
        selectInfo: {
          data: [
            {label: this.language.noClean, value: 3},
            {label: this.language.isClean, value: 1},
            {label: this.language.deviceClean, value: 2}
          ],
          label: 'label',
          value: 'value'
        },
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()
        ],
      },
      {
        // 详细地址
        label: this.language.address,
        key: 'address',
        type: 'input',
        width: 300,
        col: 12,
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()
        ],
      },
      {
        // 最近发生时间
        label: this.language.alarmNearTime,
        key: 'alarmNearTime',
        type: 'custom',
        col: 12,
        template: this.recentlyTimeTemp,
        rule: [],
        asyncRules: []
      },
      {
        // 告警附加信息
        label: this.language.alarmAdditionalInformation,
        key: 'extraMsg',
        type: 'input',
        width: 300,
        col: 12,
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()
        ],
      },
      {
        // 告警处理建议
        label: this.language.alarmProcessing,
        key: 'alarmProcessing',
        type: 'input',
        width: 300,
        col: 12,
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()
        ],
      },
      {
        // 清除时间
        label: this.language.alarmCleanTime,
        key: 'alarmCleanTime',
        type: 'custom',
        col: 12,
        template: this.clearTimeTemp,
        rule: [],
        asyncRules: []
      },
    ];
  }

  /**
   * 通过编辑id, 查询要编辑的数据
   */
  getAlarmData(id, isHistoryAlarmTemplateTable) {
    let url;
    if (!JSON.parse(isHistoryAlarmTemplateTable)) {
      url = 'queryAlarmTemplateById';
    } else {
      url = 'queryHistoryAlarmTemplateById';
    }
    this.$alarmService[url]([id]).subscribe((res: Result) => {
      if (res.code === 0) {
        const alarmData = res.data;
        this.createData = {
          createTime: alarmData.createTime,
          createUser: alarmData.createUser,
          responsibleId: alarmData.responsibleId
        };
        // 首次发生时间
        if (alarmData.alarmBeginFrontTime && alarmData.alarmBeginQueenTime) {
          alarmData.alarmBeginTime = [this.timeAnalysis(alarmData.alarmBeginFrontTime), this.timeAnalysis(alarmData.alarmBeginQueenTime)];
          this.timeModel.firstTimeModel = [this.timeAnalysis(alarmData.alarmBeginFrontTime),
            this.timeAnalysis(alarmData.alarmBeginQueenTime)];
        }
        // 确认时间
        if (alarmData.alarmConfirmFrontTime && alarmData.alarmConfirmFrontTime) {
          alarmData.alarmConfirmTime = [this.timeAnalysis(alarmData.alarmConfirmFrontTime),
            this.timeAnalysis(alarmData.alarmConfirmQueenTime)];
          this.timeModel.notarizeTimeModel = [this.timeAnalysis(alarmData.alarmConfirmFrontTime),
            this.timeAnalysis(alarmData.alarmConfirmQueenTime)];
        }
        // 最近发生时间
        if (alarmData.alarmNearFrontTime && alarmData.alarmNearQueenTime) {
          alarmData.alarmNearTime = [this.timeAnalysis(alarmData.alarmNearFrontTime),
            this.timeAnalysis(alarmData.alarmNearQueenTime)];
          this.timeModel.recentlyTimeModel = [this.timeAnalysis(alarmData.alarmNearFrontTime),
            this.timeAnalysis(alarmData.alarmNearQueenTime)];
        }
        // 清除时间
        if (alarmData.alarmCleanFrontTime && alarmData.alarmCleanQueenTime) {
          alarmData.alarmData = [this.timeAnalysis(alarmData.alarmCleanFrontTime), this.timeAnalysis(alarmData.alarmCleanQueenTime)],
            this.timeModel.clearTimeModel = [this.timeAnalysis(alarmData.alarmCleanFrontTime),
              this.timeAnalysis(alarmData.alarmCleanQueenTime)];
        }
        // 告警名称
        if (alarmData.alarmNameList && alarmData.alarmNameList.length) {
          this.checkAlarmName = {
            ids: alarmData.alarmNameList.map(item => item.alarmNameId),
            name: alarmData.alarmNameList.map(item => item.alarmName).join(',')
          };
          this.initAlarmName();
        }
        // 区域
        if (alarmData.areaNameList && alarmData.areaNameList.length) {
          this.areaList = {
            ids: alarmData.areaNameList.map(item => item.areaId),
            name: alarmData.areaNameList.map(item => item.areaName).join(',')
          };
          this.initAreaConfig();
        }
        // 告警对象
        if (alarmData.alarmObjectList && alarmData.alarmObjectList.length) {
          this.checkAlarmObject = {
            ids: alarmData.alarmObjectList.map(item => item.deviceId),
            name: alarmData.alarmObjectList.map(item => item.deviceName).join(',')
          };
          this.initAlarmObjectConfig();
        }
        // 责任单位
        if (alarmData.departmentList && alarmData.departmentList[0]) {
          alarmData.departmentList = alarmData.departmentList[0].departmentName;
        }
        if (alarmData.alarmFixedLevel) {
          alarmData.alarmFixedLevel = alarmData.alarmFixedLevel.split(',');
        }
        if (alarmData.alarmSourceTypeId) {
          alarmData.alarmSourceTypeId = alarmData.alarmSourceTypeId.split(',');
        }
        this.formStatus.resetData(alarmData);
      }
    });
  }

  /**
   * 时间戳转化为时间格式
   */
  timeAnalysis(time: number) {
    return new Date(CommonUtil.convertTime(time));
  }

  /**
   * 时间格式转换时间戳
   */
  timestamp(timeRange) {
    // 去除随机的毫秒值补000
    const start = Math.floor(CommonUtil.sendBackEndTime(timeRange[0].getTime()) / 1000) * 1000;
    // 去除随机的毫秒值补999
    const end = Math.floor(CommonUtil.sendBackEndTime(timeRange[1].getTime()) / 1000) * 1000 + 999;
    return [start, end];
  }

  /**
   * 获取表单实例
   */
  formInstance(event) {
    this.formStatus = event.instance;
  }

  /**
   * 取消提交
   */
  cancel() {
    this.$router.navigate(['business/alarm/current-alarm']).then();
  }

  /**
   * 首次发生时间
   */
  firstTimeChange(event) {
    this.timeModel.firstTimeModel = event;
  }

  /**
   * 打开日历，关闭日历校验
   */
  firstTimeOnOpenChange(event) {
    if (event) {
      return;
    }
    if (+this.timeModel.firstTimeModel[0] > +this.timeModel.firstTimeModel[1]) {
      this.timeModel.firstTimeModel = [];
      this.$message.warning(this.language.timeMsg);
    }
    // 关闭时 避免时间控件的一些非常规操作 重新赋值下
    this.timeModel.firstTimeModel = this.timeModel.firstTimeModel.slice();
  }

  /**
   *  确认时间
   */
  notarizeTimeChange(event) {
    this.timeModel.notarizeTimeModel = event;
  }

  /**
   * 确认时间，打开，关闭弹窗校验
   */
  notarizeTimeOnOpenChange(event) {
    if (event) {
      return;
    }
    if (+this.timeModel.notarizeTimeModel[0] > +this.timeModel.notarizeTimeModel[1]) {
      this.timeModel.notarizeTimeModel = [];
      this.$message.warning(this.language.timeMsg);
    }
    // 关闭时 避免时间控件的一些非常规操作 重新赋值下
    this.timeModel.notarizeTimeModel = this.timeModel.notarizeTimeModel.slice();
  }

  /**
   * 最近发生时间
   */
  recentlyTimeChange(event) {
    this.timeModel.recentlyTimeModel = event;
  }

  /**
   *  最近发生时间，打开关闭弹窗校验
   */
  recentlyTimeOnOpenChange(event) {
    if (event) {
      return;
    }
    if (+this.timeModel.recentlyTimeModel[0] > +this.timeModel.recentlyTimeModel[1]) {
      this.timeModel.recentlyTimeModel = [];
      this.$message.warning(this.language.timeMsg);
    }
    // 关闭时 避免时间控件的一些非常规操作 重新赋值下
    this.timeModel.recentlyTimeModel = this.timeModel.recentlyTimeModel.slice();
  }

  /**
   * 清除时间
   */
  clearTimeChange(event) {
    this.timeModel.clearTimeModel = event;
  }

  /**
   * 清除弹窗，打开关闭弹窗校验
   */
  clearTimeOnOpenChange(event) {
    if (event) {
      return;
    }
    if (+this.timeModel.clearTimeModel[0] > +this.timeModel.clearTimeModel[1]) {
      this.timeModel.clearTimeModel = [];
      this.$message.warning(this.language.timeMsg);
    }
    // 关闭时 避免时间控件的一些非常规操作 重新赋值下
    this.timeModel.clearTimeModel = this.timeModel.clearTimeModel.slice();
  }

  /**
   * 表单提交
   */
  submit() {
    this.isLoading = true;
    const alarmObj = this.formStatus.getData();
    alarmObj.templateName = alarmObj.templateName && alarmObj.templateName.trim();
    alarmObj.alarmConfirmPeopleNickname = alarmObj.alarmConfirmPeopleNickname && alarmObj.alarmConfirmPeopleNickname.trim();
    alarmObj.alarmCleanPeopleNickname = alarmObj.alarmCleanPeopleNickname && alarmObj.alarmCleanPeopleNickname.trim();
    alarmObj.remark = alarmObj.remark && alarmObj.remark.trim();
    alarmObj.departmentList = alarmObj.departmentList && alarmObj.departmentList.length && alarmObj.departmentList.trim();
    alarmObj.address = alarmObj.address && alarmObj.address.trim();
    alarmObj.extraMsg = alarmObj.extraMsg && alarmObj.extraMsg.trim();
    alarmObj.alarmProcessing = alarmObj.alarmProcessing && alarmObj.alarmProcessing.trim();
    // 首次发生时间
    if (this.timeModel.firstTimeModel.length) {
      const times = this.timestamp(this.timeModel.firstTimeModel);
      alarmObj.alarmBeginFrontTime = times[0];
      alarmObj.alarmBeginQueenTime = times[1];
    } else {
      alarmObj.alarmBeginFrontTime = null;
      alarmObj.alarmBeginQueenTime = null;
      alarmObj.alarmBeginTime = null;
    }
    // 确认时间
    if (this.timeModel.notarizeTimeModel.length) {
      const times = this.timestamp(this.timeModel.notarizeTimeModel);
      alarmObj.alarmConfirmFrontTime = times[0];
      alarmObj.alarmConfirmQueenTime = times[1];
    } else {
      alarmObj.alarmConfirmFrontTime = null;
      alarmObj.alarmConfirmQueenTime = null;
      alarmObj.alarmConfirmTime = null;
    }
    // 最近发生时间
    if (this.timeModel.recentlyTimeModel.length) {
      const times = this.timestamp(this.timeModel.recentlyTimeModel);
      alarmObj.alarmNearFrontTime = times[0];
      alarmObj.alarmNearQueenTime = times[1];
    } else {
      alarmObj.alarmNearFrontTime = null;
      alarmObj.alarmNearQueenTime = null;
      alarmObj.alarmNearTime = null;
    }
    // 清除时间
    if (this.timeModel.clearTimeModel.length) {
      const times = this.timestamp(this.timeModel.clearTimeModel);
      alarmObj.alarmCleanFrontTime = times[0];
      alarmObj.alarmCleanQueenTime = times[1];
    } else {
      alarmObj.alarmCleanFrontTime = null;
      alarmObj.alarmCleanQueenTime = null;
      alarmObj.alarmCleanTime = null;
    }
    // 频次
    alarmObj.alarmHappenCount = alarmObj.alarmHappenCount ? Number(alarmObj.alarmHappenCount) : null;
    // 责任单位
    alarmObj.departmentList = [{'departmentName': alarmObj.departmentList}];
    if (alarmObj.alarmFixedLevel) {
      alarmObj.alarmFixedLevel = alarmObj.alarmFixedLevel.join();
    }
    if (alarmObj.alarmSourceTypeId) {
      alarmObj.alarmSourceTypeId = alarmObj.alarmSourceTypeId.join();
    }
    let addUrl, updataUrl, path;
    if (!toBoolean(this.isHistoryAlarmTemplateTable)) {
      addUrl = 'addAlarmTemplate';
      updataUrl = 'updataAlarmTemplate';
      path = 'current';
    } else {
      addUrl = 'addHistoryAlarmTemplate';
      updataUrl = 'updataHistoryAlarmTemplate';
      path = 'history';
    }
    if (this.pageType === 'add') {
      this.$alarmService[addUrl](alarmObj).subscribe((res: Result) => {
        this.isLoading = false;
        if (res && res.code === 0) {
          this.$message.success(res.msg);
          this.$router.navigate([`business/alarm/${path}-alarm`]).then();
        }
      });
    } else {
      alarmObj.id = this.updateParamsId;
      alarmObj.createTime = this.createData.createTime;
      alarmObj.createUser = this.createData.createUser;
      alarmObj.responsibleId = this.createData.responsibleId;
      this.$alarmService[updataUrl](alarmObj).subscribe((res: Result) => {
        this.isLoading = false;
        if (res && res.code === 0) {
          this.$message.success(res.msg);
          this.$router.navigate([`business/alarm/${path}-alarm`]).then();
        }
      });
    }
  }
}
