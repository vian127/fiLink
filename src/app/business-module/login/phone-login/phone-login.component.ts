import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Result} from '../../../shared-module/entity/result';
import {LoginService} from '../../../core-module/api-service/login';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {SessionUtil} from '../../../shared-module/util/session-util';

/**
 * 手机登录组件
 */
@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.scss']
})
export class PhoneLoginComponent implements OnInit, OnDestroy {
  // 验证码按钮禁用状态
  bol = true;
  // 手机号码
  telephone;
  // 表单操作
  validateForm: FormGroup;
  // 跳转路径
  link = '/business/system/about';
  // 登录是否禁用
  loginLoading = true;
  // 国际化
  language: any;
  // 登录状态loading
  isLoginLoading = false;
  // 发送验证码定时器Id
  saveCodeIntervalID;
  // 验证码
  VerificationCode;

  constructor(private fb: FormBuilder,
              private $loginService: LoginService,
              private $message: FiLinkModalService,
              private $router: Router,
              private $nzI18n: NzI18nService) {
    this.language = $nzI18n.getLocale();
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      authCode: [null, [Validators.required]],
    });
    this.VerificationCode = this.language.login.getVerificationCode;
  }

  /**
   * 组件销毁时清除定时器
   */
  ngOnDestroy() {
    clearInterval(this.saveCodeIntervalID);
  }

  /**
   * 获取验证码
   */
  getValidationCode() {
    const phone = {phoneNumber: this.telephone.getNumber().substring(3)};
    this.$loginService.getVerificationCode(phone).subscribe((result: Result) => {
      if (result.code === 0) {
        this.bol = true;
        let countDown = 120;
        this.VerificationCode = this.language.login.sending + countDown + this.language.login.seconds;
        this.saveCodeIntervalID = setInterval(() => {
          // 倒计时
          countDown -= 1;
          this.VerificationCode = this.language.login.sending + countDown + this.language.login.seconds;
          if (countDown === 0) {
            // 重新发送
            clearInterval(this.saveCodeIntervalID);
            this.VerificationCode = this.language.login.retryObtain;
            this.bol = false;
          }
        }, 1000);
      } else {
        this.bol = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.bol = false;
    });
  }

  /**
   * 监听表单变化改变按钮状态
   */
  getPhone() {
    if (this.telephone.isValidNumber()) {
      this.bol = false;
      this.loginLoading = false;
    } else {
      this.bol = true;
      this.loginLoading = true;
    }
  }

  /**
   * 获取手机号码
   */
  getPhoneInit(event) {
    this.telephone = event;
  }

  /**
   * 登录提交
   */
  submit() {
    const loginDate = new FormData();
    loginDate.append('smsCode', this.validateForm.getRawValue().authCode);
    loginDate.append('phoneNumber', this.telephone.getNumber().substring(3));
    // 清理缓存
    localStorage.removeItem('userName');
    this.isLoginLoading = true;
    this.$loginService.phoneLogin(loginDate).subscribe((result: Result) => {
      this.isLoginLoading = false;
      if (result.code === 0) {
        if (result.data.code === 0) {
          SessionUtil.setToken(result.data.data.accessToken.value, result.data.data.loginInfo.expireTime);
          localStorage.setItem('userInfo', JSON.stringify(result.data.data.loginInfo));
          localStorage.setItem('menuList', JSON.stringify(result.data.data.showMenuTemplate.menuInfoTrees));
          this.findLink(result.data.data.showMenuTemplate.menuInfoTrees);
          this.$router.navigate([this.link]).then();
        } else {
          if (result.data.code === 125040) {
            this.$message.error(this.language.common.loginErrorMsg);
          } else {
            this.$message.warning(result.data.msg);
          }
        }
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.isLoginLoading = false;
    });
  }

  /**
   * 寻找跳转链接
   */
  findLink(menuInfoTrees) {
    if (menuInfoTrees) {
      for (let i = 0; i < menuInfoTrees.length; i++) {
        if (menuInfoTrees[i].children && menuInfoTrees[i].children.length > 0) {
          this.findLink(menuInfoTrees[i].children);
        } else {
          this.link = menuInfoTrees[i].menuHref;
          break;
        }
      }
    }
  }
}
