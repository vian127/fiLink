import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApplicationService} from '../../../server';
import {Result} from '../../../../../shared-module/entity/result';
import {detailsFmt} from '../../../model/const/tool';
import {NzI18nService} from 'ng-zorro-antd';
import {routerJump} from '../../../model/const/const';
import {Method} from '../../../model/const/method';

@Component({
  selector: 'app-release-details',
  templateUrl: './release-details.component.html',
  styleUrls: ['./release-details.component.scss']
})
export class ReleaseDetailsComponent implements OnInit {
  @Output() notify = new EventEmitter();
  @Input() isOperation = true;
  @Input() isShowButton = false;
  @Input() middleData;
  strategyDetails = [];
  strategyId = '';
  releaseData = {};
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
      this.$applicationService.getReleasePolicyDetails(params.id).subscribe((result: Result) => {
        console.log(result);
        this.strategyId = params.id;
        this.middleData = result.data;
        this.releaseData = result.data;
        detailsFmt(this.releaseData, this.$nzI18n);
      }, () => {

      });
    });
  }

  /**
   * 处理时间显示
   */
  timeFmt(data) {
    let time = '';
    if (data && data.length) {
      data.forEach(item => {
        // item.playStartTime = Method.dateFmt(item.playStartTime);
        // item.playEndTime = Method.dateFmt(item.playEndTime);
        time += `${item.playStartTime}-${item.playEndTime};`;
      });
    }
    return time;
  }

  public handNextSteps(data) {
    detailsFmt(data, this.$nzI18n);
    this.strategyDetails = data.instructLightList;
    this.releaseData = data;
  }

  handEdit() {
    this.$router.navigate([`${routerJump.RELEASE_WORKBENCH_EDIT}`], {
      queryParams: {
        id: this.strategyId
      }
    }).then();
  }

  handDelete() {
    this.isStrategy = true;
  }

  handleCancel() {
    this.isStrategy = false;
  }

  handleDown() {
    this.$applicationService.distributeInfoStrategy([this.strategyId]).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$router.navigate([routerJump.RELEASE_POLICY_CONTROL], {}).then();
      }
    }, () => {

    });
  }

  handleOk() {
    this.$applicationService.deleteLightStrategy([this.strategyId]).subscribe((result: Result) => {
      if (result.code === 0) {
        this.isStrategy = false;
        this.$router.navigate([routerJump.RELEASE_POLICY_CONTROL], {}).then();
      }
    }, () => {

    });
  }

  handPrevSteps() {
    this.notify.emit(2);
  }
}
