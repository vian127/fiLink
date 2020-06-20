import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {classStatus, finalValue, routerJump} from '../../../model/const/const';
import {BasicInformationComponent} from '../../../components/basic-information/basic-information.component';
import {SecurityStrategyComponent} from '../security-strategy/security-strategy.component';
import {Result} from '../../../../../shared-module/entity/result';
import {ApplicationService} from '../../../server';

@Component({
  selector: 'app-security-add',
  templateUrl: './security-add.component.html',
  styleUrls: ['./security-add.component.scss']
})
export class SecurityAddComponent implements OnInit {
  isActiveSteps: number = 1;
  isShowButton = true;
  isOperation = false;
  isShowRow = true;
  @ViewChild('basicInfo') basicInfo: BasicInformationComponent;
  @ViewChild('strategyDetails') strategyDetails: SecurityStrategyComponent;
  // 步骤条的步骤常量值
  finalValue = finalValue;
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
    public $applicationService: ApplicationService,
    public $router: Router,
  ) {
  }

  ngOnInit() {
  }

  handChangeSteps(value) {
    this.isActiveSteps = value;
    this.handBasicSteps(value);
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
      this.strategyDetails.handNextSteps();
    }
    this.isActiveSteps = value + 1;
  }

  /**
   * 安防新增策略
   */
  securityPolicyAdd() {
    const strategyRefList = [
      {
        'refName': '信息发布设备1',
        'refType': '设备',
        'refId': 'j9uEiQHZprAvaUvCI7b',
      }
    ];
    const instructSecurity = {
      'refType': '1',
      'refId': 'j9uEieHZssAsaUvCI7b',
      'execOpera': '222'
    };
    const params = Object.assign({}
      , this.basicInfo.stepsFirstParams
      , {strategyRefList}
      , this.strategyDetails.stepsSecondParams
      , {instructSecurity});
    this.$applicationService.securityPolicyAdd(params).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$router.navigate([routerJump.SECURITY_POLICY_CONTROL], {}).then();
      }
    }, () => {
    });
  }

  /**
   * 数据提交
   */
  handStepsSubmit() {
    this.securityPolicyAdd();
  }

  /**
   * 取消操作
   */
  handCancelSteps() {
    this.$router.navigate([routerJump.SECURITY_WORKBENCH], {}).then();
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
