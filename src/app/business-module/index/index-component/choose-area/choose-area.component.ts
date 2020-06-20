import {Component, OnInit} from '@angular/core';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';

/**
 * 区域选择器 chenzhenyu
 */
@Component({
  selector: 'app-choose-area',
  templateUrl: './choose-area.component.html',
  styleUrls: ['./choose-area.component.scss']
})
export class ChooseAreaComponent implements OnInit {
  public indexLanguage: IndexLanguageInterface;
  title;
  selectInfo = {
    data: [],
    label: 'label',
    value: 'code'
  };
  searchKey;
  treeInstance: any;
  searchResult = [];

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * 搜索框input值变化
   * param event
   */
  inputChange(event) {
    if (event) {
      const node = this.treeInstance.getNodesByParamFuzzy('name',
        event, null);
      this.selectInfo = {
        data: node,
        label: 'name',
        value: 'id'
      };
    } else {
      this.selectInfo = {
        data: [],
        label: 'name',
        value: 'id'
      };
    }

  }

  /**
   * 搜索
   */
  search() {
    const _searchKey = this.searchKey.trim();
    if (this.searchKey) {
      const node = this.treeInstance.getNodesByParamFuzzy('name', _searchKey, null);
      // this.searchResult = this.treeInstance.transformToArray(node);
      this.searchResult = node;
    }
  }
  /**
   * 搜索组件选中某一条
   * param event id
   */
  modelChange(event) {
    const node = this.treeInstance.getNodeByParam('id', event, null);
    this.treeInstance.selectNode(node);
  }
}
