import {AfterContentInit, AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {index_facility_panel} from '../../shared/const/index-const';
import {Result} from '../../../../shared-module/entity/result';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {MapService} from '../../../../core-module/api-service/index/map';

/**
 * 设施详情卡片
 */
@Component({
  selector: 'app-facility-particulars-card',
  templateUrl: './facility-particulars-card.component.html',
  styleUrls: ['./facility-particulars-card.component.scss']
})
export class FacilityParticularsCardComponent implements OnInit, AfterViewInit, AfterContentInit {
  // 设施id
  @Input() facilityId: string;
  // 设施设备类型id
  @Input() facilityType: string;
  // 权限code
  @Input() facilityPowerCode = [];
  // 是否显示实景图信息
  @Input() isShowBusinessPicture: boolean;
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 设施详情tab页选中的index
  public selectedIndex = index_facility_panel.facilityDetail;
  // 是否显示设施详情tab
  public isShowFacilityDetailTab = true;
  // 是否显示告警tab
  public isShowFacilityAlarmTab = false;
  // 是否显示日志工单tab
  public isShowFacilityLogAndOrderTab = false;
  // 是否显示实景图tab
  public isShowFacilityRealSceneTab = false;
  // 首页设施收藏数据缓存
  public indexMyCollectionCacheData = null;


  constructor(public $nzI18n: NzI18nService,
              private $mapService: MapService) {
    this.indexLanguage = $nzI18n.getLocaleData('index');
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }


  ngAfterContentInit() {
  }

  /**
   * tabs页签选中变更
   */
  public selectedIndexChange(event): void {
    if (event === index_facility_panel.facilityDetail) {
      this.isShowFacilityDetailTab = true;
    } else if (event === index_facility_panel.facilityAlarm) {
      this.isShowFacilityAlarmTab = true;
    } else if (event === index_facility_panel.logAndOrderTab) {
      this.isShowFacilityLogAndOrderTab = true;
    } else if (event === index_facility_panel.RealSceneTab) {
      this.isShowFacilityRealSceneTab = true;
    }
  }

}
