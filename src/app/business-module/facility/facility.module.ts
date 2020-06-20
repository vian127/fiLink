import {NgModule} from '@angular/core';
import {FacilityComponent} from './facility.component';
import {ROUTER_CONFIG} from './facility.routes';
import {RouterModule} from '@angular/router';
import {AreaListComponent} from './area-manage/area-list/area-list.component';
import {AreaDetailComponent} from './area-manage/area-detail/area-detail.component';
import {SharedModule} from '../../shared-module/shared-module.module';
import {
  BasicOperationComponent,
  ConfigurationStrategyComponent,
  ControlListComponent,
  CoreEndComponent,
  CoreFusionComponent,
  FacilityAlarmComponent,
  FacilityBusinessInformationComponent,
  FacilityDetailComponent,
  FacilityImgViewComponent,
  FacilityListComponent,
  FacilityLogComponent,
  FacilityPortInfoComponent,
  FacilityViewDetailComponent,
  FacilityViewDetailLogComponent,
  InfrastructureDetailsComponent,
  IntelligentEntranceGuardComponent,
  IntelligentLabelDetailComponent,
  ViewCableComponent,
  ViewCableDetailComponent,
  ViewFacilityPictureComponent
} from './facility-manage';
import {PartsListComponent} from './parts-manage/parts-list/parts-list.component';
import {PartsDetailsComponent} from './parts-manage/parts-detail/parts-detail.component';
import {FacilityUtilService} from './share/service/facility-util.service';
import {NgxEchartsModule} from 'ngx-echarts';
import {SetAreaDeviceComponent} from './area-manage/set-area-device/set-area-device.component';
import {AreaManageComponent} from './area-manage/area-manage.component';
import {PhotoViewerComponent} from './facility-manage/photo-viewer/photo-viewer.component';
import {TimerSelectorComponent} from './facility-manage/photo-viewer/timer-selector/timer-selector.component';
import {PhotoViewFilterComponent} from './facility-manage/photo-viewer/photo-view-filter/photo-view-filter.component';
import {ImageListComponent} from './facility-manage/photo-viewer/image-list/image-list.component';
import {FacilityWorkOrderComponent} from './facility-manage/facility-view-detail/facility-work-order/facility-work-order.component';
import {IndexModule} from '../index/index.module';
import {GuardIconClassPipe} from './facility-manage/facility-view-detail/intelligent-entrance-guard/guard-icon-class.pipe';
import {AdjustMapComponent} from './facility-manage/facility-view-detail/view-cable/adjust/adjustMap.component';
import {FacilityMissionService} from '../../core-module/mission/facility.mission.service';
import {CoreEndViewComponent} from './facility-manage/facility-view-detail/core-end-view/core-end-view.component';
import {SmartLabelComponent} from './facility-manage/facility-view-detail/view-cable/table/smart-label.component';
import {MountEquipmentComponent} from './facility-manage/facility-view-detail/mount-equipment/mount-equipment.component';
import {LoopListComponent} from './loop-management/loop-list/loop-list.component';
import {LoopDetailComponent} from './loop-management/loop-detail/loop-detail.component';
import {LoopViewDetailComponent} from './loop-management/loop-view-detail/loop-view-detail.component';
import {LoopBasicDetailsComponent} from './loop-management/loop-view-detail/loop-basic-details/loop-basic-details.component';
import {LoopLinkDeviceComponent} from './loop-management/loop-view-detail/loop-link-device/loop-link-device.component';
import {LoopBasicOperationComponent} from './loop-management/loop-view-detail/loop-basic-operation/loop-basic-operation.component';
import {ControlObjectComponent} from './loop-management/loop-detail/control-object/control-object.component';
import {DistributionBoxTableComponent} from './loop-management/loop-detail/distribution-box-table/distribution-box-table.component';
import {LinkDeviceTableComponent} from './loop-management/loop-detail/link-device-table/link-device-table.component';
import {
  EquipmentAlarmComponent,
  AlarmTimerComponent,
  EquipmentBasicOperationComponent,
  EquipmentImgViewComponent,
  EquipmentInfrastructureComponent,
  EquipmentLogDetailComponent,
  EquipmentOperateLogComponent,
  EquipmentWorkOrderComponent,
  ReportStatusInformationComponent
} from './equipment-manage/equipment-view-detail';
import {EquipmentViewDetailComponent} from './equipment-manage/equipment-view-detail/equipment-view-detail.component';
import {EquipmentListComponent} from './equipment-manage/equipment-list/equipment-list.component';
import {EquipmentDetailComponent} from './equipment-manage/equipment-detail/equipment-detail.component';
import {EquipmentApiService} from './share/service/equipment/equipment-api.service';
import {MoveIntoLoopListComponent} from './loop-management/loop-view-detail/loop-link-device/table/move-into-loop-list/move-into-loop-list.component';
import {GroupListComponent} from './group-manage/group-list/group-list.component';
import {EquipmentListSelectorComponent} from './common-component/equipment-list-selector/equipment-list-selector.component';
import {FacilityListSelectorComponent} from './common-component/facility-list-selector/facility-list-selector.component';
import {GroupDetailComponent} from './group-manage/group-detail/group-detail.component';
import {GroupViewDetailComponent} from './group-manage/group-view-detail/group-view-detail.component';
import {TimerSelectorService} from './share/service/timer-selector.service';
import {UploadImgComponent} from './common-component/upload-img/upload-img.component';
import {EquipmentConfigComponent} from './equipment-manage/equipment-config/equipment-config.component';
import {GatewayConfigurationComponent} from './equipment-manage/equipment-config/gateway-configuration/gateway-configuration.component';
import {GroupApiService} from './share/service/group/group-api.service';
import {AreaLevelPipe} from './area-manage/area-list/area-level.pipe';
import {AreaStylePipe} from './area-manage/area-list/area-style.pipe';
import {EquipmentTypePipe} from './share/pipe/equipment-type.pipe';
import {EquipmentStatusPipe} from './share/pipe/equipment-status.pipe';
import {ThumbnailComponent} from './common-component/thumbnail/thumbnail.component';
import {DeviceTypeDirective} from './directive/device-type.directive';
import {DeviceStatusDirective} from './directive/device-status.directive';

