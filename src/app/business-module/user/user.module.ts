import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { SharedModule } from '../../shared-module/shared-module.module';
import { RouterModule } from '@angular/router';
import { ROUTER_CONFIG } from './user.routes';
import { UserManageComponent } from './user-manage/user-manage.component';
import { UserListComponent } from './user-manage/user-list/user-list.component';
import { UnitListComponent } from './user-manage/unit-list/unit-list.component';
import { AddUserComponent } from './user-manage/add-user/add-user.component';
import { ModifyUserComponent } from './user-manage/modify-user/modify-user.component';
import { OnlineListComponent } from './user-manage/online-list/online-list.component';
import { UnitDetailComponent } from './user-manage/unit-detail/unit-detail.component';
import { RoleListComponent } from './user-manage/role-list/role-list.component';
import { RoleDetailComponent } from './user-manage/role-detail/role-detail.component';
import { UserUtilService } from './user-util.service';
import { FacilityAuthorizationComponent } from './user-manage/facility-authorization/facility-authorization.component';
import { UnifiedAuthorizationComponent } from './user-manage/facility-authorization';
import { TemporaryAuthorizationComponent } from './user-manage/facility-authorization';
import { UnifiedDetailsComponent } from './user-manage/facility-authorization/unified-details/unified-details.component';
import { FacilityUtilService } from '../facility/share/service/facility-util.service';
import { DeptLevelPipe } from './user-manage/unit-list/dept-level.pipe';
import { DeptStylePipe } from './user-manage/unit-list/dept-style.pipe';

@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    AddUserComponent,
    ModifyUserComponent,
    UserManageComponent,
    UnitListComponent,
    OnlineListComponent,
    UnitDetailComponent,
    RoleListComponent,
    RoleDetailComponent,
    FacilityAuthorizationComponent,
    UnifiedAuthorizationComponent,
    TemporaryAuthorizationComponent,
    UnifiedDetailsComponent,
    DeptLevelPipe,
    DeptStylePipe],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTER_CONFIG)

  ],
  providers: [UserUtilService, FacilityUtilService]
})
export class UserModule {
}
