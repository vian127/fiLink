import {Component, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {MapControl} from '../../util/map-control';
import {IndexWorkOrderService} from '../../../../core-module/api-service/index/index-work-order';
import {
  WorkOrderConditionModel, WorkOrderStateModel, WorkOrderStateResultModel,
  WorkOrderTypeModel
} from '../../shared/model/work-order-condition.model';
import {ResultModel} from '../../../../core-module/model/result.model';
import {FacilityEquipmentConfig} from '../../index-component/facility-equipment-type/config';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {IndexWorkOrderTypeEnum} from '../../shared/const/index-enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';

/**
 * 工单类表
 */
@Component({
  selector: 'app-facilities-work-order-list',
  templateUrl: './facilities-work-order-list.component.html',
  styleUrls: ['./facilities-work-order-list.component.scss']
})
export class FacilitiesWorkOrderListComponent extends MapControl implements OnInit {
  // 默认选中的工单类型
  public orderTypeRadioValue = IndexWorkOrderTypeEnum.inspection;
  // 工单类型查询模型
  public workOrderTypeModel: WorkOrderConditionModel = new WorkOrderConditionModel();
  // 工单状态查询模型
  public workOrderStateModel: WorkOrderConditionModel = new WorkOrderConditionModel();
  // 选中的工单状态
  public orderStateCheckValue: string[];
  // 工单类型列表
  public workOrderTypeList: WorkOrderTypeModel[] = [];
  // 工单状态列表
  public workOrderStateList: WorkOrderStateModel[] = [];
  // 可选择的表格下拉框
  public selectOption: string[];
  // 区域组件显示
  public isShowNoData = true;
  // 工单名称
  public titleName: string;
  // 区域数据
  public areaData: string[];
  // 显示的表格
  public isShowTable: boolean;
  // 工单类型组件配置
  public orderTypeComponent: FacilityEquipmentConfig;
  // 工单状态组件配置
  public orderStateComponent: FacilityEquipmentConfig;

  public constructor(
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $indexWorkOlder: IndexWorkOrderService,
  ) {
    super($nzI18n);
  }

  public ngOnInit(): void {
    // 表格默认巡检工单
    this.titleName = this.indexLanguage.inspectionWorkOrderTitle;
    // 加载工单类型组件配置
    this.orderTypeComponentConfig();
    // 加载工单状态组件配置
    this.orderStateComponentConfig();
  }


  /**
   * 区域选择结果
   */
  public areaDataChange(evt: string[]): void {
    this.areaData = evt;
    // 加载工单类型
    this.queryWorkOrderTypeAndOrderNum();
    // 加载工单状态
    this.queryWorkOrderStateAndOrderNum();
  }

  /**
   * 工单类型选中的结果
   */
  public workOrderTypeChange(evt: IndexWorkOrderTypeEnum): void {
    // 选择巡检工单
    if (evt === IndexWorkOrderTypeEnum.inspection) {
      this.isShowTable = false;
      this.titleName = this.indexLanguage.inspectionWorkOrderTitle;
    }
    // 选择销障工单
    if (evt === IndexWorkOrderTypeEnum.clear_failure) {
      this.isShowTable = true;
      this.titleName = this.indexLanguage.clearBarrierWorkOrderTitle;
    }
    // 改变工单类型
    this.orderTypeRadioValue = evt;
    // 改变工单状态
    this.queryWorkOrderStateAndOrderNum();
  }

  /**
   * 工单状态选中的结果
   */
  public workOrderStatusChange(evt: string[]): void {
    // 选中的工单状态
    this.orderStateCheckValue = evt;
    // 表格下拉框可选项
    this.selectOption = evt;
  }

  /**
   * 首页查询工单类型统计
   */
  public queryWorkOrderTypeAndOrderNum(): void {
    // 查询模型赋值
    this.workOrderTypeModel.areaIdList = this.areaData;
    // 调用查询接口
    this.$indexWorkOlder.queryProcCountOverviewForHome(this.workOrderTypeModel).subscribe((result: ResultModel<WorkOrderTypeModel[]>) => {
      // 返回成功
      if (result.code === ResultCodeEnum.success) {
        // 过滤巡检和销障
        this.workOrderTypeList = [];
        result.data.forEach(i => {
          if (i.procType === IndexWorkOrderTypeEnum.inspection || i.procType === IndexWorkOrderTypeEnum.clear_failure) {
            this.workOrderTypeList.push({procType: i.procType, count: i.count});
          }
        });
      } else {
        // 返回失败
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 首页查询工单状态统计
   */
  public queryWorkOrderStateAndOrderNum(): void {
    // 查询模型赋值
    this.workOrderStateModel.deviceAreaIdList = this.areaData;
    this.workOrderStateModel.procType = this.orderTypeRadioValue;
    // 获取接口数据
    this.$indexWorkOlder.queryListOverviewGroupByProcStatusForHome(this.workOrderStateModel)
      .subscribe((result: ResultModel<WorkOrderStateResultModel[]>) => {
        // 返回成功
        if (result.code === ResultCodeEnum.success) {
          this.workOrderStateList = [];
          // 遍历改造数据
          result.data.forEach(i => {
            this.workOrderStateList.push({procType: i.status, statusName: i.statusName, count: i.count});
          });
        } else {
          // 返回失败
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 工单类型组件配置
   */
  public orderTypeComponentConfig(): void {
    this.orderTypeComponent = {
      // 是否显示设施类型
      showFacilitiesComponent: false,
      // 是否显示设施设备类型
      showEquipmentComponent: false,
      // 是否显示工单状态类型
      showWorkOrderStatusComponent: false,
      // 是否显示工单类型类型
      showWorkOrderTypeComponent: true,
      // 工单类型title
      workOrderTypeTitleName: this.indexLanguage.workOrderType
    };
  }

  /**
   * 工单状态组件配置
   */
  public orderStateComponentConfig(): void {
    this.orderStateComponent = {
      // 是否显示设施类型
      showFacilitiesComponent: false,
      // 是否显示设施设备类型
      showEquipmentComponent: false,
      // 是否显示工单状态类型
      showWorkOrderStatusComponent: true,
      // 是否显示工单类型类型
      showWorkOrderTypeComponent: false,
      // 工单状态title
      workOrderStatusTitleName: this.indexLanguage.workOrderStatus
    };
  }
}
