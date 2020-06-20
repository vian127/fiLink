import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild, Input} from '@angular/core';
import {Router} from '@angular/router';
import {DateHelperService, NzI18nService} from 'ng-zorro-antd';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {AlarmService} from '../../../../../core-module/api-service/alarm/index';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {Result} from '../../../../../shared-module/entity/result';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {FormOperate} from '../../../../../shared-module/component/form/form-opearte.service';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {AreaConfig} from '../../../../../shared-module/component/alarm/alarmSelectorConfig';
import {getDeviceType} from '../../../../facility/share/const/facility.config';
import {TableComponent} from '../../../../../shared-module/component/table/table.component';
import {DateFormatString} from '../../../../../shared-module/entity/dateFormatString';
import {differenceInCalendarDays} from 'date-fns';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})

export class TemplateComponent implements OnInit {
  // 模板统计表格数据
  public _dataSettemplate = [];
  public pageBeantemplate: PageBean = new PageBean(100, 1, 1);
  public tableConfigTemplate: TableConfig;
  public language: AlarmLanguageInterface;
  // 控制按模板统计的显示隐藏
  display = {
    templateTable: true,
    creationTemplate: false
  };
  filterEvent;
  queryCondition: QueryCondition = new QueryCondition();
  // 选择的模板数据
  _selectedAlarm;
  formColumn: FormItem[] = [];
  formStatus: FormOperate;
  // 选择区域组件配置
  areaConfig: AreaConfig;
  areaList = {
    ids: [],
    name: ''
  };
  // 时间选择控件值
  timeModel = {
    recentlyTimeModel: [],
  };
  // 页面类型
  _currentPage: 'alarmType' | 'alarmHandle' | 'alarmName'
    | 'arearAtio' | 'alarmIncrement' = 'alarmType';
  // 区分新增模板或者更新模板
  _type: 'add' | 'update' = 'add';
  // 新增修改模板的设施类型下拉框数据
  deviceTypeList = [];
  // 选择的设施类型
  deviceTypeListValue = [];
  // 修改的模板ID
  updateParamsId;
  // 选择模板的title
  templateTitle: string;
  // 设施选择数量
  selectNumber;
  // 单选按钮
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // 区域选择器
  @ViewChild('areaSelector') private areaSelector;
  // 新增模板时间空间
  @ViewChild('recentlyTimeTemp') private recentlyTimeTemp: TableComponent;
  // 表格设施类型模板
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  // 新增模板中选择设施类型多选框
  @ViewChild('addDeviceTypeTemp') addDeviceTypeTemp: TemplateRef<any>;
  // 模板统计中点击确定或取消的emit事件
  @Output() resultAndClose = new EventEmitter();
  @ViewChild('modalContentWork') modalContentWork;

  // 从父组件获取页面类型
  @Input()
  set currentPage(currentPage) {
    this._currentPage = currentPage;
    if (currentPage === 'arearAtio') {
      this.selectNumber = 1;
    } else {
      this.selectNumber = 5;
    }
    this.queryTemplateData();
  }

  constructor(
    public $router: Router,
    public $nzI18n: NzI18nService,
    public $alarmService: AlarmService,
    public $message: FiLinkModalService,
    private $dateHelper: DateHelperService,
  ) {
    // 设施类型
    this.deviceTypeList = getDeviceType(this.$nzI18n);
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('alarm');
    this.templateListConfig();
    // 区域
    this.initAreaConfig();
    // this.initForm();
  }

