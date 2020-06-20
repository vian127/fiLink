import {Routes} from '@angular/router';
import {StatisticalReportComponent} from './statistical-report.component';
import {OdnDeviceResourcesComponent} from './odn-device-resources/odn-device-resources.component';
import {DeviceStatisticalComponent} from './device-statistical/device-statistical.component';
import {AlarmTypeComponent} from './alarm-statistical/alarm-type/alarm-type.component';
import {TopNComponent} from './top-n/top-n.component';
import {AlarmDisposeComponent} from './alarm-statistical/alarm-dispose/alarm-dispose.component';
import {AlarmNameComponent} from './alarm-statistical/alarm-name/alarm-name.component';
import {AreaAlarmComponent} from './alarm-statistical/area-alarm/area-alarm.component';
import {AlarmIncrementComponent} from './alarm-statistical/alarm-increment/alarm-increment.component';
import { FacilityTypeComponent } from './work-order-statistical/inspection/facility-type/facility-type.component';
import { StatusComponent } from './work-order-statistical/inspection/status/status.component';
import { PercentComponent } from './work-order-statistical/inspection/percent/percent.component';
import { IncrementComponent } from './work-order-statistical/inspection/increment/increment.component';
import { UnitComponent } from './work-order-statistical/inspection/unit/unit.component';
import { DeviceTypeComponent } from './work-order-statistical/clear-barrier/device-type/device-type.component';
import { ClearBarrierStatusComponent } from './work-order-statistical/clear-barrier/clear-barrier-status/clear-barrier-status.component';
import { ProcessingComponent } from './work-order-statistical/clear-barrier/processing/processing.component';
import { FailureComponent } from './work-order-statistical/clear-barrier/failure/failure.component';
import { ClearBarrierRatioComponent } from './work-order-statistical/clear-barrier/clear-barrier-ratio/clear-barrier-ratio.component';
import { IncrementsComponent } from './work-order-statistical/clear-barrier/increments/increments.component';
import { ClearBarrierUnitComponent } from './work-order-statistical/clear-barrier/clear-barrier-unit/clear-barrier-unit.component';
import {OpticalCableComponent} from './optical-cable/optical-cable.component';
import { LogStatisticalComponent } from './log-statistical/log-statistical/log-statistical.component';
import { TemplateDetailsComponent } from './log-statistical/template-details/template-details.component';
import {OdnDeviceJumperComponent} from './odn-device-jumper/odn-device-jumper.component';

