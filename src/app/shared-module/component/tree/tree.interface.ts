import {TreeNode} from './tree-node';

/**
 * Created by xiaoconghu on 2018/11/20.
 * 树接口
 */
export interface TreeInterface {
  /**
   * 新增节点
   * param fatherId
   * param {TreeNode} treeNode
   */
  addTreeNode(fatherId, treeNode: TreeNode): void;

  /**
   * 删除节点
   * param {string} id
   */
  deleteTreeNode(id: string): void;

  /**
   * 修改节点
   * param {TreeNode} treeNode
   */
  updateTreeNode(treeNode: TreeNode): void;

  /**
   * 获取节点
   * param {string} id
   * returns {TreeNode}
   */
  getTreeNode(id: string): TreeNode;

  /**
   * 初始化二叉树
   * param {TreeNode[]} data
   */
  initBinaryTree(data: TreeNode[]): void;

  /**
   * 获取所有选中的节点
   * returns {TreeNode[]}
   */
  getTreeDataChecked(): TreeNode[];
}

