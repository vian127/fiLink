/**
 * 分组管理接口
 */
import {QueryCondition} from '../../../../../shared-module/entity/queryCondition';
import {Observable} from 'rxjs';

export interface GroupApiInterface {

  /**
   * 查询分组列表
   */
  queryGroupInfoList(body: QueryCondition): Observable<Object>;

  /**
   * 新增分组
   */
  addGroupInfo(body): Observable<Object>;

  /**
   * 校验分组的名称是否重复
   */
  checkGroupInfoByName(body): Observable<Object>;

  /**
   *  删除分组
   */
  delGroupInfByIds(body: string[]): Observable<Object>;

  /**
   * 查询分组详情中的设施列表
   */
  queryGroupDeviceInfoList(body: QueryCondition): Observable<Object>;

  /**
   *  查询分组详情中的设备列表
   */
  queryGroupEquipmentInfoList(body: QueryCondition): Observable<Object>;

  /**
   * 快速分组选择设备
   */
  quickSelectGroupEquipmentInfoList(groupId: string, body: QueryCondition): Observable<Object>;

  /**
   * 快速分组选择设施
   */
  quickSelectGroupDeviceInfoList(groupId: string, body: QueryCondition): Observable<Object>;

  /**
   * 查询分组基本信息
   */
  queryGroupDeviceAndEquipmentByGroupInfoId(groupId: string): Observable<Object>;

  /**
   * 更新分组
   */
  updateGroupInfo(body): Observable<Object>;
}
