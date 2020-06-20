import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ROUTER_CONFIG } from './trouble.routes';
import { TroubleComponent } from './trouble.component';
import {SharedModule} from '../../shared-module/shared-module.module';
import { TroubleListComponent } from '../trouble/trouble-manage/trouble-list/trouble-list.component';
import {FacilityUtilService} from '../facility/share/service/facility-util.service';
import { TroubleDetailComponent } from './trouble-manage/trouble-list/trouble-detail/trouble-detail.component';
import { TroubleAddComponent } from './trouble-manage/trouble-list/trouble-add/trouble-add.component';
import { TroubleEquipmentComponent } from './trouble-manage/trouble-list/trouble-equipment/trouble-equipment.component';
import { FaultDetailsComponent } from './trouble-manage/trouble-list/trouble-detail/fault-details/fault-details.component';
import { FaultOperationComponent } from './trouble-manage/trouble-list/trouble-detail/fault-operation/fault-operation.component';
import { FaultExperienceComponent } from './trouble-manage/trouble-list/trouble-detail/fault-experience/fault-experience.component';
import {NgxEchartsModule} from 'ngx-echarts';
// tslint:disable-next-line:max-line-length
import { ResourceAllocationComponent } from './trouble-manage/trouble-list/trouble-detail/resource-allocation/resource-allocation.component';
// tslint:disable-next-line:max-line-length
import { HistoryProcessRecordTableComponent } from './trouble-manage/trouble-list/trouble-detail/history-process-record-table/history-process-record-table.component';
import { TroubleImgViewComponent } from './trouble-manage/trouble-list/trouble-detail/trouble-img-view/trouble-img-view.component';
import { TroubleStatisticalComponent } from './trouble-manage/trouble-statistical/trouble-statistical.component';
import { EchartGroupComponent } from './trouble-manage/echart-group/echart-group.component';
import { TroubleAssignComponent } from './trouble-manage/trouble-list/trouble-assign/trouble-assign.component';
import { TroubleFlowComponent } from './trouble-manage/trouble-list/trouble-flow/trouble-flow.component';
import { TroubleFacilityComponent } from './trouble-manage/trouble-list/trouble-facility/trouble-facility.component';
@NgModule({
  declarations: [
    TroubleComponent,
    TroubleListComponent,
    TroubleDetailComponent,
    TroubleAddComponent,
    TroubleEquipmentComponent,
    FaultDetailsComponent,
    FaultOperationComponent,
    FaultExperienceComponent,
    ResourceAllocationComponent,
    HistoryProcessRecordTableComponent,
    TroubleImgViewComponent,
    TroubleStatisticalComponent,
    EchartGroupComponent,
    TroubleAssignComponent,
    TroubleFlowComponent,
    TroubleFacilityComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTER_CONFIG),
    NgxEchartsModule
  ],
  providers: [FacilityUtilService]
})
export class TroubleModule { }
