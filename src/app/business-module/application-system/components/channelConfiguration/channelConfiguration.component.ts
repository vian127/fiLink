import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';

/**
 * 新增修改通道组件
 */
@Component({
  selector: 'app-channelConfiguration',
  templateUrl: './channelConfiguration.component.html',
  styleUrls: ['./channelConfiguration.component.scss']
})
export class ChannelConfigurationComponent implements OnInit, AfterViewInit {
  /**
   * 通道数据
   */
  @Input()
  private passagewayData: any = {};
  /**
   * 单选模板
   */
  @ViewChild('statusEnable') statusEnable;
  /**
   * 下拉框模板
   */
  @ViewChild('dropDownBox') dropDownBox;
  /**
   * 是否启用单选绑定值
   */
  public sslStatus: any;

  /**
   * 摄像机接入类型
   */
  public accessType: string;
  /**
   * form表单配置
   */
  public formColumn: FormItem[] = [];
  /**
   * 表单状态
   */
  private formStatus: FormOperate;


  constructor() {
  }

  ngOnInit(): void {
    this.initColumn();

  }

  ngAfterViewInit(): void {
    if (this.passagewayData) {
      this.formStatus.resetData(this.passagewayData);
    }
  }


  public formInstance(event): void {
    this.formStatus = event.instance;
  }

  /**
   * 表单配置
   */
  private initColumn(): void {
    this.formColumn = [
      {
        label: '通道名称',
        key: 'channelName',
        type: 'input',
        require: true,
        disabled: false,
        rule: [],
        asyncRules: [],
      },
      {
        label: '通道号',
        key: 'channelId',
        type: 'input',
        require: true,
        disabled: false,
        rule: [],
        asyncRules: [],
      },
      {
        label: '摄像机接入类型',
        key: 'cameraType',
        type: 'custom',
        require: true,
        rule: [],
        asyncRules: [],
        template: this.dropDownBox
      },
      {
        label: '是否启用ONVIF探测',
        key: 'onvifStatus',
        type: 'custom',
        require: true,
        rule: [],
        asyncRules: [],
        template: this.statusEnable
      },
      {
        label: '摄像机接入RTSP地址',
        key: 'rtspAddr',
        type: 'input',
        require: true,
        disabled: false,
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '摄像机接入ONVIF地址',
        key: 'onvifAddr',
        type: 'input',
        require: true,
        disabled: false,
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '摄像机用户名',
        key: 'cameraAccount',
        type: 'input',
        require: true,
        disabled: false,
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '摄像机密码',
        key: 'cameraPassword',
        type: 'input',
        require: true,
        disabled: false,
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '录像保留天数',
        key: 'videoRetentionDays',
        type: 'input',
        require: true,
        disabled: false,
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '其他设置',
        disabled: false,
        key: 'audioSwitch',
        type: 'input',
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '探测ONVIF IP',
        disabled: false,
        key: 'onvifIp',
        type: 'input',
        require: true,
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '探测 ONVIF 用户名',
        disabled: false,
        key: 'onvifAccount',
        type: 'input',
        require: true,
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '探测 ONVIF 密码',
        disabled: false,
        key: 'onvifPassword',
        type: 'input',
        require: true,
        rule: [{minLength: 0}, {maxLength: 255}]
      },
    ];
  }

  /**
   * 是否启用单选改变事件
   */
  public setStatus(): void {
    this.formStatus.group.controls['onvifStatus'].reset(this.sslStatus);
  }

  /**
   * 是否启用单选改变事件
   */
  public selected(): void {
    this.formStatus.group.controls['cameraType'].reset(this.accessType);
  }
}
