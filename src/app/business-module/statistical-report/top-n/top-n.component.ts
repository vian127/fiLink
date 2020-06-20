import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TreeSelectorConfig} from '../../../shared-module/entity/treeSelectorConfig';
import {PageBean} from '../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../shared-module/entity/tableConfig';
import {PageCondition, QueryCondition} from '../../../shared-module/entity/queryCondition';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityUtilService} from '../../facility';
import {Result} from '../../../shared-module/entity/result';
import {getAlarmType, getDeployStatus, getDeviceType, getSensorValue} from '../../facility/share/const/facility.config';
import {ActivatedRoute, Router} from '@angular/router';
import {ChartUtil} from '../../../shared-module/util/chart-util';
import {FacilityService} from '../../../core-module/api-service/facility/facility-manage';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {AlarmService} from '../../../core-module/api-service/alarm/alarm-manage';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {TopNService} from '../../../core-module/api-service/statistical/top-n';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {differenceInCalendarDays} from 'date-fns';
import {StatisticalLanguageInterface} from '../../../../assets/i18n/statistical/statistical-language.interface';
import {RouterConst} from '../statistical.config';
import {TimeFormatEnum} from '../../../shared-module/enum/time-format.enum';

/**
 * top统计
 */
@Component({
  selector: 'app-top-n',
  templateUrl: './top-n.component.html',
  styleUrls: ['./top-n.component.scss']
})
export class TopNComponent implements OnInit {
  // 表格默认值，提供前端筛选用
  defaultTableValue = [];
  // eChart的title
  chartTitle = {};
  // 选择的区域名称
  areaName;
  // 树配置
  treeSelectorConfig: TreeSelectorConfig;
  // 区域树数据
  treeNodes;
  // 区域选择器的显示隐藏
  isVisible = false;
  // 选择的区域信息集合
  selectAreaList = [];
  // 选择的区域Id信息集合
  selectAreaIDList = [];
  // 单选框的值
  radioValue;
  // 单选框传感值
  radioSensor;
  // 单选下拉框数据
  radioSelectInfo;
  // 传感值单选框数据
  radioSensorSelectInfo;
  // 页面类型
  pageTypeTitle;
  // 下拉框数据
  selectInfo = [];
  // 告警下拉框数据
  alarmList = [];
  // 时间选择
  rangDateValue = [];
  // 统计数量
  statisticalNumber = '10';
  // 柱状图实例
  barChartInstance;
  // eChart显示隐藏
  hide = false;
  // 最大值
  topMaxData;
  // 最小值
  topMinData;
  // 控制最大最小值开关
  switchValue = true;
  // 表格数据
  _dataset = [];
  // 表格分页配置
  pageBean: PageBean = new PageBean(5, 1, 1);
  // 表格配置
  tableConfig: TableConfig;
  // 为传感值统计时的数据
  maxAndMindata;
  // 是否显示loading状态
  showLoading = true;
  // 是否有统计数据
  hasData = false;
  // 选择的设施
  deviceList = [];
  // 统计国际化
  statisticalLanguage: StatisticalLanguageInterface;
  // 枚举值
  ConstValue = RouterConst;
  // 统计率判断
  portchange = false;
  // 进度条
  ProgressShow = false;

  // 单选框
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  @ViewChild('deviceTemp') deviceTemp: TemplateRef<any>;

  constructor(private $NZi18: NzI18nService,
              private $facilityUtilService: FacilityUtilService,
              private $activatedRoute: ActivatedRoute,
              private $modal: FiLinkModalService,
              private $facilityService: FacilityService,
              private $alarmService: AlarmService,
              private $topNService: TopNService,
              private $router: Router
  ) {
  }

  ngOnInit() {
    this.statisticalLanguage = this.$NZi18.getLocaleData('statistical');
    this.$facilityUtilService.getArea().then((data) => {
      // 递归设置区域的选择情况
      this.$facilityUtilService.setAreaNodesStatus(data, null, null);
      this.treeNodes = data;
      this.addAreaId(this.treeNodes);
    });
    this.initTreeSelectorConfig();
    this.getUserCanLookDeviceType();
    this.getPageType();
    this.initTableConfig();
  }