  // 区域
  initAreaConfig() {
    const clear = this.areaList.ids.length ? false : true;
    this.areaConfig = {
      type: 'form',
      initialValue: this.areaList,
      clear: clear,
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

  colsePopUp() {
    this.display.templateTable = false;
    this.resultAndClose.emit();
  }

  pageTemplateChange(event) {
    this.queryCondition.filterConditions = this.filterEvent;
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryTemplateData();
  }

  // 点击确认
  okText() {
    this.resultAndClose.emit(this._selectedAlarm);
  }

  /**
   * 选择列表数据
   * param event
   * param data
   */
  selectedAlarmChange(event, data) {
    this._selectedAlarm = data;
  }

  // 获取模板列表信息
  queryTemplateData() {
    this.$alarmService.alarmStatisticalList(this._currentPage).subscribe((res: Result) => {
      if (res.code === 0) {
        if (res.data && res.data.length) {
          this._dataSettemplate = res.data.map(item => {
            if (item.condition) {
              item.condition = JSON.parse(item.condition);
            }
            item.areaNames = item.condition.areaList.name;
            item.alarmForwardRuleDeviceTypeList = item.condition.deviceIds.map(type => {
              return getDeviceType(this.$nzI18n, type);
            });
            item.time = this.$dateHelper.format(new Date(Number(item.condition.beginTime)),
              DateFormatString.DATE_FORMAT_STRING_SIMPLE) + '~' + this.$dateHelper.format(new Date(Number(item.condition.endTime)),
              DateFormatString.DATE_FORMAT_STRING_SIMPLE);
            return item;
          });
        } else {
          this._dataSettemplate = [];
        }
      }
    });
  }

  // 模板列表
  templateListConfig() {
    this.tableConfigTemplate = {
      isDraggable: true,
      isLoading: false,
      // showSearchSwitch: true,
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      scroll: {x: '800px', y: '300px'},
      columnConfig: [
        // {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 32},
        {
          title: '',
          type: 'render',
          renderTemplate: this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 42
        },
        {
          type: 'serial-number', width: 52, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}
        },
        {
          // 模板名称
          title: this.language.templateName, key: 'templateName',
          width: 100,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}
        },
        {
          // 区域
          title: this.language.area,
          key: 'areaNames', width: 150,
        },
        {
          // 设施类型
          title: this.language.alarmSourceType,
          key: 'alarmForwardRuleDeviceTypeList', width: 100,
          // isShowSort: true,
          // searchable: true,
          renderTemplate: this.deviceTypeTemp,
          // searchConfig: {type: 'input'}
        },
        {
          // 时间
          title: this.language.time,
          key: 'time', width: 400,
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 80, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      // showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Object',
      topButtons: [
        {
          // 新增
          text: '+    ' + this.language.add,
          handle: () => {
            // 初始化数据
            this.areaList = {
              ids: [],
              name: ''
            };
            this.areaConfig.initialValue = this.areaList;
            this.deviceTypeListValue = [];
            this.timeModel.recentlyTimeModel = [];
            // 初始化表单
            this.initForm();
            this.display.creationTemplate = true;
            // this.$router.navigate(['business/alarm/current-alarm/add']).then();
            this.templateTitle = this.language.addStatisticalTemplate;
          }
        }
      ],
      operation: [
        {
          // 编辑
          text: this.language.update,
          className: 'fiLink-edit',
          handle: (currentIndex) => {
            // this.$router.navigate(['business/alarm/current-alarm/update'], {
            //   queryParams: { id: currentIndex.id }
            // }).then();
            this._type = 'update';
            this.templateTitle = this.language.updateStatisticalTemplate;
            this.queryAlarmTempId(currentIndex.id);
          }
        },
        {
          text: this.language.deleteHandle,
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          handle: (data) => {
            const ids = data.id;
            if (ids) {
              this.$alarmService.deleteAlarmStatistical([ids]).subscribe((res: Result) => {
                if (res.code === 0) {
                  this.queryTemplateData();
                  this.$message.success(res.msg);
                } else {
                  this.$message.info(res.msg);
                }
              });
            }
          }
        },
      ],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.filterConditions = this.filterEvent;
        this.queryCondition.bizCondition.sortField = event.sortField;
        this.queryCondition.bizCondition.sortRule = event.sortRule;
        this.queryTemplateData();
      },
    };
  }

  // 新增表单
  public initForm() {
    this.formColumn = [
      {
        // 模板名称
        label: this.language.templateName,
        key: 'templateName',
        type: 'input',
        require: true,
        width: 480,
        col: 24,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
        ],
      },
      {
        // 区域
        label: this.language.area,
        key: 'areaNameList',
        type: 'custom',
        width: 430,
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.areaSelector,
      }, {
        // 设施类型
        label: this.language.alarmSourceType,
        key: 'alarmSourceTypeId',
        type: 'custom',
        require: true,
        width: 430,
        rule: [{required: true}],
        asyncRules: [],
        template: this.addDeviceTypeTemp,
        // initialValue: getDeviceType(this.$nzI18n),
      }, {
        // 时间
        label: this.language.time,
        key: 'time',
        type: 'custom',
        width: 830,
        template: this.recentlyTimeTemp,
        require: true,
        rule: [{required: true}],
        asyncRules: []
      }
    ];
  }

