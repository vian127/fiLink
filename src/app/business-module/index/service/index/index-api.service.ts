import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IndexApiInterface} from './index-api.interface';
import {
  INDEX_AREA_SERVER,
  INDEX_DEVICE_EQUIPMENT_SERVER,
  INDEX_DEVICE_SERVER, INDEX_DEVICE_SERVER_LCW,
  INDEX_DEVICE_STRATEGY_SERVER,
  INDEX_GROUP_SERVER
} from '../../../../core-module/api-service/api-common.config';

/**
 * 首页服务接口实现类
 */
@Injectable()
export class IndexApiService implements IndexApiInterface {
  constructor(private $http: HttpClient) {
  }

  // 查询首页全部区域
  areaListByPage(body): Observable<Object> {
    return this.$http.post(`${INDEX_AREA_SERVER}/areaInfo/areaListByPage`, body);
  }

  // 获取设施类型
  queryDeviceTypeListForPageSelection(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_SERVER}/deviceInfo/queryDeviceTypeListForPageSelection`, body);
  }

  // 获取设施列表
  queryDeviceList(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_SERVER}/deviceInfo/queryDeviceList`, body);
  }

  // 获取我的关注设施列表
  queryCollectingDeviceList(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_SERVER}/deviceCollecting/queryCollectingDeviceList`, body);
  }

  // 获取我的关注设备列表
  queryCollectingEquipmentList(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_SERVER}/equipmentInfo/queryCollectingEquipmentList`, body);
  }

  // 查询设备类型
  queryEquipmentTypeListForPageSelection(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_SERVER}/equipmentInfo/queryEquipmentTypeListForPageSelection`, body);
  }

  // 查询设备列表
  queryEquipmentList(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_SERVER}/equipmentInfo/queryEquipmentList`, body);
  }

  // 查询设施详情
  queryDeviceById(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_SERVER}/deviceInfo/queryDeviceInfoById`, body);
  }

  // 查询详情卡设备信息
  queryEquipmentListByDeviceId(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_SERVER}/equipmentInfo/queryEquipmentListByDeviceId`, body);
  }

  // 查询首页设施的区域点
  queryDevicePolymerizationList(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_SERVER}/deviceInfo/queryDevicePolymerizationList`, body);
  }

  // 查询详情卡图片
  getPicDetail(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_SERVER}/picRelationInfo/getPicDetail`, body);
  }

  // 添加收藏
  addCollectingById(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_SERVER}/addCollectingById`, body);
  }

  // 取消收藏
  delCollectingById(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_SERVER}/delCollectingById`, body);
  }

  // 设施列表取消关注
  deviceDelCollectingById(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_SERVER}/deviceCollecting/delCollectingById`, body);
  }

  // 设备列表取消关注
  equipmentDelCollectingById(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_SERVER}/equipmentInfo/delCollectingById`, body);
  }

  // 根据区域id查询区域下所有设施信息
  queryDevicePolymerizations(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_SERVER}/deviceInfo/queryDevicePolymerizations`, body);
  }

  // 根据区域id查询区域下所有设备信息
  queryEquipmentPolymerizations(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_SERVER}/equipmentInfo/queryEquipmentPolymerizations`, body);
  }

  // 获取分组信息
  queryGroupInfoList(body): Observable<Object> {
    return this.$http.post(`${INDEX_GROUP_SERVER}/groupInfo/queryGroupInfoList`, body);
  }


  // 设备监控信息监控状态
  queryPerformData(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_SERVER}/equipPerform/queryPerformData`, body);
  }
}
