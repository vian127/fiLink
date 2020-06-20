import {Injectable} from '@angular/core';
import {MenuManageInterface} from './menu-manage.interface';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {systemSettingRequireUrl} from '../http-url-config';

@Injectable()
export class MenuManageService implements MenuManageInterface {

  constructor(private $http: HttpClient) {
  }

  getDefaultMenuTemplate(): Observable<Object> {
    return this.$http.get(systemSettingRequireUrl.getDefaultMenuTemplate);
  }

  addMenuTemplate(params): Observable<Object> {
    return this.$http.post(systemSettingRequireUrl.addMenuTemplate, params);
  }

  queryListMenuTemplateByPage(params) {
    return this.$http.post(systemSettingRequireUrl.queryListMenuTemplateByPage, params);
  }

  openMenuTemplate(id) {
    return this.$http.get(`${systemSettingRequireUrl.openMenuTemplate}/${id}`);
  }

  deleteMenuTemplate(ids) {
    return this.$http.post(systemSettingRequireUrl.deleteMenuTemplate, ids);
  }

  getMenuTemplateByMenuTemplateId(id) {
    return this.$http.get(`${systemSettingRequireUrl.getMenuTemplateByMenuTemplateId}/${id}`);
  }

  updateMenuTemplate(params) {
    return this.$http.put(systemSettingRequireUrl.updateMenuTemplate, params);
  }

  getShowMenuTemplate() {
    return this.$http.get(`${systemSettingRequireUrl.getShowMenuTemplate}`);
  }

  queryMenuExists(params) {
    return this.$http.post(systemSettingRequireUrl.queryMenuTemplateNameIsExists, params);
  }
  checkDeviceProtocolNameRepeat(params) {
    return this.$http.post(systemSettingRequireUrl.checkDeviceProtocolNameRepeat, params);
  }
}
