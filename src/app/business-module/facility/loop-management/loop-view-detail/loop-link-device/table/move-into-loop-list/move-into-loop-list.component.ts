import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {TableComponent} from '../../../../../../../shared-module/component/table/table.component';
import {FacilityLanguageInterface} from '../../../../../../../../assets/i18n/facility/facility.language.interface';
import {PageBean} from '../../../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../../../shared-module/entity/tableConfig';
import {QueryCondition, SortCondition} from '../../../../../../../shared-module/entity/queryCondition';

/**
 * 回路详情移入回路列表弹框
 */
@Component({
  selector: 'app-move-into-loop-list',
  templateUrl: './move-into-loop-list.component.html',
  styleUrls: ['./move-into-loop-list.component.scss']
})
export class MoveIntoLoopListComponent implements OnInit, OnDestroy {
  @Input()
  set xcVisible(params) {
    this.isXcVisible = params;
    this.xcVisibleChange.emit(this.isXcVisible);
  }

  // 弹框标题
  @Input() title: string;

  // 弹框是否开启触发事件
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 选择列表数据
  @Output() selectListDataChange = new EventEmitter<Array<any>>();
  // 列表实例
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 列表数据
  public dataSet = [];
  // 列表分页实体
  public pageBean: PageBean = new PageBean(10, 1, 1);
  // 列表配置
  public tableConfig: TableConfig;
  // 列表查询条件
  public queryCondition: QueryCondition = new QueryCondition();
  // 弹框是否开启
  public isXcVisible: boolean = false;
  // 选中数据
  public selectListData: Array<any>;

  // 弹框是否开启
  get xcVisible() {
    return this.isXcVisible;
  }

  constructor(
    private $nzI18n: NzI18nService,
  ) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    // 表格初始化
    this.initTableConfig();
    // 刷新列表
    this.refreshData();
  }


  /**
   * 刷新回路列表
   */
  private refreshData() {
    this.dataSet = [{loopName: 'ddTest1'}, {loopName: 'ddTest2'}];
    this.tableConfig.isLoading = false;
  }


  /**
   * 表格分页
   */
  public pageChange(event: PageBean) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   *  Modal 打开后的回调
   */
  public afterModelOpen(): void {

  }

  /**
   * 确定
   */
  public handleOk() {
    this.selectListDataChange.emit(this.selectListData);
    this.xcVisible = false;
  }

  /**
   * Modal 完全关闭后的回调
   */
  public afterModelClose(): void {

  }


  /**
   * 初始化表格配置
   */
  private initTableConfig() {
    this.tableConfig = {
      outHeight: 108,
      primaryKey: ' ',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: true,
      showSearchExport: false,
      scroll: {x: '1804px', y: '340px'},
      noIndex: false,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        { // 回路名称
          title: this.language.loopName,
          key: 'loopName',
          width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 回路类型
          title: this.language.loopType,
          key: 'loopType',
          width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 所属配电箱
          title: this.language.distributionBox,
          key: 'distributionBoxId',
          width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 备注
          title: this.language.remarks,
          key: 'remark',
          width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '',
          width: 180,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      rightTopButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        // this.refreshData();
      },
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        // this.refreshData();
      }
    };
  }


  /**
   * 关闭弹框
   */
  public handleCancel(): void {
    this.xcVisible = false;
  }


  public ngOnDestroy(): void {
    this.tableComponent = null;
  }


}
