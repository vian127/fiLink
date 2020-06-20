/**
 * Created by xiaoconghu on 2020/6/5.
 */
import {GMapBaseService} from './g-map-base.service';
import {MapPlusPointInterface} from '../map-plus-point.interface';
import {MapPlusViewInterface} from '../map-plus-view.interface';
import {MapConfig} from '../../../component/map/g-map.config';

declare const google: any;

export class GMapPlusService extends GMapBaseService implements MapPlusPointInterface, MapPlusViewInterface {

  createPlusMap(documentId: any) {
    this.mapInstance = new google.maps.Map(document.getElementById(documentId), {
      zoom: MapConfig.defaultZoom,
      maxZoom: MapConfig.maxZoom,
      center: {lat: 30, lng: 120},
      mapTypeControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      scaleControl: true,
      streetViewControl: false,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
      },
      fullscreenControl: false,
      clickableIcons: false
    });
  }


  addMarker(marker) {
  }

  addMarkerClusterer(markers, fn?) {
  }

  addOverlay(marker): any {
  }

  clearMarkerMap() {
  }

  createMarker(point, fn?, iconUrl?): any {
  }

  createSize(width, height) {
  }

  getLocation(point, fn?) {
  }

  addLocationSearchControl(id, resultDomId) {
  }


  getMarkerById(id) {
  }

  getMarkerDataById(id) {
  }

  getMarkerMap(): Map<string, any> {
    return undefined;
  }


  hideMarker(id) {
  }

  hideOther(data) {
  }

  locateToUserCity(bol?) {
  }

  markerRedraw() {
  }

  removeOverlay(overlay) {
    overlay.setMap(null);
  }

  searchLocation(key, fn) {
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({'address': key}, fn);
  }

  setCenterPoint(lat?, lng?, zoom?) {
  }


  setIconSize(size) {
  }

  showMarker(id) {
  }

  toggleIcon(url) {
  }

  updateMarker(type, data, fn?) {
  }

  pointToOverlayPixel(lng, lat) {
  }

  addZoomEnd(fn) {
    this.mapInstance.addListener('zoom_changed', fn);
  }
}
