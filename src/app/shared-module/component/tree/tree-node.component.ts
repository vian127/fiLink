import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TreeNode} from './tree-node';
import {Tree, TreeOptions} from './tree';

/**
 * 树节点组件
 */
@Component({
  selector: 'xc-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent implements OnInit {
  @Input()
  data: TreeNode[];
  @Input()
  option;
  @Output()
  clickTreeNode = new EventEmitter();
  @Output()
  dblClickTreeNode = new EventEmitter();
  @Output()
  treeInstance = new EventEmitter();

  constructor() {
  }

  ngOnInit() {

  }

  toggleStatus(event, treeNode) {
    event.stopPropagation();
    treeNode.isExpanded = !treeNode.isExpanded;
  }

  clickNode(event, item) {
    event.stopPropagation();
    // item.isExpanded = !item.isExpanded;
    this.clickTreeNode.emit(item);
  }

  dblClickNode(event, item) {
    event.stopPropagation();
    this.dblClickTreeNode.emit(item);
  }

  _clickCheckBox(event, item: TreeNode) {
    item.isChecked = !item.isChecked;
    item.isHalfChecked = false;
    event.stopPropagation();
    if (item.children) {
      item.setChildrenOption('isChecked', item.isChecked);
      item.setChildrenOption('isHalfChecked', false);
    }
    if (item.parent) {
      (function setParentSelectAll(treeNode) {
        // 全选
        if (treeNode.children.every(_item => _item.isChecked && !_item.isHalfChecked)) {
          treeNode.isChecked = true;
          treeNode.isHalfChecked = false;
          // 有一个选择了
        } else if (treeNode.children.some(_item => _item.isHalfChecked || _item.isChecked)) {
          treeNode.isChecked = false;
          treeNode.isHalfChecked = true;
          // 全不选
        } else {
          treeNode.isChecked = false;
          treeNode.isHalfChecked = false;
        }
        if (treeNode.parent) {
          setParentSelectAll(treeNode.parent);
        }
      })(item.parent);

    }
  }
}
