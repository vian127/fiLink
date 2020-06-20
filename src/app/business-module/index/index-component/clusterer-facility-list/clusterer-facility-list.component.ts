import {
  Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef,
  ViewChild
} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {IndexTable} from '../../util/index.table';
import {FACILITY_STATUS_COLOR} from '../../../../shared-module/const/facility';
import {AREA_LEVEL_COLOR, AREA_LEVEL_NAME} from '../../../../shared-module/const/area';
import {index_device_status_color, index_facility_type} from '../../shared/const/index-const';
/**
 * 聚合点设施详情组件
 */
@Component({
  selector: 'app-clusterer-facility-list',
  templateUrl: './clusterer-facility-list.component.html',
  styleUrls: ['./clusterer-facility-list.component.scss']
})
export class ClustererFacilityListComponent extends IndexTable implements OnInit, OnChanges {
  // 设施列表
  @Input() facilityList: any[] = [];
  // 区域信息
  @Input() areaData: any[];
  // 设施列表回传
  @Output() facilityListEvent = new EventEmitter();
  // 是否显示拓扑高亮
  @Output() isShowTopogy = new EventEmitter();
  // 设施名称模版
  @ViewChild('facilityNameTemp') facilityNameTemp: TemplateRef<any>;
  // 设施类型
  public facilityType = index_facility_type;
  // 查询条件
  public queryConditions = [];
  // 下拉框
  public selectOption;
  // 语言类型
  public typeLg;
  // 聚合点窗口位置
  public infoWindowLeft = '0px';
  public infoWindowTop = '0px';
  // 是否显示聚合点
  public isShowInfoWindow = false;
  // 聚合点数据
  public infoData = {
    type: '',
    data: null
  };
  // 区域地图
  public areaDataMap = new Map();

  constructor(
    public $nzI18n: NzI18nService,
  ) {
    super($nzI18n);
  }

  ngOnInit() {
    // 清空下拉框
    this.selectOption = [];
    // 语言类型
    this.typeLg = JSON.parse(localStorage.getItem('localLanguage'));
    // 初始化下拉框
    this.setSelectOption();
    // 初始化表格
    this.initTableConfig();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.facilityList) {
      this.filterData();
    }
    if (changes.areaData && changes.areaData.currentValue) {
      this.setAreaDataMap();
    }
  }

  /**
   * 设置区域数据
   */
  setAreaDataMap() {
    this.areaData.forEach(item => {
      this.areaDataMap.set(item.areaId, item);
    });
  }

  /**
   * 设置设施类型下拉款选项
   */
  setSelectOption() {
    const obj = {};
    this.facilityList.forEach(item => {
      if (!obj[item.areaId]) {
        obj[item.areaId] = {
          value: item.areaId,
          label: item.areaName
        };
      }
    });
    this.selectOption = Object.values(obj);
  }

  /**
   * 过滤数据
   */
  filterData() {
    // 光交箱 001，配线架 060，接头盒 090
    this._dataSet = this.facilityList.filter(item => {
      const e = item.deviceType;
      if (e === this.facilityType.patchPanel || e === this.facilityType.opticalBox || e === this.facilityType.jointClosure) {
        item['name'] = true;
      }
      return this.checkFacility(item);
    });
  }

  /**
   * 校检设施
   * param item
   * returns {boolean}
   */
  checkFacility(item) {
    let bol = true;
    this.queryConditions.forEach(q => {
      if (q.filterValue && q.operator === 'eq' && item[q.filterField] !== q.filterValue) {
        bol = false;
      } else if (q.filterValue && q.operator === 'like' && !item[q.filterField].includes(q.filterValue)) {
        bol = false;
      } else if (q.filterValue && q.operator === 'in' && (q.filterValue.indexOf(item[q.filterField]) < 0)) {
        bol = false;
      } else {
      }
    });
    return bol;
  }

  /**
   * 鼠标移入
   * param event
   * param data
   */
  itemMouseOver(event, data) {
    this.openInfoWindow(event, data);
  }

  /**
   * 鼠标移出
   * param event
   */
  itemMouseOut(event) {
    this.isShowInfoWindow = false;
  }

  /**
   * 打开设施提示框
   * param e
   * param data
   */
  openInfoWindow(e, data) {
    this.infoWindowLeft = e.clientX + 'px';
    this.infoWindowTop = e.clientY + 'px';
    const areaLevel = this.getAreaLevel(data.areaId);
    this.infoData = {
      type: 'm',
      data: {
        deviceName: data.deviceName,
        deviceStatusName: this.getFacilityStatusName(data.deviceStatus),
        deviceStatusColor: this.getDeviceStatusColor(data.deviceStatus),
        areaLevelName: this.getAreaLevelName(areaLevel),
        areaLevelColor: this.getAreaLevelColor(areaLevel),
        areaName: data.areaName,
        address: data.address,
        className: CommonUtil.getFacilityIconClassName(data.deviceType)
      }
    };
    this.isShowInfoWindow = true;
  }

  /**
   * 打开设施详情面板
   * param data
   */
  openFacilityInfoPanel(data) {
    this.facilityListEvent.emit({type: 'location', id: data.deviceId});
  }

  /**
   * 初始化表格配置
   */
  initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '280px', y: '55px'},
      outHeight: 250,
      noAutoHeight: true,
      topButtons: [],
      noIndex: true,
      columnConfig: [
        {
          title: this.indexLanguage.areaName, key: 'areaName', width: 100,
          searchable: true,
          searchKey: 'areaId',
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.selectOption}
        },
        {
          title: this.indexLanguage.deviceName, key: 'deviceName', width: 100,
          searchable: true,
          type: 'render',
          renderTemplate: this.facilityNameTemp,
          searchConfig: {type: 'input'}
        },
        {
          title: '', searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 80, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: true,
      operation: [
        {
          text: this.indexLanguage.viewTopology,
          key: 'name',
          className: 'fiLink-view-topology',
          handle: (currentIndex) => {
            console.log(currentIndex);
            this.isShowTopogy.emit({type: 'isTopog', data: currentIndex});
          }
        },
        {
          text: this.indexLanguage.topoLogicalHighLighting,
          key: 'name',
          className: 'fiLink-topology-highlight',
          handle: (currentIndex) => {
            this.isShowTopogy.emit({type: 'islight', data: currentIndex});
          }
        }
      ],
      handleSearch: (event) => {
        this.queryConditions = event;
        this.filterData();
      }
    };
  }

  /**
   * 通过id判断告警级别
   * param id
   * returns {string}
   */
  getAreaLevel(id) {
    const level = this.areaDataMap.get(id).areaLevel || '';
    return level.toString();
  }

  /**
   * 通过level判断告警颜色
   * param level
   * returns {string}
   */
  getAreaLevelColor(level) {
    return AREA_LEVEL_COLOR[level];
  }

  /**
   * 通过status判断告警颜色
   * param status
   * returns {string}
   */
  getDeviceStatusColor(status = index_device_status_color) {
    return FACILITY_STATUS_COLOR[status];
  }

  /**
   * 通过level判断告警名称
   * param level
   * returns {string}
   */
  getAreaLevelName(level) {
    const levelName = this.commonLanguage[AREA_LEVEL_NAME[level]] || '';
    if (this.typeLg === 'US') {
      return `${this.commonLanguage.level}${levelName}`;
    } else {
      return `${levelName}${this.commonLanguage.level}`;
    }
  }
}
