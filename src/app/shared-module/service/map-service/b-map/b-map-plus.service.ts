/**
 * Created by xiaoconghu on 2020/6/5.
 */
import {BMapBaseService} from './b-map-base.service';
import {MapPlusPointInterface} from '../map-plus-point.interface';
import {MapPlusViewInterface} from '../map-plus-view.interface';
import {MapConfig as BMapConfig} from './b-map.config';
import {CommonUtil} from '../../../util/common-util';
import {Observable, Subject} from 'rxjs';
import {DEFAUT_ZOOM} from '../../../component/map-selector/map.config';
import {ICON_SIZE, POINT_SIZE} from '../map.config';

declare const BMap: any;
declare const BMapLib: any;
declare const BMAP_NORMAL_MAP: any;
declare const BMAP_SATELLITE_MAP: any;
declare const BMAP_ANCHOR_BOTTOM_RIGHT: any;

export class BMapPlusService extends BMapBaseService implements MapPlusPointInterface, MapPlusViewInterface {

  // 地图makers Map
  markersMap = new Map();
  // 聚合点对象
  markerClusterer;
  // 图标大小
  iconSize = ICON_SIZE;
  // 区域点大小
  pointSize = POINT_SIZE;
  // 画线
  polyline;
  // 画线的数据
  private polylineData = [];
  // 城市组件状态
  private cityListStatus: Subject<any> = new Subject<any>();
  // 地图的事件
  private mapEvent: Subject<any> = new Subject<any>();

  createPlusMap(documentId) {
    // 创建Map实例
    this.mapInstance = new BMap.Map(documentId, {enableMapClick: false, maxZoom: BMapConfig.maxZoom});
    // 设置缩放级别
    this.setZoom(8);
    // 添加地图类型控件
    this.addMapTypeControl();
    // 启动滚轮缩放
    this.enableScroll();
    // 采用v1版本样式配置
    this.mapInstance.setMapStyle({styleJson: []});
    // 定位到用户城市
    this.locateToUserCity();
  }

  /**
   * 创建marker点
   * param point
   * param fn
   * returns {BMap.Marker}
   */
  createMarker(point, fn?, iconUrl?) {
    let url;
    if (point.deviceType) {
      url = CommonUtil.getFacilityIconUrl(this.iconSize, point.deviceType, point.deviceStatus);
    } else if (point.equipmentType) {
      url = CommonUtil.getEquipmentTypeIconUrl(this.iconSize, point.equipmentType, point.equipmentStatus);
    } else {
      url = `assets/facility-icon/icon_area.png`;
    }
    const icon = this.toggleIcon(url, point.deviceType || point.equipmentType);
    const marker = new BMap.Marker(this.createPoint(point.lng, point.lat), {
      icon: icon
    });
    if (iconUrl === 1) {
      marker.customData = {code: point.code};
      marker.isShow = {areaId: point.areaId};
      marker.allData = point;
      marker.setLabel(this.getPointNumber(point.count));
    } else {
      marker.customData = {id: point.deviceId};
      marker.isShow = {id: point.deviceId};
    }


    if (fn) {
      if (fn.length > 0) {
        fn.forEach(item => {
          marker.addEventListener(item.eventName, item.eventHandler);
        });
      }
    }
    if (iconUrl === 1) {
      this.markersMap.set(point.code, {marker: marker, data: point});
    } else {
      this.markersMap.set(point.deviceId, {marker: marker, data: point});
    }

    return marker;
  }

  /**
   * 添加marker点
   * param point
   * param id
   * param fn
   */
  addMarker(marker) {
    this.markerClusterer.addMarker(marker);
  }

  /**
   * 聚合点
   * param markers
   */
  addMarkerClusterer(markers, fn?) {
    const eventMap = new Map();
    if (fn && fn.length > 0) {
      fn.forEach(item => {
        eventMap.set(item.eventName, item.eventHandler);
      });
    }
    this.markerClusterer = new BMapLib.MarkerClusterer(this.mapInstance, {
      markers: markers,
      hiddenZoom: BMapConfig.hiddenZoom,
      maxZoom: BMapConfig.maxZoom,
      isAverageCenter: true,
    }, (event, data) => {
      if (eventMap.get(event.type)) {
        eventMap.get(event.type)(event, data);
      }
    });
  }

  /**
   * 添加覆盖物
   * param marker
   * returns {any}
   */
  addOverlay(marker) {
    const overlay = new BMap.Marker(marker);
    this.mapInstance.addOverlay(overlay);
    return overlay;
  }

  /**
   * 清空所有缓存数据
   */
  clearMarkerMap() {
    this.markersMap.clear();
  }

  /**
   * 创建图标尺寸
   */
  createSize(width, height) {
    return new BMap.Size(width, height);
  }

