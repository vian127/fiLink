/**
 * @author xiaoconghu
 * @createTime 2018/9/20
 */
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpErrorResponse, HttpHandler, HttpHeaderResponse, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {catchError, retry} from 'rxjs/internal/operators';
import {Observable, throwError} from 'rxjs';

import {basicAuthConfig} from '../basic-auth';
import {Base64} from '../../shared-module/util/base64';
import {FiLinkModalService} from '../../shared-module/service/filink-modal/filink-modal.service';
import {SessionUtil} from '../../shared-module/util/session-util';
import {NzI18nService} from 'ng-zorro-antd';
import {NativeWebsocketImplService} from '../websocket/native-websocket-impl.service';
import {CommonUtil} from '../../shared-module/util/common-util';
import {QUERY_EVERY_ALARM_COUNT} from '../api-service/alarm/alarm-request-url';

@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  // 防止多次弹框
  timer = null;
  // 是否弹框
  flag: boolean = true;
  language: any;

  constructor(private $router: Router,
              private $nzI18n: NzI18nService,
              private websocketService: NativeWebsocketImplService,
              private $message: FiLinkModalService) {
    this.language = this.$nzI18n.getLocale();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<| HttpHeaderResponse | HttpResponse<any>> {
    let req = null;
    if (SessionUtil.getToken()) {
      // 每次请求重置token时间 如是查询告警次数怎不重新设置
      if (request.url !== QUERY_EVERY_ALARM_COUNT) {
        SessionUtil.setToken(SessionUtil.getToken(), SessionUtil.getUserInfo().expireTime);
      }
      req = request.clone({
        setHeaders: {
          Authorization: SessionUtil.getToken(),
          userId: SessionUtil.getUserId(),
          roleId: SessionUtil.getRoleId(),
          roleName: SessionUtil.getRoleName() ? Base64.encode(SessionUtil.getRoleName()) : '',
          userName: SessionUtil.getUserInfo().userName ? Base64.encode(SessionUtil.getUserInfo().userName) : '',
          zone: CommonUtil.getTimeone(),
          language: SessionUtil.getLanguage()
        }
      });
    } else {
      req = request.clone({
        setHeaders: {
          loginSource: '1',
          language: SessionUtil.getLanguage(),
          Authorization:
            `Basic ${this.createBasicAuth(basicAuthConfig.username, basicAuthConfig.password)}`
        }
      });
    }
    return next.handle(req).pipe(
      retry(1),
      catchError((err: HttpErrorResponse) => this.handleData(err))
    );
  }

  /**
   * 生成basicAuth
   * param name
   * param pass
   */
  createBasicAuth(name, pass) {
    return btoa(encodeURIComponent(`${name}:${pass}`).replace(/%([0-9A-F]{2})/g,
      function (match, p1) {
        return String.fromCharCode(Number('0x' + p1));
      }));
  }

  private handleData(event: HttpResponse<any> | HttpErrorResponse): Observable<any> {
    // 业务处理：一些通用操作
    let errorStr = '';
    switch (event.status) {
      case 401:
        errorStr = this.language.httpMsg.noLogin;
        localStorage.clear();
        this.websocketService.close();
        this.$router.navigate(['/login']).then();
        break;
      case 404:
        errorStr = this.language.httpMsg.notFound;
        break;
      case 502:
        errorStr = event['error'].msg;
        break;
      default:
        errorStr = this.language.httpMsg.serverError;
    }
    if (this.flag) {
      this.$message.error(errorStr, () => {
        this.flag = true;
      });
      this.flag = false;
    }
    return throwError(event['error']);
  }
}

