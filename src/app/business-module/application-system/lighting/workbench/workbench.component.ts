import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzFormatEmitEvent} from 'ng-zorro-antd';
import {ChartsConfig} from '../../server/charts-config/charts-config';
import {applicationFinal, calculationFileSize, finalValue, routerJump} from '../../model/const/const';
import {ApplicationService} from '../../server';
import {Result} from '../../../../shared-module/entity/result';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {EquipmentCountList} from '../../model/lighting.model';

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.scss']
})
export class WorkbenchComponent implements OnInit {
  // 当前页
  pageNum = 1;
  // 总条数
  totalCount = 10;
  // 照明亮度
  convenientVal = 0;
  // 设备状态统计
  equipmentStatusData;
  // 存储单控和集控数量
  equipmentCountList: EquipmentCountList = {
    singleControllerCount: 0,
    centralControllerCount: 0
  };
  // 智慧杆数量
  multiFunctionPoleCount = 0;
  // 统计默认选中日
  selectedTags = '1';
  // 用电量统计默认选中日
  selectedElectricity = '4';
  // 卡片数据集合
  dataSet = [];
  // 亮灯率统计
  lightingRateData;
  // 便捷入口数据
  convenientData = {
    strategyId: '',
    strategyStatus: '1'
  };
  // 告警统计
  emergencyData;
  // 工单增量统计
  workOrderData;
  // 用电量统计
  electricity;
  // 用电量的起始时间
  dateRange = [];
  // 便捷入口
  isConvenient: Boolean = false;
  // 卡片的查询条件
  queryCondition: QueryCondition = new QueryCondition();
  // 应用范围的状态树
  nodes = [
    {
      title: '设备',
      key: '00',
      expanded: false,
      children: [
        {
          title: '设备1',
          key: '000',
          expanded: false
        },
        {
          title: '设备2',
          key: '001',
          expanded: false
        },
        {
          title: '设备3',
          key: '002',
          expanded: false
        }
      ]
    },
    {
      title: '分组',
      key: '01',
      expanded: false,
      children: [
        {
          title: '分组1',
          key: '010',
          expanded: false,
        },
        {
          title: '分组2',
          key: '011',
          expanded: false,
        },
        {
          title: '分组3',
          key: '012',
          expanded: false,
        }
      ]
    },
    {
      title: '回路',
      key: '02',
      isLeaf: false,
      children: [
        {
          title: '回路1',
          key: '020',
          expanded: false,
        },
        {
          title: '回路2',
          key: '021',
          expanded: false,
        },
        {
          title: '回路3',
          key: '022',
          expanded: false,
        }
      ]
    }
  ];

  constructor(
    public $router: Router,
    public $applicationService: ApplicationService,
  ) {
  }

  ngOnInit() {
    // 亮灯率统计
    this.getLightingRateStatisticsData(finalValue.STEPS_FIRST);
    // 用电量统计
    this.getElectConsStatisticsData();
    // 卡片初始化
    this.initWorkbenchList();
    // 统计初始化
    this.initCharts();
    // 单控和集控数量
    this.getControlEquipmentCount();
    // 智慧杆数量
    this.queryDeviceFunctionPole();
  }

