import {Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService, NzMessageService} from 'ng-zorro-antd';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {Router} from '@angular/router';
import {FACILITY_STATUS_CODE} from '../../../../shared-module/const/facility';
import {IndexTable} from '../../util/index.table';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FacilityService} from '../../../../core-module/api-service/facility/facility-manage/index';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {Result} from '../../../../shared-module/entity/result';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {cableLevelCode, getCableLevel} from '../../../facility/share/const/facility.config';
/**
 * 光缆列表组件
 */
@Component({
  selector: 'app-fibre-list',
  templateUrl: './fibre-list.component.html',
  styleUrls: ['./fibre-list.component.scss']
})
export class FibreListComponent extends IndexTable implements OnInit, OnDestroy {
  // 光缆列表回传事件
  @Output() fibreListEvent = new EventEmitter();
  // 区域等级模板
  @ViewChild('areaLevelTemp') areaLevelTemp: TemplateRef<any>;
  // 光缆名称
  @ViewChild('fibreName') fibreNameTemp: TemplateRef<any>;
  // 表格
  @ViewChild('xcTable') xcTable: TableComponent;
  // 国际化
  public language: FacilityLanguageInterface;
  // 分页条件
  public queryCondition: QueryCondition = new QueryCondition();
  // 全部数据
  public dataSetAll = [];
  // 操作数据
  public dataSet = [];
  // 查询条件
  public queryConditions = {};
  // 光缆列表
  public facilityList = [];
  // 标题
  public title;
  // 待过滤的设施集
  public _facilities = [];
  // 设施告警码
  public facilityAlarmCode;
  // 光缆类型
  public cableType = cableLevelCode;

  constructor(public $nzI18n: NzI18nService,
              private $message: NzMessageService,
              private $router: Router,
              private $mapStoreService: MapStoreService,
              private $facilityService: FacilityService,
              ) {
    super($nzI18n);
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.facilityAlarmCode = FACILITY_STATUS_CODE.alarm;
    this.title = this.indexLanguage.fibreList;
    this.initTableConfig();
    this.getAllShowData();
    this.refreshData();
  }

  ngOnDestroy() {
    this.queryConditions = {};
  }

  /**
   * 翻页
   */
  pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.pageBean.pageSize = event.pageSize;
    this.pageBean.pageIndex = event.pageIndex;
    this.refreshData();
    this.showData();
  }

  /**
   * 获取所有未过滤的数据
   */
  public getAllShowData() {
    this.dataSetAll = [];
    this.dataSetAll = this._dataSet;
    this.filterData();
  }

  /**
   * 数据更新
   * param type
   * param ids
   */
  update(type, ids) {
    this.getAllShowData();
  }

  /**
   * 过滤数据
   */
  filterData() {
    this._facilities = this.dataSetAll;
    this.showData();
  }

  /**
   * 展示数据
   */
  showData() {
    this.pageBean.Total = this.dataSet.length;
    const startIndex = this.pageBean.pageSize * (this.pageBean.pageIndex - 1);
    const endIndex = startIndex + this.pageBean.pageSize - 1;
    this._dataSet = this.dataSet.filter((item, index) => {
      return index >= startIndex && index <= endIndex;
    }).map(item => {
      item.deviceTypeName = this.getFacilityTypeName(item.deviceType);
      item.deviceStatusName = this.getFacilityStatusName(item.deviceStatus);
      return item;
    });
  }

  /**
   * 关闭
   */
  close() {
    this.fibreListEvent.emit({type: 'close'});
  }

  /**
   * 初始化表格配置
   */
  initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '440px', y: '250px'},
      searchReturnType: 'object',
      showSearchExport: false,
      topButtons: [],
      simplePage: true,
      noIndex: true,
      columnConfig: [
        { // 光缆名称
          title: this.language.cableName, key: 'opticCableName',
          fixedStyle: {fixedRight: true, style: {left: '0px'}}, width: 150,
          searchable: true,
          searchKey: 'opticCableName',
          type: 'render',
          renderTemplate: this.fibreNameTemp,
          searchConfig: {type: 'input'}
        },
        { // 光缆级别
          title: this.language.cableLevel, key: 'opticCableLevel', width: 150,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: getCableLevel(this.$nzI18n), label: 'label', value: 'code'
          },
        },
        {
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 70, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: true,
      operation: [
        {
          text: this.indexLanguage.topoLogicalHighLighting,
          className: 'fiLink-view-optical-cable',
          handle: (currentIndex) => {
            this.fibreListEvent.emit({id: currentIndex.opticCableId, type: 'seeLocation'});
          }
        },
      ],
      handleSearch: (event) => {
        this.handleSearch(event);
        this.refreshData();
      },
    };
  }
  /**
   * 光缆信息列表筛选
   * param event
   */
  handleSearch(event) {
    this.queryCondition.bizCondition = this.setBizCondition(event);
    this.setPageCondition(event);
  }

  /**
   * 查看节点设施
   * param event
   */
  ToDeviceIdDetail(data) {
    this.fibreListEvent.emit({id: data.opticCableId, type: 'seeDetail'});
  }

  /**
   * 设置光缆信息列表查询条件
   */
  setPageCondition(event) {
    this.queryCondition.pageCondition.pageNum = 1;
  }

  /**
   * 光缆信息列表筛选下拉
   */
  setBizCondition(event) {
    const _bizCondition = CommonUtil.deepClone(event);
    if (_bizCondition.opticCableLevel) {
      _bizCondition.opticCableLevels = CommonUtil.deepClone(_bizCondition.opticCableLevel);
      delete _bizCondition.opticCableLevel;
    }
    return _bizCondition;
  }


  /**
   *获取光缆信息列表
   */
  public refreshData() {
    this.tableConfig.isLoading = true;
    this.queryCondition.pageCondition.pageSize = 5;
    this.$facilityService.getCableList(this.queryCondition).subscribe((result: Result) => {
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.tableConfig.isLoading = false;
        const data = result.data;
        data.forEach(item => {
          item.opticCableLevel = getCableLevel(this.$nzI18n, item.opticCableLevel);
        });
        this._dataSet = result.data;
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

}
