import {Injectable} from '@angular/core';
import {GroupApiInterface} from './group-api.interface';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {GroupServiceUrlConst} from '../../const/group-service-url.const';
import {QueryCondition} from '../../../../../shared-module/entity/queryCondition';

/**
 * 分组管理api接口
 */
@Injectable()
export class GroupApiService implements GroupApiInterface {
  constructor(private $http: HttpClient) {
  }

  /**
   * 查询分组的列表
   */
  public queryGroupInfoList(body): Observable<Object> {
    return this.$http.post(GroupServiceUrlConst.queryGroupInfoList, body);
  }

  /**
   * 新增分组
   */
  public addGroupInfo(body): Observable<Object> {
    return this.$http.post(GroupServiceUrlConst.addGroupInfo, body);
  }

  /**
   * 校验分组名称是否重复
   */
  public checkGroupInfoByName(body): Observable<Object> {
    return this.$http.post(`${GroupServiceUrlConst.checkGroupInfoByName}/${body}`, null);
  }

  /**
   * 删除分组信息
   */
  public delGroupInfByIds(body): Observable<Object> {
    return this.$http.post(GroupServiceUrlConst.delGroupInfByIds, body);
  }

  /**
   * 查询分组详情中的设施列表
   */
  public queryGroupDeviceInfoList(body: QueryCondition): Observable<Object> {
    return this.$http.post(GroupServiceUrlConst.queryGroupDeviceInfoList, body);
  }

  /**
   *  查询分组详情中的设备列表
   */
  public queryGroupEquipmentInfoList(body: QueryCondition): Observable<Object> {
    return this.$http.post(GroupServiceUrlConst.queryGroupEquipmentInfoList, body);
  }

  /**
   * 查询分组的基本信息
   */
  public queryGroupDeviceAndEquipmentByGroupInfoId(groupId: string): Observable<Object> {
    return this.$http.post(`${GroupServiceUrlConst.queryGroupDeviceAndEquipmentByGroupInfoId}/${groupId}`, null);
  }

  /**
   * 快速分组选择设施
   */
  quickSelectGroupDeviceInfoList(groupId: string, body: QueryCondition): Observable<Object> {
    return this.$http.post(`${GroupServiceUrlConst.quickSelectGroupDeviceInfoList}/${groupId}`, body);
  }

  /**
   * 快速分组选择设备
   */
  public quickSelectGroupEquipmentInfoList(groupId: string, body: QueryCondition): Observable<Object> {
    return this.$http.post(`${GroupServiceUrlConst.quickSelectGroupEquipmentInfoList}/${groupId}`, body);
  }

  /**
   * 更新分组
   */
  public updateGroupInfo(body): Observable<Object> {
    return this.$http.post(GroupServiceUrlConst.updateGroupInfo, body);
  }
}
