import {Component, OnInit, ViewChild, TemplateRef, Input} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmLanguageInterface} from 'src/assets/i18n/alarm/alarm-language.interface';
import {TableConfig} from 'src/app/shared-module/entity/tableConfig';
import {QueryCondition} from 'src/app/shared-module/entity/queryCondition';
import {AlarmService} from 'src/app/core-module/api-service/alarm';
import {Result} from 'src/app/shared-module/entity/result';
import {PageBean} from 'src/app/shared-module/entity/pageBean';
import {AlarmStoreService} from 'src/app/core-module/store/alarm.store.service';
import {AlarmNameConfig} from '../alarmSelectorConfig';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {getAlarmType} from '../../../../business-module/facility/share/const/facility.config';

@Component({
  selector: 'app-alarm-name',
  templateUrl: './alarm-name.component.html',
  styleUrls: ['./alarm-name.component.scss']
})

export class AlarmNameComponent implements OnInit {
  display = {
    nameTable: false,
    alarmNameDisabled: false
  };
  // 告警名称
  _dataSetName = [];
  public language: AlarmLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  tableConfigName: TableConfig;
  queryConditionName: QueryCondition = new QueryCondition();
  pageBeanName: PageBean = new PageBean(10, 1, 0);
  // 勾选的告警名称
  checkAlarmName = {
    name: '',
    ids: []
  };
  // 备份
  checkAlarmNameBackups = {
    name: '',
    ids: []
  };
  _type: 'form' | 'table' = 'table';
  _alarmNameConfig: AlarmNameConfig;
  @Input()
  set alarmNameConfig(alarmNameConfig: AlarmNameConfig) {
    if (alarmNameConfig) {
      this.alarmNamePopUp();
      this._alarmNameConfig = alarmNameConfig;
      this.setData();
    }
  }

  @Input() isFilter = false;
  //  AlarmNameConfig = new AlarmNameConfig();
  @Input()
  filterValue;

  constructor(
    public $nzI18n: NzI18nService,
    public $alarmService: AlarmService,
    public $alarmStoreService: AlarmStoreService
  ) {
    this.language = this.$nzI18n.getLocaleData('alarm');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
  }

  @ViewChild('alarmDefaultLevelTemp') alarmDefaultLevelTemp: TemplateRef<any>;
  @ViewChild('xcTableName') xcTableName;
  @ViewChild('alarmLevel') alarmLevel: TemplateRef<any>;