  /**
   * 给区域添加iD属性，
   * param data
   */
  addAreaId(data) {
    data.forEach(item => {
      item['id'] = item.areaId;
      if (item.children) {
        this.addAreaId(item.children);
      }
    });
  }

  /**
   * 表格翻页事件
   */
  pageChange(event) {
    this.pageBean.pageIndex = event.pageIndex;
    this.pageBean.pageSize = event.pageSize;
    this.showData();
  }

  /**
   * 获取页面标题
   */
  getPageType() {
    // this.pageTitleType = this.$activatedRoute.params.
    if (this.$activatedRoute.snapshot.url[0].path === RouterConst.TopLock) {
      // 开锁次数统计
      this.pageTypeTitle = RouterConst.TopLock;
      this.getUserCanLookDeviceType();
      this.radioSelectInfo = this.radioSelectInfo.filter(item => {
        if (item.code === RouterConst.Optical_Box || item.code === RouterConst.Well || item.code === RouterConst.OUTDOOR_CABINET) {
          return item;
        }
      });
    } else if (this.$activatedRoute.snapshot.url[0].path === RouterConst.TopAlarm) {
      // 告警次数统计
      this.pageTypeTitle = RouterConst.TopAlarm;
      this.getUserCanLookDeviceType();
      this.refAlarmList();
    } else if (this.$activatedRoute.snapshot.url[0].path === RouterConst.TopWorkOrder) {
      // 销障工单统计
      this.pageTypeTitle = RouterConst.TopWorkOrder;
      this.getUserCanLookDeviceType();
    } else if (this.$activatedRoute.snapshot.url[0].path === RouterConst.TopSensor) {
      // 传感数值统计
      this.pageTypeTitle = RouterConst.TopSensor;
      this.getUserCanLookDeviceType();
      this.radioSelectInfo = this.radioSelectInfo.filter(item => {
        if (item.code === RouterConst.Optical_Box || item.code === RouterConst.Well || item.code === RouterConst.OUTDOOR_CABINET) {
          return item;
        }
      });
      this.radioSensorSelectInfo = getSensorValue(this.$NZi18) as [];
      this.radioSensorSelectInfo = this.radioSensorSelectInfo.filter(item => {
        if (item.code === 'humidity' || item.code === 'temperature') {
          return item;
        }
      });
    } else {
      // 端口资源使用率统计
      this.pageTypeTitle = RouterConst.TopPort;
      this.selectInfo = getDeviceType(this.$NZi18) as any[];
      this.selectInfo = this.selectInfo.filter(item => {
        if (item.code === RouterConst.Optical_Box
          || item.code === RouterConst.OUTDOOR_CABINET || item.code === RouterConst.Distribution_Frame) {
          const list = SessionUtil.getUserInfo().role.roleDevicetypeList.filter(el => el.deviceTypeId === item.code);
          list.length > 0 ? item.isDisable = false : item.isDisable = true;
          item.value = item.code;
          return item;
        }
      });
    }
    this.radioSelectInfo.map(item => {
      item.value = item.code;
    });
  }

  /**
   * 打开区域选择器
   */
  showAreaSelect() {
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isVisible = true;
  }

  /**
   * 初始化区域树配置
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
      title: this.statisticalLanguage.selectArea,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.statisticalLanguage.areaName, key: 'areaName', width: 100,
        },
        {
          title: this.statisticalLanguage.areaLevel, key: 'areaLevel', width: 100,
        }
      ]
    };
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
   * 获取当前用户能看到的设施类型
   */
  getUserCanLookDeviceType() {
    this.radioSelectInfo = getDeviceType(this.$NZi18) as any[];
    const list = [];
    this.radioSelectInfo.forEach(item => {
      if (SessionUtil.getUserInfo().role.roleDevicetypeList.filter(_item => _item.deviceTypeId === item.code).length > 0) {
        list.push(item);
      }
      // const list = SessionUtil.getUserInfo().role.roleDevicetypeList.filter(el => el.deviceTypeId === item.code);
    });
    this.radioSelectInfo = list;
  }

  /**
   * 获取关联告警下拉框数据
   */
  refAlarmList() {
    const alarmQueryCondition = new QueryCondition();
    alarmQueryCondition.pageCondition = new PageCondition(1, 20);
    this.$alarmService.queryAlarmCurrentSetList(alarmQueryCondition).subscribe((result: Result) => {
      const data = result.data;
      const arr = [];
      data.forEach(item => {
        if (item.alarmCode !== 'orderOutOfTime') {
          arr.push({value: item.alarmCode, label: getAlarmType(this.$NZi18, item.alarmCode)});
        }
      });
      this.selectInfo = arr;
    });
  }

