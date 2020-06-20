import {Injectable} from '@angular/core';
import {SecurityPolicyInterface} from './security-policy.interface';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {systemSettingRequireUrl} from '../http-url-config';

@Injectable()
export class SecurityPolicyService implements SecurityPolicyInterface {

  constructor(private $http: HttpClient) {
  }

  queryPasswordPresent(type): Observable<Object> {
    return this.$http.get(`${systemSettingRequireUrl.queryPasswordPresent}/${type}`);
  }


  updatePasswordStrategy(body): Observable<Object> {
    return this.$http.post(systemSettingRequireUrl.updatePasswordStrategy, body);
  }

  queryAccountPresent(type): Observable<Object> {
    return this.$http.get(`${systemSettingRequireUrl.queryPasswordPresent}/${type}`);
  }


  updateAccountStrategy(body) {
    return this.$http.post(systemSettingRequireUrl.updateAccountStrategy, body);
  }

  queryRangesAll(body) {
    return this.$http.post(systemSettingRequireUrl.queryRanges, body);
  }

  deleteRanges(body) {
    return this.$http.post(systemSettingRequireUrl.deleteRanges, body);
  }

  addIpRange(body) {
    return this.$http.post(systemSettingRequireUrl.addIpRange, body);
  }

  updateIpRange(body) {
    return this.$http.put(systemSettingRequireUrl.updateIpRange, body);
  }

  queryRangeId(body) {
    return this.$http.post(systemSettingRequireUrl.queryIpRangeById, body);
  }

  updateRangeStatus(body) {
    return this.$http.put(systemSettingRequireUrl.updateRangeStatus, body);
  }

  updateAllRangesStatus(body) {
    return this.$http.put(systemSettingRequireUrl.updateAllRangesStatus, body);
  }

  queryAccountSecurity(): Observable<Object> {
    return this.$http.get(`${systemSettingRequireUrl.queryAccountSecurity}`);
  }

  queryPasswordSecurity(): Observable<Object> {
    return this.$http.get(`${systemSettingRequireUrl.queryPasswordSecurity}`);
  }
}
