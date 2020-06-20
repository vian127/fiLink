import { Injectable } from '@angular/core';
import {PictureViewInterface} from './picture-view.interface';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {pictureViewHttpUrl} from '../facility-request-url';
@Injectable()
export class PictureViewService implements PictureViewInterface {

  constructor(private $http: HttpClient) { }

  imageListByPage(body): Observable<Object> {
    return this.$http.post(pictureViewHttpUrl.imageListByPage, body);
  }

  deleteImageIsDeletedByIds(body): Observable<Object> {
    return this.$http.post(pictureViewHttpUrl.deleteImageIsDeletedByIds, body);
  }

  batchDownLoadImages(body): Observable<Object> {
    return this.$http.post(pictureViewHttpUrl.batchDownLoadImages, body);
  }

  getPicUrlByAlarmIdAndDeviceId(procId, deviceId): Observable<Object> {
    return this.$http.get(`${pictureViewHttpUrl.getPicUrlByAlarmIdAndDeviceId}/${procId}/${deviceId}`);
  }

  getPicUrlByAlarmId(body): Observable<Object> {
    return this.$http.get(`${pictureViewHttpUrl.getPicUrlByAlarmId}/${body}`);
  }

  getProcessByProcId(id): Observable<Object> {
    return this.$http.get(`${pictureViewHttpUrl.getProcessByProcId}${id}`);
  }

  queryIsStatus(id): Observable<Object> {
    return this.$http.get(`${pictureViewHttpUrl.queryIsStatus}${id}`);
  }
}
