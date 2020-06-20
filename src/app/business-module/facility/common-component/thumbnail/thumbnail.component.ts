import {Component, Input} from '@angular/core';
import {FacilityService} from '../../../../core-module/api-service/facility/facility-manage';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {BMapBaseService} from '../../../../shared-module/service/map-service/b-map/b-map-base.service';
import {GMapBaseService} from '../../../../shared-module/service/map-service/g-map/g-map-base.service';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
export class ThumbnailComponent {

  @Input()
  public deviceId: string;
  @Input()
  public baseInfo: { point?, positionBase: string, deviceType: string, deviceStatus: string };
  // 地图类型
  @Input()
  public mapType: string;
  // 地图服务
  private mapService: BMapBaseService | GMapBaseService;
  // 设施点位置
  private point = {lat: 0, lng: 0};

  constructor(private $facilityService: FacilityService,
              private $modalService: FiLinkModalService,
              private $nzI18n: NzI18nService,
              private $router: Router) {
  }

  /**
   * 点击图标跳转到首页
   */
  public clickMap(): void {
    this.$router.navigate(['/business/index'], {queryParams: {id: this.deviceId}}).then();
  }

  /**
   * 初始化地图
   */
  public initMap(): void {
    // 实例化地图服务类
    if (this.mapType === 'baidu') {
      this.mapService = new BMapBaseService();
    } else {
      this.mapService = new GMapBaseService();
    }
    this.mapService.createBaseMap('thumbnail2');
    this.mapService.enableScroll();
    this.makeMarKer(this.baseInfo);
  }

  /**
   * 添加地图悬浮点
   */
  private makeMarKer(baseInfo: { point?, positionBase: string, deviceType: string, deviceStatus: string }) {
    if (baseInfo.positionBase) {
      const position = baseInfo.positionBase.split(',');
      this.point.lng = parseFloat(position[0]);
      this.point.lat = parseFloat(position[1]);
      baseInfo.point = this.point;
      const marker = this.mapService.createMarker(baseInfo);
      this.mapService.enableScroll();
      this.mapService.setCenterAndZoom(baseInfo.point.lng, baseInfo.point.lat, 12);
      this.mapService.addOverlay(marker);
    }
  }

}
