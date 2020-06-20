import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import echarts from 'echarts';

/**
 * eChart组件
 */
@Component({
  selector: 'app-echart-group',
  templateUrl: './echart-group.component.html',
  styleUrls: ['./echart-group.component.scss']
})
export class EchartGroupComponent implements OnInit, AfterViewInit {
  // eChart Id
  id: string;
  // eChart实例
  eChartInstance;
  @Output() chartInstance = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.id = `chart${parseInt(Math.random() * 100000 + '', 0)}`;
  }

  ngAfterViewInit(): void {
    this.eChartInstance = echarts.init(document.getElementById(this.id));
    this.chartInstance.emit(this.eChartInstance);
    // setTimeout(() => {
    //   this.eChartInstance.setOption(this.chartOption);
    //   this.eChartInstance.hideLoading();
    // }, 10000);
  }
}
