import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {NzI18nService} from 'ng-zorro-antd';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {Result} from '../../../../shared-module/entity/result';
import {MD5Service} from '../../../../shared-module/util/md5.service';
import {UserService} from '../../../../core-module/api-service/user/user-manage';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {Router} from '@angular/router';
import {SecurityPolicyService} from '../../../../core-module/api-service/system-setting/security-policy/security-policy.service';
import {UserLanguageInterface} from '../../../../../assets/i18n/user/user-language.interface';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  @Output() cancelEvent = new EventEmitter();
  @Input()
  passwordCheckObj = {
    minLength: 6,
    containLower: '1',
    containUpper: '1',
    containNumber: '1',
    containSpecialCharacter: '1'
  };
  formStatus: FormOperate;
  formColumn: FormItem[] = [];
  language: any; // 国际化
  userLanguage: UserLanguageInterface;
  indexLanguage: IndexLanguageInterface;
  isVisible: boolean;

  constructor(
    private $nzI18n: NzI18nService,
    private $MD5Service: MD5Service,
    private $userService: UserService,
    private $message: FiLinkModalService,
    private $router: Router,
    private $securityPolicyService: SecurityPolicyService,
    private $ruleUtil: RuleUtil
  ) {
    this.language = $nzI18n.getLocale();
    setTimeout(() => {
      this.isVisible = true;
    }, 0);
  }

  ngOnInit() {
    this.userLanguage = this.$nzI18n.getLocaleData('user');
    this.indexLanguage = this.$nzI18n.getLocaleData('index');
    this.initForm();
  }

  public initForm() {
    this.formColumn = [
      {
        label: this.userLanguage.password,
        key: 'password',
        width: 500,
        type: 'input',
        inputType: 'password',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        col: 20,
      },
      {
        label: this.userLanguage.newPassword,
        key: 'newPassword',
        type: 'input',
        width: 500,
        inputType: 'password',
        modelChange: () => {
          this.formStatus.group.controls['confirmNewPassword'].reset(null);
        },
        require: true,
        rule: [
          {required: true},
          {minLength: this.passwordCheckObj.minLength}
        ],
        asyncRules: [],
        customRules: [
          this.$ruleUtil.getNumberRule(this.passwordCheckObj.containNumber),
          this.$ruleUtil.getLowerCaseRule(this.passwordCheckObj.containLower),
          this.$ruleUtil.getUpperCaseRule(this.passwordCheckObj.containUpper),
          this.$ruleUtil.getSpecialCharacterRule(this.passwordCheckObj.containSpecialCharacter)
        ],
        col: 20
      },
      {
        label: this.userLanguage.confirmPassword,
        width: 500,
        require: true,
        key: 'confirmNewPassword',
        inputType: 'password',
        type: 'input',
        rule: [{required: true}],
        col: 20,
        asyncRules: [
          {
            asyncRule: (control: FormControl) => {
              return Observable.create(observer => {
                const data = this.formStatus.getData();
                if (control.value === data.newPassword) {
                  observer.next(null);
                  observer.complete();
                } else {
                  observer.next({error: true, duplicated: true});
                  observer.complete();
                }
              });
            },
            asyncCode: 'duplicated', msg: this.userLanguage.confirmPasswordAndNewPasswordAreInconsistent
          }
        ]
      },
    ];

  }

  /**
   * 通用表单方法
   * param event
   */
  formInstance(event) {
    this.formStatus = event.instance;
  }

  /**
   * 确定
   */
  handleOk() {
    const data = this.formStatus.getData();
    const sendData = {
      userId: SessionUtil.getUserId(),
      token: SessionUtil.getToken(),
      newPWD: data.newPassword,
      oldPWD: data.password,
      confirmPWD: data.confirmNewPassword
    };
    this.$userService.modifyPassword(sendData).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.info(result.msg);
        if (localStorage.getItem('userInfo')) {
          const userInfo = JSON.parse(localStorage.getItem('userInfo'));
          const data_ = {
            userid: userInfo.id,
            token: SessionUtil.getToken()
          };
          this.$userService.logout(data_).subscribe((res: Result) => {
          });
        }
        localStorage.clear();
        this.$router.navigate(['']).then();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 取消
   */
  handleCancel() {
    this.cancelEvent.emit();
  }

}
