import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';

@Component({
  selector: 'xc-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent implements OnInit {
  // 可配置列数组
  @Input()
  configurableColumn;
  // 表格配置
  @Input()
  tableConfig;
  // 所有的没选中
  @Input()
  allUnChecked: boolean;
  // 设置列显示隐藏
  @Input()
  setColumnVisible: boolean;
  // 打印显示隐藏
  @Input()
  printVisible: boolean;
  // 国际化
  language;
  // 下拉区域的占位符
  @Input()
  selectedPlaceHolder: string;
  // 下拉选项
  @Input()
  selectedOption: string;
  // 下拉选中值
  @Input()
  selectedValue;
  // 头部按钮处理事件回调
  @Output() topHandle = new EventEmitter();
  // 展开表格搜索
  @Output() openTableSearch = new EventEmitter();
  // 下拉改变事件
  @Output() dropDownChange = new EventEmitter();
  // 列表配置变化事件
  @Output() configurableColumnChange = new EventEmitter();
  // 保存列设置
  @Output() saveColumn = new EventEmitter();
  // 点击导出
  @Output() clickExport = new EventEmitter();
  // 点击打印
  @Output() printList = new EventEmitter();
  // 展开事件回调
  @Output() openChildren = new EventEmitter();

  constructor(public i18n: NzI18nService) {
  }

  ngOnInit() {
    this.language = this.i18n.getLocale();
  }

}
