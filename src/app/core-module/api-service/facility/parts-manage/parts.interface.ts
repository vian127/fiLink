import {Observable} from 'rxjs';

export interface PartsInterface {
  /**
   * 查询配件列表
   * param body
   * returns {Observable<Object>}
   */
  partsListByPage(body): Observable<Object>;

  /**
   * 新增配件信息
   * param body
   * returns {Observable<Object>}
   */
  addParts(body): Observable<object>;

  //
  /**
   * 单个详情配件信息
   * param body
   * returns {Observable<Object>}
   */
  queryPartsById(body): Observable<object>;

  //
  // /**
  //  * 修改配件信息
  //  * param body
  //  * returns {Observable<Object>}
  //  */
  updatePartsById(body): Observable<object>;

  /**
   * 删除配件
   * param body
   * returns {Observable<Object>}
   */
  deletePartsDyIds(body): Observable<object>;

  /**
   * 根据所属单位获取所属人
   * param body
   * returns {Observable<Object>}
   */
  queryByDept(body): Observable<object>;

  /**
   * 异步配件名称是否重复
   * param body
   * returns {Observable<Object>}
   */
  partNameIsExsit(body): Observable<object>;

  /**
   * 导出配件列表
   * param body
   * returns {Observable<Object>}
   */
  partsExport(body): Observable<object>;


}
