/**
 * Created by xiaoconghu on 2019/1/15.
 */
import {Result} from '../../../../shared-module/entity/result';
import {AreaService} from '../../../../core-module/api-service/facility/area-manage';
import {UserService} from '../../../../core-module/api-service/user/user-manage';
import {Injectable} from '@angular/core';
import {AlarmLevelCode, alarmNameColorEnum, DeviceStatusCode, getAlarmType} from '../const/facility.config';
import {WORK_ORDER_STATUS, WORK_ORDER_STATUS_CLASS} from '../../../../shared-module/const/work-order';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmStoreService} from '../../../../core-module/store/alarm.store.service';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {AlarmNameStatisticsModel} from '../model/alarm-name-statistics.model';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment.enum';
import {EquipmentStatusEnum} from '../enum/equipment.enum';
import {DateTypeEnum} from '../enum/timer.enum';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';

@Injectable()
export class FacilityUtilService {
  // 巡检工单国际化
  public inspectionLanguage: InspectionLanguageInterface;
  // 告警国际化
  public alarmLanguage: AlarmLanguageInterface;
  // 资产设施国际化
  public language: FacilityLanguageInterface;
  constructor(private $areaService: AreaService,
              private $nzI18n: NzI18nService,
              private $userService: UserService,
              public $alarmStoreService: AlarmStoreService,
              ) {
  }


  /**
   * 获取设施状态图标样式
   */
  public static getFacilityDeviceStatusClassName(deviceStatus: string): { iconClass: string, colorClass: string } {
    let iconClass = '', colorClass = '';
    switch (deviceStatus) {
      case DeviceStatusCode.NORMAL:
        iconClass = 'fiLink-normal';
        colorClass = 'facility-normal-c';
        break;
      case DeviceStatusCode.ALARM:
        iconClass = 'fiLink-alarm';
        colorClass = 'facility-alarm-c';
        break;
      case DeviceStatusCode.UNKNOWN:
        iconClass = 'fiLink-unknown';
        colorClass = 'facility-unknown-c';
        break;
      case DeviceStatusCode.OFFLINE:
        iconClass = 'fiLink-lost';
        colorClass = 'facility-offline-c';
        break;
      case DeviceStatusCode.OUT_OF_CONTACT:
        iconClass = 'fiLink-serious';
        colorClass = 'facility-lost-c';
    }
    return {iconClass, colorClass};
  }

  /**
   * 获取区域列表信息
   * returns {Promise<any>}
   */
  getArea() {
    return new Promise((resolve, reject) => {
      this.$areaService.selectForeignAreaInfoForPageCollection([]).subscribe((result: Result) => {
        const data = result.data || [];
        resolve(data);
      });
    });

  }

  /**
   * 获取单位列表信息
   * returns {Promise<any>}
   */
  getDept() {
    return new Promise((resolve, reject) => {
      this.$userService.queryTotalDept().subscribe((result: Result) => {
        const data = result.data || [];
        resolve(data);
      });
    });

  }

  /**
   * 递归设置区域的被选状态
   * param data
   * param parentId
   */
  public setAreaNodesStatus(data, parentId, areaId?) {
    data.forEach(areaNode => {
      // 选中父亲
      areaNode.checked = areaNode.areaId === parentId;
      // 自己不让选 没权限不让选
      areaNode.chkDisabled = (areaNode.areaId === areaId) || (areaNode.hasPermissions === false);
      // 如果是已经选中可以选
      if (areaNode.checked) {
        areaNode.chkDisabled = false;
      }
      if (areaNode.children) {
        this.setAreaNodesStatus(areaNode.children, parentId, areaId);
      }
    });
  }

  /**
   * 中式区域需求变更 区域选择默认有权限
   * param data
   * param parentId
   * param areaId
   */
  public setAreaNodesStatusUnlimited(data, parentId, areaId?) {
    data.forEach(areaNode => {
      // 选中父亲
      areaNode.checked = areaNode.areaId === parentId;
      // 自己不让选
      areaNode.chkDisabled = areaNode.areaId === areaId;
      // 如果是已经选中可以选
      if (areaNode.checked) {
        areaNode.chkDisabled = false;
      }
      if (areaNode.children) {
        this.setAreaNodesStatusUnlimited(areaNode.children, parentId, areaId);
      }
    });
  }

  /**
   * 递归设置区域的被选状态(多选)
   * param data
   * param selectData
   */
  public setAreaNodesMultiStatus(data, selectData) {
    data.forEach(areaNode => {
      // 从被选择的数组中找到当前项
      const index = selectData.findIndex(item => areaNode.areaId === item);
      // 如果找到了 checked 为true
      areaNode.checked = !(index === -1);
      if (areaNode.checked) {
        areaNode.chkDisabled = false;
      }
      if (areaNode.children) {
        this.setAreaNodesMultiStatus(areaNode.children, selectData);
      }
    });
  }

