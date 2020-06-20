/**
 * Created by xiaoconghu on 2018/11/26.
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tree, TreeOptions} from './tree';

/**
 * 树组件
 */
@Component({
  selector: 'xc-tree',
  template: `
    <ng-container>
      <xc-tree-node [data]="tree.data" [option]="option" (clickTreeNode)="clickTreeNode.emit($event)"
                    (dblClickTreeNode)="dblClickTreeNode.emit($event)"></xc-tree-node>
    </ng-container>

  `
})
export class TreeComponent implements OnInit {
  @Input()
  data;
  @Input()
  option = new TreeOptions();
  tree: Tree;
  @Output()
  treeInstance = new EventEmitter();
  @Output()
  dblClickTreeNode = new EventEmitter();
  @Output()
  clickTreeNode = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
    this.tree = new Tree(this.data, this.option);
    this.treeInstance.emit(this.tree);
  }
}
