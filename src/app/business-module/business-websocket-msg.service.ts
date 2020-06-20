import {Injectable} from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';
import {CurrAlarmServiceService} from './alarm/alarm-manage/current-alarm/curr-alarm-service.service';
import {NzI18nService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {NativeWebsocketImplService} from '../core-module/websocket/native-websocket-impl.service';
import {FiLinkModalService} from '../shared-module/service/filink-modal/filink-modal.service';
import {SessionUtil} from '../shared-module/util/session-util';
import {MapStoreService} from '../core-module/store/map.store.service';
import {IndexMissionService} from '../core-module/mission/index.mission.service';
import {ExportMessagePushService} from '../shared-module/service/message-push/message-push.service';
import {UpdatePasswordService} from './menu/top-menu/update-password/update-password-service';
import {CommonLanguageInterface} from '../../assets/i18n/common/common.language.interface';
import {FacilityMissionService} from '../core-module/mission/facility.mission.service';
import {UpdateUserNameService} from '../business-module/user/user-manage/modify-user/update-username-service';
import {NoticeMusicService} from '../shared-module/util/notice-music.service';

@Injectable()
export class BusinessWebsocketMsgService {
  // 国际化处理
  commonLanguage: CommonLanguageInterface;
  facilityNoticeArr = ['addDevice', 'updateDevice', 'deleteDevice', 'focusDevice', 'unFollowDevice'];
  url;
  start;
  websocketLanguage;

  constructor(private $router: Router,
              public $currentAlarmService: CurrAlarmServiceService,
              private $nzNotificationService: NzNotificationService,
              private $wsService: NativeWebsocketImplService,
              private $message: FiLinkModalService,
              private $i18n: NzI18nService,
              private $mapStoreService: MapStoreService,
              private $indexMissionService: IndexMissionService,
              private $modal: NzModalService,
              private $exportMessagePush: ExportMessagePushService,
              private $updatePasswordService: UpdatePasswordService,
              private $refresh: FacilityMissionService,
              private $updateUserNameService: UpdateUserNameService,
              private $noticeMusicService: NoticeMusicService) {
    this.$router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.url = this.$router.url;
      }
    });
    this.commonLanguage = this.$i18n.getLocaleData('common');
    this.websocketLanguage = this.$i18n.getLocale();
  }

  /**
   * 消息处理
   * param msg
   */
  public dealMsg(msg) {
    try {
      const userInfo = SessionUtil.getUserInfo();
      const data = JSON.parse(msg.data);
      // 后台标志 redis_split
      const id_token = `${userInfo.id}redis_split${SessionUtil.getToken()}`;
      if (data) {
        const channelId = data.channelId;
        const channelKey = data.channelKey;
        if (channelKey === 'alarm' && data.msg && data.msg.alarmMessage && data.msg.alarmMessage.alarmLevelCode) {
          return;
        }
        if (channelId === 'forceOff') {  // 在线用户列表强制下线在线用户
          this.dealOffLineUser(data, id_token);
        } else if (channelId === 'deleteUser') { // 用户列表强制删除用户账号
          this.dealDeleteUser(data, userInfo);
        } else if (this.facilityNoticeArr.indexOf(channelKey) > -1) { // 设施相关推送
          this.dealFacilityUpdate(channelKey, data.msg);
        } else if (channelKey === 'unlock') {
          this.dealLockStatusChange(channelKey, data.msg);
        } else if (channelId === SessionUtil.getToken() && channelKey === 'export') {
          if (SessionUtil.getMsgSetting().messageRemind === '1') {
            this.$noticeMusicService.noticeMusic();
            this.$exportMessagePush.messagePush(data.msg.code);
          }
        } else if (channelId === 'beOffline') {
          this.dealDeviceLogin(data, id_token);  // 账号已在其他设备登录
        } else if (channelId === 'auditTempAuth' && channelKey === 'tempAuth') {
          this.dealTempAuthMessage(data, userInfo); // 临时授权消息推送
        } else if (channelId === '160156' && channelKey === 'workflowBusiness') {
          // 巡检和销账
          if (JSON.parse(data.msg).procType === 'inspection') {
            this.$indexMissionService.workChange(data.msg);
          } else {
            this.$indexMissionService.clearBarrierChange(data.msg);
          }
        } else {
          this.dealMenuUpdate(msg);
        }
      }
    } catch (e) {
      console.log(e, '--->解析出错');
    }
  }

  /**
   * 处理菜单模板被修改消息弹框
   * param msg
   */
  private dealMenuUpdate(msg) {
    if (SessionUtil.getMsgSetting().messageRemind === '1') {
      this.$noticeMusicService.noticeMusic();
      this.$nzNotificationService.config({
        nzPlacement: 'bottomRight',
        nzDuration: SessionUtil.getMsgSetting().retentionTime * 1000
      });
      const node = document.getElementsByClassName('menu-blank');
      const nodeList = Array.from(node);
      nodeList.forEach(item => {
        item.parentNode.removeChild(item);
      });
      // this.$nzNotificationService.blank(this.commonLanguage.systemMsg, this.websocketLanguage.websocketMsg[], {nzClass: 'menu-blank'});
    }
  }

  /**
   * 开锁推送
   * param msg
   */
  private dealLockStatusChange(type, msg) {
    if (SessionUtil.isMessageNotification()) {
      this.$noticeMusicService.noticeMusic();
      this.$nzNotificationService.config({
        nzPlacement: 'bottomRight',
        nzDuration: SessionUtil.getMsgSetting().retentionTime * 1000
      });
      let _msg;
      const data = msg.data || [];
      // 电子锁开锁
      if (msg.code === 2400101) {
        _msg = this.$i18n.translate(`websocketMsg.${msg.code}`);
        data.forEach((item) => {
          _msg += `${item.doorNum}:${this.$i18n.translate(`websocketMsg.${item.unlockResult}`)},`;
        });
        _msg = _msg.substring(0, _msg.length - 1);
        //  人井开锁
      } else if (msg.code === 2500004) {
        _msg = this.$i18n.translate(`websocketMsg.${msg.code}`);
      }
      this.$nzNotificationService.blank(this.commonLanguage.openLockMsg, _msg);
    }
    if (this.url.startsWith('/business/index')) {
      this.$indexMissionService.facilityChange({type});
    }
    if (this.url.startsWith('/business/facility/facility-detail-view')) {
      this.$refresh.refreshChange(true);
    }
  }

  /**
   * 处理设施的推送
   * param msg
   */
  private dealFacilityUpdate(type, msg) {
    try {
      const arr = typeof msg === 'object' ? msg : JSON.parse(msg);
      let items = [];
      if (type === 'addDevice') {
        items.push(arr.deviceId);
        this.$mapStoreService.updateMarkerData(arr);
      } else if (type === 'updateDevice') {
        items.push(arr.deviceId);
        this.$mapStoreService.updateMarkerData(arr);
      } else if (type === 'deleteDevice') {   // 删除时返回数据是ids
        arr.forEach(item => {
          this.$mapStoreService.deleteMarker(item);
        });
        items = arr;
      } else if (type === 'focusDevice') {   // 删除时返回数据是ids
        items = arr;
      } else if (type === 'unFollowDevice') {   // 删除时返回数据是ids
        items = arr;
      }
      if (this.url.startsWith('/business/index')) {
        this.$indexMissionService.facilityChange({type, items});
      }
    } catch (e) {
      console.log(e, '--->设施消息解析出错');
    }
  }

  /**
   * 处理在线用户列表强制下线在线用户
   */
  private dealOffLineUser(data, id_token) {
    Object.keys(data.msg).forEach(item => {
      if (item === id_token) {
        this.$message.info(this.commonLanguage.beOffLineMsg);
        localStorage.clear();
        this.$router.navigate(['']).then();
        this.$wsService.close();
        // 关闭所有的模态框
        this.$modal.closeAll();
        this.$currentAlarmService.clearMessage();
        this.$updatePasswordService.clearMessage();
        this.$updateUserNameService.clearMessage();
      }
    });
  }

  /**
   * 处理用户列表强制删除用户账号
   */
  private dealDeleteUser(data, userInfo) {
    data.msg.forEach(item => {
      if (item === userInfo.id) {
        this.$message.info(this.commonLanguage.beDeleteMsg);
        localStorage.clear();
        this.$router.navigate(['']).then();
        this.$wsService.close();
        // 关闭所有的模态框
        this.$modal.closeAll();
        this.$currentAlarmService.clearMessage();
        this.$updatePasswordService.clearMessage();
        this.$updateUserNameService.clearMessage();
      }
    });
  }

  /**
   * 处理账号已在其他设备登录
   */
  private dealDeviceLogin(data, id_token) {
    Object.keys(data.msg).forEach(item => {
      if (item === id_token) {
        this.$message.info(this.commonLanguage.deviceBeOffLineMsg);
        this.$router.navigate(['']).then();
        this.$wsService.close();
        localStorage.clear();
        // 关闭所有的模态框
        this.$modal.closeAll();
        this.$currentAlarmService.clearMessage();
        this.$updatePasswordService.clearMessage();
        this.$updateUserNameService.clearMessage();
      }
    });
  }

  /**
   * 处理临时授权消息推送
   */
  private dealTempAuthMessage(data, userInfo) {
    if (SessionUtil.isMessageNotification()) {
      if (data.msg) {
        data.msg.forEach(item => {
          if (item === userInfo.id) {
            this.$noticeMusicService.noticeMusic();
            this.$nzNotificationService.config({
              nzPlacement: 'bottomRight',
              nzMaxStack: 1,
              nzDuration: SessionUtil.getMsgSetting().retentionTime * 1000
            });
            this.$nzNotificationService.blank(this.commonLanguage.systemMsg, this.commonLanguage.tempAuthMsg);
          }
        });
      }
    }
  }

}
