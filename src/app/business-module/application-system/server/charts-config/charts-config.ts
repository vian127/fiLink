import {finalValue, strategyList} from '../../model/const/const';

export class ChartsConfig {
  /**
   * 设备状态
   */
  static equipmentStatus() {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      series: [
        {
          type: 'pie',
          radius: '55%',
          center: ['50%', '40%'],
          data: [
            {value: 335, name: '告警'},
            {value: 310, name: '正常'},
            {value: 234, name: '离线'},
            {value: 135, name: '失败'},
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  /**
   * 亮灯率
   * @ param data
   */
  static lightingRate(data, type) {
    return {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      axisLabel: {
        formatter: (val) => {
          const flag = typeof val === 'string' && type === strategyList.information;
          if (flag) {
            return val.substr(0, 7);
          }
          return val;
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '30%']
      },

      series: [
        {
          type: 'line',
          smooth: 0.6,
          symbol: 'none',
          lineStyle: {
            color: 'green',
            width: 1
          },
          markLine: {
            symbol: ['none', 'none'],
            label: {show: false},
          },
          areaStyle: {},
          data: ChartsConfig.dataFmt(data).yData
        }
      ]
    };
  }

  /**
   * 告警统计
   */
  static emergency() {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      series: [
        {
          type: 'pie',
          radius: '55%',
          center: ['50%', '40%'],
          data: [
            {value: 335, name: '通信告警'},
            {value: 310, name: '电力告警'},
            {value: 234, name: '设备告警'},
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  /**
   * 工单增量
   */
  static workOrder() {
    return {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['工单增量']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '工单增量',
          type: 'line',
          stack: '总量',
          data: [120, 132, 101, 134, 90, 230, 210]
        }
      ]
    };
  }

  /**
   * 用电量统计
   */
  static electricity(data) {
    return {
      xAxis: {
        type: 'category',
        name: '时间',
      },
      // axisLabel: {
      //   formatter: (val) => {
      //     return val;
      //   },
      // },
      yAxis: {},
      series: [{
        symbolSize: function (item) {
          return Math.round(item[1]);
        },
        data: ChartsConfig.electricityFmt(data, 'statisticsTime', 'electCons'),
        type: 'scatter'
      }]
    };
  }

  /**
   * 把数据处理成需要的格式
   * @ param data
   */
  static dataFmt(data) {
    const yAxis = [];
    const yData = [];
    const xAxis = Object.keys(data);
    xAxis.sort((a, b) => Number(a.replace(/-/g, '')) - Number(b.replace(/-/g, '')));
    xAxis.forEach(item => {
      data[item].forEach(elem => {
        yAxis.push(elem.lightingRate);
        yData.push([elem.statisticsTime, elem.lightingRate]);
      });
    });
    return {xAxis, yAxis, yData};
  }

  /**
   * 用电量统计需要的数据格式
   * @ param data
   */
  static electricityFmt(data, x, y) {
    return data.reduce((prev, item) => {
      prev.push([item[x], item[y]]);
      return prev;
    }, []);
  }
}
