/**
 * Created by xiaoconghu on 2018/11/19.
 */
import {AsyncValidatorFn, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {FormItem, Rule} from './form-config';
import {FormOperateInterface} from './form-opearate.interface';

/**
 * 表单操作实现类
 */
export class FormOperate implements FormOperateInterface {

  group: FormGroup;
  column;
  language;

  constructor(group, column, language) {
    this.group = group;
    this.column = column;
    this.language = language;
  }

  createColumn() {

  }

  addColumn(formItem: FormItem, _index?: number) {
    const index = this.getColumn(formItem.key).index;
    if (index === -1) {
      const validator = this.addRule(formItem.rule);
      const asyncValidator = this.addAsyncRule(formItem.asyncRules);
      const formControl = new FormControl(formItem.initialValue || '', validator, asyncValidator);
      this.group.registerControl(formItem.key, formControl);
      if (_index && _index !== 0) {
        this.column.splice(_index, 0, formItem);
      } else {
        this.column.push(formItem);
      }

    } else {

    }

  }

  deleteColumn(key): void {
    const index = this.getColumn(key).index;
    if (index !== -1) {
      this.column.splice(index, 1);
      this.group.removeControl(key);
    } else {

    }

  }

  getColumn(key): { index: number, item?: FormItem } {
    const index = this.column.findIndex(item => item.key === key);
    if (index !== -1) {
      return {index: index, item: this.column[index]};

    } else {
      return {index: index};
    }
  }

  addValidRule(formItem: FormItem): void {
    const validator = this.addRule(formItem.rule);
    this.group.controls[formItem.key].setValidators(validator);
  }

  deleteValidRule(formItem: FormItem): void {
    this.group.controls[formItem.key].clearValidators();
    this.deleteRule(formItem.rule);
  }

  addRule(rule: Rule[], customRules?: any[]): ValidatorFn[] {
    const validator = [];
    // angular 内建检验规则
    if (rule) {
      rule.forEach(item => {
        if (item.hasOwnProperty('required')) {
          validator.push(Validators.required);
          item.msg = item.msg || this.language.requiredMsg;
          item.code = 'required';
        }
        if (item.hasOwnProperty('minLength')) {
          validator.push(Validators.minLength(item.minLength));
          item.msg = item.msg || `${this.language.minLengthMsg}${item.minLength}${this.language.count}`;
          item.code = 'minlength';
        }
        if (item.hasOwnProperty('maxLength')) {
          validator.push(Validators.maxLength(item.maxLength));
          item.msg = item.msg || `${this.language.maxLengthMsg}${item.maxLength}${this.language.count}`;
          item.code = 'maxlength';
        }
        if (item.hasOwnProperty('min')) {
          item.code = 'min';
          item.msg = item.msg || `${this.language.minMsg}${item.min}${this.language.exclamation}`;
          validator.push(Validators.min(item.min));
        }
        if (item.hasOwnProperty('max')) {
          item.code = 'max';
          item.msg = item.msg || `${this.language.maxMsg}${item.max}${this.language.exclamation}`;
          validator.push(Validators.max(item.max));
        }
        if (item.hasOwnProperty('email')) {
          item.code = 'email';
          item.msg = item.msg || this.language.emailMsg;
          validator.push(Validators.email);
        }
        if (item.hasOwnProperty('pattern')) {
          item.code = 'pattern';
          item.msg = item.msg || this.language.patternMsg;
          validator.push(Validators.pattern(new RegExp(item.pattern)));
        }
      });
    }
    // 添加自定义校验规则
    if (customRules && customRules.length > 0) {
      customRules.forEach(_item => {
        validator.push(_item.validator);
      });
    }

    return validator;
  }


  addAsyncRule(rules: { asyncRule: AsyncValidatorFn, asyncCode: any }[]): AsyncValidatorFn[] {
    const control = [];
    if (rules) {
      rules.forEach((rule) => {
        control.push(rule.asyncRule);
      });
    }
    return control;
  }

  deleteRule(rule: Rule[]): void {
    rule = [];
  }

  resetData(value?: any, options?: { onlySelf?: boolean; emitEvent?: boolean; }): void {
    this.group.reset(value, options);
  }

  resetControlData(key: string, value?: any, options?: object): void {
    this.group.controls[key].reset(value, options);
  }

  getData(key?: string): any {
    if (key) {
      return this.group.controls[key].value;
    } else {
      return this.group.value;
    }
  }

  getValid(key?: string): boolean {
    if (key) {
      return this.group.controls[key].valid;
    } else {
      return this.group.valid;
    }
  }
}
