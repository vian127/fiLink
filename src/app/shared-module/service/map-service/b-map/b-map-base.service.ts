/**
 * Created by xiaoconghu on 2020/6/5.
 */
import {MapBaseAbstract} from '../map-base.abstract';
import {MapConfig as BMapConfig} from './b-map.config';
import {CommonUtil} from '../../../util/common-util';
import {ICON_SIZE} from '../map.config';

declare const BMap: any;
declare const BMapLib: any;
declare const BMAP_ANCHOR_TOP_LEFT: any;
declare const BMAP_ANCHOR_TOP_RIGHT: any;

export class BMapBaseService extends MapBaseAbstract {


  /**
   * 开启滚轮缩放
   */
  enableScroll() {
    this.mapInstance.enableScrollWheelZoom(true);
  }

  createBaseMap(documentId) {
    // 创建Map实例
    this.mapInstance = new BMap.Map(documentId, {enableMapClick: false, maxZoom: BMapConfig.maxZoom});
    // 添加地图类型控件
    const point = new BMap.Point(116.331398, 39.897445);
    this.mapInstance.centerAndZoom(point, 8);
    // 采用v1版本样式配置
    this.mapInstance.setMapStyle({styleJson: []});
  }

  /**
   * 获取缩放大小
   */
  getZoom() {
    return this.mapInstance.getZoom();
  }

  /**
   * 创建点
   * param lng
   * param lat
   * returns {BMap.Point}
   */
  createPoint(lng, lat) {
    return new BMap.Point(lng, lat);
  }

  /**
   * 获取地图相对于网页的偏移
   */
  getOffset() {
    return {
      offsetX: this.mapInstance.offsetX,
      offsetY: this.mapInstance.offsetY,
    };
  }

  /**
   * 通过经纬度设置地图中心点及缩放级别
   * param lng
   * param lat
   * param {number} zoom
   */
  public setCenterAndZoom(lng, lat, zoom?) {
    const point = this.createPoint(lng, lat);
    if (zoom) {
      this.mapInstance.centerAndZoom(point, zoom);
    } else {
      this.mapInstance.setCenter(point);
    }
  }

  setMapTypeId(type) {
  }

  /**
   * 设置缩放级别
   */
  setZoom(zoom) {
    this.mapInstance.setZoom(zoom);
  }

  /**
   * 放大
   */
  zoomIn(level: number = 1) {
    const _zoom = this.getZoom() - level;
    if (_zoom > BMapConfig.maxZoom || _zoom < BMapConfig.minZoom) {
      return;
    }
    this.setZoom(_zoom);
  }

  /**
   * 缩小
   */
  zoomOut(level: number = 1) {
    const _zoom = this.getZoom() + level;
    if (_zoom > BMapConfig.maxZoom || _zoom < BMapConfig.minZoom) {
      return;
    }
    this.setZoom(_zoom);
  }

  createMarker(device) {
    const url = CommonUtil.getFacilityIconUrl(ICON_SIZE, device.deviceType, device.deviceStatus);
    return new BMap.Marker(this.createPoint(device.point.lng, device.point.lat), {
      icon: this.getIcon(url, ICON_SIZE)
    });
  }

  /**
   * 添加覆盖物
   * param marker
   * returns {any}
   */
  addOverlay(marker) {
    this.mapInstance.addOverlay(marker);
  }

  /**
   * 得到图标尺寸
   */
  getIcon(url, size) {
    return new BMap.Icon(url, size);
  }
}
