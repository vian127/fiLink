import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {NzI18nService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {IndexMissionService} from '../core-module/mission/index.mission.service';
import {AlarmService} from '../core-module/api-service/alarm';
import {ThreeMenuComponent} from './menu/left-menu/three-menu/three-menu.component';
import {NativeWebsocketImplService} from '../core-module/websocket/native-websocket-impl.service';
import {UserService} from '../core-module/api-service/user/user-manage';
import {Result} from '../shared-module/entity/result';
import {AlarmStoreService} from '../core-module/store/alarm.store.service';
import {AlarmLevelSetConfig} from './alarm/alarm-manage/alarm-set/current-alarm-set/alarm-level-set/config';
import {QueryCondition} from '../shared-module/entity/queryCondition';
import {CurrAlarmServiceService} from './alarm/alarm-manage/current-alarm/curr-alarm-service.service';
import {FiLinkModalService} from '../shared-module/service/filink-modal/filink-modal.service';
import {CommonLanguageInterface} from 'src/assets/i18n/common/common.language.interface';
import {SessionUtil} from '../shared-module/util/session-util';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {BusinessWebsocketMsgService} from './business-websocket-msg.service';
import {SecurityPolicyService} from '../core-module/api-service/system-setting/security-policy/security-policy.service';
import {UpdatePasswordService} from './menu/top-menu/update-password/update-password-service';
import {AudioMusicService} from 'src/app/shared-module/service/audio-music/audio-music.service';
import {UpdateUserNameService} from './user/user-manage/modify-user/update-username-service';
import {FacilityService} from '../core-module/api-service/facility/facility-manage';
import {AlarmLevelCode} from './facility/share/const/facility.config';
import {SystemParameterService} from '../core-module/api-service/system-setting/stystem-parameter/system-parameter.service';
import {CommonUtil} from '../shared-module/util/common-util';
import {IndexLanguageInterface} from '../../assets/i18n/index/index.language.interface';
import {EventManager} from '@angular/platform-browser';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  // 用户信息
  userInfo = {userNickname: '', id: '', userName: ''};
  userName: string = '';
  // 主页面菜单配置
  menuList = [];
  // 三级菜单路由配置
  threeMenuInfo = {menuName: undefined, parentMenuId: '', menuId: '', children: []};
  // 修改密码弹出框控制
  isUpdatePassword = false;
  redAlarmCount: number = 0;     // 红色告警数量
  orangeAlarmCount: number = 0;  // 橙色告警数量
  yellowAlarmCount: number = 0;  // 黄色告警数量
  blueAlarmCount: number = 0;    // 蓝色告警数量
  alarmArray: Array<any> = [];
  queryCondition: QueryCondition = new QueryCondition();
  alarmColorObj = {};
  colorInfo = {};
  language: CommonLanguageInterface;

  // 首页查询结果列表
  indexSearchList = [];
  // 首页查询
  searchValue: '';
  // 显示设置
  displaySettings = {
    screenDisplay: '',
    screenScroll: '',
    screenScrollTime: 0,
    systemLogo: '',
    timeType: '',
  };
  logoUrl: string;
  overlayRef: OverlayRef;
  player1: any;
  // 密码校验对象
  passwordCheckObj = {
    minLength: 6,
    containLower: '1',
    containUpper: '1',
    containNumber: '1',
    containSpecialCharacter: '1'
  };
  loginTimer = null; // 登入维护定时器
  confirmModal: NzModalRef;
  alarmStyle = {
    urgency: {style: '', data: undefined},
    main: {style: '', data: undefined},
    secondly: {style: '', data: undefined},
    remind: {style: '', data: undefined}
  };
  navigation;
  typeLg;
  languageAll = []; // 获取所有下拉语言
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  @ViewChild('threeMenu') private threeMenu: ThreeMenuComponent;
  @ViewChild('searchTemplate') searchTemplate: TemplateRef<any>;
  @ViewChild('searchInput') searchInput: ElementRef;
  queryAlarmCountTimer: any;

  constructor(public $router: Router,
              public $alarmStoreService: AlarmStoreService,
              public $currentAalarmService: CurrAlarmServiceService,
              private $mission: IndexMissionService,
              private $alarmService: AlarmService,
              private $userService: UserService,
              private el: ElementRef,
              private $nzNotificationService: NzNotificationService,
              private $wsService: NativeWebsocketImplService,
              private $message: FiLinkModalService,
              private $i18n: NzI18nService,
              private overlay: Overlay,
              private viewContainerRef: ViewContainerRef,
              private $businessWebsocketMsgService: BusinessWebsocketMsgService,
              private $securityPolicyService: SecurityPolicyService,
              private $updatePasswordService: UpdatePasswordService,
              private $nzModalService: NzModalService,
              private $updateUserNameService: UpdateUserNameService,
              private $facilityService: FacilityService,
              private $audioMusicService: AudioMusicService,
              private eventManager: EventManager,
              private $systemParameterService: SystemParameterService,
              public $nzI18n: NzI18nService) {
    this.navigation = $nzI18n.getLocaleData('navigation');
    this.$currentAalarmService.getMessage().subscribe(res => {
      if (res === 2) {
        this.queryAlarmCount();
      }
      if (res === 1) {
        this.queryAlarmLevel();
      }
    });
    this.$updatePasswordService.getMessage().subscribe(res => {
      if (res === 1) {
        this.queryPasswordSecurity();
      }
    });
    this.$updateUserNameService.getMessage().subscribe(res => {
      if (res) {
        localStorage.setItem('userName', res);
        this.userName = localStorage.getItem('userName');
      }
    });
  }

  ngOnInit() {
    // 全局禁用confirm弹框的enter事件
    this.eventManager.addGlobalEventListener('window', 'keydown', (event) => {
      if (event.target.parentElement.className === 'ant-modal-confirm-btns') {
        event.target.blur();
      }
    });
    this.indexLanguage = this.$nzI18n.getLocaleData('index');
    this.$wsService.connect();
    this.initAlarmColor();
    this.language = this.$i18n.getLocaleData('common');
    this.getMenuList();
    this.userInfo = SessionUtil.getUserInfo();
    localStorage.setItem('userName', localStorage.getItem('userName') ? localStorage.getItem('userName') : this.userInfo.userName);
    this.userName = localStorage.getItem('userName');
    this.queryAlarmLevel();
    this.queryAlarmCount();
    // 5分钟查询一次告警级别的值
    this.queryAlarmCountTimer = setInterval(() => {
      this.queryAlarmCount();
    }, 60 * 1000 * 5);
    this.$wsService.subscibeMessage.subscribe(msg => {
      this.$businessWebsocketMsgService.dealMsg(msg);
      this.alarmHint(msg);
    });
    this.createOverlayRef();
    this.initDisplaySettings();
    this.queryPasswordSecurity();
    // 当清除缓存的时候 则退出登入
    this.loginTimer = setInterval(() => {
      if (!SessionUtil.getToken()) {
        this.$wsService.close();
        this.$router.navigate(['/login']).then();
        this.$message.warning(this.language.beOffOrTimeOut);
      }
    }, 1000);
    this.queryLanguage();
    this.typeLg = JSON.parse(localStorage.getItem('localLanguage'));
  }

  // 告警提示音
  alarmHint(msg) {
    const alarmMsg = JSON.parse(msg.data);
    if (alarmMsg.channelKey === 'alarm') {
      const responsibleUnit = alarmMsg.msg.responsibleDepartment.split(',');
      const deviceTypeId = alarmMsg.msg.alarmSourceTypeId;
      const userInfo: any = SessionUtil.getUserInfo();
      const deviceRoleSet = userInfo.role.roleDevicetypeList as any[];
      const hasDeviceTypeRole = deviceRoleSet.findIndex(item => item.deviceTypeId === deviceTypeId) > -1;
      // 判断推送的消息当前用户是否有权限 id为'1'是超级管理员默认有所以权限
      if (userInfo.id === '1' || (responsibleUnit.includes(userInfo.deptId) && hasDeviceTypeRole)) {
        const levelCode = alarmMsg.msg.alarmMessage.alarmLevelCode;
        switch (levelCode) {
          case AlarmLevelCode.URGENT:
            this.alarmStyle.urgency.data = Number(this.alarmStyle.urgency.data) + 1;
            break;
          case AlarmLevelCode.MAIN:
            this.alarmStyle.main.data = Number(this.alarmStyle.main.data) + 1;
            break;
          case AlarmLevelCode.SECONDARY:
            this.alarmStyle.secondly.data = Number(this.alarmStyle.secondly.data) + 1;
            break;
          case AlarmLevelCode.PROMPT:
            this.alarmStyle.remind.data = Number(this.alarmStyle.remind.data) + 1;
            break;
        }
        if (alarmMsg.msg.alarmMessage.isPrompt === '1') {
          // 判断是否播放
          this.$audioMusicService.playAudio(alarmMsg);

          this.$nzNotificationService.config({
            nzPlacement: 'bottomRight',
            nzMaxStack: 1,
            nzDuration: SessionUtil.getMsgSetting().retentionTime * 3000
          });

          const json_alarmMsg = typeof alarmMsg.msg === 'object' ? alarmMsg.msg : JSON.parse(alarmMsg.msg);
          // 通过设施id查询设施名称
          this.$facilityService.queryDeviceById(json_alarmMsg.deviceId).subscribe((resData: Result) => {
            if (resData.code === 0) {
              this.$nzNotificationService.blank(this.language.alarmMsg, resData.data.deviceName + ' : ' + json_alarmMsg.alarmName);
            } else {
              this.$message.error(resData.msg);
            }
          });

        }
      }
    }

  }

  /**
   * 获取菜单配置
   */
  getMenuList() {
    let menuList = [];
    if (localStorage.getItem('menuList') !== 'undefined') {
      const list = JSON.parse(localStorage.getItem('menuList'));
      list.map(item => {
        item['eName'] = this.navigation[item.menuId];
        if (item.children) {
          item.children.map(_next => {
            _next['eName'] = this.navigation[_next.menuId];
            if (_next.children) {
              _next.children.map(_K => {
                _K['eName'] = this.navigation[_K.menuId];
              });
            }
          });
        }
      });
       menuList = list;
    }
    this.menuList = menuList;
  }

  /**
   * 修改密码
   */
  updatePassword() {
    this.isUpdatePassword = !this.isUpdatePassword;
  }

  /**
   * 显示三级菜单
   * param item
   */
  showThreeMenu(item) {
    if (this.threeMenu) {
      this.threeMenu.isShow = true;
    }
    this.threeMenuInfo = item;
  }

  /**
   * 退出登入
   */
  logout() {
    this.confirmModal = this.$nzModalService.confirm({
      nzTitle: this.language.logOutMsg,
      nzOkText: this.language.cancelText,
      nzCancelText: this.language.okText,
      nzOkType: 'danger',
      nzKeyboard: false,
      nzOnCancel: () => {
        return new Promise((resolve, reject) => {
          const userInfo = SessionUtil.getUserInfo();
          const data = {
            userid: userInfo.id,
            token: SessionUtil.getToken()
          };
          this.$userService.logout(data).subscribe((result: Result) => {
            localStorage.clear();
            this.$wsService.close();
            this.$router.navigate(['']).then();
            resolve();
          }, () => {
            localStorage.clear();
            this.$wsService.close();
            this.$router.navigate(['']).then();
            reject();
          });
        });

      }
    });
  }

  /**
   * 切换语言
   */
  languageCheck(item) {
    const nowLanguage = JSON.parse(localStorage.getItem('localLanguage'));
    // 判断是否是相同
    if (item.languageType === nowLanguage) {
      return;
    }
    // 前端切换中英文
    if (item.languageType === 'US') {
      this.$nzI18n.setLocale(CommonUtil.toggleNZi18n('en_US').language);
    } else {
      this.$nzI18n.setLocale(CommonUtil.toggleNZi18n('zh_CN').language);
    }
    window.location.reload();
    localStorage.setItem('localLanguage', JSON.stringify(item.languageType));
  }

  /**
   * 查询告警数量
   * 1 是紧急  2 是主要 3 是次要 4 提示
   */
  queryAlarmCount() {
    this.$alarmService.queryEveryAlarmCount(Number(AlarmLevelCode.URGENT)).subscribe(res => {
      if (res['code'] === 0) {
        this.alarmStyle.urgency = {
          style: this.$alarmStoreService.getAlarmColorByLevel(AlarmLevelCode.URGENT),
          data: Number(res['data'])
        };
      }
    });
    this.$alarmService.queryEveryAlarmCount(Number(AlarmLevelCode.MAIN)).subscribe(res => {
      if (res['code'] === 0) {
        // this.orangeAlarmCount = res['data'];
        this.alarmStyle.main = {
          style: this.$alarmStoreService.getAlarmColorByLevel(AlarmLevelCode.MAIN),
          data: Number(res['data'])
        };
      }
    });
    this.$alarmService.queryEveryAlarmCount(Number(AlarmLevelCode.SECONDARY)).subscribe(res => {
      if (res['code'] === 0) {
        // this.yellowAlarmCount = res['data'];
        this.alarmStyle.secondly = {
          style: this.$alarmStoreService.getAlarmColorByLevel(AlarmLevelCode.SECONDARY),
          data: Number(res['data'])
        };
      }
    });
    this.$alarmService.queryEveryAlarmCount(Number(AlarmLevelCode.PROMPT)).subscribe(res => {
      if (res['code'] === 0) {
        // this.blueAlarmCount = res['data'];
        this.alarmStyle.remind = {
          style: this.$alarmStoreService.getAlarmColorByLevel(AlarmLevelCode.PROMPT),
          data: Number(res['data'])
        };
      }
    });
  }

  /**
   * 查询所有告警级别
   */
  queryAlarmLevel() {
    this.$alarmService.queryAlarmLevelList(this.queryCondition).subscribe((res: Result) => {
      const data = res['data'];
      if (res.code === 0 && data && data[0]) {
        this.$alarmStoreService.alarm = data.map(item => {
          item.color = this.alarmColorObj[item.alarmLevelColor];
          return item;
        });
      }
      this.colorInfo = this.$alarmStoreService.getAlarmColorStyleObj();
    });
  }

  initAlarmColor() {
    AlarmLevelSetConfig.forEach(item => {
      this.alarmColorObj[item.value] = item;
    });
  }

  /**
   * 显示查询模板
   */
  showSearchList() {
    if (this.indexSearchList.length > 0) {
      if (!this.overlayRef.hasAttached()) {
        this.overlayRef.attach(new TemplatePortal(this.searchTemplate, this.viewContainerRef));
      }
    } else {
      this.overlayRef.detach();
    }
  }

  /**
   * 首页搜索
   */
  searchChange() {
    if (this.searchValue) {
      this.typeLg = JSON.parse(localStorage.getItem('localLanguage'));
      this.indexSearchList = this.findUrl(this.searchValue, this.menuList, []);
      this.showSearchList();
    } else {
      this.indexSearchList = [];
      this.overlayRef.detach();
    }
  }

  /**
   * 查找符合条件的菜单列表
   */
  findUrl(name: string, menuList: Array<any>, arr: Array<any>) {
    for (let i = 0; i < menuList.length; i++) {
    const setName  =  this.typeLg === 'US' ? menuList[i].eName.indexOf(name) >= 0 : menuList[i].menuName.indexOf(name) >= 0;
      if (setName && menuList[i].menuHref && menuList[i].menuHref.length > 6) {
        if (arr.length < 5) {
          arr.push(menuList[i]);
        } else {
          break;
        }
      }
      if (menuList[i].children && menuList[i].children.length > 0) {
        this.findUrl(name, menuList[i].children, arr);
      }
    }
    return arr;
  }

  /**
   * 首页收索跳转
   * param url
   */
  linkTo(url) {
    this.overlayRef.detach();
    this.$router.navigate([url]).then();
  }

  clickSearchItem(url, name) {
    this.searchValue = name;
    this.linkTo(url);
  }

  /**
   * 创建收索模板链接
   */
  createOverlayRef() {
    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.searchInput).withPositions([{originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top'}]);
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: strategy
    });
    // 当点击其他位置时隐藏处理
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.detach();
    });
  }

  /**
   * 初始化显示配置
   */
  initDisplaySettings() {
    if (localStorage.getItem('displaySettings') !== 'undefined') {
      this.displaySettings = JSON.parse(localStorage.getItem('displaySettings'));
    }
    if (this.displaySettings && this.displaySettings.systemLogo === 'local') {
      delete this.displaySettings.systemLogo;
    }
    // 将系统logo转成base64位
    const url = this.displaySettings.systemLogo || '../../assets/img/layout/FiLink_logo1.png';
    CommonUtil.getUrlBase64(url, (res) => {
      this.logoUrl = res;
    });
  }

  /**
   * 查询密码安全策略
   */
  queryPasswordSecurity() {
    this.$securityPolicyService.queryPasswordSecurity().subscribe((res: Result) => {
      this.passwordCheckObj = res.data;
    });
  }

  /**
   * 点击跳转首页
   */
  goIndex() {
    this.navigateToDetail(`/business/index`);
  }

  /**
   * 获取语言设置
   */
  queryLanguage() {
    this.$systemParameterService.queryLanguage().subscribe((result: Result) => {
      this.languageAll = result.data;
      this.languageAll.map(item => {
        item.label = item.languageName;
        item.value = item.languageType;
      });
    });
  }


  /**
   * 路由跳转
   */
  private navigateToDetail(url, extras = {}) {
    this.$router.navigate([url], extras).then();
  }

  /**
   * 逐渐销毁时 清除定时器
   */
  ngOnDestroy() {
    // 清理缓存
    localStorage.removeItem('userName');
    clearInterval(this.loginTimer);
    if (this.queryAlarmCountTimer) {
      clearInterval(this.queryAlarmCountTimer);
    }
    // 关闭所有的模态框
    this.$nzModalService.closeAll();
    this.loginTimer = null;
    this.queryAlarmCountTimer = null;
  }
}
