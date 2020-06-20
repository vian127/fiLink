import {Component, OnInit, TemplateRef, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {AbstractControl, FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {differenceInCalendarDays} from 'date-fns';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {Result} from '../../../../shared-module/entity/result';
import {NzI18nService} from 'ng-zorro-antd';
import {UserService} from '../../../../core-module/api-service/user/user-manage';
import {OnlineLanguageInterface} from '../../../../../assets/i18n/online/online-language.interface';
import {finalValue, applicationFinal, routerJump} from '../../model/const/const';
import {Router} from '@angular/router';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {ApplicationService} from '../../server';
import {DeployStatus} from '../../../facility/share/const/facility.config';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss']
})
export class BasicInformationComponent implements OnInit {
  pageTitle: string = '新增策略'; // 页面标题
  isLoading = false; // 列表初始加载图标
  isVisible = false;
  formColumn: FormItem[] = []; // form表单配置
  effectivePeriodStart = '';
  effectivePeriodEnd = '';
  @ViewChild('startEndTime') startEndTime;
  @ViewChild('enableStatus') enableStatus;
  // 单位模板
  @ViewChild('applicationScope') private applicationScope;
  @Input() isShowRow = false;
  @Input() basicInfo = '';
  @Input() stepsFirstParams;
  @Output() notify = new EventEmitter();
  size = 'default';
  // 启用状态
  strategyStatus = true;
  // 应用范围的值
  strategyRefList = [];
  // 已选责任单位
  selectUnitName: string = '';
  _dataSet = [];
  // 分页实体
  pageBean: PageBean = new PageBean(10, 1, 1);
  // 表格配置
  tableConfig: TableConfig;
  language: OnlineLanguageInterface;
  isInsertInterval = false;
  isInsertExecution = false;
  formStatus: FormOperate;
  queryCondition: QueryCondition = new QueryCondition();

  constructor(
    public $nzI18n: NzI18nService,
    public $router: Router,
    private $ruleUtil: RuleUtil,
    public $applicationService: ApplicationService,
    public $userService: UserService,
  ) {
    this.language = this.$nzI18n.getLocaleData('online');
  }

  ngOnInit() {
    this.initTableConfig();
    this.refreshData();
    this.initColumn();
  }

  formInstance(event) {
    this.formStatus = event.instance;
  }

  /**
   * 打开责任单位选择器
   */
  showModal() {
    this.isVisible = true;
  }

  /**
   * 选择应用范围
   * @ param data
   */
  handleOk(data) {
    this.strategyRefList = [];
    this.selectUnitName = '';
    if (data && data.length > 0) {
      data.forEach(item => {
        this.selectUnitName += `${item.equipmentName};`;
        this.strategyRefList.push({
          refName: item.equipmentName,
          refType: '设备',
          refId: item.equipmentId,
        });
      });
      this.isVisible = false;
    }
  }

  handChangeValue(val) {
    if (val === '5') {
      const data = {
        label: '间隔天数',
        disabled: false,
        key: 'remark',
        type: 'input',
        rule: [{minLength: 0}, {maxLength: 255}]
      };
      const index = this.formColumn.findIndex(item => item.label === '执行日期');
      if (index !== -1) {
        this.formColumn.splice(index, 1);
        this.isInsertExecution = false;
      }
      if (!this.isInsertInterval) {
        this.formColumn.splice(5, 0, data);
      }
      this.isInsertInterval = true;
    } else if (val === '6') {
      const data = {
        label: '执行日期',
        disabled: false,
        key: 'remark',
        type: 'input',
        rule: [{minLength: 0}, {maxLength: 255}]
      };
      const index = this.formColumn.findIndex(item => item.label === '间隔天数');
      if (index !== -1) {
        this.formColumn.splice(index, 1);
        this.isInsertInterval = false;
      }
      if (!this.isInsertExecution) {
        this.formColumn.splice(5, 0, data);
      }
      this.isInsertExecution = true;
    } else {
      this.isInsertInterval = false;
      this.isInsertExecution = false;
      // this.initColumn();
    }
  }

