import {NzI18nService} from 'ng-zorro-antd';
import {FacilityName} from './facility-name';

/**
 * 操作(显示和隐藏)首页组件
 */
export class MapControl extends FacilityName {
  // 设施过滤组件
  isExpandLeftComponents = false; // 是否展开左侧组件
  isExpandLogicArea = false;      // 是否展开逻辑区域筛选组件
  isExpandFacilityList = false;   // 是否展开设施列表筛选组件
  isExpandMyCollection = false;   // 是否展开我的关注组件
  isExpandTopologicalHigh = false;       // 是否展开拓扑高亮
  isExpandFacilityType = false;   // 是否展开设施类型筛选组件
  isExpandFacilityStatus = false; // 是否展开设施状态筛选组件
  // 点击后的模态框
  isShowFacilityPanel = false;         // 是否展开设施详情面板
  // 模拟鼠标移上去时的提示框
  isShowClustererFacilityTable = false;     // 是否显示聚合点设施详情
  isShowLeftComponents = true;      // 是否显示左侧筛选组件

  // 是否展开批量操作页
  public isShowBatchOperationPanel = false;



  constructor(public $nzI18n: NzI18nService) {
    super($nzI18n);
  }

  /**
   * 展开逻辑区域组件
   */
  expandLogicArea() {
    if (!this.isExpandLogicArea) {
      this.isExpandLogicArea = true;
      this.checkLeftComponents();
    }
  }

  /**
   * 收起逻辑区域组件
   */
  foldLogicArea() {
    if (this.isExpandLogicArea) {
      this.isExpandLogicArea = false;
      this.checkLeftComponents();
    }
  }

  /**
   * 展开设施列表组件
   */
  expandFacilityList() {
    if (!this.isExpandFacilityList) {
      this.isExpandFacilityList = true;
      this.checkLeftComponents();
    }
  }

  /**
   * 收起设施列表组件
   */
  foldFacilityList() {
    if (this.isExpandFacilityList) {
      this.isExpandFacilityList = false;
      this.checkLeftComponents();
    }
  }

  /**
   * 展开我的关注组件
   */
  expandMyCollection() {
    if (!this.isExpandMyCollection) {
      this.isExpandMyCollection = true;
      this.checkLeftComponents();
    }
  }

  /**
   * 收起我的关注组件
   */
  foldMyCollection() {
    if (this.isExpandMyCollection) {
      this.isExpandMyCollection = false;
      this.checkLeftComponents();
    }
  }

  /**
   * 收起拓扑高亮组件
   */
  foldTopoHigh() {
    if (this.isExpandTopologicalHigh) {
      this.isExpandTopologicalHigh = false;
      this.checkLeftComponents();
    }
  }

  /**
   * 展开拓扑高亮组件
   */
  expandTopoHigh() {
    if (!this.isExpandTopologicalHigh) {
      this.isExpandTopologicalHigh = true;
    }
  }
  /**
   * 展开设施类型组件
   */
  expandFacilityType() {
    this.isExpandFacilityType = true;
  }

  /**
   * 收起设施类型组件
   */
  foldFacilityType() {
    this.isExpandFacilityType = false;
  }

  /**
   * 展开设施状态组件
   */
  expandFacilityStatus() {
    this.isExpandFacilityStatus = true;
  }

  /**
   * 收起设施状态组件
   */
  foldFacilityStatus() {
    this.isExpandFacilityStatus = false;
  }

  /**
   * 展开左侧组件
   */
  expandLeftComponents() {
    this.isExpandLeftComponents = true;
  }

  /**
   * 收起左侧组件
   */
  foldLeftComponents() {
    this.isExpandLeftComponents = false;
  }

  /**
   * 显示左侧组件
   */
  showLeftComponents() {
    this.isShowLeftComponents = true;
  }

  /**
   * 隐藏左侧组件
   */
  hideLeftComponents() {
    this.isShowLeftComponents = false;
  }

  /**
   * 左侧组件
   */
  checkLeftComponents() {
    if (this.isExpandLogicArea && this.isExpandFacilityList) {
      this.isExpandLeftComponents = true;
    } else if (!this.isExpandLogicArea && !this.isExpandFacilityList) {
      this.isExpandLeftComponents = false;
    } else {
    }
  }

  /**
   * 显示设施详情面板
   */
  showFacilityPanel() {
    this.isShowFacilityPanel = true;
  }

  /**
   * 隐藏设施详情面板
   */
  hideFacilityPanel() {
    this.isShowFacilityPanel = false;
  }

  /**
   * 点击展开显示聚合点设施详情
   */
  showClustererFacilityTable() {
    this.isShowClustererFacilityTable = true;
  }

  /**
   * 隐藏聚合点设施详情
   */
  hideClustererFacilityTable() {
    this.isShowClustererFacilityTable = false;
  }

  /**
   * 展开收起左侧
   */
  expandAndFoldLeftComponents() {
    this.hideFacilityPanel();
    this.isExpandLeftComponents = !this.isExpandLeftComponents;
    if (this.isExpandLeftComponents) {
      this.expandLogicArea();
      this.expandFacilityList();
    } else {
      this.foldLogicArea();
      this.foldFacilityList();
    }
  }

  /**
   * 展开批量操作
   */
  expandBatchOperationPanel() {
    this.isShowBatchOperationPanel = true;
  }

  /**
   * 关闭批量操作
   */
  closeBatchOperationPanel() {
    this.isShowBatchOperationPanel = false;
  }

}
