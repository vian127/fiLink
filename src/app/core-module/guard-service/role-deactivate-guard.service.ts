/**
 * Created by WH1709040 on 2018/2/12.
 */

import {Injectable} from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router';
import {SessionUtil} from '../../shared-module/util/session-util';
import {CommonUtil} from '../../shared-module/util/common-util';
import notNeedPermission from './notNeedPermission';
import {FiLinkModalService} from '../../shared-module/service/filink-modal/filink-modal.service';

@Injectable()
export class RoleDeactivateGuardService implements CanActivate, CanActivateChild {
  // 用户权限列表
  role = [];

  constructor(private router: Router, private $message: FiLinkModalService) {
    // 从用户信息里面获取权限列表
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const menuList = [
      '/business/application/lighting',
      '/business/application/release',
      '/business/application/security',
      '/business/application/strategy',
      '/business/application/strategy/add',
      '/business/application/strategy/edit',
      '/business/application/strategy/details',
      '/business/application/lighting/workbench',
      '/business/application/lighting/equipment-list',
      '/business/application/lighting/policy-control',
      '/business/application/lighting/policy-control/add',
      '/business/application/lighting/policy-control/edit',
      '/business/application/lighting/policy-control/details',
      '/business/application/lighting/report',
      '/business/application/release/workbench',
      '/business/application/release/equipment-list',
      '/business/application/release/policy-control',
      '/business/application/release/policy-control/add',
      '/business/application/release/policy-control/edit',
      '/business/application/release/policy-control/details',
      '/business/application/release/content-list',
      '/business/application/release/content-examine',
      '/business/application/security/workbench',
      '/business/application/security/equipment-list',
      '/business/application/security/policy-control',
      '/business/application/security/policy-control/add',
      '/business/application/security/policy-control/edit',
      '/business/application/security/policy-control/details',
      '/business/application/security/replay-theater',
    ];
    if (SessionUtil.getUserId()) {
      this.getRoleList();
      if (this.checkIsPermission(state.url)) {
        return true;
      } else {
        menuList.forEach(item => this.role.push(item));
        if (CommonUtil.hasRole(this.role, state.url.split('?')[0])) {
          return true;
        } else {
          this.$message.error('您的权限无法查看此页面！');
          // this.router.navigate(['/notfound']).then();
          return false;
        }
        return true;
      }
    }
    this.router.navigate(['/']).then();
    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  getRoleList() {
    // 从用户信息里面获取权限列表
    const userInfo = SessionUtil.getUserInfo();
    if (userInfo.role && userInfo.role.permissionList) {
      const permissionList = userInfo.role.permissionList.filter(item => item.route_url);
      this.role = permissionList.map(item => item.route_url);
    }
  }

  checkIsPermission(url) {
    return notNeedPermission.some(item => url.startsWith(item));
  }
}
