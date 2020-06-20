import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {PageBean} from '../../entity/pageBean';
import {TableComponent} from '../table/table.component';

/**
 * 表格选择器组件
 */
@Component({
  selector: 'xc-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit, OnChanges {
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  @Output() pageChange = new EventEmitter();
  @Input()
  column: { title: string, sourceColumn: any[], selectedColumn: any[] };
  @Input()
  data = [];
  @Input()
  type = 'table';
  selectorConfig;
  sourceConfig;
  selectData = [];
  @Input()
  pageBean: PageBean = new PageBean(6, 1, 1);
  @ViewChild(TableComponent)
  childCmp: TableComponent;
  selectPageBean: PageBean = new PageBean(6, 1, 1);
  public selectPageData = [];
  @Output()
  selectDataChange = new EventEmitter();
  searchValue;
  @Output()
  searchChange = new EventEmitter();
  constructor() {
  }

  private _xcVisible;

  get xcVisible() {
    return this._xcVisible;
  }

  @Input()
  set xcVisible(params) {
    this._xcVisible = params;
    this.xcVisibleChange.emit(this._xcVisible);
  }

  ngOnInit() {
    this.initColumn();
  }

  handleCancel() {
    this.xcVisible = false;
  }

  handleOk() {
    this.selectDataChange.emit(this.selectData);
    this.handleCancel();
  }

  initColumn() {
    this.selectorConfig = {
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: false,
      searchTemplate: null,
      columnConfig: this.column.selectedColumn,
      showPagination: true,
      bordered: false,
      showSearch: false,
      showSizeChanger: false,
      operation: [
        {
          text: '删除',
          needConfirm: false,
          handle: (currentIndex) => {
            // 找到要删除的项目
            const index = this.selectData.findIndex(item => item.id === currentIndex.id);
            this.selectData.splice(index, 1);
            // 删除完刷新被选数据
            this.refreshSelectPageData();
            this.data.forEach(item => {
              if (item.id === currentIndex.id) {
                item.checked = false;
              }
            });
            // 子组件刷新全选和有选状态
            this.childCmp.checkStatus();
          }
        },
      ],
    };
    this.sourceConfig = {
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: false,
      searchTemplate: null,
      columnConfig: this.column.sourceColumn,
      showPagination: true,
      bordered: false,
      showSearch: false,
      showSizeChanger: false,
      scroll: {x: '300px'},
      handleSelect: (data) => {
        // 加入被选容器
        data.forEach(item => {
          const index = this.selectData.findIndex(_item => _item.id === item.id);
          if (index === -1) {
            this.selectData.push(item);
          }
        });
        // 记录多余的项目
        const extraIndex = [];
        this.selectData.forEach((item, index) => {
          if (this.data.findIndex(_item => _item.id === item.id) > -1) {
            if (data.findIndex(__item => __item.id === item.id) === -1) {
              extraIndex.push(index);
            }
          }
        });
        // 删除多余的项目
        for (let i = extraIndex.length - 1; i >= 0; i--) {
          this.selectData.splice(extraIndex[i], 1);
        }
        this.refreshSelectPageData();
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      /**
       * 左边为后端分页，同步数据状态
       */
      this.data.forEach(item => {
        item.checked = this.selectData.findIndex(_item => _item.id === item.id) !== -1;
      });
    }
  }

  /**
   * 右边的表格分页
   * param event
   */
  selectPageChange(event) {
    this.selectPageBean.pageIndex = event.pageIndex;
    this.selectPageBean.pageSize = event.pageSize;
    this.selectPageData = this.selectData.slice(this.selectPageBean.pageSize * (this.selectPageBean.pageIndex - 1),
      this.selectPageBean.pageIndex * this.selectPageBean.pageSize);
  }

  /**
   * 右边为前端分页
   * 需要刷新数据
   */
  refreshSelectPageData() {
    this.selectPageBean.Total = this.selectData.length;
    this.selectPageData = this.selectData.slice(this.selectPageBean.pageSize * (this.selectPageBean.pageIndex - 1),
      this.selectPageBean.pageIndex * this.selectPageBean.pageSize);
  }

  restSelectData() {
    this.selectData = [];
    this.data.forEach(item => {
        item.checked = false;
    });
    this.childCmp.checkStatus();
    this.refreshSelectPageData();
  }

  search() {
    this.searchChange.emit(this.searchValue);
  }
}
