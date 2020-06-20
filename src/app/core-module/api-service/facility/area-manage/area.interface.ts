import {Observable} from 'rxjs';

/**
 * Created by xiaoconghu on 2019/1/10.
 */
export interface AreaInterface {
  /**
   * 获取区域列表
   */
  areaListByPage(body);

  /**
   * 新增区域
   * param body
   * returns {Observable<Object>}
   */
  addArea(body): Observable<Object>;

  /**
   * 修改区域信息
   * param body
   * returns {Observable<Object>}
   */
  updateAreaById(body): Observable<Object>;

  /**
   * 删除区域信息
   * param body
   * returns {Observable<Object>}
   */
  deleteAreaByIds(body): Observable<Object>;

  /**
   * 查看区域详情信息
   * param {string} id
   * returns {Observable<Object>}
   */
  queryAreaById(id: string): Observable<Object>;

  /**
   * 查询区域名称是否存在
   * param {string} areaName
   * returns {Observable<Object>}
   */
  queryAreaNameIsExist(areaName: string): Observable<Object>;

  /**
   * 关联设施
   * param body
   * returns {Observable<Object>}
   */
  setAreaDevice(body): Observable<Object>;

  /**
   * 查询区域名称是否可以更改
   * param areaId
   * returns {Observable<Object>}
   */
  queryNameCanChange(areaId): Observable<Object>;

  /**
   * 导出区域列表
   * param body
   * returns {Observable<Object>}
   */
  exportAreaList(body): Observable<Object>;

  /**
   * 根据部门id查询区域信息
   */
  queryAreaByDeptId(body): Observable<Object>;
}