  pageChange(event) {
    console.log(event);
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          title: '资产编号', key: 'equipmentCode', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          title: '名称', key: 'equipmentName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [],
      leftBottomButtons: [
        {
          className: 'small-button',
          permissionCode: '03-1-16',
          text: '确认', handle: (event) => {
            this.handleOk(event);
          }
        },
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      }
    };
  }


  /**
   * 刷新表格数据
   */
  private refreshData() {
    this.tableConfig.isLoading = true;
    this.$applicationService.equipmentListByPage(this.queryCondition).subscribe((res: Result) => {
      this.tableConfig.isLoading = false;
      this._dataSet = res.data;
      this.pageBean.Total = res.totalCount;
      this.pageBean.pageIndex = res.pageNum;
      this.pageBean.pageSize = res.size;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 下一步
   */
  public handNextSteps() {
    const data = this.formStatus.group.getRawValue();
    data.effectivePeriodStart = new Date(this.effectivePeriodStart).getTime();
    data.effectivePeriodEnd = new Date(this.effectivePeriodEnd).getTime();
    data.strategyStatus = this.strategyStatus ? '1' : '0';
    data.createUser = '张三';
    data.createTime = 1590043630000;
    data.strategyRefList = this.strategyRefList;
    this.stepsFirstParams = data;
  }

  disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) < 0 || CommonUtil.checkTimeOver(current);
  }

  private initColumn() {
    this.formColumn = [
      { // 工单名称
        label: '策略名称',
        key: 'strategyName',
        type: 'input',
        require: true,
        disabled: false,
        placeholder: '请输入策略名称',
        rule: [],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$applicationService.checkStrategyNameExist(value),
            res => {
              if (res['code'] === 'Z4004') {
                return false;
              } else {
                return true;
              }
            })
        ],
      },
      {
        label: '策略类型', key: 'strategyType', type: 'select',
        selectInfo: {
          data: [
            {label: '照明策略', code: '1'},
            {label: '安防监控策略', code: '2'},
            {label: '信息发布策略', code: '3'},
            {label: '广播发布策略', code: '4'},
            {label: '联动策略', code: '5'}
          ],
          label: 'label',
          value: 'code'
        },
        modelChange: (controls, $event, key) => {
        },
        require: true,
        rule: [{required: true}], asyncRules: []
      },
      {
        label: '应用范围',
        key: 'applicationScope',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.applicationScope
      },
      {
        label: '有效期',
        key: 'effectivePeriodTime',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.startEndTime
      },
      {
        label: '执行周期', key: 'execType', type: 'select',
        selectInfo: {
          data: [
            {label: '无', code: '1'},
            {label: '每天', code: '2'},
            {label: '工作日', code: '3'},
            {label: '节假日', code: '4'},
            {label: '间隔执行', code: '5'},
            {label: '自定义', code: '6'}
          ],
          label: 'label',
          value: 'code'
        },
        modelChange: (controls, $event, key) => {
          this.handChangeValue($event);
        },
        require: true,
        rule: [{required: true}], asyncRules: []
      },
      {// 备注
        label: '申请人',
        disabled: false,
        key: 'applyUser',
        type: 'input',
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {// 备注
        label: '备注',
        disabled: false,
        key: 'remark',
        type: 'input',
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '控制类型', key: 'controlType', type: 'select',
        selectInfo: {
          data: [
            {label: '平台控制', code: '1'},
            {label: '设备控制', code: '2'}
          ],
          label: 'label',
          value: 'code'
        },
        modelChange: (controls, $event, key) => {
        },
        require: true,
        rule: [{required: true}], asyncRules: []
      },
      {
        label: '启用状态',
        key: 'strategyStatus',
        type: 'custom',
        rule: [],
        asyncRules: [],
        template: this.enableStatus
      }
    ];
  }
}
