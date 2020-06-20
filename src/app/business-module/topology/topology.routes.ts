import {Routes} from '@angular/router';
import {TopologyComponent} from './topology.component';
import {AreaDetailComponent} from '../facility/area-manage/area-detail/area-detail.component';

export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: TopologyComponent,
    data: {
      breadcrumb: [{label: 'topologyComponent'}]
    }
  },
  {
    path: 'topology/:type',
    component: TopologyComponent,
    data: {
      breadcrumb: [{label: 'topologyComponent'}]
    }
  },
];
