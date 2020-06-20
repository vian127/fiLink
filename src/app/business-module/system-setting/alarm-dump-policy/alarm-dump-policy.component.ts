import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {FormItem} from '../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../shared-module/component/form/form-opearte.service';
import {ColumnConfigService} from '../column-config.service';
import {DumpService} from '../../../core-module/api-service/system-setting/dump/dump.service';
import {Result} from '../../../shared-module/entity/result';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {IndexLanguageInterface} from '../../../../assets/i18n/index/index.language.interface';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';

/**
 * 转储设置
 */
@Component({
  selector: 'app-alarm-dump-policy',
  templateUrl: './alarm-dump-policy.component.html',
  styleUrls: ['./alarm-dump-policy.component.scss']
})
export class AlarmDumpPolicyComponent implements OnInit {
  // 按钮loading状态
  btnLoading = false;
  // 进度值
  progress;
  // 页面标题
  pageTitle;
  // 页面类型
  pageType;
  // 页面类型编号 11为告警
  pageTypeNum;
  // 国际化
  DumpLanguage;
  // 表单配置
  formColumn: FormItem[] = [];
  // 立即执行表单配置
  formColumnImplementation: FormItem[] = [];
  formStatus: FormOperate;
  formStatusImplementation: FormOperate;
  // 表单禁用
  formDisable = <any>[];
  // 表单启用list
  formEnable = <any>[];
  // 启用禁用转储
  enableAlarmDumpList = <any>[];
  // 默认转储策略
  defaultDump;
  // 当前转储策略
  nowDump;
  // 当前转储策略id
  _paramId;
  // 当前转储任务id
  taskId;
  // 立即执行modal框
  implementationModal;
  // 立即执行状态
  taskStatus;
  // 国际化
  indexLanguage: IndexLanguageInterface;
  // 国际化
  commonLanguage: CommonLanguageInterface;
  // 下次执行时间
  @ViewChild('monthTemp') monthTemp: TemplateRef<any>;
  // 立即执行
  @ViewChild('implementationTemp') implementationTemp: TemplateRef<any>;
  // 执行进度
  @ViewChild('progressTemp') progressTemp: TemplateRef<any>;
  // 立即执行底部按钮
  @ViewChild('footerTemp') footerTemp: TemplateRef<any>;

  constructor(private $activatedRoute: ActivatedRoute,
              private $nzI18n: NzI18nService,
              public modalService: NzModalService,
              private $columnConfigService: ColumnConfigService,
              private $dumpService: DumpService,
              private $modal: NzModalService,
              private $message: FiLinkModalService
  ) {
  }

  ngOnInit() {
    this.DumpLanguage = this.$nzI18n.getLocale();
    this.indexLanguage = this.$nzI18n.getLocaleData('index');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.pageType = this.$activatedRoute.snapshot.url[1].path;
    this.pageTitle = this.getPageTitle(this.pageType);
    this.queryDefaultDumpPolicy();
    this.initFormColumn();
  }

  /**
   * 获取表单实例
   * param event
   */
  formInstance(event) {
    this.formStatus = event.instance;
  }

  /**
   * 立即执行表单实例
   * param event
   */
  formInstanceImplementation(event) {
    this.formStatusImplementation = event.instance;
  }

