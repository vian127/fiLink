import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {ColumnConfigService} from '../../../column-config.service';
import {BasicConfig} from '../../../../basic-config';
import {Result} from '../../../../../shared-module/entity/result';
import {SecurityPolicyService} from '../../../../../core-module/api-service/system-setting/security-policy/security-policy.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {CommonUtil} from '../../../../../shared-module/util/common-util';


@Component({
  selector: 'app-access-control-detial',
  templateUrl: './access-control-detial.component.html',
  styleUrls: ['./access-control-detial.component.scss']
})
export class AccessControlDetialComponent extends BasicConfig implements OnInit, AfterViewInit {

  @Input() title = this.language.systemSetting.addIPAddressRange;
  @Input() isVisible = false;
  @Input() ipInfo = {rangeId: '', ipType: '', startIp: '', endIp: '', mask: ''};
  // 推送取消事件
  @Output() cancel = new EventEmitter();
  @Output() handleSubmit = new EventEmitter();
  @ViewChild('startIPV4') private startIPV4Template;
  @ViewChild('maskIp') maskIp: ElementRef;
  @ViewChild('startIPV4Value') startIPV4: ElementRef;
  @ViewChild('endIPV4Value') endIPV4: ElementRef;
  @ViewChild('endIPV6Value') endIPV6: ElementRef;
  @ViewChild('startIPV6Value') startIPV6: ElementRef;
  @ViewChild('ipV6Mask') maskIPV6: ElementRef;
  @ViewChild('endIPV4') private endIPV4Template;
  @ViewChild('startIPV6') private startIPV6Template;
  @ViewChild('endIPV6') private endIPV6Template;
  @ViewChild('maskIpv6') private maskIpv6Template;
  @ViewChild('maskIpv4') private maskIpv4Template;
  modelWith = 680; // 弹框宽度
  ipInfoTpl = {};
  checkUrl = '';
  maskErrors = false; // IPV6错误提示
  startIpV6Errors = false;
  endIpV6Errors = false;
  ipV6submitErrors = false;
  ipV4submitErrors = false;
  startIpV4Errors = false;
  endIpV4Errors = false;
  maskIpV4Errors = false;
  ipv4Mask = [];
  ipv4StartIp = [];
  ipv4EndIp = [];
  ipv6EndIp = [];
  ipv6StartIp = [];
  ipv6Mask = [];
  ipType = 'ipv4'; // 默认ipv4

  constructor(public $nzI18n: NzI18nService,
              private $securityPolicyService: SecurityPolicyService,
              private $message: FiLinkModalService,
              private $columnConfigService: ColumnConfigService
  ) {
    super($nzI18n);
  }

  ngOnInit(): void {
    this.ipInfoTpl = {
      startIPV4Template: this.startIPV4Template,
      endIPV4Template: this.endIPV4Template,
      modelChange: this.ipModelChange,
      maskIpv6Template: this.maskIpv6Template,
      maskIpv4Template: this.maskIpv4Template
    };
    this.formColumn = this.$columnConfigService.getAccessControlFormConfig(this.ipInfo, this.ipInfoTpl);
  }

