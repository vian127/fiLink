import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicConfig} from '../../../basic-config';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {ColumnConfigService} from '../../column-config.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {AgreementManageService} from '../../../../core-module/api-service/system-setting/agreement-manage/agreement-manage.service';
import {Result} from '../../../../shared-module/entity/result';
import {SystemParameterConfig} from '../../enum/systemConfig';
/**
 * 服务配置
 */
@Component({
  selector: 'app-config-agreement',
  templateUrl: './config-agreement.component.html',
  styleUrls: ['./config-agreement.component.scss']
})
export class ConfigAgreementComponent extends BasicConfig implements OnInit {
  // 当前模板配置
  @ViewChild('certificateTmp') private certificateTemplate;
  // 标题
  public pageTitle = '';
  // 配置类型
  public  configType = '';
  // 协议值
  public protocolValue: any;
  // 默认协议值
  public protocolDefaultValue: any;
  // 证书信息
  public certificate = {
    fileName: '',
    fileUrl: ''
  };
  // 权限码
  public code = '';
  // 协议码
  public protocolId = '';
  // 上传的文件
  public file: any;
  // 上传文件名称
  public fileName = '';
  constructor(public $nzI18n: NzI18nService,
              private $columnConfigService: ColumnConfigService,
              private $agreementManageService: AgreementManageService,
              private $message: FiLinkModalService,
              private $activatedRoute: ActivatedRoute) {
    super($nzI18n);
  }

  ngOnInit() {
    this.$activatedRoute.params.subscribe(params => {
      if (this.formStatus) {
        this.formStatus.resetData({});
      }
      this.protocolValue = {};
      this.protocolDefaultValue = {};
      this.dealTitle(params['configType']);
    });
  }

  /**
   * 处理不同参数设置的title以及表单配置
   * param type
   */
  dealTitle(type) {
    switch (type) {
      case 'http-serve':
        this.configType = SystemParameterConfig.HTTPSERVE;
        this.code = '04-3-2-1';
        this.pageTitle = this.language.systemSetting.httpServiceConfig;
        this.formColumn = this.$columnConfigService.getHttpServeFormConfig({modelChange: this.modelChange});
        break;
      case 'http-client':
        this.configType = 'http-client';
        this.pageTitle = this.language.systemSetting.httpClientConfig;
        this.formColumn = this.$columnConfigService.getHttpClientFormConfig({});
        break;
      case 'https-serve':
        this.configType = SystemParameterConfig.HTTPSSERVE;
        this.code = '04-3-3-1';
        this.pageTitle = this.language.systemSetting.httpsServiceConfig;
        // 初始化表单
        const initData = {
          certificate: this.certificateTemplate,
          modelChange: this.modelChange
        };
        this.formColumn = this.$columnConfigService.getHttpsServeFormConfig(initData);
        break;
      case 'https-client':
        this.configType = 'https-client';
        this.pageTitle = this.language.systemSetting.httpsClientConfig;
        this.formColumn = this.$columnConfigService.getHttpsClientFormConfig({});
        break;
      case 'webservice-serve':
        this.configType = SystemParameterConfig.WEBSERVICESERVE;
        this.code = '04-3-4-1';
        this.pageTitle = this.language.systemSetting.webServiceServiceConfig;
        this.formColumn = this.$columnConfigService.getWebserviceServeFormConfig();
        break;
      case 'webservice-client':
        this.configType = 'webservice-client';
        this.pageTitle = this.language.systemSetting.webServiceClientConfig;
        this.formColumn = this.$columnConfigService.getWebserviceClientFormConfig({});
        break;
    }
    this.searchFromData();
  }

  /**
   * 查询表单配置
   */
  searchFromData() {
    this.$agreementManageService.queryProtocol(this.configType).subscribe((result: Result) => {
      if (result.code === 0) {
        this.protocolId = result.data.paramId;
        this.protocolValue = JSON.parse(result.data.presentValue);
        this.protocolDefaultValue = JSON.parse(result.data.defaultValue);
        this.certificate = this.protocolValue.certificateFile;
        if (this.certificate) {
          this.fileName = this.certificate.fileName;
        }
        this.formStatus.resetData(this.protocolValue);
      }
    });
  }

  /**
   * 确认
   */
  formHandleOk() {
    this.submitLoading = true;
    const data = new FormData();
    const formData = this.formStatus.group.getRawValue();
    data.append('paramId', this.protocolId);
    data.append('paramType', this.configType);
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (this.configType === SystemParameterConfig.HTTPSSERVE) {
      data.append('fileName', this.certificate.fileName);
      data.append('fileUrl', this.certificate.fileUrl);
      data.append('file', this.file);
    }
    this.$agreementManageService.updateProtocol(data).subscribe((result: Result) => {
      this.submitLoading = false;
      if (result.code === 0) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 恢复默认设置
   */
  formHandleReset() {
    this.certificate = this.protocolDefaultValue.certificateFile;
    if (this.certificate) {
      this.fileName = this.certificate.fileName;
    }
    this.file = null;
    this.formStatus.resetData(this.protocolDefaultValue);
  }

  /**
   * 取消
   */
  formHandleCancel() {
    this.formStatus.resetData(this.protocolValue);
  }

  /**
   * 文件变化
   */
  fileChange() {
    // 文件名效验
    const fileNode = document.getElementById('file');
    // TODO 文件暂时没验证
    this.file = fileNode['files'][0];
    this.fileName = this.file.name;
    this.$message.info(this.language.agreement.uploadSuccess);
  }

  /**
   * 文件上传
   */
  upload() {
    const fileNode = document.getElementById('file');
    fileNode.click();
  }

  /**
   * 监听表单数据变化
   * param controls
   * param $event
   * param key
   */
  modelChange = (controls, $event, key) => {
    if (key === 'enabled') {
      if ($event === '1') {
        this.formStatus.group.controls['maxActive'].setValue(this.protocolDefaultValue.maxActive);
        this.formStatus.group.controls['maxActive'].enable();
      } else {
        this.formStatus.group.controls['maxActive'].disable();
      }
    }
  }
}
