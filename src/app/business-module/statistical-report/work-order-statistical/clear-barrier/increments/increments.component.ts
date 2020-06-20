import {Component, OnInit} from '@angular/core';
import {TreeSelectorConfig} from '../../../../../shared-module/entity/treeSelectorConfig';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {QueryCondition} from '../../../../../shared-module/entity/queryCondition';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityUtilService} from '../../../../facility';
import {WorkOrderConfig} from '../../../../work-order/work-order.config';
import {ChartUtil} from '../../../../../shared-module/util/chart-util';
import {WorkOrderStatisticalService} from '../../../../../core-module/api-service/statistical/work-order-statistical';
import {Result} from '../../../../../shared-module/entity/result';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {differenceInCalendarDays} from 'date-fns';
import {WorkOrderLanguageInterface} from '../../../../../../assets/i18n/work-order/work-order.language.interface';
import {getDeviceType} from '../../work-order.config';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import {TimeFormatEnum} from '../../../../../shared-module/enum/time-format.enum';

@Component({
  selector: 'app-increments',
  templateUrl: './increments.component.html',
  styleUrls: ['./increments.component.scss']
})
export class IncrementsComponent implements OnInit {
  language: FacilityLanguageInterface;
  wLanguage: WorkOrderLanguageInterface;
  areaName = '';
  isLoading = true;
  queryCondition: QueryCondition = new QueryCondition();
  hide = true;
  _dataset = [];
  workOrderConfig;
  isVisible = false;
  selectUnitName;
  treeSelectorConfig: TreeSelectorConfig;
  treeNodes;
  deviceTypeData = [];
  deviceTypeList = [];
  dateRange = []; // 时间范围
  // selsetDeviceTypeList = [];
  deviceTypeListValue = [];
  deviceAactive;
  startTime;
  endTime;
  selsetAreaData = [];
  areaData = [];
  selectInfo = [];
  lineChartInstance; // 折线图实例
  // 进度条
  ProgressShow = false;

  constructor(private $nzI18n: NzI18nService,
              private $facilityUtilService: FacilityUtilService,
              private $workOrder_Service: WorkOrderStatisticalService
  ) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.wLanguage = this.$nzI18n.getLocaleData('workOrder');
    this.workOrderConfig = new WorkOrderConfig(this.$nzI18n);
    this.$facilityUtilService.getArea().then((data) => {
      this.$facilityUtilService.setAreaNodesStatus(data, null, null);
      this.treeNodes = data;
    });
    this.initTreeSelectorConfig();
    this.getUserCanLookDeviceType();
  }

  /**
   * 获取当前用户能看到的设施类型
   */
  getUserCanLookDeviceType() {
    this.selectInfo = getDeviceType(this.$nzI18n) as any[];
    const list = [];
    this.selectInfo.forEach(item => {
      item.value = item.code;
      if (SessionUtil.getUserInfo().role.roleDevicetypeList.filter(_item => _item.deviceTypeId === item.code).length > 0) {
        list.push(item);
      }
      // const list = SessionUtil.getUserInfo().role.roleDevicetypeList.filter(el => el.deviceTypeId === item.code);
    });
    this.selectInfo = list;
  }

  /**
   * 统计
   */
  statistical() {
    this.ProgressShow = true;
    this.deviceTypeList.forEach(item => {
      this.deviceTypeData.push(item.value);
    });
    // 创建查询条件
    this.queryCondition.bizCondition = {
      areaIdList: this.areaData,
      deviceTypeList: this.deviceTypeData,
      timeList: [this.startTime, this.endTime],
      procType: 'clear_failure'
    };
    this.refreshData();
  }


  /**
   * 设置图表数据
   */
  setChartData(data) {
    const lineName = [];
    const lineData = [];
    data.forEach(item => {
      lineName.push(item.date);
      lineData.push(item.orderCount);
    });
    setTimeout(() => this.lineChartInstance.setOption(ChartUtil.setLineChartOption(lineData, lineName)));
  }


  /**
   * 获取折线图实例
   */
  getLineChartInstance(event) {
    this.lineChartInstance = event;
  }


  /**
   * 打开区域选择器
   */
  showAreaSelector() {
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isVisible = true;
  }

  selectDataChange(event) {
    this.selsetAreaData = event;
    let selectArr = [];
    const areaNameList = [];
    if (event.length > 0) {
      selectArr = event.map(item => {
        areaNameList.push(item.areaName);
        return item.areaId;
      });
      this.areaName = areaNameList.join();
    } else {
      this.areaName = '';
    }
    this.areaData = selectArr;
    this.$facilityUtilService.setAreaNodesMultiStatus(this.treeNodes, selectArr);
  }

  initTreeSelectorConfig() {
    const treeSetting = {
      check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: {'Y': '', 'N': ''},
      },
      data: {
        simpleData: {
          enable: false,
          idKey: 'areaId',
        },
        key: {
          name: 'areaName',
          children: 'children'
        },
      },
      view: {
        showIcon: false,
        showLine: false
      }
    };
    this.treeSelectorConfig = {
      title: `${this.language.select}${this.language.area}`,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.language.areaName, key: 'areaName', width: 100,
        },
        {
          title: this.language.level, key: 'areaLevel', width: 100,
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
    this.$workOrder_Service.queryWorkOrderIncrement(this.queryCondition).subscribe((res: Result) => {
      this.hide = false;
      this.setChartData(res.data);
      this.ProgressShow = false;
    });
  }


  /**
   * 禁用时间
   */

  disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    const tiem = this.getDateStr(-15);
    return differenceInCalendarDays(current, tiem) < 0 || differenceInCalendarDays(current, nowTime) > 0;
  };


  getDateStr(AddDayCount) {
    const time = new Date();
    const tiems = time.setDate(time.getDate() + AddDayCount); // 获取AddDayCount天后的日期
    return new Date(tiems);
  }


}
