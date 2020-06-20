import {FacilityDetailFormModel} from './facility-detail-form.model';

/**
 * 设备新增或编辑数据模型
 */
export class EquipmentAddInfoModel {
  /**
   * 可扩展字段
   */
  [key: string]: any;
  /**
   *  设备id
   */
  public equipmentId?: string;
  /**
   *资产编号
   */
  public  equipmentCode: string;
  /**
   * 第三方编码
   */
  public otherSystemNumber: string;
  /**
   * 设备序号id
   */
  public sequenceId: string;
  /**
   *  名称
   */
  public equipmentName: string;
  /**
   * 类型
   */
  public equipmentType: string;
  /**
   * 型号
   */
  public equipmentModel: string;
  /**
   * 安装时间
   */
  public installationDate: string;
  /**
   * 供应商
   */
  public supplier: string;
  /**
   * 报废年限
   */
  public scrapTime: string;
  /**
   * 权属公司
   */
  public company: string;
  /**
   * 所属区域
   */
  public areaId: string;

  /**
   * 区域编码
   */
  public areaCode: string;
  /**
   * 区域名称
   */
  public areaName: string;
  /**
   * 设施名称
   */
  public deviceName: string;
  /**
   * 挂载位置
   */
  public  mountPosition: string;
  /**
   * 所属网关
   */
  public  gatewayId: string;
  /**
   *所属回路
   */
  public loopId: string;
  /**
   * 网关端口
   */
  public portNo: string;
  /**
   * 备注
   */
  public remarks: string;
  /**
   * 设施id
   */
  public deviceId: string;
  /**
   * 网关名称
   */
  public gatewayName: string;
  /**
   * 设备状态
   */
  public equipmentStatus: string;
  /**
   * 更新时间
   */
  public updateTime: string;
  /**
   * 设施信息
   */
  public deviceInfo: FacilityDetailFormModel = new FacilityDetailFormModel();
}
