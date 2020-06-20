import {Routes} from '@angular/router';
import {SystemSettingComponent} from './system-setting.component';
import {MemuManagementComponent} from './memu-management/memu-management.component';
import {MenuAddComponent} from './memu-management/menu-add/menu-add.component';
import {LogManagementComponent} from './log-management/log-management.component';
import {AgreementManagementComponent} from './agreement-management/agreement-management.component';
import {FacilityAgreementComponent} from './agreement-management/facility-agreement/facility-agreement.component';
import {SecurityPolicyComponent} from './security-policy/security-policy.component';
import {AccessControlComponent} from './security-policy/access-control/access-control.component';
import {IdSecurityPolicyComponent} from './security-policy/id-security-policy/id-security-policy.component';
import {SystemParameterComponent} from './system-parameter/system-parameter.component';
import {AboutComponent} from './about/about.component';
import {ConfigAgreementComponent} from './agreement-management/config-agreement/config-agreement.component';
import {LicenseComponent} from './license/license.component';
import {AlarmDumpPolicyComponent} from './alarm-dump-policy/alarm-dump-policy.component';


export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: SystemSettingComponent,
    children: [
      {
        path: 'menu',
        data: {
          breadcrumb: [{label: 'systemSetting'}, {label: 'menuManagement', url: '/business/system/menu'}]
        },
        component: MemuManagementComponent
      },
      {
        path: 'menu-add',
        data: {
          breadcrumb: [{label: 'systemSetting'},
                       {label: 'menuManagement', url: '/business/system/menu'},
            {label: 'menuAdd'}]
        },
        component: MenuAddComponent
      },
      {
        path: 'menu-update/:id',
        data: {
          breadcrumb: [{label: 'systemSetting'},
            {label: 'menuManagement', url: '/business/system/menu'},
            {label: 'menuUpdate'}]
        },
        component: MenuAddComponent
      },
      {
        path: 'log',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'logManagement'},
            {label: 'operateLog', url: '/business/system/log'}]
        },
        component: LogManagementComponent
      },
      {
        path: 'log/security',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'logManagement'},
            {label: 'securityLog', url: '/business/system/log/user'}
          ]
        },
        component: LogManagementComponent
      },
      {
        path: 'log/system',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'logManagement'},
            {label: 'systemLog', url: '/business/system/log/system'}]
        },
        component: LogManagementComponent
      },
      {
        path: 'agreement',
        component: AgreementManagementComponent,
        children: [
          {
            path: 'facility',
            component: FacilityAgreementComponent,
            data: {
              breadcrumb: [{label: 'systemSetting'},
                           {label: 'agreementManagement'},
                           {label: 'facilityAgreement'}]
            },
          },
          {
            path: 'config/:configType',
            component: ConfigAgreementComponent,
            data: {
              breadcrumb: [{label: 'systemSetting'},
                {label: 'agreementManagement'}
              ]
            },
          }
        ]
      },
      {
        path: 'security-policy',
        component: SecurityPolicyComponent,
        children: [
          {
            path: 'access-control',
            component: AccessControlComponent,
            data: {
              breadcrumb: [{label: 'systemSetting'},
                {label: 'securityPolicy'}]
            },
          },
          {
            path: 'account',
            component: IdSecurityPolicyComponent,
            data: {
              breadcrumb: [{label: 'systemSetting'},
                {label: 'securityPolicy'}]
            },
          },
          {
            path: 'password',
            component: IdSecurityPolicyComponent,
            data: {
              breadcrumb: [{label: 'systemSetting'},
                {label: 'securityPolicy'}]
            },
          }
        ]
      },
      {
        path: 'system-parameter/:settingType',
        component: SystemParameterComponent,
        data: {
          breadcrumb: [{label: 'systemSetting'},
            {label: 'systemParameter'}]
        },
      },
      {
        path: 'about',
        component: AboutComponent,
        data: {
          breadcrumb: [{label: 'systemSetting'},
            {label: 'about'}]
        },
      },
      {
        path: 'license',
        component: LicenseComponent,
        data: {
          breadcrumb: [{label: 'systemSetting'},
            {label: 'license'}]
        },
      },
      {
        path: 'dump/alarm',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'dumpSetting'},
            {label: 'alarmDumpPolicy'}]
        },
        component: AlarmDumpPolicyComponent
      },
      {
        path: 'dump/system-log',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'dumpSetting'},
            {label: 'systemLogDumpPolicy'}]
        },
        component: AlarmDumpPolicyComponent
      },
      {
        path: 'dump/facility-log',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'dumpSetting'},
            {label: 'facilityLogDumpPolicy'}]
        },
        component: AlarmDumpPolicyComponent
      },
      {
        path: 'dump/inspection',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'dumpSetting'},
            {label: 'inspectionDumpStrategy'}]
        },
        component: AlarmDumpPolicyComponent
      },
      {
        path: 'dump/clear-barrier',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'dumpSetting'},
            {label: 'clearBarrierLogDumpStrategy'}]
        },
        component: AlarmDumpPolicyComponent
      },
    ]
  },
];
