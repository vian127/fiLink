import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {BasicConfig} from '../../basic-config';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {ColumnConfigService} from '../column-config.service';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {Result} from '../../../shared-module/entity/result';
import {AgreementManageService} from '../../../core-module/api-service/system-setting/agreement-manage/agreement-manage.service';
import {SystemParameterService} from '../../../core-module/api-service/system-setting/stystem-parameter/system-parameter.service';
import {SystemParameterConfig} from '../enum/systemConfig';
import {DomSanitizer} from '@angular/platform-browser';
import {TelephoneInputComponent} from '../../../shared-module/component/telephone-input/telephone-input.component';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {IndexLanguageInterface} from '../../../../assets/i18n/index/index.language.interface';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';


@Component({
  selector: 'app-system-parameter',
  templateUrl: './system-parameter.component.html',
  styleUrls: ['./system-parameter.component.scss']
})
export class SystemParameterComponent extends BasicConfig implements OnInit {
  // 上传图片模板
  @ViewChild('logo') private logoTemplate: ElementRef;
  // 上传图片
  @ViewChild('uploadImg') uploadImg: any;
  // 电话号码模板
  @ViewChild('telephone') private telephoneTpl: TelephoneInputComponent;
  // 标题
  public pageTitle: string;
  // 参数设置类型
  public settingType = '';
  // 是否加载
  public  isLoading = false;
  // 新增弹出框显示隐藏
  public isVisible = true;
  // 接口路由参数
  public urlType = '';
  // 参数id
  public paramId = '';
  // 文件名称
  public fileName: '';
  // 初始化值
  public defaultValue = {
    systemLogo: '',
  };
  // 当前值
  public presentValue = {
    retentionTime: '',
    soundRemind: '',
    soundSelected: '',
    systemLogo: '',
    screenScroll: '',
    screenScrollTime: ''
  };
  // 接口返回imgsrc
  public src = null;
  // 本地img地址
  public  imgSrc = null;
  // 获取所有语言下拉
  public languageAll = [];
  // 获取电话号码实例
  public phone: any;
  // 提交短信测试
  public phoneError = false;
  // 权限码
  public code = '';
  // 系统logo
  public systemLogo = '';
  // 上传的文件
  public file: any;
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 是否切换语言包
  private isUpdateLanguage = false;


  constructor(public $nzI18n: NzI18nService,
              private $columnConfigService: ColumnConfigService,
              private $message: FiLinkModalService,
              private $activatedRoute: ActivatedRoute,
              private $agreementManageService: AgreementManageService,
              private el: ElementRef,
              private $systemParameterService: SystemParameterService,
              private sanitizer: DomSanitizer
  ) {
    super($nzI18n);
  }

  ngOnInit() {
    this.indexLanguage =  this.$nzI18n.getLocaleData('index');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.pageTitle = this.indexLanguage.displaySettings;
    this.queryLanguage();
  }