  ngAfterViewInit(): void {
    if (this.ipInfo.rangeId !== undefined) {
      this.$securityPolicyService.queryRangeId({rangeId: this.ipInfo.rangeId}).subscribe((result: Result) => {
        this.ipInfo = result.data;
        this.formStatus.resetData(this.ipInfo);
        if (this.ipInfo.ipType === 'ipv4') {
          this.ipv4Mask = this.maskIp.nativeElement.getElementsByTagName('input');
          this.ipv4StartIp = this.startIPV4.nativeElement.getElementsByTagName('input');
          this.ipv4EndIp = this.endIPV4.nativeElement.getElementsByTagName('input');
          const mask = this.ipInfo.mask.split('.');
          const startIp = this.ipInfo.startIp.split('.');
          const endIp = this.ipInfo.endIp.split('.');
          this.componentAssignment(this.ipv4Mask, mask);
          this.componentAssignment(this.ipv4StartIp, startIp);
          this.componentAssignment(this.ipv4EndIp, endIp);
          this.goNextInput(this.ipv4StartIp, this.ipInfo.ipType, 2);
          this.goNextInput(this.ipv4Mask, this.ipInfo.ipType, 4);
          this.goNextInput(this.ipv4EndIp, this.ipInfo.ipType, 3);
          this.ipV4submitErrors = true;
          this.ipV6submitErrors = false;
        } else {
          setTimeout(() => {
            this.ipv6EndIp = this.endIPV6.nativeElement.getElementsByTagName('input');
            this.ipv6StartIp = this.startIPV6.nativeElement.getElementsByTagName('input');
            this.ipv6Mask = this.maskIPV6.nativeElement.getElementsByTagName('input');
            const endIp = this.ipInfo.endIp.split(':');
            const startIp = this.ipInfo.startIp.split(':');
            const mask = this.ipInfo.mask;
            this.componentAssignment(this.ipv6EndIp, endIp);
            this.componentAssignment(this.ipv6StartIp, startIp);
            this.componentAssignment(this.ipv6Mask, mask);
            this.goNextInput(this.ipv6EndIp, this.ipInfo.ipType, 1);
            this.goNextInput(this.ipv6StartIp, this.ipInfo.ipType, 0);
            this.ipV6submitErrors = true;
            this.ipV4submitErrors = false;
          }, 0);
        }
      });
    } else {
      this.defaultModel(this.ipType);
    }
  }

  /**
   * 组件赋值
   */
  componentAssignment(array, val) {
    for (let i = 0; i < array.length; i++) {
      array[i].value = val[i];
    }
  }

  /**
   * 默认进页面是IPV4
   */
  defaultModel(type) {
    setTimeout(() => {
      this.ipv4Mask = this.maskIp.nativeElement.getElementsByTagName('input');
      this.ipv4StartIp = this.startIPV4.nativeElement.getElementsByTagName('input');
      this.ipv4EndIp = this.endIPV4.nativeElement.getElementsByTagName('input');
      this.goNextInput(this.ipv4StartIp, type, 2);
      this.goNextInput(this.ipv4Mask, type, 4);
      this.goNextInput(this.ipv4EndIp, type, 3);
      this.ipV4submitErrors = true;
    }, 0);
  }

  /**
   * 组件取值
   */
  componentGetValue(array, type) {
    let temp1 = '';
    if (type === 'ipv4') {
      for (let i = 0; i < array.length; i++) {
        temp1 += `${array[i].value}.`;
      }
    } else if (type === 'ipv6') {
      for (let i = 0; i < array.length; i++) {
        temp1 += `${array[i].value}:`;
      }
    }
    return temp1.substring(0, temp1.length - 1);
  }

  /**
   * input框自动聚焦到下个input框
   * type判断是IPV4或IPV6
   */
  goNextInput(el, type, ipType?) {
    const regEn = /^([\da-fA-F]{1,4})$/;
    const rx = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    let val;
    let reg;
    if (type === 'ipv6') {
      val = 4;
      reg = regEn;
    } else {
      val = 3;
      reg = rx;
    }
    for (let i = 0; i < el.length; i++) {
      const t = el[i];
      t.index = i;
      t.onkeyup = () => {
        const next = t.index + 1;
        if (!reg.test(t.value)) {
          this.showErrors(ipType, true, type);
        } else {
          this.showErrors(ipType, false, type);
          if (t.value.length === val) {
            if (next < el.length) {
              el[next].focus();
            }
          }
        }
      };
    }
  }

  /**
   * param num
   */
  showErrors(num: number, bool: boolean, type: string) {
    // 判断ip类型输入错误
    if (type === 'ipv6') {
      num === 0 ? this.startIpV6Errors = bool : this.endIpV6Errors = bool;
    } else {
      num === 2 ? this.startIpV4Errors = bool : num === 3 ? this.endIpV4Errors = bool : this.maskIpV4Errors = bool;
    }

  }

