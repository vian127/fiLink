import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {MapSelectorService} from '../../../../../shared-module/component/map-selector/map-selector.service';
import {GMapSelectorService} from '../../../../../shared-module/component/map-selector/g-map-selector.service';

/**
 * 回路详情基础详情模块组件
 */
@Component({
  selector: 'app-loop-basic-details',
  templateUrl: './loop-basic-details.component.html',
  styleUrls: ['./loop-basic-details.component.scss']
})
export class LoopBasicDetailsComponent implements OnInit, AfterViewInit {
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 地图类型
  private mapType: string;
  // 地图服务
  private mapService: MapSelectorService | GMapSelectorService;

  constructor(
    private $nzI18n: NzI18nService,
  ) {
  }

  /**
   *  初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
  }

  /**
   *  页面初始化
   */
  public ngAfterViewInit(): void {
    this.initMap();
  }


  /**
   * 初始化地图
   */
  private initMap(): void {
    // 实例化地图服务类
    if (this.mapType === 'baidu') {
      this.mapService = new MapSelectorService('loopThumbnail', true);
    } else {
      this.mapService = new GMapSelectorService('loopThumbnail', true);
    }

  }

}
