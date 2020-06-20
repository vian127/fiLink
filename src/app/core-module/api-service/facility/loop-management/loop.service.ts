import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoopInterface} from './loop.interface';
import {Observable} from 'rxjs';
import {LoopRequestUrlConst} from './loop-request-url';
import {INDEX_DEVICE_SERVER} from '../../api-common.config';

/**
 * Created by wh1903001 on 2020/6/15
 */
@Injectable()
export class LoopService implements LoopInterface {
  constructor(private $http: HttpClient) {
  }
  // 获取回路列表分页
  public queryLoopList(body): Observable<Object> {
    return this.$http.post(`${LoopRequestUrlConst.queryLoopListByPage}`, body);
  }

  // 查询设施的区域信息
  public queryLoopMapByArea(body): Observable<Object> {
    return this.$http.post(`${LoopRequestUrlConst.queryLoopMapByArea}`, body);
  }

  // 根据区域id查询区域下设施信息
  queryLoopMapByDevice(body): Observable<Object> {
    return this.$http.post(`${LoopRequestUrlConst.queryLoopMapByDevice}`, body);
  }

}
