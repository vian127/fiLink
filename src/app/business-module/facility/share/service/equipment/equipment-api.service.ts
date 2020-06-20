import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EquipmentApiInterface} from './equipment-api.interface';
import {Observable} from 'rxjs';
import {equipmentServiceUrlConst} from '../../const/equipment-service-url.const';
import {QueryCondition} from '../../../../../shared-module/entity/queryCondition';
import {QueryAlarmStatisticsModel} from '../../model/query-alarm-statistics.model';

/**
 * 设备管理服务接口实现类
 */
@Injectable()
export class EquipmentApiService implements EquipmentApiInterface {
  constructor(private $http: HttpClient) {
  }

  /**
   *  查询设备列表
   */
  public equipmentListByPage(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.equipmentListByPage, body);
  }

  /**
   * 查询设备统计
   */
  public equipmentCount(): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.equipmentCount, null);
  }

  /**
   *  自动生成设备名称
   */
  public getEquipmentName(temp: { equipmentName: string }): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.getEquipmentName, temp);
  }

  /**
   *  查询设备名称是否已经存在
   */
  public queryEquipmentNameIsExist(body: { equipmentId: string, equipmentName: string }): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.queryEquipmentNameIsExist, body);
  }

  /**
   * 查询资产编码是否存在
   */
  public queryEquipmentCodeIsExist(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.queryEquipmentCodeIsExist, body);
  }

  /**
   * 增加设备
   */
  public addEquipment(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.addEquipment, body);
  }

  /**
   * 修改设备
   */
  public updateEquipmentById(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.updateEquipmentById, body);
  }

  /**
   * 删除设备
   */
  public deleteEquipmentByIds(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.deleteEquipmentByIds, body);
  }

  /**
   * 根据设备id查询设备信息
   */
  public getEquipmentById(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.getEquipmentById, body);
  }

  /**
   * 根据设施id查询挂载位置
   */
  public findMountPositionById(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.findMountPositionById, body);
  }

  /**
   * 获取型号信息
   */
  public getDeviceModelByType(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.getDeviceModelByType, body);
  }

  /**
   * 获取网关端口
   */
  public queryGatewayPort(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.queryGatewayPort, body);
  }

  /**
   * 获取设备的传感值
   */
  public queryPerformData(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.queryPerformData, body);
  }

  /**
   * 查询设备当前告警
   */
  public queryEquipmentCurrentAlarm(equipmentId: string): Observable<Object> {
    return this.$http.post(`${equipmentServiceUrlConst.getAlarmInfoListByEquipmentId}/${equipmentId}`, null);
  }

  /**
   * 查询销障工单
   */
  public queryClearList(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.queryClearList, body);
  }

  /**
   * 撤回工单
   */
  public revokeProc(body): Observable<object> {
    return this.$http.post(equipmentServiceUrlConst.revokeProc, body);
  }

  /**
   *  查询巡检工单
   */
  public queryInspectionList(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.queryInspectionList, body);
  }

  /**
   *  查询操作日志
   */
  public findOperateLog(body: QueryCondition): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.findOperateLog, body);
  }

  /**
   * 查询当前告警名称统计
   */
  public queryAlarmNameStatistics(body: QueryAlarmStatisticsModel): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.queryAlarmNameStatistics, body);
  }

  /**
   * 查询当前告警的级别统计
   */
  public queryCurrentAlarmLevelStatistics(body: QueryAlarmStatisticsModel): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.queryCurrentAlarmLevelStatistics, body);
  }

  /**
   * 查询当前告警增量统计
   */
  public queryAlarmSourceIncremental(body: QueryAlarmStatisticsModel): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.queryAlarmSourceIncremental, body);
  }

  /**
   *  查询历史告警列表
   */
  public queryHistoryAlarmList(equipmentId: string): Observable<Object> {
    return this.$http.post(`${equipmentServiceUrlConst.getAlarmHisInfoListById}/${equipmentId}`, null);
  }

  /**
   * 历史告警级别统计
   */
  public queryAlarmHistorySourceLevel(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.queryAlarmHistorySourceLevel, body);
  }

  /**
   *  查询历史告警名称统计
   */
  public queryAlarmHistorySourceName(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.queryAlarmHistorySourceName, body);
  }

  /**
   * 导出设备接口
   */
  public exportEquipmentData(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.exportEquipmentData, body);
  }

  /**
   *  查询设备日志
   */
  public queryEquipmentLog(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.queryEquipmentLog, body);
  }

  /**
   *  根据设备id查询设备的最近三张图片
   */
  public getPicDetailForNew(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.getPicDetailForNew, body);
  }

  /**
   * 查询设备模型的详情卡片code
   */
  public getDetailCode(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.getDetailCode, body);
  }

  /**
   * 查询网关端口连接拓扑
   */
  public queryGatewayPortInfoTopology(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.queryGatewayPortInfoTopology, body);
  }

  /**
   * 保存网关端口拓扑
   */
  public saveGatewayPortInfo(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.saveGatewayPortInfo, body);
  }

  /**
   * 清除网关端口信息
   */
  public deleteGatewayPortInfo(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.deleteGatewayPortInfo, body);
  }

  /**
   * 拖动设备位置
   */
  public updateEquipmentPosition(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.updateEquipmentPosition, body);
  }

  /**
   * 修改连线信息
   */
  public updateLineName(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.updateLineName, body);
  }

  /**
   * 修改节点信息
   */
  public updateNodeName(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.updateNodeName, body);
  }

  /**
   * 获取网关配置已有设备列表数据
   */
  public queryConfigEquipmentInfo(body): Observable<Object> {
    return this.$http.post(equipmentServiceUrlConst.queryConfigureEquipmentInfo, body);
  }

}
