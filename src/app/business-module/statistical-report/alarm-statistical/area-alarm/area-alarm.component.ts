import {Component, OnInit, ViewChild} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {AlarmService} from '../../../../core-module/api-service/alarm';
import {ChartUtil} from '../../../../shared-module/util/chart-util';
import {NzI18nService} from 'ng-zorro-antd';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {Result} from '../../../../shared-module/entity/result';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ScreeningConditionComponent} from '../screening-condition/screening-condition.component';
@Component({
  selector: 'app-area-alarm',
  templateUrl: './area-alarm.component.html',
  styleUrls: ['./area-alarm.component.scss']
})
export class AreaAlarmComponent implements OnInit {

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
  // 表格翻页配置
  pageBean: PageBean = new PageBean(10, 1, 1);
  // 表格配置
  tableConfig: TableConfig;
  // 接口数据
  allData;
  // 进度条
  ProgressShow = false;
  constructor(
    private $NZi18: NzI18nService,
    public $alarmService: AlarmService,
    public $message: FiLinkModalService,
  ) {
    this.language = this.$NZi18.getLocaleData('alarm');
  }



  /**
   * 统计
   * param event
   */
  search(event) {
    // 进度条
    this.ProgressShow = true;
    this.$alarmService.areaAlarmStatistics(event).subscribe(res => {
      if (res['code'] === 0) {
        this.result = false;
        this.__dataset = [];
        this.allData = res['data'];
        this.setChartData();
        // 列表
        this.table();
        // 进度条
        this.ProgressShow = false;
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

  /**
   * 表格数据配置
   */
  table() {
    Object.keys(this.allData).forEach(key => {
      if ( key !== 'total' ) {
        const data = {
          ...this.allData[key],
          areaId: this.byKeyGetValue(this.appScreenCondition.treeNodes, key)
        };
        this.__dataset.push(data);
        // this._datasetMain.push(data);
      }
    });
    this.tableConfig.isLoading = false;
  }

  /**
   * 设置列表数据
   */
  setChartData() {
    const ringData = [];
    const ringName = [];
    const barData = [];
    const barName = [];
    Object.keys(this.allData).forEach(key => {
      // if ( this.allData[key].areaAlarmCount ) {
        ringData.push({
          value: this.allData[key].areaAlarmCount,
          name: this.byKeyGetValue(this.appScreenCondition.treeNodes, key)
        });
        ringName.push(this.byKeyGetValue(this.appScreenCondition.treeNodes, key));
        barData.push(this.allData[key].areaAlarmCount);
        barName.push(this.byKeyGetValue(this.appScreenCondition.treeNodes, key));
      // }
    });
      setTimeout(() => this.ringChartInstance.setOption(ChartUtil.setRingChartOption(ringData, ringName)));
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
      noExportHtml: true,
      showSearchExport: true,
      columnConfig: data,
      handleSearch: (event) => {
        // this.__dataset = this._datasetMain;
        if ( event && event.length ) {
          // 有筛选数据时进入
          this.__dataset = this._datasetMain.filter(items => {
            return event.every(item => items[item.filterField] + '' === item.filterValue.trim() ) && items;
          });
        } else {
          // 重置表格
          // this.__dataset = this._datasetMain;
        }
      },
      handleExport: (event) => {
        // const objectList = [];
        // Object.keys(this.allData).forEach(item => {
        //   if ( item !== 'total' ) {
        //     objectList.push({ areaId: item, ...this.allData[item] });
        //   }
        // });
        // const queryCondition = new QueryCondition();
        // queryCondition.bizCondition = 'arearAtio';
        // 处理参数
        const body = {
          queryCondition: new QueryCondition(),
          columnInfoList: event.columnInfoList,
          excelType: event.excelType,
          // bizCondition: 'arearAtio',
          objectList: this.__dataset,
        };
        body.queryCondition.bizCondition = 'areaRatio';
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
      {title: '', key: 'areaId',  width: 200, searchable: true, searchConfig: {}},
      {title: this.language.areaAlarmNumber, key: 'areaAlarmCount',  width: 100, searchable: true,
        searchConfig: { type: 'input' }},
      {title: this.language.areaAlarmRatio, key: 'areaAlarmRate',  width: 100, searchable: true,
        searchConfig: { type: 'input' }},
      // {
      //   title: this.language.operate, searchable: true,
      //   searchConfig: { type: 'operate' }, key: '',
      //   width: 120
      // }
    ];
    this.initTableConfig(tableColumn);
  }

}
