import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FacilityService} from '../../../../core-module/api-service/facility/facility-manage';
import {getDeployStatus, getDeviceStatus, getDeviceType} from 'src/app/business-module/facility/share/const/facility.config';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmObjectConfig} from '../alarmSelectorConfig';
import {AlarmLanguageInterface} from 'src/assets/i18n/alarm/alarm-language.interface';
import {TableComponent} from 'src/app/shared-module/component/table/table.component';
import {CommonUtil} from '../../../util/common-util';
import {PageBean} from '../../../entity/pageBean';
import {TableConfig} from '../../../entity/tableConfig';
import {QueryCondition, SortCondition} from '../../../entity/queryCondition';
import {Result} from '../../../entity/result';
import {FacilityUtilService} from '../../../../business-module/facility';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';

@Component({
  selector: 'app-alarm-object',
  templateUrl: './alarm-object.component.html',
  styleUrls: ['./alarm-object.component.scss']
})

export class AlarmObjectComponent implements OnInit {
  public language: AlarmLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 勾选的告警对象
  checkAlarmObject = {
    name: '',
    ids: []
  };
  // 选择器数据备份
  checkAlarmObjectBackups = {
    name: '',
    ids: []
  };
  display = {
    objTable: false,
  };
  pageBeanObject: PageBean = new PageBean(10, 1, 0);
  _dataSetObject = [];
  _type: 'form' | 'table' = 'table';
  _alarmObjectConfig: AlarmObjectConfig;
  tableConfigObject: TableConfig;
  queryConditionObj: QueryCondition = new QueryCondition();

  constructor(
    public $nzI18n: NzI18nService,
    public $facilityService: FacilityService,
  ) {
    this.language = this.$nzI18n.getLocaleData('alarm');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
  }

  @ViewChild('xCTableComp') private xCTableComp: TableComponent;
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  @ViewChild('deviceStatusTemp') deviceStatusTemp: TemplateRef<any>;

  @Input()
  set alarmObjectConfig(alarmObjectConfig: AlarmObjectConfig) {
    if (alarmObjectConfig) {
      this.initTableConfig();
      this._alarmObjectConfig = alarmObjectConfig;
      this.setData();
    }
  }

  @Input()
  filterValue;
  @Input()
  placeholder;
  @Input()
  title;

  setData() {
    if (this._alarmObjectConfig.type) {
      this._type = this._alarmObjectConfig.type;
    }
    if (this._alarmObjectConfig.initialValue && this._alarmObjectConfig.initialValue.ids
      && this._alarmObjectConfig.initialValue.ids.length) {
      this.checkAlarmObject = this.clone(this._alarmObjectConfig.initialValue);
      this.checkAlarmObjectBackups = this.clone(this._alarmObjectConfig.initialValue);
    }
    // 外面清空清空所有数据
    if (this._alarmObjectConfig.clear) {
      this.queryConditionObj.pageCondition.pageNum = 1;
      this.checkAlarmObject = {
        name: '',
        ids: []
      };
      this.checkAlarmObjectBackups = {
        name: '',
        ids: []
      };
    }
  }

  // 告警对象请求列表数据
  refreshObjectData(body?) {
    this.tableConfigObject.isLoading = true;
    this.$facilityService.deviceListByPage(body || this.queryConditionObj).subscribe((res: Result) => {
      this.tableConfigObject.isLoading = false;
      if (res['code'] === '00000') {
        this.pageBeanObject.Total = res.totalCount;
        this.pageBeanObject.pageIndex = res.pageNum;
        this.pageBeanObject.pageSize = res.size;
        this._dataSetObject = res.data || [];
        this._dataSetObject.forEach(item => {
          item.areaName = item.areaInfo ? item.areaInfo.areaName : '';
          item['_deviceType'] = item.deviceType;
          item.deviceType = getDeviceType(this.$nzI18n, item.deviceType);
          item['_deviceStatus'] = item.deviceStatus;
          item.deviceStatus = getDeviceStatus(this.$nzI18n, item.deviceStatus);
          item.deployStatus = getDeployStatus(this.$nzI18n, item.deployStatus);
          item['deviceStatusIconClass'] = FacilityUtilService.getFacilityDeviceStatusClassName(item._deviceStatus).iconClass;
          item['deviceStatusColorClass'] = FacilityUtilService.getFacilityDeviceStatusClassName(item._deviceStatus).colorClass;
          item['iconClass'] = CommonUtil.getFacilityIconClassName(item._deviceType);
          this.checkAlarmObjectBackups.ids.forEach(_item => {
            if (item.deviceId === _item) {
              item.checked = true;
            }
          });
        });
      }
    }, () => {
      this.tableConfigObject.isLoading = false;
    });
  }

