import { Component, OnInit } from '@angular/core';
import echarts from 'echarts';
import {AlarmService} from '../../../../core-module/api-service/alarm';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
@Component({
  selector: 'app-alarm-increment',
  templateUrl: './alarm-increment.component.html',
  styleUrls: ['./alarm-increment.component.scss']
})
export class AlarmIncrementComponent implements OnInit {
  public language: AlarmLanguageInterface;
  // 进度条
  ProgressShow = false;
  display = {
    brokenLine: false
  };
  constructor(
    public $alarmService: AlarmService,
    private $NZi18: NzI18nService,
  ) {
    this.language = this.$NZi18.getLocaleData('alarm');
  }

  /**
   * 获取统计数据
   * param event
   */
  search(event) {
    this.ProgressShow = true;
    this.$alarmService.alarmIncrementalStatistics(event).subscribe(res => {
      if (res['code'] === 0) {
        // this.timeSort(res['data']);
        // if ( res['data'].every(item =>  !item.groupNum ) ) {
        //   this.display.brokenLine = true;
        // } else {
          this.display.brokenLine = false;
          const x = [];
          const y = [];
          this.timeSort(res['data']).forEach(item => {
            x.push(item['groupLevel']);
            y.push(item['groupNum']);
          });
          this.brokenLine( x , y );
       // }
        this.ProgressShow = false;
      }
    });
  }

  /**
   * 先进行时间排序
   */
  timeSort(data) {
    data.forEach(item => {
      item.time = +new Date(item['groupLevel']);
    });
    const res = data.sort( ( a, b ) =>  a.time - b.time );
    return res;
  }

  /**
   * 折线图配置
   * param x
   * param y
   */
  brokenLine( x, y ) {
    const myChart = echarts.init(document.getElementById('brokenLine'));
    const option = {
      title: {
        text: this.language.alarmIncrementDrawing,
        left: 'left'
      },
      grid: {
        show: true,
      },
      tooltip: {
        trigger: 'axis',
      },
      toolbox: {
        feature: {
          saveAsImage: {
            title: this.language.save,
            icon: 'path://M819.814-72.064H204.186c-84.352 0-152.986 68.582-152.986 152.96V687.078c0 84.378 68.634 153.012 152.986 153.012H819.84c84.326-0.026 152.96-68.634 152.96-153.012v-606.182c0-84.378-68.608-152.96-152.986-152.96zM204.186 780.365c-51.456 0-93.312-41.83-93.312-93.312v-606.157c0-51.456 41.856-93.338 93.312-93.338H819.84c51.456 0 93.312 41.882 93.312 93.338V687.078c0 51.482-41.856 93.312-93.312 93.312H204.186v-0.025zM807.04 382.566H216.96V840.064h590.106v-457.498h-0.026z m-530.432 59.7h470.784V780.365H276.608v-338.1z m323.251 250.29h59.648V493.62H599.86V692.557z m0 0'
          }
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        data: x
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        title: this.language.totalQuantity
      },
      dataZoom: {
        type: 'slider'
      },
      color: ['rgb(188,171,224)'],
      lineStyle: {
        width: 5,
      },
      series: [{
        // data: [820, 932, 901, 934, 1290, 1330, 1320],
        data: y,
        type: 'line'
      }]
    };
    myChart.setOption(option);
  }
  ngOnInit() {}

}
