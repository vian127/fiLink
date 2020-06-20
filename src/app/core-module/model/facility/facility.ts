import {AreaModel} from './area.model';
import {TemplateReqDto} from './template';

export class Facility {
  id: number;  // 设施id
  name: string;  // 设施名称
  type: number;   // 设施类型
  number: number;  // 设施编号
  area: number | string;  // 区域编号
  areaname?: string;  // 区域名称
  address: string;  // 详细地址
  status: number;  // 设施类型
  lng: number;  // 经度
  lat: number;  // 纬度
}

export class FacilityInfo {
  [key: string]: any;
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
  areaInfo: AreaModel;
  remarks: string;
  specificFieldId: string;
  creater: string;
  updater: string;
  isDelelet: string;
  utime: number | string;
  templateReqDto: TemplateReqDto;
}
