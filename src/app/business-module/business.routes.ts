/**
 * Created by wh1709040 on 2019/1/3.
 */
import {Routes} from '@angular/router';
import {BusinessComponent} from './business.component';

export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: BusinessComponent,
    children: [
      {path: 'index', loadChildren: './index/index.module#IndexModule'},
      {path: 'facility', loadChildren: './facility/facility.module#FacilityModule'},
      {path: 'user', loadChildren: './user/user.module#UserModule'},
      {path: 'alarm', loadChildren: './alarm/alarm.module#AlarmModule'},
      {path: 'system', loadChildren: './system-setting/system-setting.module#SystemSettingModule'},
      {path: 'work-order', loadChildren: './work-order/work-order.module#WorkOrderModule'},
      {path: 'download', loadChildren: './download/download.module#DownloadModule'},
      {path: 'statistical-report', loadChildren: './statistical-report/statistical-report.module#StatisticalReportModule'},
      {path: 'screen', loadChildren: './big-screen/screen-enter.module#ScreenEnterModule'},
      {path: 'application', loadChildren: './application-system/application.module#ApplicationModule'},
      {path: 'topology', loadChildren: './topology/topology.module#TopologyModule'},
      // {path: 'equipment', loadChildren: './equipment/equipment.module#EquipmentModule'},
      {path: 'trouble', loadChildren: './trouble/trouble.module#TroubleModule'},
    ]
  },
];
