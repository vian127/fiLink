import {Component, OnInit} from '@angular/core';
import {TreeSelectorConfig} from '../../../../../shared-module/entity/treeSelectorConfig';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {QueryCondition} from '../../../../../shared-module/entity/queryCondition';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityUtilService} from '../../../../facility';
import {WorkOrderConfig} from '../../../../work-order/work-order.config';
import {ChartUtil} from '../../../../../shared-module/util/chart-util';
import {WorkOrderStatisticalService} from '../../../../../core-module/api-service/statistical/work-order-statistical';
import {Result} from '../../../../../shared-module/entity/result';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {UserService} from '../../../../../core-module/api-service/user/user-manage';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {WorkOrderLanguageInterface} from '../../../../../../assets/i18n/work-order/work-order.language.interface';
import {differenceInCalendarDays} from 'date-fns';
import {TimeFormatEnum} from '../../../../../shared-module/enum/time-format.enum';

@Component({
  selector: 'app-clear-barrier-unit',
  templateUrl: './clear-barrier-unit.component.html',
  styleUrls: ['./clear-barrier-unit.component.scss']
})

export class ClearBarrierUnitComponent implements OnInit {
  language: FacilityLanguageInterface;
  wLanguage: WorkOrderLanguageInterface;
  isLoading = true;
  pageBean: PageBean = new PageBean(10, 1, 1);
  tableConfig: TableConfig;
  queryCondition: QueryCondition = new QueryCondition();
  hide = true;
  _dataset = [];
  workOrderConfig;
  isVisible = false;
  selectUnitName;
  treeSelectorConfig: TreeSelectorConfig;
  treeNodes;
  deviceTypeData = [];
  dateRange = []; // 时间范围
  selsetDeviceTypeList = [];
  treeSetting = {};
  deviceAactive;
  startTime;
  endTime;
  selectUnitIdData = [];
  areaData = [];
  barChartInstance; // 柱状图实例
  // 进度条
  ProgressShow = false;

  constructor(private $nzI18n: NzI18nService,
              private $facilityUtilService: FacilityUtilService,
              private $userService: UserService,
              private $workOrder_Service: WorkOrderStatisticalService
  ) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.wLanguage = this.$nzI18n.getLocaleData('workOrder');
    this.workOrderConfig = new WorkOrderConfig(this.$nzI18n);
    this.$userService.queryAllDepartment().subscribe((result: Result) => {
      this.treeNodes = result.data || [];
    });
    this.initTreeSelectorConfig();
  }


  /**
   * 统计
   */
  statistical() {
    this.ProgressShow = true;
    // 创建查询条件
    this.queryCondition.bizCondition = {
      accountabilityDeptList: this.selectUnitIdData,
      timeList: [this.startTime / 1000, this.endTime / 1000],
      procType: 'clear_failure'
    };
    this.refreshData();
  }


  /**
   * 设置图表数据
   */
  setChartData(data) {
    const lineData = [];
    const lineName = [];
    data.forEach(item => {
      lineData.push(item.departmentCount);
      lineName.push(item.departmentName);
    });
    setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarChartOption(lineData, lineName)));
  }


  /**
   * 获取折线图实例
   */
  getBarChartInstance(event) {
    this.barChartInstance = event;
  }


  /**
   * 打开区域选择器
   */
  showUnitSelector() {
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isVisible = true;
  }

  selectDataChange(event) {
    this.selectUnitName = '';
    const selectArr = event.map(item => {
      this.selectUnitName += `${item.deptName},`;
      return item.id;
    });
    this.selectUnitIdData = selectArr;
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, selectArr);
  }

  private initTreeSelectorConfig() {
    this.treeSetting = {
      check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: {'Y': '', 'N': ''},
      },
      data: {
        simpleData: {
          enable: true,
          idKey: 'id',
          pIdKey: 'deptFatherId',
          rootPid: null
        },
        key: {
          name: 'deptName',
          children: 'childDepartmentList'
        },
      },
      view: {
        showIcon: false,
        showLine: false
      }
    };
    this.treeSelectorConfig = {
      title: `${this.language.selectUnit}`,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: `${this.language.deptName}`, key: 'deptName', width: 100,
        },
        {
          title: `${this.language.deptLevel}`, key: 'deptLevel', width: 100,
        },
        {
          title: `${this.language.parentDept}`, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }


  onChange(timeResults) {
    this.startTime = new Date(CommonUtil.dateFmt(TimeFormatEnum.startTime, timeResults[0])).getTime();
    this.endTime = new Date(CommonUtil.dateFmt(TimeFormatEnum.endTime, timeResults[1])).getTime();
  }


  /**
   * 请求数据
   */
  refreshData() {
    this.$workOrder_Service.querySalesOrderUnits(this.queryCondition).subscribe((res: Result) => {
      this.hide = false;
      this.setChartData(res.data);
      this.ProgressShow = false;
    });
  }

  /**
   * 禁用时间
   * param {Date} current
   * returns {boolean}
   */
  disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) > 0;
  };
}
