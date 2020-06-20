import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApplicationService} from '../../../server';
import {Result} from '../../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {ClearWorkOrderModel} from '../../../../index/shared/model/work-order-condition.model';

/**
 * 审核详情页面
 */
@Component({
  selector: 'app-content-examine-details',
  templateUrl: './content-examine-details.component.html',
  styleUrls: ['./content-examine-details.component.scss']
})
export class ContentExamineDetailsComponent implements OnInit, AfterViewInit {
  /**
   * 退单模拟框
   */
  public isChargeBack: Boolean = false;
  /**
   * 转派模拟框
   */
  public isTransfer: Boolean = false;
  /**
   * 审核信息数据
   */
  public informationData: any = {};
  /**
   * 工单操作数据
   */
  public workOrderData: any = {};
  /**
   * 指定人
   */
  public designee: any;
  /**
   * 指定人列表
   */
  public designeeArr: any = [];

  /**
   * @param $applicationService 后台接口服务
   * @param $activatedRoute 路由传参服务
   * @param $router 路由跳转服务
   * @param $message 提示信息服务
   */
  constructor(
    private $applicationService: ApplicationService,
    private $activatedRoute: ActivatedRoute,
    private $router: Router,
    private $message: FiLinkModalService,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.$activatedRoute.queryParams.subscribe(params => {
      console.log(params);
      if (params.workOrderId) {
        this.initialization(params.workOrderId);
      }
    });
  }

  /**
   * 初始化
   * @param workOrderId 工单ID
   */
  private initialization(workOrderId: any): void {
    this.$applicationService.lookReleaseWorkOrder(workOrderId).subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
      console.log(result);
      if (result.code === '00000') {
        this.informationData = result.data;
      }
    }, () => {
    });
  }


  /**
   * 工单操作
   * @param actType 操作动作 0:删除 1:取消 2:转派 3:退单 4:提交
   */
  public onWorkOrderOperation(actType: any): void {
    const parameterObject = {
      workOrderId: this.informationData.workOrderId,
      examineAdvise: this.workOrderData.examineAdvise,
      transferReason: this.workOrderData.transferReason,
      causeReason: this.workOrderData.causeReason,
      auditResults: this.workOrderData.auditResults,
      personLiable: this.designee,
      actType: actType
    };
    this.$applicationService.releaseWorkOrder(parameterObject).subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
      if (result.code === '00000') {
        this.$router.navigate(['business/application/release/content-examine'], {}).then();
      } else {
        this.$message.warning(result.msg);
      }
      console.log(result);
    }, () => {
    });
  }

  /**
   * open模态框方法
   * @param actType  操作动作 2:转派 3:退单
   */
  public onChargeback(actType: any): void {
    if (actType === 3) {
      this.isChargeBack = true;
    } else {
      this.isTransfer = true;
      this.getDesigneeList();
    }
  }

  /**
   * 获取指定人列表
   */
  private getDesigneeList() {
    // this.$applicationService.releaseWorkOrder(parameterObject).subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
    //   console.log(res);
    this.designeeArr = [
      {
        id: '0',
        name: 'Jack'
      },
      {
        id: '1',
        name: 'Lucy'
      },
      {
        id: '2',
        name: 'Tom'
      }
    ];
    this.designee = this.designeeArr[0].id;
    // }, () => {
    // });
  }

  /**
   * 模态框确定方法
   * @param actType  操作动作 2:转派 3:退单
   */
  public onHandleOk(actType: any): void {
    console.log('Button ok clicked!');
    this.isChargeBack = false;
    this.isTransfer = false;
    this.onWorkOrderOperation(actType);
  }

  /**
   * 模态框取消方法
   */
  public onHandleCancel(): void {
    console.log('Button cancel clicked!');
    this.isChargeBack = false;
    this.isTransfer = false;
  }

}
