import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ROUTER_CONFIG} from './application.routes';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared-module/shared-module.module';
import {LightingComponent} from './lighting/lighting.component';
import {ReleaseComponent} from './release/release.component';
import {SecurityComponent} from './security/security.component';
import {ApplicationComponent} from './application.component';
import {WorkbenchComponent} from './lighting/workbench/workbench.component';
import {EquipmentListComponent} from './lighting/equipment-list/equipment-list.component';
import {PolicyControlComponent} from './lighting/policy-control/policy-control.component';
import {EquipmentComponent} from './lighting/equipment-list/equipment/equipment.component';
import {GroupComponent} from './lighting/equipment-list/group/group.component';
import {LoopComponent} from './lighting/equipment-list/loop/loop.component';
import {ReleaseEquipmentListComponent} from './release/equipment-list/release-equipment-list.component';
import {ReleaseWorkbenchComponent} from './release/workbench/release-workbench.component';
import {ReleasePolicyControlComponent} from './release/policy-control/release-policy-control.component';
import {SecurityEquipmentListComponent} from './security/equipment-list/security-equipment-list.component';
import {SecurityWorkbenchComponent} from './security/workbench/security-workbench.component';
import {SecurityPolicyControlComponent} from './security/policy-control/security-policy-control.component';
import {ReportComponent} from './lighting/report-analysis/report.component';
import {ContentListComponent} from './release/content-list/content-list.component';
import {ContentExamineComponent} from './release/content-examine/content-examine.component';
import {ContentExamineDetailsComponent} from './release/content-examine/details/content-examine-details.component';
import {ReplayTheaterComponent} from './security/replay-theater/replay-theater.component';
import {LightingAddComponent} from './lighting/policy-control/add/lighting-add.component';
import {LightingDetailsComponent} from './lighting/policy-control/details/lighting-details.component';
import {ReleaseAddComponent} from './release/policy-control/add/release-add.component';
import {ReleaseDetailsComponent} from './release/policy-control/details/release-details.component';
import {SecurityAddComponent} from './security/policy-control/add/security-add.component';
import {SecurityDetailsComponent} from './security/policy-control/details/security-details.component';
import {ReplayDetailsComponent} from './security/replay-theater/details/replay-details.component';
import {PolicyAddDetailsComponent} from './lighting/policy-control/policy-add-details/policy-add-details.component';
import {ApplicationChartsComponent} from './components/echarts/application-charts.component';
import {PassagewayComponent} from './components/passageway/passageway.component';
import {BasicsModelComponent} from './components/basics/basics-model.component';
import {EquipmentModelComponent} from './components/equipment-model/equipment-model.component';
import {XcStepsComponent} from './components/xc-steps/xc-steps.component';
import {BasicInformationComponent} from './components/basic-information/basic-information.component';
import {StrategyDetailsComponent} from './lighting/policy-control/strategy-details/strategy-details.component';
import {ReleaseStrategyComponent} from './release/policy-control/release-strategy/release-strategy.component';
import {SecurityStrategyComponent} from './security/policy-control/security-strategy/security-strategy.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {ContentListAddComponent} from './release/content-list/add/content-list-add.component';
import {ChannelConfigurationComponent} from './components/channelConfiguration/channelConfiguration.component';
import {CameraDetailsComponent} from './components/camera-details/camera-details.component';
import {StepsDetailsComponent} from './components/steps-details/steps-details.component';
import {ApplicationService} from './server';
import {SplitScreenComponent} from './components/split-screen/split-screen.component';
import {StrategyManagementComponent} from './strategy-management/strategy-list/strategy-management.component';
import {StrategyManagementAddComponent} from './strategy-management/strategy-list/add/strategy-management-add.component';
import {StrategyManagementDetailsComponent} from './strategy-management/strategy-list/details/strategy-management-details.component';
import {StrategyComponent} from './strategy-management/strategy.component';
import {StrategyManageDetailsComponent} from './strategy-management/strategy-list/strategy-details/strategy-manage-details.component';
import {FinishDetailsComponent} from './strategy-management/strategy-list/finish-details/finish-details.component';
import {PassagewayInformationComponent} from './security/workbench/passageway-information/passageway-information.component';
import {CameraSettingsComponent} from './components/camera-settings/camera-settings.component';

@NgModule({
  declarations: [
    ApplicationComponent,
    StrategyComponent,
    FinishDetailsComponent,
    StrategyManageDetailsComponent,
    StrategyManagementAddComponent,
    StrategyManagementDetailsComponent,
    StrategyManagementComponent,
    SecurityStrategyComponent,
    SplitScreenComponent,
    CameraDetailsComponent,
    ReleaseStrategyComponent,
    StepsDetailsComponent,
    BasicInformationComponent,
    StrategyDetailsComponent,
    LightingComponent,
    ReleaseComponent,
    SecurityComponent,
    WorkbenchComponent,
    EquipmentListComponent,
    PolicyControlComponent,
    EquipmentComponent,
    GroupComponent,
    LoopComponent,
    ReleaseEquipmentListComponent,
    ReleaseWorkbenchComponent,
    ReleasePolicyControlComponent,
    SecurityWorkbenchComponent,
    SecurityEquipmentListComponent,
    SecurityPolicyControlComponent,
    ReportComponent,
    ContentListComponent,
    ContentExamineComponent,
    ContentExamineDetailsComponent,
    ReplayTheaterComponent,
    LightingAddComponent,
    LightingDetailsComponent,
    ReleaseAddComponent,
    ReleaseDetailsComponent,
    SecurityAddComponent,
    SecurityDetailsComponent,
    ReplayDetailsComponent,
    PolicyAddDetailsComponent,
    ApplicationChartsComponent,
    PassagewayComponent,
    BasicsModelComponent,
    EquipmentModelComponent,
    XcStepsComponent,
    BasicInformationComponent,
    ContentListAddComponent,
    ChannelConfigurationComponent,
    PassagewayInformationComponent,
    CameraSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxEchartsModule,
    RouterModule.forChild(ROUTER_CONFIG)
  ],
  providers: [ApplicationService]
})
export class ApplicationModule {
}