  // 告警名称弹框
  private alarmNamePopUp() {
    this.tableConfigName = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      scroll: {x: '800px', y: '300px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 50},
        {
          type: 'serial-number', width: 50, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}
        },
        {
          title: this.language.alarmName, key: 'alarmName', width: 150,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}
        },
        {
          title: this.language.alarmDefaultLevel, key: 'alarmDefaultLevel', width: 150,
          // configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.alarmDefaultLevelTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.language.urgent, value: '1'},
              {label: this.language.main, value: '2'},
              {label: this.language.secondary, value: '3'},
              {label: this.language.prompt, value: '4'}
            ]
          },
        },
        {
          title: this.language.alarmLevel, key: 'alarmLevel', width: 150,
          // configurable: true,
          searchable: true,
          // isShowSort: true,
          type: 'render',
          renderTemplate: this.alarmLevel,
          // renderTemplate: this.alarmLevelTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.language.urgent, value: 1},
              {label: this.language.main, value: 2},
              {label: this.language.secondary, value: 3},
              {label: this.language.prompt, value: 4}
            ]
          },
        },
        // {
        //   title: this.language.operate, searchable: true,
        //   searchConfig: {type: 'operate'}, key: '', width: 100,
        //   fixedStyle: {fixedRight: true, style: {right: '0px'}}
        // },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Object',
      topButtons: [],
      handleSelect: (data, currentItem) => {
        if (!currentItem) {
          // 当前页面全选 获取全部取消时
          if (data && data.length) {
            data.forEach(checkData => {
              if (this.checkAlarmNameBackups.ids.indexOf(checkData.id) === -1) {
                // 不存在时 添加进去
                this.checkData(checkData);
              }
            });
          } else {
            // 取消当前页面的全部勾选
            this._dataSetName.forEach(item => {
              if (this.checkAlarmNameBackups.ids.indexOf(item.id) !== -1) {
                // 当该条数据存在于 勾选信息中时 将其移除
                this.cancelCheck(item);
              }
            });
          }

        } else {
          if (currentItem.checked) {
            // 勾选
            this.checkData(currentItem);
          } else {
            // 取消勾选
            this.cancelCheck(currentItem);
          }
        }

      },
      handleSearch: (event) => {
        this.queryConditionName.pageCondition.pageNum = 1;
        if (event.length) {
          const obj = {};
          event.forEach(item => {
            obj[item.filterField] = item.filterValue;
          });
        }
        if (this.isFilter) {
          event.push({filterValue: 'orderOutOfTime', filterField: 'alarmCode', operator: 'neq'});
        }
        this.queryConditionName.filterConditions = event;
        this.refreshNameData();
      },
    };
  }

  // 勾选数据时
  checkData(currentItem) {
    this.checkAlarmNameBackups.ids.push(currentItem.id);
    const names = this.checkAlarmNameBackups.name + ',' + currentItem.alarmName;
    this.checkAlarmNameBackups.name = this.checkAlarmNameBackups.name === '' ? currentItem.alarmName : names;
  }

  // 取消勾选
  cancelCheck(currentItem) {
    // 取消勾选
    this.checkAlarmNameBackups.ids = this.checkAlarmNameBackups.ids.filter(id => {
      return currentItem.id !== id && id;
    });
    const names = this.checkAlarmNameBackups.name.split(',');
    this.checkAlarmNameBackups.name = names.filter(name => currentItem.alarmName !== name && name).join(',');
  }

  // 告警名称请求列表数据
  refreshNameData(body?) {
    this.tableConfigName.isLoading = true;
    if (this.isFilter) {
      const index = this.queryConditionName.filterConditions.findIndex(item => item.filterField === 'alarmCode' && item.operator === 'neq');
      if (index === -1) {
        this.queryConditionName.filterConditions.push({filterValue: 'orderOutOfTime', filterField: 'alarmCode', operator: 'neq'});
      }
    }
    this.$alarmService.queryAlarmCurrentSetList(body || this.queryConditionName).subscribe((res: Result) => {
      this.pageBeanName.Total = res.totalCount;
      this.pageBeanName.pageSize = res.size;
      this.pageBeanName.pageIndex = res.pageNum;
      this.tableConfigName.isLoading = false;
      this._dataSetName = res.data.map(item => {
        item.defaultStyle = this.$alarmStoreService.getAlarmColorByLevel(item.alarmDefaultLevel);
        item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmLevel);
        item.alarmName = getAlarmType(this.$nzI18n, item.alarmCode);
        this.checkAlarmNameBackups.ids.forEach(_item => {
          if (item.id === _item) {
            item.checked = true;
          }
        });
        return item;
      });
    }, () => {
      this.tableConfigName.isLoading = false;
    });
  }

  // 告警名称 选择后
  nameConfirm() {
    this.display.nameTable = false;
    this.checkAlarmName = this.clone(this.checkAlarmNameBackups);
    if (this._type === 'table') {
      this.filterValue['filterValue'] = this.checkAlarmName.ids;
    }
    this._alarmNameConfig.alarmName(this.checkAlarmName);
  }

  // 关闭弹框
  close() {
    this.checkAlarmNameBackups = this.clone(this.checkAlarmName);
    this.display.nameTable = false;
  }

  // 克隆数据
  clone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  // 告警名称列表 弹框分页
  pageNameChange(event) {
    // this.queryConditionName.filterConditions = this.filterEventObject;
    this.queryConditionName.pageCondition.pageNum = event.pageIndex;
    this.queryConditionName.pageCondition.pageSize = event.pageSize;
    this.refreshNameData();
  }

  setData() {
    // 获取类型
    if (this._alarmNameConfig.type) {
      this._type = this._alarmNameConfig.type;
    }
    // 获取默认数据
    if (this._alarmNameConfig.initialValue && this._alarmNameConfig.initialValue.ids
      && this._alarmNameConfig.initialValue.ids.length) {
      this.checkAlarmName = this.clone(this._alarmNameConfig.initialValue);
      this.checkAlarmNameBackups = this.clone(this._alarmNameConfig.initialValue);
    }
    this.display.alarmNameDisabled = this._alarmNameConfig.disabled;
    if (this._alarmNameConfig.clear) {
      this.queryConditionName.pageCondition.pageNum = 1;
      this.checkAlarmName = {
        name: '',
        ids: []
      };
      this.checkAlarmNameBackups = {
        name: '',
        ids: []
      };
    }
  }

  ngOnInit() {
    // 告警名称
    this.alarmNamePopUp();
  }

  /**
   * 选择器里面清空已选数据
   * 只清空选择器数据
   */
  clearSelectData() {
    this.checkAlarmNameBackups = {
      name: '',
      ids: []
    };
    this.refreshNameData();
  }
}