  /**
   * 获取标题
   * param type
   * returns {string}
   */
  private getPageTitle(type): string {
    let title;
    switch (type) {
      case 'system-log':
        title = this.DumpLanguage.systemSetting.systemLogDumpStrategy;
        this.pageTypeNum = 13;
        this.formColumn = this.$columnConfigService.getSystemDumpSettingConfig({modelChange: this.modelChange});
        break;
      case 'alarm':
        title = this.DumpLanguage.systemSetting.alarmDumpStrategy;
        this.pageTypeNum = 11;
        this.formColumn = this.$columnConfigService.getAlarmDumpSettingConfig({modelChange: this.modelChange});
        break;
      case 'facility-log':
        title = this.DumpLanguage.systemSetting.facilityLogDumpStrategy;
        this.pageTypeNum = 12;
        this.formColumn = this.$columnConfigService.getFacilityDumpSettingConfig({modelChange: this.modelChange});
        break;
      case 'inspection':
        title = this.DumpLanguage.systemSetting.inspectionDumpStrategy;
        this.pageTypeNum = 14;
        this.formColumn = this.$columnConfigService.getFacilityDumpSettingConfig({modelChange: this.modelChange});
        break;
      case 'clear-barrier':
        title = this.DumpLanguage.systemSetting.clearBarrierLogDumpStrategy;
        this.pageTypeNum = 15;
        this.formColumn = this.$columnConfigService.getFacilityDumpSettingConfig({modelChange: this.modelChange});
        break;
    }
    return title;
  }

  /**
   * 监听表单数据变化
   * param controls
   * param $event
   * param key
   */
  modelChange = (controls, $event, key) => {
    if (key === 'enableDump') {
      this.enableAlarmDumpList = ['triggerCondition', 'dumpOperation', 'turnOutNumber'];
      if ($event === '0') {
        this.setValueForRadio(this.enableAlarmDumpList);
        this.setFormDisable(this.enableAlarmDumpList);
      } else {
        this.setValueForRadio(this.enableAlarmDumpList);
        this.setFormEnable(this.enableAlarmDumpList);
      }
    }
    if (key === 'triggerCondition') {
      this.formDisable = ['dumpQuantityThreshold'];
      this.formStatus.group.controls['dumpInterval'].setValue('12');
      this.formEnable = ['dumpInterval'];
      if (this.formStatus.group.controls['enableDump'].value === '1') {
        if ($event === '0') {
          this.setFormEnable(this.formDisable);
          this.formStatus.group.controls['dumpInterval'].setValue('12');
          this.setFormDisable(this.formEnable);
        } else {
          this.setFormEnable(this.formEnable);
          this.setFormDisable(this.formDisable);
        }
      } else {
        this.setFormDisable(this.formDisable.concat(this.formEnable));
      }
    }
    if (key === 'dumpOperation') {
      this.formDisable = ['dumpPlace'];
      if (this.formStatus.group.controls['enableDump'].value === '1') {
        if ($event === '0') {
          this.formStatus.group.controls['dumpPlace'].setValue('0');
          this.setFormDisable(this.formDisable);
        } else {
          this.setFormEnable(this.formDisable);
        }
      } else {
        this.setFormDisable(this.formDisable);
      }
    }
  };

  /**
   * 表单禁用
   * param controlNameList 需要表单禁用list
   */
  setFormDisable(controlNameList) {
    controlNameList.forEach(item => {
      this.formStatus.group.controls[item].disable();
    });
  }

  /**
   * 表单启用
   * param controlNameList 需要表单启用list
   */
  setFormEnable(controlNameList) {
    controlNameList.forEach(item => {
      this.formStatus.group.controls[item].enable();
    });
  }

  /**
   * 为表单设置值，避免单选按钮启用禁用失效
   * param radioList 需要设置的单选按钮的值
   * param bol true为单选按钮时，false为下拉框时 将值置为空
   */
  setValueForRadio(radioList, bol = true) {
    radioList.forEach(item => {
      this.formStatus.group.controls[item].setValue(bol ? this.formStatus.group.controls[item].value : null);
    });
  }

  /**
   * 恢复默认
   */
  restoreDefault() {
    this.setFormValue(this.defaultDump);
  }

  /**
   * 查询策略
   */
  queryDefaultDumpPolicy() {
    this.$dumpService.queryDumpPolicy(this.pageTypeNum).subscribe((result: Result) => {
      this.defaultDump = JSON.parse(result.data.defaultValue);
      this._paramId = result.data.paramId;
      this.nowDump = JSON.parse(result.data.presentValue);
      this.setFormValue(this.nowDump);
    });
  }

