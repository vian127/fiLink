/**
 * Created by xiaoconghu on 2018/11/19.
 */
import {InjectionToken, NgModule} from '@angular/core';
import {XcI18nInterface} from './xc-i18n.interface';
import zh_CN from './language/zh_CN';
import {XcI18nService} from './xc-i18n.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [
    {provide: new InjectionToken<XcI18nInterface>('xc-i18n'), useValue: zh_CN},
    {provide: new InjectionToken<XcI18nInterface>('xc-i18n-service'), useClass: XcI18nService}
  ]
})
export class XcI18nModule {

}
