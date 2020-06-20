/**
 * 设施新增、编辑表单模型
 */
export class FacilityDetailFormModel {
  /**
   * 设施id 编辑时候有
   */
  deviceId?: string;
  /**
   * 设施名称
   */
  deviceName: string;
  /**
   * 设施类型
   */
  deviceType: string;
  /**
   * 型号
   */
  deviceModel: string;
  /**
   * 第三方编码
   */
  otherSystemNumber: string;
  /**
   * 资产编码
   */
  assetNumbers: string;
  /**
   * 所属公司
   */
  company: string;
  /**
   * 所属项目
   */
  project: string;
  /**
   * 所属区域
   */
  areaId: string;
  /**
   * 省
   */
  provinceName: string;
  /**
   * 市
   */
  cityName: string;
  /**
   * 区
   */
  districtName: string;
  /**
   * 详细地址
   */
  address: string;
  /**
   * 供应商
   */
  supplier: string;
  /**
   * 报废年限
   */
  scrapTime: number;
  /**
   * 安装日期
   */
  installationDate: number;
  /**
   * 备注
   */
  remark: string;
  /**
   * 上传图片
   */
  picUrl?: string;
  /**
   * 位置Base
   */
  positionBase?: string;
  /**
   * 位置Gps
   */
  positionGps?: string;
}
