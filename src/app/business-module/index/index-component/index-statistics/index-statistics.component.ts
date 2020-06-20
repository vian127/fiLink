import {Component, Input, AfterViewInit, OnInit} from '@angular/core';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {MapService} from '../../../../core-module/api-service/index/map/index';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FACILITY_STATUS_COLOR, FACILITY_STATUS_NAME} from '../../../../shared-module/const/facility';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {LockService} from '../../../../core-module/api-service/lock/index';
import {FacilityService} from '../../../../core-module/api-service/facility/facility-manage/index';
import {Result} from '../../../../shared-module/entity/result';
import {indexChart} from '../../util/index-charts';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {getDeviceType} from '../../../facility/share/const/facility.config';
import {index_card_type} from '../../shared/const/index-const';
import {alarmCountColor, getAlarmCount, getAlarmIdFromName} from '../../shared/const/config';
/**
 * 统计工单组件
 */
@Component({
  selector: 'app-index-statistics',
  templateUrl: './index-statistics.component.html',
  styleUrls: ['./index-statistics.component.scss']
})
export class IndexStatisticsComponent implements OnInit , AfterViewInit {
  // 标题
  @Input() title: string;
  // 类型
  @Input() type: number;
  // 区域信息
  @Input() data: any[];
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 卡片类型
  public cardType = index_card_type;
  // 统计不同类型总数
  public statisticsCount;
  // 统计设施总数
  public statisticsNumber;
  // 是否显示设施状态
  public deviceStatusChartOption;
  // 设施状态
  public noDeviceStatusChart = true;
  // 工单增量
  public procAddListCountOption;
  // 是否显示工单增量
  public noProcAddListCount = true;
  // 查询繁忙TOP
  public userUnlockingTopOption;
  // 是否显示查询繁忙TOP图
  public noUserUnlockingTop = true;
  // 告警设施Top10
  public screenDeviceIdsGroupOption;
  // 是否显示告警设施Top10图
  public noScreenDeviceIdsGroup = true;
  // 当前告警各级别数量
  public alarmCurrentLevelGroupOption;
  // 是否显示当前告警各级别数量
  public noAlarmCurrentLevelGroup = true;
  // 告警增量
  public alarmDateStatisticsOption;
  // 是否显示告警增量
  public noAlarmDateStatistics = true;

  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $mapService: MapService,
              private $modal: NzModalService,
              private $lockService: LockService,
              private $facilityService: FacilityService,
             ) {}
  ngOnInit() {
    // 国际化配置
    this.indexLanguage = this.$nzI18n.getLocaleData('index');
  }

  ngAfterViewInit() {

    switch (this.type) {
      // 设施总数
      case this.cardType.deviceCount:
        this.queryDeviceTypeALLCount();
        break;
      // 类型总数
      case this.cardType.typeCount:
        this.queryDeviceTypeCount();
        break;
      // 设施状态
      case this.cardType.deviceStatus:
        this.queryUserDeviceStatusCount();
        break;
      // 当前告警总数
      case this.cardType.alarmCount:
        this.queryAlarmCurrentLevelGroup();
        break;
      // 告警增量
      case this.cardType.alarmIncrement:
        this.queryAlarmDateStatistics();
        break;
      // 工单增量
      case this.cardType.workIncrement:
        this.queryHomeProcAddListCountGroupByDay();
        break;
      // 繁忙设施TOP
      case this.cardType.busyTop:
        this.queryUserUnlockingTopNum();
        break;
      // 告警设施TOP
      case this.cardType.alarmTop:
        this.queryScreenDeviceIdsGroup();
        break;
    }
  }

  /**
   * 查询设施总数
   */
  private queryDeviceTypeALLCount() {
    this.$facilityService.queryDeviceTypeCount().subscribe((result: Result) => {
      if (result.code === 0) {
        // 设施总数
        let sum = 0;
        result.data.forEach(item => {
          sum += item.deviceNum;
        });
        // 补零
        const count = (Array('000000').join('0') + sum).slice(-6);
        // 统计设施总数
        this.statisticsNumber = (count + '').split('').map(Number);
      }
    });
  }
  /**
   * 查询类型总数
   */
  private queryDeviceTypeCount() {
    this.$facilityService.queryDeviceTypeCount().subscribe((result: Result) => {
      if (result.code === 0) {
        const deviceTypes = getDeviceType(this.$nzI18n);
        deviceTypes.forEach(item => {
          const type = result.data.find(_item => _item.deviceType === item.code);
          if (type) {
            item['sum'] = type.deviceNum;
          } else {
            item['sum'] = 0;
          }
          item['textClass'] = CommonUtil.getFacilityTextColor(item.code);
          item['iconClass'] = CommonUtil.getFacilityIconClassName(item.code);
        });
        // 统计不同类型总数
        this.statisticsCount = deviceTypes;
      }
    });
  }

  /**
   * 获取当前告警各级别数量
   */
  private queryAlarmCurrentLevelGroup() {
    this.$mapService.queryAlarmCurrentLevelGroup().subscribe((result: Result) => {
      if (result.code === 0) {
        if (result.data.length === 0) {
          this.noAlarmCurrentLevelGroup = true;
        } else {
          const alarmCount = getAlarmCount(this.$nzI18n);
          let sum = 0;
          Object.keys(result.data).forEach(item => {
            if (item === alarmCount[Object.keys(result.data).indexOf(item)]['code']) {
              sum += result.data[item];
              if (result.data[item] !== 0) {
                alarmCount[Object.keys(result.data).indexOf(item)]['value'] = result.data[item];
                alarmCount[Object.keys(result.data).indexOf(item)]['itemStyle'] = {color: alarmCountColor[item]};
              }
            }
          });
          // 如果告警总数大于零
          if (sum > 0) {
            this.noAlarmCurrentLevelGroup = false;
          }
          this.alarmCurrentLevelGroupOption = indexChart.setBarChartOption(alarmCount, this.indexLanguage.currentAlarmNum);
        }
      }
    });
  }

  /**
   * 工单增量
   */
  private queryHomeProcAddListCountGroupByDay() {
    // 固定参数
    const params = {
      'bizCondition': {
        'procType': 'clear_failure'
      }
    };
    this.$mapService.queryHomeProcAddListCountGroupByDay(params).subscribe((result: Result) => {
      if (result.code === 0) {
        if (result.data.length === 0) {
          this.noProcAddListCount = true;
        } else {
          this.noProcAddListCount = false;
          const time =  result.data.map(item => item.date);
          const count =  result.data.map(item => item.orderCount);
          const lineData = [
            {data: count, type: 'line', name: this.indexLanguage.clearBarrierWorkOrderTitle},
          ];
          this.procAddListCountOption = indexChart.setLineChartOption(lineData, time);
        }
      }
    });
  }

  /**
   * 告警增量
   */
  private queryAlarmDateStatistics() {
    // 固定参数
    const params = 'DAY';
    this.$mapService.queryAlarmDateStatistics(params, '').subscribe((result: Result) => {
      if (result.code === 0) {
          if (result.data.length === 0) {
            this.noAlarmDateStatistics = true;
          } else {
            this.noAlarmDateStatistics = false;
            const time =  result.data.map(item => item.groupLevel);
            const count =  result.data.map(item => item.groupNum);
            const lineData = [
              {data: count, type: 'line', name: this.indexLanguage.alarmIncrement},
            ];
            this.alarmDateStatisticsOption = indexChart.setLineChartOption(lineData, time);
          }
      }
    });
  }


  /**
   * 查询告警设施Top10
   */
  private queryScreenDeviceIdsGroup() {
    this.$mapService.queryScreenDeviceIdsGroup().subscribe((result: Result) => {
      if (result.code === 0) {
        if (result.data.length === 0) {
          this.noScreenDeviceIdsGroup = true;
        } else {
          // 告警设施
          const deviceIds =  result.data.map(_item => {
            return _item.alarmSource;
          });
          // 根据设备id加设备名称
          this.$mapService.queryDeviceByIds(deviceIds).subscribe((getResult: Result) => {
            if (getResult.code === 0 && getResult.data.length > 0) {
              this.noScreenDeviceIdsGroup = false;
              // 告警设施
              const screenDeviceIdsGroupNum =  result.data.map(_item => {
                return {
                  value: _item.count,
                  name: getAlarmIdFromName(_item.alarmSource, getResult.data),
                };
              });
              // 告警名称
              const screenDeviceIdsGroupName = result.data.map(_item => {
                return getAlarmIdFromName(_item.alarmSource, getResult.data);
              });
              this.screenDeviceIdsGroupOption = indexChart.setHistogramChartOption(screenDeviceIdsGroupNum, screenDeviceIdsGroupName);
            }
          });

        }
      }
    });
  }

  /**
   * 查询繁忙TOP
   */
  private queryUserUnlockingTopNum() {
    this.$mapService.queryUserUnlockingTopNum().subscribe((result: Result) => {
      if (result.code === 0) {
        if (result.data.length === 0) {
           this.noUserUnlockingTop = true;
        } else {
          this.noUserUnlockingTop = false;
          const userUnlockingTopNum =  result.data.map(_item => {
            return {
              value: _item.countValue,
              name: _item.deviceName,
            };
          });
          const userUnlockingTopName = result.data.map(item => item.deviceName);
          this.userUnlockingTopOption = indexChart.setHistogramChartOption(userUnlockingTopNum, userUnlockingTopName);
        }
      }
    });
  }


  /**
   * 查询各设施状态数量
   */
  private queryUserDeviceStatusCount() {
    this.$mapService.queryUserDeviceStatusCount().subscribe((result: Result) => {
      if (result.code === 0) {
        if (result.data.length === 0) {
          this.noDeviceStatusChart = true;
        } else {
          this.noDeviceStatusChart = false;
          const userDeviceStatusCount =  result.data.map(_item => {
            if (_item.deviceNum !== 0 ) {
              return {
                value: _item.deviceNum,
                name: this.indexLanguage[FACILITY_STATUS_NAME[_item.deviceStatus]] || '',
                itemStyle: {color: FACILITY_STATUS_COLOR[_item.deviceStatus]}
              };
            }
          });
          this.deviceStatusChartOption = indexChart.setRingChartOption(userDeviceStatusCount, this.indexLanguage.facilityStatusTitle);
        }
      }
    });
  }
}