  // 关闭弹框
  closePopUp() {
    this.display.creationTemplate = false;
    this.areaList = {
      ids: [],
      name: ''
    };
    this.initAreaConfig();
    this.timeModel.recentlyTimeModel = [];
    this.deviceTypeListValue = [];
  }

  // 创建工单弹框this.timeModel.recentlyTimeModel
  formInstance(event) {
    this.formStatus = event.instance;
  }

  // 最近发生时间
  recentlyTimeChange(event) {
    this.timeModel.recentlyTimeModel = event;
    this.formStatus.resetControlData('time', this.timeModel.recentlyTimeModel);
  }

  // 设施类型改变时
  deviceTypeChange(event) {
    this.formStatus.resetControlData('alarmSourceTypeId', event);
  }

  recentlyTimeOnOpenChange(event) {
    if (event) {
      return;
    }
    if (+this.timeModel.recentlyTimeModel[0] > +this.timeModel.recentlyTimeModel[1]) {
      // this.timeModel.recentlyTimeModel[0] = this.timeModel.recentlyTimeModel[1];
      this.timeModel.recentlyTimeModel = [];
      this.$message.warning(this.language.timeMsg);
    }
    // 关闭时 避免时间控件的一些非常规操作 重新赋值下
    this.timeModel.recentlyTimeModel = this.timeModel.recentlyTimeModel.slice();
  }

  /**
   * 禁用时间
   * param {Date} current
   * returns {boolean}
   */
  disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) > 0;
  };

  queryAlarmTempId(id) {
    this.initForm();
    this.$alarmService.queryAlarmStatByTempId(id).subscribe(res => {
      if (res['code'] === 0) {
        this.display.creationTemplate = true;
        const alarmData = res['data'];
        this.updateParamsId = alarmData.id;
        // alarmData.templateName = alarmData.templatName;
        const conditionData = JSON.parse(alarmData.condition);
        this.timeModel.recentlyTimeModel = [new Date(conditionData.beginTime), new Date(conditionData.endTime)];
        this.formStatus.resetControlData('time', this.timeModel.recentlyTimeModel);
        this.deviceTypeListValue = conditionData.deviceIds;
        this.formStatus.resetControlData('alarmSourceTypeId', this.deviceTypeListValue);
        this.areaList = conditionData.areaList;
        // 区域
        this.initAreaConfig();
        const areaNameList = conditionData.areaList.name.split(',');
        this.formStatus.resetControlData('areaNameList', areaNameList);
        // this.formStatus.resetData(alarmData);
        this.formStatus.resetControlData('templateName', alarmData.templateName);
      }
    });
  }

  // 新增和编辑模板
  submitWork() {
    const alarmObj = this.formStatus.getData();
    const data = {
      'id': this.updateParamsId,
      'pageType': this._currentPage,
      'templateName': alarmObj.templateName,
      'condition': JSON.stringify({
        beginTime: +this.timeModel.recentlyTimeModel[0],
        endTime: +this.timeModel.recentlyTimeModel[1],
        deviceIds: this.deviceTypeListValue,
        areaList: this.areaList
      })
    };
    if (this._type === 'add') {
      // 新增
      this.$alarmService.addAlarmStatisticalTemplate(data).subscribe(res => {
        if (res['code'] === 0) {
          this.$message.success(res['msg']);
          this.display.creationTemplate = false;
          this.queryTemplateData();
        }
      });
    } else {
      // 编辑
      this.$alarmService.updateAlarmStatisticalTemplate(data).subscribe(res => {
        if (res['code'] === 0) {
          this.$message.success(res['msg']);
          this.display.creationTemplate = false;
          this.queryTemplateData();
        }
      });
    }

  }
}