  /**
   * 禁用和启用
   */
  switchChange(event) {
    const params = {
      'strategyType': finalValue.STEPS_FIRST,
      'operation': event ? finalValue.STEPS_FIRST : finalValue.STEPS_SECOND,
      'strategyIds': [this.convenientData.strategyId]
    };
    this.$applicationService.enableOrDisableStrategy(params).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.initWorkbenchList();
      }
    }, () => {

    });
  }

  /**
   * 选择年月日
   *
   */
  handleChange() {
    this.getLightingRateStatisticsData(this.selectedTags);
  }

  /**
   * 单控数量和集控数量
   */
  getControlEquipmentCount() {
    this.$applicationService.getControlEquipmentCount({}).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.equipmentCountList = result.data;
      }
    }, () => {

    });
  }

  /**
   * 智慧杆数量
   */
  queryDeviceFunctionPole() {
    this.$applicationService.queryDeviceFunctionPole({}).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.multiFunctionPoleCount = result.data.multiFunctionPoleCount;
      }
    }, () => {

    });
  }

  /**
   * 策略列表
   */
  initWorkbenchList() {
    const strategyType = {filterValue: '1', filterField: 'strategyType', operator: 'like'};
    this.queryCondition.filterConditions.push(strategyType);
    this.$applicationService.getLightingPolicyList(this.queryCondition).subscribe((result: Result) => {
      this.totalCount = result.totalCount;
      this.pageNum = result.pageNum;
      this.dataSet = result.data;
      this.dataSet.forEach(item => {
        item.startEndTime = `${CommonUtil.dateFmt(applicationFinal.DATE_TYPE, new Date(item.effectivePeriodStart))}
        至${CommonUtil.dateFmt(applicationFinal.DATE_TYPE, new Date(item.effectivePeriodEnd))}`;
      });
    }, () => {

    });
  }

  /**
   * 改变页数
   * @ param event
   */
  pageSizeChange(event) {
    this.queryCondition.pageCondition.pageSize = event;
    this.initWorkbenchList();
  }

  /**
   * 改变页码
   * @ param event
   */
  pageIndexChange(event) {
    this.queryCondition.pageCondition.pageNum = event;
    this.initWorkbenchList();
  }

  /**
   * 初始化统计数据格式
   */
  initCharts() {
    this.equipmentStatusData = ChartsConfig.equipmentStatus();
    this.emergencyData = ChartsConfig.emergency();
    this.workOrderData = ChartsConfig.workOrder();
  }

  /**
   * 用电量统计
   */
  getElectConsStatisticsData() {
    let startTime, endTime;
    if (this.dateRange && this.dateRange.length) {
      startTime = new Date(this.dateRange[0]).getTime();
      endTime = new Date(this.dateRange[1]).getTime();
    } else {
      // 默认时间范围为一周
      startTime = new Date().getTime() - calculationFileSize.week_time;
      endTime = new Date().getTime();
    }
    const params = {
      dimension: this.selectedElectricity,
      startTime: startTime,
      endTime: endTime
    };
    this.$applicationService.getElectConsStatisticsData(params).subscribe((result: ResultModel<object>) => {
      if (result.code === ResultCodeEnum.success) {
        this.electricity = ChartsConfig.electricity(result.data);
      }
    }, () => {

    });
  }

  /**
   * 切换日，周，月，季度，年
   */
  handleElectricityChange() {
    this.getElectConsStatisticsData();
  }

  /**
   * 选择时间查询
   * @ param event
   */
  onDateChange(event) {
    this.dateRange = event;
    this.getElectConsStatisticsData();
  }

  /**
   * 亮灯率统计
   * @ param type 年月日
   */
  getLightingRateStatisticsData(type) {
    const params = {
      dimension: type
    };
    this.$applicationService.getLightingRateStatisticsData(params).subscribe((result: ResultModel<object>) => {
      if (result.code === ResultCodeEnum.success) {
        this.lightingRateData = ChartsConfig.lightingRate(result.data, type);
      }
    }, () => {

    });
  }

  /**
   * 跳转到策略编辑页面
   */
  handStrategyDetails(item) {
    this.$router.navigate([`${routerJump.LIGHTING_POLICY_CONTROL_EDIT}`], {
      queryParams: {
        id: item.strategyId
      }
    }).then();
  }

  /**
   * 应用范围分组
   * @ param event
   */
  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
  }

  /**
   * 跳转到策略新增页面
   */
  public handGoPage() {
    this.$router.navigate([routerJump.LIGHTING_POLICY_CONTROL_ADD], {}).then();
  }

  /**
   * 跳转到策略页面
   */
  public handPolicyPage() {
    this.$router.navigate([routerJump.LIGHTING_POLICY_CONTROL], {}).then();
  }

  /**
   * 显示便捷入口
   */
  public handShowConvenient(item) {
    this.convenientData = item;
    this.isConvenient = !this.isConvenient;
  }
}