  /**
   * 时间控件值改变监听事件
   * param event
   */
  rangValueChange(event) {
  }

  /**
   * 打开时间选择控件
   * param event
   */
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
   * 获取eChart实例
   * param event eChart实例
   */
  getBarChartInstance(event) {
    this.barChartInstance = event;
  }

  /**
   * 统计
   */
  statistical() {
    this.ProgressShow = true;
    this.showLoading = false;
    const statisticalData = {};
    statisticalData['topCount'] = Number(this.statisticalNumber);
    statisticalData['topTotal'] = Number(this.statisticalNumber);
    statisticalData['areaIdList'] = this.selectAreaIDList;
    statisticalData['deviceType'] = this.radioValue;
    // 传感数值统计
    if (this.pageTypeTitle === RouterConst.TopSensor) {
      this.querySensorStatistical(statisticalData);
      // 销障工单统计
    } else if (this.pageTypeTitle === RouterConst.TopWorkOrder) {
      this.queryWorkOrder(statisticalData);
      // 告警次数统计
    } else if (this.pageTypeTitle === RouterConst.TopAlarm) {
      this.queryAlarmStatistical(statisticalData);
      // 端口资源使用率统计
    } else if (this.pageTypeTitle === RouterConst.TopPort) {
      this.queryOdnDeviceStatistical(statisticalData);
      // 开锁次数统计
    } else {
      this.queryLockStatistical(statisticalData);
    }
  }

  /**
   * 页面为传感器值TopN时，显示最高或最低的开关
   * param event 开关的true 为最高
   */
  clickSwitch(event) {
    if (event) {
      const deviceIds = [];
      if (this.topMaxData.length > 0) {
        this.topMaxData.forEach(item => deviceIds.push(item.deviceId));
        this.queryDeviceIds(deviceIds.reverse(), this.topMaxData);
        // setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarsChartOption(this.topMaxData)), 500);
      } else {
        this.hide = true;
        this.showLoading = true;
        this.hasData = false;
      }
    } else {
      if (this.topMinData.length > 0) {
        const deviceIds = [];
        this.topMinData.forEach(item => deviceIds.push(item.deviceId));
        this.queryDeviceIds(deviceIds.reverse(), this.topMinData);
        // setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarsChartOption(this.topMinData)), 500);
      } else {
        this.hide = true;
        this.showLoading = true;
        this.hasData = false;
      }
    }
  }

  /**
   * 展示数据
   */
  showData() {
    this.pageBean.Total = this._dataset.length;
    const startIndex = this.pageBean.pageSize * (this.pageBean.pageIndex - 1);
    const endIndex = startIndex + this.pageBean.pageSize - 1;
    this._dataset = this._dataset.filter((item, index) => {
      return index >= startIndex && index <= endIndex;
    });
  }

  /**
   * 初始化表格配置
   */
  initTableConfig() {
    this.tableConfig = {
      noIndex: true,
      notShowPrint: true,
      showSearchExport: true,
      isDraggable: false,
      noExportHtml: true,
      scroll: {x: '538px', y: '600px'},
      columnConfig: [
        {
          // 排名
          type: 'serial-number', width: 50, title: this.statisticalLanguage.ranking
        },
        {
          // 设施名称
          title: this.statisticalLanguage.deviceName, width: 90, key: 'deviceName', searchable: true, searchConfig: {
            type: 'input'
          },
          type: 'render', renderTemplate: this.deviceTemp
        },
        {
          title: this.statisticalLanguage.ownAreaName, width: 95, key: 'areaName', searchable: true, searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.address, width: 95, key: 'address', searchable: true, searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.accountabilityUnitName,
          width: 95,
          key: 'accountabilityUnitName',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.deployStatus, key: 'status', searchable: true, searchConfig: {
            type: 'input'
          }
        }
      ],
      handleExport: (event) => {
        this.setExport(event);
      },
      handleSearch: (event) => {
        if (event && event.length) {
          // 有筛选数据时进入
          event.forEach(item => {
            this._dataset = this._dataset.filter(items => {
              return items[item.filterField] + '' === item.filterValue;
            });
          });
        } else {
          // 重置表格
          this._dataset = this.defaultTableValue;
        }
      }
    };
  }

