import {Injectable} from '@angular/core';
import {FacilityInterface} from './facility.interface';
import {Observable} from 'rxjs';
import {GROUP_SERVER, INDEX_DEVICE_STRATEGY_SERVER} from '../../api-common.config';
import {HttpClient} from '@angular/common/http';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {SelectGroupDataModel} from '../../../../business-module/index/shared/model/facility-condition.model';
import {ResultModel} from '../../../model/result.model';

@Injectable()
export class IndexFacilityService implements FacilityInterface {
  constructor(private $http: HttpClient) {
  }

  /**
   * 设备监控信息监控状态
   */
  queryPerformData(body): Observable<Object> {
    return this.$http.post(`${INDEX_DEVICE_STRATEGY_SERVER}/equipPerform/queryPerformData`, body);
  }

  /**
   * 分组列表
   */
  queryGroupInfoList(body: QueryCondition): Observable<ResultModel<SelectGroupDataModel[]>> {
    return this.$http.post<ResultModel<SelectGroupDataModel[]>>(`${GROUP_SERVER}/groupInfo/queryGroupInfoList`, body);
  }

  /**
   * 向已有分组中添加设备设施
   */
  addToExistGroupInfo(body): Observable<Object> {
    return this.$http.post(`${GROUP_SERVER}/groupInfo/addToExistGroupInfo`, body);
  }

  /**
   * 新增分组信息
   */
  addGroupInfo(body): Observable<Object> {
    return this.$http.post(`${GROUP_SERVER}/groupInfo/addGroupInfo`, body);
  }

  /**
   * 检测分组名
   */
  checkGroupInfoByName(id): Observable<object> {
    return this.$http.get(`${GROUP_SERVER}/groupInfo/checkGroupInfoByName/${id}`);
  }
}
