import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CoreInterface} from './core.interface';
import {Observable} from 'rxjs';
import {
  GET_CABLE_SEGMENT_INFORMATION,
  GET_PORT_CABLE_CORE_INFO_NOT_IN_DEVICE,
  GET_THE_AB_SURFACE_INFORMATION_OF_THE_BOX,
  GET_THE_CORE_END_INITIALIZATION,
  QUERY_CORE_CORE_INFO_NOT_IN_DEVICE,
  QUERY_FACILITY_BOX_INFORMATION,
  SAVE_CORE_INFORMATION,
  GET_THE_FUSE_INFORMATION
} from '../facility-request-url';

/**
 * 纤芯成端接口
 */
@Injectable()
export class CoreEndService implements CoreInterface {
  constructor(private $http: HttpClient) {
  }

  /**
   * 获取纤芯成端初始化信息
   */
  getTheCoreEndInitialization(body): Observable<Object> {
    return this.$http.post(`${GET_THE_CORE_END_INITIALIZATION}`, body);
  }

  /**
   * 获取光缆段信息
   */
  getCableSegmentInformation(id): Observable<Object> {
    return this.$http.get(`${GET_CABLE_SEGMENT_INFORMATION}/${id}`);
  }

  /**
   * 获取箱的AB面信息
   */
  getTheABsurfaceInformationOfTheBox(id): Observable<Object> {
    return this.$http.get(`${GET_THE_AB_SURFACE_INFORMATION_OF_THE_BOX}/${id}`);
  }

  /**
   * 查询设施框信息
   */
  queryFacilityBoxInformation(id): Observable<Object> {
    return this.$http.get(`${QUERY_FACILITY_BOX_INFORMATION}/${id}`);
  }

  /**
   * 保存纤芯成端信息
   */
  saveCoreInformation(body): Observable<Object> {
    return this.$http.post(`${SAVE_CORE_INFORMATION}`, body);
  }

  /**
   * 获取其他设施成端信息
   */
  getPortCableCoreInfoNotInDevice(body): Observable<Object> {
    return this.$http.post(`${GET_PORT_CABLE_CORE_INFO_NOT_IN_DEVICE}`, body);
  }

  /**
   * 获取其他设施熔纤信息
   */
  queryCoreCoreInfoNotInDevice(body): Observable<Object> {
    return this.$http.post(`${QUERY_CORE_CORE_INFO_NOT_IN_DEVICE}`, body);
  }

  /**
   * 获取本设施熔纤信息
   */
  getTheFuseInformation(body): Observable<Object> {
    return this.$http.post(`${GET_THE_FUSE_INFORMATION}`, body);
  }
}
