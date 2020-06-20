import { Component, OnInit } from '@angular/core';
import { FaultLanguageInterface } from '../../../../../../../assets/i18n/fault/fault-language.interface';
import {QueryCondition, SortCondition} from '../../../../../../shared-module/entity/queryCondition';
import {NzI18nService} from 'ng-zorro-antd';
import {TableConfig} from '../../../../../../shared-module/entity/tableConfig';
import {PageBean} from '../../../../../../shared-module/entity/pageBean';
@Component({
  selector: 'app-history-process-record-table',
  templateUrl: './history-process-record-table.component.html',
  styleUrls: ['./history-process-record-table.component.scss']
})
export class HistoryProcessRecordTableComponent implements OnInit {
  // 告警国际化引用
  public language: FaultLanguageInterface;
  // 历史流程记录
  public troubleRecord: any = [];
  // 流程记录分页
  public troubleRecordPageBean: PageBean = new PageBean(10, 1, 1);
  // 流程记录列表配置
  public troubleRecordTableConfig: TableConfig;
  // 查询条件
  private queryCondition: QueryCondition = new QueryCondition();
  constructor(
    public $nzI18n: NzI18nService,
  ) {
    this.language = this.$nzI18n.getLocaleData('fault');
  }

  ngOnInit() {
    this.initTableConfig();
    this.refreshData();
  }

  /**
   * 初始化列表配置
   */
  private initTableConfig() {
    this.troubleRecordTableConfig = {
      isDraggable: false,
      isLoading: false,
      showPagination: true,
      bordered: false,
      showSearch: false,
      scroll: {x: '512px', y: '600px'},
      columnConfig: [
        {title: this.language.name, key: 'name', isShowSort: true},
        {
          title: this.language.operator, key: 'operator', isShowSort: true
        },
        {
          title: this.language.time, key: 'time', isShowSort: true, pipe: 'date'
        },
        {
          title: this.language.troubleRemark, key: 'troubleRemark', isShowSort: true
        },
      ],
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
      },
      handleSearch: (event) => {
      }
    };
  }

  /**
   * 历史流程记录翻页处理
   * param event
   */
  troubleRecordPageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
  }

  /**
   * 刷新数据
   */
  private refreshData() {
    const n = Math.ceil(Math.random() * 100);
    this.troubleRecordPageBean.Total = n;
    this.troubleRecordPageBean.pageIndex = 1;
    this.troubleRecordPageBean.pageSize = 10;
    const data = [];
    for (let i = 0; i < n; i++) {
      // @ts-ignore
      data.push({ id: i, name: '环境配置', operator: '张三' + i, time: '2020-05-22', troubleRemark: '温度过高'});
    }
    this.troubleRecord = data;
  }
}
