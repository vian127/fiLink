import { Component, Input, OnInit } from '@angular/core';
import { FaultLanguageInterface } from '../../../../../../../assets/i18n/fault/fault-language.interface';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {Result} from '../../../../../../shared-module/entity/result';
import {ResultModel} from '../../../../../../core-module/model/result.model';
import {TroubleModel} from '../../../../model/trouble.model';
import {TroubleService} from '../../../../../../core-module/api-service/trouble/trouble-manage';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {HandelStatusList, AssignTypeList, TroubleFlow} from '../../../../model/const/trouble-process.const';
@Component({
  selector: 'app-fault-operation',
  templateUrl: './fault-operation.component.html',
  styleUrls: ['./fault-operation.component.scss']
})
export class FaultOperationComponent implements OnInit {
  // 故障id
  @Input() troubleId: string;
  // 处理状态
  @Input() handleStatus: string;
  // 流程节点
  @Input() flowId: string;
  // 流程实例id
  @Input() instanceId: string;
  // 流程节点名称
  @Input() currentHandleProgress: string;
  // 告警国际化引用
  public language: FaultLanguageInterface;
  constructor(
    public $nzI18n: NzI18nService,
    public $router: Router,
    private $modal: NzModalService,
    public $troubleService: TroubleService,
    private $message: FiLinkModalService,
  ) {
    this.language = this.$nzI18n.getLocaleData('fault');
  }

  ngOnInit() {
  }

  /**
   * 编辑
   */
  clickUpdate() {
    this.$router.navigate(['business/trouble/trouble-list/update'],
      {queryParams: {type: 'update', id: this.troubleId}}).then();
  }

  /**
   * 删除
   */
  clickDelete() {
      // 组件中的确定取消按钮是反的所以反着用
      this.$modal.confirm({
        nzTitle: this.language.prompt,
        nzContent: this.language.troubleAffirmDelete,
        nzMaskClosable: false,
        nzKeyboard: false,
        nzOkText: this.language.cancelText,
        nzCancelText: this.language.okText,
        nzOkType: 'danger',
        nzOnOk: () => {
        },
        nzOnCancel: () => {
          this.$troubleService.deleteTrouble([this.troubleId]).subscribe((result: ResultModel<TroubleModel>) => {
            if (result.code === 0) {
                this.$message.success(result.msg);
                this.$router.navigate(['business/trouble/trouble-list']).then();
          } else {
              this.$message.error(result.msg);
            }
          });
        }
      });
    }

  /**
   * 指派
   */
  clickAssign() {
    this.$router.navigate(['business/trouble/trouble-list/assign'],
      {queryParams: {
          id: this.troubleId,
          handleStatus: this.handleStatus,
          flowId: this.flowId,
          instanceId: this.instanceId,
          handleProgress: this.currentHandleProgress,
      }}).then();
  }

  /**
   * 是否可指派
   */
  isShowAssign() {
    if (this.handleStatus === HandelStatusList.unCommit) {
      return true;
    } else if (this.handleStatus === HandelStatusList.commit && this.flowId === TroubleFlow.FIVE) {
      return true;
    } else if (this.handleStatus === HandelStatusList.processing && (this.flowId === TroubleFlow.SEVEN ||
      this.flowId === TroubleFlow.EIGHT || this.flowId === TroubleFlow.TEN)) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * 流程
   */
  clickFlow() {
    this.$router.navigate(['business/trouble/trouble-list/flow'],
      {queryParams: {instanceId: this.instanceId}}).then();
  }
}