  /**
   * 处理不同参数设置的title以及表单配置
   * param type
   */
  dealTitle(type) {
    switch (type) {
      case 'show':
        this.settingType = 'show';
        this.urlType = SystemParameterConfig.SHOW;
        this.pageTitle = this.language.systemSetting.displaySettings;
        this.code = '04-5-1-1';
        // 初始化表单
        const initData = {
          logo: this.logoTemplate,
          modelChange: this.modelChange,
          languageAll: this.languageAll
        };
        this.formColumn = this.$columnConfigService.getShowSystemParameterFormConfig(initData);
        break;
      case 'msg':
        this.settingType = 'msg';
        this.urlType = SystemParameterConfig.MSG;
        this.code = '04-5-2-1';
        // 初始化表单
        const changeData = {
          modelChange: this.modelChange,
          play: this.el.nativeElement.querySelector('#music')
        };
        this.pageTitle = this.language.systemSetting.messageNotificationSettings;
        this.formColumn = this.$columnConfigService.getMsgSystemParameterFormConfig(changeData);
        break;
      case 'email':
        this.settingType = 'email';
        this.urlType = SystemParameterConfig.EMAIL;
        this.pageTitle = this.language.systemSetting.mailServerSettings;
        this.formColumn = this.$columnConfigService.getEmailSystemParameterFormConfig({});
        this.code = '04-5-3-1';
        break;
      case 'note':
        this.settingType = 'note';
        this.urlType = SystemParameterConfig.NOTE;
        this.code = '04-5-4-1';
        this.pageTitle = this.language.systemSetting.shortMessageServiceSettings;
        this.formColumn = this.$columnConfigService.getNoteSystemParameterFormConfig({});
        break;
      case 'push':
        this.settingType = 'push';
        this.urlType = SystemParameterConfig.PUSH;
        this.code = '04-5-5-1';
        this.pageTitle = this.language.systemSetting.pushServiceSettings;
        this.formColumn = this.$columnConfigService.getPushSystemParameterFormConfig({});
        break;
      case 'ftp':
        this.settingType = 'ftp';
        this.code = '04-5-6-1';
        this.urlType = SystemParameterConfig.FTP;
        this.pageTitle = this.language.systemSetting.ftpServiceSettings;
        this.formColumn = this.$columnConfigService.getFTPSystemParameterFormConfig({});
        break;
    }
    this.searchFromData();
  }

  /**
   * 翻译
   */
  queryLanguage() {
    this.$systemParameterService.queryLanguage().subscribe((result: Result) => {
      this.languageAll = result.data;
      this.languageAll.map(item => {
        item.label = item.languageName;
        item.value = item.languageType;
      });
      this.$activatedRoute.params.subscribe(params => {
        this.dealTitle(params['settingType']);
      });
    });
  }

  /**
   * 查询表单配置
   */
  searchFromData() {
    this.$agreementManageService.queryProtocol(this.urlType).subscribe((result: Result) => {
      if (result.code === 0) {
        this.paramId = result.data.paramId;
        this.defaultValue = JSON.parse(result.data.defaultValue);
        this.presentValue = JSON.parse(result.data.presentValue);
        if (this.urlType === SystemParameterConfig.SHOW) {
          if (this.presentValue.systemLogo === 'local') {
            this.src = '../../../assets/img/layout/FiLink_logo.png';
            this.systemLogo = 'local';
          } else {
            this.src = this.presentValue.systemLogo;
            this.systemLogo = this.src;
          }
        }
        this.formStatus.resetData(this.presentValue);
      }
    });
  }


  /**
   * 文件变化
   */
  fileChange($event: Event) {
    // 文件名效验
    const fileNode = document.getElementById('file');
    // 取消不进入
    if (fileNode['files'].length !== 0) {
      const fileName = fileNode['files'][0].name;
      const reg = /(.jpg|.png|.jpeg|.gig)$/i;
      if (reg.test(fileName)) {
        this.file = fileNode['files'][0];
        this.fileName = this.file.name;
        this.previewFile(this.file);
      } else {
        this.$message.warning(`${this.language.agreement.atPresentOnlyPictureFormatFilesAreSupported}`);
      }
      // 清空上一次的值
      this.uploadImg.nativeElement.value = '';
    }
  }

