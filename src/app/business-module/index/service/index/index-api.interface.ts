import {Observable} from 'rxjs';

/**
 * 首页服务接口
 */
export interface IndexApiInterface {
  /**
   * 查询首页全部区域
   * returns {Observable<Object>}
   */
  areaListByPage(body): Observable<Object>;

  /**
   * 获取设施类型
   * returns {Observable<Object>}
   */
  queryDeviceTypeListForPageSelection(body): Observable<Object>;

  /**
   * 获取设施列表
   * returns {Observable<Object>}
   */
  queryDeviceList(body): Observable<Object>;

  /**
   * 获取我的关注设施列表
   * returns {Observable<Object>}
   */
  queryCollectingDeviceList(body): Observable<Object>;


  /**
   * 获取我的关注设备列表
   * returns {Observable<Object>}
   */
  queryCollectingEquipmentList(body): Observable<Object>;

  /**
   * 查询设备类型
   * returns {Observable<Object>}
   */
  queryEquipmentTypeListForPageSelection(body): Observable<Object>;

  /**
   * 查询设备列表
   * returns {Observable<Object>}
   */
  queryEquipmentList(body): Observable<Object>;

  /**
   * 查询设施详情
   * returns {Observable<Object>}
   */
  queryDeviceById(body): Observable<Object>;

  /**
   * 查询详情卡设备信息
   * returns {Observable<Object>}
   */
  queryEquipmentListByDeviceId(body): Observable<Object>;


  /**
   * 查询详情卡设备信息
   * returns {Observable<Object>}
   */
  queryEquipmentListByDeviceId(body): Observable<Object>;

  /**
   * 查询首页设施的区域点
   * returns {Observable<Object>}
   */
  queryDevicePolymerizationList(body): Observable<Object>;

  /**
   * 设施列表取消关注
   * returns {Observable<Object>}
   */
  deviceDelCollectingById(body): Observable<Object>;

  /**
   * 设备列表取消关注
   * returns {Observable<Object>}
   */
  equipmentDelCollectingById(body): Observable<Object>;

  /**
   * 根据区域id查询区域下所有设施信息
   * returns {Observable<Object>}
   */
  queryDevicePolymerizations(body): Observable<Object>;

  /**
   * 获取分组信息
   * returns {Observable<Object>}
   */
  queryGroupInfoList(body): Observable<Object>;

}

