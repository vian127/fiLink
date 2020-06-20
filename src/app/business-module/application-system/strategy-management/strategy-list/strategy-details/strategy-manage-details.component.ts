import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {routerJump} from '../../../model/const/const';
import {ApplicationService} from '../../../server';
import {Result} from '../../../../../shared-module/entity/result';
import {detailsFmt} from '../../../model/const/tool';
import {NzI18nService} from 'ng-zorro-antd';

@Component({
  selector: 'app-strategy-manage-details',
  templateUrl: './strategy-manage-details.component.html',
  styleUrls: ['./strategy-manage-details.component.scss']
})
export class StrategyManageDetailsComponent implements OnInit {
  @Output() notify = new EventEmitter();
  @Input() isOperation = true;
  @Input() middleData;
  isShowTable = false;
  strategyId = '';
  lightingData = {};
  strategyDetails = [];
  isStrategy = false;
  data = [
    {
      key: '1',
      name: 1001,
      age: '节目1',
      address: '记录美好生活'
    }
  ];

  constructor(
    public $nzI18n: NzI18nService,
    public $applicationService: ApplicationService,
    private $activatedRoute: ActivatedRoute,
    public $router: Router,
  ) {
  }

  ngOnInit() {
    if (this.isOperation) {
      this.initDetails();
    }
  }

  /**
   * 策略下发
   * @ param id
   */
  handleDown() {
    this.$applicationService.distributeLinkageStrategy([this.strategyId]).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$router.navigate([routerJump.STRATEGY], {}).then();
      }
    }, () => {

    });
  }

  /**
   * 父组件点击下一步的时候触发该方法更新值
   * @ param data
   */
  public handNextSteps(data) {
    detailsFmt(data, this.$nzI18n);
    this.strategyDetails = data.instructLightList;
    // this.strategyDetails.forEach(item => {
    //   item.startTime = Method.dateFmt(item.startTime);
    //   item.endTime = Method.dateFmt(item.endTime);
    //   item.switchLight = item.switchLight === '1' ? '开' : '关';
    // });
    this.lightingData = data;
  }
  /**
   * 获取策略详情
   */
  initDetails() {
    this.$activatedRoute.params.subscribe(params => {
      this.$applicationService.getLinkageDetails(params.id).subscribe((result: Result) => {
        this.lightingData = result.data;
        this.strategyId = params.id;
        this.strategyDetails = result.data.instructLightList;
        detailsFmt(this.lightingData, this.$nzI18n);
      }, () => {

      });
    });
  }

  /**
   * 编辑
   */
  handEdit() {
    this.$router.navigate([`${routerJump.STRATEGY_EDIT}`], {
      queryParams: {
        id: this.strategyId
      }
    }).then();
  }

  /**
   * 删除
   */
  handDelete() {
    this.isStrategy = true;
  }

  /**
   * 取消
   */
  handleCancel() {
    this.isStrategy = false;
  }

  /**
   * 确认删除
   */
  handleOk() {
    this.isStrategy = false;
    this.$applicationService.deleteLightStrategy([this.strategyId]).subscribe((result: Result) => {
      if (result.code === 0) {
        this.isStrategy = false;
        this.$router.navigate([routerJump.RELEASE_POLICY_CONTROL], {}).then();
      }
    }, () => {

    });
  }
}
