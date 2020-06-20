import {CommonUtil} from './common-util';

export class ChartUtil {

  public static getLanguage() {
    let save, total, sum;
    const language = CommonUtil.toggleNZi18n().language as any;
    save = language.common.save;
    total = language.common.total;
    sum = language.common.sum;
    return {save, total, sum};
  }

  /**
   * 环形图配置
   * param data
   * param name
   */
  public static setRingChartOption(data, name) {
    let chartData = [];
    let chartName = [];
    if (!data.every(item => item.value === 0)) {
      data.forEach((item, index) => {
        if (item.value !== 0) {
          chartData.push(item);
          chartName.push(item.name);
        }
      });
    } else {
      chartData = data;
      chartName = name;
    }
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',

      },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        x: 'center',
        data: chartName,
        right: 1,
      },
      grid: {
        containLabel: false
      },
      toolbox: {
        feature: {
          saveAsImage: {
            title: this.getLanguage().save,
            icon: 'path://M819.814-72.064H204.186c-84.352 0-152.986 68.582-152.986 152.96V687.078c0 84.378 68.634 153.012 152.986 153.012H819.84c84.326-0.026 152.96-68.634 152.96-153.012v-606.182c0-84.378-68.608-152.96-152.986-152.96zM204.186 780.365c-51.456 0-93.312-41.83-93.312-93.312v-606.157c0-51.456 41.856-93.338 93.312-93.338H819.84c51.456 0 93.312 41.882 93.312 93.338V687.078c0 51.482-41.856 93.312-93.312 93.312H204.186v-0.025zM807.04 382.566H216.96V840.064h590.106v-457.498h-0.026z m-530.432 59.7h470.784V780.365H276.608v-338.1z m323.251 250.29h59.648V493.62H599.86V692.557z m0 0'
          }
        }
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['50%', '60%'],
          avoidLabelOverlap: true,
          minAngle: 5,
          hoverAnimation: true,
          label: {
            normal: {   // 视觉引导线
              // show: true,
              // position: 'right',
              formatter: '{b} \n{d}%',
            },
          },
          labelLine: {
            normal: {
              show: true
            }
          },
          data: chartData
        }
      ]
    };
    return option;
  }

  /**
   * 扇形图配置
   * param data
   * param name
   */
  public static setPieChartOption(data, name) {
    let chartData = [];
    let chartName = [];
    if (!data.every(item => item.value === 0)) {
      data.forEach((item, index) => {
        if (item.value !== 0) {
          chartData.push(item);
          chartName.push(item.name);
        }
      });
    } else {
      chartData = data;
      chartName = name;
    }
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: '70%',
          data: chartData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            length: 10,
            length2: 10
          }
        }
      ]
    };
    return option;
  }

  /**
   * 时间日期折线图图配置
   * param data
   * param name
   */
  public static setLineTimeChartOption(data) {
    const seriesData = [];
    const seriesName = [];
    data.forEach(item => {
      if (item.value !== 0) {
        seriesData.push({
          type: 'line',
          data: item.value,
          name: item.name
        });
        seriesName.push(item.name);
      }
    });
    const option = {
      toolbox: {
        feature: {
          saveAsImage: {
            title: this.getLanguage().save,
            icon: 'path://M819.814-72.064H204.186c-84.352 0-152.986 68.582-152.986 152.96V687.078c0 84.378 68.634 153.012 152.986 153.012H819.84c84.326-0.026 152.96-68.634 152.96-153.012v-606.182c0-84.378-68.608-152.96-152.986-152.96zM204.186 780.365c-51.456 0-93.312-41.83-93.312-93.312v-606.157c0-51.456 41.856-93.338 93.312-93.338H819.84c51.456 0 93.312 41.882 93.312 93.338V687.078c0 51.482-41.856 93.312-93.312 93.312H204.186v-0.025zM807.04 382.566H216.96V840.064h590.106v-457.498h-0.026z m-530.432 59.7h470.784V780.365H276.608v-338.1z m323.251 250.29h59.648V493.62H599.86V692.557z m0 0'
          }
        }
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: seriesName
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: true
        }
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          start: 0,
          end: 100,
          bottom: 0
        },
        {
          type: 'inside',
          start: 0,
          end: 35
        },
      ],
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        }
      },
      series: seriesData
    };
    return option;
  }

  /**
   * 柱状图配置
   * param data
   * param name
   */
  public static setBarChartOption(data, name) {
    const chartData = [];
    const chartName = [];
    data.forEach((item, index) => {
      chartData.push(item);
      chartName.push(name[index]);
    });
    const option = {
      toolbox: {
        feature: {
          saveAsImage: {
            title: this.getLanguage().save,
            icon: 'path://M819.814-72.064H204.186c-84.352 0-152.986 68.582-152.986 152.96V687.078c0 84.378 68.634 153.012 152.986 153.012H819.84c84.326-0.026 152.96-68.634 152.96-153.012v-606.182c0-84.378-68.608-152.96-152.986-152.96zM204.186 780.365c-51.456 0-93.312-41.83-93.312-93.312v-606.157c0-51.456 41.856-93.338 93.312-93.338H819.84c51.456 0 93.312 41.882 93.312 93.338V687.078c0 51.482-41.856 93.312-93.312 93.312H204.186v-0.025zM807.04 382.566H216.96V840.064h590.106v-457.498h-0.026z m-530.432 59.7h470.784V780.365H276.608v-338.1z m323.251 250.29h59.648V493.62H599.86V692.557z m0 0'
          }
        }
      },
      xAxis: {
        type: 'category',
        data: chartName,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          color: '#333',
          interval: 0,
          rotate: 40,
          formatter: function (params) {
            if (params.length > 4) {
              return params.slice(0, 4) + '...';
            }
            return params;
          }
        },
      },
      legend: {
        data: chartName,
      },
      grid: {
        left: '13px',
        right: '4%',
        bottom: '11px',
        top: '30px',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: ['#aaa'],
            type: 'dotted',
            width: 0.5
          }
        },
      },
      series: [{
        data: chartData,
        type: 'bar',
        barWidth: '30%',
        label: {
          show: true,
          position: 'top',
        }
      }]
    };
    return option;
  }

  /**
   * topN柱状图配置
   * param data
   * param name
   */
  public static setBarsChartOption(data, title, type?) {
    const seriesName = [];
    const seriesData = [];
    data.forEach(item => {
      seriesName.push(item.deviceName);
      seriesData.push(item.sensorValue);
    });
    const option = {
      toolbox: {
        feature: {
          saveAsImage: {
            title: this.getLanguage().save,
            icon: 'path://M819.814-72.064H204.186c-84.352 0-152.986 68.582-152.986 152.96V687.078c0 84.378 68.634 153.012 152.986 153.012H819.84c84.326-0.026 152.96-68.634 152.96-153.012v-606.182c0-84.378-68.608-152.96-152.986-152.96zM204.186 780.365c-51.456 0-93.312-41.83-93.312-93.312v-606.157c0-51.456 41.856-93.338 93.312-93.338H819.84c51.456 0 93.312 41.882 93.312 93.338V687.078c0 51.482-41.856 93.312-93.312 93.312H204.186v-0.025zM807.04 382.566H216.96V840.064h590.106v-457.498h-0.026z m-530.432 59.7h470.784V780.365H276.608v-338.1z m323.251 250.29h59.648V493.62H599.86V692.557z m0 0'
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        minInterval: 1,
        max: function (value) {
          return Math.ceil(value.max) + 2;
        }
      },
      yAxis: {
        type: 'category',
        data: seriesName,
      },
      series: {
        type: 'bar',
        data: seriesData,
        barWidth: '30%',
        label: {
          show: true,
          position: 'right',
          formatter: function (event) {
            if (type) {
              return event.value + '%';
            } else {
              return event.value;
            }
          }
        }
      }
    };
    if (title) {
      option['title'] = title;
    }
    return option;
  }

  /**
   * 折线图图配置
   * param data
   * param name
   */
  public static setLineChartOption(data, name) {
    const option = {
      color: ['#009edf'],
      xAxis: {
        type: 'category',
        data: name
      },
      toolbox: {
        feature: {
          saveAsImage: {
            title: this.getLanguage().save,
            icon: 'path://M819.814-72.064H204.186c-84.352 0-152.986 68.582-152.986 152.96V687.078c0 84.378 68.634 153.012 152.986 153.012H819.84c84.326-0.026 152.96-68.634 152.96-153.012v-606.182c0-84.378-68.608-152.96-152.986-152.96zM204.186 780.365c-51.456 0-93.312-41.83-93.312-93.312v-606.157c0-51.456 41.856-93.338 93.312-93.338H819.84c51.456 0 93.312 41.882 93.312 93.338V687.078c0 51.482-41.856 93.312-93.312 93.312H204.186v-0.025zM807.04 382.566H216.96V840.064h590.106v-457.498h-0.026z m-530.432 59.7h470.784V780.365H276.608v-338.1z m323.251 250.29h59.648V493.62H599.86V692.557z m0 0'
          }
        }
      },
      grid: {
        left: '13px',
        right: '4%',
        bottom: '11px',
        top: '30px',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: name
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: ['#aaa'],
            type: 'dotted',
            width: 0.5
          }
        }
      },
      series: [{
        data: data,
        type: 'line',
        smooth: true
      }]
    };
    return option;
  }

  /**
   * 环形图配置
   * param data
   * param name
   */
  public static setWorkRingChartOption(total, dataCount) {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      grid: {
        containLabel: false // 内容溢出
      },
      legend: {
        itemGap: 3,
        orient: 'vertical',
        right: 0,
        top: '5%',
        width: 100,
        icon: 'circle',
        formatter: function (name) {
          let target;
          if (total !== 0) {
            for (let i = 0; i < dataCount.length; i++) {
              if (dataCount[i].name === name) {
                target = dataCount[i].value;
              }
            }
            const arr = ['{b|' + name + '}',
              '{b|' + ((target / total) * 100).toFixed(2) + '%}',
              '{a|' + target + '}'];
            return arr.join('  ');
          } else {
            for (let i = 0; i < dataCount.length; i++) {
              if (dataCount[i].name === name) {
                target = dataCount[i].value;
              }
            }
            const arr = ['{b|' + name + '}',

              '{a|' + target + '}'];
            return arr.join('  ');
          }
        },
        textStyle: {
          rich: {
            a: {
              fontSize: 10,
              color: '#000',
            },
            b: {
              fontSize: 10,
              color: '#333'
            }
          }
        }
      },
      graphic: {
        type: 'text',
        top: 'center',
        left: '16%',
        style: {
          text: `${this.getLanguage().total}\n ${total}`,
          textAlign: 'center',
          fill: '#000',
          fontSize: 12,
          fontWeight: 'bold',
        }
      },
      color: ['#fbd517', '#009edf', '#ff6608', '#e51216', '#ef488d'],
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['20%', '50%'],      // 位置距离
          avoidLabelOverlap: true,    // 避免标注重叠
          hoverAnimation: false,　　　　// 移入放大
          label: {
            normal: {
              fontSize: 12,
              show: false,
              position: 'center',
              formatter: () => {
                return `${this.getLanguage().sum}\n${total}`;
              }
            },
            emphasis: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: true
            }
          },
          data: dataCount
        }
      ]
    };
    return option;
  }

  /**
   * 柱状图配置
   * param data
   * param name
   */
  public static setWorkBarChartOption(data, name) {
    const chartData = [];
    const chartName = [];
    data.forEach((item, index) => {
      chartData.push(item);
      chartName.push(name[index]);
    });
    const option = {
      xAxis: {
        type: 'category',
        data: chartName,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: 0,
          rotate: -30,
          margin: 20,
          textStyle: {
            align: 'center'
          },
        },
      },
      legend: {
        data: chartName,
      },
      grid: {
        left: '13px',
        right: '4%',
        bottom: '11px',
        top: '30px',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: ['#aaa'],
            type: 'dotted',
            width: 0.5
          }
        }
      },
      series: [{
        data: chartData,
        type: 'bar',
        label: {
          show: true,
          position: 'top',
        }
      }]
    };
    return option;
  }
  /**
   * 环形图配置
   * param data
   * param name
   */
  public static setTroubleRingChartOption(dataCount) {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      grid: {
        containLabel: false // 内容溢出
      },
      legend: {
        orient: 'vertical',
        right: 0,
        top: '5%',
        width: 100,
      },
      color: ['#C53431', '#2F4553', '#649EA9'],
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['40%', '50%'],      // 位置距离
          avoidLabelOverlap: false,    // 避免标注重叠
          hoverAnimation: false,　　　　// 移入放大
          label: {
            normal: {
              show: true,
              fontSize: 12,
              position: 'outter',
              formatter: (params) => {
                let total = 0;
                dataCount.forEach(item => {
                    total += item.value;
                });
                const percent = (params.data.value / total).toFixed(2);
                return params.data.name + '\n' + percent + '%' ;
              }
            },
          },
          labelLine: {
            normal: {
              length: 15,
              length2: 10,
            }
          },
          data: dataCount
        }
      ]
    };
    return option;
  }

}
