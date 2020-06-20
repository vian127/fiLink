import {AfterContentInit, Component, OnInit} from '@angular/core';
import {FacilityName} from '../util/facility-name';
import {NzI18nService} from 'ng-zorro-antd';
import {index_operational_data_left_panel_item} from '../shared/const/index-const';

/**
 * 运维数据卡片
 */
@Component({
  selector: 'app-index-operational-data',
  templateUrl: './index-operational-data.component.html',
  styleUrls: ['./index-operational-data.component.scss']
})
export class IndexOperationalDataComponent extends FacilityName implements OnInit, AfterContentInit {
  // 首页左侧面板常量
  public indexLeftPanel = index_operational_data_left_panel_item;
  // 是否展开设施设备
  isExpandFacilityList = false;
  // 是否展开我的关注
  isExpandMyCollection = false;
  // 是否展开工单
  isExpandWorkOrder = false;

  constructor(public $nzI18n: NzI18nService,
  ) {
    super($nzI18n);
  }

  ngOnInit() {
  }

  ngAfterContentInit() {

  }

  /**
   * 左侧面板切换
   */
  public tabClick(index): void {
    switch (index) {
      case index_operational_data_left_panel_item.facilitiesList:
        if (this.isExpandFacilityList) {
          this.isExpandFacilityList = false;
        } else {
          this.isExpandFacilityList = true;
          this.isExpandMyCollection = false;
          this.isExpandWorkOrder = false;
        }
        break;
      case index_operational_data_left_panel_item.myCollection:
        if (this.isExpandMyCollection) {
          this.isExpandMyCollection = false;
        } else {
          this.isExpandMyCollection = true;
          this.isExpandFacilityList = false;
          this.isExpandWorkOrder = false;
        }
        break;
      case index_operational_data_left_panel_item.workOrderList:
        if (this.isExpandWorkOrder) {
          this.isExpandWorkOrder = false;
        } else {
          this.isExpandWorkOrder = true;
          this.isExpandMyCollection = false;
          this.isExpandFacilityList = false;
        }
        break;
    }
  }


}
