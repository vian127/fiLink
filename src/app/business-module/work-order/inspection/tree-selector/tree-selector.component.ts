import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import 'ztree';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';

declare var $: any;

/**
 * 树选择器
 */
@Component({
  selector: 'xc-list-tree-selector',
  templateUrl: './tree-selector.component.html',
  styleUrls: ['./tree-selector.component.scss']
})
export class TreeListSelectorComponent implements OnInit, OnChanges, AfterViewInit {
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
  @Input() treeCallback: any;
  // table实例
  @ViewChild(TableComponent) childCmp: TableComponent;
  // 树实例
  public treeInstance: any;
  // 搜索的值
  public searchValue = '';
  // 搜索的结果
  public searchResult: any[] = [];
  // 选择的数据
  public selectData: any[] = [];
  // 选择数据分页结果
  selectPageData = [];
  // 选择的数据分页
  public selectPageBean: PageBean = new PageBean(6, 1, 0);
  public data: any[] = [];
  // 树设置
  public treeSettings = {
    callback: {
      onClick: (event, treeId, treeNode) => {
        this.selectData = this.getTreeCheckedNodes(treeNode);
        this.refreshSelectPageData();
      },
      beforeClick: (treeId, treeNode) => {
        /*if (this.treeCallback && this.treeCallback.beforeCheck) {
          return this.treeCallback.beforeCheck(treeId, treeNode);
        } else {
          return true;
        }*/
      }
    },
  };
  // 选择器配置
  public selectorConfig;
  // 被选总数
  public treeNodeSum = 0;
  // 第一次被选数据
  private firstSelectData: any[];
  // form语言包
  public language: any;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  public InspectionLanguage: InspectionLanguageInterface; // 国际化
  // 树id
  public treeId;
  // 搜索框配置
  public selectInfo = {
    data: [],
    label: 'label',
    value: 'code'
  };
  public treeTitle = 'Check List';
  constructor(private $i18n: NzI18nService, private $message: FiLinkModalService) {
  }

  listVisible = false;

  get xcVisible() {
    return this.listVisible;
  }

  @Input()
  set xcVisible(params) {
    this.listVisible = params;
    this.xcVisibleChange.emit(this.listVisible);
  }

  ngOnInit() {
    this.language = this.$i18n.getLocaleData('form');
    this.commonLanguage = this.$i18n.getLocaleData('common');
    this.InspectionLanguage = this.$i18n.getLocaleData('inspection');
    this.treeId = CommonUtil.getUUid();
    this.loadComponent();
  }

  /**
   * 加载组件
   */
  loadComponent() {
    this.selectorConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      searchTemplate: null,
      scroll: {x: '440px', y: '310px'},
      noAutoHeight: true,
      columnConfig: this.setTableColumn(),
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
                this.deleteSomeColumn(currentItem);
              }
            }, () => {
            }).catch();
          } else {
            this.deleteSomeColumn(currentItem);
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
   * 表格列
   */
  setTableColumn() {
    const list = [
      {type: 'select', width: 62},
      { title: this.InspectionLanguage.inspectionItem + this.InspectionLanguage.deviceName, key: 'deptName', width: 120},
      { title: this.InspectionLanguage.isPass, key: 'deptLevel', width: 100},
      { title: this.InspectionLanguage.remark, key: 'id'},
    ];
    return list;
  }
  /**
   * 删除右边列表的某一项
   * param currentItem
   */
  deleteSomeColumn(currentItem) {
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

  handleSure() {
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
        Object.assign(this.treeSelectorConfig.treeSetting, this.treeSettings),
        this.treeSelectorConfig.treeNodes);
      this.treeInstance = $.fn.zTree.getZTreeObj(this.treeId);
      if (this.treeInstance) {
        let treeNodes = [];
        /*if (this.treeSelectorConfig.onlyLeaves) {
          treeNodes = this.treeInstance.getNodesByFilter((node) => {
            return (!node.isParent);
          });
        } else {
          treeNodes = this.treeInstance.getNodes();
        }*/
        treeNodes = this.treeInstance.getNodes();
        this.treeNodeSum = this.treeInstance.transformToArray(treeNodes).length;
        this.firstSelectData = this.getTreeCheckedNodes(treeNodes[0]);
        this.selectNode(treeNodes[0]);
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
  selectPageValueChange(event) {
    this.selectPageBean.pageIndex = event.pageIndex;
    this.selectPageBean.pageSize = event.pageSize;
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
  getTreeCheckedNodes(treeNode) {
    const checkedNodes = [];
    // 只选中叶子
    /*if (this.treeSelectorConfig.onlyLeaves) {
      checkedNodes = this.treeInstance.getNodesByFilter((node) => {
        return (!node.isParent && node.checked);
      });
    } else {
      checkedNodes = this.treeInstance.getCheckedNodes(true);
    }*/
    checkedNodes.push({
      'deptName': treeNode.deptName,
      'deptLevel': treeNode.deptLevel,
      'remark': treeNode.remark
    });
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

  modelValueChange(event) {
    const node = this.treeInstance.getNodeByParam(this.treeSelectorConfig.treeSetting.data.simpleData.idKey, event, null);
    this.treeInstance.selectNode(node);
  }

  inputValueChange(event) {
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
