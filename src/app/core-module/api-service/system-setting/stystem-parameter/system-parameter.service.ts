import {Injectable} from '@angular/core';
import {SystemParameterInterface} from './system-parameter.interface';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {systemSettingRequireUrl} from '../http-url-config';
import {SystemParameterConfig} from '../../../../business-module/system-setting/enum/systemConfig';

@Injectable()
export class SystemParameterService implements SystemParameterInterface {
  constructor(private $http: HttpClient) {
  }

  updateSystem(type, body): Observable<object> {
    switch (type) {
      // 更新消息
      case SystemParameterConfig.MSG:
        return this.$http.post(systemSettingRequireUrl.updateMassage, body);
        break;
      // 更新邮件
      case SystemParameterConfig.EMAIL:
        return this.$http.post(systemSettingRequireUrl.updateMail, body);
        break;
      // 更新短信
      case SystemParameterConfig.NOTE:
        return this.$http.post(systemSettingRequireUrl.updateNote, body);
        break;
      // 更新推送
      case SystemParameterConfig.PUSH:
        return this.$http.post(systemSettingRequireUrl.updatePush, body);
        break;
      // 更新显示
      case SystemParameterConfig.SHOW:
        return this.$http.post(systemSettingRequireUrl.updateShow, body);
        break;
      case SystemParameterConfig.FTP:
        return this.$http.post(systemSettingRequireUrl.updateFtp, body);
    }
  }

  queryLanguage(): Observable<object> {
    return this.$http.get(systemSettingRequireUrl.queryLanguageAll);
  }

  selectDisplaySettingsParamForPageCollection() {
    return this.$http.get(systemSettingRequireUrl.selectDisplaySettingsParamForPageCollection);
  }

  testEmail(body) {
    return this.$http.post(systemSettingRequireUrl.sendMailTest, body);
  }

  testPhone(body) {
    return this.$http.post(systemSettingRequireUrl.sendMessageTest, body);
  }
  ftpSettingsTest(body) {
    return this.$http.post(systemSettingRequireUrl.ftpSettingsTest, body);
  }

  queryColumnSetting(): Observable<Object> {
    return this.$http.get(systemSettingRequireUrl.queryColumnSettings);
  }

  saveColumnSetting(body): Observable<Object> {
    return this.$http.post(systemSettingRequireUrl.saveColumnSettings, body);
  }

}