  /**
   * 文件大小尺寸校验
   */
  previewFile(file) {
    const vm = this;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const fileSize = file.size / 1024 / 1024;
    if (fileSize < 3) {
      reader.addEventListener('load', () => {
        const img = new Image();
        vm.imgSrc = reader.result;
        img.src = vm.imgSrc;
        img.onload = function () {
          if (img.width === 50 && img.height === 50) {
            vm.src = vm.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(vm.file));
            vm.$message.info(vm.language.agreement.uploadSuccess);
          } else {
            vm.$message.warning(`${vm.language.agreement.pictureSizeShouldNotBeGreaterThan}${'50*50'}`);
          }
        };
      }, false);
    } else {
      vm.$message.warning(`${vm.language.agreement.pictureSizeShouldNotBeGreaterThan3M}${'!'}`);
    }

  }

  /**
   * 文件上传
   */
  upload() {
    const fileNode = document.getElementById('file');
    fileNode.click();
  }

  /**
   * 确定
   */
  formHandleOk() {
    let arrData = {};
    switch (this.urlType) {
      case SystemParameterConfig.MSG:
        arrData = {
          messageNotification: this.formStatus.group.getRawValue(),
          paramId: this.paramId
        };
        this.submitSystem(this.urlType, arrData);
        break;
      case SystemParameterConfig.EMAIL:
        arrData = {
          paramId: this.paramId,
          aliAccessKey: this.formStatus.group.getRawValue()
        };
        this.submitSystem(this.urlType, arrData);
        break;
      case SystemParameterConfig.NOTE:
        arrData = {
          paramId: this.paramId,
          aliAccessKey: this.formStatus.group.getRawValue()
        };
        this.submitSystem(this.urlType, arrData);
        break;
      case SystemParameterConfig.PUSH:
        arrData = {
          paramId: this.paramId,
          aliAccessKey: this.formStatus.group.getRawValue()
        };
        this.submitSystem(this.urlType, arrData);
        break;
      case SystemParameterConfig.SHOW:
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('paramId', this.paramId);
        formData.append('systemLogo', this.systemLogo);
        const from = this.formStatus.group.getRawValue();
        console.log(this.formStatus.getData());
        console.log(from);
        if (JSON.parse(localStorage.getItem('localLanguage')) !== from.systemLanguage) {
          // 前端切换中英文
          if (from.systemLanguage === 'US') {
            this.$nzI18n.setLocale(CommonUtil.toggleNZi18n('en_US').language);
          } else {
            this.$nzI18n.setLocale(CommonUtil.toggleNZi18n('zh_CN').language);
          }
          localStorage.setItem('localLanguage', JSON.stringify(from.systemLanguage));
          this.isUpdateLanguage = true;
        } else {
          this.isUpdateLanguage = false;
        }
        Object.keys(from).forEach((key) => {
          formData.append(key, from[key]);
        });
        this.submitSystem(this.urlType, formData);
        break;
      case SystemParameterConfig.FTP:
        this.isLoading = true;
        arrData = {
          paramId: this.paramId,
          ftpSettings: this.formStatus.getData()
        };
        this.submitSystem(this.urlType, arrData);
        break;
    }
  }

  /**
   * 测试eMail
   */
  formTestEMail() {
    console.log(this.formStatus.getData());
    this.$systemParameterService.testEmail(this.formStatus.getData()).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 实例化电话号码
   */
  telephoneInit(event) {
    this.phone = event;
  }

  /**
   * 监听电话输入框变化
   */
  phoneChange() {
    this.phoneError = this.phone.isValidNumber();
  }

  /**
   * 测试phone
   */
  formTestPhone() {
    console.log(this.phone.getNumber().substring(0, 3));
    if (this.phone.getNumber().substring(0, 3) === '+86') {
      const data = {
        accessKeyId: this.formStatus.getData().accessKeyId,
        accessKeySecret: this.formStatus.getData().accessKeySecret,
        phone: this.phone.getNumber().substring(3)
      };
      this.$systemParameterService.testPhone(data).subscribe((result: Result) => {
        if (result.code === 0) {
          this.$message.success(result.msg);
        } else {
          this.$message.error(result.msg);
        }
      });
    } else {
      this.$message.warning(`${this.language.systemSetting.testFailure}`);
    }
  }

  /**
   * 测试ftp
   */
  formTestFTP() {
    this.submitLoading = true;
    const data = {
      paramId: this.paramId,
      ftpSettings: this.formStatus.getData()
    };
    this.$systemParameterService.ftpSettingsTest(data).subscribe((result: Result) => {
      if (result.code === 0) {
        this.submitLoading = false;
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
        this.submitLoading = false;
      }
    }, () => {
      this.submitLoading = false;
    });

  }

  /**
   * 取消
   */
  formHandleCancel() {
    this.formStatus.resetData(this.presentValue);
    if (this.urlType === SystemParameterConfig.SHOW) {
      if (this.presentValue.systemLogo === 'local') {
        this.src = '../../../assets/img/layout/FiLink_logo.png';
        this.systemLogo = 'local';
      } else {
        this.src = this.presentValue.systemLogo;
        this.systemLogo = this.src;
      }
    }
    if (this.urlType === SystemParameterConfig.NOTE) {
      this.telephoneTpl.phoneNum = '';
      this.phoneError = false;
    }
  }

  /**
   * 恢复默认
   */
  formHandleReset() {
    setTimeout(() => {
      this.formStatus.resetData(this.defaultValue);
    }, 0);
    if (this.urlType === SystemParameterConfig.SHOW) {
      if (this.defaultValue.systemLogo === 'local') {
        this.src = '../../../assets/img/layout/FiLink_logo.png';
        this.systemLogo = 'local';
      } else {
        this.src = this.defaultValue.systemLogo;
        this.systemLogo = this.src;
      }

    }
    if (this.urlType === SystemParameterConfig.NOTE) {
      this.telephoneTpl.phoneNum = '';
      this.phoneError = false;
    }

  }

  /**
   * 提交数据
   */
  submitSystem(type, arrData) {
    this.$systemParameterService.updateSystem(type, arrData).subscribe((result: Result) => {
      if (result.code === 0) {
        this.submitLoading = false;
        // 提示弹框
        if (this.isUpdateLanguage) {
          window.location.reload();
        } else {
          this.$message.success(result.msg);
        }
        this.searchFromData();
      } else {
        this.isLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.isLoading = false;
      this.submitLoading = false;
    });
  }

  /**
   * 监听表单数据变化
   * param controls
   * param $event
   * param key
   */
  modelChange = (controls, $event, key) => {
    if (key === 'messageRemind') {
      if ($event === '1') {
        this.formStatus.group.controls['retentionTime'].enable();
        this.formStatus.group.controls['retentionTime'].setValue(this.presentValue.retentionTime);
        this.formStatus.group.controls['soundRemind'].enable();
        this.formStatus.group.controls['soundRemind'].setValue(this.presentValue.soundRemind);
        this.formStatus.group.controls['soundSelected'].enable();
        this.formStatus.group.controls['soundSelected'].setValue(this.presentValue.soundSelected);
      } else {
        this.formStatus.group.controls['retentionTime'].disable();
        this.formStatus.group.controls['soundRemind'].disable();
        this.formStatus.group.controls['soundSelected'].disable();
        this.formStatus.group.controls['soundRemind'].setValue('0');
      }
    }
    if (key === 'soundRemind') {
      if ($event === '1') {
        this.formStatus.group.controls['soundSelected'].enable();
        this.formStatus.group.controls['soundSelected'].setValue(this.presentValue.soundSelected);
      } else {
        this.formStatus.group.controls['soundSelected'].disable();
      }
    }
    if (key === 'screenDisplay') {
      if ($event === '1') {
        this.formStatus.group.controls['screenScroll'].enable();
        this.formStatus.group.controls['screenScroll'].setValue(this.presentValue.screenScroll);
        this.formStatus.group.controls['screenScrollTime'].enable();
        this.formStatus.group.controls['screenScrollTime'].setValue(this.presentValue.screenScrollTime);
      } else {
        this.formStatus.group.controls['screenScroll'].disable();
        this.formStatus.group.controls['screenScroll'].setValue('0');
        this.formStatus.group.controls['screenScrollTime'].disable();
      }
    }
    if (key === 'screenScroll') {
      if ($event === '1') {
        this.formStatus.group.controls['screenScrollTime'].enable();
        this.formStatus.group.controls['screenScrollTime'].setValue(this.presentValue.screenScrollTime);
      } else {
        this.formStatus.group.controls['screenScrollTime'].disable();
      }
    }
  }
}
