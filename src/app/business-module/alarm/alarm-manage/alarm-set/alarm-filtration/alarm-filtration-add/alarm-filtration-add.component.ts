import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormItem } from '../../../../../../shared-module/component/form/form-config';
import { FormOperate } from '../../../../../../shared-module/component/form/form-opearte.service';
import { NzI18nService } from 'ng-zorro-antd';
import { AlarmLanguageInterface } from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import { UserService } from '../../../../../../core-module/api-service/user';
import { ActivatedRoute, Router } from '@angular/router';
import { Result } from '../../../../../../shared-module/entity/result';
import { FiLinkModalService } from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import { AlarmService } from '../../../../../../core-module/api-service/alarm';
import { FacilityService } from '../../../../../../core-module/api-service/facility/facility-manage';
import {RuleUtil} from '../../../../../../shared-module/util/rule-util';
import { AlarmObjectConfig, AlarmNameConfig } from 'src/app/shared-module/component/alarm/alarmSelectorConfig';
import {CommonLanguageInterface} from '../../../../../../../assets/i18n/common/common.language.interface';
import {getAlarmType, getDisableAndEnable} from '../../../../../facility/share/const/facility.config';

/**
 * 告警过滤 新增和编辑页面
 */
@Component({
  selector: 'app-alarm-filtration-add',
  templateUrl: './alarm-filtration-add.component.html',
  styleUrls: ['./alarm-filtration-add.component.scss']
})

export class AlarmFiltrationAddComponent implements OnInit {

  formColumn: FormItem[] = [];
  formStatus: FormOperate;
  public language: AlarmLanguageInterface;
  public pageType = 'add';
  // 是否存库 默认 是
  public defaultStatus: number = 1; // 默认状态
  // 启用状态 默认 启用
  public isNoStartData: boolean = true;
  isLoading = false;
  private firstChange: boolean = true;
  public commonLanguage: CommonLanguageInterface;
  @ViewChild('startTime') private startTime;
  @ViewChild('endTime') private endTime;
  @ViewChild('department') private departmentTep;
  @ViewChild('isNoStartUsing') private isNoStartUsing;
  @ViewChild('alarmName') private alarmName;
  @ViewChild('alarmDefaultLevelTemp') alarmDefaultLevelTemp: TemplateRef<any>;
  @ViewChild('titleDataTemplate') private titleDataTemplate;
  @ViewChild('filtrationDataTemplate') private filtrationDataTemplate;
  @ViewChild('deviceStatusTemp') deviceStatusTemp: TemplateRef<any>;
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
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
  display = {
    alarmNameDisabled: true,
    rulePopUp: false
  };

  alarmNameConfig: AlarmNameConfig;
  // 开始时间和结束时间
  time = {
    startTime: 0,
    endTime: 0
  };
  startTimeModel;
  endTimeModel;
  // 标题
  title: string = '';
  // 编辑id
  updateParamsId;
  alarmObjectConfig: AlarmObjectConfig;
  constructor(
    public $nzI18n: NzI18nService,
    public $userService: UserService,
    public $message: FiLinkModalService,
    public $active: ActivatedRoute,
    public $router: Router,
    private $ruleUtil: RuleUtil,
    public $alarmService: AlarmService,
    public $facilityService: FacilityService,
  ) {
    this.language = this.$nzI18n.getLocaleData('alarm');
  }

  ngOnInit() {
    this.initForm();
    this.pageType = this.$active.snapshot.params.type;
    if (this.pageType === 'add') {
      // 新建
      this.title = this.language.addAlarmFiltration;
      this.initAlarmObjectConfig();
      this.initAlarmNameConfig();
    } else {
      // 编辑
      this.title = this.language.updateAlarmFiltration;
      this.$active.queryParams.subscribe(params => {
        this.updateParamsId = params.id;
        this.getAlarmData(params.id);
      });
    }
  }
  // 告警对象
  initAlarmObjectConfig() {
    this.alarmObjectConfig = {
      initialValue: this.checkAlarmObject, // 默认值
      type: 'form',
      alarmObject: (event) => {
        this.checkAlarmObject = event;
        this.formStatus.resetControlData('alarmFilterRuleSourceList', this.checkAlarmObject.ids);
        if (this.checkAlarmObject.ids && this.checkAlarmObject.ids.length ) {
          this.display.alarmNameDisabled = false;
        } else {
          this.checkAlarmName = {
            ids: [],
            name: ''
          };
          this.display.alarmNameDisabled = true;
          this.formStatus.resetControlData('alarmFilterRuleNameList', []);
        }
        this.initAlarmNameConfig();
      }
    };
  }