  /**
   * 获取定位
   */
  getLocation(point, fn) {
    // 创建地址解析器实例
    const geoCoder = new BMap.Geocoder();
    geoCoder.getLocation(point, fn);
  }

  /**
   * 通过id获取marker
   * param id
   * returns {any}
   */
  getMarkerById(id) {
    if (this.markersMap.get(id)) {
      return this.markersMap.get(id).marker;
    } else {
      return null;
    }
  }

  /**
   * 通过id获取marker对应的数据
   * param id
   */
  getMarkerDataById(id) {
    if (this.markersMap.get(id)) {
      return this.markersMap.get(id).data;
    } else {
      return null;
    }
  }

  /**
   * 获取marker对应的数据
   */
  getMarkerMap(): Map<string, any> {
    return this.markersMap;
  }

  /**
   * 隐藏marker点
   */
  hideMarker(id) {
    this.getMarkerById(id).hide();
    this.getMarkerById(id).isShow = false;
  }

  /**
   * 显示marker
   */
  showMarker(id) {
    this.getMarkerById(id).show();
    this.getMarkerById(id).isShow = true;
  }

  /**
   * 定位到当前城市
   */
  locateToUserCity() {
    const myFun = (result) => {
      const cityName = result.name;
      this.mapInstance.centerAndZoom(cityName);
    };
    const myCity = new BMap.LocalCity();
    myCity.get(myFun);
  }

  /**
   * 聚合点重绘
   */
  markerRedraw() {
    if (this.markerClusterer) {
      this.markerClusterer.redraw();
    }
  }

  /**
   * 清除覆盖物
   * param overlay
   */
  removeOverlay(overlay) {
    this.mapInstance.removeOverlay(overlay);
  }

  setIconSize() {
    const size = this.iconSize.split('-');
    return this.createSize(size[0], size[1]);
  }

  /**
   * 切换图标
   * param url
   * returns {BMap.Icon}
   */
  toggleIcon(url, type?) {
    let size;
    if (type) {
      size = this.iconSize.split('-');
    } else {
      size = this.pointSize.split('-');
    }

    return this.getIcon(url, this.createSize(size[0], size[1]));
  }

  /**
   * 设置中心点
   */
  setCenterPoint(zoom?) {
    const point = CommonUtil.getLatLngCenter(this.getMarkerMap());
    this.setCenterAndZoom(point[1], point[0], zoom || DEFAUT_ZOOM);
  }

  /**
   * 得到图标尺寸
   */
  getIcon(url, size) {
    const icon = new BMap.Icon(url, size);
    icon.setImageSize(size);
    return icon;
  }

  updateMarker(type, data, fn?) {
    if (type === 'add') {
      // 新增
      this.addMarker(this.createMarker(data, fn));
    } else if (type === 'update') {
      // 更新
      const marker = this.getMarkerById(data.deviceId);
      const imgUrl = CommonUtil.getFacilityIconUrl(this.iconSize, data.deviceType, data.deviceStatus);
      const _icon = this.toggleIcon(imgUrl);
      marker.setIcon(_icon);
      marker.show();
      marker.isShow = true;
      this.markersMap.set(data.deviceId, {marker: marker, data: data});
    } else if (type === 'delete') {
      // 删除
      const marker = this.getMarkerById(data.deviceId);
      if (marker) {
        this.markerClusterer.removeMarker(marker);
      }
      this.markersMap.delete(data.deviceId);
    } else if (type === 'hide') {
      // 隐藏
      this.hideMarker(data.deviceId);
    } else if (type === 'show') {
      // 显示
      this.showMarker(data.deviceId);
    } else {
    }
  }

  /**
   * 隐藏其他的marker点
   * param data
   */
  hideOther(data) {
    this.markersMap.forEach((value, key) => {
      if (data.indexOf(key) < 0) {
        value.marker.setVisible(false);
        value.marker.isShow = false;
      }
    });
  }

