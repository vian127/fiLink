import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DumpInterface} from './dump.interface';

import {systemSettingRequireUrl} from '../http-url-config';
import {Observable} from 'rxjs';

@Injectable()
export class DumpService implements DumpInterface {

  constructor(private $http: HttpClient) {
  }

  queryDumpPolicy(params): Observable<Object> {
    return this.$http.get(`${systemSettingRequireUrl.queryAlarmDumpPolicy}/${params}`);
  }

  updateDumpPolicy(body): Observable<Object> {
    return this.$http.post(systemSettingRequireUrl.updateDumpPolicy, body);
  }

  handDumpData(type): Observable<Object> {
    return this.$http.get(`${systemSettingRequireUrl.handDumpData}/${type}`);
  }

  queryNowDumpInfo(type): Observable<Object> {
    return this.$http.post(`${systemSettingRequireUrl.queryNowDumpInfo}/${type}`, {});
  }

  queryDumpInfo(id): Observable<Object> {
    return this.$http.get(`${systemSettingRequireUrl.queryDumpInfo}/${id}`);
  }
}
