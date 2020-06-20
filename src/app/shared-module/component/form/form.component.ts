import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FormItem} from './form-config';
import {FormOperate} from './form-opearte.service';
import {NzI18nService} from 'ng-zorro-antd';

const FORM = 'form';

/**
 * 表单组件
 */
@Component({
  selector: 'xc-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnChanges, AfterViewInit {

  // 表单配置
  @Input()
  column;
  // formGroup
  formGroup = new FormGroup({});
  // 是否禁用
  @Input()
  isDisabled: boolean;
  // 表单实例
  @Output()
  formInstance = new EventEmitter();
  // 表单操作实例
  formOperate: FormOperate;
  // 表单语言包
  language: any;

  constructor(private $i18n: NzI18nService) {
    this.language = this.$i18n.getLocaleData(FORM);

  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.column) {
      this.initForm();
    }
  }

  ngAfterViewInit(): void {
  }

  /**
   * 表单值变化
   * param controls
   * param $event
   * param col
   */
  modelChange(controls, $event, col) {
    if (col.inputType === 'password') {
      const node = document.getElementById(col.key);
      node.setAttribute('type', 'password');
    }
    if (col.modelChange) {
      col.modelChange(controls, $event, col.key, this.formOperate);
    }
  }

  /**
   * 展开回调
   * param controls
   * param $event
   * param col
   */
  openChange(controls, $event, col) {
    if (col.openChange) {
      col.openChange(controls, $event, col.key, this.column);
    }

  }

  /**
   * 初始化表单配置
   */
  private initForm() {
    this.formGroup = new FormGroup({});
    this.formOperate = new FormOperate(this.formGroup, this.column, this.language);
    this.column.forEach((item: FormItem) => {
      const value = item.initialValue || null;
      const formControl = new FormControl({value: value, disabled: this.isDisabled || item.disabled},
        this.formOperate.addRule(item.rule, item.customRules),
        this.formOperate.addAsyncRule(item.asyncRules));
      this.formGroup.addControl(item.key, formControl);
    });
    this.formInstance.emit({instance: this.formOperate});
  }
}
