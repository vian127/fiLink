import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import 'ztree';
import {MapService} from '../../../../core-module/api-service/index/map/index';
import {ResultModel} from '../../../../core-module/model/result.model';
import {NzI18nService} from 'ng-zorro-antd';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {IndexApiService} from '../../service/index/index-api.service';
import * as lodash from 'lodash';
import {index_num} from '../../shared/const/index-const';
import {AreaService} from '../../../../core-module/api-service/facility/area-manage';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';

declare var $: any;

/**
 * 选择区域组件
 */
@Component({
  selector: 'app-logic-area',
  templateUrl: './logic-area.component.html',
  styleUrls: ['./logic-area.component.scss']
})
export class LogicAreaComponent implements OnInit, AfterViewInit, OnChanges {
  // treeId名称
  @Input() treeName;
  // tree
  @Input() treeSelectorConfig: TreeSelectorConfig = new TreeSelectorConfig();
  // 判断怎样渲染
  @Input() isShowNoData = false;
  // 区域选择结果
  @Output() areaDataEvent = new EventEmitter();
  // 搜索框组件
  @ViewChild('input') inputElement: ElementRef;
  // tree配置
  setting;
  // tree操作对象
  treeInstance: any;
  // 列表查询条件
  queryConditions = {bizCondition: {level: 1}};
  // 区域选择结果
  areaDataList;
  zNodes = [];
  title;
  language;
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  searchKey;
  searchResult = [];
  selectInfo = {
    data: [],
    label: 'label',
    value: 'code'
  };
  noDataTip;
  public treeNodeSum = 0;
  public selectData: any[] = [];
  private firstSelectData: any[];

  constructor(
    private $mapService: MapService,
    private $nzI18n: NzI18nService,
    private $mapStoreService: MapStoreService,
    private $message: FiLinkModalService,
    private $indexApiService: IndexApiService,
    private $areaService: AreaService
  ) {
  }

