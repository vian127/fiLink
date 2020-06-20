import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {EquipmentApiService} from '../../../share/service/equipment/equipment-api.service';
import {FacilityUtilService} from '../../../share/service/facility-util.service';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {TableComponent} from '../../../../../shared-module/component/table/table.component';
import {Result} from '../../../../../shared-module/entity/result';

/**
 * 控制对象组件
 */
@Component({
  selector: 'app-control-object',
  templateUrl: './control-object.component.html',
  styleUrls: ['./control-object.component.scss']
})
export class ControlObjectComponent implements OnInit, OnDestroy {
  // 弹框是否开启设置
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
  // 设备类型
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<any>;
  //  设备状态模版
  @ViewChild('equipmentStatusTemp') equipmentStatusTemp: TemplateRef<any>;
  // 列表实例
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 资产管理语言包
  public assetsLanguage: FacilityLanguageInterface;
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

  // 弹框开启
  get xcVisible() {
    return this.isXcVisible;
  }


  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $equipmentAipService: EquipmentApiService,
    private $facilityUtilService: FacilityUtilService
  ) {
  }

  /**
   * 初始化
   */
  ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData('facility');
    this.assetsLanguage = this.$nzI18n.getLocaleData('assets');
    // 标题
    this.title = this.assetsLanguage.controlledObject;
    // 表格初始化
    this.initTableConfig();
    // 刷新列表
    this.refreshData();
  }


  /**
   *  刷新列表数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$equipmentAipService.equipmentListByPage(this.queryCondition).subscribe((result: Result) => {
      this.tableConfig.isLoading = false;
      if (result.code === 0) {
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.dataSet = result.data || [];
        // 处理各种状态的显示情况
        this.dataSet.forEach(item => {
          item['_equipmentType'] = item.equipmentType;
          // 设备类型中文转化
          item.equipmentType = this.$facilityUtilService.getEquipmentType(this.$nzI18n, item.equipmentType);
          item['_equipmentStatus'] = item.equipmentStatus;
          // 设备状态中文转化
          item.equipmentStatus = item.equipmentStatus === null ? '' :
            this.$facilityUtilService.getEquipmentStatus(this.$nzI18n, item.equipmentStatus);
          item.areaName = item.areaInfo.areaName;
          item.deviceName = item.deviceInfo ? item.deviceInfo.deviceName : '';
        });
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }


  /**
   * 表格分页
   */
  public pageChange(event: PageBean): void {
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
      notShowPrint: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1804px', y: '340px'},
      noIndex: false,
      showSearchExport: false,
      columnConfig: [
        {
          type: 'select',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 62
        },
        // {
        //   type: 'serial-number', width: 62, title: this.language.serialNumber,
        //   fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        // },
        { // 名称
          title: this.language.name,
          key: 'equipmentName',
          width: 150, searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        { //  设施类型
          title: this.language.picInfo.facilityType,
          key: 'deviceName',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 设备类型
          title: this.language.type,
          key: 'equipmentType',
          isShowSort: true,
          searchable: true,
          type: 'render',
          width: 200,
          renderTemplate: this.equipmentTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: this.$facilityUtilService.getEquipmentType(this.$nzI18n), label: 'label', value: 'code'
          }
        },
        { // 详细地址
          title: this.language.address,
          key: 'address',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 状态
          title: this.language.status, key: 'equipmentStatus',
          width: 200,
          type: 'render',
          renderTemplate: this.equipmentStatusTemp,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.$facilityUtilService.getEquipmentStatus(this.$nzI18n), label: 'label', value: 'code'
          }
        },
        {
          title: this.language.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 100,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      rightTopButtons: [],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 筛选
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      // 点击选择事件
      handleSelect: (event, currentItem) => {
        this.selectListData = event;
        console.log(this.selectListData);
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
