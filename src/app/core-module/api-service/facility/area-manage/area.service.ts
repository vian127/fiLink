/**
 * Created by xiaoconghu on 2019/1/9.
 */
import {Injectable} from '@angular/core';
import {AreaInterface} from './area.interface';
import {HttpClient} from '@angular/common/http';
import {
  ADD_AREA,
  DELETE_AREA_BY_IDS,
  EXPORT_AREA_DATA,
  GET_AREA_LIST,
  QUERY_AREA_BY_ID,
  QUERY_AREA_NAME_IS_EXIST,
  QUERY_NAME_CAN_CHANGE,
  SELECT_FOREIGN_AREA_INFO,
  SELECT_FOREIGN_AREA_INFO_FOR_PAGE_COLLECTION,
  SET_AREA_DEVICE,
  UPDATE_AREA_BY_ID,
  QUERY_AREA_BY_DEPT_ID
} from '../facility-request-url';
import {Observable} from 'rxjs';

@Injectable()
export class AreaService implements AreaInterface {
  constructor(private $http: HttpClient) {
  }

  areaListByPage(body): Observable<Object> {
    return this.$http.post(`${GET_AREA_LIST}`, body);
  }

  addArea(body): Observable<Object> {
    return this.$http.post(`${ADD_AREA}`, body);
  }

  updateAreaById(body): Observable<Object> {
    return this.$http.put(`${UPDATE_AREA_BY_ID}`, body);
  }

  deleteAreaByIds(body): Observable<Object> {
    return this.$http.post(`${DELETE_AREA_BY_IDS}`, body);
  }

  queryAreaById(id): Observable<Object> {
    return this.$http.get(`${QUERY_AREA_BY_ID}/${id}`);
  }

  queryAreaNameIsExist(body): Observable<Object> {
    return this.$http.post(`${QUERY_AREA_NAME_IS_EXIST}`, body);
  }

  setAreaDevice(body): Observable<Object> {
    return this.$http.put(`${SET_AREA_DEVICE}`, body);
  }

  queryNameCanChange(areaId): Observable<Object> {
    return this.$http.get(`${QUERY_NAME_CAN_CHANGE}/${areaId}`);
  }

  exportAreaList(body): Observable<Object> {
    return this.$http.post(`${EXPORT_AREA_DATA}`, body);
  }

  selectForeignAreaInfo() {
    return this.$http.get(`${SELECT_FOREIGN_AREA_INFO}`);
  }

  selectForeignAreaInfoForPageCollection(body) {
    return this.$http.post(`${SELECT_FOREIGN_AREA_INFO_FOR_PAGE_COLLECTION}`, body);
  }

  queryAreaByDeptId(body): Observable<Object> {
    return this.$http.post(`${QUERY_AREA_BY_DEPT_ID}`, body);
  }
}
