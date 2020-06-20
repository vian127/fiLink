import {BMapBaseService} from './b-map/b-map-base.service';
import {GMapBaseService} from './g-map/g-map-base.service';
import {GMapPlusService} from './g-map/g-map-plus.service';
import {BMapPlusService} from './b-map/b-map-plus.service';

declare const MAP_TYPE;

export class MapServiceUtil {
  /**
   * 判断点是否在所选区域里面
   * param pt  具体的点
   * param poly 所选区域
   * returns {boolean}
   */
  public static isInsidePolygon(pt, poly) {
    let c = false;
    for (let i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
      if (((poly[i].lat <= pt.lat && pt.lat < poly[j].lat) || (poly[j].lat <= pt.lat && pt.lat < poly[i].lat)) &&
        (pt.lng < (poly[j].lng - poly[i].lng) * (pt.lat - poly[i].lat) / (poly[j].lat - poly[i].lat) + poly[i].lng)) {
        c = !c;
      }
    }
    return c;
  }

  /**
   * 获取基础版地图
   */
  public static getBaseMap(): BMapBaseService | GMapBaseService {
    if (MAP_TYPE === 'baidu') {
      return new BMapBaseService();
    } else {
      return new GMapBaseService();
    }
  }

  /**
   * 获取plus版地图
   */
  public static getPlusMap(): BMapPlusService | GMapPlusService {
    if (MAP_TYPE === 'baidu') {
      return new BMapPlusService();
    } else {
      return new GMapPlusService();
    }
  }
}
