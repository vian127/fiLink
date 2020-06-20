import {Component, OnInit, Output, EventEmitter, Input, OnDestroy} from '@angular/core';
import {getDeviceType} from '../../../facility/share/const/facility.config';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {FacilityUtilService} from '../../../facility';
import {differenceInCalendarDays} from 'date-fns';
import {AlarmService} from '../../../../core-module/api-service/alarm';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {TimeFormatEnum} from '../../../../shared-module/enum/time-format.enum';

@Component({
  selector: 'app-screening-condition',
  templateUrl: './screening-condition.component.html',
  styleUrls: ['./screening-condition.component.scss']
})
export class ScreeningConditionComponent implements OnInit, OnDestroy {
  isLoading = false;
  // 设施选择ul数据
  selsetDeviceTypeList = [];
  deviceTypeList = [];
  // 选择的设施类型
  deviceTypeListValue = [];
  public language: AlarmLanguageInterface;
  // 时间控件的值
  firstTimeModel = [];
  // 点击统计后的时间控件的值
  staTime = [];
// 选择的数据类型
  deviceAactive;
  // 区域选择器显示控制
  isVisible = false;
  // 选择责任单位名称
  selectUnitName;
  // 区域树配置
  treeSelectorConfig: TreeSelectorConfig;
  // 区域树数据
  treeNodes;
  // 区域名称
  areaName = '';
  // 区域ids
  areaIds = [];
  // 统计后的区域名称
  staAreaName = '';
  // 控制模板统计modal的显示吟唱
  display = {
    templateTable: false
  };
  // 下拉框数据
  selectInfo;

  /**
   *  _sineDeviceType 不传或者false时 设施类型为多选
   *  传true时 为单选 在 区域告警比统计 页面时使用
   */
    // 页面类型判断
  _sineDeviceType: 'normal' | 'areaAlarm' | 'alarmIncrement' = 'normal';
  // private areaNodes: any;
  _currentPage: 'alarmType' | 'alarmHandle' | 'alarmName' | 'arearAtio' | 'alarmIncrement' = 'alarmType';
  @Input() set currentPage(currentPage) {
    switch (currentPage) {
      case 'areaAlarm' :
        // 当在区域告警比统计时 所有设施类型
        this._sineDeviceType = 'areaAlarm';
        this.deviceTypeList = getDeviceType(this.$nzI18n);
        this._currentPage = 'arearAtio';
        break;
      case 'alarmIncrement':
        this._sineDeviceType = 'alarmIncrement';
        break;
      case 'alarmDispose':
        this._sineDeviceType = 'normal';
        this._currentPage = 'alarmHandle';
        break;
      default:
        this._sineDeviceType = 'normal';
        this._currentPage = currentPage;
    }
  }

  @Output() search = new EventEmitter();