  /**
   * 设置表单值
   */
  setFormValue(valueType) {
    Object.keys(this.formStatus.group.controls).forEach(item => {
      this.formStatus.group.controls[item].setValue(valueType[item]);
    });
  }

  /**
   * 点击确定更新转储策略
   */
  updateDump() {
    this.btnLoading = true;
    const updateData = {
      paramId: this._paramId,
      paramType: this.pageTypeNum,
      dumpBean: {
        'enableDump': this.formStatus.group.controls['enableDump'].value,
        'triggerCondition': this.formStatus.group.controls['triggerCondition'].value,
        'dumpQuantityThreshold': this.formStatus.group.controls['dumpQuantityThreshold'].value,
        'dumpInterval': this.formStatus.group.controls['dumpInterval'].value,
        'dumpOperation': this.formStatus.group.controls['dumpOperation'].value,
        'dumpPlace': this.formStatus.group.controls['dumpPlace'].value,
        'turnOutNumber': this.formStatus.group.controls['turnOutNumber'].value,
      }
    };
    this.$dumpService.updateDumpPolicy(updateData).subscribe((result: Result) => {
      this.btnLoading = false;
      if (result.code === 0) {
        this.queryDefaultDumpPolicy();
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.btnLoading = false;
    });
  }

  /**
   * 立即执行弹框
   */
  implementation() {
    this.$dumpService.queryNowDumpInfo(this.pageTypeNum).subscribe((result: Result) => {
      if (result.code === 0) {
        this.implementationModal = this.$modal.create({
          nzTitle: this.DumpLanguage.systemSetting.implementation,
          nzContent: this.implementationTemp,
          nzOkText: this.DumpLanguage.systemSetting.executeImmediately,
          nzCancelText: this.DumpLanguage.systemSetting.cancel,
          nzOkType: 'danger',
          nzClassName: 'custom-create-modal',
          nzMaskClosable: false,
          nzFooter: this.footerTemp
        });
        // 初始化配置
        this.progress = '0.00';
        if (result.data) {
          this.taskId = result.data.taskInfoId;
          this.setImplementationData(result.data);
        }
      }
    });
  }

  /**
   * 设置立即执行modal框内表单的值
   * param data
   */
  setImplementationData(data) {
    if (this.nowDump.triggerCondition === '1') {
      data.nowTime = data.tsCreateTime ? CommonUtil.dateFmt('yyyy-MM-dd hh:mm:ss', new Date(data.tsCreateTime)) : null;
      data.nextTime = data.nextExecutionTime ? CommonUtil.dateFmt('yyyy-MM-dd hh:mm:ss', new Date(data.nextExecutionTime)) : null;
    } else {
      data.nowTime = data.tsCreateTime ? CommonUtil.dateFmt('yyyy-MM-dd hh:mm:ss', new Date(data.tsCreateTime)) : null;
      data.nextTime = null;
    }
    data.implementationNum = data.dumpAllNumber;
    this.taskStatus = data.taskStatus;
    if (data.taskStatus === 3) {
      data.nowStatus = this.DumpLanguage.systemSetting.success;
      this.progress = 100;
    } else if (data.taskStatus === 4) {
      data.nowStatus = this.DumpLanguage.systemSetting.error;
      this.getProgress(data);
    } else if (data.taskStatus === 8) {
      data.nowStatus = this.DumpLanguage.systemSetting.notPerformed;
      this.getProgress(data);
    } else {
      data.nowStatus = this.DumpLanguage.systemSetting.runImplementation;
      this.getProgress(data);
    }
    setTimeout(() => {
      this.formStatusImplementation.resetData(data);
    }, 500);
    if (data.taskStatus !== 3 && data.taskStatus !== 4 && data.taskStatus !== 8 && this.taskId) {
      this.pollingTask();
    }
  }

  /**
   * 进度条的值
   */
  getProgress(data) {
    if (data.fileNum !== 0) {
      this.progress = (Number(data.fileGeneratedNum / data.fileNum) * 100).toFixed(2);
    } else {
      this.progress = '0.00';
    }
  }

  /**
   * 初始化表单配置
   */
  initFormColumn() {
    this.formColumnImplementation = [
      {
        label: this.DumpLanguage.systemSetting.nowExecutionTime,
        key: 'nowTime',
        type: 'input',
        placeholder: ' ',
        labelWidth: 160,
        disabled: true,
        col: 24,
        rule: [],
      },
      {
        label: this.DumpLanguage.systemSetting.nextExecutionTime,
        key: 'nextTime',
        labelWidth: 160,
        placeholder: ' ',
        col: 24,
        asyncRules: [],
        type: 'input',
        disabled: true,
        rule: [],
      },
      {
        label: this.DumpLanguage.systemSetting.executionNum,
        key: 'implementationNum',
        labelWidth: 160,
        placeholder: ' ',
        col: 24,
        disabled: true,
        type: 'input',
        rule: [],
      },
      {
        label: this.DumpLanguage.systemSetting.executionStatus,
        key: 'nowStatus',
        labelWidth: 160,
        placeholder: ' ',
        type: 'input',
        disabled: true,
        col: 24,
        rule: [],
      },
      {
        label: this.DumpLanguage.systemSetting.executionPro,
        key: 'progress',
        labelWidth: 160,
        type: 'custom',
        template: this.progressTemp,
        col: 24,
        rule: [],
      }
    ];
  }

  /**
   * 对正在执行的任务进行轮询查看
   */
  pollingTask() {
    if (this.formStatusImplementation.group.controls['nowStatus'].value === this.DumpLanguage.systemSetting.runImplementation) {
      this.$dumpService.queryDumpInfo(this.taskId).subscribe((result: Result) => {
        const data = result.data;
        if (data.taskStatus === 3) {
          this.progress = 100;
          this.formStatusImplementation.group.controls['nowStatus'].setValue(this.DumpLanguage.systemSetting.success);
        } else if (data.taskStatus === 4) {
          this.getProgress(data);
          this.formStatusImplementation.group.controls['nowStatus'].setValue(this.DumpLanguage.systemSetting.error);
        } else if (data.taskStatus === 8) {
          this.getProgress(data);
          this.formStatusImplementation.group.controls['nowStatus'].setValue(this.DumpLanguage.systemSetting.error);
        } else {
          this.getProgress(data);
          setTimeout(() => this.pollingTask(), 5000);
        }
      });
    }
  }

  /**
   * 手动执行转储任务
   */
  handDump() {
    let type: number;
    // if (this.pageTypeNum === 13) {
    //   type = 2;
    // } else if (this.pageTypeNum === 11) {
    //   type = 1;
    // } else {
    //   type = 3;
    // }
    switch (this.pageTypeNum) {
      case 11:
        type = 1;
        break;
      case 12:
        type = 3;
      break;
      case 13:
        type = 2;
      break;
      case 14:
        type = 5;
      break;
      case 15:
       type = 6;
      break;
    }
    this.$dumpService.handDumpData(type).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
      } else {
        this.$message.info(result.msg);
      }
    });
  }

  /**
   * 点击取消
   */
  cancel() {
    this.setFormValue(this.nowDump);
  }

  /**
   * 立即执行
   */
  nowImplementation() {
    // 提示弹框
    this.modalService.confirm({
      nzTitle: this.indexLanguage.prompt,
      nzContent: this.indexLanguage.alarmDumpPolicy,
      nzOkText: this.commonLanguage.confirm,
      nzCancelText: this.commonLanguage.cancel,
      nzMaskClosable: false,
      nzOnOk: () => {
        this.handDump();
        this.implementationModal.destroy();
      }
    });
  }

  /**
   * 立即执行modal框点击取消
   */
  nowCancel() {
    this.implementationModal.destroy();
  }
}
