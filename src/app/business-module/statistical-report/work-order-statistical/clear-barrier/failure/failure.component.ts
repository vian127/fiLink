import {Component, OnInit} from '@angular/core';
import {TreeSelectorConfig} from '../../../../../shared-module/entity/treeSelectorConfig';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {QueryCondition} from '../../../../../shared-module/entity/queryCondition';
import {AreaModel} from '../../../../../core-module/model/facility/area.model';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityUtilService} from '../../../../facility';
import {WorkOrderConfig} from '../../../../work-order/work-order.config';
import {ChartUtil} from '../../../../../shared-module/util/chart-util';
import {AreaConfig} from '../../../../../shared-module/component/alarm/alarmSelectorConfig';
import {WorkOrderStatisticalService} from '../../../../../core-module/api-service/statistical/work-order-statistical';
import {Result} from '../../../../../shared-module/entity/result';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {getDeviceType, getErrorReason} from '../../work-order.config';
import {WorkOrderLanguageInterface} from '../../../../../../assets/i18n/work-order/work-order.language.interface';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import {differenceInCalendarDays} from 'date-fns';
import {TimeFormatEnum} from '../../../../../shared-module/enum/time-format.enum';

@Component({
  selector: 'app-failure',
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.scss']
})
export class FailureComponent implements OnInit {
  areaName = '';
  _dataSet = [];
  _dataSetMain = [];
  isLoading = true;
  pageBean: PageBean = new PageBean(10, 1, 1);
  tableConfig: TableConfig;
  queryCondition: QueryCondition = new QueryCondition();
  language: WorkOrderLanguageInterface;
  facilityLanguage: FacilityLanguageInterface;
  areaNodes: any;
  areaInfo: any = new AreaModel();
  hide = true;
  _dataset = [];
  workOrderConfig;
  barChartInstance;  // 饼图实例
  ringChartInstance; // 柱状图实例

  isVisible = false;
  selectUnitName;
  treeSelectorConfig: TreeSelectorConfig;
  treeNodes;
  deviceTypeData = [];
  deviceTypeList = [];
  dateRange = []; // 时间范围
  selsetDeviceTypeList = [];
  deviceTypeListValue = [];
  deviceAactive;
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
    this.language = this.$nzI18n.getLocaleData('workOrder');
    this.facilityLanguage = this.$nzI18n.getLocaleData('facility');
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
      {title: '', key: 'areaName', width: 200, searchable: false, searchConfig: {type: 'input'}},
      {title: this.language.other, key: '0', width: 180, searchable: true, searchConfig: {type: 'input'}},
      {title: this.language.personDamage, key: '1', width: 180, searchable: true, searchConfig: {type: 'input'}},
      {title: this.language.RoadConstruction, key: '2', width: 180, searchable: true, searchConfig: {type: 'input'}},
      {title: this.language.stealWear, key: '3', width: 180, searchable: true, searchConfig: {type: 'input'}},
      {title: this.language.clearBarrier, key: '4', width: 180, searchable: true, searchConfig: {type: 'input'}}
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
      scroll: {x: '1000px', y: '325px'},
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
          if (item.propertyName === '0') {
            item.propertyName = 'otherCount';
          }
          if (item.propertyName === '1') {
            item.propertyName = 'failureCount';
          }
          if (item.propertyName === '2') {
            item.propertyName = 'rodeWorkCount';
          }
          if (item.propertyName === '3') {
            item.propertyName = 'stealWearCount';
          }
          if (item.propertyName === '4') {
            item.propertyName = 'clearFailureCount';
          }
        });
        this.exportData.forEach(item => {
          Object.keys(item).forEach(key => {
            if (key === '0') {
              item['otherCount'] = item[key];
              delete item['0'];
            }
            if (key === '1') {
              item['failureCount'] = item[key];
              delete item['1'];
            }
            if (key === '2') {
              item['rodeWorkCount'] = item[key];
              delete item['2'];
            }
            if (key === '3') {
              item['stealWearCount'] = item[key];
              delete item['3'];
            }
            if (key === '4') {
              item['clearFailureCount'] = item[key];
              delete item['4'];
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
        this.$workOrder_Service.clearBarrierFailureExport(body).subscribe((res: Result) => {
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
    this.selsetDeviceTypeList = [];
    this.deviceTypeData = [];
    this.deviceTypeList.forEach(item => {
      this.selsetDeviceTypeList.push(item);
      this.deviceTypeData.push(item.value);
    });
    this.deviceAactive = this.selsetDeviceTypeList[0];
    // 创建查询条件
    this.queryCondition.bizCondition = {
      areaIdList: this.areaData,
      deviceTypeList: [this.deviceTypeData[0]],
      timeList: [this.startTime / 1000, this.endTime / 1000],
      procType: 'clear_failure'
    };
    this.refreshData();
  }


  /**
   * 设置图表数据
   */
  setChartData(data) {
    const dataMap = {};
    data.forEach(item => {
      Object.keys(item).forEach(_item => {
        if (_item !== 'areaId') {
          if (!dataMap[_item]) {
            dataMap[_item] = [];
          }
          dataMap[_item].push(item[_item]);
        }
      });
    });
    const ringName = [];
    const ringData = [];
    const barName = [];
    const barData = [];
    Object.keys(dataMap).forEach(key => {
      if (key !== 'areaName') {
        dataMap[key] = dataMap[key].reduce((a, b) => a + b);
        ringData.push({
          value: dataMap[key],
          name: getErrorReason(this.$nzI18n, key)
        });
        ringName.push(getErrorReason(this.$nzI18n, key));
        barData.push(dataMap[key]);
        barName.push(getErrorReason(this.$nzI18n, key));
      }
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
      title: `${this.facilityLanguage.select}${this.facilityLanguage.area}`,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.facilityLanguage.areaName, key: 'areaName', width: 100,
        },
        {
          title: this.facilityLanguage.level, key: 'areaLevel', width: 100,
        }
      ]
    };
  }


  onChange(timeResults) {
    this.startTime = new Date(CommonUtil.dateFmt(TimeFormatEnum.startTime, timeResults[0])).getTime();
    this.endTime = new Date(CommonUtil.dateFmt(TimeFormatEnum.endTime, timeResults[1])).getTime();
  }


  /**
   * tab切换获取设施类型
   */
  getDeviceType(data) {
    this.deviceTypeData = [];  // 置空
    for (const key in this.queryCondition.bizCondition) {
      if (this.queryCondition.bizCondition[key]) {
        delete this.queryCondition.bizCondition[key];  // 清空查询对象缓存
      }
    }
    this.deviceTypeData.push(data.value);
    this.queryCondition.bizCondition = {
      areaIdList: this.areaData,
      deviceTypeList: this.deviceTypeData,
      timeList: [this.startTime / 1000, this.endTime / 1000],
      procType: 'clear_failure'
    };
    this.refreshData();
  }


  /**
   * 请求数据
   */
  refreshData() {
    this.$workOrder_Service.querySalesOrderFailure(this.queryCondition).subscribe((res: Result) => {
      this.tableConfig.isLoading = false;
      this._dataSetMain = res.data;
      this._dataSet = res.data;
      this._dataSet.forEach(item => {
        this.selsetAreaData.forEach(_item => {
          if (item.areaId === _item.areaId) {
            item.areaName = _item.areaName;
          }
        });
      }, () => {
        this.tableConfig.isLoading = false;
      });
      this.hide = false;
      this.setChartData(res.data);
      this.exportData = CommonUtil.deepClone(this._dataSet);
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