  ngOnInit(): void {
    this.language = this.$nzI18n.getLocale();
    // 国际化配置
    this.indexLanguage = this.$nzI18n.getLocaleData('index');
    this.title = this.language.index.selectArea;
    this.noDataTip = this.language.common.noData;
    this.initTreeSetting();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.areaDataList && changes.$mapStoreService.currentValue) {
      this.addTreeData();
    }
  }

  ngAfterViewInit(): void {
    this.$mapStoreService.isInitLogicAreaData ? this.getAllAreaListFromStore() : this.getAllAreaList();
    // 初始化默认区域为全选
    this.clickSelectAll(false);
  }

  /**
   * 初始化tree配置
   */
  initTreeSetting(): void {
    this.setting = {
      check: {
        enable: true,
        chkboxType: {'Y': '', 'N': ''},
        autoCheckTrigger: true
      },
      data: {
        simpleData: {
          enable: true
        }
      },
      view: {
        showIcon: false,
        showLine: false
      },
      callback: {
        beforeClick: (event, treeId, treeNode) => {
        },
        onCheck: (event, treeId, treeNode) => {
          // 获取tree对象
          const treeObj = $.fn.zTree.getZTreeObj(this.treeName);
          // 获取完整树节点
          const list = treeObj.getNodes();
          // 选中结果
          this.areaDataList = this.treeInstance.getCheckedNodes();
          const data = treeObj.getCheckedNodes(true).map(item => {
            return item.areaCode;
          });
          // 存入缓存
          this.setAreaSelectedResults(data);
          this.nodeRecursive(treeObj, list, treeNode);
          this.areaDataShowFacility();
        }
      }
    };
  }

  /***
   * 节点递归
   * param treeObj zTree对象
   * param list 树节点集合
   * param node 当前选中节点
   */
  nodeRecursive(treeObj, list, node?): void {
    list.forEach(item => {
      if (node.level === item.level) {
      } else {
        treeObj.checkNode(item, false, false);
      }
      if (item.children) {
        this.nodeRecursive(treeObj, item.children, node);
      }
    });
  }

  /**
   * 获取区域列表
   */
  getAllAreaList(): void {
    this.$indexApiService.areaListByPage(this.queryConditions).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$mapStoreService.logicAreaList = result.data.map((item, index) => {
          item['checked'] = true;
          return item;
        });
        this.$mapStoreService.chooseAllAreaID = this.$mapStoreService.logicAreaList.filter(item => item.hasPermissions && item.checked)
          .map(item => item.areaId);
        this.addTreeData();
        this.$mapStoreService.isInitLogicAreaData = true;
        // 初始化默认区域为全选
        this.clickSelectAll(true);
      } else {
        this.$message.error(result.msg);
      }
    }, err => {
    });
  }

  /**
   * 缓存中取数据
   */
  getAllAreaListFromStore(): void {
    this.addTreeData();
  }

  /**
   * 区域选中结果存入缓存
   * param data
   */
  setAreaSelectedResults(data): void {
    this.$mapStoreService.areaSelectedResults = data;
  }

  /**
   * 更新区域
   */
  // updateLogicAreaList() {
  //   this.$mapStoreService.logicAreaList = this.treeInstance.transformToArray(this.treeInstance.getNodes()).map(item => {
  //     // 去掉区域中的带小括号的区域数
  //     const name = item.name.replace(/\([^)]*\)/g, '');
  //     return {
  //       areaId: item.id,
  //       areaCode: item.areaCode,
  //       parentAreaId: item.pId,
  //       areaName: name,
  //       areaLevel: item.isParent ? 1 : 0,
  //       checked: item.checked,
  //       hasPermissions: !item.chkDisabled
  //       // open: false
  //     };
  //   });
  //   // this.logicAreaEvent.emit({type: '2', refresh: true});
  // }

  /**
   * 添加数据
   */
  addTreeData() {
    let arr: any[];
    arr = this.$mapStoreService.logicAreaList.map(item => {
      let amountData: any[];
      let newName: string;
      if (this.$mapStoreService.areaDataList) {
        amountData = this.$mapStoreService.areaDataList.filter(items => items.areaId === item.areaId);
        // 拼接区域数据
        if (amountData.length > index_num.numZero) {
          newName = item.areaName;
        } else {
          newName = item.areaName;
        }
      } else {
        newName = item.areaName;
      }

      return ({
        id: item.areaId,
        areaCode: item.areaCode,
        pId: item.parentAreaId,
        name: newName.replace(/\s+/g, ''),  // 去掉空格
        isParent: item.areaLevel === 1,
        checked: false,
        chkDisabled: false
      });
    });
    this.zNodes = [].concat(arr);
    $.fn.zTree.init($(`#${this.treeName}`), this.setting, this.zNodes);
    this.treeInstance = $.fn.zTree.getZTreeObj(this.treeName);

    // 选择子节点
    if (this.treeInstance && this.$mapStoreService.hugeData) {
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
      if (this.firstSelectData.length > index_num.numZero) {
        this.firstSelectData.forEach(item => {
          this.treeInstance.selectNode(item);
        });
      }
      this.selectData = this.firstSelectData;
    }
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
   * 搜索组件选中某一条
   * param event id
   */
  modelChange(event): void {
    const node = this.treeInstance.getNodeByParam('id', event, null);
    this.treeInstance.selectNode(node);
  }

  /**
   * 搜索框input值变化
   * param event
   */
  inputChange(event): void {
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
  search(): void {
    const _searchKey = this.searchKey.trim();
    if (this.searchKey) {
      const node = this.treeInstance.getNodesByParamFuzzy('name', _searchKey, null);
      // this.searchResult = this.treeInstance.transformToArray(node);
      this.searchResult = node;
    }
  }

  /**
   * 选择全部区域
   */
  public clickSelectAll(type): void {
    // 获取tree对象
    const treeObj = $.fn.zTree.getZTreeObj(this.treeName);
    // 获取完整树节点
    if (treeObj) {
      const checkData = this.$mapStoreService.areaSelectedResults;
      const list = treeObj.getNodes();
      if (type === true) {
        list.forEach(item => {
          treeObj.checkNode(item, true, false, true);
        });
      } else if (checkData) {
        list.forEach((item, index) => {
          checkData.forEach(check => {
            if (item.areaCode === check) {
              treeObj.checkNode(item, true, false, true);
            }
          });
        });
      }
    }
  }

  /**
   * 定位到某一条
   * param item
   */
  selectNode(item): void {
    this.treeInstance.selectNode(item);
  }


  /**
   * 防抖
   */
  areaDataShowFacility = lodash.debounce(() => {
    const list = [];
    this.areaDataList.forEach(item => {
      list.push(item.areaCode);
    });
    this.areaDataEvent.emit(list);
  }, 2000, {leading: false, trailing: true});
}
