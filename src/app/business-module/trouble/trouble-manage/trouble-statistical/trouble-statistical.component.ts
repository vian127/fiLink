import { Component, OnInit } from '@angular/core';
import { FaultLanguageInterface } from '../../../../../assets/i18n/fault/fault-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {FacilityUtilService} from '../../../facility';
import {getDeviceType} from '../../../facility/share/const/facility.config';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {WorkOrderConfig} from '../../../work-order/work-order.config';
import {DeviceStatisticalService} from '../../../../core-module/api-service/statistical/device-statistical';
import {Result} from '../../../../shared-module/entity/result';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {ChartUtil} from '../../../../shared-module/util/chart-util';
import {ChartColor} from '../../../../shared-module/const/chart-color.config';

@Component({
  selector: 'app-trouble-statistical',
  templateUrl: './trouble-statistical.component.html',
  styleUrls: ['./trouble-statistical.component.scss']
})
export class TroubleStatisticalComponent implements OnInit {
  // 进度条
  ProgressShow = false;
  // 告警国际化引用
  public language: FaultLanguageInterface;
  // 国际化枚举
  enumeration = new WorkOrderConfig(this.$nzI18n); // 对选中的设施类型国际化
  // 表格分页配置
  pageBean: PageBean = new PageBean(10, 1, 1);
  // 表格查询条件
  queryCondition: QueryCondition = new QueryCondition();
  // 区域名称
  areaName = '';
  // 区域树配置
  treeSelectorConfig: TreeSelectorConfig;
  // 区域树数据
  treeNodes;
  // 区域选择器的显示隐藏
  isVisible = false;
  // 选择的区域信息集合
  selectAreaList;
  // 选择的区域Id信息集合
  selectAreaIDList;
  // 复选框选择设施类型集合
  deviceTypeList = [];
  // 下拉框数据
  selectInfo;
  // 选择设施的名称
  deviceName;
  // 时间选择控件的值
  rangDateValue = [];
  // 单选框的值
  radioValue;
  // 饼图实例
  ringChartInstance;
  // 饼图实例
  barChartInstance;
  hide = true;
  // loading状态
  showLoading = false;
  // 表格配置
  tableConfig: TableConfig;
  // 设施表格配置
  deviceTableConfig: TableConfig;
  // 表格数据
  __dataset = [];
  // 表格数据默认值，用于前台筛选用
  defaultTableValue = [];

  constructor(
    public $nzI18n: NzI18nService,
    private $facilityUtilService: FacilityUtilService,
    private $DeviceStatistical: DeviceStatisticalService,
  ) {
    this.language = this.$nzI18n.getLocaleData('fault');
  }
  ngOnInit() {
    this.$facilityUtilService.getArea().then((data) => {
      // 递归设置区域的选择情况
      this.$facilityUtilService.setAreaNodesStatus(data, null, null);
      this.treeNodes = data;
    });
    this.getTroubleType();
    this.initTreeSelectorConfig();
    this.initDeviceTable();
  }

  /**
   * 打开区域选择器
   */
  showAreaSelect() {
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isVisible = true;
  }

