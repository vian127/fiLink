/**
 * Created by xiaoconghu on 2018/11/20.
 */
import {TreeNode, TreeNodeOptions} from './tree-node';
import {BinaryTree} from './binary-tree';
import {TreeInterface} from './tree.interface';


export class TreeOptions {
  xcCheckAble?: boolean;
}
/**
 * 树实现类
 */
export class Tree implements TreeInterface {
  public data: TreeNode[] = [];
  private binaryTree: BinaryTree<TreeNode>;
  public xcCheckAble: boolean;

  constructor(data: any, option: TreeOptions = new TreeOptions()) {
    this.xcCheckAble = option.xcCheckAble || false;
    // 包装数据
    this.data = data.map(item => new TreeNode(item));
    // this.data = data;
    // data.forEach(item => {
    //   item = new TreeNode(item);
    //   item.prototype = new TreeNode(item).prototype;
    // });
    // this.data = data;
    this.initBinaryTree(this.data);
  }

  addTreeNode(fatherId, treeNode: TreeNode): void {
    this.binaryTree.search(fatherId).element.parent.push(treeNode);

  }

  deleteTreeNode(id: string): void {
    const father = this.binaryTree.search(id).element.parent;
    const index = father.findIndex(item => item.id === id);
    father.splice(index, 1);
    this.binaryTree.deleteNode(id);

  }

  updateTreeNode(treeNode: TreeNode): void {
    const target = this.binaryTree.search(treeNode.id);
    Object.keys(treeNode).forEach(key => {
      if (key !== 'id') {
        target[key] = treeNode[key];
      }
    });

  }

  getTreeNode(id: string): TreeNode {
    return this.binaryTree.search(id).element;

  }

  getTreeDataChecked(): TreeNode[] {
    const newArr: TreeNode[] = [];
    (function _getTreeDataChecked(data) {
      data.forEach((item: TreeNode) => {
        if (item.isChecked) {
          newArr.push(item);
        }
        if (item.children.length > 0) {
          _getTreeDataChecked(item.children);
        }
      });
    })(this.data);
    return newArr;
  }
  initBinaryTree(data) {
    this.binaryTree = new BinaryTree<TreeNode>();
    const that = this;
    (function insert(_data: TreeNode[]) {
      _data.forEach(item => {
        if (item.children.length > 0) {
          insert(item.children);
        }
        that.binaryTree.insertNode(item, item.id);
      });
    })(data);
  }
}

export class TreeFactory {
  public static makeTree(data: TreeNodeOptions[], option?: TreeOptions) {
    return new Tree(data);
  }
}
