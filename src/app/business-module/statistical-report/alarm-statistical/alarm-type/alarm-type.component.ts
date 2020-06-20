import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartUtil} from '../../../../shared-module/util/chart-util';
import {NzI18nService} from 'ng-zorro-antd';
import {ColumnConfig, TableConfig} from '../../../../shared-module/entity/tableConfig';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {AlarmService} from '../../../../core-module/api-service/alarm';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {getAlarmLevelName} from '../../../facility/share/const/facility.config';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {Result} from '../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {ScreeningConditionComponent} from '../screening-condition/screening-condition.component';
import {log} from 'util';

@Component({
  selector: 'app-alarm-type',
  templateUrl: './alarm-type.component.html',
  styleUrls: ['./alarm-type.component.scss']
})
export class AlarmTypeComponent implements OnInit {
  // 拿到选择器所有属性
  @ViewChild('appScreenCondition') appScreenCondition: ScreeningConditionComponent;
  // 国际化
  public language: AlarmLanguageInterface;
  // 控制图表是否显示
  result = true;
  // 柱状图实例
  barChartInstance;
  // 饼图实例
  ringChartInstance;
  // 表格数据
  __dataset = [];
  // 第一次请求列表数据过来后 保存起来
  _datasetMain = [];
  pageBean: PageBean = new PageBean(10, 1, 1);
  // 表格配置
  tableConfig: TableConfig;
  // 请求数据
  allData;
  // 区域信息
  areaList;
  // 进度条
  ProgressShow = false;
  areaName;

  constructor(
    private $NZi18: NzI18nService,
    public $alarmService: AlarmService,
    public $message: FiLinkModalService,
  ) {
    this.language = this.$NZi18.getLocaleData('alarm');
  }



  search(event) {
    this.ProgressShow = true;
    // 将区域的值 先保存起来
    this.areaList = event.bizCondition.areaList;
    this.$alarmService.queryAlarmConutByLevelAndArea(event).subscribe(res => {
      if (res['code'] === 0) {
        this.ProgressShow = false;
        this.__dataset = [];
        this.allData = res['data'];
        this.result = false;
        this.setChartData();
        Object.keys(this.allData).forEach(key => {
          if (key !== 'total') {
            const data = {
              ...this.allData[key],
              // areaId: this.byKeyGetValue(key),
              areaId: this.byKeyGetValue(this.appScreenCondition.treeNodes, key)
            };
            console.log(data);
            this.__dataset.push(data);
            // this._datasetMain.push(data);
          }
        });
        // 列表
        this.table();
      }
    });
  }


  byKeyGetValue(data: any[], id) {
    const arr = [];
    const pushToArr = (treeNodes) => {
      treeNodes.forEach(item => {
        arr.push(item);
        if (item.children && item.children.length > 0) {
          pushToArr(item.children);
        }
      });
    };
    pushToArr(data);
    const name = arr.filter(_item => _item.areaId === id);
    return name[0].areaName;
  }


  table() {
    /**
     * 先找出 已经存在的 将其在区域数组中移除
     * 重新在重组 数组
     */
    this.__dataset.forEach(listData => {
      const index = this.areaList.findIndex(area => area === listData.areaId);
      this.areaList.splice(index, 1);
    });
    this.areaList.forEach(areaName => {
      const list = {
        areaId: areaName,
        hintAlarmCount: 0,
        mainAlarmCount: 0,
        minorAlarmCount: 0,
        urgentAlarmCount: 0
      };
      this.__dataset.push(list);
    });
    this.tableConfig.isLoading = false;
  }

  // 数据转化 传入英文 返回中文
  analysisData(data) {
    return getAlarmLevelName(this.$NZi18, data) + this.language.alarm;
  }

  /**
   * 设置列表数据
   */
  setChartData() {
    const ringData = [];
    const ringName = [];
    const barData = [];
    const barName = [];
    Object.keys(this.allData.total).forEach(key => {
      // if ( this.allData.total[key] ) {
      ringData.push({
        value: this.allData.total[key],
        name: this.analysisData(key)
      });
      ringName.push(this.analysisData(key));
      barData.push(this.allData.total[key]);
      barName.push(this.analysisData(key));
      // }
    });
    // 左侧的饼图
    setTimeout(() => this.ringChartInstance.setOption(ChartUtil.setRingChartOption(ringData, ringName)));
    // 右侧的折线图
    setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarChartOption(barData, barName)));
  }

  /**
   * 获取饼图实例
   * param event
   */
  getRingChartInstance(event) {
    this.ringChartInstance = event;
  }

  /**
   * 获取柱状图实例
   * param event
   */
  getBarChartInstance(event) {
    this.barChartInstance = event;
  }

  initTableConfig(data) {
    this.tableConfig = {
      noIndex: true,
      showSearchSwitch: false,
      showSearch: false,
      notShowPrint: true,
      showSearchExport: true,
      noExportHtml: true,
      // scroll: {x: '1000px', y: '325px'},
      columnConfig: data,
      handleSearch: (event) => {
        if (event && event.length) {
          // 有筛选数据时进入
          this.__dataset = this._datasetMain.filter(items => {
            return event.every(item => items[item.filterField] + '' === item.filterValue.trim()) && items;
          });
        } else {
          // 重置表格
          // this.__dataset = this._datasetMain;
        }
      },
      handleExport: (event) => {
        // const objectList = [];
        // Object.keys(this.allData).forEach(item => {
        //   if (item !== 'total') {
        //     objectList.push({areaId: item, ...this.allData[item]});
        //   }
        // });
        const queryCondition = new QueryCondition();
        queryCondition.bizCondition = 'alarmType';
        // 处理参数
        const body = {
          queryCondition: queryCondition,
          columnInfoList: event.columnInfoList,
          excelType: event.excelType,
          // bizCondition: 'alarmType',
          objectList: this.__dataset,
        };
        this.$alarmService.exportAlarmStatistical(body).subscribe((res: Result) => {
          if (res.code === 0) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    };
  }

  ngOnInit() {
    const tableColumn = [
      {
        title: '',
        key: 'areaId',
        width: 200,
        searchable: true,
        searchConfig: {}
      },
    ];
    const alarmLevel: any = getAlarmLevelName(this.$NZi18);
    alarmLevel.forEach(type => {
      tableColumn.push({
        title: type.label,
        key: type.code,
        width: 200,
        searchable: true,
        searchConfig: {type: 'input'}
      });
    });
    // tableColumn.push({
    //   title: this.language.operate, searchable: true,
    //   searchConfig: {type: 'operate'}, key: '',
    //   width: 120
    // });
    this.initTableConfig(tableColumn);
  }

}
