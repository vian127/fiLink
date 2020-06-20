import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {finalValue, classStatus, applicationFinal, routerJump} from '../../../model/const/const';
import {Router, ActivatedRoute} from '@angular/router';
import {BasicInformationComponent} from '../../../components/basic-information/basic-information.component';
import {ApplicationService} from '../../../server';
import {StrategyDetailsComponent} from '../strategy-details/strategy-details.component';
import {LightingDetailsComponent} from '../details/lighting-details.component';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {ResultModel} from '../../../../../core-module/model/result.model';

@Component({
  selector: 'app-lighting-add',
  templateUrl: './lighting-add.component.html',
  styleUrls: ['./lighting-add.component.scss']
})
export class LightingAddComponent implements OnInit {
  isActiveSteps: number = 1;
  isShowButton = true;
  isEdit = false;
  strategyId = '';
  stepsFirstParams = {};
  stepsSecondParams = [];
  // 步骤条的步骤常量值
  finalValue = finalValue;
  @ViewChild('basicInfo') basicInfo: BasicInformationComponent;
  @ViewChild('strategyDetails') strategyDetails: StrategyDetailsComponent;
  @ViewChild('detailsInfo') detailsInfo: LightingDetailsComponent;
  // 中间值
  middleData = {};
  // 区分三个平台的常量
  applicationFinal = applicationFinal;
  @Input() isOperation = false;
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
        this.$applicationService.getLightingPolicyDetails(queryParams.id).subscribe((result: ResultModel<Object>) => {
          this.recordFmt(result.data);
        }, () => {

        });
      }
    });
  }

  /**
   * 处理数据的格式
   * @ param data
   */
  recordFmt(data) {
    this.strategyDetails.instructLightList = data.instructLightList;
    this.basicInfo.strategyRefList = data.strategyRefList;
    this.middleData = data;
    this.basicInfo.formStatus.resetData(data);
    this.basicInfo.selectUnitName = data.strategyRefList.map(item => item.refName).join(';');
    this.basicInfo.effectivePeriodStart = CommonUtil.dateFmt(applicationFinal.DATE_TYPE, new Date(data.effectivePeriodStart));
    this.basicInfo.effectivePeriodEnd = CommonUtil.dateFmt(applicationFinal.DATE_TYPE, new Date(data.effectivePeriodEnd));
  }

  /**
   * 上一步操作
   * @ param value
   */
  handPrevSteps(value) {
    this.isActiveSteps = value - 1;
  }

  /**
   * 下一步操作
   * @ param value
   */
  handNextSteps(value) {
    if (value === finalValue.STEPS_FIRST) {
      this.basicInfo.handNextSteps();
    } else if (value === finalValue.STEPS_SECOND) {
      const instructLightList = this.strategyDetails.instructLightList;
      this.middleData = Object.assign({},
        this.basicInfo.stepsFirstParams,
        {strategyRefList: this.basicInfo.strategyRefList},
        {instructLightList});
      this.detailsInfo.handNextSteps(this.middleData);
    } else if (value === finalValue.STEPS_THIRD) {

    }
    this.isActiveSteps = value + 1;
  }

  /**
   * 取消操作
   */
  handCancelSteps() {
    this.$router.navigate([routerJump.LIGHTING_WORKBENCH], {}).then();
  }

  /**
   * 新增策略
   * @ param params
   */
  lightPolicyAdd(params) {
    this.$applicationService.lightingPolicyAdd(params).subscribe((result: ResultModel<string>) => {
      if (result.code === '00000') {
        this.$router.navigate([routerJump.LIGHTING_POLICY_CONTROL], {}).then();
      }
    }, () => {
    });
  }

  /**
   * 编辑策略
   * @ param params
   */
  lightPolicyEdit(params) {
    this.$applicationService.modifyLightStrategy(params).subscribe((result: ResultModel<string>) => {
      if (result.code === '00000') {
        this.$router.navigate([routerJump.LIGHTING_POLICY_CONTROL], {}).then();
      }
    }, () => {
    });
  }

  /**
   * 数据提交
   */
  handStepsSubmit() {
    const instructLightList = this.strategyDetails.instructLightList;
    const stepsFirstParams = this.basicInfo.stepsFirstParams;
    const params = Object.assign({}
      , stepsFirstParams
      , {instructLightList});
    if (this.isEdit) {
      params.strategyId = this.strategyId;
      this.lightPolicyEdit(params);
    } else {
      this.lightPolicyAdd(params);
    }
  }

  /**
   * 点击步骤
   * @ param value
   */
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