  getAlarmData(id) {
    this.$alarmService.queryAlarmById([id]).subscribe((res: Result) => {
      if (res['code'] === 0) {
        const alarmData = res.data[0];
        // 设置告警对象
        if (alarmData.alarmFilterRuleSourceList && alarmData.alarmFilterRuleSourceList.length
          && alarmData.alarmFilterRuleSourceName && alarmData.alarmFilterRuleSourceName.length) {
          this.checkAlarmObject = {
            name: alarmData.alarmFilterRuleSourceName.join(','),
            ids: alarmData.alarmFilterRuleSourceList
          };
          this.formStatus.resetControlData('alarmFilterRuleSourceList', this.checkAlarmObject.ids);
          this.initAlarmObjectConfig();
        }
        // 设置告警名称
        if (alarmData.alarmFilterRuleNameList && alarmData.alarmFilterRuleNameList.length
          && alarmData.alarmFilterRuleNames && alarmData.alarmFilterRuleNames.length ) {
          const namesArr = [];
          alarmData.alarmFilterRuleNames.forEach(__item => {
            namesArr.push(getAlarmType(this.$nzI18n, __item));
          });
          const alarmName: string = namesArr.join(',');
          this.checkAlarmName = {
            name: alarmName,
            ids: alarmData.alarmFilterRuleNameList,
          };
          this.formStatus.resetControlData('alarmFilterRuleNameList', this.checkAlarmName.ids);
          this.display.alarmNameDisabled = false;
          this.initAlarmNameConfig();
        }
        // 设置开始时间
        if (alarmData.beginTime) {
          this.time.startTime = alarmData.beginTime;
          this.startTimeModel = new Date(alarmData.beginTime);
        }
        // 设置结束时间
        if (alarmData.endTime) {
          this.time.endTime = alarmData.endTime;
          this.endTimeModel = new Date(alarmData.endTime);
        }
        // 启用 禁用状态
        if (alarmData.status) { this.isNoStartData = alarmData.status === 1 ? true : false; }
        // 是否存库
        // alarmData.stored = alarmData.stored;
        this.formStatus.resetData(alarmData);
      }
    });
  }

  // 告警名称
  private initAlarmNameConfig() {
    // const clear = this.checkAlarmObject.ids.length ? false : true;
    this.alarmNameConfig = {
      type: 'form',
      initialValue: this.checkAlarmName,
      disabled: this.display.alarmNameDisabled,
      clear: !this.checkAlarmObject.ids.length,
      alarmName: (event) => {
        this.checkAlarmName = {
          name: event.name,
          ids: event.ids
        };
        // this.display.nameTable = false;
        this.formStatus.resetControlData('alarmFilterRuleNameList', this.checkAlarmName.ids);
      }
    };
  }

  formInstance(event) {
    this.formStatus = event.instance;
  }

