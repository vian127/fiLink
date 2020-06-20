import {Injectable} from '@angular/core';
import {LogManageInterface} from './log-manage.interface';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {systemSettingRequireUrl} from '../http-url-config';

@Injectable()
export class LogManageService implements LogManageInterface {

  constructor(private $http: HttpClient) {
  }

  findSystemLog(params): Observable<Object> {
    return this.$http.post(systemSettingRequireUrl.findSystemLog, params);
  }

  findOperateLog(params): Observable<Object> {
    return this.$http.post(systemSettingRequireUrl.findOperateLog, params);
  }

  findSecurityLog(params): Observable<Object> {
    return this.$http.post(systemSettingRequireUrl.findSecurityLog, params);
  }

  exportOperateLogExport(body): Observable<Object> {
    return this.$http.post(systemSettingRequireUrl.exportOperateLogExport, body);
  }

  exportSysLogExport(body): Observable<Object> {
    return this.$http.post(systemSettingRequireUrl.exportSysLogExport, body);
  }

  exportSecurityLogExport(body): Observable<Object> {
    return this.$http.post(systemSettingRequireUrl.exportSecurityLogExport, body);
  }
}