  setExport(data) {
    data.columnInfoList.unshift({propertyName: 'ranking', columnName: this.statisticalLanguage.ranking});
    data.queryCondition = {
      filterConditions: [],
      pageCondition: {},
      sortCondition: {},
      bizCondition: {}
    };
    data['objectList'] = CommonUtil.deepClone(this._dataset);
    data.objectList.forEach((item, index) => {
      item.ranking = index + 1;
    });
    if (this.pageTypeTitle === RouterConst.TopWorkOrder) {
      this.$topNService.procClearTopListStatisticalExport(data).subscribe((result: Result) => {
      });
    } else if (this.pageTypeTitle === RouterConst.TopLock) {
      this.$topNService.exportUnlockingTopNum(data).subscribe((result: Result) => {
        this.$modal.success(result.msg);
      });
    } else if (this.pageTypeTitle === RouterConst.TopSensor) {
      this.$topNService.exportDeviceSensorTopNum(data).subscribe((result: Result) => {
        this.$modal.success(result.msg);
      });
    } else if (this.pageTypeTitle === RouterConst.TopPort) {
      this.$topNService.exportPortTopNumber(data).subscribe((result: Result) => {
        this.$modal.success(result.msg);
      });
    } else {
      this.$topNService.exportDeviceTop(data).subscribe((result: Result) => {
        this.$modal.success(result.msg);
      });
    }
  }

