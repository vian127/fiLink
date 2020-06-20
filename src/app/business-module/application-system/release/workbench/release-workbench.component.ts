import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Result} from '../../../../shared-module/entity/result';
import {getExecStatus, getPolicyType} from '../../model/const/application.config';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {applicationFinal} from '../../model/const/const';
import {ApplicationService} from '../../server';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';

/**
 * 信息发布系统 工作台页面
 */
@Component({
  selector: 'app-release-workbench',
  templateUrl: './release-workbench.component.html',
  styleUrls: ['./release-workbench.component.scss']
})
export class ReleaseWorkbenchComponent implements OnInit, AfterViewInit {
  /**
   * 图片类型
   */
  public imageType = 'pip';
  /**
   * 便捷入口开关
   */
  public convenientEntranceSwitch: Boolean = false;
  /**
   * 分页序号
   */
  public current = 1;
  /**
   * 滑块绑定值
   */
  public sliderBoundValue = 1;
  /**
   * 列表请求参数
   */
  private queryCondition: QueryCondition = new QueryCondition();

  /**
   * 列表数据
   */
  public listData: any = [];

  /**
   * 详情数据
   */
  public detailData: any = {};

  /**
   * @param $router 路由跳转服务
   * @param $applicationService 后台接口服务
   * @param $nzI18n 路由跳转服务
   */
  constructor(
    public $router: Router,
    public $applicationService: ApplicationService,
    public $nzI18n: NzI18nService,
  ) {
  }

  public ngOnInit() {
  }

  public ngAfterViewInit(): void {
    this.onInitialization();
  }

  /**
   * 列表初始化
   */
  private onInitialization(): void {
    this.queryCondition.filterConditions = [
      {filterValue: '1', filterField: 'execStatus', operator: 'like'},
      {filterValue: '3', filterField: 'strategyType', operator: 'like'}
    ];
    this.$applicationService.getLightingPolicyList(this.queryCondition).subscribe((res: Result) => {
      // if (result.code === 0) {
      this.listData = _.cloneDeep(res.data);
      this.listData.forEach(listItem => {
        listItem.strategyType = getPolicyType(this.$nzI18n, listItem.strategyType);
        listItem.execStatus = getExecStatus(this.$nzI18n, listItem.execStatus);
        listItem.createTime = `${CommonUtil.dateFmt(applicationFinal.DATE_TYPE, new Date(listItem.createTime))}`;
        listItem.strategyStatus = listItem.strategyStatus === '1' ? true : false;
        listItem.effectivePeriodTime = `${CommonUtil.dateFmt(applicationFinal.DATE_TYPE, new Date(listItem.effectivePeriodStart))}
        -${CommonUtil.dateFmt(applicationFinal.DATE_TYPE, new Date(listItem.effectivePeriodEnd))}`;
      });
      // this.pageBean.Total = result.totalCount;
      // this.pageBean.pageIndex = result.pageNum;
      // this.pageBean.pageSize = result.size;
      // }
    }, () => {
      // this.tableConfig.isLoading = false;
    });
  }

  /**
   * 策略新增
   */
  public addStrategy(): void {
    this.$router.navigate(['business/application/release/policy-control/add'], {}).then();
  }

  /**
   * 跳转到策略列表
   */
  public goStrategyList(): void {
    this.$router.navigate(['business/application/release/policy-control'], {}).then();
  }

  /**
   * 展示便捷入口
   * @param index 被选中的数据下标
   */
  public handShowConvenient(index: number): void {
    this.convenientEntranceSwitch = !this.convenientEntranceSwitch;
    this.$applicationService.getReleasePolicyDetails(this.listData[index].strategyId).subscribe((res: Result) => {
      console.log(res);
      // if (res.code === 0) {
      this.detailData = res.data;
      this.detailData.strategyStatus = this.detailData.strategyStatus === '1';
      // }
    }, () => {
    });
  }

  /**
   *
   * 跳转策略详情
   */
  public strategyDetails(): void {
    this.$router.navigate(['business/application/release/details/6INpPlBUT2KJwRvn4xc'], {}).then();
  }

}
