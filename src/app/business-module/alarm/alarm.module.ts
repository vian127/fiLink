import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlarmComponent } from './alarm.component';
import { SharedModule } from '../../shared-module/shared-module.module';
import { RouterModule } from '@angular/router';
import { ROUTER_CONFIG } from './alarm.routes';
// import { AlarmManageComponent } from './alarm-manage/alarm-manage.component';
import { CurrentAlarmComponent } from './alarm-manage/current-alarm/current-alarm.component';
import { HistoryAlarmComponent } from './alarm-manage/history-alarm/history-alarm.component';
import { AlarmSetComponent } from './alarm-manage/alarm-set/alarm-set.component';
import { CurrentAlarmSetComponent } from './alarm-manage/alarm-set/current-alarm-set/current-alarm-set.component';
import { HistoryAlarmSetComponent } from './alarm-manage/alarm-set/history-alarm-set/history-alarm-set.component';
import { AlarmLevelSetComponent } from './alarm-manage/alarm-set/current-alarm-set/alarm-level-set/alarm-level-set.component';
import {AlarmManageComponent} from './alarm-manage/alarm-manage.component';
import { AlarmFiltrationComponent } from './alarm-manage/alarm-set/alarm-filtration/alarm-filtration.component';
import { AlarmFiltrationAddComponent } from './alarm-manage/alarm-set/alarm-filtration/alarm-filtration-add/alarm-filtration-add.component';
import { AlarmRemoteNotificationComponent } from './alarm-manage/alarm-set/alarm-remote-notification/alarm-remote-notification.component';
import { AlarmWorkOrderComponent } from './alarm-manage/alarm-set/alarm-work-order/alarm-work-order.component';
import { RemoteAddComponent } from './alarm-manage/alarm-set/alarm-remote-notification/remote-add/remote-add.component';
import { WorkOrderAddComponent } from './alarm-manage/alarm-set/alarm-work-order/work-order-add/work-order-add.component';
import {FacilityUtilService} from '../facility/share/service/facility-util.service';
import { CurrentAlarmAddComponent } from './alarm-manage/current-alarm/current-alarm-add/current-alarm-add.component';
import { TemplateTableComponent } from './alarm-manage/current-alarm/template-table/template-table.component';
// tslint:disable-next-line:max-line-length
import { AlarmFiltrationRuleComponent } from './alarm-manage/alarm-set/alarm-filtration/alarm-filtration-rule/alarm-filtration-rule.component';
import { DiagnoseDetailsComponent } from './alarm-manage/current-alarm/diagnose-details/diagnose-details.component';
import {NgxEchartsModule} from 'ngx-echarts';
import { AlarmAnalysisComponent } from './alarm-manage/current-alarm/diagnose-details/alarm-analysis/alarm-analysis.component';
import { AlarmOperationComponent } from './alarm-manage/current-alarm/diagnose-details/alarm-operation/alarm-operation.component';
import { CorrelationAlarmComponent } from './alarm-manage/current-alarm/diagnose-details/correlation-alarm/correlation-alarm.component';
import { AlarmImgViewComponent } from './alarm-manage/current-alarm/diagnose-details/alarm-img-view/alarm-img-view.component';
// tslint:disable-next-line:max-line-length
import { OrdersCancelAccountComponent } from './alarm-manage/current-alarm/diagnose-details/orders-cancel-account/orders-cancel-account.component';
import { RedeployInfoComponent } from './alarm-manage/current-alarm/diagnose-details/redeploy-info/redeploy-info.component';
import {WorkOrderModule} from '../work-order/work-order.module';
@NgModule({
  declarations: [AlarmComponent, CurrentAlarmComponent, HistoryAlarmComponent,
    AlarmManageComponent,
    AlarmSetComponent, CurrentAlarmSetComponent,
    HistoryAlarmSetComponent, AlarmLevelSetComponent,
    AlarmFiltrationComponent, AlarmFiltrationAddComponent,
    AlarmRemoteNotificationComponent, AlarmWorkOrderComponent, RemoteAddComponent, WorkOrderAddComponent,
    CurrentAlarmAddComponent, TemplateTableComponent, AlarmFiltrationRuleComponent, DiagnoseDetailsComponent,
    AlarmAnalysisComponent, AlarmOperationComponent, CorrelationAlarmComponent, AlarmImgViewComponent,
    OrdersCancelAccountComponent, RedeployInfoComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTER_CONFIG),
    NgxEchartsModule,
    WorkOrderModule
  ],
  providers: [FacilityUtilService]
})
export class AlarmModule {
}
