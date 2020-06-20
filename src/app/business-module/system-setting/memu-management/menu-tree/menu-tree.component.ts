import {Component, Input, OnInit} from '@angular/core';
import {MenuTreeOperateService} from './menu-tree-operate.service';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {NzI18nService} from 'ng-zorro-antd';

@Component({
  selector: 'app-menu-tree',
  templateUrl: './menu-tree.component.html',
  styleUrls: ['./menu-tree.component.scss']
})
export class MenuTreeComponent implements OnInit {
  // 节点
  @Input() nodes;
  // 国际化
  public indexLanguage: IndexLanguageInterface;

  constructor(
    public $nzI18n: NzI18nService,
    private $menuTreeOperateService: MenuTreeOperateService
  ) { }

  ngOnInit() {
    this.indexLanguage =  this.$nzI18n.getLocaleData('index');
  }

  /**
   * 节点上移
   * param node
   */
  moveUp(node) {
    this.nodes = this.$menuTreeOperateService.treeNodeUp(JSON.parse(JSON.stringify(this.nodes)), node);
  }

  /**
   * 节点下移
   * param node
   */
  moveDown(node) {
    this.nodes = this.$menuTreeOperateService.treeNodeDown(JSON.parse(JSON.stringify(this.nodes)), node);
  }

  /**
   * 当前节点的显示隐藏
   * param node
   */
  isShow(node) {
    this.nodes = this.$menuTreeOperateService.showStateChange(JSON.parse(JSON.stringify(this.nodes)), node.origin.menuId);
    this.$menuTreeOperateService.treeNode = [];
  }

  /**
   * 返回当前树结构
   */
  getTree() {
    return this.nodes;
  }
}
