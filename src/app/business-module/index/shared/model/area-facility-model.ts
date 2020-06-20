/**
 * 区域下设施详情接口模型
 */
export class AreaFacilityModel {
  /**
   *  区域ID
   */
  public polymerizationType: string;
  /**
   *  设施区域ID集合
   */
  public codeList: any[];
  /**
   *  设施区域ID集合
   */
  public filterConditions: any;

  constructor() {
    this.filterConditions = new FilterConditions();
  }
}

export class FilterConditions {
  /**
   *  设施区域ID集合
   */
  public area: any[];
  /**
   *  设施区域ID集合
   */
  public device: any[];
  /**
   *  设施区域ID集合
   */
  public group: any[];
}

/*
  当前告警和历史告警模型
 */
export class AlarmModel {
  /**
   * 告警名称
   */
  public alarmName: string;
  /**
   * 设备ID
   */
  public equipmentId: string;
  /**
   * 设备名称
   */
  public equipmentName: string;
  /**
   * 设备类型
   */
  public equipmentType: string;
  /**
   * 设施ID
   */
  public deviceId: string;
  /**
   * 设施名称
   */
  public deviceName: string;
  /**
   * 告警类别
   */
  public alarmType: string;
  /**
   * 责任单位
   */
  public accountabilityUnit: string;
}
