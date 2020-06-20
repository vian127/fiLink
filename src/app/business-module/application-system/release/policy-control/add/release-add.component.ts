import {Component, OnInit, ViewChild} from '@angular/core';
import {applicationFinal, classStatus, finalValue, routerJump} from '../../../model/const/const';
import {ActivatedRoute, Router} from '@angular/router';
import {ApplicationService} from '../../../server';
import {BasicInformationComponent} from '../../../components/basic-information/basic-information.component';
import {ReleaseStrategyComponent} from '../release-strategy/release-strategy.component';
import {Result} from '../../../../../shared-module/entity/result';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {ResultModel} from '../../../../../core-module/model/result.model';

@Component({
  selector: 'app-release-add',
  templateUrl: './release-add.component.html',
  styleUrls: ['./release-add.component.scss']
})
export class ReleaseAddComponent implements OnInit {
  isActiveSteps: number = 1;
  isShowButton = true;
  isShowRow = true;
  middleData = {};
  // 步骤条的步骤常量值
  finalValue = finalValue;
  isEdit = false;
  strategyId = '';
  isOperation = false;
  @ViewChild('basicInfo') basicInfo: BasicInformationComponent;
  @ViewChild('strategyDetails') strategyDetails: ReleaseStrategyComponent;
  @ViewChild('detailsInfo') detailsInfo;
  setData = [
    {
      number: 1,
      activeClass: ' active',
      title: '基本信息'
    },
    {
      number: 2,
      activeClass: '',
      title: '策略详情'
    },
    {
      number: 3,
      activeClass: '',
      title: '完成'
    }
  ];

  constructor(
    public $router: Router,
    private $activatedRoute: ActivatedRoute,
    public $applicationService: ApplicationService,
  ) {
  }

  ngOnInit() {
    this.initStrategyEdit();
  }

  /**
   * 获取策略详情
   */
  initStrategyEdit() {
    this.$activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.id) {
        this.isEdit = true;
        this.strategyId = queryParams.id;
        this.$applicationService.getReleasePolicyDetails(queryParams.id).subscribe((result: Result) => {
          this.resultFmt(result.data);
        }, () => {

        });
      }
    });
  }

  /**
   * 更新子组件的值
   * @ param data
   */
  resultFmt(data) {
    this.strategyDetails.instructInfo = data.instructInfo;
    this.middleData = data;
    this.basicInfo.strategyRefList = data.strategyRefList;
    this.basicInfo.selectUnitName = data.strategyRefList.map(item => item.refName).join(';');
    this.strategyDetails.strategyPlayPeriodRefList = data.strategyPlayPeriodRefList;
    this.strategyDetails.strategyProgRelationList = data.strategyProgRelationList;
    this.basicInfo.effectivePeriodStart = CommonUtil.dateFmt(applicationFinal.DATE_TYPE, new Date(data.effectivePeriodStart));
    this.basicInfo.effectivePeriodEnd = CommonUtil.dateFmt(applicationFinal.DATE_TYPE, new Date(data.effectivePeriodEnd));
    this.basicInfo.formStatus.resetData(data);
  }

  /**
   * 上一步操作
   * @ param value
   */
  handPrevSteps(value) {
    this.isActiveSteps = value - 1;
  }

  /**
   * 新增策略
   * @ param params
   */
  releasePolicyAdd(params) {
    this.$applicationService.releasePolicyAdd(params).subscribe((result: ResultModel<string>) => {
      if (result.code === '00000') {
        this.$router.navigate([routerJump.RELEASE_POLICY_CONTROL], {}).then();
      }
    }, () => {
    });
  }

  /**
   * 编辑信息发布
   * @ param params
   */
  modifyReleaseStrategy(params) {
    this.$applicationService.modifyReleaseStrategy(params).subscribe((result: ResultModel<string>) => {
      if (result.code === '00000') {
        this.$router.navigate([routerJump.RELEASE_POLICY_CONTROL], {}).then();
      }
    }, () => {
    });
  }

  /**
   * 下一步操作
   * @ param value
   */
  handNextSteps(value) {
    if (value === finalValue.STEPS_FIRST) {
      this.basicInfo.handNextSteps();
    } else if (value === finalValue.STEPS_SECOND) {
      const instructInfo = this.strategyDetails.instructInfo;
      const strategyPlayPeriodRefList = this.strategyDetails.strategyPlayPeriodRefList;
      const strategyProgRelationList = this.strategyDetails.strategyProgRelationList;
      this.middleData = Object.assign({},
        this.basicInfo.stepsFirstParams,
        {instructInfo},
        {strategyPlayPeriodRefList},
        {strategyProgRelationList});
      this.detailsInfo.handNextSteps(this.middleData);
    }
    this.isActiveSteps = value + 1;
  }

  /**
   * 数据提交
   */
  handStepsSubmit() {
    const strategyPlayPeriodRefList = this.strategyDetails.strategyPlayPeriodRefList;
    const strategyProgRelationList = this.strategyDetails.strategyProgRelationList;
    const instructInfo = this.strategyDetails.instructInfo;
    const params = Object.assign({}
      , this.basicInfo.stepsFirstParams
      , {instructInfo}
      , {strategyPlayPeriodRefList}
      , {strategyProgRelationList}
    );
    if (this.isEdit) {
      params.strategyId = this.strategyId;
      this.modifyReleaseStrategy(params);
    } else {
      this.releasePolicyAdd(params);
    }
  }

  /**
   * 取消操作
   */
  handCancelSteps() {
    this.$router.navigate([routerJump.RELEASE_WORKBENCH], {}).then();
  }

  handChangeSteps(value) {
    this.isActiveSteps = value;
    this.handBasicSteps(value);
  }

  /**
   * 切换步骤改变步骤样式和状态
   * @ param value
   */
  handBasicSteps(value) {
    if (this.isActiveSteps > finalValue.STEPS_THIRD) {
      return;
    } else {
      this.isActiveSteps = value;
    }
    this.setData.forEach(item => {
      if (this.isActiveSteps > item.number) {
        item.activeClass = ` ${classStatus.STEPS_FINISH}`;
      } else if (this.isActiveSteps === item.number) {
        item.activeClass = ` ${classStatus.STEPS_ACTIVE}`;
      } else {
        item.activeClass = '';
      }
    });
  }
}