  /**
   * 选择区域
   * param event
   */
  selectDataChange(event) {
    this.selectAreaList = event;
    const areaNameList = [];
    if (event.length > 0) {
      this.selectAreaIDList = event.map(item => {
        areaNameList.push(item.areaName);
        return item.areaId;
      });
      this.areaName = areaNameList.join();
    } else {
      this.areaName = '';
      this.selectAreaIDList = [];
    }
    this.$facilityUtilService.setAreaNodesMultiStatus(this.treeNodes, this.selectAreaIDList);
  }
  /**
   * 初始化树配置
   */
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
      // 选择区域
      title: this.language.selectArea,
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
          title: this.language.areaLevel, key: 'areaLevel', width: 100,
        }
      ]
    };
  }
  /**
   * 故障统计类型
   */
  getTroubleType() {
    this.selectInfo = getDeviceType(this.$nzI18n) as any[];
    this.selectInfo.map(item => {
      item.value = item.code;
    });
  }
  rangValueChange(event) {
  }
  onOpenChange(event) {
    if (!event && this.rangDateValue.length) {
      // 这里深拷贝一个对象
      const temp = [new Date(this.rangDateValue[0].getTime()), new Date(this.rangDateValue[1].getTime())];
      if (this.rangDateValue.length === 2 && this.rangDateValue[0].getTime() > this.rangDateValue[1].getTime()) {
        // 当选时间的时候ui组件判断错误，赋值为开始的那个
        this.rangDateValue = [];
      } else {
        this.rangDateValue = [];
        this.rangDateValue = temp;
      }
    }
  }
  statistical() {
    this.ProgressShow = true;
    this.hide = false;
    this.showLoading = false;
    this.initTableConfig();
    const statisticalData = {};
      const deviceTypeList = [];
      this.deviceTypeList.map(item => {
        deviceTypeList.push(item.code);
      });
      statisticalData['deviceTypes'] = deviceTypeList;
      statisticalData['areaIds'] = this.selectAreaIDList;
      // this.chartTitle['text'] = '设施数量统计';
      // this.chartTitle['subtext'] = '各设施类型数量统计';
      // this.chartTitle['x'] = 'left';
      // console.log(this.chartTitle);
    this.$DeviceStatistical['queryDeviceNumber'](statisticalData).subscribe((result: Result) => {
      this.__dataset = result.data;
        this.__dataset.map(item => {
          this.selectAreaList.map(_item => {
            if (item.areaId === _item.areaId) {
              item.areaName = _item.areaName;
            }
          });
        });
        this.defaultTableValue = CommonUtil.deepClone(this.__dataset);
      // this.hide = false;
      this.showLoading = true;
      this.setChartData(result.data);
      this.ProgressShow = false;
    });
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
    const ringData = [];
    const ringName = [];
    const barData = [];
    const barName = [];
    Object.keys(dataMap).sort().forEach(key => {
      if (key !== 'areaName') {
        dataMap[key] = dataMap[key].reduce((a, b) => a + b);
          ringData.push({
            value: dataMap[key],
            name: this.enumeration.getFacilityTypeName(key),
            itemStyle: {
              color: ChartColor[key]
            }
          });
          ringName.push(this.enumeration.getFacilityTypeName(key));
          barData.push({
            value: dataMap[key], itemStyle: {
              color: ChartColor[key]
            }
          });
          barName.push(this.enumeration.getFacilityTypeName(key));
        }
    });
    setTimeout(() => this.ringChartInstance.setOption(ChartUtil.setRingChartOption(ringData, ringName)));
    setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarChartOption(barData, barName)));
  }

  /**
   * 获取饼图实例
   * param event
   */
  getRingChartInstance(event) {
    this.ringChartInstance = event;
  }
  /**
   * 获取柱状图实例
   * param event
   */
  getBarChartInstance(event) {
    this.barChartInstance = event;
  }

  /**
   * 初始化表格配置
   * param type
   */
  initTableConfig() {
    const columnConfigs = [{
      title: this.language.areaName, key: 'areaName', width: 200, searchable: true, searchConfig: {
        type: 'input'
      }
    }];
    const deviceTypeList = [];
    this.deviceTypeList.map(item => {
      deviceTypeList.push(item.code);
    });
    // 页面为设施数量统计
      deviceTypeList.forEach(item => {
        columnConfigs.push({
          title: this.enumeration.getFacilityTypeName(item), key: item, width: 200, searchable: true, searchConfig: {
            type: 'input'
          }
        });
      });
    this.tableConfig = {
      noIndex: true,
      showSearchExport: true,
      showSearchSwitch: true,
      showSearch: false,
      notShowPrint: true,
      noExportHtml: true,
      scroll: {x: '1000px', y: '325px'},
      columnConfig: columnConfigs,
      handleExport: (event) => {
        this.setExportParam(event);
      },
      handleSearch: (event) => {
        if (event && event.length) {
          // 有筛选数据时进入
          event.forEach(item => {
            this.__dataset = this.defaultTableValue.filter(items => {
              const index = (items[item.filterField] + '').indexOf(item.filterValue);
              return index !== -1;
            });
          });
        } else {
          // 重置表格
          this.__dataset = this.defaultTableValue;
        }
      }
    };
    this.tableConfig.columnConfig.push({
      title: '', searchable: true,
      searchConfig: {type: 'operate'}, key: '', width: 75, fixedStyle: {fixedRight: true, style: {right: '0px'}}
    });
  }
  /**
   * 设置导出信息
   * param data
   */
  setExportParam(data) {
    // {columnName: "配线架", propertyName: "060"}
    data.columnInfoList.forEach(item => {
      if (item.propertyName !== 'areaName') {
        item.propertyName = 'type' + item.propertyName;
      }
    });
    data.queryCondition = {
      filterConditions: [],
      pageCondition: {},
      sortCondition: {},
      bizCondition: {}
    };
    data['objectList'] = CommonUtil.deepClone(this.__dataset);
    const obj = {};
    const objList = [];
    data.objectList.forEach(item => {
      delete item.areaId;
      Object.keys(item).forEach(_item => {
        if (_item !== 'areaName') {
          obj['type' + _item] = item[_item];
        } else {
          obj[_item] = item[_item];
        }
      });
      objList.push(CommonUtil.deepClone(obj));
    });
    data.objectList = objList;
    // todo 添加
      this.$DeviceStatistical.exportDeviceCount(data).subscribe((result: Result) => {
        if (result.code === 0) {
          // this.$message.success(result.msg);
        } else {
          // this.$message.error(result.msg);
        }
      });
    }
  initDeviceTable() {
    this.deviceTableConfig = {
      noIndex: true,
      showPagination: true,
      showSizeChanger: true,
      showSearchSwitch: true,
      notShowPrint: true,
      isLoading: true,
      isDraggable: false,
      scroll: {x: '1000px', y: '325px'},
      columnConfig: [
        {
          title: '',
          type: 'render',
          key: 'selectedAlarmId',
          // renderTemplate: this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62
        },
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber
        },
        {title: this.language.name, width: 150, key: 'deviceName', searchable: true, searchConfig: {type: 'input'}, isShowSort: true},
        {
          title: this.language.time,
          width: 150,
          key: 'deviceType',
          searchable: true,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: getDeviceType(this.$nzI18n), label: 'label', value: 'code'},
          isShowSort: true
        },
        {
          title: this.language.addAlarmFiltration,
          width: 200,
          key: 'deviceCode',
          searchable: true,
          searchConfig: {type: 'input'},
          isShowSort: true
        },
        {title: this.language.delete, width: 200, key: 'areaName', searchable: true, searchConfig: {type: 'input'}, isShowSort: true},
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 75, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
      },
      handleSearch: (event) => {
        this.queryCondition.filterConditions = event;
        // this.queryDeviceList();
      }
    };
  }

  pageChange(event) {

  }

}
