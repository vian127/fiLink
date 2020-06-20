import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TreeSelectorConfig} from '../../../shared-module/entity/treeSelectorConfig';
import {PageBean} from '../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../shared-module/entity/tableConfig';
import {QueryCondition, SortCondition} from '../../../shared-module/entity/queryCondition';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {FacilityUtilService} from '../../facility';
import {WorkOrderConfig} from '../../work-order/work-order.config';
import {DeviceStatisticalService} from '../../../core-module/api-service/statistical/device-statistical';
import {Result} from '../../../shared-module/entity/result';
import {alarmNameColorEnum, getDeployStatus, getDeviceStatus, getDeviceType, getSensorValue} from '../../facility/share/const/facility.config';
import {ActivatedRoute} from '@angular/router';
import {ChartUtil} from '../../../shared-module/util/chart-util';
import {FacilityService} from '../../../core-module/api-service/facility/facility-manage';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {ChartColor} from '../../../shared-module/const/chart-color.config';
import {StatisticalLanguageInterface} from '../../../../assets/i18n/statistical/statistical-language.interface';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';

/**
 * 设施统计
 */
@Component({
  selector: 'app-device-statistical',
  templateUrl: './device-statistical.component.html',
  styleUrls: ['./device-statistical.component.scss']
})
export class DeviceStatisticalComponent implements OnInit {
  language: StatisticalLanguageInterface;
  // 区域名称
  areaName = '';
  // 表格数据默认值，用于前台筛选用
  defaultTableValue = [];
  // loading状态
  isLoading = true;
  // 国际化枚举
  enumeration = new WorkOrderConfig(this.$NZi18); // 对选中的设施类型国际化
  // 表格分页配置
  pageBean: PageBean = new PageBean(10, 1, 1);
  // 表格配置
  tableConfig: TableConfig;
  // 表格查询条件
  queryCondition: QueryCondition = new QueryCondition();
  hide = true;
  // 选择的设施数据
  selectDeviceData;
  // 表格数据
  __dataset = [];
  // 饼图实例
  barChartInstance;
  // 柱状图实例
  ringChartInstance;
  // 折线图实例
  LineChartInstance;
  // 区域选择器的显示隐藏
  isVisible = false;
  // 区域树配置
  treeSelectorConfig: TreeSelectorConfig;
  // 区域树数据
  treeNodes;
  // 复选框选择设施类型集合
  deviceTypeList = [];
  // 选择的区域信息集合
  selectAreaList;
  // 选择的区域Id信息集合
  selectAreaIDList;
  // 下拉框数据
  selectInfo;
  // 页面类型
  pageTypeTitle;
  // 单选框的值
  radioValue;
  // 表格表头
  tableHeader;
  // 选择设施的名称
  deviceName;
  // 设施表格数据
  deviceDataSet = [];
  // 设施表格配置
  deviceTableConfig: TableConfig;
  // 单选按钮的ID
  selectedAlarmId = null;
  // chart 标题
  chartTitle = {};
  // 有无统计数据
  isNoData = false;
  // 时间选择控件的值
  rangDateValue = [];
  // loading状态
  showLoading = false;
  // 进度条
  ProgressShow = false;
  // 单选按钮
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // 设施模板
  @ViewChild('deviceTemp') deviceTemp: TemplateRef<any>;

  constructor(private $NZi18: NzI18nService,
              private $facilityUtilService: FacilityUtilService,
              private $DeviceStatistical: DeviceStatisticalService,
              private $activatedRoute: ActivatedRoute,
              private $modal: NzModalService,
              private $facilityService: FacilityService,
              public $message: FiLinkModalService,
  ) {
  }

  ngOnInit() {
    this.language = this.$NZi18.getLocaleData('statistical');
    this.$facilityUtilService.getArea().then((data) => {
      // 递归设置区域的选择情况
      this.$facilityUtilService.setAreaNodesStatus(data, null, null);
      this.treeNodes = data;
      this.isCheckData(this.treeNodes);
    });
    this.initTreeSelectorConfig();
    this.getPageType();
    this.initDeviceTable();
  }