export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: StatisticalReportComponent,
    children: [
      {
        path: 'odn-jump-fiber',
        component: OdnDeviceResourcesComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'odnDeviceResources'},
            {label: 'jumpFiber'}
          ]
        }
      }, {
        path: 'odn-fused-fiber',
        component: OdnDeviceResourcesComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'odnDeviceResources'},
            {label: 'fusedFiber'}
          ]
        }
      }, {
        path: 'odn-disc',
        component: OdnDeviceResourcesComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'odnDeviceResources'},
            {label: 'disc'}
          ]
        }
      }, {
        path: 'odn-box',
        component: OdnDeviceResourcesComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'odnDeviceResources'},
            {label: 'box'}
          ]
        }
      }, {
        path: 'device-statistical',
        component: DeviceStatisticalComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'deviceStatistical'},
            {label: 'deviceNumber'}
          ]
        }
      },
      {
        path: 'device-status',
        component: DeviceStatisticalComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'deviceStatistical'},
            {label: 'deviceStatus'}
          ]
        }
      }, {
        path: 'device-deploy',
        component: DeviceStatisticalComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'deviceStatistical'},
            {label: 'deviceDeploy'}
          ]
        }
      },
      {
        path: 'device-sensor',
        component: DeviceStatisticalComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'deviceStatistical'},
            {label: 'deviceSensor'}
          ]
        }
      },
      {
        path: 'alarm-statistical',
        // component: AlarmStatisticalComponent,
        data: {
          breadcrumb: [
            {label: 'reportManagement'},
            {label: 'odnDeviceResources'}
          ]
        },
        children: [
          {
            path: 'alarm-type',
            component: AlarmTypeComponent,
            data: {
              breadcrumb: [
                {label: 'statisticalManagement'},
                {label: 'alarmStatistical'},
                {label: 'alarmTypeStatistical'}
              ]
            },
          },
          {
            path: 'alarm-dispose',
            component: AlarmDisposeComponent,
            data: {
              breadcrumb: [
                {label: 'statisticalManagement'},
                {label: 'alarmStatistical'},
                {label: 'alarmDisposeStatistical'}
              ]
            },
          }, {
            path: 'alarm-name',
            component: AlarmNameComponent,
            data: {
              breadcrumb: [
                {label: 'statisticalManagement'},
                {label: 'alarmStatistical'},
                {label: 'alarmNameStatistical'}
              ]
            },
          }, {
            path: 'area-alarm',
            component: AreaAlarmComponent,
            data: {
              breadcrumb: [
                {label: 'statisticalManagement'},
                {label: 'alarmStatistical'},
                {label: 'areaAlarmRatioStatistical'}
              ]
            },
          }, {
            path: 'alarm-increment',
            component: AlarmIncrementComponent,
            data: {
              breadcrumb: [
                {label: 'statisticalManagement'},
                {label: 'alarmStatistical'},
                {label: 'alarmIncrementStatistical'}
              ]
            },
          }
        ]
      },
      {
        path: 'work-order-statistical/inspection/facility-type',
        component: FacilityTypeComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'deviceTypeStatisticsOfInspection'}
          ]
        }
      },
      {
        path: 'work-order-statistical/inspection/status',
        component: StatusComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'statusStatisticsOfInspection'}
          ]
        }
      },
      {
        path: 'work-order-statistical/inspection/percent',
        component: PercentComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'areaRatioOfInspection'}
          ]
        }
      },
      {
        path: 'work-order-statistical/inspection/increment',
        component: IncrementComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'incrementOfInspection'}
          ]
        }
      },
      {
        path: 'work-order-statistical/inspection/unit',
        component: UnitComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'unitOfInspection'}
          ]
        }
      },
      {
        path: 'work-order-statistical/clear-barrier/device-type',
        component: DeviceTypeComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'deviceTypeStatisticsOfClearBarrier'}
          ]
        }
      },
      {
        path: 'work-order-statistical/clear-barrier/status',
        component: ClearBarrierStatusComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'statusStatisticsOfClearBarrier'}
          ]
        }
      },
      {
        path: 'work-order-statistical/clear-barrier/processing',
        component: ProcessingComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'processingSchemeStatistics'}
          ]
        }
      },
      {
        path: 'work-order-statistical/clear-barrier/failure',
        component: FailureComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'failureCauseStatistics'}
          ]
        }
      },
      {
        path: 'work-order-statistical/clear-barrier/percent',
        component: ClearBarrierRatioComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'areaRatioOfClearBarrier'}
          ]
        }
      },
      {
        path: 'work-order-statistical/clear-barrier/increment',
        component: IncrementsComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'incrementOfClearBarrier'}
          ]
        }
      },
      {
        path: 'work-order-statistical/clear-barrier/unit',
        component: ClearBarrierUnitComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'unitOfClearBarrier'}
          ]
        }
      }, {
        path: 'top-lock',
        component: TopNComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'topN'},
            {label: 'topLock'}
          ]
        }
      }, {
        path: 'top-alarm',
        component: TopNComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'topN'},
            {label: 'topAlarm'}
          ]
        }
      }, {
        path: 'top-work-order',
        component: TopNComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'topN'},
            {label: 'topWorkOrder'}
          ]
        }
      }, {
        path: 'top-sensor',
        component: TopNComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'topN'},
            {label: 'topSensor'}
          ]
        }
      }, {
        path: 'top-port',
        component: TopNComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'topN'},
            {label: 'topPort'}
          ]
        }
      }, {
        path: 'optical-cable',
        component: OpticalCableComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'opticalCable'},
            {label: 'cableStatistical'}
          ]
        }
      }, {
        path: 'cable-segment',
        component: OpticalCableComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'opticalCable'},
            {label: 'segment'}
          ]
        }
      }, {
        path: 'core-fiber',
        component: OpticalCableComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'opticalCable'},
            {label: 'core'}
          ]
        }
      },
      {
        path: 'log-statistical',
        component: LogStatisticalComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'logStatistical'}
          ]
        }
      },
      {
        path: 'log-statistical/template-details/:type',
        component: TemplateDetailsComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'logStatistical'},
            {label: 'logStatisticalTemplate'}
          ]
        }
      },
      {
        path: 'odn-jump/inner',
        component: OdnDeviceJumperComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'odnJump'},
            {label: 'innerJump'}
          ]
        }
      },
      {
        path: 'odn-jump/outer',
        component: OdnDeviceJumperComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'odnJump'},
            {label: 'outJump'}
          ]
        }
      }
    ]
  }
];
