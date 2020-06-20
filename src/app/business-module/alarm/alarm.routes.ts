import { Routes } from '@angular/router';
import { AlarmComponent } from './alarm.component';
import { CurrentAlarmComponent } from './alarm-manage/current-alarm/current-alarm.component';
import { HistoryAlarmComponent } from './alarm-manage/history-alarm/history-alarm.component';
// import { AlarmSetComponent } from './alarm-manage/alarm-set/alarm-set.component';
import { CurrentAlarmSetComponent } from './alarm-manage/alarm-set/current-alarm-set/current-alarm-set.component';
import { HistoryAlarmSetComponent } from './alarm-manage/alarm-set/history-alarm-set/history-alarm-set.component';
import { AlarmLevelSetComponent } from './alarm-manage/alarm-set/current-alarm-set/alarm-level-set/alarm-level-set.component';
import { AlarmFiltrationComponent } from './alarm-manage/alarm-set/alarm-filtration/alarm-filtration.component';
import { AlarmFiltrationAddComponent } from './alarm-manage/alarm-set/alarm-filtration/alarm-filtration-add/alarm-filtration-add.component';
import { AlarmRemoteNotificationComponent } from './alarm-manage/alarm-set/alarm-remote-notification/alarm-remote-notification.component';
import { AlarmWorkOrderComponent } from './alarm-manage/alarm-set/alarm-work-order/alarm-work-order.component';
import { RemoteAddComponent } from './alarm-manage/alarm-set/alarm-remote-notification/remote-add/remote-add.component';
import { WorkOrderAddComponent } from './alarm-manage/alarm-set/alarm-work-order/work-order-add/work-order-add.component';
import { CurrentAlarmAddComponent } from './alarm-manage/current-alarm/current-alarm-add/current-alarm-add.component';
import { DiagnoseDetailsComponent } from './alarm-manage/current-alarm/diagnose-details/diagnose-details.component';

export const ROUTER_CONFIG: Routes = [
    {
        path: '',
        component: AlarmComponent,
        data: {
            breadcrumb: '告警管理'
        },
        children: [
            {
                path: 'current-alarm',
                component: CurrentAlarmComponent,
                data: {
                    breadcrumb: [{ label: 'alarm', url: 'current-alarm' }, { label: 'currentAlarm' }]
                }
            },
            {
              path: 'current-alarm/:type',
              component: CurrentAlarmAddComponent,
              data: {
                  breadcrumb: [{ label: 'alarm', url: 'current-alarm' }, { label: 'templateQuery' }]
              }
            },
            {
                path: 'history-alarm',
                component: HistoryAlarmComponent,
                data: {
                    breadcrumb: [{ label: 'alarm', url: 'history-alarm' }, { label: 'historyAlarm' }]

                }
            },
            {
                path: 'current-alarm-set',
                component: CurrentAlarmSetComponent,
                data: {
                    breadcrumb: [
                        { label: 'alarm' },
                        { label: 'alarmSet' },
                        { label: 'currentAlarmSet' }
                    ]

                }
            },
            {
                path: 'history-alarm-set',
                component: HistoryAlarmSetComponent,
                data: {
                    breadcrumb: [{ label: 'alarm' },
                    { label: 'alarmSet' },
                    { label: 'historyAlarmSet' }
                    ]

                }
            },
            {
                path: 'alarm-level-set',
                component: AlarmLevelSetComponent,
                data: {
                    breadcrumb: [{ label: 'alarm' }, { label: 'alarmSet' },
                    { label: 'currentAlarmSet', url: 'current-alarm-set' },
                    { label: 'alarmLevelSet' }
                    ]

                }
            },
            {
              path: 'alarm-filtration',
              component: AlarmFiltrationComponent,
              data: {
                  breadcrumb: [
                      { label: 'alarm' },
                      { label: 'alarmSet' },
                      { label: 'alarmFilter' }
                  ]
              }
            },
            {
                path: 'alarm-filtration/:type',
                component: AlarmFiltrationAddComponent,
                data: {
                    breadcrumb: [
                      { label: 'alarm' },
                      { label: 'alarmSet' },
                      { label: 'alarmFilter', url: 'alarm-filtration' },
                      { label: 'alarmFilter' }
                    ]
                }
            },
            {
              // 告警远程通知
              path: 'alarm-remote-notification',
              component: AlarmRemoteNotificationComponent,
              data: {
                  breadcrumb: [
                      { label: 'alarm' },
                      { label: 'alarmSet' },
                      { label: 'alarmRemoteNotification' }
                  ]
              }
            },
            {
              // 告警远程通知 新增 编辑页面
              path: 'alarm-remote-notification/:type',
              component: RemoteAddComponent,
              data: {
                  breadcrumb: [
                      { label: 'alarm' },
                      { label: 'alarmSet' },
                      { label: 'alarmRemoteNotification', url: 'alarm-remote-notification'},
                      { label: 'alarmRemoteNotification'}
                  ]}
            },
            {
              // 告警转工单
              path: 'alarm-work-order',
              component: AlarmWorkOrderComponent,
              data: {
                  breadcrumb: [
                      { label: 'alarm' },
                      { label: 'alarmSet' },
                      { label: 'alarmWorkOrder' }
                  ]
              }
            },
            {
              // 告警转工单 新增 编辑页面
              path: 'alarm-work-order/:type',
              component: WorkOrderAddComponent,
              data: {
                  breadcrumb: [
                      { label: 'alarm' },
                      { label: 'alarmSet' },
                      { label: 'alarmWorkOrder', url: 'alarm-work-order' },
                      { label: 'alarmWorkOrder' }
                  ]}
            },
          {
            // 当前告警诊断详情
            path: 'diagnose-details',
            component: DiagnoseDetailsComponent,
            data: {
              breadcrumb: [
                { label: 'alarm' },
                { label: 'currentAlarm', url: 'current-alarm'},
                { label: 'diagnoseDetails' }
              ]
            }
          },
          {
            // 历史告警诊断详情
            path: 'history-diagnose-details',
            component: DiagnoseDetailsComponent,
            data: {
              breadcrumb: [
                { label: 'alarm' },
                { label: 'historyAlarm', url: 'history-alarm'},
                { label: 'diagnoseDetails' }
              ]
            }
          },
        ]
    }
];
