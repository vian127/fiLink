import {Injectable} from '@angular/core';
import {combineLatest, Observable, of, Subject} from 'rxjs';
import {XcI18nInterface} from './xc-i18n.interface';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../util/common-util';

declare interface Window {
  navigator: any;
  localStorage: any;
}

declare const window: Window;


@Injectable({
  providedIn: 'root'
})
export class XcI18nService implements XcI18nInterface {
  private _localId: string;
  private _localResource: Observable<any>;
  private _change: Subject<any> = new Subject<any>();

  constructor(private datePipe: DatePipe, private http: HttpClient, private nzI18n: NzI18nService) {
    this._localId = window.localStorage.getItem('localId') || 'zh_CN';
    this._localResource = this.getTranslation(this._localId);
  }

  public localChange() {
    return this._change.asObservable();
  }

  setLocal(_localId: string) {
    this._localId = _localId;
    this._localResource = this.getTranslation(_localId);
    this.nzI18n.setLocale(CommonUtil.toggleNZi18n(_localId).language);
    // this._change.next(this._localResource);
    this._localResource.subscribe(e => {
      this._change.next(e);
    });
  }

  get localId() {
    return this._localId;
  }

  getLocal(): Observable<Object> {
    return this._localResource;
  }

  getLocalData(target: string): any {
    // return target ? this._getObjectPath(this._local, target) : this._local;
  }

  getLocalDate(date: any, format: string, timezone?: string, local?: string): string {
    return date ? this.datePipe.transform(date, format, timezone, local || this._localId) : null;
  }

  setLocalOverLoading(localId: string): void {
    window.localStorage.setItem('localId', localId);
    location.reload();
  }

  /**
   * 获取多层obj下面的值
   * param {object} obj
   * param {string} path
   * returns {any}
   * private
   */
  private _getObjectPath(obj: object, path: string): any {
    let res = obj;
    const paths = path.split('.');
    const depth = paths.length;
    let index = 0;
    while (res && index < depth) {
      res = res[paths[index++]];
    }
    return index === depth ? res : null;
  }

  /**
   * 语言包加载器
   * param {string} localId
   * param {string} prefix
   * param {string} suffix
   * returns {Observable<Object>}
   */
  private getTranslation(localId: string, prefix = '/assets/i18n/', suffix = '.json'): Observable<Object> {
    return this.http.get(`${prefix}${localId}${suffix}`);
  }

  /**
   * 获取浏览器的语言id码
   * returns {string}
   */
  public getBrowserCultureLang(): string {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return undefined;
    }
    let browserCultureLang: any = window.navigator.languages ? window.navigator.languages[0] : null;
    browserCultureLang = browserCultureLang || window.navigator.language
      || window.navigator.browserLanguage || window.navigator.userLanguage;
    return browserCultureLang;
  }
}