  /**
   * 根据Id查询设施详情
   * param data 设施IdList
   */
  queryDeviceIds(data, chartData, type?) {
    this.$topNService.getDeviceByIds(data).subscribe((result: Result) => {
      const _dataset = [];
      data.forEach(item => {
        result.data.forEach(_item => {
          if (item === _item.deviceId) {
            if (_item.areaInfo) {
              _item.areaName = _item.areaInfo.areaName;
              _item.accountabilityUnitName = _item.areaInfo.accountabilityUnitName;
            }
            _item.status = getDeployStatus(this.$NZi18, _item.deployStatus);
            _dataset.push(_item);
          }
        });
      });
      this._dataset = _dataset;
      this.defaultTableValue = CommonUtil.deepClone(this._dataset);
      this._dataset.map(item => {
        item.accountabilityUnitName = item.areaInfo.accountabilityUnitName;
        this.topMaxData.map(_item => {
          if (_item.alarmSource === item.deviceId || _item.deviceId === item.deviceId) {
            _item['deviceName'] = item.deviceName;
          }
        });
      });
      setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarsChartOption(chartData, this.chartTitle, this.portchange)), 500);
    });
  }

  // 统计按钮的启用禁用状态
  isDisable() {
    if (this.areaName) {
      if (this.pageTypeTitle === RouterConst.TopAlarm
        || this.pageTypeTitle === RouterConst.TopLock || this.pageTypeTitle === RouterConst.TopWorkOrder) {
        if (this.radioValue && this.rangDateValue.length > 0) {
          if (this.pageTypeTitle === RouterConst.TopAlarm) {
            if (this.alarmList.length > 0) {
              return false;
            } else {
              return true;
            }
          }
        } else {
          return true;
        }
      } else if (this.pageTypeTitle === RouterConst.TopSensor) {
        if (this.radioValue) {
          if (this.radioSensor) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      } else {
        if (this.deviceList.length > 0) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      return true;
    }
  }

  /**
   * 为告警TopN时统计请求
   */
  queryAlarmStatistical(statisticalData) {
    this.chartTitle = {
      text: `${this.statisticalLanguage.alarmTop}${this.statisticalNumber}`,
      subtext: this.statisticalLanguage.alarmStatisticsForEachFacility,
    };
    this.hide = false;
    statisticalData['deviceIds'] = [this.radioValue];
    statisticalData['areaList'] = this.selectAreaIDList;
    delete statisticalData['areaIdList'];
    statisticalData['beginTime'] = +new Date(CommonUtil.dateFmt(TimeFormatEnum.startTime, new Date(this.rangDateValue[0])));
    statisticalData['endTime'] = +new Date(CommonUtil.dateFmt(TimeFormatEnum.endTime, new Date(this.rangDateValue[1])));
    statisticalData['alarmCodes'] = this.alarmList.map(item => item.value);
    this.$topNService.queryAlarmTop({bizCondition: statisticalData}).subscribe((result: Result) => {
      if (result.code === 0) {
        // if (result.data.length > 0) {
          this.hide = true;
          this.topMaxData = result.data;
          this.topMaxData.map(item => item.sensorValue = item.count);
          this.topMaxData = this.topMaxData.sort((min, max) => {
            return min.sensorValue - max.sensorValue;
          });
          const deviceIds = [];
          this.topMaxData.forEach(item => deviceIds.push(item.alarmSource));
          this.queryDeviceIds(deviceIds.reverse(), this.topMaxData);
          this.showLoading = true;
          this.hasData = true;
        }
      // else {
      //     this.hide = true;
      //     this.showLoading = true;
      //     this.hasData = false;
      //   }
      // }
      else {
        this.$modal.error(result.msg);
      }
      this.ProgressShow = false;
    });
  }

  /**
   * 工单TopN统计相关
   */
  queryWorkOrder(statisticalData) {
    this.chartTitle = {
      text: `${this.statisticalLanguage.workOrderNumberTop}${this.statisticalNumber}`,
      subtext: this.statisticalLanguage.WorkStatisticsForEachFacility,
    };
    this.hide = false;
    statisticalData['deviceTypeList'] = [this.radioValue];
    statisticalData['timeList'] = [Math.ceil(+new Date(CommonUtil.dateFmt(TimeFormatEnum.startTime,
      new Date(this.rangDateValue[0]))) / 1000)
      , Math.ceil(+new Date(CommonUtil.dateFmt(TimeFormatEnum.endTime, new Date(this.rangDateValue[1]))) / 1000)];
    statisticalData['procType'] = 'clear_failure';
    delete statisticalData['deviceType'];
    delete statisticalData['topTotal'];
    this.$topNService.queryTopListDeviceCountGroupByDevice({bizCondition: statisticalData}).subscribe((result: Result) => {
      if (result.code === 0) {
       // if (result.data.length > 0) {
          this.hide = true;
          this.topMaxData = result.data;
          this.topMaxData.map(item => item.sensorValue = item.deviceCount);
          this.topMaxData = this.topMaxData.sort((min, max) => {
            return min.sensorValue - max.sensorValue;
          });
          const deviceIds = [];
          this.topMaxData.forEach(item => deviceIds.push(item.deviceId));
          this.queryDeviceIds(deviceIds.reverse(), this.topMaxData);
          // setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarsChartOption(this.topMaxData)), 500);
          this.showLoading = true;
          this.hasData = true;
        }
        // else {
        //   this.hide = true;
        //   this.showLoading = true;
        //   this.hasData = false;
        // }
      // }
      else {
        this.$modal.error(result.msg);
      }
      this.ProgressShow = false;
    });
  }

  /**
   * 传感值TopN统计
   */
  querySensorStatistical(statisticalData) {
    this.chartTitle = {
      text: `${this.statisticalLanguage.sensorTop}${this.statisticalNumber}`,
      subtext: this.statisticalLanguage.sensorStatisticsForEachFacility,
    };
    this.hide = false;
    statisticalData['sensorType'] = this.radioSensor;
    this.$topNService.queryDeviceSensorTopNum(statisticalData).subscribe((result: Result) => {
      if (result.code === 0) {
        this.hide = true;
        this.maxAndMindata = result.data;
        this.topMinData = this.maxAndMindata.bottom.sort((min, max) => {
          return max.sensorValue - min.sensorValue;
        });
        this.topMaxData = this.maxAndMindata.top.sort((min, max) => {
          return min.sensorValue - max.sensorValue;
        });
        const deviceIds = [];
        this.topMaxData.forEach(item => deviceIds.push(item.deviceId));
        this.queryDeviceIds(deviceIds.reverse(), this.topMaxData);
        // if (this.topMaxData.length > 0) {
          // setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarsChartOption(this.topMaxData)), 500);
          this.showLoading = true;
          this.hasData = true;
      }
      //   else {
      //     this.showLoading = true;
      //     this.hasData = false;
      //   }
      // }
      else {
        this.$modal.error(result.msg);
      }
      this.ProgressShow = false;
    });
  }

  /**
   * 开锁次数TopN统计
   */
  queryLockStatistical(statisticalData) {
    this.chartTitle = {
      text: `${this.statisticalLanguage.lockTop}${this.statisticalNumber}`,
      subtext: this.statisticalLanguage.lockStatisticsForEachFacility,
    };
    this.hide = false;
    delete statisticalData.topCount;
    delete statisticalData.sensorType;
    // statisticalData['startDate'] = this.setTime(this.rangDateValue)[0];
    // statisticalData['endDate'] = this.setTime(this.rangDateValue)[1];
    statisticalData['startDate'] = +new Date(CommonUtil.dateFmt(TimeFormatEnum.startTime, new Date(this.rangDateValue[0])));
    statisticalData['endDate'] = +new Date(CommonUtil.dateFmt(TimeFormatEnum.endTime, new Date(this.rangDateValue[1])));
    this.$topNService.queryUnlockingTopNum(statisticalData).subscribe((result: Result) => {
      if (result.code === 0) {
        // if (result.data.length > 0) {
        this.hide = true;
        this.topMaxData = result.data;
        console.log(this.topMaxData);
        this.topMaxData.map(item => item.sensorValue = item.countValue);
        this.topMaxData = this.topMaxData.sort((min, max) => {
          return min.sensorValue - max.sensorValue;
        });
        const deviceIds = [];
        this.topMaxData.forEach(item => deviceIds.push(item.deviceId));
        this.queryDeviceIds(deviceIds.reverse(), this.topMaxData);
        // if (!this.topMaxData) {
        //   this.topMaxData = 0;
        // }
        // setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarsChartOption(this.topMaxData)), 500);
        this.showLoading = true;
        this.hasData = true;
        // }else {
        //   this.hide = true;
        //   this.showLoading = true;
        //   this.hasData = false;
        // }
      } else {
        this.$modal.error(result.msg);
      }
      this.ProgressShow = false;
    });
  }

  /**
   * 端口使用率TopN统计
   */
  queryOdnDeviceStatistical(statisticalData) {
    this.hide = false;
    // eCharts标题
    this.chartTitle = {
      text: `${this.statisticalLanguage.portUseTop}${this.statisticalNumber}`,
      subtext: this.statisticalLanguage.portUseStatisticsForEachFacility,
    };
    statisticalData['areaIds'] = statisticalData.areaIdList;
    statisticalData['deviceTypes'] = this.deviceList.map(item => item.value);
    statisticalData['topN'] = statisticalData.topCount;
    delete statisticalData.areaIdList;
    delete statisticalData.deviceType;
    delete statisticalData.topCount;
    delete statisticalData.topTotal;
    this.$topNService.queryPortTopN(statisticalData).subscribe((result: Result) => {
      if (result.code === 0) {
        // if (result.data.length > 0) {
        this.hide = true;
        this.topMaxData = result.data;
        this.topMaxData.map(item => item.sensorValue = item.utilizationRate);
        this.topMaxData = this.topMaxData.sort((min, max) => {
          return min.sensorValue - max.sensorValue;
        });
        const deviceIds = [];
        this.topMaxData.forEach(item => deviceIds.push(item.deviceId));
        this.portchange = true;
        this.queryDeviceIds(deviceIds.reverse(), this.topMaxData, this.portchange);
        // setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarsChartOption(this.topMaxData)), 500);
        this.showLoading = true;
        this.hasData = true;
      }
      // else {
      //     this.hide = true;
      //     this.showLoading = true;
      //     this.hasData = false;
      //   }
      // }
      else {
        this.$modal.error(result.msg);
      }
      this.ProgressShow = false;
    });
  }

  /**
   * 对时间进行处理
   */
  setTime(data: any[]) {
    const timeData = [];
    data.map(item => {
      timeData.push(CommonUtil.dateFmt('yyyyMMdd', item));
    });
    return timeData;
  }

  /**
   * 禁用时间
   * param {Date} current
   * returns {boolean}
   */
  disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) > -1;
  };

  goDevice(data) {
    this.$router.navigate(['/business/facility/facility-detail-view'], {
      queryParams: {
        id: data.deviceId,
        deviceType: data.deviceType
      }
    }).then();
  }
}
