import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PartsInterface} from './parts.interface';
import {
  PARTS_LIST_PAGE,
  ADD_PARTS,
  DElETE_PARTS,
  QUERY_USER_BY_DEPT,
  PART_NAME_XSI,
  FIND_PART_BY_ID,
  UPDATE_PARTS,
  EXPORT_PARTS
} from '../facility-request-url';
import {Observable} from 'rxjs';

@Injectable()
export class PartsService implements PartsInterface {
  constructor(private $http: HttpClient) {
  }

  partsListByPage(body): Observable<Object> {
    return this.$http.post(`${PARTS_LIST_PAGE}`, body);
  }

  addParts(body): Observable<Object> {
    return this.$http.post(`${ADD_PARTS}`, body);
  }

  deletePartsDyIds(body): Observable<Object> {
    return this.$http.post(`${DElETE_PARTS}`, body);
  }

  queryByDept(body): Observable<Object> {
    return this.$http.post(`${QUERY_USER_BY_DEPT}`, body);
  }

  partNameIsExsit(body): Observable<Object> {
    return this.$http.post(`${PART_NAME_XSI}`, body);
  }

  queryPartsById(body): Observable<object> {
    return this.$http.get(`${FIND_PART_BY_ID}/${body}`);
  }

  updatePartsById(body): Observable<Object> {
    return this.$http.post(`${UPDATE_PARTS}`, body);
  }

  partsExport(body): Observable<Object> {
    return this.$http.post(`${EXPORT_PARTS}`, body);
  }
}
