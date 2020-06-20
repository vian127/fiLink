import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import 'ztree';
import {TreeSelectorConfig} from '../../entity/treeSelectorConfig';
import {PageBean} from '../../entity/pageBean';
import {TableComponent} from '../table/table.component';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {CommonUtil} from '../../util/common-util';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';

declare var $: any;

/**
 * 树选择器
 */
@Component({
  selector: 'xc-tree-selector',
  templateUrl: './tree-selector.component.html',
  styleUrls: ['./tree-selector.component.scss']
})
export class TreeSelectorComponent implements OnInit, OnChanges, AfterViewInit {
  // 树选择器配置
  @Input()
  treeSelectorConfig: TreeSelectorConfig = new TreeSelectorConfig();
  // 显示隐藏变化
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 选择数据变化
  @Output() selectDataChange = new EventEmitter<any[]>();
  // 是否隐藏按钮
  @Input() isHiddenButton = false;
  // 树回调
  @Input()
  treeCallback: any;
  // table实例
  @ViewChild(TableComponent) childCmp: TableComponent;
  // 树实例
  treeInstance: any;
  // 搜索的值
  searchValue = '';
  // 搜索的结果
  searchResult: any[] = [];
  // 选择的数据
  selectData: any[] = [];
  // 选择数据分页结果
  selectPageData = [];
  // 选择的数据分页
  selectPageBean: PageBean = new PageBean(6, 1, 0);
  data: any[] = [];
  // 树设置
  settings = {
    callback: {
      onCheck: (event, treeId, treeNode) => {
        this.selectData = this.getTreeCheckedNodes();
        this.refreshSelectPageData();
      },
      beforeCheck: (treeId, treeNode) => {
        if (this.treeCallback && this.treeCallback.beforeCheck) {
          return this.treeCallback.beforeCheck(treeId, treeNode);
        } else {
          return true;
        }
      }
    },
  };
  // 选择器配置
  selectorConfig;
  // 被选总数
  treeNodeSum = 0;
  // 第一次被选数据
  private firstSelectData: any[];
  // form语言包
  public language: any;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 树id
  treeId;
  // 搜索框配置
  selectInfo = {
    data: [],
    label: 'label',
    value: 'code'
  };

  constructor(private $i18n: NzI18nService, private $message: FiLinkModalService) {
  }

  _xcVisible = false;

  get xcVisible() {
    return this._xcVisible;
  }

  @Input()
  set xcVisible(params) {
    this._xcVisible = params;
    this.xcVisibleChange.emit(this._xcVisible);
  }

  ngOnInit() {
    this.language = this.$i18n.getLocaleData('form');
    this.commonLanguage = this.$i18n.getLocaleData('common');
    this.treeId = CommonUtil.getUUid();
    this.selectorConfig = {
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: false,
      searchTemplate: null,
      scroll: {x: '440px', y: '310px'},
      noAutoHeight: true,
      columnConfig: [
        {type: 'select'}
      ].concat(this.treeSelectorConfig.selectedColumn),
      showPagination: false,
      bordered: false,
      showSearch: false,
      showSizeChanger: false,
      handleSelect: (data, currentItem) => {
        // 点击列表某一个checkbox
        if (currentItem) {
          // 如果去选拦截先做一道拦截
          if (this.treeCallback && this.treeCallback.beforeTableCheck) {
            this.treeCallback.beforeTableCheck([currentItem.id]).then(res => {
              // 有工单或者告警转工单规则 不能去选择
              if (res) {
                this.$message.error(this.$message.language.accountabilityUnitCheckMsg);
                this.restoreSelected();
              } else {
                this.deleteSomeOne(currentItem);
              }
            }, () => {
            }).catch();
          } else {
            this.deleteSomeOne(currentItem);
          }
        //  去选右边所有的
        } else if (data && data.length === 0) {
          // 如果去选拦截先做一道拦截
          if (this.treeCallback && this.treeCallback.beforeTableCheck) {
            const arr = this.selectData.map(item => item.id);
            this.treeCallback.beforeTableCheck(arr).then(res => {
              // 有工单或者告警转工单规则 不能去选择
              if (res) {
                this.$message.error(this.$message.language.accountabilityUnitCheckMsg);
                this.restoreSelected();
              } else {
                this.deleteAll();
              }
            }, () => {
            }).catch();
          } else {
            this.deleteAll();
          }
        }
      }
    };
  }

  /**
   * 删除右边列表的某一项
   * param currentItem
   */
  deleteSomeOne(currentItem) {
    // 找到要删除的项目
    const index = this.selectData.findIndex(item => item.id === currentItem.id);
    this.selectData.splice(index, 1);
    // 删除完刷新被选数据
    this.childCmp.checkStatus();
    this.refreshSelectPageData();
    this.data.forEach(item => {
      if (item.id === currentItem.id) {
        item.checked = false;
      }
    });
    this.treeInstance.checkNode(currentItem, false, true);
  }

  /**
   * 删除右边列表的全部
   */
  deleteAll() {
    this.selectData = [];
    this.refreshSelectPageData();
    this.treeInstance.checkAllNodes(false);
  }

  /**
   * 重新回到选中状态
   */
  restoreSelected() {
    this.selectData.forEach(item => {
      item.checked = true;
    });
    this.childCmp.checkStatus();
  }

  handleCancel() {
    this.xcVisible = false;
  }

  handleOk() {
    this.selectDataChange.emit(this.selectData);
    this.handleCancel();
  }

