import {Component, OnInit, ViewChild} from '@angular/core';
import {SystemParameterService} from '../../core-module/api-service/system-setting/stystem-parameter/system-parameter.service';
import {Result} from '../../shared-module/entity/result';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../shared-module/service/filink-modal/filink-modal.service';
import {LoginService} from '../../core-module/api-service/login';
import {CommonUtil} from '../../shared-module/util/common-util';

/**
 * 首页登录组件
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // 是否是用户登入  切换登入方式
  autoLoginType = true;
  // 手机登录标题提示
  loginTitle: string;
  // 新增弹出框显示隐藏
  isVisible = false;
  // 国际化
  language: any = {};
  title: string;
  // 文件名称
  fileName: '';
  // 上传的文件
  file: any;
  // 弹出框底部
  @ViewChild('tplFooter') public tplFooter;
  // xml文件校验
  limit = {
    nameLength: 32,
    size: 1048576,
    nameI18n: '',
    sizeI18n: ''
  };
  // 隐藏按钮
  showBtn = false;
  // 登入提交加载
  submitLoading = false;

  constructor(
    private $systemParameterService: SystemParameterService,
    public $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $loginService: LoginService) {
    this.language = $nzI18n.getLocale();
  }

  ngOnInit(): void {
    this.title  = this.language.agreement.uploadCertificate;
    this.loginTitle = this.language.agreement.mobilePhoneLoginHere;
    this.limit = {
      nameLength: 32,
      size: 1048576,
      nameI18n: this.language.agreement.fileNameLengthCannotBeGreaterThan32Bits,
      sizeI18n: this.language.agreement.fileSizeIsLessThan1M,
    };
    this.$systemParameterService.selectDisplaySettingsParamForPageCollection().subscribe((result: Result) => {
      if (result.code === 0) {
        // 移除语言设置
        localStorage.removeItem('localLanguage');
        // 前端切换中英文
        if (result.data.displaySettings.systemLanguage === 'US') {
          this.$nzI18n.setLocale(CommonUtil.toggleNZi18n('en_US').language);
          this.$nzI18n.setDateLocale(CommonUtil.toggleNZi18n('en_US').dateLanguage);
        } else {
          this.$nzI18n.setLocale(CommonUtil.toggleNZi18n('zh_CN').language);
          this.$nzI18n.setDateLocale(CommonUtil.toggleNZi18n('zh_CN').dateLanguage);
        }
        localStorage.setItem('localLanguage', JSON.stringify(result.data.displaySettings.systemLanguage));
        // 显示设置配置
        localStorage.setItem('displaySettings', JSON.stringify(result.data.displaySettings));
        // 消息提示设置
        localStorage.setItem('messageNotification', JSON.stringify(result.data.messageNotification));
      }
    });
    this.validateLicense();
    this.validateBrowserType();
  }

  /**
   * licenes验证
   */
  validateLicense() {
    this.$loginService.validateLicense().subscribe((result: Result) => {
      if (result.code === 0) {
        if (result.data.licenseStatus === true) {
          this.showBtn = false;
        } else {
          this.showBtn = true;
          this.$message.warning(`${this.language.agreement.theLicenesFileHasExpired}`);
        }
      } else {
        this.$message.error(result.msg);
        this.showBtn = true;
      }
    });
  }

  /**
   * 浏览器版本的验证
   * 支持浏览器版本如下：
   * Chrome：60.x 及以上
   * Firefox：64及以上
   * Safari：11.0及以上
   */
  validateBrowserType() {
    const info = this.getExplorerInfo();
    if (info.type === 'Firefox' && parseFloat(info.version) < parseFloat(info.lowVersion)) {
      this.tipBrowserLow(info);
    } else if (info.type === 'Chrome' && parseFloat(info.version) < parseFloat(info.lowVersion)) {
      this.tipBrowserLow(info);
    } else if (info.type === 'Safari' && parseFloat(info.version) < parseFloat(info.lowVersion)) {
      this.tipBrowserLow(info);
    } else if (info.type !== 'Safari' && info.type !== 'Chrome' && info.type !== 'Firefox') {
      this.$message.warning(this.language.agreement.ErrorExplorerInfo);
    }
  }

  /**
   * 浏览器版本低的提示框
   */
  tipBrowserLow(info) {
    const tip = this.language.agreement;
    this.$message.warning(`${tip.current}${info.type}${tip.low}${info.lowVersion}${tip.version}`);
  }

  /**
   * 获取浏览器版本的验证
   */
  getExplorerInfo() {
    const explorer = window.navigator.userAgent.toLowerCase();
    if (explorer.indexOf('msie') >= 0) {
      const version = explorer.match(/msie ([\d.]+)/)[1];
      return { type: 'IE', version: version , lowVersion: ''};
    } else if (explorer.indexOf('firefox') >= 0) {
      const version = explorer.match(/firefox\/([\d.]+)/)[1];
      return { type: 'Firefox', version: version , lowVersion: '64'};
    } else if (explorer.indexOf('chrome') >= 0) {
      const version = explorer.match(/chrome\/([\d.]+)/)[1];
      return { type: 'Chrome', version: version , lowVersion: '60.x' };
    } else if (explorer.indexOf('safari') >= 0 && explorer.indexOf('chrome') < 0) {
      const version = explorer.match(/version\/([\d.]+)/)[1];
      return { type: 'Safari', version: version , lowVersion: '11.0'};
    }
  }
  /**
   * 提交License
   */
  submit() {
    const formData = new FormData();
    this.submitLoading = true;
    if (this.file) {
      formData.append('file', this.file);
      this.$loginService.uploadLicense(formData).subscribe((result: Result) => {
        if (result.code === 0) {
          this.validateLicense();
          this.submitLoading = false;
          this.modalCancel();
          this.showBtn = false;
        } else {
          this.$message.error(result.msg);
          this.submitLoading = false;
        }
      });
    } else {
      this.$message.warning(`${this.language.agreement.fileCannotBeEmpty}`);
      this.submitLoading = false;
    }

  }

  /**
   * 手机 用户登录切换标题提示
   */
  changeAutoLoginType() {
    this.autoLoginType = !this.autoLoginType;
    if (this.autoLoginType) {
      this.loginTitle = this.language.agreement.mobilePhoneLoginHere;
    } else {
      this.loginTitle = this.language.agreement.userLoginHere;
    }
  }

  /**
   * 显示隐藏弹出框
   */
  showModal() {
    this.isVisible = true;
  }

  /**
   * 隐藏弹出框
   */
  modalCancel() {
    this.isVisible = false;
    this.fileName = '';
    this.file = null;
    this.submitLoading = false;
  }

  /**
   * 文件上传
   */
  upload() {
    const fileNode = document.getElementById('file');
    fileNode.click();
  }

  /**
   * 文件变化
   */
  fileChange($event) {
    // 文件名效验
    const fileNode = document.getElementById('file');
    const fileName = fileNode['files'][0].name;
    const reg = /.xml$/;
    if (reg.test(fileName)) {
      this.file = fileNode['files'][0];
      if (this.file.name.length <= this.limit.nameLength) {
        if (this.file.size <= this.limit.size) {
          this.fileName = this.file.name;
          this.$message.info(this.language.agreement.uploadSuccess);
        } else {
          this.errorFile(this.limit.sizeI18n, $event);
        }
      } else {
        this.errorFile(this.limit.nameI18n, $event);
      }
    } else {
      this.$message.warning(this.language.agreement.currentlyOnlyXMLFormatFilesAreSupported + '!');
    }
  }

  /**
   * 文件错误提示
   */
  errorFile(msg, event) {
    this.fileName = '';
    this.file = null;
    event.target.value = '';
    this.$message.warning(msg + '!');
  }
}
