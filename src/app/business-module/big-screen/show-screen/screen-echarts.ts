export class ScreenEcharts {
  /**
   * echarts图表option赋值
   * param data
   * param that
   */
  public static initChart(data, that) {
    switch (data.type) {
      case 'nowAlarm':
        that.nowAlarm = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: [that.language.urgentAlarm, that.language.mainAlarm, that.language.minorAlarm, that.language.hintAlarm],
            top: '20%',
            textStyle: {
              color: '#00e8ea'
            }
          },
          color: ['#ff0000', '#fe7d02', '#e6ce13', '#02a1e2'],
          series: [
            {
              name: that.language.accessSource,
              type: 'pie',
              radius: [0, '87%'],
              label: {
                normal: {
                  position: 'inside',
                  formatter: '{d}%  ',
                  fontSize: '11',
                  color: 'black',
                },
                align: 'center'
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              data: [
                {
                  value: data.datas.urgentAlarmCount ? data.datas.urgentAlarmCount : null,
                  name: that.language.urgentAlarm
                },
                {value: data.datas.mainAlarmCount ? data.datas.mainAlarmCount : null, name: that.language.mainAlarm},
                {value: data.datas.minorAlarmCount ? data.datas.minorAlarmCount : null, name: that.language.minorAlarm},
                {value: data.datas.hintAlarmCount ? data.datas.hintAlarmCount : null, name: that.language.hintAlarm}
              ]
            }
          ]
        };
        break;
      case 'numAlarm':
        that.numAlarm = {
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255,0,255,0)',
            position: 'top',
            formatter: function (params) {
              return `<div style="background: url('../../../../assets/img/screen/tips.png')no-repeat;
                            background-size: 100% 100%;text-align: center;line-height: 40px;padding: 6px;
                            font-size: 14px; color: #aae6f7">${params.name}:${params.value}
                       </div>`;
            }
          },
          color: ['#009edf'],
          grid: {
            left: '2%',
            right: '7%',
            bottom: '5%',
            top: '1%',
            containLabel: true
          },
          xAxis:
            {
              type: 'value',
              minInterval: 1,
              axisLine: {
                show: false,
              },
              splitLine: {
                show: true,
                lineStyle: {
                  show: false,
                  color: ['#034e8a'],
                  width: 1,
                  type: 'solid'
                },
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: '#00fcf9',
                  fontSize: 10
                }
              }
            },
          yAxis: {
            type: 'category',
            data: data.datas.yData,
            splitLine: {
              show: true,
              lineStyle: {
                show: false,
                color: ['#034e8a'],
                width: 1,
                type: 'solid'
              },
            },
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              color: '#00fcf9',
              fontSize: 10,
              align: 'right',
              formatter: function (params) {
                params = params.trim();
                let newParamsName = '';
                if (params.length > 5) {
                  let tempStr = ''; // 表示每一次截取的字符串
                  let count = 0; // 计数，汉字占一个，数字字母占0.5
                  let start = 0; // 开始截取位置
                  for (let i = 0; i < params.length; i++) {
                    if (/^[a-zA-Z0-9]$/.test(params.charAt(i))) {
                      count = count + 0.5;
                    } else {
                      count = count + 1;
                    }
                    if (count >= 5) {
                      tempStr = params.substring(start, i + 1) + '\n';
                      newParamsName += tempStr;
                      start = i + 1;
                      // 5个字符分一次
                      count = 0;
                    } else if (count < 5 && i === params.length - 1) {
                      tempStr = params.substring(start);
                      newParamsName += tempStr;
                    }
                  }
                } else {
                  newParamsName = params;
                }
                return newParamsName;
              }
            }
          },
          series: [
            {
              name: that.language.accessSource,
              type: 'bar',
              itemStyle: {
                normal: {
                  color: function (params) {
                    // 首先定义一个数组
                    const colorList = ['#009edf', '#e61017', '#ff6600', '#f1c620', '#58c1f0', '#ffea01', '#0068b7', '#0bda0b'];
                    return colorList[params.dataIndex];
                  },
                  label: {
                    show: false
                  }
                }
              },
              barWidth: '20%',
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  color: '#00fcf9'
                }
              },
              data: data.datas.xData
            },
            {

              type: 'line',
              lineStyle: {
                color: '#224d95',
                width: '1'
              },
              barWidth: '60%',
              data: data.datas.xData
            }

          ]
        };
        break;
      case 'typeAlarm':
        that.typeAlarm = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          series: [
            {
              name: that.language.accessSource,
              type: 'pie',
              radius: ['50%', '68%'],
              selectedOffset: 53,
              label: {
                formatter: '{b}:{d}%',
              },
              itemStyle: {
                color: (params) => {
                  const temp = ['#58d9a8', '#f39804', '#4fc6e9', '#f7d404', '#fa7448'];
                  return temp[params.data.index];
                }
              },
              avoidLabelOverlap: true,
              data: data.datas
            }
          ]
        };
        break;
      case 'deviceStatusAlarm':
        that.deviceStatusAlarm = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          series: [
            {
              name: that.language.accessSource,
              type: 'pie',
              radius: ['50%', '68%'],
              selectedOffset: 53,
              itemStyle: {
                color: (params) => {
                  const temp = ['#8588e7', '#2da8d0', '#29cfcb', '#fd7150', '#959595', '#f8bf12'];
                  return temp[params.data.index];
                }
              },
              label: {
                formatter: '{b}:{d}%',
              },
              avoidLabelOverlap: true,
              data: data.datas
            }
          ]
        };
        break;
      case 'incrementAlarm':
        that.incrementAlarm = {
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255,0,255,0)',
            position: 'top',
            formatter: function (params) {
              return `<div style="background: url('../../../../assets/img/screen/tips.png') no-repeat;
                            background-size: 100% 100%;text-align: center;line-height: 40px;
                            padding: 6px; font-size: 14px; color: #aae6f7">${params.name}:${params.value}
                       </div>`;
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '11%',
            top: '6%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: data.datas.xData,
              splitLine: {
                show: false,
              },
              axisLabel: {
                textStyle: {
                  color: '#00fcf9'
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              minInterval: 1,
              splitLine: {
                show: false,
              },
              axisLabel: {
                textStyle: {
                  color: '#00fcf9'
                }
              }
            }
          ],
          series: [
            {
              name: '',
              type: 'line',
              smooth: true,
              stack: that.language.stack,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#0471a3' // 0% 处的颜色
                  }, {
                    offset: 1, color: '#151729' // 100% 处的颜色
                  }],
                }

              },
              itemStyle: {
                normal: {
                  color: '#5cd4e8'
                }
              },
              data: data.datas.yData
            }
          ]
        };
        break;
      default:
        break;
    }
  }
}