@NgModule({
  declarations: [FacilityComponent, FacilityListComponent,
    AreaManageComponent,
    AreaListComponent, AreaDetailComponent, FacilityDetailComponent, FacilityViewDetailComponent, InfrastructureDetailsComponent,
    BasicOperationComponent, FacilityAlarmComponent, FacilityViewDetailLogComponent,
    FacilityImgViewComponent, IntelligentEntranceGuardComponent,
    ConfigurationStrategyComponent, FacilityLogComponent, SetAreaDeviceComponent, PartsListComponent, PartsDetailsComponent,
    PhotoViewerComponent, TimerSelectorComponent, PhotoViewFilterComponent, ImageListComponent, FacilityWorkOrderComponent,
    GuardIconClassPipe,
    CoreEndComponent,
    GuardIconClassPipe,
    ViewCableComponent,
    ViewCableDetailComponent,
    CoreFusionComponent,
    ViewFacilityPictureComponent,
    FacilityPortInfoComponent,
    AdjustMapComponent,
    IntelligentLabelDetailComponent,
    CoreEndViewComponent,
    SmartLabelComponent,
    FacilityBusinessInformationComponent,
    ControlListComponent,
    MountEquipmentComponent,
    LoopListComponent,
    LoopDetailComponent,
    LoopViewDetailComponent,
    LoopBasicOperationComponent,
    LoopBasicDetailsComponent,
    LoopLinkDeviceComponent,
    ControlObjectComponent,
    DistributionBoxTableComponent,
    LinkDeviceTableComponent,
    EquipmentAlarmComponent,
    AlarmTimerComponent,
    EquipmentBasicOperationComponent,
    EquipmentImgViewComponent,
    EquipmentInfrastructureComponent,
    EquipmentLogDetailComponent,
    EquipmentOperateLogComponent, EquipmentWorkOrderComponent,
    ReportStatusInformationComponent,
    EquipmentViewDetailComponent,
    EquipmentListComponent,
    EquipmentDetailComponent,
    MoveIntoLoopListComponent,
    GroupListComponent,
    EquipmentListSelectorComponent,
    FacilityListSelectorComponent,
    GroupDetailComponent,
    GroupViewDetailComponent,
    UploadImgComponent,
    GatewayConfigurationComponent,
    EquipmentConfigComponent,
    AreaLevelPipe,
    AreaStylePipe,
    EquipmentTypePipe,
    EquipmentStatusPipe,
    ThumbnailComponent,
    DeviceTypeDirective,
    DeviceStatusDirective
  ],
  imports: [
    SharedModule,
    NgxEchartsModule,
    IndexModule,
    RouterModule.forChild(ROUTER_CONFIG)
  ],
  providers: [FacilityUtilService, GroupApiService,
    TimerSelectorService, EquipmentApiService, FacilityMissionService]
})
export class FacilityModule {
}

