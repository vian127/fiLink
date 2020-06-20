/**
 * Created by xiaoconghu on 2018/11/20.
 */
export interface TreeNodeInterFace {
  id: string;
  title: string;
  children: TreeNodeInterFace[];
  isChecked?: boolean;
  isSelected?: boolean;
  isExpanded?: boolean;
  isSelectable?: boolean;
  isDisabled?: boolean;

}

export interface TreeNodeOptions {
  isDisabled?: boolean;
  isSelectable?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  isChecked?: boolean;
  children: TreeNodeOptions[];
  parent?: TreeNode;
  title: string;
  id: string;
  isHalfChecked?;
  isDisableCheckbox?;

  [ key: string ]: any;
}

export class TreeNode {
  isDisabled?: boolean;
  isSelectable?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  isChecked?: boolean;
  children: TreeNode[];
  parent?: TreeNode;
  title: string;
  id: string;
  isHalfChecked?;
  isDisableCheckbox?;
  [ key: string ]: any;

  constructor(options: TreeNodeOptions, parent?: TreeNode) {
    this.parent = parent;
    this.dataSources = options;
    this.title = options.title;
    this.id = options.id;
    this.children = [];
    this.isHalfChecked = options.isHalfChecked || false;
    this.isDisabled = false;
    this.isExpanded = options.isExpanded || false;
    if (options.children.length > 0) {
      options.children.forEach(item => {
        this.children.push(new TreeNode(item, this));
      });
    }
  }

  setChildrenOption(option, value) {
    (
      function setChildren(treeItemChildren) {
        treeItemChildren.forEach(_item => {
          _item[option] = value;
          if (_item.children.length > 0) {
            setChildren(_item.children);
          }
        });
      }
    )(this.children);
  }

  setParentOption(option, value) {
    (
      function setParent(treeNode: TreeNode) {
        treeNode[option] = value;
        if (treeNode.parent) {
          setParent(treeNode.parent);
        }
      }
    )(this.parent);
  }
}
