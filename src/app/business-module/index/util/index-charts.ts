// tslint:disable-next-line:class-name
export class indexChart {
  /**
   * 环形图配置
   * param data
   * param name
   */
  public static setRingChartOption(data, title) {
    const option =  {
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: '222'
      },
      grid: {
        containLabel: false
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: ['40%', '65%'],
          center: ['50%', '55%'],      // 位置距离
          avoidLabelOverlap: true,
          label: {
            normal: {
              formatter: '{b} \n {d}%',
            },
          },
          labelLine: {
            normal: {
              show: true
            }
          },
          data: data
        }
      ]
    };
    return option;
  }


  /**
   * 饼状图配置
   * param data
   * param name
   */
  public static setBarChartOption(data, title) {
    const option =  {
      tooltip: {
        trigger: 'item',
        confine: true, // 超出当前范围
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: '222'
      },
      grid: {
        containLabel: false
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: ['0%', '60%'],
          center: ['50%', '55%'],      // 位置距离
          avoidLabelOverlap: true,
          minAngle: 5,
          hoverAnimation: false,　　  // 是否开启 hover 在扇区上的放大动画效果。
          label: {
            normal: {
              formatter: '{b} \n {d}%',
            },
          },
          labelLine: {
            normal: {
              show: true
            }
          },
          data: data
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
  public static setPieChartOption(data, name , title) {
    const option = {
      color: ['#fb7356', '#959595', '#35aace', '#36d1c9', '#f8c032'],
      tooltip : {
        trigger: 'item',
        confine: true,
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      grid: {
        containLabel: false
      },
      series : [
        {
          name: title,
          avoidLabelOverlap: true,
          type: 'pie',
          radius : '65%',
          center: ['50%', '55%'],
          minAngle: 5,
          hoverAnimation: false,　　  // 是否开启 hover 在扇区上的放大动画效果。
          data: data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
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
  public static setHistogramChartOption(data, name) {
    const option = {
      color: ['#009edf', '#fb7356', '#959595', '#35aace', '#36d1c9', '#f8c032'],
      xAxis: {
        type: 'category',
        data: name,
        axisLabel: {
          color: '#333',
          fontSize: 12,
          interval: 0,
          rotate: 45,
          formatter: function(params) {
            if (params.length > 4) {
              return params.slice(0, 4) + '...';
            }
            return params;
          }
        },
        axisLine: {
          lineStyle: {
            color: '#009edf'
          }
        }
      },
      grid: {
        left: '13px',
        right: '4%',
        bottom: '5px',
        top: '10px',
        containLabel: true
      },
      tooltip : {
        trigger: 'axis',
        confine: true,
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: {
          color: '#333',
        },
        axisLine: {
          lineStyle: {
            color: '#009edf'
          }
        },
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
        type: 'bar',
        avoidLabelOverlap: true,
        barWidth: 20
      }]
    };
    return option;
  }

  /**
   * 折线图图配置
   * param data
   * param name
   */
  public static setLineChartOption(data, name) {
    const option = {
      color: ['#009edf', '#fb7356', '#959595', '#35aace', '#36d1c9', '#f8c032'],
      xAxis: {
        type: 'category',
        data: name,
        axisLabel: {
          color: '#333',
          interval: 0,
          rotate: 45,
          fontSize: 12,
          formatter: function(params) {
           if (params.length > 6) {
             return params.slice(5);
           }
          }
        },
        axisLine: {
          lineStyle: {
            color: '#009edf'
          }
        }
      },
      grid: {
        left: '13px',
        right: '4%',
        bottom: '5px',
        top: '10px',
        containLabel: true
      },
      tooltip : {
        trigger: 'axis',
        confine: true
      },
      legend : {
        show: false
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: {
          color: '#333',
        },
        axisLine: {
          lineStyle: {
            color: '#009edf'
          }
        },
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: ['#aaa'],
            type: 'dotted',
            width: 0.5
          }
        }
      },
      series: data
    };
    return option;
  }

  /**
   * 端口配置
   * param data
   * param dataCount
   */
  public static setPortChartOption(data, dataCount, tips) {
    return {
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      grid: {
        containLabel: false // 内容溢出
      },
      title: {
        text: tips.text,
        subtext: data.totalCount ? data.totalCount : '0',
        left: '19%',
        top: '35%',
        textAlign: 'center',
        textStyle: {
          color: '#333',
          fontSize: 14,
        },
        subtextStyle: {
          color: 'red',
          fontSize: 14,
        }
      },
      legend: {
        orient: 'vertical',
        left: '45%',
        top: '20%',
        width: 100,
        icon: 'circle',
        formatter: function (name) {
          let target;
          for (let i = 0; i < dataCount.length; i++) {
            if (dataCount[i].name === name) {
              target = dataCount[i].value;
            }
          }
          const percent = data.totalCount ? ((target / data.totalCount) * 100).toFixed(2) : 0;
          const arr = ['{b|' + name + '}',
            '{b|' + percent + '%}',
            '{a|' + target + '}'];
          return arr.join('  ');
        },
        textStyle: {
          rich: {
            a: {
              fontSize: 14,
              color: '#000',
            },
            b: {
              fontSize: 12,
              color: '#333'
            }
          }
        }
      },
      color: ['#fbd517', '#009edf', '#ff6608', '#e51216', '#ef488d'],
      series: [
        {
          name: tips.name,
          type: 'pie',
          radius: ['50%', '75%'],
          center: ['20%', '45%'],      // 位置距离
          avoidLabelOverlap: true,    // 避免标注重叠
          hoverAnimation: false,　　　　// 移入放大
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
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
  }

}
