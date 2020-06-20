import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UpdatePasswordComponent} from './top-menu/update-password/update-password.component';
import {SharedModule} from '../../shared-module/shared-module.module';
import { ThreeMenuComponent } from './left-menu/three-menu/three-menu.component';
import { FirstMenuComponent } from './left-menu/first-menu/first-menu.component';

@NgModule({
  declarations: [UpdatePasswordComponent, ThreeMenuComponent, FirstMenuComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [UpdatePasswordComponent, ThreeMenuComponent, FirstMenuComponent]
})
export class MenuModule { }
