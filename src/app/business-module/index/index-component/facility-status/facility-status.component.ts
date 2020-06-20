import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FacilityName} from '../../util/facility-name';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {NzI18nService} from 'ng-zorro-antd';
/**
 * 设施状态组件
 */
@Component({
  selector: 'app-facility-status',
  templateUrl: './facility-status.component.html',
  styleUrls: ['./facility-status.component.scss']
})
export class FacilityStatusComponent extends FacilityName implements OnInit {
  // 设施状态回传
  @Output() facilityStatusEvent = new EventEmitter();
  // 列表
  public list = [];
  // 设施状态是否全选
  public isFacilityStatusAllChecked;
  constructor(
    private $mapStoreService: MapStoreService,
    public $nzI18n: NzI18nService,
  ) {
    super($nzI18n);
  }

  ngOnInit() {
    this.list = this.$mapStoreService.facilityStatusList;
    this.isFacilityStatusAllChecked = this.list.every(item => item.checked);
  }

  /**
   * 收起设施状态过滤组件
   */
  fold() {
    this.facilityStatusEvent.emit({type: 'close'});
  }

  /**
   * 设施状态过滤
   * event
   */
  facilityStatusChange(event, id) {
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
      this.isFacilityStatusAllChecked = this.list.every(item => item.checked);
    }
    this.$mapStoreService.facilityStatusList = this.list;
    this.facilityStatusEvent.emit({type: 'update'});
  }

}
