import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ClearBarrierService} from '../../../../core-module/api-service/work-order/clear-barrier';
import {Result} from '../../../../shared-module/entity/result';
import {NzI18nService} from 'ng-zorro-antd';
import {ChartUtil} from '../../../../shared-module/util/chart-util';
import {FACILITY_TYPE_NAME} from '../../../../shared-module/const/facility';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {WorkOrderLanguageInterface} from '../../../../../assets/i18n/work-order/work-order.language.interface';
import {WorkOrderConfig} from '../../work-order.config';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {ChartColor} from '../../../../shared-module/const/chart-color.config';

/**
 * 历史销账工单卡片
 */
@Component({
  selector: 'app-history-clear-barrier-work-order',
  templateUrl: './history-clear-barrier-work-order.component.html',
  styleUrls: ['./history-clear-barrier-work-order.component.scss']
})
export class HistoryClearBarrierWorkOrderComponent implements OnInit, AfterViewInit {
  // 环形圆角数值
  public canvasRadius;
  // 图形大小
  public canvasLength;
  // 环形图配置
  public ringChartOption;
  // 饼图配置
  public pieChartOption;
  // 柱状图配置
  public barChartOption;
  // 国际化
  public workOrderConfig = new WorkOrderConfig(this.$nzI18n);
  // 故障原因统计报表显示的类型  chart 图表   text 文字
  public errorReasonStatisticsChartType;
  // 处理方案统计报表显示的类型  chart 图表   text 文字
  public processingSchemeStatisticsChartType;
  // 设施类型统计报表显示的类型  chart 图表   text 文字
  public deviceTypeStatisticsChartType;
  // 工单状态统计报表显示的类型  chart 图表   text 文字
  public statusStatisticsChartType;
  // 已完工工单百分比
  public completedPercent;
  // 已退单工单百分比
  public singleBackPercent;
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  public workOrderLanguage: WorkOrderLanguageInterface;
  public commonLanguage: CommonLanguageInterface;

  constructor(public $nzI18n: NzI18nService,
              private $clearBarrierService: ClearBarrierService,
              private $message: FiLinkModalService,
  ) {
  }

