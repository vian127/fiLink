import {
  AfterViewInit,
  Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild,
} from '@angular/core';
import {FormLanguageInterface} from '../../../../assets/i18n/form/form.language.interface';
import {NzAutocompleteComponent, NzI18nService} from 'ng-zorro-antd';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/internal/operators';

/**
 * 搜索输入框组件
 */
@Component({
  selector: 'xc-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit, OnChanges, AfterViewInit {
  // 表单语言包
  public language: FormLanguageInterface;
  // 搜索值
  @Input()
  searchValue;
  // input样式
  @Input()
  inputStyle;
  // 每一项的样式
  @Input()
  itemStyle;
  // 搜索值变化
  @Output()
  searchValueChange = new EventEmitter<any>();
  // 搜索信息配置
  @Input()
  selectInfo = {
    data: [],
    label: 'name',
    value: 'id'
  };
  // 选中值变化
  @Output()
  modelChange = new EventEmitter<any>();
  // 输入框值变化
  @Output()
  inputChange = new EventEmitter<any>();
  // input元素
  @ViewChild('searchInput') searchInput: ElementRef;
  // 结果模板
  @ViewChild('resultTemp') resultTemp: TemplateRef<any>;
  // 自动完成组件实例
  @ViewChild('auto') auto: NzAutocompleteComponent;
  // 当前索引
  currentIndex;

  constructor(private $i18n: NzI18nService) {
  }

  ngOnInit() {
    this.language = this.$i18n.getLocaleData('form');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.searchValue === null) {
      this.selectInfo.data = [];
    }
  }


  ngAfterViewInit(): void {
    const typeAhead = fromEvent(this.searchInput.nativeElement, 'input').pipe(
      map((e: KeyboardEvent) => e.target['value']),
      debounceTime(500),
      distinctUntilChanged()
    );

    typeAhead.subscribe(data => {
      this.inputChange.emit(data);
    });
  }

  optionChange(event, value) {
    this.modelChange.emit(value);
  }

  handleKeyDown(event) {
    if (event.code === 'Enter') {
      const index = this.auto.getOptionIndex(this.auto.activeItem);
      if (index !== undefined) {
        this.modelChange.emit(this.searchValue);
      }
    }

  }
}
