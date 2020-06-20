import {Component, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute, UrlSegment} from '@angular/router';
import {ColumnConfigService} from '../../column-config.service';
import {BasicConfig} from '../../../basic-config';
import {SecurityPolicyService} from '../../../../core-module/api-service/system-setting/security-policy/security-policy.service';
import {Result} from 'src/app/shared-module/entity/result';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {SystemParameterConfig} from '../../enum/systemConfig';
import {UpdatePasswordService} from '../../../menu/top-menu/update-password/update-password-service';
/**
 * 账号安全策略
 */
@Component({
  selector: 'app-id-security-policy',
  templateUrl: './id-security-policy.component.html',
  styleUrls: ['./id-security-policy.component.scss']
})
export class IdSecurityPolicyComponent extends BasicConfig implements OnInit {

  // 标题
  public pageTitle = this.language.systemSetting.accountSecurityStrategy;
  // 缓存默认配置
  public securityPolicyConfig = {
    lockedTime: ''
  };
  // 当前配置
  public securityPolicyCurConfig = {};
  // 账号安全策略类型
  public accessPolicyType = '';
  // 策略id
  public paramId = '';
  // 权限码
  public code = '';

  constructor(public $nzI18n: NzI18nService,
              private $activatedRoute: ActivatedRoute,
              private $columnConfigService: ColumnConfigService,
              private $securityPolicyService: SecurityPolicyService,
              private $message: FiLinkModalService,
              private $updatePasswordService: UpdatePasswordService
  ) {
    super($nzI18n);
  }

  ngOnInit() {
    // 判断页面  用户日志和系统日志 没有操作类型
    this.$activatedRoute.url.subscribe((urlSegmentList: Array<UrlSegment>) => {
      // 清除默认配置
      this.securityPolicyConfig = {lockedTime: ''};
      if (urlSegmentList.find(urlSegment => urlSegment.path === 'account')) {
        this.accessPolicyType = 'account';
        this.pageTitle = this.language.systemSetting.accountSecurityStrategy;
        this.code = '04-4-2-1';
      } else {
        this.pageTitle = this.language.systemSetting.passwordSecurityPolicy;
        this.accessPolicyType = 'password';
        this.code = '04-4-3-1';
      }
      this.searchFromData();
    });
  }

  /**
   * 初始化表单数据
   */
  searchFromData() {
    let funcName = 'queryPasswordPresent';
    let type = '0';
    if (this.accessPolicyType === 'password') {
      this.formColumn = this.$columnConfigService.getPasswordAccessControlFormConfig({});
      funcName = 'queryPasswordPresent';
      type = SystemParameterConfig.PASSWORDPRESENT;

    } else {
      this.formColumn = this.$columnConfigService.getIDAccessControlFormConfig({modelChange: this.modelChange});
      funcName = 'queryAccountPresent';
      type = SystemParameterConfig.ACCOUNTPRESENT;
    }
    this.$securityPolicyService[funcName](type).subscribe((result: Result) => {
      if (result.code === 0) {
        this.securityPolicyCurConfig = JSON.parse(result.data.presentValue);
        this.securityPolicyConfig = JSON.parse(result.data.defaultValue);
        this.paramId = result.data.paramId;
        this.formStatus.resetData(this.securityPolicyCurConfig);
      }
    });
  }

  /**
   * 确定
   */
  formHandleOk() {
    this.submitLoading = true;
    let data = {};
    let funcName = '';
    if (this.accessPolicyType === 'password') {
      funcName = 'updatePasswordStrategy';
      data = {
        passwordSecurityStrategy: this.formStatus.getData(),
        paramId: this.paramId
      };
    } else {
      funcName = 'updateAccountStrategy';
      data = {
        accountSecurityStrategy: this.formStatus.group.getRawValue(),
        paramId: this.paramId
      };
    }
    this.$securityPolicyService[funcName](data).subscribe((result: Result) => {
      this.submitLoading = false;
      if (result.code === 0) {
        this.$message.success(result.msg);
        this.$updatePasswordService.sendMessage(1);
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.submitLoading = false;
    });
  }

  /**
   * 取消
   */
  formHandleCancel() {
    // 取消则恢复当前配置
    this.searchFromData();
  }

  /**
   * 恢复默认
   */
  formHandleReset() {
    this.formStatus.resetData(this.securityPolicyConfig);
  }

  /**
   * 监听表单数据变化
   * param controls
   * param $event
   * param key
   */
  modelChange = (controls, $event, key) => {
    let item = '';
    if (key === 'lockStrategy') {
      item = 'lockedTime';
    }
    if (key === 'forbidStrategy') {
      item = 'noLoginTime';
    }
    if ($event === '1') {
      this.formStatus.group.controls[item].enable();
    } else {
      this.formStatus.group.controls[item].disable();
    }
  }
}