  /**
   * 添加地图搜索组件
   * param id
   * param resultDomId
   */
  addLocationSearchControl(id, resultDomId) {
    const autoComplete = new BMap.Autocomplete(    // 建立一个自动完成的对象
      {
        'input': id,
        'location': this.mapInstance,
      });
    autoComplete.addEventListener('onhighlight', function (e) {  // 鼠标放在下拉列表上的事件
      let str = '';
      let _value = e.fromitem.value;
      let value = '';
      if (e.fromitem.index > -1) {
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
      }
      str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value;

      value = '';
      if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
      }
      str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value;
      document.getElementById(resultDomId).innerHTML = str;
    });
    let myValue;
    autoComplete.addEventListener('onconfirm', e => {    // 鼠标点击下拉列表后的事件
      const _value = e.item.value;
      myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
      document.getElementById(resultDomId).innerHTML = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue;
      this.setPlace(myValue);
    });
  }

  setPlace(myValue) {
    const myFun = () => {
      const pp = local.getResults().getPoi(0).point;    // 获取第一个智能搜索的结果
      this.mapInstance.centerAndZoom(pp, 18);
    };

    const local = new BMap.LocalSearch(this.mapInstance, { // 智能搜索
      onSearchComplete: myFun
    });
    local.search(myValue);
  }

  pointToOverlayPixel(lng, lat) {
    return this.mapInstance.pointToOverlayPixel(this.createPoint(lng, lat));
  }

  searchLocation(key, fn) {
  }

  addZoomEnd(fn) {
    this.mapInstance.addEventListener('zoomend', fn);
  }

  /**
   * 城市选择组件状态改变
   */
  public cityListHook(): Observable<any> {
    return this.cityListStatus.asObservable();
  }

  /**
   * 中心点移动
   */
  panTo(lng, lat, bol = false) {
    this.mapInstance.panTo(this.createPoint(lng, lat), {noAnimation: bol});
  }

  /**
   * 批量修改图标大小
   */
  changeAllIconSize(iconSize) {
    this.iconSize = iconSize;
    this.setIconSize();
    for (const [key, value] of this.markersMap) {
      const imgUrl = CommonUtil.getFacilityIconUrl(this.iconSize, value.data.deviceType, value.data.deviceStatus);
      value.marker.setIcon(this.toggleIcon(imgUrl));
    }
  }

  /**
   * 地图事件
   */
  public mapEventHook(): Observable<any> {
    return this.mapEvent.asObservable();
  }

  /**
   * 通过地址定位
   */
  locationByAddress(name) {

  }

  /**
   * 添加连线
   * data 传入的点连线
   */
  clearLine() {
    if (this.polyline) {
      this.polylineData.forEach(item => {
        this.mapInstance.removeOverlay(item);
      });
    }
  }

  /**
   * 画线
   * param data
   */
  newAddLine(data) {
    const mapData = [];
    data.map(item => {
      mapData.push(new BMap.Point(item.lng * 1, item.lat * 1));
    });
    this.polyline = new BMap.Polyline(
      mapData,
      {strokeColor: '#5ed8a9', strokeWeight: 5, strokeOpacity: 1}
    );   // 创建折线
    this.polylineData.push(this.polyline);
    this.mapInstance.addOverlay(this.polyline);   // 增加折线
  }

  /**
   * 回路画线
   * param data
   */
  public loopDrawLine(data, colorStyle) {
    const mapData = [];
    data.map(item => {
      mapData.push(new BMap.Point(item.lng * 1, item.lat * 1));
    });
    this.polyline = new BMap.Polyline(
      mapData,
      {strokeColor: colorStyle, strokeWeight: 3, strokeOpacity: 1}
    );   // 创建折线
    this.polylineData.push(this.polyline);
    this.mapInstance.addOverlay(this.polyline);   // 增加折线
  }

  /**
   * 根据提供的地理区域或坐标获得最佳的地图视野
   */
  getViewport(points) {
    return this.mapInstance.getViewport(points);
  }

  /**
   * 添加地图类型控件
   */
  addMapTypeControl() {
    this.mapInstance.addControl(new BMap.MapTypeControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        mapTypes: [
          BMAP_NORMAL_MAP,
          BMAP_SATELLITE_MAP
        ]
      })
    );
  }

  // 绑定对应数据文字
  getPointNumber(number) {
    let offsetSize = new BMap.Size(0, 0);
    const labelStyle = {
      color: '#000',
      backgroundColor: '0.05',
      border: '0',
      fontWeight: 'bold',
      fontSize: '12px'
    };

    // 不同数字长度需要设置不同的样式。
    switch ((number + '').length) {
      case 1:
        labelStyle.fontSize = '10px';
        offsetSize = new BMap.Size(20, 20);
        break;
      case 2:
        labelStyle.fontSize = '10px';
        offsetSize = new BMap.Size(15, 15);
        break;
      case 3:
        labelStyle.fontSize = '10px';
        offsetSize = new BMap.Size(-2, 4);
        break;
      default:
        break;
    }

    const label = new BMap.Label(number, {
      offset: offsetSize
    });
    label.setStyle(labelStyle);
    return label;
  }

  /**
   * 给地图添加事件
   */
  addEventListenerToMap() {
    // 点击事件
    this.mapInstance.addEventListener('click', e => {
      const type = e.overlay ? e.overlay.toString() : '';
      if (type !== '[object Marker]') {
        this.mapEventEmitter({type: 'click', data: e});
      }
    });
  }

  /**
   * 地图回传
   */
  private mapEventEmitter(data): void {
    this.mapEvent.next(data);
  }
}
