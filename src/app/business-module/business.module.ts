import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BusinessComponent} from './business.component';
import {SharedModule} from '../shared-module/shared-module.module';
import {RouterModule} from '@angular/router';
import {ROUTER_CONFIG} from './business.routes';
import {IndexMissionService} from '../core-module/mission/index.mission.service';
import {MenuModule} from './menu/menu.module';
import {BusinessWebsocketMsgService} from './business-websocket-msg.service';
import {FacilityMissionService} from '../core-module/mission/facility.mission.service';
@NgModule({
  declarations: [BusinessComponent],
  imports: [
    CommonModule,
    SharedModule,
    MenuModule,
    RouterModule.forChild(ROUTER_CONFIG)
  ],
  providers: [IndexMissionService, BusinessWebsocketMsgService, FacilityMissionService]
})
export class BusinessModule { }
