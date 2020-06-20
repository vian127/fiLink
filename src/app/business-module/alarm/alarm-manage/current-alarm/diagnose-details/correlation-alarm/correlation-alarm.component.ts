import { Component, OnInit } from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {TableConfig} from '../../../../../../shared-module/entity/tableConfig';
import {PageBean} from '../../../../../../shared-module/entity/pageBean';
import {QueryCondition, SortCondition} from '../../../../../../shared-module/entity/queryCondition';
@Component({
  selector: 'app-correlation-alarm',
  templateUrl: './correlation-alarm.component.html',
  styleUrls: ['./correlation-alarm.component.scss']
})
export class CorrelationAlarmComponent implements OnInit {
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  // 相关性告警数据
  public correlationData: any = [];
  // 分页
  public alarmPageBean: PageBean = new PageBean(10, 1, 1);
  // 列表配置
  public alarmTableConfig: TableConfig;
  // 查询条件
  private queryCondition: QueryCondition = new QueryCondition();
  constructor(
    public $nzI18n: NzI18nService,
  ) {
    this.language = this.$nzI18n.getLocaleData('alarm');
  }

  ngOnInit() {
    this.initTableConfig();
    this.refreshData();
  }
  /**
   * 刷新数据
   */
  private refreshData() {
    const n = Math.ceil(Math.random() * 5);
    this.alarmPageBean.Total = n;
    this.alarmPageBean.pageIndex = 1;
    this.alarmPageBean.pageSize = 10;
    const data = [];
    for (let i = 0; i < n; i++) {
      // @ts-ignore
      data.push({ id: i, alarmName: '环境配置', alarmFixedLevel: i,
        alarmHappenCount: i, alarmNearTime: '2018-12-12', extras: '告警', status: '未处理'});
    }
    this.correlationData = data;
  }
  /**
   * 初始化列表配置
   */
  private initTableConfig() {
    this.alarmTableConfig = {
      isDraggable: false,
      isLoading: false,
      showPagination: false,
      bordered: false,
      showSearch: false,
      scroll: {x: '512px', y: '600px'},
      columnConfig: [
        {title: this.language.alarmName, key: 'alarmName', isShowSort: false},
        {
          title: this.language.alarmFixedLevel, key: 'alarmFixedLevel', isShowSort: false
        },
        {
          title: this.language.alarmHappenCount, key: 'alarmHappenCount', isShowSort: false, pipe: 'date'
        },
        {
          title: this.language.alarmNearTime, key: 'alarmNearTime', isShowSort: false
        },
        {
          title: this.language.extras, key: 'extras', isShowSort: false
        },
        {
          title: this.language.status, key: 'status', isShowSort: false
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
   * 翻页处理
   * param event
   */
  alarmPageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
  }

}