  /**
   * 递归设置责任单位的被选状态
   * param data
   * param selectData
   */
  public setTreeNodesStatus(data, selectData: string[], bol?) {
    if (!bol) {
      data.forEach(treeNode => {
        // 从被选择的数组中找到当前项
        const index = selectData.findIndex(item => treeNode.id === item);
        // 如果找到了 checked 为true
        treeNode.checked = !(index === -1);
        if (treeNode.childDepartmentList) {
          this.setTreeNodesStatus(treeNode.childDepartmentList, selectData);
        }
      });
    } else {
      data.forEach(treeNode => {
        // 从被选择的数组中找到当前项
        const index = selectData.findIndex(item => treeNode.deviceId === item);
        // 如果找到了 checked 为true
        treeNode.checked = !(index === -1);
        if (treeNode.childDepartmentList) {
          this.setTreeNodesStatus(treeNode.childDepartmentList, selectData, true);
        }
      });
    }
  }

  /**
   * 告警转工单 和 告警远程通知 使用到了
   * 递归勾选传入的数据
   */
  public setAlarmAreaNodesStatus(data, parentId, areaId?) {
    data.forEach(areaNode => {
      areaId.forEach(item => {
        // 选中父亲
        areaNode.checked = areaNode.areaId === parentId;
        // 自己不让选
        areaNode.chkDisabled = (areaNode.areaId === item) || (areaNode.hasPermissions === false);
        if (areaNode.children) {
          this.setAreaNodesStatus(areaNode.children, parentId, item);
        }
      });
    });
  }

  /**
   * 获取工单状态国际化
   */
  public  getStatusName(status: string): string {
    this.inspectionLanguage = this.$nzI18n.getLocaleData('inspection');
    return this.inspectionLanguage[WORK_ORDER_STATUS[status]];
  }

  /**
   * 获取工单状态的图标
   */
  public  getOrderStatusClass(status: string): string {
    return `iconfont icon-fiLink ${WORK_ORDER_STATUS_CLASS[status]}`;
  }

  /**
   * 转换告警级别数据
   */
  public handleAlarmLevelData(result): { color, data } {
    this.alarmLanguage = this.$nzI18n.getLocaleData('alarm');
    const color = [
      // 次要
      this.$alarmStoreService.getAlarmColorByLevel(AlarmLevelCode.SECONDARY).backgroundColor,
      // 提示
      this.$alarmStoreService.getAlarmColorByLevel(AlarmLevelCode.PROMPT).backgroundColor,
      // 主要
      this.$alarmStoreService.getAlarmColorByLevel(AlarmLevelCode.MAIN).backgroundColor,
      // 紧急
      this.$alarmStoreService.getAlarmColorByLevel(AlarmLevelCode.URGENT).backgroundColor,
    ];
    const data = [
      // 次要
      {value: result.data.minorAlarmCount, name: this.alarmLanguage.secondary},
      // 提示
      {value: result.data.hintAlarmCount, name: this.alarmLanguage.prompt},
      // 主要
      {value: result.data.mainAlarmCount, name: this.alarmLanguage.main},
      // 紧急
      {value: result.data.urgentAlarmCount, name: this.alarmLanguage.urgent},
    ];
    return {color, data};
  }

  /**
   * 处理环形图数据和样式
   */
  public handelAlarmName(data: AlarmNameStatisticsModel) {
    const arr = [];
    Object.keys(data).forEach(item => {
      const value = {
        value: data[item], name: getAlarmType(this.$nzI18n, item),
        itemStyle: {color: alarmNameColorEnum[item]}
      };
      arr.push(value);
    });
    return arr;
  }
  /**
   * 获取设备类型
   */
  public getEquipmentType(i18n: NzI18nService, code = null): any {
    return CommonUtil.codeTranslate(EquipmentTypeEnum, i18n, code, 'facility');
  }

  /**
   * 获取设备状态
   */
  public getEquipmentStatus(i18n: NzI18nService, code = null): any {
    return CommonUtil.codeTranslate(EquipmentStatusEnum, i18n, code, 'facility');
  }

  /**
   * 告警增量统计数据进行排序
   */
  public sortAlarmData(data): Array<any> {
    data = data.sort((a, b) => {
      if (+new Date(a.groupTime) - (+new Date(b.groupTime)) > 0) {
        return 1;
      } else {
        return -1;
      }
    });
    const seriesData = [];
    data.forEach(item => {
      seriesData.push([item.groupTime, item.count]);
    });
    return seriesData;
  }
  /**
   * 获取时间list
   */
  public  getTimeList() {
    this.language = this.$nzI18n.getLocaleData('facility');
    return [{
      label: this.language.oneWeek,
      value: DateTypeEnum.oneWeek
    }, {
      label: this.language.oneMonth,
      value: DateTypeEnum.oneMonth
    }, {
      label: this.language.threeMonth,
      value: DateTypeEnum.threeMonth
    }];
  }
}
