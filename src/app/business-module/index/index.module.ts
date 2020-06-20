import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './index.component';
import {SharedModule} from '../../shared-module/shared-module.module';
import {RouterModule} from '@angular/router';
import {ROUTER_CONFIG} from './index.routes';
import {FacilityListComponent} from './index-component/index-facility-list/facility-list.component';
import {FibreListComponent} from './index-component/index-fibre-list/fibre-list.component';
import {DeviceNodeComponent} from './index-component/index-device-node/device-node.component';
import {LogicAreaComponent} from './index-component/logic-area/logic-area.component';
import {FacilityDetailPanelComponent} from './index-component/facility-detail-panel/facility-detail-panel.component';
import {FacilityAlarmPanelComponent} from './index-component/facility-alarm-panel/facility-alarm-panel.component';
import {LogOrderPanelComponent} from './index-component/log-order-panel/log-order-panel.component';
import {ClustererFacilityListComponent} from './index-component/clusterer-facility-list/clusterer-facility-list.component';
import {MapIndexComponent} from './map/map.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {FacilityTypeComponent} from './index-component/facility-type/facility-type.component';
import {FacilityStatusComponent} from './index-component/facility-status/facility-status.component';
import {MyCollectionComponent} from './index-component/my-collection/my-collection.component';
import {FacilityLogTableComponent} from './index-component/log-order-panel/facility-log-table/facility-log-table.component';
import {ClearBarrierTableComponent} from './index-component/log-order-panel/clear-barrier-table/clear-barrier-table.component';
import {InspectionTableComponent} from './index-component/log-order-panel/inspection-table/inspection-table.component';
import {CurrentAlarmTableComponent} from './index-component/facility-alarm-panel/current-alarm-table/current-alarm-table.component';
import {HistoryAlarmTableComponent} from './index-component/facility-alarm-panel/history-alarm-table/history-alarm-table.component';
import {IndexStatisticsComponent} from './index-component/index-statistics/index-statistics.component';
import {OperationRecordComponent} from './index-component/log-order-panel/operation-record/operation-record.component';
import {FacilityEquipmentTypeComponent} from './index-component/facility-equipment-type/facility-equipment-type.component';
import {IndexBatchOperationComponent} from './index-component/index-batch-operation/index-batch-operation.component';
import {IndexFacilityGroupComponent} from './index-component/index-facility-group/index-facility-group.component';
import {IndexFacilityOrderListComponent} from './index-component/index-facility-order-list/index-facility-order-list.component';
import {IndexFacilityOrderStateComponent} from './index-component/index-facility-order-state/index-facility-order-state.component';
import {MyCollectionListComponent} from './index-component/my-collection-list/my-collection-list.component';
import {IndexStatisticalChartComponent} from './index-statistical-chart/index-statistical-chart.component';
import {IndexMapOperationtComponent} from './index-map-operationt/index-map-operationt.component';
import {IndexOperationalDataComponent} from './index-operational-data/index-operational-data.component';
import {FacilitiesWorkOrderListComponent} from './index-operational-data/facilities-work-order-list/facilities-work-order-list.component';
import {MyAttentionComponent} from './index-operational-data/my-attention/my-attention.component';
import {FacilitiesListComponent} from './index-operational-data/facilities-list/facilities-list.component';
import {FacilityEquipmentListComponent} from './index-component/facility-equipment-list/facility-equipment-list.component';
import {FacilityParticularsCardComponent} from './index-particulars-card/facility-particulars-card/facility-particulars-card.component';
import {IndexParticularsCardComponent} from './index-particulars-card/index-particulars-card.component';
import {FacilityShowComponent} from './index-map-operationt/facility-show/facility-show.component';
import {IndexWorkOrderService} from '../../core-module/api-service/index/index-work-order';
import {ChooseAreaComponent} from './index-component/choose-area/choose-area.component';
import {IndexLeaseeGroupComponent} from './index-component/index-leasee-group/index-leasee-group.component';
import {SelectGroupingComponent} from './index-map-operationt/select-grouping/select-grouping.component';
import {IndexApiService} from './service/index/index-api.service';
import {IndexFacilityService} from '../../core-module/api-service/index/facility';
import {IndexOrderTableComponent} from './index-component/index-order-table/index-order-table.component';
import {MapCoverageService} from './service/map-coverage.service';

@NgModule({
  declarations: [
    IndexComponent,
    FacilityListComponent,
    FibreListComponent,
    DeviceNodeComponent,
    LogicAreaComponent,
    FacilityDetailPanelComponent,
    FacilityAlarmPanelComponent,
    LogOrderPanelComponent,
    ClustererFacilityListComponent,
    MapIndexComponent,
    FacilityTypeComponent,
    FacilityStatusComponent,
    MyCollectionComponent,
    FacilityLogTableComponent,
    ClearBarrierTableComponent,
    InspectionTableComponent,
    CurrentAlarmTableComponent,
    HistoryAlarmTableComponent,
    IndexStatisticsComponent,
    OperationRecordComponent,
    FacilityEquipmentTypeComponent,
    IndexBatchOperationComponent,
    IndexFacilityGroupComponent,
    IndexFacilityOrderListComponent,
    IndexFacilityOrderStateComponent,
    MyCollectionListComponent,
    IndexStatisticalChartComponent,
    IndexMapOperationtComponent,
    IndexOperationalDataComponent,
    FacilitiesWorkOrderListComponent,
    MyAttentionComponent,
    FacilitiesListComponent,
    FacilityEquipmentListComponent,
    FacilityParticularsCardComponent,
    IndexParticularsCardComponent,
    FacilityShowComponent,
    ChooseAreaComponent,
    SelectGroupingComponent,
    IndexLeaseeGroupComponent,
    IndexOrderTableComponent
  ],
  providers: [
    MapCoverageService,
    IndexWorkOrderService,
    IndexApiService,
    IndexFacilityService
    // ShakeProtectionService
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxEchartsModule,
    RouterModule.forChild(ROUTER_CONFIG)
  ],
  exports: [
    ClearBarrierTableComponent,
    InspectionTableComponent,
    FacilityLogTableComponent,
    // CurrentAlarmTableComponent,
    // HistoryAlarmTableComponent
  ]
})
export class IndexModule {
}