  /**
   * 给选择设施的列表附加id属性，防止在表格中勾选时树表不作出相应的变化
   * param data
   */
  isCheckData(data) {
    data.forEach(item => {
      item.id = item.areaId;
      if (item.children && item.children) {
        this.isCheckData(item.children);
      }
    });
  }

  /**
   * 获取页面标题
   */
  getPageType() {
    // this.pageTitleType = this.$activatedRoute.params.
    if (this.$activatedRoute.snapshot.url[0].path === 'device-statistical') {
      this.pageTypeTitle = 'queryDeviceNumber';
      this.getUserCanLookDeviceType();
    } else if (this.$activatedRoute.snapshot.url[0].path === 'device-status') {
      this.pageTypeTitle = 'queryDeviceStatus';
      this.tableHeader = getDeviceStatus(this.$NZi18);
      this.getUserCanLookDeviceType();
      // this.chartTitle['text'] = '设施状态统计';
      // this.chartTitle['subtext'] = this.radioValue + '状态统计';
      // this.chartTitle['x'] = 'left';
    } else if (this.$activatedRoute.snapshot.url[0].path === 'device-deploy') {
      this.pageTypeTitle = 'queryDeviceDeployStatus';
      this.tableHeader = getDeployStatus(this.$NZi18);
      this.getUserCanLookDeviceType();
    } else {
      this.pageTypeTitle = 'queryDeviceSensor';
      this.selectInfo = getSensorValue(this.$NZi18) as any[];
    }
    this.selectInfo.map(item => {
      item.value = item.code;
    });
  }

  /**
   * 获取当前用户能看到的设施类型
   */
  getUserCanLookDeviceType() {
    this.selectInfo = getDeviceType(this.$NZi18) as any[];
    const list = [];
    this.selectInfo.forEach(item => {
      if (SessionUtil.getUserInfo().role.roleDevicetypeList.filter(_item => _item.deviceTypeId === item.code).length > 0) {
        list.push(item);
      }
      // const list = SessionUtil.getUserInfo().role.roleDevicetypeList.filter(el => el.deviceTypeId === item.code);
    });
    this.selectInfo = list;
  }

