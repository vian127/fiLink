import {Observable} from 'rxjs';
import {GET_THE_FUSE_INFORMATION} from '../facility-request-url';
/**
 * 纤芯成端接口
 */
export interface CoreInterface {
  /**
   * 获取纤芯成端初始化信息
   */
  getTheCoreEndInitialization(body): Observable<Object>;

  /**
   * 获取光缆段信息
   */
  getCableSegmentInformation(id): Observable<Object>;

  /**
   * 获取箱的AB面信息
   */
  getTheABsurfaceInformationOfTheBox(id): Observable<Object>;

  /**
   * 查询设施框信息
   */
  queryFacilityBoxInformation(id): Observable<Object>;

  /**
   * 保存纤芯成端信息
   */
  saveCoreInformation(body): Observable<Object>;

  /**
   * 获取其他设施成端信息
   */
  getPortCableCoreInfoNotInDevice(body): Observable<Object>;

  /**
   * 获取其他设施熔纤信息
   */
  queryCoreCoreInfoNotInDevice(body): Observable<Object>;

  /**
   * 获取本设施熔纤信息
   */
  getTheFuseInformation(body): Observable<Object>;
}
