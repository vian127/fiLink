import {Component, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationService} from '../../server';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ClearWorkOrderModel} from '../../../index/shared/model/work-order-condition.model';
import {FileUploadComponentModel} from '../../../../shared-module/entity/file-upload-component.model';
import {UploadFile} from 'ng-zorro-antd/upload/interface';

/**
 * 基础配置表单页面
 */
@Component({
  selector: 'app-basics-model',
  templateUrl: './basics-model.component.html',
  styleUrls: ['./basics-model.component.scss']
})
export class BasicsModelComponent implements OnInit {
  /**
   * 证书的上传文件
   */
  @ViewChild('certUpload') certUpload;
  /**
   * 秘钥的上传文件
   */
  @ViewChild('keyUpload') keyUpload;
  /**
   * 单选模板
   */
  @ViewChild('statusEnable') statusEnable;
  /**
   * form证书表单配置
   */
  public certificateFormColumn: FormItem[] = [];
  /**
   * form平台表单配置
   */
  public platformFormColumn: FormItem[] = [];
  /**
   * 证书表单状态
   */
  private certificateFormStatus: FormOperate;
  /**
   * 平台表单状态
   */
  private platformFormStatus: FormOperate;
  /**
   * 是否启用单选绑定值
   */
  public sslStatus: any;
  public certificateFileList = [];
  public certificateFileInfo = new FileUploadComponentModel();
  public certificateUploadBtnDisabled = false;

  /**
   * @param $applicationService 后台接口服务
   * @param $message 提示信息服务
   */
  constructor(
    private $applicationService: ApplicationService,
    private $message: FiLinkModalService
  ) {
  }

  ngOnInit(): void {
    this.initColumn();
  }

  /**
   * 证书
   * @param event 表单事件
   */
  public certificateFormInstance(event): void {
    this.certificateFormStatus = event.instance;
  }

  /**
   * 平台
   * @param event 表单事件
   */
  public platformFormInstance(event): void {
    this.platformFormStatus = event.instance;
  }

  /**
   * 表单配置
   */
  private initColumn(): void {
    this.certificateFormColumn = [
      {
        label: '是否启用',
        key: 'sslStatus',
        type: 'custom',
        require: true,
        rule: [],
        asyncRules: [],
        template: this.statusEnable
      },
      {
        label: 'HTTPS端口号',
        key: 'httpsPort',
        type: 'input',
        disabled: false,
        rule: [],
        asyncRules: [],
      },
      {
        label: 'SSL证书上传',
        key: 'sslCertFile',
        type: 'custom',
        rule: [],
        asyncRules: [],
        template: this.certUpload
      },
      {
        label: 'SSL秘钥上传',
        key: 'sslKeyFile',
        type: 'custom',
        rule: [],
        asyncRules: [],
        template: this.keyUpload
      }];
    this.platformFormColumn = [
      {
        label: '接入平台',
        key: 'platform',
        type: 'input',
        require: true,
        disabled: false,
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: 'IP地址',
        key: 'platformIp',
        type: 'input',
        require: true,
        disabled: false,
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '监听端口',
        key: 'listenPort',
        type: 'input',
        require: true,
        disabled: false,
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '设备序列号',
        key: 'deviceSerial',
        type: 'input',
        disabled: false,
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '设备名称',
        key: 'deviceName',
        type: 'input',
        disabled: false,
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '接入密码',
        disabled: false,
        key: 'password',
        type: 'input',
        rule: [{minLength: 0}, {maxLength: 255}]
      },
    ];
  }

  /**
   * 是否启用单选改变事件
   */
  public setStatus(): void {
    this.certificateFormStatus.group.controls['sslStatus'].reset(this.sslStatus);
  }

  /**
   * 文件上传
   * @param files
   */
  public uploadFile(files) {
    this.certificateUploadBtnDisabled = true;
    const parameter = new FormData();
    files.forEach(file => {
      parameter.append('file', file);
    });
    this.$applicationService.uploadSslFile(parameter).subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
      this.certificateUploadBtnDisabled = false;
      if (result.code === '00000') {
        this.$message.success('文件上传成功');
        this.certificateFormStatus.group.controls['sslCertFile'].reset(result.data);
      }
    }, () => {
        this.certificateFileList = files.map(file => {
          file.status = 'error';
          return file;
        });
        this.certificateUploadBtnDisabled = false;
        this.$message.error('文件上传失败');
    });
  }

  /**
   * 删除上传的文件
   * @param file
   */
  public removeFileChange(file) {
    this.certificateUploadBtnDisabled = true;
    // todo 调用删除接口
    setTimeout(() => {
      this.$message.success('删除成功');
      this.certificateFileList = this.certificateFileList.filter(item => item.uid !== file.uid);
      this.certificateUploadBtnDisabled = false;
    }, 1000);
  }

  /**
   * 文件上传
   * @param type 上传的类型  certificate：证书 secretKey：秘钥
   */
  public uploadClick(type: string): void {
    const inputNode = document.createElement('input');
    inputNode.type = 'file';
    inputNode.onchange = () => {
      // 判断文件是否存在
      if (_.isEmpty(inputNode) && !inputNode['files'][0]) {
        this.$message.warning('请从新上传文件' + '!');
        return;
      }
      const parameter = new FormData();
      parameter.append('file', inputNode['files'][0]);
      this.$applicationService.uploadSslFile(parameter).subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
        console.log(result);
        if (result.code === '00000') {
          if (type === 'certificate') {
            this.certificateFormStatus.group.controls['sslCertFile'].reset(result.data);
          } else {
            this.certificateFormStatus.group.controls['sslKeyFile'].reset(result.data);
          }
        }
      }, () => {

      });
    };
    inputNode.click();
  }
}
