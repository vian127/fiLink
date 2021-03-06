import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormItem } from '../../../../shared-module/component/form/form-config';
import { FormOperate } from '../../../../shared-module/component/form/form-opearte.service';
import { NzI18nService } from 'ng-zorro-antd';
import { LogStatisticalInterface } from '../../../../../assets/i18n/log-statistical/log-statistical-language.interface';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Result } from '../../../../shared-module/entity/result';
import { FiLinkModalService } from '../../../../shared-module/service/filink-modal/filink-modal.service';
import { RuleUtil } from '../../../../shared-module/util/rule-util';
import { CommonUtil } from '../../../../shared-module/util/common-util';
import { LogStatisticalService } from '../../../../core-module/api-service/statistical/log-statistical';
import { getLogStatisticalType } from '../log-statistical.config';

@Component({
  selector: 'app-template-details',
  templateUrl: './template-details.component.html',
  styleUrls: ['./template-details.component.scss']
})
export class TemplateDetailsComponent implements OnInit {
  language: LogStatisticalInterface;
  formColumn: FormItem[] = [];
  formStatus: FormOperate;
  pageType = 'add';
  // 页面标题
  pageTitle: string;
  // loading状态
  isLoading: boolean = false;
  createTime: any = null;
  logTempInfo = {};
  // 时间选择控件的值
  dateRange = [];
  // 起始时间
  startTime: any = null;
  // 终止时间
  endTime: any = null;
  tempInfo = {};
  // 模板对象 用于新增修改模板
  tempObj = {
    name: '',
    filterValue: {}
  };
  // 模板id
  tempId: string;
  @ViewChild('optTimeTemp') optTimeTemp: TemplateRef<any>;
  constructor(
    private $nzI18n: NzI18nService,
    private $activatedRoute: ActivatedRoute,
    private $router: Router,
    private $message: FiLinkModalService,
    private $ruleUtil: RuleUtil,
    private $logStatistical_Service: LogStatisticalService
  ) {
  }


  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('logStatistical');
    this.$activatedRoute.params.subscribe((params: Params) => {
      this.pageType = params.type;
    });
    this.pageTitle = this.getPageTitle(this.pageType);
    if (this.pageType !== 'add') {
      this.$activatedRoute.queryParams.subscribe(params => {
        this.tempId = params.id;
        this.getTemplateInfoById(params.id);
      });
    }
    this.initColumn();
  }

  /**
   * 获取表单实例
   * param event
   */
  formInstance(event) {
    this.formStatus = event.instance;
  }

  /**
   * 初始化表单
   */
  private initColumn() {
    this.formColumn = [
      {
        label: this.language.name,
        key: 'name',
        type: 'input',
        require: true,
        rule: [{ required: true }, { maxLength: 32 },
        this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [],
        modelChange: (controls, $event, key) => {
        },
        openChange: (a, b, c) => {
        },
      },
      {
        label: this.language.logStatisticalType,
        key: 'statisticalType',
        type: 'select',
        require: true,
        rule: [{ required: true }],
        asyncRules: [],
        selectInfo: {
          data: getLogStatisticalType(this.$nzI18n),
          label: 'label',
          value: 'code'
        }
      },
      {
        label: this.language.optUser,
        key: 'createName',
        type: 'input',
        require: false,
        rule: [],
        asyncRules: []
      },
      {
        label: this.language.optTerminal,
        key: 'optTerminal',
        type: 'input',
        require: false,
        rule: [],
        asyncRules: []
      },
      {
        label: this.language.optTime,
        key: 'optTime',
        type: 'custom',
        template: this.optTimeTemp,
        require: true,
        rule: [{ required: true }],
        asyncRules: []
      },
      {
        label: this.language.optObj,
        key: 'optObj',
        type: 'input',
        require: false,
        rule: [],
        asyncRules: []
      }, {
        label: this.language.remark,
        key: 'remark',
        type: 'input',
        require: false,
        rule: [],
        asyncRules: []
      }
    ];
  }

  /**
   * 获取页面标题
   * param type
   */
  private getPageTitle(type): string {
    let title;
    switch (type) {
      case 'add':
        title = `${this.language.add}${this.language.logStatisticalTemplate}`;
        break;
      case 'update':
        title = `${this.language.update}${this.language.logStatisticalTemplate}`;
        break;
    }
    return title;
  }

  /**
   * 返回
   */
  goBack() {
    this.$router.navigate(['/business/statistical-report/log-statistical']).then();
  }

  /**
   *新增、修改模板
   */
  submit() {
    this.isLoading = true;
    const obj = this.formStatus.getData();
    obj.name = CommonUtil.trim(obj.name);
    obj.createUser = CommonUtil.trim(obj.createName);
    obj.optTerminal = CommonUtil.trim(obj.optTerminal);
    obj.optObj = CommonUtil.trim(obj.optObj);
    obj.remark = CommonUtil.trim(obj.remark);
    this.tempObj.name = obj.name;
    this.tempObj.filterValue = JSON.stringify(obj);
    if (this.pageType === 'add') {
      this.$logStatistical_Service.addLogTemplate(this.tempObj).subscribe((res: Result) => {
        this.isLoading = false;
        if (res.code === 0) {
          this.$message.success(res.msg);
          this.$router.navigate(['/business/statistical-report/log-statistical']).then();
        } else {
          this.$message.error(res.msg);
        }
      });
    } else if (this.pageType === 'update') {
      this.tempObj['id'] = this.tempId;
      this.$logStatistical_Service.updateLogTemplate(this.tempObj).subscribe((res: Result) => {
        this.isLoading = false;
        if (res.code === 0) {
          this.$message.success(res.msg);
          this.$router.navigate(['/business/statistical-report/log-statistical']).then();
        } else {
          this.$message.error(res.msg);
        }
      });
    }

  }


  /**
   * 时间选择
   * @ param timeResults
   */
  onChange(timeResults) {
    this.startTime = CommonUtil.getTimeStamp(timeResults[0]);
    this.endTime = CommonUtil.getTimeStamp(timeResults[1]);
    if (timeResults.length === 0) {
      this.formStatus.resetControlData('optTime', []);
    } else {
      this.formStatus.resetControlData('optTime', [this.startTime, this.endTime]);
    }
  }



  /**
   * 查询模板信息
   * @ param id
   */
  getTemplateInfoById(id) {
    this.$logStatistical_Service.queryLogTemplateById(id).subscribe((res: Result) => {
      this.tempInfo = JSON.parse(res.data.filterValue);
      this.dateRange = [this.timeChange(this.tempInfo['optTime'][0]), this.timeChange(this.tempInfo['optTime'][1])];
      this.formStatus.resetControlData('optTime', this.dateRange);
      this.formStatus.resetData(this.tempInfo);
    });
  }

  /**
   * 时间转换
   * @ param time
   */
  timeChange(time: number) {
    return new Date(time);
  }

}
