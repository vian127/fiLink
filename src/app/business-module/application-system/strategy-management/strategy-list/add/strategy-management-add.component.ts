import {Component, OnInit, ViewChild} from '@angular/core';
import {finalValue, classStatus, applicationFinal, routerJump} from '../../../model/const/const';
import {Router, ActivatedRoute} from '@angular/router';
import {BasicInformationComponent} from '../../../components/basic-information/basic-information.component';
import {ApplicationService} from '../../../server';
import {StrategyManagementDetailsComponent} from '../details/strategy-management-details.component';
import {Result} from '../../../../../shared-module/entity/result';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {ResultCodeEnum} from '../../../../../core-module/model/result-code.enum';

@Component({
  selector: 'app-strategy-management-add',
  templateUrl: './strategy-management-add.component.html',
  styleUrls: ['./strategy-management-add.component.scss']
})
export class StrategyManagementAddComponent implements OnInit {
  // 默认选中的步骤
  isActiveSteps = 1;
  // 判断是否编辑
  isEdit = false;
  // 策略id
  strategyId = '';
  // 存储策略数据
  middleData = {};
  // 存储基本信息的数据对象
  stepsFirstParams = {};
  // 步骤条的步骤常量值
  finalValue = finalValue;
  // 操作基本信息页面的方法
  @ViewChild('basicInfo') basicInfo: BasicInformationComponent;
  // 操作策略详情页面的方法
  @ViewChild('strategyDetails') strategyDetails: StrategyManagementDetailsComponent;
  // 操作完成页面的方法
  @ViewChild('detailsInfo') detailsInfo;
  // 区分三个平台的常量
  applicationFinal = applicationFinal;
  // 控制详情页面编辑，删除，开关等显隐
  isOperation = false;
  // 步骤条数据
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
        this.$applicationService.getLinkageDetails(queryParams.id).subscribe((result: Result) => {
          this.dataFmt(result.data);
          // instructLightListFmt(result.data.instructLightList);
        }, () => {

        });
      }
    });
  }

  /**
   * 数据格式
   */
  dataFmt(data) {
    this.middleData = data;
    this.basicInfo.selectUnitName = data.strategyRefList.map(item => item.refName).join(';');
    // data.instructLight.switchLight = data.instructLight.switchLight === '1' ? true : false;
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
   * 下一步操作
   * @ param value
   */
  handNextSteps(value) {
    if (value === finalValue.STEPS_FIRST) {
      this.basicInfo.handNextSteps();
    } else if (value === finalValue.STEPS_SECOND) {
      this.middleData = this.submitDataFmt();
      console.log(this.middleData);
      this.detailsInfo.handNextSteps(this.middleData);
    }
    this.isActiveSteps = value + 1;
  }

  /**
   * 取消操作
   */
  handCancelSteps() {
    this.$router.navigate([routerJump.STRATEGY], {}).then();
  }

  /**
   * 新增策略
   * @ param params
   */
  linkageAdd(params) {
    this.$applicationService.addLinkageStrategy(params).subscribe((result: ResultModel<string>) => {
      if (result['code'] === ResultCodeEnum.success) {
        this.$router.navigate([routerJump.STRATEGY], {}).then();
      }
    }, () => {
    });
  }

  /**
   * 编辑策略
   * @ param params
   */
  linkageEdit(params) {
    this.$applicationService.modifyLinkageStrategy(params).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$router.navigate([routerJump.STRATEGY], {}).then();
      }
    }, () => {
    });
  }

  /**
   * 数据提交
   */
  handStepsSubmit() {
    const params = this.submitDataFmt();
    if (this.strategyDetails.targetType === '004') {
      params.linkageStrategyInfo.instructLightBase = {};
    } else {
      params.linkageStrategyInfo.instructInfoBase.switchLight =
        params.linkageStrategyInfo.instructInfoBase.switchLight ? '1' : '0';
      params.linkageStrategyInfo.instructInfoBase = {};
    }
    if (this.isEdit) {
      params.strategyId = this.strategyId;
      this.linkageEdit(params);
    } else {
      this.linkageAdd(params);
    }
  }

  /**
   * 处理需要提交的数据格式
   */
  submitDataFmt() {
    const instructLightBase = this.strategyDetails.instructLightBase;
    const instructInfoBase = this.strategyDetails.instructInfoBase;
    const linkageStrategyInfo = Object.assign(this.strategyDetails.linkageStrategyInfo,
      {instructLightBase}
      , {instructInfoBase});
    const data = Object.assign({}
      , this.basicInfo.stepsFirstParams
      , {linkageStrategyInfo});
    return data;
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
