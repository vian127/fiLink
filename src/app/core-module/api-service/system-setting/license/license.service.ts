import {Injectable} from '@angular/core';
import {LicenseInterface} from './license.interface';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {systemSettingRequireUrl} from '../http-url-config';

@Injectable()
export class LicenseService implements LicenseInterface {

  constructor(private $http: HttpClient) {
  }

  getLicenseDetail(): Observable<Object> {
    return this.$http.get(systemSettingRequireUrl.getLicenseDetail);
  }

  uploadLicense(body): Observable<Object> {
    return this.$http.post(systemSettingRequireUrl.uploadLicense, body);
  }
}
