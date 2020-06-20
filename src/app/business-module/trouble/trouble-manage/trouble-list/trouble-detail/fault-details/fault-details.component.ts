import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { FaultLanguageInterface } from '../../../../../../../assets/i18n/fault/fault-language.interface';
import {MapSelectorService} from '../../../../../../shared-module/component/map-selector/map-selector.service';
import {GMapSelectorService} from '../../../../../../shared-module/component/map-selector/g-map-selector.service';
import {NzI18nService} from 'ng-zorro-antd';
import {TroubleInfo, FacilityInfo} from '../../../../../../core-module/entity/trouble/trouble';
import {FacilityService} from '../../../../../../core-module/api-service/facility/facility-manage';
import {Result} from '../../../../../../shared-module/entity/result';
import {ResultModel} from '../../../../../../core-module/model/result.model';
import {TroubleService} from '../../../../../../core-module/api-service/trouble/trouble-manage';
import {TroubleModel} from '../../../../model/trouble.model';

declare const MAP_TYPE;
@Component({
  selector: 'app-fault-details',
  templateUrl: './fault-details.component.html',
  styleUrls: ['./fault-details.component.scss']
})
export class FaultDetailsComponent implements OnInit, AfterViewInit {
  // 故障信息
  @Input() troubleInfo: any = new TroubleInfo();
  // 告警国际化引用
  public language: FaultLanguageInterface;
  public troubleId: any;
  // 故障类型
  public typeStatus: any = {};
  // 地图类型
  private mapType: string;
  // 地图服务
  private mapService: MapSelectorService | GMapSelectorService;
  // 设施点位置
  private point: any = {lat: 0, lng: 0};
  // 设施信息
  facilityInfo: FacilityInfo = new FacilityInfo();
  // 轮询实例
  private loopTimer;
  constructor(
    public $nzI18n: NzI18nService,
    private $facilityService: FacilityService,
    public $troubleService: TroubleService,
  ) {
    this.language = this.$nzI18n.getLocaleData('fault');
  }
  ngOnInit() {
    this.getTroubleType();
    this.mapType = MAP_TYPE;
    this.getFacilityInfo();
  }
  /**
   *  页面初始化
   */
  ngAfterViewInit(): void {
    this.initMap();
  }
  /**
   * 故障类型
   */
  getTroubleType() {
    this.$troubleService.queryTroubleType().subscribe((res: ResultModel<TroubleModel[]>) => {
      if (res.code === 0) {
        const data = res.data;
        // 故障类型枚举
        if (data && data.length > 0) {
          data.forEach(item => {
            this.typeStatus[item.key] = item.value;
          });
        }
      }
    });
  }
  /**
   * 获取设备信息
   */
  getFacilityInfo() {
    this.$facilityService.queryDeviceById(this.troubleInfo.deviceId).subscribe((result: Result) => {
      if (result.code === 0) {
        this.facilityInfo = result.data;
        // 获取点信息
        if (this.facilityInfo.positionBase) {
          const position = this.facilityInfo.positionBase.split(',');
          const _lng = parseFloat(position[0]);
          const _lat = parseFloat(position[1]);
          this.point.lat = _lat;
          this.point.lng = _lng;
          const marker = this.mapService.createMarker(this.facilityInfo);
          this.mapService.setCenterPoint(this.point.lat, this.point.lng);
          this.mapService.addMarkerMap(marker);
        }
      } else if (result.code === 130204) {
        // this.$modalService.error(result.msg);
        // window.history.go(-1);
      }
      // 开启定时器轮询
      // if (!this.loopTimer) {
      //   this.loopTimer = window.setInterval(() => {
      //     this.getFacilityInfo();
      //   }, 60000);
      // }
    });
  }
  /**
   * 初始化地图
   */
  private initMap() {
    // 实例化地图服务类
    if (this.mapType === 'baidu') {
      this.mapService = new MapSelectorService('thumbnail', true);
    } else {
      this.mapService = new GMapSelectorService('thumbnail', true);
    }

  }
}