  search() {
    if (this.searchValue) {
      const node = this.treeInstance.getNodesByParamFuzzy(this.treeSelectorConfig.treeSetting.data.key.name || 'name',
        this.searchValue, null);
      // this.searchResult = this.treeInstance.transformToArray(node);
      this.searchResult = node;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.xcVisible.currentValue) {
      this.searchValue = null;
      $.fn.zTree.init($(`#${this.treeId}`),
        Object.assign(this.treeSelectorConfig.treeSetting, this.settings),
        this.treeSelectorConfig.treeNodes);
      this.treeInstance = $.fn.zTree.getZTreeObj(this.treeId);
      if (this.treeInstance) {
        let nodes = [];
        if (this.treeSelectorConfig.onlyLeaves) {
          nodes = this.treeInstance.getNodesByFilter((node) => {
            return (!node.isParent);
          });
        } else {
          nodes = this.treeInstance.getNodes();
        }
        this.treeNodeSum = this.treeInstance.transformToArray(nodes).length;
        this.firstSelectData = this.getTreeCheckedNodes();
        if (this.firstSelectData.length > 0) {
          this.firstSelectData.forEach(item => {
            this.treeInstance.selectNode(item);
          });
        }
        this.selectData = this.firstSelectData;
        this.refreshSelectPageData();
      }
    }
  }

  ngAfterViewInit(): void {
  }

  /**
   * 为了阻止事件冒泡
   * param event
   */
  click(event) {
    event.stopPropagation();
  }

  /**
   * 定位到某一条
   * param item
   */
  selectNode(item) {
    this.treeInstance.selectNode(item);
  }

  /**
   * 刷新数据
   */
  refreshSelectPageData() {
    this.selectPageBean.pageSize = this.selectData.length;
    this.selectPageBean.Total = this.selectData.length;
    // 不需要分页
    // this.selectPageData = this.selectData.slice(this.selectPageBean.pageSize * (this.selectPageBean.pageIndex - 1),
    //   this.selectPageBean.pageIndex * this.selectPageBean.pageSize);
  }

  /**
   * 左边表格数据变化
   * param event
   */
  selectPageChange(event) {
    this.selectPageBean.pageIndex = event.pageIndex;
    this.selectPageBean.pageSize = event.pageSize;
    // 不需要分页
    // this.selectPageData = this.selectData.slice(this.selectPageBean.pageSize * (this.selectPageBean.pageIndex - 1),
    //   this.selectPageBean.pageIndex * this.selectPageBean.pageSize);
  }

  /**
   * 清空数据
   */
  restSelectData() {
    this.searchValue = null;
    this.selectData = this.firstSelectData;
    this.refreshSelectPageData();
    this.treeInstance.checkAllNodes(false);
    this.firstSelectData.forEach(item => {
      this.treeInstance.checkNode(item, true, false);
    });
  }

  /**
   * 获取选中的节点
   */
  getTreeCheckedNodes() {
    let checkedNodes = [];
    // 只选中叶子
    if (this.treeSelectorConfig.onlyLeaves) {
      checkedNodes = this.treeInstance.getNodesByFilter((node) => {
        return (!node.isParent && node.checked);
      });
    } else {
      checkedNodes = this.treeInstance.getCheckedNodes(true);
    }
    return checkedNodes;
  }

  /**
   * 键盘弹起事件
   * param event
   */
  onInputKeyUp(event) {
    if (event.keyCode === 13) {
      this.search();
      const a = document.getElementById('searchDropDown') as any;
      const obj = document.createEvent('MouseEvents');
      obj.initMouseEvent('click', true,
        true, window, 1, 12,
        345, 7, 220,
        false, false, true, false, 0, null);
      a.dispatchEvent(obj);
    }
  }

  /**
   *用于父组件调用设置被选择的节点
   * param node
   * param {any} checked
   * param {any} checkTypeFlag
   * param {any} callbackFlag
   */
  checkNode(data, checked, checkTypeFlag, callbackFlag) {
    data.forEach(item => {
      const node = this.treeInstance.getNodesByParam(this.treeSelectorConfig.treeSetting.data.simpleData.idKey, item, null);
      this.treeInstance.checkNode(node, checked, checkTypeFlag, callbackFlag);
    });
  }

  // modelChange(event) {
  //   this.search();
  //   const a = document.getElementById('searchDropDown')as any;
  //   const obj = document.createEvent('MouseEvents');
  //   obj.initMouseEvent('click', true,
  //     true, window, 1, 12,
  //     345, 7, 220,
  //     false, false, true, false, 0, null);
  //   a.dispatchEvent(obj);
  // }

  modelChange(event) {
    const node = this.treeInstance.getNodeByParam(this.treeSelectorConfig.treeSetting.data.simpleData.idKey, event, null);
    this.treeInstance.selectNode(node);
  }

  inputChange(event) {
    this.searchValue = event;
    if (event) {
      const node = this.treeInstance.getNodesByParamFuzzy(this.treeSelectorConfig.treeSetting.data.key.name || 'name',
        event, null);
      this.selectInfo = {
        data: node,
        label: this.treeSelectorConfig.treeSetting.data.key.name || 'name',
        value: this.treeSelectorConfig.treeSetting.data.simpleData.idKey || 'id'
      };
    } else {
      this.selectInfo = {
        data: [],
        label: this.treeSelectorConfig.treeSetting.data.key.name || 'name',
        value: this.treeSelectorConfig.treeSetting.data.simpleData.idKey || 'id'
      };
    }

  }
}
