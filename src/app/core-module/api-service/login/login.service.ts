import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginInterface} from './login.interface';
import {loginRequireUrl} from './http-url-config';
@Injectable()
export class LoginService implements LoginInterface {

  constructor(private $http: HttpClient) {
  }

  login(params): Observable<Object> {
    return this.$http.post(loginRequireUrl.login, params);
  }

  validateLicense(): Observable<Object> {
    return this.$http.get(loginRequireUrl.validateLicenseTime);
  }

  uploadLicense(body): Observable<Object> {
    return this.$http.post(loginRequireUrl.uploadLicense, body);
  }

  getVerificationCode(body): Observable<Object> {
    return this.$http.post(`${loginRequireUrl.GET_VERIFICATION_CODE}`, body);
  }

  phoneLogin(body): Observable<Object> {
    return this.$http.post(`${loginRequireUrl.PHONE_LOGIN}`, body);
  }
}
