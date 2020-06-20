import {MapInterface} from './map.interface';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {INDEX_URL} from '../index-request-url';
import {Injectable} from '@angular/core';

@Injectable()
export class MapService implements MapInterface {
  constructor(private $http: HttpClient) {
  }

  // 查询所有设施列表
  getALLFacilityList(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.GET_FACILITY_LIST_ALL}`);
  }
  // 查询所有设施列表(基本数据，key值简化)
  getALLFacilityListBase(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.GET_FACILITY_LIST_ALL_BASE}`);
  }
  // 查询所有设施列表(key值简化)
  getALLFacilityListSimple(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.GET_FACILITY_LIST_ALL_SIMPLE}`);
  }
  // 查询所有区域列表
  getALLAreaList(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.GET_AREA_LIST_ALL}`);
  }
  // 获取设施类型配置信息
  getALLFacilityConfig(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.GET_FACILITY_CONFIG_ALL}`);
  }
  // 修改用户地图设施类型配置的设施类型启用状态
  modifyFacilityTypeConfig(body): Observable<Object> {
    return this.$http.post(`${INDEX_URL.UPDATE_FACILITY_TYPE_STATUS}`, body);
  }
  // 修改用户地图设施类型配置的设施图标尺寸
  modifyFacilityIconSize(body): Observable<Object> {
    return this.$http.post(`${INDEX_URL.UPDATE_FACILITY_ICON_SIZE}`, body);
  }
  // 收藏设施
  collectFacility(id): Observable<Object> {
    return this.$http.get(`${INDEX_URL.COLLECT_FACILITY}/${id}`);
  }
  // 取消收藏设施
  unCollectFacility(id): Observable<Object> {
    return this.$http.get(`${INDEX_URL.CANCEL_COLLECT_FACILITY}/${id}`);
  }
  // 获取收藏设施统计
  getCollectFacilityListStatistics(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.GET_COLLECT_FACILITY_LIST_STATISTICS}`);
  }
  // 获取收藏设施列表
  getCollectFacilityList(body): Observable<Object> {
    return this.$http.post(`${INDEX_URL.GET_COLLECT_FACILITY_LIST}`, body);
  }
  // 获取所有收藏设施列表
  getAllCollectFacilityList(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.GET_COLLECT_FACILITY_LIST_ALL}`);
  }
  // 查询当前用户区域列表
  getALLAreaListForCurrentUser(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.GET_AREA_LIST_FOR_CURRENT_USER}`);
  }

  // 查询设施当前告警各级别数量
  getQueryAlarmLevelGroups(params): Observable<Object> {
    return this.$http.post(`${INDEX_URL.QUERY_ALARM_LEVEL_GROUPS}`, params);
  }

  // 查询当前告警各级别数量
  queryAlarmCurrentLevelGroup(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.QUERY_ALARM_CURRENT_LEVEL_GROUPS}`);
  }

  // 操作记录
  findOperateLog(params): Observable<Object> {
    return this.$http.post(`${INDEX_URL.FIND_OPERATE_LOG}`, params);
  }

  // 查询告警设施Top10
  queryScreenDeviceIdsGroup(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.QUERY_SCREEN_DEVICE_IDS_GROUP}`);
  }

  // 查询告警设施Top10名称
  queryDeviceByIds(params): Observable<Object> {
    return this.$http.post(`${INDEX_URL.QUERY_HOME_DEVICE_IDS}`, params);
  }

  // 查询各设施状态数量
  queryUserDeviceStatusCount(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.QUERY_USER_DEVICE_STATUS_COUNT}`);
  }

  // 工单增量
  queryHomeProcAddListCountGroupByDay(params): Observable<Object> {
    return this.$http.post(`${INDEX_URL.QUERY_HOME_PROC_ADD_LIST_COUNT_GROUP_BY_DAY}`, params);
  }

  // 查询各设施状态数量
  queryAlarmDateStatistics(id, body): Observable<Object> {
    return this.$http.post(`${INDEX_URL.ALARM_DATE_STATISTICS}/${id}`, body);
  }

  // 查询繁忙TOP
  queryUserUnlockingTopNum(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.QUERY_USER_UNLOCKING_TOP_NUM}`);
  }

  // 根据光缆ID查询光缆所有设施
  queryDeviceInfoListByOpticCableId(id): Observable<Object> {
    return this.$http.get(`${INDEX_URL.QUERY_DEVICE_INFO_LIST_BY_ID}/${id}`);
  }

  // 根据设备id询端口使用率
  queryDeviceUsePortStatistics(id): Observable<Object> {
    return this.$http.get(`${INDEX_URL.QUERY_DEVICE_USE_PORT_STATISTICS}/${id}`);
  }

  // 根据Id 查询设施接口信息
  findDeviceId(id): Observable<Object> {
    return this.$http.get(`${INDEX_URL.FIND_DEVICE_ID}/${id}`);
  }

  // 根据Id 查询设施接口信息
  queryHomeDeviceById(id): Observable<Object> {
    return this.$http.get(`${INDEX_URL.QUERY_HOME_DEVICE_BY_ID}/${id}`);
  }

  // 首次加载
  queryHomeDeviceArea(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.QUERY_HOME_DEVICE_AREA}`);
  }

  // 首页大数据刷新
  refreshHomeDeviceAreaHuge(params): Observable<Object> {
    return this.$http.post(`${INDEX_URL.REFRESH_HOME_DEVICE_AREA_HUGE}`, params);
  }

  // 首页数据刷新
  refreshHomeDeviceArea(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.REFRESH_HOME_DEVICE_AREA}`);
  }

}
