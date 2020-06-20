import {Subject} from 'rxjs';
import {Observable} from 'rxjs/src/internal/Observable';
import {SessionUtil} from '../../shared-module/util/session-util';
import {Injectable} from '@angular/core';

declare var WEBSOCKET_PROTOCOL;

/**
 * Created by wh1709040 on 2019/2/13.
 */
@Injectable()
export class NativeWebsocketImplService {
  private socket;
  // 心跳检测时间 默认半分钟发起一次心跳检测
  private heartCheckTime = 30 * 1000;
  private heartCheckTimeOut;
  private reconnectTimer;
  // 通过订阅的方式拿到消息
  subscibeMessage: Observable<any>;
  private messageTopic;
  private isConnect: boolean;
  private connectNum: number = 0;

  // 是否为连接状态
  constructor() {
    // this.connect();
  }

  /**
   * 连接
   */
  connect() {
    this.messageTopic = new Subject<any>();
    this.subscibeMessage = this.messageTopic.asObservable();
    // 部署服务器地址
    this.socket = new WebSocket(`${WEBSOCKET_PROTOCOL}://${location.host}/websocket/${SessionUtil.getToken()}`);
    // 本地调试地址
    // this.socket = new WebSocket(`${WEBSOCKET_PROTOCOL}://witstest.fi-link.net/websocket/${SessionUtil.getToken()}`);
    // 224调试地址
    // this.socket = new WebSocket(`ws:10.5.24.224:9001/websocket/${SessionUtil.getToken()}`);
    // 链接成功
    this.socket.onopen = () => {
      console.log('链接成功！');
      this.isConnect = true;
      // 开启心跳检测
      this.heartCheckStart();
      this.reconnectTimerRest();
    };
    this.socket.onmessage = (event) => {
      this.isConnect = true;
      if (event.data === 'alive') {
        this.connectNum = 0;
        console.log('websocket has alive');
      } else {
        this.messageTopic.next(event);
      }
    };
  }

  /**
   * 关闭
   */
  close() {
    if (this.socket) {
      this.socket.close();
      this.messageTopic.complete();
    }
  }

  /**
   * 获取数据（可能存在隐患）
   * 建议适用订阅的方式获取数据
   * param {(event) => {}} fn
   */
  getMessage(fn: (event) => {}) {
    if (this.socket) {
      this.socket.onmessage = (event) => {
        this.isConnect = true;
        if (fn) {
          fn(event);
        }
      };
    }
  }

  /**
   * 心跳开始
   */
  heartCheckStart() {
    this.heartCheckTimeOut = setInterval(() => {
      this.isConnect = false;
      this.socket.send('ping');
      console.log('正在ping服务器。。。。。。。');
      this.reconnectTimerRest();
      this.reconnectTimer = setInterval(() => {
        this.connectNum++;
        if (!this.isConnect && this.connectNum < 4) {
          // 重新连接
          console.log('正在重新连接服务器。。。。。。。' + this.connectNum);
          this.heartCheckRest();
          this.connect();
        }
        if (this.connectNum >= 4) {
          this.heartCheckRest();
          this.reconnectTimerRest();
        }
        if (this.isConnect) {
          this.connectNum = 0;
          this.reconnectTimerRest();
        }
      }, 15000);
    }, this.heartCheckTime);

  }

  /**
   * 重置心跳
   */
  heartCheckRest() {
    if (this.heartCheckTimeOut) {
      clearInterval(this.heartCheckTimeOut);
      this.heartCheckTimeOut = null;
    }
  }

  /**
   * 重置连接定时器
   */
  reconnectTimerRest() {
    if (this.reconnectTimer) {
      clearInterval(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}
