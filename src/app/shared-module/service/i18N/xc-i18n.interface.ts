import {XcLocalInterface} from './xc-local.interface';
import {Observable} from 'rxjs';

/**
 * Created by xiaoconghu on 2018/11/19.
 */
export interface XcI18nInterface {
  /**
   * 地区变化
   * returns {any}
   */
  localChange(): any;

  /**
   * 设置地区
   * param {XcLocalInterface} _local
   */
  setLocal(_localId: string): void;

  /**
   * 获取地区
   * returns {XcLocalInterface}
   */
  getLocal(): Observable<Object>;

  /**
   * 获取指定的地区语言数据
   * param {string} target
   * returns {any}
   */
  getLocalData(target: string): any;

  /**
   * 获取指定的地区时间
   * param date
   * param {string} format
   * param {string} local
   * returns {string}
   */
  getLocalDate(date: any, format: string, timezone: string, local?: string): string;

  /**
   * 设置地区并且刷新地区
   * param {XcI18nInterface} _local
   */
  setLocalOverLoading(localId: string): void;
}