  // 表单
  public initForm() {
    this.formColumn = [
      {
        // 基本类型
        label: '',
        key: 'title',
        type: 'custom',
        rule: [],
        asyncRules: [],
        template: this.titleDataTemplate,
      },
      {
        label: this.language.name,
        key: 'ruleName',
        type: 'input',
        require: true,
        width: 280,
        rule: [
          { required: true },
          { maxLength: 32 },
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      {
        label: this.language.remark,
        key: 'remark',
        type: 'input',
        // require: true,
        width: 280,
        rule: [
          // { required: true },
          this.$ruleUtil.getRemarkMaxLengthRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      {
        // 过滤条件信息
        label: '',
        key: 'title',
        type: 'custom',
        initialValue: '',
        rule: [],
        asyncRules: [],
        template: this.filtrationDataTemplate
      },
      {
        // 告警对象
        label: this.language.alarmobject,
        key: 'alarmFilterRuleSourceList',
        type: 'custom',
        require: true,
        width: 280,
        rule: [{ required: true }],
        asyncRules: [],
        template: this.departmentTep,
      },
      {
        // 告警名称
        label: this.language.alarmName,
        key: 'alarmFilterRuleNameList',
        type: 'custom',
        require: true,
        width: 280,
        rule: [{ required: true }],
        asyncRules: [],
        template: this.alarmName
      },
      {
        // 起始时间
        label: this.language.startTime,
        key: 'beginTime',
        type: 'custom',
        template: this.startTime,
        require: true,
        rule: [{ required: true }],
        asyncRules: []
      },
      {
        // 结束时间
        label: this.language.endTime,
        key: 'endTime',
        type: 'custom',
        template: this.endTime,
        require: true,
        rule: [{ required: true }],
        asyncRules: [],
      },
      {
        // 是否库存
        label: this.language.isNoStored,
        key: 'stored',
        type: 'radio',
        require: true,
        width: 430,
        rule: [{ required: true }],
        initialValue: this.defaultStatus,
        radioInfo: {
          data: [
            { label: this.language.yes, value: 1 },
            { label: this.language.no, value: 2 },
          ],
          label: 'label',
          value: 'value'
        },
      },
      {
        // 是否启用
        label: this.language.openStatus,
        key: 'status',
        type: 'custom',
        template: this.isNoStartUsing,
        initialValue: this.isNoStartData,
        require: true,
        rule: [],
        asyncRules: [],
        radioInfo: {
          type: 'select',
          selectInfo: [
            // { label: this.language.disable, value: 2 },
            // { label: this.language.enable, value: 1 }
            getDisableAndEnable(this.$nzI18n),
          ],
          label: 'label',
          value: 'value'
        },
      },
    ];
  }

  startModelChange(event) {
    this.startTimeModel = event;
    if ( event ) {
      this.formStatus.resetControlData('beginTime', +this.startTimeModel);
    } else {
      this.formStatus.resetControlData('beginTime', null);
    }
  }
  // 开始时间 转化时间戳
  startTimeOnOpenChange(event) {
    if ( event || !this.startTimeModel) { return; }
    this.time.startTime = +this.startTimeModel;
    this.formStatus.resetControlData('beginTime', this.time.startTime);
  }

  endModelChange( event ) {
    this.endTimeModel = event;
    if ( event ) {
      this.formStatus.resetControlData('endTime', +this.endTimeModel);
    } else {
      this.formStatus.resetControlData('endTime', null);
    }
  }
  // 结束时间 转化时间戳
  endTimeOnOpenChange(event) {
    if ( event || !this.endTimeModel) { return; }
    this.time.endTime = +this.endTimeModel;
    this.formStatus.resetControlData('endTime', this.time.endTime);
  }

  /**
   *新增告警
   */
  submit() {
    if ( +this.startTimeModel > +this.endTimeModel ) {
      this.$message.info(this.language.startTimeAndEndTime);
      this.startTimeModel = '';
      this.time.startTime = 0;
      this.formStatus.resetControlData('beginTime', null);
      this.endTimeModel = '';
      this.time.endTime = 0;
      this.formStatus.resetControlData('endTime', null);
    } else {
      this.isLoading = true;
      const alarmObj = this.formStatus.getData();
      alarmObj.ruleName = alarmObj.ruleName.trim();
      alarmObj.remark = alarmObj.remark && alarmObj.remark.trim();
      // 禁启用状态 需要通过转化
      alarmObj.status = this.isNoStartData ? 1 : 2;
      if (this.pageType === 'add') {
        this.$alarmService.addAlarmFiltration(alarmObj).subscribe((res: Result) => {
          this.isLoading = false;
          if (res && res.code === 0) {
            this.$message.success(res.msg);
            this.$router.navigate(['business/alarm/alarm-filtration']).then();
          } else {
            this.isLoading = false;
            this.$message.error(res.msg);
          }
        });
      } else {
        alarmObj.id = this.updateParamsId;
        alarmObj.title = '';
        this.$alarmService.updateAlarmFiltration(alarmObj).subscribe((res: Result) => {
          if (res && res.code === 0) {
            this.$message.success(res.msg);
            this.$router.navigate(['business/alarm/alarm-filtration']).then();
          }  else {
            this.isLoading = false;
            this.$message.error(res.msg);
          }
        });
      }
    }

  }

  cancel() {
    this.$router.navigate(['business/alarm/alarm-filtration']).then();
  }

  ruleTable(event) {
    this.display.rulePopUp = false;
    if ( event && event.id ) {
      this.getAlarmData(event.id);
    }
  }

}
