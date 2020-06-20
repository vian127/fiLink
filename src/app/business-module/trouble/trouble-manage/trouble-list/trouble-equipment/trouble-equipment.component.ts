import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FacilityService} from '../../../../../core-module/api-service/facility/facility-manage';
import {NzI18nService} from 'ng-zorro-antd';
import {TroubleObjectConfig} from './troubleSelectorConfig';
import {FaultLanguageInterface} from 'src/assets/i18n/fault/fault-language.interface';
import {TableComponent} from 'src/app/shared-module/component/table/table.component';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {Result} from '../../../../../shared-module/entity/result';
import {FacilityUtilService} from '../../../../../business-module/facility';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {TroubleService} from '../../../../../core-module/api-service/trouble/trouble-manage';

@Component({
  selector: 'app-trouble-equipment',
  templateUrl: './trouble-equipment.component.html',
  styleUrls: ['./trouble-equipment.component.scss']
})

export class TroubleEquipmentComponent implements OnInit {
  public language: FaultLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  public facilityLanguage: FacilityLanguageInterface;
  // 勾选的告警对象
  checkTroubleObject = {
    name: '',
    ids: [],
    type: '',
  };
  // 选择器数据备份
  checkTroubleObjectBackups = {
    name: '',
    ids: [],
    type: '',
  };
  display = {
    objTable: false,
  };
  pageBeanObject: PageBean = new PageBean(10, 1, 0);
  _dataSetObject = [];
  _type: 'form' | 'table' = 'table';
  _troubleObjectConfig: TroubleObjectConfig;
  tableConfigObject: TableConfig;
  queryConditionObj: QueryCondition = new QueryCondition();

  constructor(
    public $nzI18n: NzI18nService,
    public $facilityService: FacilityService,
    private $troubleService: TroubleService,
  ) {
    this.language = this.$nzI18n.getLocaleData('fault');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.facilityLanguage = this.$nzI18n.getLocaleData('facility');
  }

  @ViewChild('xCTableComp') private xCTableComp: TableComponent;
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  @ViewChild('deviceStatusTemp') deviceStatusTemp: TemplateRef<any>;

  @Input()
  set troubleObjectConfig(troubleObjectConfig: TroubleObjectConfig) {
    if (troubleObjectConfig) {
      this.initTableConfig();
      this._troubleObjectConfig = troubleObjectConfig;
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
    if (this._troubleObjectConfig.type) {
      this._type = this._troubleObjectConfig.type;
    }
    if (this._troubleObjectConfig.initialValue && this._troubleObjectConfig.initialValue.ids
      && this._troubleObjectConfig.initialValue.ids.length) {
      this.checkTroubleObject = this.clone(this._troubleObjectConfig.initialValue);
      this.checkTroubleObjectBackups = this.clone(this._troubleObjectConfig.initialValue);
    }
    // 外面清空清空所有数据
    if (this._troubleObjectConfig.clear) {
      this.queryConditionObj.pageCondition.pageNum = 1;
      this.checkTroubleObject = {
        name: '',
        ids: [],
        type: '',
      };
      this.checkTroubleObjectBackups = {
        name: '',
        ids: [],
        type: '',
      };
    }
  }

  /**
   * 获取设备数据
   */
  refreshObjectData(body?) {
    this.tableConfigObject.isLoading = true;
    this.$troubleService.queryEquipment(this.queryConditionObj).subscribe((res: Result) => {
      if (res['code'] === '00000') {
        this.pageBeanObject.Total = res.totalCount;
        this.pageBeanObject.pageIndex = res.pageNum;
        this.pageBeanObject.pageSize = res.size;
        this._dataSetObject = res.data || [];
        this.tableConfigObject.isLoading = false;
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
      // noIndex: true,
      notShowPrint: true,
      scroll: {x: '1200px', y: '340px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {// 资产编号
          title: this.facilityLanguage.deviceCode, key: 'equipmentCode',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 名称
          title: this.facilityLanguage.name, key: 'equipmentName',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 类型
          title: this.facilityLanguage.type, key: 'equipmentType',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 状态
          title: this.facilityLanguage.status, key: 'equipmentStatus',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 型号
          title: this.facilityLanguage.model, key: 'equipmentModel',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 供应商
          title: this.facilityLanguage.supplierName, key: 'supplier',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 报废年限
          title: this.facilityLanguage.scrapTime, key: 'scrapTime',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 所属设施
          title: this.facilityLanguage.affiliatedDevice, key: 'deviceId',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 挂载位置
          title: this.facilityLanguage.mountPosition, key: 'mountPosition',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 安装时间
          title: this.facilityLanguage.installationDate, key: 'installationDate',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 权属公司
          title: this.facilityLanguage.company, key: 'company',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 业务状态
          title: this.facilityLanguage.businessStatus, key: 'businessStatus',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 所属区域
          title: this.facilityLanguage.areaId, key: 'areaName',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 所属网关
          title: this.facilityLanguage.gatewayName, key: 'gatewayId',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 备注
          title: this.facilityLanguage.remarks, key: 'remarks',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
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
              if (this.checkTroubleObjectBackups.ids.indexOf(checkData.equipmentId) === -1) {
                // 不存在时 添加进去
                this.checkData(checkData);
              }
            });
          } else {
            // 取消当前页面的全部勾选
            this._dataSetObject.forEach(item => {
              if (this.checkTroubleObjectBackups.ids.indexOf(item.equipmentId) !== -1) {
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
    this.checkTroubleObjectBackups.ids.push(currentItem.equipmentId);
    const names = this.checkTroubleObjectBackups.name + ',' + currentItem.equipmentName;
    const types = this.checkTroubleObjectBackups.type + ',' + currentItem.equipmentType;
    this.checkTroubleObjectBackups.name = this.checkTroubleObjectBackups.name === '' ? currentItem.equipmentName : names;
    this.checkTroubleObjectBackups.type = this.checkTroubleObjectBackups.type === '' ? currentItem.equipmentType : types;
  }

  // 取消勾选
  cancelCheck(currentItem) {
    // 取消勾选
    this.checkTroubleObjectBackups.ids = this.checkTroubleObjectBackups.ids.filter(equipmentId => {
      return currentItem.equipmentId !== equipmentId && equipmentId;
    });
    const names = this.checkTroubleObjectBackups.name.split(',');
    const types = this.checkTroubleObjectBackups.type.split(',');
    this.checkTroubleObjectBackups.name = names.filter(name => currentItem.equipmentName !== name && name).join(',');
    this.checkTroubleObjectBackups.type = types.filter(type => currentItem.equipmentType !== type && type).join(',');
  }

  // 告警对象列表弹框分页
  pageObjectChange(event) {
    this.queryConditionObj.pageCondition.pageNum = event.pageIndex;
    this.queryConditionObj.pageCondition.pageSize = event.pageSize;
    this.refreshObjectData();
  }

  closeObj() {
    this.checkTroubleObjectBackups = this.clone(this.checkTroubleObject);
    this.display.objTable = false;
    this.pageBeanObject = new PageBean(10, 1, 1);
  }

  objConfirm() {
    this.checkTroubleObject = this.clone(this.checkTroubleObjectBackups);
    if (this._type === 'table') {
      if (this.filterValue) {
        this.filterValue['filterValue'] = this.checkTroubleObject.ids;
      }
    }
    this.display.objTable = false;
    this.pageBeanObject = new PageBean(10, 1, 1);
    this._troubleObjectConfig.troubleObject(this.checkTroubleObject);
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
    this.checkTroubleObjectBackups = {
      name: '',
      ids: [],
      type: '',
    };
    this.refreshObjectData();
  }
}
