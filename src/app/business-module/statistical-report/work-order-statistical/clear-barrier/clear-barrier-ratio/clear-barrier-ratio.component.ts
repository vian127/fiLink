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
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {WorkOrderLanguageInterface} from '../../../../../../assets/i18n/work-order/work-order.language.interface';
import {getDeviceType} from '../../../../facility/share/const/facility.config';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import {differenceInCalendarDays} from 'date-fns';
import {TimeFormatEnum} from '../../../../../shared-module/enum/time-format.enum';

@Component({
  selector: 'app-clear-barrier-ratio',
  templateUrl: './clear-barrier-ratio.component.html',
  styleUrls: ['./clear-barrier-ratio.component.scss']
})
export class ClearBarrierRatioComponent implements OnInit {
  language: FacilityLanguageInterface;
  wLanguage: WorkOrderLanguageInterface;
  areaName = '';
  _dataSet = [];
  _dataSetMain = [];
  isLoading = true;
  pageBean: PageBean = new PageBean(10, 1, 1);
  tableConfig: TableConfig;
  queryCondition: QueryCondition = new QueryCondition();
  hide = true;
  workOrderConfig;
  barChartInstance;  // 饼图实例
  ringChartInstance; // 柱状图实例
  isVisible = false;
  selectUnitName;
  treeSelectorConfig: TreeSelectorConfig;
  treeNodes;
  deviceTypeData: string = null;
  dateRange = []; // 时间范围
  startTime;
  endTime;
  selsetAreaData = [];
  areaData = [];
  exportData = [];
  selectInfo = [];
  // 进度条
  ProgressShow = false;

  constructor(private $nzI18n: NzI18nService,
              private $facilityUtilService: FacilityUtilService,
              private $workOrder_Service: WorkOrderStatisticalService,
              private $message: FiLinkModalService
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

  pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
  }

  initTableConfig() {
    const columnConfigs = [
      {title: '', key: 'areaName', width: 300, searchable: false, searchConfig: {type: 'input'}},
      {title: this.wLanguage.quantityOfClearBarrier, key: 'count', width: 350, searchable: true, searchConfig: {type: 'input'}},
      {title: this.wLanguage.proportionOfClearBarrier, key: 'percent', width: 300, searchable: true, searchConfig: {type: 'input'}}
    ];
    columnConfigs.push({
      title: '', searchable: true,
      searchConfig: {type: 'operate'}, key: '', width: 120
    });
    this.tableConfig = {
      noIndex: true,
      noExportHtml: true,
      showSearchSwitch: true,
      showSearch: false,
      notShowPrint: true,
      showSearchExport: true,
      scroll: {x: '900px', y: '325px'},
      columnConfig: columnConfigs,
      handleSearch: (event) => {
        this._dataSet = this._dataSetMain;  // 重置到原始数据
        if (event.length > 0) {    // 数据过滤
          event.forEach(item => {
            this._dataSet = this._dataSet.filter(_item => {
              return _item[item.filterField] + '' === item.filterValue;
            });
          });
        } else {    // 重置
          this._dataSet = this._dataSetMain;
        }
      },
      handleExport: (event) => {
        const columnInfoList = event.columnInfoList;
        columnInfoList.forEach(item => {
          if (item.propertyName === 'count') {
            item.propertyName = 'areaProcCount';
          }
          if (item.propertyName === 'percent') {
            item.propertyName = 'areaProcPercent';
          }
        });
        const data = JSON.parse(JSON.stringify(this.exportData));
        data.forEach(item => {
          Object.keys(item).forEach(key => {
            if (key === 'count') {
              item['areaProcCount'] = item[key];
              delete item['count'];
            }
            if (key === 'percent') {
              item['areaProcPercent'] = item[key];
              delete item['percent'];
            }
          });
        });
        // 导出参数
        const body = {
          queryCondition: new QueryCondition(),
          columnInfoList: columnInfoList,
          excelType: event.excelType,
          objectList: this.exportData
        };
        this.$workOrder_Service.clearBarrierAreaPercentExport(body).subscribe((res: Result) => {
          if (res.code === 0) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    };
  }

  /**
   * 统计
   */
  statistical() {
    this.ProgressShow = true;
    this.initTableConfig();
    this.tableConfig.isLoading = true;
    // 创建查询条件
    this.queryCondition.bizCondition = {
      areaIdList: this.areaData,
      deviceTypeList: [this.deviceTypeData],
      timeList: [this.startTime / 1000, this.endTime / 1000],
      procType: 'clear_failure'
    };
    this.refreshData();
  }


  /**
   * 设置图表数据
   */
  setChartData(data) {
    const ringName = [];
    const ringData = [];
    const barName = [];
    const barData = [];
    data.forEach(item => {
      ringName.push(item.areaName);
      barName.push(item.areaName);
      ringData.push({
        value: item.count,
        name: item.areaName
      });
      barData.push(item.count);
    });
    setTimeout(() => this.ringChartInstance.setOption(ChartUtil.setRingChartOption(ringData, ringName)));
    setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarChartOption(barData, barName)));
  }


  /**
   * 获取饼图实例
   */
  getRingChartInstance(event) {
    this.ringChartInstance = event;
  }

  /**
   * 获取柱状图实例
   */
  getBarChartInstance(event) {
    this.barChartInstance = event;
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
    let total = 0;
    this.$workOrder_Service.querySalesOrderAreaPercent(this.queryCondition).subscribe((res: Result) => {
      this.tableConfig.isLoading = false;
      this._dataSet = res.data;
      this._dataSet.forEach(item => {
        item.count = item[item.areaId];  // 工单数量
        total = total + item[item.areaId];  // 工单总量
        this.selsetAreaData.forEach(_item => {
          if (item.areaId === _item.areaId) {
            item.areaName = _item.areaName;
          }
        });
      }, () => {
        this.tableConfig.isLoading = false;
      });
      setTimeout(() => {
        this._dataSet.forEach(item => {
          if (!total) {
            item.percent = 0;
          } else {
            item.percent = (((item[item.areaId] / total) * 100)).toFixed(2) + '%';
          }
        }, 0);
      });
      this.hide = false;
      this._dataSetMain = this._dataSet;
      this.exportData = this._dataSet;
      this.setChartData(this._dataSet);
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
