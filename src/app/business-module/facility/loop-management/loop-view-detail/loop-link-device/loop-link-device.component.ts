import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {QueryCondition} from '../../../../../shared-module/entity/queryCondition';
import {NzI18nService} from 'ng-zorro-antd';
import {TableComponent} from '../../../../../shared-module/component/table/table.component';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';

/**
 * 回路关联设施概览列表
 */
@Component({
  selector: 'app-loop-link-device',
  templateUrl: './loop-link-device.component.html',
  styleUrls: ['./loop-link-device.component.scss']
})

export class LoopLinkDeviceComponent implements OnInit, OnDestroy {
  // 列表实例
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 列表数据
  public dataSet = [];
  // 列表分页实体
  public pageBean: PageBean = new PageBean(5, 1, 1);
  // 列表配置
  public tableConfig: TableConfig;
  // 列表查询条件
  public queryCondition: QueryCondition = new QueryCondition();
  // 移入回路弹框标题
  public moveInLoopTitle: string;
  // 移入回路弹框是否展开
  public isVisible: boolean = false;

  constructor(
    private $nzI18n: NzI18nService,
  ) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData('facility');
    // 移入回路标题
    this.moveInLoopTitle = this.language.moveIntoLoop;
    this.initTableConfig();
    this.refreshData();
  }


  /**
   * 刷新列表
   */
  private refreshData(): void {
    this.tableConfig.isLoading = false;
    this.dataSet = [
      {deviceName: 'ddTest'}];
  }

  /**
   * 选择回路数据
   */
  public selectLoopData(ev: Array<any>): void {

  }

  /**
   * 分页
   */
  public pageChange(event: PageBean): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }


  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      primaryKey: '',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: false,
      showSizeChanger: false,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        { // 设施名称
          title: this.language.deviceName_a, key: 'deviceName',
          width: 150,
          configurable: false,
          searchable: false,
          isShowSort: false,
          searchConfig: {type: 'input'},
        },
        { // 设施类型
          title: this.language.deviceType_a, key: 'deviceType', width: 150,
          configurable: false,
          searchable: false,
          isShowSort: false,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        { // 设备数量
          title: this.language.equipmentQuantity, key: 'equipmentQuantity', width: 150,
          configurable: false,
          searchable: false,
          isShowSort: false,
          searchConfig: {type: 'input'},
        },
        { // 详细地址
          title: this.language.address, key: 'address', width: 150,
          configurable: false,
          searchable: false,
          isShowSort: false,
          searchConfig: {type: 'input'},
        },
        { // 设施状态
          title: this.language.deviceStatus_a,
          key: 'deviceStatus',
          width: 150,
          configurable: false,
          searchable: false,
          isShowSort: false,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate,
          searchable: false,
          searchConfig: {type: 'operate'},
          key: '', width: 150,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [
        { // 移入回路
          text: this.language.moveIntoLoop,
          className: 'fiLink-view-detail',
          handle: (currentIndex) => {
            this.isVisible = true;
          },
        },
        { // 移出回路
          text: this.language.moveOutOfTheLoop,
          className: 'fiLink-view-detail',
          handle: (currentIndex) => {
          },
        },
      ],
    };
  }


  public ngOnDestroy(): void {
    this.tableComponent = null;
  }

}
