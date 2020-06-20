import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {ApplicationService} from '../../server';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ClearWorkOrderModel} from '../../../index/shared/model/work-order-condition.model';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';

@Component({
  selector: 'app-security-workbench',
  templateUrl: './security-workbench.component.html',
  styleUrls: ['./security-workbench.component.scss']
})
export class SecurityWorkbenchComponent implements OnInit, AfterViewInit {

  /**
   * 基础配置组件
   */
  @ViewChild('basicsModel') basicsModel;

  /**
   * 分屏组件值
   */
  @ViewChild('splitScreen') splitScreen;
  /**
   * 基础配置模态框
   */
  public isBasics = false;


  /**
   * @param $applicationService 后台服务
   * @param $message 提示信息服务
   * @param $router 路由跳转服务
   */
  constructor(
    private $applicationService: ApplicationService,
    private $message: FiLinkModalService,
    private $router: Router,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  /**
   * 模态框取消方法
   */
  public handleCancel(): void {
    this.isBasics = false;
  }

  /**
   * 模态框确定方法
   */
  public handleOk(): void {
    console.log(this.basicsModel);
    console.log(this.basicsModel.certificateFormStatus.group.getRawValue());
    console.log(this.basicsModel.platformFormStatus.group.getRawValue());
    console.log(this.splitScreen.equipmentId);
    this.isBasics = false;
    // 组件表单值 （将两个表单的值合并）
    const formData = Object.assign(
      this.basicsModel.certificateFormStatus.group.getRawValue(),
      this.basicsModel.platformFormStatus.group.getRawValue());
    // 提交参数 参数为FormData
    const configParameter = new FormData();
    Object.keys(formData).forEach(item => {
      if (formData[item]) {
        configParameter.append(item, formData[item]);
      }
    });
    configParameter.append('equipmentId', this.splitScreen.equipmentId);
    this.$applicationService.saveSecurityConfiguration(configParameter)
      .subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
        console.log(result);
        // if (result.code === '00000') {
        // } else {
        //   this.$message.warning(result.msg + '请填写基础配置' + '!');
        // }
      });
  }

  /**
   * 跳转通道配置信息
   */
  public goPassageway(): void {
    this.$router.navigate([`business/application/security/workbench/passageway-information`], {
      queryParams: {equipmentId: this.splitScreen.equipmentId}
    }).then();
  }
}
