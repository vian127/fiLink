import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {UserLanguageInterface} from '../../../../assets/i18n/user/user-language.interface';

@Component({
  selector: 'app-telephone-input',
  templateUrl: './telephone-input.component.html',
  styleUrls: ['./telephone-input.component.scss']
})
export class TelephoneInputComponent implements OnInit, AfterViewInit {
  @Input() countryCode = 'cn';
  @Output() phoneChange = new EventEmitter();
  @Output() telephoneInit = new EventEmitter();
  @Output() inputNumberChange = new EventEmitter();
  @Input() hint = '';
  @Input() shouldValid = false;
  telephoneCode = '+86';
  isValid: boolean = false;
  _phoneNum = '';
  userLanguage: UserLanguageInterface;

  get phoneNum() {
    return this._phoneNum;
  }

  set phoneNum(val) {
    this.isValid = this.isValidNumber();
    this._phoneNum = val;
    this.inputNumberChange.emit(this._phoneNum);
  }
  private telephone = null;
  constructor(public $nzI18n: NzI18nService) { }

  ngOnInit() {
    this.userLanguage = this.$nzI18n.getLocaleData('user');
    this.hint = this.userLanguage.phoneNumberTips;
  }

  ngAfterViewInit(): void {
    const input =  document.querySelector('#phone');
    this.telephone = window['intlTelInput'](input, {
      preferredCountries: ['cn'],
      utilsScript: 'intlTel-intlTel-utils.js',
    });
    input.addEventListener('countrychange', () => {
      this.telephoneCode = `+${this.telephone.getSelectedCountryData().dialCode}`;
    });
    this.telephone.setCountry(this.countryCode);
    this.telephoneInit.emit(this.telephone);
  }

  isValidNumber() {
    if (this.telephone) {
      this.phoneChange.emit(this.telephone.getSelectedCountryData());
      if (this.telephone.getNumber()) {
        return !this.telephone.isValidNumber();
      }
    } else {
      return false;
    }
  }
}
