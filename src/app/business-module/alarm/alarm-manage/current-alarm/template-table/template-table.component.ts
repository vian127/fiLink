import {Component, EventEmitter, OnInit, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {AlarmService} from '../../../../../core-module/api-service/alarm';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService, toBoolean} from 'ng-zorro-antd';
import {Result} from '../../../../../shared-module/entity/result';
import {Router} from '@angular/router';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';

/**
 * 当前告警、历史告警页面的 模板列表
 */

@Component({
  selector: 'app-template-table',
  templateUrl: './template-table.component.html',
  styleUrls: ['./template-table.component.scss']
})
export class TemplateTableComponent implements OnInit {
  // 模板列表数据
  public _dataSettemplate = [];
  // 模板列表翻页对象
  public pageBeantemplate: PageBean = new PageBean(100, 1, 1);
  // 模板列表表格配置
  public tableConfigTemplate: TableConfig;
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  // 选择模板弹窗
  display = {
    templateTable: true
  };
  // 表格过滤条件
  filterEvent;
  // 表格查询条件
  queryCondition: QueryCondition = new QueryCondition();
  // 列表选中数据
  _selectedAlarm;
  selectedAlarmId;

  // 列表选择模板
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  @Input() isHistoryAlarmTemplateTable = false; // 是否历史告警模板
  // 数据和关闭弹出事件
  @Output() resultAndClose = new EventEmitter();

  constructor(public $router: Router,
              public $nzI18n: NzI18nService,
              public $alarmService: AlarmService,
              public $message: FiLinkModalService) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('alarm');
    // 模板表格配置
    this.templateListConfig();

    // 查询模板列表数据
    this.queryTemplateData();
  }

  /**
   * 取消选择
   */
  colsePopUp() {
    this.display.templateTable = false;
    this.isHistoryAlarmTemplateTable = false;
    this.resultAndClose.emit();
  }

  /**
   * 翻页查询
   */
  pageTemplateChange(event) {
    this.queryCondition.filterConditions = this.filterEvent;
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryTemplateData();
  }

  /**
   * 选中确认
   */
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

  /**
   * 查询模板列表数据
   */
  queryTemplateData() {
    let url;
    if (!toBoolean(this.isHistoryAlarmTemplateTable)) {
      url = 'queryAlarmTemplateList';
    } else {
      url = 'queryHistoryAlarmTemplateList';
    }
    return new Promise((resolve, reject) => {
      this.$alarmService[url](this.queryCondition).subscribe((res: Result) => {
        if (res.code === 0) {
          this._dataSettemplate = res.data || [];
        }
        resolve();
      });
    });
  }

  /**
   * 模板列表配置
   */
  templateListConfig() {
    this.tableConfigTemplate = {
      isDraggable: true,
      isLoading: false,
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
          fixedStyle: {fixedLeft: true, style: {left: '12px'}}
        },
        {
          // 模板名称
          title: this.language.templateName, key: 'templateName', width: 100, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '24px'}}
        },
        {
          // 创建时间
          title: this.language.createTime, key: 'createTime', width: 200, isShowSort: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'input'}
        },
        {
          // 创建用户
          title: this.language.createUser, key: 'createUser', width: 100, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.remark, key: 'remark', width: 100, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 80, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      bordered: false,
      showSearch: false,
      searchReturnType: 'Object',
      topButtons: [
        {
          // 新增
          text: '+    ' + this.language.add,
          handle: () => {
            if (toBoolean(this.isHistoryAlarmTemplateTable)) {
              this.$router.navigate(['business/alarm/current-alarm/add'], {queryParams: {isHistoryAlarmTemplateTable: true}}).then();
            } else {
              this.$router.navigate(['business/alarm/current-alarm/add']).then();
            }
          }
        }
      ],
      operation: [
        {
          // 编辑
          text: this.language.update,
          className: 'fiLink-edit',
          handle: (currentIndex) => {
            this.$router.navigate(['business/alarm/current-alarm/update'], {
              queryParams: {
                id: currentIndex.id,
                isHistoryAlarmTemplateTable : this.isHistoryAlarmTemplateTable
              }
            }).then();
          }
        },
        {
          text: this.language.deleteHandle,
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          handle: (data) => {
            const ids = data.id;
            if (ids) {
              let url;
              if (!toBoolean(this.isHistoryAlarmTemplateTable)) {
                url = 'deleteAlarmTemplateList';
              } else {
                url = 'deleteHistoryAlarmTemplateList';
              }
              this.$alarmService[url]([ids]).subscribe((res: Result) => {
                if (res.code === 0) {
                  if (ids === this.selectedAlarmId) {
                    this.selectedAlarmId = null;
                    this._selectedAlarm = null;
                  }
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
}
