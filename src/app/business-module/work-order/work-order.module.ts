import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared-module/shared-module.module';
import {RouterModule} from '@angular/router';
import {ROUTER_CONFIG} from './work-order.routes';
import {WorkOrderComponent} from './work-order.component';
import {InspectionWorkOrderComponent} from './inspection/inspection-work-order.component';
import {InspectionTaskComponent} from './inspection/task/inspection-task.component';
import {InspectionWorkOrderDetailComponent} from './inspection/detail/inspection-work-order-detail.component';
import {UnfinishedInspectionWorkOrderComponent} from './inspection/unfinished/unfinished-inspection-work-order.component';
import {FinishedInspectionWorkOrderComponent} from './inspection/finished/finished-inspection-work-order.component';
import {InspectionTaskDetailComponent} from './inspection/task-detail/inspection-task-detail.component';
import {FacilityUtilService} from '../facility';
import {SetAreaDeviceComponent} from './inspection/set-area-device/set-area-device.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {ClearBarrierWorkOrderComponent} from './clear-barrier/clear-barrier-work-order.component';
import {UnfinishedClearBarrierWorkOrderComponent} from './clear-barrier/unfinished/unfinished-clear-barrier-work-order.component';
import {HistoryClearBarrierWorkOrderComponent} from './clear-barrier/history/history-clear-barrier-work-order.component';
import {ClearBarrierWorkOrderDetailComponent} from './clear-barrier/detail/clear-barrier-work-order-detail.component';
import {UnfinishedClearBarrierWorkOrderTableComponent} from './clear-barrier/unfinished/table';
import {HistoryClearBarrierWorkOrderTableComponent} from './clear-barrier/history/table';
import {RefAlarmComponent} from './clear-barrier/ref-alarm/ref-alarm.component';
import { InspectionTemplateComponent } from './templates/inspection-template/inspection-template.component';
import { InspectionTemplateDetailComponent } from './templates/template-detail/inspection-template-detail.component';
import { UnfinishedDetailClearBarrierWorkOrderComponent } from './clear-barrier/unfinished-detail/unfinished-detail-clear-barrier-work-order.component';
import { UnfinishedDetailInspectionWorkOrderComponent } from './inspection/unfinished-detail/unfinished-detail-inspection-work-order.component';
import { SelectInspectionTemplateComponent } from './inspection/select-inspection-template/select-inspection-template.component';
import { TemplatesComponent } from './templates/templates.component';
import {NgxIntlTelInputModule} from 'ngx-intl-tel-input';


@NgModule({
  declarations: [
    WorkOrderComponent,
    ClearBarrierWorkOrderComponent,
    UnfinishedClearBarrierWorkOrderComponent,
    HistoryClearBarrierWorkOrderComponent,
    ClearBarrierWorkOrderDetailComponent,
    InspectionWorkOrderComponent,
    InspectionTaskComponent,
    InspectionWorkOrderDetailComponent,
    UnfinishedInspectionWorkOrderComponent,
    FinishedInspectionWorkOrderComponent,
    InspectionTaskDetailComponent,
    SetAreaDeviceComponent,
    UnfinishedClearBarrierWorkOrderTableComponent,
    HistoryClearBarrierWorkOrderTableComponent,
    RefAlarmComponent,
    InspectionTemplateComponent,
    InspectionTemplateDetailComponent,
    UnfinishedDetailClearBarrierWorkOrderComponent,
    UnfinishedDetailInspectionWorkOrderComponent,
    SelectInspectionTemplateComponent,
    TemplatesComponent,
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTER_CONFIG),
        SharedModule,
        NgxEchartsModule,
        NgxIntlTelInputModule
    ],
  exports: [
    RefAlarmComponent
  ],
  providers: [
    FacilityUtilService
  ]
})
export class WorkOrderModule {
}
