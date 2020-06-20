import {MapBaseAbstract} from '../map-base.abstract';
import {MapConfig} from '../../../component/map/g-map.config';
import {MapConfig as BMapConfig} from '../../../component/map/b-map.config';

/**
 * Created by xiaoconghu on 2020/6/5.
 */

declare const google: any;
declare const MarkerClusterer: any;

export class GMapBaseService extends MapBaseAbstract {
  mapInstance;

  createBaseMap(documentId) {
    this.mapInstance = new google.maps.Map(document.getElementById(documentId), {
      zoom: MapConfig.defaultZoom,
      maxZoom: MapConfig.maxZoom,
      mapTypeControl: false,
      draggable: false,
      scrollwheel: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      zoomControl: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      scaleControl: false,
      streetViewControl: false,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
      },
      fullscreenControl: false,
      clickableIcons: false
    });
  }

  getOffset() {
    return {
      offsetX: 0,
      offsetY: 0,
    };
  }

  setZoom(zoom) {
    this.mapInstance.setZoom(zoom);
  }

  zoomIn(level: number = 1) {
    const _zoom = this.getZoom() - level;
    if (_zoom >= BMapConfig.maxZoom || _zoom <= BMapConfig.minZoom) {
      return;
    }
    this.setZoom(_zoom);
  }

  zoomOut(level: number = 1) {
    const _zoom = this.getZoom() + level;
    if (_zoom >= BMapConfig.maxZoom || _zoom <= BMapConfig.minZoom) {
      return;
    }
    this.setZoom(_zoom);
  }

  enableScroll() {

  }

  createPoint(lng, lat) {
    return {lat, lng};
  }

  setCenterAndZoom(lng?, lat?, zoom?) {
    const point = this.createPoint(lng, lat);
    if (zoom) {
      this.mapInstance.setZoom(zoom);
    }
    if (point.lat) {
      this.mapInstance.setCenter(point);
    }
  }

  setMapTypeId(type) {
    this.mapInstance.setMapTypeId(type);
  }

  /**
   * 添加覆盖物
   * param marker
   * returns {any}
   */
  addOverlay(marker) {

  }

  createMarker(device) {

  }

  /**
   * 得到图标尺寸
   */
  getIcon(url, size) {
  }
}
