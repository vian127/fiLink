/**
 * 设施设备列表筛选条件模型
 */
export class FacilityConditionModel {
  /**
   *  区域ID
   */
  public areaId: any[];
  /**
   *  设施区域ID集合
   */
  public areaIdList: string[];
  /**
   *  设备区域ID集合
   */
  public areaCodeList: any;
  /**
   * 项目ID
   */
  public projectId: any[];
  /**
   * 设施类型
   */
  public device: any[];
  /**
   * 设备类型
   */
  public equipment: any[];
  /**
   * 分组ID
   */
  public groupId: any[];
  /**
   * 租聘方ID
   */
  public rentId: any[];
}

/**
 * 分组数据模型
 */
export class SelectGroupItemModel {
  /**
   *  label
   */
  public label: string;
  /**
   *  value
   */
  public value: string;
}

/**
 * 分组接口查询数据模型
 */
export class SelectGroupDataModel {
  /**
   *  分组ID
   */
  public groupId: string;
  /**
   *  分组名称
   */
  public groupName: string;
}

/**
 * 向已有分组中添加设备设施模型
 */
export class AddToExistGroupInfoModel {

  public groupInfo: Array<{ groupId: string }>;

  public groupDeviceInfoIdList: string[];

  public groupEquipmentIdList: string[];
}
