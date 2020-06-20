import {Component, OnInit} from '@angular/core';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {Result} from '../../../../../shared-module/entity/result';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {ApplicationService} from '../../../server';
import {ResultCodeEnum} from '../../../../../core-module/model/result-code.enum';
import {Electric, execStatus} from '../../../model/const/const';

@Component({
  selector: 'app-loop',
  templateUrl: './loop.component.html',
  styleUrls: ['./loop.component.scss']
})
export class LoopComponent implements OnInit {
  // 回路列表数据集合
  _dataSet = [];
  // 分页参数
  pageBean: PageBean = new PageBean(10, 1, 1);
  // 表格配置
  tableConfig: TableConfig;
  // 表格多语言
  language: OnlineLanguageInterface;
  // 状态
  roleArray: Array<any> = [];
  // 表格查询条件
  queryCondition: QueryCondition = new QueryCondition();

  constructor(
    public $nzI18n: NzI18nService,
    public $applicationService: ApplicationService,
  ) {
    this.language = this.$nzI18n.getLocaleData('online');
  }

  ngOnInit() {
    this.initTableConfig();
    this.refreshData();
  }

  /**
   * 分页查询
   * @ param event
   */
  pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
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
        {
          title: '类型', key: 'equipmentType', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: '状态', key: 'equipmentStatus', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: this.roleArray
          }
        },
        {
          title: '型号', key: 'equipmentModel', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        {
          title: '供应商', key: 'supplier', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: '报废年限', key: 'scrapTime', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [
        {
          text: '拉闸',
          needConfirm: true,
          canDisabled: true,
          confirmContent: '是否确认拉闸操作?',
          handle: (data) => {
            this.pullGate(data, Electric.up);
          }
        },
        {
          text: '合闸',
          needConfirm: true,
          canDisabled: true,
          confirmContent: '是否确认合闸操作?',
          handle: (data) => {
            this.pullGate(data, Electric.down);
          }
        },
      ],
      operation: [
        {
          text: '拉闸',
          className: 'fiLink-lost',
          needConfirm: true,
          confirmContent: '是否确认拉闸操作?',
          handle: (currentIndex) => {
            this.pullGate(currentIndex, Electric.up);
          }
        },
        {
          text: '合闸',
          className: 'fiLink-lost',
          needConfirm: true,
          confirmContent: '是否确认合闸操作?',
          handle: (currentIndex) => {
            this.pullGate(currentIndex, Electric.down);
          }
        }
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
   * 拉闸/合闸
   * @ param data 选中的数据
   * @ param type 区分开和关
   */
  pullGate(data, type) {
    let equipmentIds;
    if (data && data.length) {
      equipmentIds = data.map(item => item.equipmentId);
    } else {
      equipmentIds = [data.equipmentId];
    }
    const action = type === Electric.up ? execStatus.free : execStatus.implement;
    const params = {
      equipmentIds: equipmentIds,
      action: action
    };
    this.$applicationService.switchLight(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.refreshData();
      }
    }, () => {

    });
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
}
