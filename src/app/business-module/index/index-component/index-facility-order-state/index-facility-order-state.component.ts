import {AfterContentInit, Component, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {index_order_state_type} from '../../shared/const/index-const';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';

/**
 * 工单类型
 */
@Component({
  selector: 'app-index-facility-order-state',
  templateUrl: './index-facility-order-state.component.html',
  styleUrls: ['./index-facility-order-state.component.scss']
})
export class IndexFacilityOrderStateComponent implements OnInit, AfterContentInit {
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 设施设备类型枚举
  public OrderStateAndTypeEnum = index_order_state_type;
  // 工单状态是否全选
  public isWorkOrderTypeAllChecked: boolean;
  // 是否展开工单状态和类型
  public isExpandOrderStateAndType = true;
  // 工单类型是否全选
  public isOrderStateAllChecked = true;
  // 默认选中的工单状态
  public orderTypeRadioValue = '1';
  // 工单状态列表
  public WorkOrderTypeList = [
    {value: '1', label: '待指派', checked: true, count: '0', iconClass: 'iconfont facility-icon fiLink-outDoorCabinet outDoorCabinet-color'},
    {value: '2', label: '待处理', checked: true, count: '0', iconClass: 'iconfont facility-icon fiLink-outDoorCabinet outDoorCabinet-color'},
    {value: '3', label: '处理中', checked: true, count: '0', iconClass: 'iconfont facility-icon fiLink-outDoorCabinet outDoorCabinet-color'},
    {value: '4', label: '已转派', checked: true, count: '0', iconClass: 'iconfont facility-icon fiLink-outDoorCabinet outDoorCabinet-color'},
    {value: '5', label: '已退单', checked: true, count: '0', iconClass: 'iconfont facility-icon fiLink-outDoorCabinet outDoorCabinet-color'},
  ];

  // 工单状态列表
  public WorkOrderStateList = [
    {value: '1', label: '巡检', checked: true, count: '0', iconClass: 'iconfont facility-icon fiLink-outDoorCabinet outDoorCabinet-color'},
    {value: '2', label: '销障', checked: false, count: '0', iconClass: 'iconfont facility-icon fiLink-outDoorCabinet outDoorCabinet-color'},
    {value: '3', label: '告警确认', checked: false, count: '0', iconClass: 'iconfont facility-icon fiLink-outDoorCabinet outDoorCabinet-color'},
    {value: '4', label: '安装', checked: false, count: '0', iconClass: 'iconfont facility-icon fiLink-outDoorCabinet outDoorCabinet-color'},
    {value: '5', label: '拆除', checked: false, count: '0', iconClass: 'iconfont facility-icon fiLink-outDoorCabinet outDoorCabinet-color'},
  ];

  constructor(public $nzI18n: NzI18nService) {
    this.indexLanguage = $nzI18n.getLocaleData('index');
  }

  ngOnInit() {
    this.isWorkOrderTypeAllChecked = true;
  }

  ngAfterContentInit() {
  }

  /**
   * 工单类型CheckBox全/反选
   */
  wordOrderTypeChange(event, id: string = '0') {
    if (id === '0') {
      if (event) {
        // 全选
        this.WorkOrderTypeList.forEach(item => {
          item.checked = true;
        });
      } else {
        // 全不选
        this.WorkOrderTypeList.forEach(item => {
          item.checked = false;
        });
      }
    } else {
      this.isWorkOrderTypeAllChecked = this.WorkOrderTypeList.every(item => item.checked);
    }
  }

  /**
   *  工单状态工单类型选择切换
   */
  tabClick(tabNum: string) {
    if ( tabNum === index_order_state_type.workOrderState) {
      this.isExpandOrderStateAndType = true;
    }
    if ( tabNum === index_order_state_type.workOrderType) {
      this.isExpandOrderStateAndType = false;
    }
  }

}
