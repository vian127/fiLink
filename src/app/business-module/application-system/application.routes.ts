import {Routes} from '@angular/router';

import {ApplicationComponent} from './application.component';
import {LightingComponent} from './lighting/lighting.component';
import {ReleaseComponent} from './release/release.component';
import {SecurityComponent} from './security/security.component';
import {WorkbenchComponent} from './lighting/workbench/workbench.component';
import {EquipmentListComponent} from './lighting/equipment-list/equipment-list.component';
import {PolicyControlComponent} from './lighting/policy-control/policy-control.component';
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
import {ContentListAddComponent} from './release/content-list/add/content-list-add.component';
import {StrategyManagementComponent} from './strategy-management/strategy-list/strategy-management.component';
import {StrategyManagementAddComponent} from './strategy-management/strategy-list/add/strategy-management-add.component';
import {StrategyComponent} from './strategy-management/strategy.component';
import {StrategyManageDetailsComponent} from './strategy-management/strategy-list/strategy-details/strategy-manage-details.component';
import {PassagewayInformationComponent} from './security/workbench/passageway-information/passageway-information.component';

export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      {
        path: 'lighting',
        component: LightingComponent,
        data: {
          breadcrumb: [{label: 'application'}, {label: 'lighting'}]
        },
        children: [
          {
            path: 'workbench',
            component: WorkbenchComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'lighting'}, {label: 'workbench'}]
            },
          },
          {
            path: 'equipment-list',
            component: EquipmentListComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'lighting'}, {label: 'equipmentList'}]
            },
          },
          {
            path: 'policy-control',
            component: PolicyControlComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'lighting'}, {label: 'policyControl'}]
            }
          },
          {
            path: 'policy-control/:type',
            component: LightingAddComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'lighting'},
                {label: 'policyControl', url: '/business/application/lighting/policy-control'},
                {label: 'policyAdd'}
              ]
            },
          },
          {
            path: 'details/:id',
            component: LightingDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'lighting'},
                {label: 'policyControl', url: '/business/application/lighting/policy-control'},
                {label: 'policyDetails'}
              ]
            },
          },
          {
            path: 'report',
            component: ReportComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'lighting'}, {label: 'report'}]
            },
          }
        ]
      },
      {
        path: 'release',
        component: ReleaseComponent,
        data: {
          breadcrumb: [{label: 'application'}, {label: 'release'}]
        },
        children: [
          {
            path: 'workbench',
            component: ReleaseWorkbenchComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'release'}, {label: 'workbench'}]
            },
          },
          {
            path: 'policy-control/:type',
            component: ReleaseAddComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'release'},
                {label: 'policyControl', url: '/business/application/release/policy-control'},
                {label: 'policyAdd'}
              ]
            },
          },
          {
            path: 'details/:id',
            component: ReleaseDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'release'},
                {label: 'policyControl', url: '/business/application/release/policy-control'},
                {label: 'policyDetails'}
              ]
            },
          },
          {
            path: 'equipment-list',
            component: ReleaseEquipmentListComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'release'}, {label: 'equipmentList'}]
            },
          },
          {
            path: 'policy-control',
            component: ReleasePolicyControlComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'release'}, {label: 'policyControl'}]
            }
          },
          {
            path: 'content-list',
            component: ContentListComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'release'}, {label: 'contentList'}]
            },
          },
          {
            path: 'content-list/:type',
            component: ContentListAddComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'release'},
                {label: 'contentList', url: '/business/application/release/content-list'},
                {label: 'content'}
              ]
            },
          },
          {
            path: 'content-examine',
            component: ContentExamineComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'release'}, {label: 'contentExamine'}]
            },
          },
          {
            path: 'content-examine/details',
            component: ContentExamineDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'release'},
                {label: 'contentExamine', url: '/business/application/release/content-examine'},
                {label: 'contentDetails'}
              ]
            },
          }
        ]
      },
      {
        path: 'security',
        component: SecurityComponent,
        data: {
          breadcrumb: [{label: 'application'}, {label: 'security'}]
        },
        children: [
          {
            path: 'workbench',
            component: SecurityWorkbenchComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'security'}, {label: 'workbench'}]
            },
          },
          {
            path: 'workbench/passageway-information',
            component: PassagewayInformationComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'security'},
                {label: 'workbench', url: '/business/application/security/workbench'},
                {label: 'channelConfiguration'}
              ]
            },
          },
          {
            path: 'equipment-list',
            component: SecurityEquipmentListComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'security'}, {label: 'equipmentList'}]
            },
          },
          {
            path: 'policy-control',
            component: SecurityPolicyControlComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'security'}, {label: 'policyControl'}]
            },
          },
          {
            path: 'details/:id',
            component: SecurityDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'security'},
                {label: 'policyControl', url: '/business/application/security/policy-control'},
                {label: 'policyDetails'}
              ]
            },
          },
          {
            path: 'policy-control/:type',
            component: SecurityAddComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'security'},
                {label: 'policyControl', url: '/business/application/security/policy-control'},
                {label: 'policyAdd'}
              ]
            },
          },
          {
            path: 'replay-theater',
            component: ReplayTheaterComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'security'}, {label: 'replayTheater'}]
            },
          },
          {
            path: 'replay-theater/details',
            component: ReplayDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'security'},
                {label: 'policyControl', url: '/business/application/security/replay-theater'},
                {label: 'policyDetails'}
              ]
            },
          },
        ]
      },
      {
        path: 'strategy',
        component: StrategyComponent,
        data: {
          breadcrumb: [{label: 'application'}, {label: 'strategy'}, {label: 'strategy'}]
        },
        children: [
          {
            path: 'list',
            component: StrategyManagementComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'strategy', url: '/business/application/strategy/list'},
              ]
            },
          },
          {
            path: ':type',
            component: StrategyManagementAddComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'strategy', url: '/business/application/strategy/list'},
                {label: 'policyAdd'}
              ]
            },
          },
          {
            path: 'details/:id',
            component: StrategyManageDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'strategy', url: '/business/application/strategy/list'},
                {label: 'policyDetails'}
              ]
            },
          },
        ]
      }
    ]
  }
];
