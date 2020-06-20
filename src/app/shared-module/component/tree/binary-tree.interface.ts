/**
 * Created by xiaoconghu on 2018/11/20.
 */
import {BinaryTree} from './binary-tree';

/**
 * 二叉树接口
 */
export interface BinaryTreeInterface<T> {
  value: string | number;
  element: T;
  right: BinaryTreeInterface<T>;
  left: BinaryTreeInterface<T>;

  insertNode(node: T, value): void;

  deleteNode(value: string): void;

  search(node: T, binaryValue?: BinaryTree<T>): BinaryTree<T>;


}