  constructor(public $nzI18n: NzI18nService,
              private $facilityUtilService: FacilityUtilService,
              public $alarmService: AlarmService,
              private $message: FiLinkModalService) {
    this.language = this.$nzI18n.getLocaleData('alarm');
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
      title: this.language.selectArea,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.language.areaNames, key: 'areaName', width: 100,
        },
        {
          title: this.language.areaLevel, key: 'areaLevel', width: 100,
        }
      ]
    };
  }

  // 判断统计按钮 是否禁用
  disabledResources() {
    if (this.firstTimeModel.length && this.areaName && this.deviceTypeListValue.length) {
      return '';
    } else {
      return 'disabled';
    }
  }

  selectDataChange(event) {
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
    this.areaIds = selectArr;
    sessionStorage.setItem('areaId', JSON.stringify(this.areaIds));
    this.$facilityUtilService.setAreaNodesMultiStatus(this.treeNodes, selectArr);
    this.disabledResources();
  }

  /**
   * 打开区域选择器
   */
  showAreaSelect() {
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isVisible = true;
  }

  onSearch(value: string): void {
    this.isLoading = true;
  }

  /**
   * 传值到每个组件
   */
  emitData(deviceIds) {
    let beginTime;
    let endTime;
    // 将时间进行转换
    beginTime = CommonUtil.dateFmt(TimeFormatEnum.startTime, new Date(this.staTime[0]));
    endTime = CommonUtil.dateFmt(TimeFormatEnum.endTime, new Date(this.staTime[1]));
    const saveAreaId = JSON.parse(sessionStorage.getItem('areaId'));
    if (saveAreaId) {
      this.areaIds = saveAreaId;
    }
    const screeningCondition = {
      'bizCondition': {
        beginTime: +new Date(beginTime),
        endTime: +new Date(endTime),
        deviceIds: deviceIds,
        // areaList: this.staAreaName && this.staAreaName.split(','),
        areaList: this.areaIds
      }
    };
    if (this._sineDeviceType === 'alarmIncrement') {
      screeningCondition.bizCondition.areaList = this.areaIds;
    }
    // const bol = Object.values(screeningCondition.bizCondition).some(item => item === NaN || !item);
    // if (bol) {
    //   this.$message.info('请选择统计条件');
    // } else {
    this.search.emit(screeningCondition);
    // }

  }

  clickDeviceSelect(item) {
    this.deviceAactive = item;
    this.emitData([item.value]);
  }

  /**
   * 统计
   */
  resources() {
    this.staAreaName = this.areaName;
    this.staTime = CommonUtil.deepClone([this.firstTimeModel[0].getTime(), this.firstTimeModel[1].getTime()]);
    let deviceIds;
    // const deviceIds = this._sineDeviceType !== 'normal' ? [this.deviceTypeListValue] : [this.deviceTypeListValue[0].value];
    if (this._sineDeviceType === 'areaAlarm') {
      deviceIds = [this.deviceTypeListValue];
    } else if (this._sineDeviceType === 'alarmIncrement') {
      deviceIds = this.deviceTypeListValue.map(item => item.value);
    } else {
      // deviceIds = this.deviceTypeListValue.map(item => item.value);
      deviceIds = [this.deviceTypeListValue[0].value];
    }
    this.emitData(deviceIds);
    if (this._sineDeviceType === 'normal') {
      // 筛选设施
      this.selsetDeviceTypeList = [];
      this.deviceTypeListValue.forEach(value => {
        this.selsetDeviceTypeList.push(value);
      });
      // });
      this.deviceAactive = this.selsetDeviceTypeList[0];
    }
  }

  /**
   * 禁用时间
   * param {Date} current
   * returns {boolean}
   */
  disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    // return differenceInCalendarDays(current, nowTime) < 0;
    if (this._sineDeviceType === 'alarmIncrement') {
      // const time = this.getBeforeDateForDays(nowTime, 15);
      const tiem = this.getDateStr(-15);
      return differenceInCalendarDays(current, tiem) < 0 || differenceInCalendarDays(current, nowTime) > -1;
    } else {
      return differenceInCalendarDays(current, nowTime) > 0;
    }
  };

  /**
   *  AddDayCount  为传入的时间 如-1 ，1
   */
  getDateStr(AddDayCount) {
    const time = new Date();
    const tiems = time.setDate(time.getDate() + AddDayCount); // 获取AddDayCount天后的日期
    return new Date(tiems);
  }

  /**
   * 模板查询
   * param event
   */
  templateTable(event) {
    this.display.templateTable = false;
    if (!event) {
      return;
    } else {
      sessionStorage.removeItem('areaId');
    }
    this.areaName = event.areaNames;
    this.firstTimeModel = [new Date(event.condition.beginTime),
      new Date(event.condition.endTime)];
    if (this._sineDeviceType === 'areaAlarm') {
      this.deviceTypeListValue = event.condition.deviceIds[0];
    } else {
      this.deviceTypeListValue = event.condition.deviceIds.map(item => {
        return {checked: true, label: getDeviceType(this.$nzI18n, item), value: item};
      });
    }
    this.isCheckData(this.treeNodes, event.condition.areaList.ids);
    this.areaIds = event.condition.areaList.ids;
    sessionStorage.setItem('areaId', JSON.stringify(this.areaIds));
    this.resources();
  }

  // 递归循环 勾选数据
  isCheckData(data, ids) {
    ids.forEach(id => {
      data.forEach(item => {
        item.id = item.areaId;
        if (id === item.areaId) {
          item.checked = true;
        }
        if (item.children && item.children) {
          this.isCheckData(item.children, ids);
        }
        //  item.name = item.areaName;
      });
    });
  }

  addName(data) {
    data.forEach(item => {
      item.id = item.areaId;
      item.value = item.areaId;
      if (item.children && item.children) {
        this.addName(item.children);
      }
    });
  }

  nzOnOpenChange(event) {
    if (!event) {
      this.firstTimeModel = this.firstTimeModel.slice();
    }
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

  ngOnInit() {
    this.$facilityUtilService.getArea().then((data) => {
      // 递归设置区域的选择情况
      this.$facilityUtilService.setAreaNodesStatus(data, null, null);
      this.treeNodes = data;
      this.addName(this.treeNodes);
    });
    this.initTreeSelectorConfig();
    this.getUserCanLookDeviceType();
  }

  ngOnDestroy() {
    sessionStorage.removeItem('areaId');
  }


}
