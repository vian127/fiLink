import {Component, Input, OnInit} from '@angular/core';
import {ChartUtil} from '../../../shared-module/util/chart-util';
import {AlarmLanguageInterface} from '../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {Result} from '../../../shared-module/entity/result';
import {AlarmService} from '../../../core-module/api-service/alarm/alarm-manage';
@Component({
  selector: 'app-trouble-suggest',
  templateUrl: './trouble-suggest.component.html',
  styleUrls: ['./trouble-suggest.component.scss']
})
export class TroubleSuggestComponent implements OnInit {
  @Input() alarmCode: string;
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  public troubleList: any = [];
  ringChartOption;
  errorReasonStatisticsChartType;   // 故障原因统计报表显示的类型  chart 图表   text 文字
  constructor(
    public $nzI18n: NzI18nService,
    public $alarmService: AlarmService,
  ) {
    this.language = this.$nzI18n.getLocaleData('alarm');
  }
  ngOnInit() {
    this.getSugges();
  }
  /**
   * 获取告警建议
   */
  getSugges() {
    this.$alarmService.queryExperienceInfo(this.alarmCode).subscribe((result: Result) => {
      if (result.code === 0) {
        this.troubleList = result.data;
        // echart 数据
        const chartData = result.data.map(item => ({
          value: item.percentage,
          name: item.breakdownReason,
        }));
        this.errorReasonStatisticsChartType = 'chart';
        this.ringChartOption = ChartUtil.setTroubleRingChartOption(chartData);
      }
    });
  }
}
