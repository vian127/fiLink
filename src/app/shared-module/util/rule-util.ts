import {NzI18nService} from 'ng-zorro-antd';
import {Injectable} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';
import {CommonLanguageInterface} from '../../../assets/i18n/common/common.language.interface';
import {FiLinkModalService} from '../service/filink-modal/filink-modal.service';
import {debounceTime, distinctUntilChanged, first, mergeMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {FacilityLanguageInterface} from '../../../assets/i18n/facility/facility.language.interface';
import {InspectionLanguageInterface} from '../../../assets/i18n/inspection-task/inspection.language.interface';

/**
 * 表单规则服务类
 */
@Injectable()
export class RuleUtil {
  language: CommonLanguageInterface;
  facilityLanguage: FacilityLanguageInterface;
  inspectionLanguage: InspectionLanguageInterface; // 国际化

  constructor(private $i18n: NzI18nService,
              private $message: FiLinkModalService) {
    this.language = this.$i18n.getLocaleData('common');
    this.facilityLanguage = this.$i18n.getLocaleData('facility');
    this.inspectionLanguage = this.$i18n.getLocaleData('inspection');
  }

  static getNameMinLengthRule() {
    return {minLength: 1};
  }

  static getNameMaxLengthRule() {
    return {maxLength: 32};
  }

  static getNamePatternRule(msg = null) {
    if (msg) {
      return {pattern: '^(?!_)[a-zA-Z0-9_\u4e00-\u9fa5]+$', msg};
    } else {
      return {pattern: '^(?!_)[a-zA-Z0-9_\u4e00-\u9fa5]+$'};
    }
  }


  /**
   * 获取名称检验规则
   * returns {{pattern: string; msg: any}}
   */
  getNameRule() {
    return {
      pattern: '^[\\s\\da-zA-Z\u4e00-\u9fa5`\\-=\\[\\]\\\\;\',./~!@#$%^&*\\(\\)_+{}|:"<>?·【】、；\'、‘’，。、！￥……（）——+｛｝：“”《》？]+$',
      msg: this.language.nameRuleMsg
    };
  }

  /**
   * 获取巡检周期检验规则  必须是整数 单位为月 1-36
   * returns {{pattern: string; msg: any}}
   */
  getTaskPeriodRule() {
    return {
      pattern: '^([1-2][0-9]|[1-3][0-6]|[1-9])$',
      msg: this.inspectionLanguage.inRangeDigitalPromptTip
    };
  }

  /**
   * 获取巡检工单期望用时检验规则  单位为天 1-365天
   * returns {{pattern: string; msg: any}}
   */
  getProcPlanDateRule() {
    return {
      pattern: '^([1-9]|[1-9][0-9]|[1-3][0-5][0-9]|[1-3][0-6][0-5])$',
      msg: this.inspectionLanguage.numberOfDaysTip
    };
  }

  /**
   * 新增光缆纤芯数校验规则 不大于1152
   * returns {{pattern: string; msg: any}}
   */
  getCoreNumRule() {
    return {
      pattern: '^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1][0-1][0-4][0-9]|1150|1151|1152)$',
      msg: this.facilityLanguage.pleaseEnterAnIntegerLessThan1152
    };
  }

  /**
   * 获取名称自定义校验规则
   * returns {{code: string; msg: any; validator: (control: AbstractControl) => {[p: string]: boolean}}}
   */
  getNameCustomRule() {
    return {
      code: 'notEmpty', msg: this.language.notEmpty, validator: (control: AbstractControl): { [key: string]: boolean } => {
        if (/^\s+$/.test(control.value)) {
          return {notEmpty: true};
        } else {
          return null;
        }
      }
    };
  }

  /**
   * 获取名称异步校验规则
   * param {() => Observable<Object>} httpMethod 请求函数
   * param {(res) => boolean} nameNotExist 验证名称是否存在 不存在返回true
   * returns {{asyncRule: (control: FormControl) => Observable<any>; asyncCode: string; msg: string}}
   */
  getNameAsyncRule(httpMethod: (value) => Observable<Object>, nameNotExist: (res) => boolean, msg = null) {
    return {
      asyncRule: (control: FormControl) => {
        if (control.value) {
          return control.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(1000),
            mergeMap(() => httpMethod(control.value)),
            mergeMap(res => {
              if (nameNotExist(res)) {
                return of(null);
              } else {
                return of({error: true, duplicated: true});
              }
            }),
            first()
          );
        } else {
          return of(null);
        }
      },
      asyncCode: 'duplicated', msg: msg || this.language.nameExists
    };
  }

  /**
   * 备注类最大长度
   * returns {{maxLength: number}}
   */
  getRemarkMaxLengthRule() {
    return {maxLength: 255};
  }

  /**
   * 获取数字检验规则
   */
  getNumberRule(param) {
    if (param === '1') {
      return {
        code: 'num',
        msg: this.language.leastOneNumber,
        validator: (control: AbstractControl): { [key: string]: boolean } => {
          if (!/^.*(?=.*\d).*$/.test(control.value)) {
            return {num: true};
          } else {
            return null;
          }
        }
      };
    } else {
      return {
        code: 'num',
        msg: '',
        validator: (control: AbstractControl): { [key: string]: boolean } => {
          return null;
        }
      };
    }
  }

  /**
   * 获取小写字母检验规则
   */
  getLowerCaseRule(param) {
    if (param === '1') {
      return {
        code: 'lowercase',
        msg: this.language.leastOneLowerCase,
        validator: (control: AbstractControl): { [key: string]: boolean } => {
          if (!/^.*(?=.*[a-z]).*$/.test(control.value)) {
            return {lowercase: true};
          } else {
            return null;
          }
        }
      };
    } else {
      return {
        code: 'lowercase',
        msg: '',
        validator: (control: AbstractControl): { [key: string]: boolean } => {
          return null;
        }
      };
    }
  }


  /**
   * 获取大写字母检验规则
   */
  getUpperCaseRule(param) {
    if (param === '1') {
      return {
        code: 'uppercase',
        msg: this.language.leastOneCapitalCase,
        validator: (control: AbstractControl): { [key: string]: boolean } => {
          if (!/^.*(?=.*[A-Z]).*$/.test(control.value)) {
            return {uppercase: true};
          } else {
            return null;
          }
        }
      };
    } else {
      return {
        code: 'uppercase',
        msg: '',
        validator: (control: AbstractControl): { [key: string]: boolean } => {
          return null;
        }
      };
    }
  }

  /**
   * 获取特殊字符检验规则
   */
  getSpecialCharacterRule(param) {
    if (param === '1') {
      return {
        code: 'Character',
        msg: this.language.leastSpString,
        validator: (control: AbstractControl): { [key: string]: boolean } => {
          if (!/^.*(?=.*[!@#$%.\-_&*<>?\(\)\[\]{}\\|;:]).*$/.test(control.value)) {
            return {Character: true};
          } else {
            return null;
          }
        }
      };
    } else {
      return {
        code: 'Character',
        msg: '',
        validator: (control: AbstractControl): { [key: string]: boolean } => {
          return null;
        }
      };
    }
  }

  /**
   * 获取邮箱检验规则
   */
  getMailRule() {
    return {
      pattern: '^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\\.[a-zA-Z0-9_-]+)+$',
      msg: this.language.mailError
    };
  }

  /**
   * 获取转储条数效验规则
   */
  getDumpNumRule(param) {
    if (param === '1') {
      return {
        code: 'dumpQuantityThreshold',
        msg: this.language.dumpQuantityThreshold,
        validator: (control: AbstractControl): { [key: string]: boolean } => {
          if (!/^([1-9]\d{4,5}|[1][0]{6})$/.test(control.value)) {
            return {dumpQuantityThreshold: true};
          } else {
            return null;
          }
        }
      };
    } else {
      return {
        code: 'turnOutNumber',
        msg: this.language.turnOutNumber,
        validator: (control: AbstractControl): { [key: string]: boolean } => {
          if (!/^([1-9]\d{4,5}|[1][0]{6})$/.test(control.value)) {
            return {turnOutNumber: true};
          } else {
            return null;
          }
        }
      };
    }
  }

  /**
   * 获取转储时间间隔效验规则
   */
  getDumpMonthRule() {
    return {
      code: 'dumpInterval',
      msg: this.language.dumpInterval,
      validator: (control: AbstractControl): { [key: string]: boolean } => {
        if (!/^([1-9]|[1][0-9]|[2][0-4])$/.test(control.value)) {
          return {dumpInterval: true};
        } else {
          return null;
        }
      }
    };
  }

  /**
   * 最大纤芯数规则
   * returns {{pattern: RegExp; msg: string}}
   */
  getMaxFiberNumRule() {
    return {pattern: /^(([1-9]\d{0,2})|([1-2]\d{3})|(3[0-3]\d{2})|(34[0-4]\d)|(345[0-6]))$/, msg: this.language.getNumRule};
  }

  /**
   * 编码生成规则必须包含字母和数字
   */
  getCode() {
    return {
      pattern: /^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]/,
      msg: this.language.codeError
    };
  }
}