  // 告警对象弹框
  private initTableConfig() {
    this.tableConfigObject = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      scroll: {x: '1200px', y: '340px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 42},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
        },
        {
          title: this.language.type, key: 'deviceType',
          // configurable: true,
          type: 'render',
          renderTemplate: this.deviceTypeTemp,
          minWidth: 90,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: getDeviceType(this.$nzI18n), label: 'label', value: 'code'}
        },
        {
          // 名称
          title: this.language.name, key: 'deviceName', width: 170,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          // 状态
          title: this.language.status, key: 'deviceStatus',
          width: 200,
          type: 'render',
          renderTemplate: this.deviceStatusTemp,
          // configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: getDeviceStatus(this.$nzI18n),
            label: 'label', value: 'code'
          }
        },
        {
          title: this.language.assetCode, key: 'deviceCode', width: 200,
          // configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.address, key: 'address', width: 170,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.deployStatus, key: 'deployStatus',
          // configurable: true,
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: getDeployStatus(this.$nzI18n), label: 'label', value: 'code'}
        },
        {
          // 备注
          title: this.language.remark,
          key: 'remarks', width: 200,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '',
          width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.queryConditionObj.sortCondition.sortField = event.sortField;
        this.queryConditionObj.sortCondition.sortRule = event.sortRule;
        this.refreshObjectData();
      },
      handleSelect: (data, currentItem) => {
        if (!currentItem) {
          // 当前页面全选 获取全部取消时
          if (data && data.length) {
            data.forEach(checkData => {
              if (this.checkAlarmObjectBackups.ids.indexOf(checkData.deviceId) === -1) {
                // 不存在时 添加进去
                this.checkData(checkData);
              }
            });
          } else {
            // 取消当前页面的全部勾选
            this._dataSetObject.forEach(item => {
              if (this.checkAlarmObjectBackups.ids.indexOf(item.deviceId) !== -1) {
                // 当该条数据存在于 勾选信息中时 将其移除
                this.cancelCheck(item);
              }
            });
          }
        } else {
          if (currentItem.checked) {
            this.checkData(currentItem);
          } else {
            this.cancelCheck(currentItem);
          }
        }
      },
      handleSearch: (event) => {
        if (event.length) {
          const obj = {};
          event.forEach((item, index) => {
            obj[item.filterField] = item.filterValue;
            if (item.filterField === 'deviceNames') {
              item.filterField = 'deviceType';
            }
            // 对于类型里面的 可能为空数组的情况作出特殊处理
            if (item.filterField === 'deviceStatus' && !item.filterValue.length) {
              event.splice(index, 1);
            }
          });
        }
        this.queryConditionObj.pageCondition.pageNum = 1;
        this.queryConditionObj.filterConditions = event;
        this.refreshObjectData();
      }
    };
  }

  // 勾选数据时
  checkData(currentItem) {
    // 勾选
    this.checkAlarmObjectBackups.ids.push(currentItem.deviceId);
    const names = this.checkAlarmObjectBackups.name + ',' + currentItem.deviceName;
    this.checkAlarmObjectBackups.name = this.checkAlarmObjectBackups.name === '' ? currentItem.deviceName : names;
  }

  // 取消勾选
  cancelCheck(currentItem) {
    // 取消勾选
    this.checkAlarmObjectBackups.ids = this.checkAlarmObjectBackups.ids.filter(id => {
      return currentItem.deviceId !== id && id;
    });
    const names = this.checkAlarmObjectBackups.name.split(',');
    this.checkAlarmObjectBackups.name = names.filter(name => currentItem.deviceName !== name && name).join(',');
  }

  // 告警对象列表弹框分页
  pageObjectChange(event) {
    this.queryConditionObj.pageCondition.pageNum = event.pageIndex;
    this.queryConditionObj.pageCondition.pageSize = event.pageSize;
    this.refreshObjectData();
  }

  closeObj() {
    this.checkAlarmObjectBackups = this.clone(this.checkAlarmObject);
    this.display.objTable = false;
    this.pageBeanObject = new PageBean(10, 1, 1);
  }

  objConfirm() {
    this.checkAlarmObject = this.clone(this.checkAlarmObjectBackups);
    if (this._type === 'table') {
      if (this.filterValue) {
        this.filterValue['filterValue'] = this.checkAlarmObject.ids;
      }
    }
    this.display.objTable = false;
    this.pageBeanObject = new PageBean(10, 1, 1);
    this._alarmObjectConfig.alarmObject(this.checkAlarmObject);
  }

  // 克隆数据
  clone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  ngOnInit() {
    this.initTableConfig();
  }

  /**
   * 选择器里面清空已选数据
   * 只清空选择器数据
   */
  clearSelectData() {
    this.checkAlarmObjectBackups = {
      name: '',
      ids: []
    };
    this.refreshObjectData();
  }
}
