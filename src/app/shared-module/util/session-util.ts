import storage from 'localstorage-expires';

/**
 * session工具类
 */
export class SessionUtil {
  /**
   * 获取用户信息
   */
  static getUserInfo() {
    if (localStorage.getItem('userInfo') && localStorage.getItem('userInfo') !== 'undefined') {
      return JSON.parse(localStorage.getItem('userInfo'));
    } else {
      return {};
    }
  }

  /**
   * 获取用户ID
   */
  static getUserId() {
    const userInfo = this.getUserInfo();
    return userInfo.id;
  }

  /**
   * 获取权限ID
   */
  static getRoleId() {
    const userInfo = this.getUserInfo();
    if (userInfo.role) {
      return userInfo.role.id;
    } else {
      return '';
    }
  }

  /**
   * 获取角色名称
   */
  static getRoleName() {
    const userInfo = this.getUserInfo();
    if (userInfo.role) {
      return userInfo.role.roleName;
    } else {
      return '';
    }
  }

  /**
   * 获取token信息
   */
  static getToken() {
    return storage.getItem('token');
  }

  /**
   * 设置token
   * param value
   * param time
   */
  static setToken(value: string, time: number) {
    storage.setItem('token', value, time);
  }

  /**
   * 获取显示配置
   */
  static getDisplaySettings() {
    if (localStorage.getItem('displaySettings') && localStorage.getItem('displaySettings') !== 'undefined') {
      return JSON.parse(localStorage.getItem('displaySettings'));
    } else {
      return {};
    }
  }

  /**
   * 获取消息提醒配置
   */
  static getMsgSetting(): any {
    if (localStorage.getItem('messageNotification') && localStorage.getItem('messageNotification') !== 'undefined') {
      return JSON.parse(localStorage.getItem('messageNotification'));
    } else {
      return {messageRemind: ''};
    }
  }

  /**
   * 推送是否弹框提示 true 为弹框
   * returns {boolean}
   */
  static isMessageNotification(): boolean {
    return this.getMsgSetting().messageRemind === '1';
  }

  /**
   * 获取系统语言环境
   */
  static getLanguage() {
    if (localStorage.getItem('localLanguage')) {
      return JSON.parse(localStorage.getItem('localLanguage'));
    } else {
      return this.getDisplaySettings().systemLanguage;
    }

  }

  /**
   * 判断操作有没有权限
   * param {string} appAccessPermission 权限id
   * returns {boolean}
   */
  static checkHasRole(appAccessPermission: string): boolean {
    // 从用户信息里面获取权限列表
    const userInfo: any = this.getUserInfo();
    let role: any[];
    if (userInfo.role && userInfo.role.permissionList) {
      role = userInfo.role.permissionList.map(item => item.id);
    }
    return role.includes(appAccessPermission);
  }
}
