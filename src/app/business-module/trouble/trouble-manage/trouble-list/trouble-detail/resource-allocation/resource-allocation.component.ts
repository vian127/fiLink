import { Component, OnInit, Input } from '@angular/core';
import { FaultLanguageInterface } from '../../../../../../../assets/i18n/fault/fault-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {QueryCondition, SortCondition} from '../../../../../../shared-module/entity/queryCondition';
import {TableConfig} from '../../../../../../shared-module/entity/tableConfig';
import {PageBean} from '../../../../../../shared-module/entity/pageBean';
@Component({
  selector: 'app-resource-allocation',
  templateUrl: './resource-allocation.component.html',
  styleUrls: ['./resource-allocation.component.scss']
})
export class ResourceAllocationComponent implements OnInit {
  @Input() person: any;
  @Input() car: any;
  @Input() equipment: any;
  // 告警国际化引用
  public language: FaultLanguageInterface;
  // 人员数据
  public personData: any = [];
  // 车辆数据
  public carData: any = [];
  // 申请设备数据
  public applyData: any = [];
  // 人员列表配置
  public personTableConfig: TableConfig;
  // 车辆列表配置
  public carTableConfig: TableConfig;
  // 申请列表配置
  public applyTableConfig: TableConfig;
  // 人员分页
  public personRecordPageBean: PageBean = new PageBean(10, 1, 1);
  // 车辆分页
  public carRecordPageBean: PageBean = new PageBean(10, 1, 1);
  // 申请设备分页
  public applyRecordPageBean: PageBean = new PageBean(10, 1, 1);
  // 查询条件
  private queryCondition: QueryCondition = new QueryCondition();
  constructor(
    public $nzI18n: NzI18nService,
  ) {
    this.language = this.$nzI18n.getLocaleData('fault');
  }

  ngOnInit() {
    this.initTable();
    this.refreshData();
  }
  /**
   * 刷新数据
   */
  private refreshData() {
    this.personData = this.person;
    this.carData = this.car;
    this.applyData = this.equipment;
  }

  /**
   * 加载表格
   */
  private initTable() {
      this.initPersonTableConfig();
      this.initCarTableConfig();
      this.initApplyTableConfig();
  }
  /**
   * 初始化人员列表配置
   */
  private initPersonTableConfig() {
    this.personTableConfig = {
      // isDraggable: true,
      isLoading: false,
      showPagination: false,
      bordered: false,
      showSearch: false,
      scroll: {x: '512px', y: '600px'},
      columnConfig: [
        {title: this.language.personName, key: 'staffName', isShowSort: true},
      ],
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
      },
      handleSearch: (event) => {
      }
    };
  }
  /**
   * 初始化车辆列表配置
   */
  private initCarTableConfig() {
    this.carTableConfig = {
      // isDraggable: true,
      isLoading: false,
      showPagination: false,
      bordered: false,
      showSearch: false,
      scroll: {x: '512px', y: '600px'},
      columnConfig: [
        {title: this.language.carName, key: 'carName', isShowSort: true},
      ],
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
      },
      handleSearch: (event) => {
      }
    };
  }
  /**
   * 初始化申请列表配置
   */
  private initApplyTableConfig() {
    this.applyTableConfig = {
      // isDraggable: true,
      isLoading: false,
      showPagination: false,
      bordered: false,
      showSearch: false,
      scroll: {x: '512px', y: '600px'},
      columnConfig: [
        {title: this.language.equipmentName, key: 'equipmentName', isShowSort: true},
      ],
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
      },
      handleSearch: (event) => {
      }
    };
  }
  /**
   * 人员翻页处理
   * param event
   */
  personRecordPageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
  }
  /**
   * 车辆翻页处理
   * param event
   */
  carRecordPageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
  }
  /**
   * 人员翻页处理
   * param event
   */
  applyRecordPageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
  }
}
