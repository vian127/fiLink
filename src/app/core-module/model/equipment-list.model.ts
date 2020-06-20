/**
 * 设备列表数据模型
 */

export class EquipmentListModel {
  /**
   * 用于表格的扩展字段
   */
  [key: string]: any;

  /**
   * 设备Id
   */
  public equipmentId: string;
  /**
   * 资产编码
   */
  public equipmentCode: string;
  /**
   * 设备名称
   */
  public equipmentName: string;
  /**
   * 设备类型
   */
  public equipmentType: string;
  /**
   * 设备状态
   */
  public equipmentStatus: string;
  /**
   * 设备型号
   */
  public equipmentModel: string;
  /**
   * 供应商名称
   */
  public supplier: string;
  /**
   * 报废年限
   */
  public scrapTime: string;
  /**
   * 所属设施
   */
  public deviceId: string;
  /**
   * 所属设施名称
   */
  public deviceName: string;
  /**
   * 挂在位置
   */
  public mountPosition: string;
  /**
   * 安装日期
   */
  public installationDate: string;
  /**
   * 权属公司
   */
  public company: string;
  /**
   * 业务状态
   */
  public businessStatus: string;
  /**
   * 所属区域
   */
  public areaName: string;
  /**
   * 所属网管
   */
  public gatewayName: string;
  /**
   * 备注
   */
  public remark: string;

  /**
   * 区域信息
   */
  public areaInfo: any;

  /**
   * 设备状态名称
   */
  public equipmentStatusName: string;

  /**
   * 状态名称
   */
  public equipmentTypeName: string;
}

