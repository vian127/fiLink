import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {fadeIn} from '../../../../shared-module/animations/fadeIn';

@Component({
  selector: 'app-first-menu',
  templateUrl: './first-menu.component.html',
  styleUrls: ['./first-menu.component.scss'],
  animations: [
    fadeIn
  ]
})
export class FirstMenuComponent implements OnInit, AfterViewInit {

  @Input() menuList = [];
  @Input() isCollapsed: boolean;

  // 推送取消事件
  @Output() changeThreeMenu = new EventEmitter();
  // 当前点击菜单
  menuName = '';
  // 一级菜单名称
  firstMenuName = '';
  // 三级菜单
  threeMenu = {};

  menuId = null;
  // 延时处理
  timer = null;
  constructor(private $router: Router) { }

  ngOnInit() {
    const url = `/business${window.location.href.split('business')[1]}`;
    // 防止链接带参数
    this.firstMenuName = '';
    this.menuName = '';
    this.threeMenu = {};
    this.dealHighlight(this.menuList, url.split('?')[0]);
    if (this.menuName) {
      this.changeThreeMenu.emit(this.threeMenu);
    } else {
      this.changeThreeMenu.emit({});
    }
    this.$router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.firstMenuName = '';
        this.menuName = '';
        this.threeMenu = {};
        // 防止链接带参数
        this.dealHighlight(this.menuList, event.url.split('?')[0]);
      }
      if (this.menuName) {
        this.changeThreeMenu.emit(this.threeMenu);
      } else {
        this.changeThreeMenu.emit({});
      }
    });
  }

  ngAfterViewInit(): void {

  }

  /**
   * 路由跳转
   * param item
   */
  itemClick(item, menuName) {
    this.menuName = item.menuName;
    if (item.children && item.children.length > 0) {
      this.firstMenuName = menuName;
      // 默认跳转三级菜单
      this.$router.navigate([item.children[0].menuHref]).then();
      this.changeThreeMenu.emit(item);
    } else {
      this.changeThreeMenu.emit({});
      // 判断是不是一级菜单  主要用于菜单收起是背景颜色控制
      if (!item.parentMenuId) {
        this.firstMenuName = item.menuName;
      } else {
        this.firstMenuName = menuName;
      }
      this.$router.navigate([item.menuHref]).then();
    }
  }

  /**
   * 展开事件
   * param item
   */
  expandItem(item) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.menuId !== item.menuId) {
        this.menuId = item.menuId;
        const nodes = JSON.parse(JSON.stringify(this.menuList));
        for (let i = 0 ; i < nodes.length; i++) {
          if (nodes[i].menuId === item.menuId) {
            nodes[i].expand = true;
          } else {
            nodes[i].expand = false;
          }
        }
        this.menuList = nodes;
      }
    }, 300);

  }

  /**
   * 根据菜单处理高亮
   * param url
   */
  dealHighlight(menuList, url) {
    for (let i = 0; i < menuList.length; i++) {
      if (menuList[i].menuHref === url) {
        if (menuList[i].menuLevel === 1) {
          this.firstMenuName = menuList[i].menuName;
          this.menuName = menuList[i].menuName;
        } else if (menuList[i].menuLevel === 2) {
          this.firstMenuName = (this.findMenuInfoByID(this.menuList, menuList[i].parentMenuId)).menuName;
          this.menuName = menuList[i].menuName;
        } else {
          const menu = this.findMenuInfoByID(this.menuList, menuList[i].parentMenuId);
          this.firstMenuName = (this.findMenuInfoByID(this.menuList, menu.parentMenuId)).menuName;
          this.menuName = menu.menuName;
          this.threeMenu = menu;
        }
      } else if (menuList[i].children && menuList[i].children.length > 0) {
        this.dealHighlight(menuList[i].children, url);
      }
    }
  }

  /**
   * 根据id查找菜单
   * param menuList
   * param id
   */
  findMenuInfoByID(menuList, id) {
    let menuInfo = null;
    for (let i = 0; i < menuList.length; i++) {
      if (menuList[i].menuId === id) {
        menuInfo = menuList[i];
        break;
      } else if (menuList[i].children && menuList[i].children.length > 0) {
        if (!menuInfo) {
          menuInfo = this.findMenuInfoByID(menuList[i].children, id);
        }
      }
    }
    return menuInfo;
  }
}
