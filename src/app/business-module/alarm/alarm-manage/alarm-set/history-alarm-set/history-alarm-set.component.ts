import {Component, OnInit} from '@angular/core';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-opearte.service';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {AlarmService} from '../../../../../core-module/api-service/alarm/alarm-manage/alarm.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';

/**
 * 告警设置 历史告警设置
 */
@Component({
  selector: 'app-history-alarm-set',
  templateUrl: './history-alarm-set.component.html',
  styleUrls: ['./history-alarm-set.component.scss']
})
export class HistoryAlarmSetComponent implements OnInit {
  // 历史告警设置title
  pageTitle: string;
  // 历史告警设置表单项
  formColumn: FormItem[] = [];
  // 历史告警表单项实例
  formStatus: FormOperate;
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 告警id
  private alarmId;
  // 保存按钮加载中
  isLoading: boolean = false;
  constructor(
    private $nzI18n: NzI18nService,
    private $alarmService: AlarmService,
    private $message: FiLinkModalService) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('alarm');
    // 初始化表单项
    this.initForm();
    this.initColumn();
    this.pageTitle = this.language.historyAlarmSettings;
  }

  /**
   * 表单实例对象
   * param event
   */
  formInstance(event) {
    this.formStatus = event.instance;
  }

  /**
   * 表单项配置
   */
  private initColumn() {
    this.formColumn = [
      {
        label: this.language.delayTime,
        key: 'delay',
        type: 'input',
        // initialValue: 2,
        require: true,
        rule: [{ required: true },
          // pattern: /^([1-9]\d*|[0]{1,1})$/
          {pattern: /^\+?[1-9][0-9]*$/, msg: this.language.enterNormalTime },
          { min: 0, max: 720, msg: this.language.enterMaxTime}],
        asyncRules: []
      }
    ];
  }

  /**
   * 初始化设置
   */
  initForm() {
    this.$alarmService.queryAlarmDelay(null).subscribe(res => {
      if (res['code'] === 0) {
        const initData = res['data']['delay'];
        this.alarmId = res['data']['id'];
        this.formStatus.resetData({ delay: String(initData) });
      }
    });
  }

  /**
   * 历史告警设置
   */
  submit() {
    const data = this.formStatus.getData();
    data.id = this.alarmId;
    this.isLoading = true;
    this.$alarmService.updateAlarmDelay(data).subscribe(res => {
      this.isLoading = false;
      if (res['code'] === 0) {
        this.$message.success(res['msg']);
      } else {
        this.$message.error(res['msg']);
      }
    }, () => {
      this.isLoading = false;
    });
  }


}
