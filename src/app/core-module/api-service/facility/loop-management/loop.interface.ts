import {Observable} from 'rxjs';

/**
 * create wh1903001 by 2020/6/15
 */
export interface LoopInterface {
  /**
   * 获取回路列表分页
   */
  queryLoopList(body): Observable<Object>;
  /**
   * 获取回路地图设施数据
   */
  queryLoopMapByArea(body): Observable<Object>;
  /**
   * // 根据区域id查询设施信息
   */
  queryLoopMapByDevice(body): Observable<Object>;

}
