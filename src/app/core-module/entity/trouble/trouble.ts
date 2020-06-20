import {Area} from './area';
import {TemplateReqDto} from './template';
export class TroubleInfo {
  troubleCode: string;
  handleStatus: string;
  troubleType: string;
  troubleLevel: string;
  troubleSource: string;
  troubleFacility: string;
  troubleEquipment: string;
  troubleDescribe: string;
  reportUserName: string;
  happenTime: string;
  deptName: string;
  handlingTime: string;
  currentProgress: string;
  utime: any;
  positionBase: string;
  remark: string;
  progessNodeId: string;
  instanceId: string;
  currentHandleProgress: string;
}
export class FacilityInfo {
  deviceId: string;
  deviceType: string;
  deviceName: string;
  deviceStatus: string;
  deviceCode: string;
  address: string;
  deployStatus: string;
  provinceName: string;
  cityName: string;
  districtName: string;
  position: string;
  positionBase: any;
  positionGps?: any;
  areaInfo: Area;
  remarks: string;
  specificFieldId: string;
  creater: string;
  updater: string;
  isDelelet: string;
  utime: number;
  templateReqDto: TemplateReqDto;
}

