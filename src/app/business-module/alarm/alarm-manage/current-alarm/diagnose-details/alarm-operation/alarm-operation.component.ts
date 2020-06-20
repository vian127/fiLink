import {Component, Input, OnInit} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {Result} from '../../../../../../shared-module/entity/result';
import {AlarmService} from '../../../../../../core-module/api-service/alarm/alarm-manage';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
@Component({
  selector: 'app-alarm-operation',
  templateUrl: './alarm-operation.component.html',
  styleUrls: ['./alarm-operation.component.scss']
})
export class AlarmOperationComponent implements OnInit {
  @Input() pageType: string;
  @Input() areaId: string;
  @Input() alarmId: string;
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  public isVisible: boolean = false;
  // 派单销障的数据
  orderCancelAccountData = {};
  constructor(
    public $nzI18n: NzI18nService,
    private $modal: NzModalService,
    public $alarmService: AlarmService,
    public $message: FiLinkModalService,
  ) {
    this.language = this.$nzI18n.getLocaleData('alarm');
  }

  ngOnInit() {
  }

  /**
   * 派单核实
   */
  ordersVerify() {
    // 组件中的确定取消按钮是反的所以反着用
    this.$modal.confirm({
      nzTitle: this.language.prompt,
      nzContent: 'build2功能',
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOkText: this.language.cancelText,
      nzCancelText: this.language.okText,
      nzOkType: 'danger',
      nzOnOk: () => {
      },
      nzOnCancel: () => {
      }
    });
  }
  /**
   * 转故障处理
   */
  turnTrouble() {
    // 组件中的确定取消按钮是反的所以反着用
    this.$modal.confirm({
      nzTitle: this.language.prompt,
      nzContent: this.language.whetherPassTroubleDispose,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOkText: this.language.cancelText,
      nzCancelText: this.language.okText,
      nzOkType: 'danger',
      nzOnOk: () => {
      },
      nzOnCancel: () => {
        this.$alarmService.alarmToTrouble([this.alarmId]).subscribe((result: Result) => {
          if (result.code === 0) {
            this.$message.success(result.msg);
            // this.$router.navigate(['business/trouble/trouble-list']).then();
          } else {
            this.$message.error(result.msg);
          }
        });
      }
    });
  }

  /**
   * 派单销障
   */
  clickOrdersCancelAccount() {
    this.isVisible = true;
  }

  /**
   * 误派
   */
  erroneousJudgement() {
    // 组件中的确定取消按钮是反的所以反着用
    this.$modal.confirm({
      nzTitle: this.language.prompt,
      nzContent: this.language.whetherConfirmErroneousJudgement,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOkText: this.language.cancelText,
      nzCancelText: this.language.okText,
      nzOkType: 'danger',
      nzOnOk: () => {
      },
      nzOnCancel: () => {
        this.$alarmService.alarmMisJudgment([this.alarmId]).subscribe((result: Result) => {
          if (result.code === 0) {
            this.$message.success(result.msg);
            // this.$router.navigate(['business/trouble/trouble-list']).then();
          } else {
            this.$message.error(result.msg);
          }
        });
      }
    });
  }
  /**
   * 已处理
   */
  processed() {
    // 组件中的确定取消按钮是反的所以反着用
    this.$modal.confirm({
      nzTitle: this.language.prompt,
      nzContent: this.language.whetherConfirmAccomplish,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOkText: this.language.cancelText,
      nzCancelText: this.language.okText,
      nzOkType: 'danger',
      nzOnOk: () => {
      },
      nzOnCancel: () => {
        this.$alarmService.alarmProcessed([this.alarmId]).subscribe((result: Result) => {
          if (result.code === 0) {
            this.$message.success(result.msg);
            // this.$router.navigate(['business/trouble/trouble-list']).then();
          } else {
            this.$message.error(result.msg);
          }
        });
      }
    });
  }
  /**
   * 查看类似案例
   */
  lookSimilarCases() {
    // 组件中的确定取消按钮是反的所以反着用
    this.$modal.confirm({
      nzTitle: this.language.prompt,
      nzContent: '查看类似案例',
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOkText: this.language.cancelText,
      nzCancelText: this.language.okText,
      nzOkType: 'danger',
      nzOnOk: () => {
      },
      nzOnCancel: () => {
      }
    });
  }

  /**
   * 保存到知识库
   */
  saveRepository() {
    // 组件中的确定取消按钮是反的所以反着用
    this.$modal.confirm({
      nzTitle: this.language.prompt,
      nzContent: '是否保存到知识库',
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOkText: this.language.cancelText,
      nzCancelText: this.language.okText,
      nzOkType: 'danger',
      nzOnOk: () => {
      },
      nzOnCancel: () => {
      }
    });
  }
}
