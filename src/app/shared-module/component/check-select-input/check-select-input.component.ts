import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../assets/i18n/facility/facility.language.interface';

@Component({
  selector: 'check-select-input',
  templateUrl: './check-select-input.component.html',
  styleUrls: ['./check-select-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckSelectInputComponent),
      multi: true
    }
  ]
})
export class CheckSelectInputComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder: string;
  @Input() isAllChecked: boolean = false;
  @Input() checkList: Array<Option>;
  isCollapsed = true;
  checkedList: Array<Option> = [];
  _checkedStr = '';
  checkAllStatus = false;
  allDisable = false;
  isShowClear = true;
  // 国际化
  public language: FacilityLanguageInterface;
  onModelChange: Function = () => {
  };

  constructor(public $nzI18n: NzI18nService) {
    this.language = $nzI18n.getLocaleData('facility');
  }

  ngOnInit() {
    this.placeholder = this.placeholder || this.language.picInfo.facilityType;
    this.checkedList = [{
      label: this.language.opticalBox,
      value: '001',
    }, {
      label: this.language.Well,
      value: '030',
    }, {
      label: this.language.Distribution_Frame,
      value: '060',
    }, {
      label: this.language.junctionBox,
      value: '090',
    },
      {
        label: this.language.OUTDOOR_CABINET,
        value: '210',
      }];
  }

  get checkedStr(): any {
    return this._checkedStr;
  }

  set checkedStr(v: any) {
    this._checkedStr = v;
    this.onModelChange(this.checkedList);
  }

  // 给自定义组件赋值时调用
  writeValue(value: Array<any>) {
    if (value) {
      this.checkedList = value;
      this.checkList.forEach(item => {
        (value.filter(el => el.label === item.label)).length > 0 ? item.checked = true : item.checked = false;
      });
      this.checkItem();
    } else {
      this.checkedList = [];
    }
  }

  // 勾选事件
  checkItem(obj?: Option) {
    if (obj) {
      this.checkedList = this.checkList.map(item => {
        if (item.value === obj.value) {
          item.checked = !obj.checked;
        }
        return item;
      });
    }
    if (this.isAllChecked) {
      if (this.checkList.filter(item => !item.isDisable).length !== 0) {
        this.checkAllStatus = this.checkList.filter(item => !item.isDisable).every(item => item.checked);
      }
    } else {
      this.checkAllStatus = false;
    }
    this.checkedList = this.checkList.filter(item => item.checked);
    const arr = this.checkedList.map(item => item.label);
    this.checkedStr = arr.join('，');
  }

  allChecked(event) {

    this.checkList.filter(item => !item.isDisable).forEach(item => {
      item.checked = event;
    });

    this.checkedList = this.checkList.filter(item => item.checked);
    const arr = this.checkedList.map(item => item.label);
    this.checkedStr = arr.join('，');
  }

  registerOnChange(fn: any) {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any) {
  }

  clearData() {
    this.checkedStr = '';
    this.checkAllStatus = false;
    if (this.checkList.length > 0) {
      this.checkList.map(item => item.checked = false);
    }
    this.checkedList = [];
    this.onModelChange(this.checkedList);
  }

}

export interface Option {
  label: string;
  value: any;
  checked?: boolean;
  isDisable?: boolean;
}
