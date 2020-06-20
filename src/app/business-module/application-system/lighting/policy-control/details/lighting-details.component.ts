import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {routerJump, finalValue} from '../../../model/const/const';
import {ApplicationService} from '../../../server';
import {Result} from '../../../../../shared-module/entity/result';
import {detailsFmt, instructLightListFmt} from '../../../model/const/tool';
import {NzI18nService} from 'ng-zorro-antd';
import {Method} from '../../../model/const/method';

@Component({
  selector: 'app-lighting-details',
  templateUrl: './lighting-details.component.html',
  styleUrls: ['./lighting-details.component.scss']
})
export class LightingDetailsComponent implements OnInit {
  @Output() notify = new EventEmitter();
  @Input() isShowButton = false;
  @Input() isOperation = true;
  @Input() submit;
  @Input() middleData;
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
   * 获取策略详情
   */
  initDetails() {
    this.$activatedRoute.params.subscribe(params => {
      this.strategyId = params.id;
      this.$applicationService.getLightingPolicyDetails(params.id).subscribe((result: Result) => {
        this.lightingData = result.data;
        this.strategyDetails = result.data.instructLightList;
        detailsFmt(this.lightingData, this.$nzI18n);
      }, () => {

      });
    });
  }

  /**
   * 下一步
   * @ param data
   */
  public handNextSteps(data) {
    detailsFmt(data, this.$nzI18n);
    this.strategyDetails = data.instructLightList;
    this.lightingData = data;
  }

  /**
   * 编辑
   */
  handEdit() {
    this.$router.navigate([`${routerJump.LIGHTING_POLICY_CONTROL_EDIT}`], {
      queryParams: {
        id: this.strategyId
      }
    }).then();
  }

  /**
   * 点击删除
   */
  handDelete() {
    this.isStrategy = true;
  }

  handleCancel() {
    this.isStrategy = false;
  }

  /**
   * 策略下发
   * @ param id
   */
  handleDown(id) {
    this.$applicationService.distributeLightStrategy(id).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$router.navigate([routerJump.LIGHTING_POLICY_CONTROL], {}).then();
      }
    }, () => {

    });
  }

  /**
   * 删除接口
   */
  handleOk() {
    this.isStrategy = false;
    this.$applicationService.deleteLightStrategy([this.strategyId]).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$router.navigate([routerJump.LIGHTING_POLICY_CONTROL], {}).then();
      }
    }, () => {

    });
  }
}
