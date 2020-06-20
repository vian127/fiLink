import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';

/**
 * 分页组件对于大数据分页的备用
 */
@Component({
  selector: 'xc-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
  // 总条数
  _xcTotal: number;
  // 当前页码
  _xcPageIndex: number;
  // 当前分页大小
  _xcPageSize: number;
  pages: number[] = [];
  // 分页options
  xcPageSizeOptions = [10, 20, 30, 40, 50];
  firstIndex = 1;
  @Input()
  xcLoading: boolean = false;
  @Input()
  xcShowSizeChanger = false;
  private language: any = {};

  get xcTotal(): number {
    return this._xcTotal;
  }

  @Input()
  set xcTotal(value: number) {
    this._xcTotal = value;
  }

  get xcPageIndex(): number {
    return this._xcPageIndex;
  }

  @Output()
  xcPageIndexChange = new EventEmitter();

  get xcPageSize(): number {
    return this._xcPageSize;
  }

  @Input()
  set xcPageSize(value: number) {
    if (this.xcPageIndex > this.lastIndex) {
      this.xcPageIndex = this.lastIndex;
      this.xcPageChange.emit({pageSize: this.xcPageSize, pageIndex: this.xcPageIndex});
    }
    this._xcPageSize = value;
    this.bingPageRange();

  }

  @Output()
  xcPageSizeChange = new EventEmitter();
  @Output()
  xcPageChange = new EventEmitter();
  @Input()
  jumpPageFive: boolean = false;
  @ViewChild('renderItemTemplate') private _xcItemRender: TemplateRef<{ $implicit: 'page' | 'prev' | 'next', page: number }>;
  @Input()
  get xcItemRender() {
    return this._xcItemRender;
  }

  set xcItemRender(value) {
    this._xcItemRender = value;
  }

  get lastIndex(): number {
    return Math.ceil(this.xcTotal / this.xcPageSize);
  }

  @Input()
  set xcPageIndex(value: number) {
    if (value < 1) {
      value = 1;
    }
    if (value > this.lastIndex) {
      value = this.lastIndex;
    }
    this._xcPageIndex = value;
    this.bingPageRange();

  }
  constructor(private i18n: NzI18nService) {
  }

  ngOnInit() {
    this.language = this.i18n.getLocaleData('Pagination');
  }

  /**
   * 绑定的页码
   */
  bingPageRange() {
    const temPages = [];
    const sum = 7;
    if (this.lastIndex < sum) {
      for (let i = 1; i <= this.lastIndex; i++) {
        temPages.push(i);
      }
    } else {
      const currentIndex = this.xcPageIndex;
      let left = Math.max(1, currentIndex - Math.floor(sum / 2));
      let right = Math.min(currentIndex + Math.floor(sum / 2), this.lastIndex);
      if (currentIndex - 1 <= Math.floor(sum / 2)) {
        right = sum;
      }
      if (this.lastIndex - currentIndex <= Math.floor(sum / 2)) {
        left = this.lastIndex - sum + 1;
      }
      for (let i = left; i <= right; i++) {
        temPages.push(i);
      }
    }
    this.pages = temPages;
  }

  /**
   * 上一页
   */
  previous() {
    if (this.xcPageIndex === 1) {
      return;
    }
    this.jump(this.xcPageIndex - 1);
  }

  /**
   * 下一页
   */
  next() {
    if (this.xcPageIndex === this.lastIndex) {
      return;
    }
    this.jump(this.xcPageIndex + 1);
  }

  /**
   * 向后跳5页
   * param index
   */
  pageFive(index) {
    this.jump(this.xcPageIndex + index);
  }

  /**
   * 跳向第几页
   * param currentIndex
   */
  jump(currentIndex) {
    if (this.xcLoading) {
      return;
    }
    this.xcLoading = true;
    this.xcPageIndex = currentIndex;
    this.xcPageIndexChange.emit(this.xcPageIndex);
    this.xcPageChange.emit({pageSize: this.xcPageSize, pageIndex: this.xcPageIndex});
  }

  /**
   * pageSize 变化
   * param evt
   */
  onPageSizeChange(evt) {
    if (this.xcLoading) {
      return;
    }
    this.xcLoading = true;
    this.xcPageSize = evt;
    this.xcPageSizeChange.emit(this.xcPageSize);
    if (this.xcPageIndex > this.lastIndex) {
      this.xcPageIndex = this.lastIndex;
      this.xcPageIndexChange.emit(this.xcPageIndex);
    }
    this.xcPageChange.emit({pageSize: this.xcPageSize, pageIndex: this.xcPageIndex});
  }

  /**
   * 输入值变化
   * param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.xcPageSize && changes.xcPageIndex || changes.xcTotal) {
      this.bingPageRange();
    }
  }
}
