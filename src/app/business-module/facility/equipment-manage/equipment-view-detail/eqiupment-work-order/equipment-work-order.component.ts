import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ImageViewService} from '../../../../../shared-module/service/picture-view/image-view.service';
import {FacilityUtilService} from '../../..';
import {EquipmentApiService} from '../../../share/service/equipment/equipment-api.service';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {QueryCondition} from '../../../../../shared-module/entity/queryCondition';
import {WorkOrderLanguageInterface} from '../../../../../../assets/i18n/work-order/work-order.language.interface';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {WorkOrderInfoModel} from '../../../share/model/work-order-info.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';

/**
 * 设备工单组件
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-work-order',
  templateUrl: './equipment-work-order.component.html',
  styleUrls: ['./equipment-work-order.component.scss']
})
export class EquipmentWorkOrderComponent implements OnInit, OnDestroy {

  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $router: Router,
    private $imageViewService: ImageViewService,
    private $equipmentApiService: EquipmentApiService,
    private $facilityUtilService: FacilityUtilService
  ) {
  }

  @Input()
  public equipmentId: string;
  // 工单状态模版实例
  @ViewChild('statusTemp') statusTemp: TemplateRef<HTMLDocument>;
  // 巡检工单列表数据集
  public dataSet = [];
  // 消障工单
  public clearBarrierDataSet = [];
  // 分页参数 卡片数据只显示5条数据
  public pageBean: PageBean = new PageBean(5);
  // 巡检工单列表参数
  public tableConfig: TableConfig;
  // 消障工单列表参数
  public clearBarrierTableConfig: TableConfig;
  // 设备国际化
  public language: FacilityLanguageInterface;
  // 工单国际化
  public workOrderLanguage: WorkOrderLanguageInterface;
  //  公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 查询条件
  private queryCondition: QueryCondition = new QueryCondition();
  // 消障工单查询条件
  private queryClearCondition: QueryCondition = new QueryCondition();
  // 工单类型默认巡检
  private workOrderType = 'inspection';


  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.workOrderLanguage = this.$nzI18n.getLocaleData('workOrder');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    // 设置每页查询5条数据
    this.queryCondition.pageCondition.pageSize = 5;
    this.queryCondition.pageCondition.pageNum = 1;
    // 初始化表格
    this.initTableConfig();
    // 查询巡检工单
    this.refreshInspectionData();
  }

  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    this.statusTemp = null;
  }

  /**
   *  点击巡检工单tab 事件
   */
  public onClickInspection(): void {
    this.workOrderType = 'inspection';
    this.refreshInspectionData();
  }

  /**
   *  点击巡检工单tab 事件
   */
  public onClickClearBarrier(): void {
    this.workOrderType = 'clear';
    this.refreshClearBarrier();
  }

  /**
   *  显示更多工单
   */
  public onClickShowMoreWorkOrder(): void {
    const queryParams = {queryParams: {equipmentId: this.equipmentId}};
    if (this.workOrderType === 'inspection') {
      this.$router.navigate(
        ['business/work-order/inspection/unfinished-list'], queryParams).then();
    } else {
      this.$router.navigate(
        ['business/work-order/clear-barrier/unfinished-list'], queryParams).then();
    }
  }

  /**
   *  查询巡检工单列表数据
   */
  private refreshInspectionData(): void {
    // 工单测试数据  todo
    const tempBody = {
      filterValue: this.equipmentId,
      filterField: 'procRelatedEquipment.equipmentId',
      operator: OperatorEnum.eq
    };
    // 如果条件集中不存在设备ID的过滤条件就添加进去
    const index = this.queryCondition.filterConditions.findIndex(
      item => item.filterField === 'procRelatedEquipment.equipmentId');
    if (index < 0) {
      this.queryCondition.filterConditions =
        this.queryCondition.filterConditions.concat([tempBody]);
    }
    this.tableConfig.isLoading = true;
    this.$equipmentApiService.queryInspectionList(this.queryCondition).subscribe(
      (result: ResultModel<WorkOrderInfoModel[]>) => {
        this.tableConfig.isLoading = false;
        this.dataSet = result.data || [];
        if (!_.isEmpty(this.dataSet)) {
          this.dataSet.forEach(item => {
            // 设置工单状态的图标样式
            item.statusClass = this.$facilityUtilService.getOrderStatusClass(item.status);
            // 设置工单的国际化
            item.statusName = this.$facilityUtilService.getStatusName(item.status);
          });
        }
        // 设置工单的状态国际化和显示样式
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

  /**
   * 查询消障工单列表
   */
  private refreshClearBarrier(): void {
    // 测试数据  todo
    const queryBody = [
      {
        filterValue: this.equipmentId,
        filterField: 'equipment.equipmentId',
        operator: OperatorEnum.eq
      }
    ];
    // 如果条件中不存在设备ID的过滤条件就添加进去
    const index = this.queryClearCondition.filterConditions.findIndex(
      item => item.filterField === 'equipment.equipmentId');
    if (index < 0) {
      this.queryClearCondition.filterConditions =
        this.queryClearCondition.filterConditions.concat(queryBody);
    }
    this.clearBarrierTableConfig.isLoading = true;
    this.$equipmentApiService.queryClearList(this.queryClearCondition).subscribe(
      (result: ResultModel<WorkOrderInfoModel[]>) => {
        this.pageBean.Total = result.totalCount;
        this.clearBarrierTableConfig.isLoading = false;
        this.clearBarrierDataSet = result.data || [];
        if (!_.isEmpty(this.clearBarrierDataSet)) {
          this.clearBarrierDataSet.forEach(item => {
            // 获取状态的国际化
            item.statusName = this.$facilityUtilService.getStatusName(item.status);
            // 获取状态的图标
            item.statusClass = this.$facilityUtilService.getOrderStatusClass(item.status);
          });
        }
      }, () => {
        this.clearBarrierTableConfig.isLoading = false;
      });
  }

  /**
   *   初始化表格参数
   */
  private initTableConfig(): void {
    // 工单公用字段
    const commonConfig = [
      //  序号
      {
        type: 'serial-number',
        width: 62,
        title: this.language.serialNumber,
        fixedStyle: {fixedLeft: true, style: {left: '0px'}}
      },
      { // 工单名称
        title: this.workOrderLanguage.name,
        key: 'title', width: 200,
        searchable: false
      },
      { // 　工单状态
        title: this.workOrderLanguage.status,
        key: 'statusName',
        width: 200,
        searchable: false,
        type: 'render',
        renderTemplate: this.statusTemp,
      },
      { // 责任单位
        title: this.workOrderLanguage.accountabilityUnitName,
        key: 'accountabilityDeptName',
        width: 200,
        searchable: false,
      },
      { // 责任人
        title: this.workOrderLanguage.assignName,
        key: 'assignName',
        width: 150,
        searchable: false,
      },
      { // 期望完成时间
        title: this.workOrderLanguage.expectedCompleteTime,
        key: 'expectedCompletedTime',
        width: 200,
        pipe: 'date',
        searchable: false,
      },
      { // 剩余天数
        title: this.workOrderLanguage.lastDays,
        key: 'lastDays',
        width: 200,
        searchable: false,
      }
    ];
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '1000px', y: '400px'},
      topButtons: [],
      noIndex: true,
      columnConfig: commonConfig,
      showPagination: false,
      bordered: false,
      showSearch: false,
      operation: []
    };
    const tempColumn = [{ //  关联故障
      title: this.language.associatedFault, key: 'title', width: 120,
      searchable: false
    },
      { // 操作
        title: this.commonLanguage.operate, searchable: false,
        searchConfig: {
          type: 'operate'
        },
        key: '',
        width: 150,
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      }];
    this.clearBarrierTableConfig = {
      isDraggable: true,
      isLoading: true,
      scroll: {x: '1000px', y: '400px'},
      topButtons: [],
      noIndex: true,
      columnConfig: _.concat(commonConfig, tempColumn),
      showPagination: false,
      bordered: false,
      showSearch: false,
      operation: [
        { // 查看工单
          text: this.language.viewWorkOrder,
          className: 'fiLink-work-order',
          handle: (data) => {
            const id = data.procId;
            this.$router.navigate([`business/work-order/clear-barrier/unfinished-list`],
              {queryParams: {id}}).then();
          }
        },
        { // 查看告警
          text: this.language.viewAlarm,
          className: 'fiLink-alarm-facility',
          handle: (data) => {
            const id = data.refAlarm;
            // 关联告警为当前告警
            this.$router.navigate([`business/alarm/current-alarm`],
              {queryParams: {id}}).then();
          }
        },
        { // 查看图片
          text: this.language.viewPhoto,
          className: 'fiLink-view-photo',
          handle: (data) => {
            this.$imageViewService.showPictureView(data.devicePicRespList);
          }
        },
      ]
    };
  }

}
