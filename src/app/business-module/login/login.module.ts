import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login.component';
import {RouterModule} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {ROUTER_CONFIG} from './login.routes';
import {CoreModule} from '../../core-module/core-module.module';
import {SharedModule} from '../../shared-module/shared-module.module';
import { UserLoginComponent } from './user-login/user-login.component';
import { PhoneLoginComponent } from './phone-login/phone-login.component';

@NgModule({
  declarations: [LoginComponent, UserLoginComponent, PhoneLoginComponent],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    RouterModule.forChild(ROUTER_CONFIG)
  ],
  providers: [ CookieService ]
})
export class LoginModule {
}
