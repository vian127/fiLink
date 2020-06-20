import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Result} from '../../../shared-module/entity/result';
import {CookieService} from 'ngx-cookie-service';
import {LoginService} from '../../../core-module/api-service/login';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {MD5Service} from '../../../shared-module/util/md5.service';
import {CodeValidator} from 'code-validator';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {NzI18nService} from 'ng-zorro-antd';
import {SessionUtil} from '../../../shared-module/util/session-util';
import CryptoJS from 'crypto-js';

/**
 * 用户登录组件
 */
@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit, AfterViewInit, OnDestroy {
  // 安全路径
  base64: SafeUrl;
  // 验证码
  value: string;
  // 验证码参数
  cv = new CodeValidator({
    width: 95,
    height: 35,
    length: 4
  });
  // 表单操作
  validateForm: FormGroup;
  // 路由跳转链接
  link = '/business/system/about';
  // 登入loading
  loginLoading = false;
  // 国际化
  language: any;
  // 用户定时监控
  loginTimer = null;


  constructor(private fb: FormBuilder,
              private $message: FiLinkModalService,
              private $cookieService: CookieService,
              private $loginService: LoginService,
              private $MD5Service: MD5Service,
              private $sanitizer: DomSanitizer,
              private $nzI18n: NzI18nService,
              private router: Router) {
    this.language = $nzI18n.getLocale();
    this.initFormData();
  }

  ngOnInit() {
    // 如果token存在  则直接进入首页
    if (SessionUtil.getToken()) {
      if (localStorage.getItem('menuList') && localStorage.getItem('menuList') !== 'undefined') {
        this.findLink(JSON.parse(localStorage.getItem('menuList')));
      }
      this.router.navigate([this.link]).then();
      return;
    } else {
      this.random();
    }
  }

  /**
   * 判断用户是否可以登录
   */
  ngAfterViewInit(): void {
    this.random();
    this.loginTimer = setInterval(() => {
      // 如果token存在  则直接进入首页
      if (SessionUtil.getToken()) {
        if (localStorage.getItem('menuList') && localStorage.getItem('menuList') !== 'undefined') {
          this.findLink(JSON.parse(localStorage.getItem('menuList')));
        }
        clearInterval(this.loginTimer);
        this.loginTimer = null;
        this.router.navigate([this.link]).then();
        return;
      }
    }, 1000);
  }

  /**
   * 切换验证码
   */
  random() {
    const res = this.cv.random();
    this.base64 = this.$sanitizer.bypassSecurityTrustUrl(res.base);
    this.value = res.value;
  }

  /**
   * 初始化表单数据
   */
  initFormData(userName?, password?) {
    if (userName || password) {
      // this.random();
    } else {
      userName = null;
      password = null;
      // 判断是否有记住密码
      if (this.$cookieService.get('filink-user') && this.$cookieService.get('filink-password')) {
        // 前端用户名解密 后续考虑抽成单独方法
        const userNameBytes = CryptoJS.AES.decrypt(this.$cookieService.get('filink-user'), 'filink-user');
        const passwordBytes = CryptoJS.AES.decrypt(this.$cookieService.get('filink-password'), 'filink-password');
        userName = userNameBytes.toString(CryptoJS.enc.Utf8);
        password = passwordBytes.toString(CryptoJS.enc.Utf8);
      }
    }
    this.validateForm = this.fb.group({
      userName: [userName, [Validators.required]],
      password: [password, [Validators.required]],
      authCode: ['', [Validators.required], this.createCodeAsyncRules()],
      remember: [true]
    });
  }

  /**
   * 失去焦点初始化  防止按钮被挤下去
   */
  initHint(type) {
    this.validateForm = this.fb.group({
      userName: [this.validateForm.getRawValue().userName, [Validators.required]],
      password: [this.validateForm.getRawValue().password, [Validators.required]],
      authCode: [this.validateForm.getRawValue().authCode, [Validators.required], this.createCodeAsyncRules()],
      remember: [this.validateForm.getRawValue().remember]
    });
    if (type === 'authCode') {
      this.validateForm.controls['authCode'].markAsDirty();
    }
  }

  /**
   * 登入提交
   */
  submit() {
    // 解决登入无client信息问题
    localStorage.removeItem('token');
    const loginDate = new FormData();
    loginDate.append('username', this.validateForm.getRawValue().userName);
    loginDate.append('password', this.validateForm.getRawValue().password);
    // 清理缓存
    localStorage.removeItem('userName');
    this.loginLoading = true;
    this.$loginService.login(loginDate).subscribe((result: Result) => {
      this.loginLoading = false;
      if (result.code === 0) {
        if (result.data.code === 0) {
          this.remember();
          SessionUtil.setToken(result.data.data.accessToken.value, result.data.data.loginInfo.expireTime);
          localStorage.setItem('userInfo', JSON.stringify(result.data.data.loginInfo));
          localStorage.setItem('menuList', JSON.stringify(result.data.data.showMenuTemplate.menuInfoTrees));
          this.findLink(result.data.data.showMenuTemplate.menuInfoTrees);
          this.router.navigate([this.link]).then();
        } else {
          this.initFormData(this.validateForm.getRawValue().userName, this.validateForm.getRawValue().password);
          this.random();
          if (result.data.code === 125040) {
            this.$message.error(this.language.common.loginErrorMsg);
          } else {
            this.$message.warning(result.data.msg);
          }
        }
      } else {
        this.initFormData(this.validateForm.getRawValue().userName, this.validateForm.getRawValue().password);
        this.$message.error(result.msg);
        this.random();
      }
    }, () => {
      this.loginLoading = false;
      this.random();
    });
  }

  /**
   * 判断是否记住密码
   */
  remember() {
    if (this.validateForm.getRawValue().remember) {
      const userName = this.validateForm.getRawValue().userName;
      const password = this.validateForm.getRawValue().password;
      this.$cookieService.set('filink-user', CryptoJS.AES.encrypt(userName, 'filink-user').toString());
      this.$cookieService.set('filink-password', CryptoJS.AES.encrypt(password, 'filink-password').toString());
    } else {
      this.$cookieService.delete('filink-user');
      this.$cookieService.delete('filink-password');
    }
  }
  /**
   * 寻找跳转链接
   */
  findLink(menuInfoTrees) {
    let noUpdate = true;
    const findUrl = (_menuInfoTrees) => {
      for (let i = 0; i < _menuInfoTrees.length; i++) {
        if (_menuInfoTrees[i].children && _menuInfoTrees[i].children.length > 0 && noUpdate) {
          findUrl(_menuInfoTrees[i].children);
        } else {
          if (noUpdate) {
            this.link = _menuInfoTrees[i].menuHref;
          }
          noUpdate = false;
          break;
        }
      }
    };
    findUrl(menuInfoTrees);
  }

  /**
   * 验证码异步效验
   */
  createCodeAsyncRules() {
    const asyncRules = [];
    asyncRules.push((control: FormControl) => {
      return Observable.create(observer => {
        if (control.value.toLocaleUpperCase() === this.value) {
          observer.next(null);
          observer.complete();
        } else {
          observer.next({error: true, duplicated: true});
          observer.complete();
        }
      });
    });
    return asyncRules;
  }

  /**
   * 组件销毁时清除定时器
   */
  ngOnDestroy() {
    clearInterval(this.loginTimer);
    this.loginTimer = null;
  }
}