  /**
   * 确认按钮
   */
  handleOk(): void {
    const form = document.forms[0];
    this.submitLoading = true;
    const item = this.formStatus.getData();
    if (item.ipType === 'ipv4') {
      item.startIp = this.componentGetValue(this.ipv4StartIp, item.ipType);
      item.endIp = this.componentGetValue(this.ipv4EndIp, item.ipType);
      item.mask = this.componentGetValue(this.ipv4Mask, item.ipType);
      if (item.startIp === '...' || item.endIp === '...' || item.mask === '...') {
        this.$message.warning(this.language.systemSetting.pleaseFillInTheFullIPOrMask);
        this.submitLoading = false;
        return;
      }
    } else {
      this.ipv6EndIp = this.endIPV6.nativeElement.getElementsByTagName('input');
      this.ipv6StartIp = this.startIPV6.nativeElement.getElementsByTagName('input');
      this.ipv6Mask = this.maskIPV6.nativeElement.getElementsByTagName('input');
      item.endIp = this.componentGetValue(this.ipv6EndIp, item.ipType);
      item.startIp = this.componentGetValue(this.ipv6StartIp, item.ipType);
      item.mask = form.elements['maskIpV6'].value;
      if (item.startIp === ':::::::' || item.endIp === ':::::::' || item.mask === '') {
        this.$message.warning(this.language.systemSetting.pleaseFillInTheFullIPOrMask);
        this.submitLoading = false;
        return;
      }
    }
    if (this.ipInfo.rangeId === undefined) {
      this.checkUrl = 'addIpRange';
    } else {
      this.checkUrl = 'updateIpRange';
      item.rangeId = this.ipInfo.rangeId;
    }
    if (CommonUtil.compareIP(item.startIp, item.endIp)) {
      this.$securityPolicyService[this.checkUrl](item).subscribe((result: Result) => {
        this.submitLoading = false;
        if (result.code === 0) {
          this.$message.success(result.msg);
          this.cancel.emit(true);
        } else {
          this.$message.error(result.msg);
        }
      }, () => this.submitLoading = false);
    } else {
      this.$message.error(`${this.language.systemSetting.initiatingIPAndEndingIPIllegal}!`);
      this.submitLoading = false;
    }
  }

  /**
   * 取消按钮
   */
  handleCancel(): void {
    this.cancel.emit();
  }

  /**
   * IPV6掩码失去焦事件
   */
  endKeyMaskIpV6UpEvent(event) {
    if (/^(\d|[[1-9]\d|1[0-1]\d|12[0-8])$/.test(event.target.value)) {
      this.maskErrors = false;
    } else {
      this.maskErrors = true;
    }
  }

  /**
   * 切换模板
   */
  ipModelChange = (controls, $event, key) => {
    if (key === 'ipType') {
      if ($event === 'ipv6') {
        this.modelWith = 1050;
        this.formColumn[1].template = this.startIPV6Template;
        this.formColumn[2].template = this.endIPV6Template;
        this.formColumn[3].template = this.maskIpv6Template;
        setTimeout(() => {
          const allStartIpV6 = document.querySelectorAll('.startIpv6');
          const allEndIpV6 = document.querySelectorAll('.endIpv6');
          this.goNextInput(allStartIpV6, $event, 0);
          this.goNextInput(allEndIpV6, $event, 1);
          this.ipV6submitErrors = true;
          this.ipV4submitErrors = false;
          // this.ipv6EndIp = this.endIPV6.nativeElement.getElementsByTagName('input');
          // this.ipv6StartIp = this.startIPV6.nativeElement.getElementsByTagName('input');
          // this.ipv6Mask = this.maskIPV6.nativeElement.getElementsByTagName('input');
        }, 0);
      } else {
        this.modelWith = 680;
        this.formColumn[1].template = this.startIPV4Template;
        this.formColumn[2].template = this.endIPV4Template;
        this.formColumn[3].template = this.maskIpv4Template;
        this.defaultModel($event);
        this.ipV6submitErrors = false;
      }
    }
  };
}

