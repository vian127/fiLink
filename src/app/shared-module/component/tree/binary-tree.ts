import {BinaryTreeInterface} from './binary-tree.interface';

/**
 * Created by xiaoconghu on 2018/11/20.
 * 二叉树实现类
 */
export class BinaryTree<T> implements BinaryTreeInterface<T> {
  value: string | number;
  element: T;
  right: BinaryTree<T>; // 大的
  left: BinaryTree<T>; // 小的
  private isDelete: boolean; // 是否被删除

  constructor(value?: string | number, element?: T) {
    this.value = value || null;
    this.element = element || null;
  }

  insertNode(_newNode: T, _value): void {
    if (!this.element && !this.value) {
      this.element = _newNode;
      this.value = _value;
    } else {
      (function _insertNode(node: BinaryTree<T>, value, newNode) {
        if (node.isDelete) {
          throw new Error('节点已被删除');
        }
        if (value > node.value) {
          if (!node.right) {
            node.right = new BinaryTree<T>(value, newNode);
          } else {
            _insertNode(node.right, value, newNode);
          }

        } else {
          if (!node.left) {
            node.left = new BinaryTree<any>(value, newNode);
          } else {
            _insertNode(node.left, value, newNode);
          }

        }
      })(this, _value, _newNode);

    }
  }

  deleteNode(value: string): void {
    this.search(value).isDelete = true;
  }

  search(value, binaryValue = this): BinaryTree<T> {
    if (this.element && this.value && !this.isDelete) {
      return (function _search(_value, binaryItem: BinaryTree<T>) {
        if (_value > binaryItem.value) {
          try {
            binaryItem = binaryItem.right;
            return _search(_value, binaryItem);
          } catch (e) {
            throw new Error('没有找到该值,请确认参数是否错误');
          }
        } else if (_value < binaryItem.value) {
          try {
            binaryItem = binaryItem.left;
            return _search(_value, binaryItem);
          } catch (e) {
            throw new Error('没有找到改值，请确认参数是否错误');
          }
        } else {
          return binaryItem;
        }
      })(value, this);
    } else {
      throw new Error('节点已被删除');
    }
  }

}
