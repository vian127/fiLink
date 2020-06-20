import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-opearte.service';
import {AlarmService} from '../../../../../core-module/api-service/alarm';
import {Result} from '../../../../../shared-module/entity/result';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmStoreService} from '../../../../../core-module/store/alarm.store.service';
import {getAlarmLevel, getAlarmType, getTroubleType} from '../../../../trouble/model/const/trouble.config';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {AlarmModel} from '../../../model/alarm.model';
import * as CurrentAlarmUtil from '../../current-alarm/current-alarm-util';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';

/**
 * 告警设置 当前告警设置
 */
@Component({
  selector: 'app-current-alarm-set',
  templateUrl: './current-alarm-set.component.html',
  styleUrls: ['./current-alarm-set.component.scss']
})
export class CurrentAlarmSetComponent implements OnInit {
  // 表格告警级别过滤模板
  @ViewChild('alarmDefaultLevelTemp') alarmDefaultLevelTemp: TemplateRef<any>;
  // 表格定制级别过滤模板
  @ViewChild('alarmLevelTemp') alarmLevelTemp: TemplateRef<any>;
  // 表格确认状态过滤模板
  @ViewChild('alarmConfirmTemp') alarmConfirmTemp: TemplateRef<any>;
  @ViewChild('tableDefaultTemp') tableDefaultTemp: TemplateRef<any>;
  @ViewChild('alarmTypeTemp') alarmTypeTemp: TemplateRef<any>;
  // 表格数据源
  public _dataSet: any = [];
  // 告警名称
  public alarmNameArray: any = [];
  // 告警级别
  public alarmLevelArray: any = [];
  // 告警id
  public alarmId: string = '';
  // 翻页对象
  public pageBean: PageBean = new PageBean(10, 1, 1);
  // 表格配置
  public tableConfig: TableConfig;
  // 查询条件
  public queryCondition: QueryCondition = new QueryCondition();
  // 国际化接口
  public language: AlarmLanguageInterface;
  public modalTitle: string;
  public noAlarmLevel: boolean = false;
  public modalType: string = 'add';
  // 编辑页面弹窗
  public isVisibleEdit: boolean = false;
  // 告警编辑页面表单项
  public tableColumnEdit: FormItem[];
  // 告警编辑表单实例
  public formStatusEdit: FormOperate;
  // 告警默认级别
  public alarmDefaultLevel;
  // 告警名称
  public alarmName;
  // 保存按钮加载中
  isLoading: boolean = false;
  // 告警类别
  public alarmTypeList: any = [];
  // 告警类别枚举
  public typeStatus: any = {};
  public isShowTable: boolean = false;
  constructor(private $message: FiLinkModalService,
              private $router: Router,
              private $nzI18n: NzI18nService,
              private $alarmService: AlarmService,
              private $ruleUtil: RuleUtil,
              private $alarmStoreService: AlarmStoreService) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('alarm');
    // 告警类别
    this.getAlarmTypeList();
    // 初始化表格配置
    this.initTableConfig();
    // 初始化表单
    this.initEditForm();
    // 查询列表数据
    this.refreshData();
  }

  /**
   * 表格翻页查询
   * param event
   */
  pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  selectDataChange(event) {
  }


  /**
   * 获取当前告警设置列表信息
   */
  refreshData() {
    this.tableConfig.isLoading = true;
    this.$alarmService.queryAlarmSetList(this.queryCondition).subscribe((res: Result) => {
      this.pageBean.Total = res.totalCount;
      this.tableConfig.isLoading = false;
      this._dataSet = res.data.map(item => {
        item.defaultStyle = this.$alarmStoreService.getAlarmColorByLevel(item.alarmDefaultLevel);
        item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmLevel);
        item.alarmName = getAlarmType(this.$nzI18n, item.alarmCode);
        item.alarmTypeName = getTroubleType(this.$nzI18n, String(item.alarmType));
        return item;
      });
    }, () => {
      this.tableConfig.isLoading = false;
    });
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
        // 故障类型枚举
        if (data && data.length > 0) {
          data.forEach(item => {
            this.typeStatus[item.key] = item.value;
          });
        }
      }
    }, () => {
      // this.ifSpin = false;
    });
  }
  /**
   * 表格配置初始化
   */
  private initTableConfig() {
    const typeData = this.alarmTypeList;
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '02-3-1',
      showSearchSwitch: false,
      showSizeChanger: true,
      scroll: {x: '1000px', y: '600px'},
      noIndex: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '60px'}}
        },
        {
          title: this.language.alarmName, key: 'alarmName', width: 200,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '122px'}}
        },
        {
          title: this.language.AlarmCode, key: 'alarmCode', width: 200,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.alarmDefaultLevel, key: 'alarmDefaultLevel', width: 200,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          type: 'render',
          renderTemplate: this.alarmDefaultLevelTemp,
        },
        {
          title: this.language.alarmLevel, key: 'alarmLevel', width: 200,
          configurable: true,
          searchable: true,
          isShowSort: true,
          type: 'render',
          renderTemplate: this.alarmLevelTemp,
          searchConfig: {type: 'input'}
        },
        {
          // 告警类别
          title: this.language.AlarmType, key: 'alarmType', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: typeData, label: 'label', value: 'code',
          },
          renderTemplate: this.alarmTypeTemp
        },
        {
          title: this.language.alarmAutomaticConfirmation, key: 'alarmAutomaticConfirmation', width: 200,
          configurable: true,
          searchable: true,
          isShowSort: true,
          type: 'render',
          renderTemplate: this.alarmConfirmTemp,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate,
          searchConfig: {type: 'operate'}, key: '', width: 80, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      searchReturnType: 'object',
      topButtons: [
        {
          // 新增
          text: '+  ' + this.language.add,
          // permissionCode: '06-2-1-1',
          handle: (currentIndex) => {
            this.modalTitle = this.language.addAlarmSet;
            this.modalType = 'add';
            this.queryAlarmLevel();
            this.alarmDefaultLevel = '';
            this.tableColumnEdit = [];
            this.initEditForm();
            this.noAlarmLevel = false;
            this.isVisibleEdit = true;
          }
        },
        {
          // 删除
          text: this.language.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          // permissionCode: '02-3-4-5',
          handle: (data) => {
            const ids = data.map(item => item.id);
            if (ids) {
              this.delAlarmSet(ids);
            }
          }
        }
      ],
      operation: [
        {
          text: this.language.update,
          permissionCode: '02-3-1-1',
          className: 'iconfont fiLink-edit',
          handle: (data) => {
            this.initEditForm();
            this.modalTitle = this.language.editAlertSettings;
            this.modalType = 'edit';
            this.queryAlarmLevel();
            this.alarmId = data.id;
            this.$alarmService.queryAlarmLevelSetById(this.alarmId).subscribe((res: Result) => {
              const d = res.data[0];
              this.alarmName = getAlarmType(this.$nzI18n, d.alarmCode);
              d.alarmName = this.alarmName;
              this.formStatusEdit.group.controls['alarmName'].disable();
              this.formStatusEdit.group.controls['alarmDefaultLevel'].disable();
              this.noAlarmLevel = true;
              // if (d.alarmDefaultLevel === '1') {
              //   this.alarmDefaultLevel = this.language.urgent;
              // }
              // if (d.alarmDefaultLevel === '2') {
              //   this.alarmDefaultLevel = this.language.main;
              // }
              // if (d.alarmDefaultLevel === '3') {
              //   this.alarmDefaultLevel = this.language.secondary;
              // }
              // if (d.alarmDefaultLevel === '4') {
              //   this.alarmDefaultLevel = this.language.prompt;
              // }
              this.alarmDefaultLevel = getAlarmLevel(this.$nzI18n, d.alarmDefaultLevel);
              this.formStatusEdit.resetData(d);
            });
            this.isVisibleEdit = true;
          }
        },
        {
          // 删除
          text: this.language.deleteHandle,
          btnType: 'danger',
          canDisabled: true,
          needConfirm: true,
          // permissionCode: '06-2-1-5',
          className: 'fiLink-delete red-icon',
          handle: (data) => {
            this.tableConfig.isLoading = false;
            const ids = data.id;
            if (ids) {
              this.delAlarmSet([ids]);
            }
          }
        },
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event) => {
        this.queryCondition.filterConditions = event;
        this.refreshData();
      }
    };
  }


  /**
   * 编辑告警设置
   */
  public initEditForm() {
    this.tableColumnEdit = [
      {
        label: this.language.alarmName, key: 'alarmName',
        type: 'input', require: true,
        col: 24,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule((value) => {
            return this.$alarmService.queryAlarmNameExist(value);
          }, (res) => {
            if (res['code'] === 0) {
              return true;
            }
            return false;
          })
        ],
        modelChange: (controls, $event, key) => {
        },
        openChange: (a, b, c) => {
        },
      },
      {
        label: this.language.AlarmCode, key: 'alarmCode',
        type: 'input', require: true,
        col: 24,
        modelChange: (controls, $event, key) => {
        },
        openChange: (a, b, c) => {
        },
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule((value) => {
            return this.$alarmService.queryAlarmCodeExist(value);
          }, (res) => {
            if (res['code'] === 0) {
              return true;
            }
            return false;
          })
        ],
      },
      {
        label: this.language.alarmDefaultLevel, key: 'alarmDefaultLevel',
        // type: 'custom', require: true,
        // col: 24,
        // template: this.tableDefaultTemp,
        type: 'select', require: true,
        col: 24,
        selectInfo: {
          data: this.alarmLevelArray,
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, $event, key) => {
        },
        openChange: (a, b, c) => {
        },
        rule: [], asyncRules: []
      },
      {
        label: this.language.AlarmType, key: 'alarmType',
        type: 'select', require: true,
        col: 24,
        selectInfo: {
          data: this.alarmTypeList,
          label: 'label',
          value: 'code'
        },
        modelChange: (controls, $event, key) => {
        },
        openChange: (a, b, c) => {
        },
        rule: [], asyncRules: []
      },
      {
        label: this.language.alarmLevel, key: 'alarmLevel',
        type: 'select', require: true,
        col: 24,
        selectInfo: {
          data: this.alarmLevelArray,
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, $event, key) => {
        },
        openChange: (a, b, c) => {
        },
        rule: [], asyncRules: []
      },
      {
        label: this.language.alarmAutomaticConfirmation,
        key: 'alarmAutomaticConfirmation',
        type: 'radio',
        require: true,
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
   * 告警编辑弹窗表单实例
   * param event
   */
  formInstance2(event) {
    this.formStatusEdit = event.instance;
  }

  /**
   * 编辑告警设置
   */
  editHandle(): void {
    if (this.modalType === 'add') {
      const addData = this.formStatusEdit.getData();
      console.log(addData);
    } else {
      this.alarmNameArray = [];
      this.alarmLevelArray = [];
      const editData = this.formStatusEdit.getData();
      editData.id = this.alarmId;
      editData.alarmName = this.alarmName;
      this.isLoading = true;
      this.$alarmService.updateAlarmCurrentSet(editData).subscribe((res: Result) => {
        this.isLoading = false;
        if (res.code === 0) {
          this.$message.success(res.msg);
          this.isVisibleEdit = false;
          this.refreshData();
        } else {
          this.$message.error(res.msg);
        }

      }, () => {
        this.isLoading = false;
      });
    }
  }

  /**
   * 告警编辑取消
   */
  editHandleCancel() {
    this.isVisibleEdit = false;
    this.alarmNameArray = [];
    this.alarmLevelArray = [];
  }


  /**
   * 查询所有告警级别
   */
  queryAlarmLevel() {
    this.$alarmService.queryAlarmLevel().subscribe(res => {
      if (res['data'].length > 0) {
        for (let i = 0; i < res['data'].length; i++) {
          this.alarmLevelArray.push(
            {'label': getAlarmLevel(this.$nzI18n, res['data'][i]['alarmLevelCode']), 'value': res['data'][i]['alarmLevelCode']}
          );
        }
      }
    });
  }


  /**
   * 跳转到告警级别设置页面
   */
  navigateToLevelSet() {
    this.$router.navigate(['business/alarm/alarm-level-set']).then();
  }

  /**
   * 删除
   */
  delAlarmSet(ids) {
    console.log(ids);
    this.$alarmService.deleteAlarmSet(ids).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
        this.pageBean.pageIndex = 1;
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}

