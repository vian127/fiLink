/**
 * Created by xiaoconghu on 2019/1/9.
 */
export class Area {
  areaId: string;
  level: string;
  areaName: string;
  provinceName: string;
  cityName: string;
  districtName: string;
  address: string;
  managementFacilities: string;
  accountabilityUnit: any[];
  remarks: string;
  createTime: string;
  parentId: string;
  parentName: string;
  creater: string;
  updateTime: string;
  updater: string;
  children: string;
  hasChild: boolean;
  accountabilityUnitName: string;

  constructor() {
    this.accountabilityUnit = [];
  }
}