  /**
   * 表格翻页
   * param event
   */
  _pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryDeviceList();
  }

  pageChange(event) {

  }

  /**
   * 初始化表格配置
   * param type
   */
  initTableConfig(type) {
    const columnConfigs = [{
      title: this.language.areaName, key: 'areaName', width: 200, searchable: true, searchConfig: {
        type: 'input'
      }
    }];
    const deviceTypeList = [];
    if (this.pageTypeTitle === 'queryDeviceNumber') {
      this.deviceTypeList.map(item => {
        deviceTypeList.push(item.code);
      });
    }
    // 页面为设施数量统计
    if (type === 'queryDeviceNumber') {
      deviceTypeList.forEach(item => {
        columnConfigs.push({
          title: this.enumeration.getFacilityTypeName(item), key: item, width: 200, searchable: true, searchConfig: {
            type: 'input'
          }
        });
      });
    } else if (type === 'queryDeviceStatus') {
      // 页面为设施状态统计
      this.tableHeader.forEach(item => {
        columnConfigs.push({
          title: item.label, key: item.code, width: 200, searchable: true, searchConfig: {
            type: 'input'
          }
        });
      });
    } else if (type === 'queryDeviceDeployStatus') {
      // 页面为设施部署统计
      this.tableHeader.forEach(item => {
        columnConfigs.push({
          title: item.label, key: item.code, width: 200, searchable: true, searchConfig: {
            type: 'input'
          }
        });
      });
    }
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
   * 点击统计按钮
   */
  statistical() {
    this.ProgressShow = true;
    this.hide = false;
    this.showLoading = false;
    this.initTableConfig(this.pageTypeTitle);
    const statisticalData = {};
    if (this.pageTypeTitle === 'queryDeviceNumber') {
      const deviceTypeList = [];
      this.deviceTypeList.map(item => {
        deviceTypeList.push(item.code);
      });
      statisticalData['deviceTypes'] = deviceTypeList;
      statisticalData['areaIds'] = this.selectAreaIDList;
      // this.chartTitle['text'] = '设施数量统计';
      // this.chartTitle['subtext'] = '各设施类型数量统计';
      // this.chartTitle['x'] = 'left';
      console.log(this.chartTitle);
    } else if (this.pageTypeTitle === 'queryDeviceSensor') {
      // statisticalData['deviceId'] = this.deviceSelect.deviceId;
      statisticalData['deviceId'] = this.selectedAlarmId;
      statisticalData['sensorType'] = this.radioValue;
      statisticalData['startTime'] = new Date(this.rangDateValue[0]).getTime();
      statisticalData['endTime'] = new Date(this.rangDateValue[1]).getTime();
    } else {
      statisticalData['deviceType'] = this.radioValue;
      statisticalData['areaIds'] = this.selectAreaIDList;
      // if (this.pageTypeTitle === 'queryDeviceStatus') {
      //   this.chartTitle['text'] = '设施状态统计';
      //   this.chartTitle['subtext'] = getDeviceType(this.$NZi18, this.radioValue) + '状态统计';
      //   this.chartTitle['x'] = 'left';
      // } else {
      //   this.chartTitle['text'] = '设施部署状态统计';
      //   this.chartTitle['subtext'] = getDeviceType(this.$NZi18, this.radioValue) + '部署状态统计';
      //   this.chartTitle['x'] = 'left';
      // }
    }
    this.$DeviceStatistical[this.pageTypeTitle](statisticalData).subscribe((result: Result) => {
      this.__dataset = result.data;
      if (this.pageTypeTitle !== 'queryDeviceSensor') {
        this.__dataset.map(item => {
          this.selectAreaList.map(_item => {
            if (item.areaId === _item.areaId) {
              item.areaName = _item.areaName;
            }
          });
        });
        this.defaultTableValue = CommonUtil.deepClone(this.__dataset);
      }
      // this.hide = false;
      this.showLoading = true;
      if (this.pageTypeTitle !== 'queryDeviceSensor') {
        this.setChartData(result.data);
      } else {
        // if (JSON.stringify(result.data) !== '{}') {
        this.isNoData = false;
        setTimeout(() => this.LineChartInstance.setOption(ChartUtil.setLineTimeChartOption(this.setLineChart(result.data))));
        // } else {
        //   this.isNoData = true;
        // }
      }
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
        if (this.pageTypeTitle === 'queryDeviceNumber') {
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
        } else {
          this.tableHeader.map(item => {
            if (item.code === key) {
              ringData.push({
                value: dataMap[key],
                name: item.label
              });
              ringName.push(item.label);
              barData.push(dataMap[key]);
              barName.push(item.label);
            }
          });
        }
      }
    });
    setTimeout(() => this.ringChartInstance.setOption(ChartUtil.setRingChartOption(ringData, ringName)));
    setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarChartOption(barData, barName)));
  }

  setLineChart(_data) {
    const data = [];
    Object.keys(_data).forEach(key => {
      const dataObj = {};
      const dataItem = [];
      let chartData = [];
      _data[key].forEach(_item => {
        chartData.push(CommonUtil.dateFmt('yyyy-MM-dd hh:mm:ss', new Date(_item.currentTime)));
        chartData.push(Number(_item[this.radioValue]));
        dataItem.push(chartData);
        dataObj['name'] = key;
        dataObj['value'] = dataItem;
        chartData = [];
      });
      data.push(dataObj);

    });
    return data;
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

  getLineChartInstance(event) {
    this.LineChartInstance = event;
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

  showDeviceSelect() {
    this.queryCondition.filterConditions = [];
    this.queryDeviceList();
    const modal = this.$modal.create({
      nzTitle: this.language.selectDevice,
      nzContent: this.deviceTemp,
      nzOkText: this.language.okText,
      nzCancelText: this.language.cancelText,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzMaskClosable: false,
      nzWidth: 1000,
      nzFooter: [
        {
          label: this.language.okText,
          onClick: ($event) => {
            if (this.selectDeviceData) {
              this.deviceName = this.selectDeviceData.deviceName;
              this.selectedAlarmId = this.selectDeviceData.deviceId;
            }
            modal.destroy();
          }
        },
        {
          label: this.language.cancelText,
          type: 'danger',
          onClick: () => {
            this.selectDeviceData = '';
            this.selectedAlarmId = null;
            modal.destroy();
          }
        },
      ]
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
          renderTemplate: this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62
        },
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber
        },
        {title: this.language.deviceName, width: 150, key: 'deviceName', searchable: true, searchConfig: {type: 'input'}, isShowSort: true},
        {
          title: this.language.deviceType,
          width: 150,
          key: 'deviceType',
          searchable: true,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: getDeviceType(this.$NZi18), label: 'label', value: 'code'},
          isShowSort: true
        },
        {
          title: this.language.FacilityNumber,
          width: 200,
          key: 'deviceCode',
          searchable: true,
          searchConfig: {type: 'input'},
          isShowSort: true
        },
        {title: this.language.ownAreaName, width: 200, key: 'areaName', searchable: true, searchConfig: {type: 'input'}, isShowSort: true},
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
        this.queryDeviceList();
      }
    };
  }

  queryDeviceList() {
    this.queryCondition.filterConditions.push({filterValue: ['001', '030', '210'], filterField: 'deviceType', operator: 'in'});
    this.deviceTableConfig.isLoading = true;
    this.$facilityService.deviceListByPage(this.queryCondition).subscribe((result: Result) => {
      this.deviceDataSet = result.data;
      this.deviceDataSet.map(item => {
        item.deviceType = getDeviceType(this.$NZi18, item.deviceType);
        item.deviceStatus = getDeployStatus(this.$NZi18, item.deviceStatus);
      });
      this.pageBean.Total = result.totalCount;
      this.deviceTableConfig.isLoading = false;
    });
  }

  selectedAlarmChange(event, data) {
    // this.deviceName = data.deviceName;
    // this.deviceSelect = data;
    this.selectDeviceData = data;
  }

  rangValueChange(event) {
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
    if (this.pageTypeTitle === 'queryDeviceNumber') {
      this.$DeviceStatistical.exportDeviceCount(data).subscribe((result: Result) => {
        if (result.code === 0) {
          this.$message.success(result.msg);
        } else {
          this.$message.error(result.msg);
        }
      });
    } else if (this.pageTypeTitle === 'queryDeviceStatus') {
      this.$DeviceStatistical.exportDeviceStatusCount(data).subscribe((result: Result) => {
        if (result.code === 0) {
          this.$message.success(result.msg);
        } else {
          this.$message.error(result.msg);
        }
      });
    } else if (this.pageTypeTitle === 'queryDeviceDeployStatus') {
      this.$DeviceStatistical.exportDeployStatusCount(data).subscribe((result: Result) => {
        if (result.code === 0) {
          this.$message.success(result.msg);
        } else {
          this.$message.error(result.msg);
        }
      });
    }
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

  /**
   * 判断按钮是否启用禁用
   */
  // 判断统计按钮 是否禁用
  disabledResources() {
    if (this.radioValue && this.deviceName && this.rangDateValue.length) {
      return '';
    } else {
      return 'disabled';
    }
  }
}
