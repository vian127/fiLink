import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {FacilityName} from '../../util/facility-name';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../../../shared-module/util/common-util';

/**
 * 设施类型组件
 */
@Component({
  selector: 'app-facility-type',
  templateUrl: './facility-type.component.html',
  styleUrls: ['./facility-type.component.scss']
})
export class FacilityTypeComponent extends FacilityName implements OnInit {
  // 设施类型回传
  @Output() facilityTypeEvent = new EventEmitter();
  // 列表
  public list = [];
  // 设施类型是否全选
  public isFacilityTypeAllChecked;
  // 所有设施类型图表类
  public allFacilityIconClass;
  // 所有设施类型对应的数量
  public countObj = {};
  constructor(private $mapStoreService: MapStoreService,
              public $nzI18n: NzI18nService,
              ) {
    super($nzI18n);
  }

  ngOnInit() {
    this.allFacilityIconClass = CommonUtil.getFacilityIconClassName('0');
    this.initData();
  }

  /**
   * 初始化数据
   */
  initData() {
    this.list = this.$mapStoreService.facilityTypeList.map(item => {
      item.iconClass = CommonUtil.getFacilityIconClassName(item.value);
      return item;
    });
    this.isFacilityTypeAllChecked = this.list.every(item => item.checked);
    this.showCount();
  }

  /**
   * 关闭
   */
  fold() {
    this.facilityTypeEvent.emit({type: 'close'});
  }

  /**
   * 显示每个类型设施对应的数目
   */
  showCount() {
    const _countObj = {};
    // 拿到地图缓存的数据
    for (const [key, value] of this.$mapStoreService.mapData) {
      if (value['isShow']) {
        const facility = value['info'];
        if (!_countObj[facility['deviceType']]) {
          _countObj[facility['deviceType']] = 0;
        }
        _countObj[facility['deviceType']]++;
      }
    }
    this.countObj = Object.assign(_countObj, {});
    // 设施总数
    let sum = 0;
    this.list.forEach(_type => {
      if (this.countObj[_type.value]) {
        sum += this.countObj[_type.value];
      }
    });
    this.countObj['0'] = sum;
  }

  /**
   * 设施类型过滤
   * event
   * id
   */
  facilityTypeChange(event, id) {
    const arr = [];
    if (id === 0) {
      if (event) {  // 全选
        this.list.forEach(item => {
          item.checked = true;
        });
      } else {  // 全不选
        this.list.forEach(item => {
          item.checked = false;
        });
      }
    } else {
      this.isFacilityTypeAllChecked = this.list.every(item => item.checked);
    }
    this.list.forEach(item => {
      if (item.checked) {
        arr.push(item.value + '');
      }
    });
    this.$mapStoreService.facilityTypeList = this.list;
    this.facilityTypeEvent.emit({type: 'update'});
  }

  openFacilityTypeSetting() {
    this.facilityTypeEvent.emit({type: 'setting'});
  }
}
