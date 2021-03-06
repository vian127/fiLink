import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FilterCondition} from '../../../entity/queryCondition';


/**
 * 搜索组件
 */
@Component({
  selector: 'xc-table-search',
  templateUrl: './table-search.component.html',
  styleUrls: ['./table-search.component.scss']
})
export class TableSearchComponent implements OnInit {
  // 当前列的config
  @Input()
  config;
  // 查询条件
  @Input()
  queryTerm: Map<string, FilterCondition> = new Map<string, FilterCondition>();
  // 日期搜索
  @Input()
  searchDate = {};
  // 范围日期搜索
  @Input()
  rangDateValue = {};
  // 语言包
  @Input()
  language;
  // 搜索事件
  @Output() searchEvent = new EventEmitter();
  // 重置事件
  @Output() resetEvent = new EventEmitter();
  // 双日期查询值变化
  @Output() rangValueChange = new EventEmitter();
  // 双日期展开
  @Output() onOpenChange = new EventEmitter();
  // 下拉选中变化事件
  @Output() selectChange = new EventEmitter();
  // 单日期查询值变化
  @Output() onChange = new EventEmitter();


  constructor() {
  }

  ngOnInit() {
  }


  handleRest() {
    this.resetEvent.emit();
  }

  handleSearch() {
    this.searchEvent.emit(this.queryTerm);
  }
}