  ngOnInit() {
    this.indexLanguage = this.$nzI18n.getLocaleData('index');
    this.workOrderLanguage = this.$nzI18n.getLocaleData('workOrder');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.canvasRadius = 60;
    this.canvasLength = this.canvasRadius * 2;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getStatisticsByErrorReason();
      this.getStatisticsByProcessingScheme();
      this.getStatisticsByDeviceType();
      this.getStatisticsByStatus();
    }, 0);
  }

  /**
   * 获取故障原因统计
   */
  getStatisticsByErrorReason() {
    const requestData = {
      'bizCondition': {
        'procType': 'clear_failure',
        'statisticalType': '2'
      }
    };
    this.$clearBarrierService.getStatisticsByErrorReason(requestData).subscribe((result: Result) => {
      if (result.code === 0) {
        if (result.data.length === 0) {
          this.errorReasonStatisticsChartType = 'text';
        } else {
          this.errorReasonStatisticsChartType = 'chart';
          const data = [];
          let total = 0;
          result.data.forEach(item => {
            data.push({
              value: item.orderCount,
              name: this.workOrderConfig.geterrorReasonName(item.errorReason)
            });
            total += item.orderCount;
          });
          this.ringChartOption = ChartUtil.setWorkRingChartOption(total, data);
        }
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
    });
  }

  /**
   * 获取设施类型统计
   */
  getStatisticsByDeviceType() {
    this.$clearBarrierService.getStatisticsByDeviceType({
      'bizCondition': {
        'procType': 'clear_failure',
        'statisticalType': '2'
      }
    }).subscribe((result: Result) => {
      if (result.code === 0) {
        if (result.data.length === 0) {
          this.deviceTypeStatisticsChartType = 'text';
        } else {
          this.deviceTypeStatisticsChartType = 'chart';
          const name = [], data = [];
          result.data.forEach(item => {
            name.push(this.getFacilityTypeName(item.deviceType));
            data.push(
              {
                value: item.orderCount, itemStyle: {
                  color: ChartColor[item.deviceType]
                }
              });
          });
          this.barChartOption = ChartUtil.setWorkBarChartOption(data, name);
        }
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
    });
  }

  /**
   * 获取处理方案统计
   */
  getStatisticsByProcessingScheme() {
    this.$clearBarrierService.getStatisticsByProcessingScheme({
      'bizCondition': {
        'procType': 'clear_failure',
        'statisticalType': '2'
      }
    }).subscribe((result: Result) => {
      if (result.code === 0) {
        if (result.data.length === 0) {
          this.processingSchemeStatisticsChartType = 'text';
        } else {
          this.processingSchemeStatisticsChartType = 'chart';
          const data = [], name = [];
          result.data.forEach(item => {
            name.push(this.workOrderConfig.getSchemeName(item.processingScheme));
            data.push({
              value: item.orderCount,
              name: this.workOrderConfig.getSchemeName(item.processingScheme)
            });
          });
          this.pieChartOption = ChartUtil.setPieChartOption(data, name);
        }
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
    });
  }

  /**
   * 获取工单状态统计
   */
  getStatisticsByStatus() {
    this.$clearBarrierService.getStatisticsByStatus({
      'bizCondition': {
        'procType': 'clear_failure',
        'statisticalType': '2'
      }
    }).subscribe((result: Result) => {
      if (result.code === 0) {
        if (result.data.hisTotalCount === 0) {
          this.statusStatisticsChartType = 'text';
        } else {
          this.statusStatisticsChartType = 'chart';
          let completedCount: number;
          let singleBackCount: number;
          result.data.map(item => {
            if (item.status !== 'singleBack') {
              completedCount = item.orderCount;
            } else {
              singleBackCount = item.orderCount;
            }
          });
          let totalCount = 0;
          if (result.data.length) {
            totalCount = result.data.reduce((a, b) => a.orderCount + b.orderCount);
          }
          setTimeout(() => {
            this.getPercent('canvas_completed', '#339eff', completedCount, totalCount);
            this.getPercent('canvas_singleBack', '#65d688', singleBackCount, totalCount);
            this.completedPercent = totalCount !== 0 ? (100 * completedCount / totalCount).toFixed(2) + '%' : 0 + '%';
            this.singleBackPercent = totalCount !== 0 ? (100 * singleBackCount / totalCount).toFixed(2) + '%' : 0 + '%';
          }, 0);
        }
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
    });
  }

  /**
   * 计算环的角度
   */
  getPercent(id, color, num = 0, total) {
    const endingAngle = (-0.5 + (num / total) * 2) * Math.PI;
    this.drawCircle(id, color, endingAngle);
  }

  // 画环
  drawCircle(id, color, endingAngle = 1.5 * Math.PI, startingAngle = -0.5 * Math.PI) {
    try {
      const canvas = document.getElementById(id);
      const context = canvas['getContext']('2d');
      const centerX = this.canvasRadius;
      const centerY = this.canvasRadius;
      context.beginPath();
      context.lineWidth = 8;
      context.strokeStyle = '#eff0f4';
      // 创建变量,保存圆弧的各方面信息
      const radius = this.canvasRadius - context.lineWidth / 2;
      // 画完整的环
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      context.stroke();

      context.beginPath();
      // 画部分的环
      // context.lineWidth = 3;completedPercent
      context.strokeStyle = color;
      context.arc(centerX, centerY, radius, startingAngle, endingAngle);
      context.stroke();
    } catch (e) {

    }

  }

  /**
   * 获取设施类型名称
   * param deviceType
   * returns {any | string}
   */
  public getFacilityTypeName(deviceType) {
    return deviceType ? this.indexLanguage[FACILITY_TYPE_NAME[deviceType]] : '';
  }
}
