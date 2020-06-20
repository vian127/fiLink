import {Injectable} from '@angular/core';
import {CommonUtil} from '../../shared-module/util/common-util';
import {MAP_ICON_CONFIG} from '../../business-module/index/shared/const/config';

@Injectable({
  providedIn: 'root'
})
export class MapStoreService {
  // 地图类型
  private _mapType: string;
  // 上次选中的设施id
  private _mapLastID: string;
  // token
  private _token: string;
  // 设施数据集
  private _mapData: any;
  // 区域点数据集
  private _areaData: any;
  // 是否初始化了设施数据
  private _isInitData: boolean;
  // 是否初始化了配置
  private _isInitConfig: boolean;
  // 是否初始化了逻辑区域数据
  private _isInitLogicAreaData: boolean;
  // 是否初始化了逻辑设施类型数据
  private _isInitLogicFacilityData: boolean;
  // 是否初始化了逻辑设备类型数据
  private _isInitLogicEquipmentData: boolean;
  // 用户的设施类型配置
  private _facilityTypeConfig: any[];
  // 用户的设施图片大小
  private _facilityIconSize: string;
  // 设施状态选项列表
  private _facilityStatusList: any[];
  // 设施类型选项列表
  private _facilityTypeList: any[];
  //  逻辑区域列表
  private _logicAreaList: any[];
  //  区域选中结果
  private _areaSelectedResults: any[];
  //  设施类型选中结果
  private _facilityTypeSelectedResults: any[];
  //  设备类型选中结果
  private _equipmentTypeSelectedResults: any[];
  //  工单类型选中结果
  private _workOrderTypeSelectedResults: any[];
  //  工单状态选中结果
  private _workOrderStatusSelectedResults: any[];
  //  逻辑设施类型列表
  private _logicFacilityList: any[];
  //  逻辑设备类型列表
  private _logicEquipmentList: any[];
  //  地图设施点集合
  private _mapDeviceList: any[];
  //  地图设备点集合
  private _mapEquipmentList: any[];
  //  大数据列表
  private _areaDataList: any[];
  // 是否初始化了大数据区域
  private _hugeData: boolean;
  // 是否初始化了超过大数据配置
  private _exceedLimit: boolean;
  //  选择过的所有逻辑区域id
  private _chooseAllAreaID: any[];
  //  上次选择过的所有逻辑区域id
  private _selectLastAreaID: any[];

  constructor() {
    this._facilityIconSize = MAP_ICON_CONFIG.defaultIconSize;
    this.resetData();
    this.resetConfig();
  }

  set mapType(type) {
    this._mapType = type;
  }

  get mapType(): string {
    return this._mapType;
  }

  set mapLastID(type) {
    this._mapLastID = type;
  }

  get mapLastID(): string {
    return this._mapLastID;
  }

  set mapData(data) {
    this._mapData = data;
  }

  get mapData() {
    return this._mapData;
  }

  set areaData(data) {
    this._areaData = data;
  }

  get areaData() {
    return this._areaData;
  }


  set isInitConfig(bol) {
    this._isInitConfig = bol;
  }

  get isInitConfig() {
    return this._isInitConfig;
  }

  set isInitData(bol) {
    this._isInitData = bol;
  }

  get isInitData() {
    return this._isInitData;
  }

  set hugeData(bol) {
    this._hugeData = bol;
  }

  get hugeData() {
    return this._hugeData;
  }

  set exceedLimit(bol) {
    this._exceedLimit = bol;
  }

  get exceedLimit() {
    return this._exceedLimit;
  }

  set isInitLogicAreaData(bol) {
    this._isInitLogicAreaData = bol;
  }

  get isInitLogicAreaData() {
    return this._isInitLogicAreaData;
  }

  set isInitLogicFacilityData(bol) {
    this._isInitLogicFacilityData = bol;
  }

  get isInitLogicFacilityData() {
    return this._isInitLogicFacilityData;
  }

  set isInitLogicEquipmentData(bol) {
    this._isInitLogicEquipmentData = bol;
  }

  get isInitLogicEquipmentData() {
    return this._isInitLogicEquipmentData;
  }

  set facilityTypeConfig(data) {
    this._facilityTypeConfig = CommonUtil.deepClone(data);
  }

  get facilityTypeConfig() {
    return this._facilityTypeConfig;
  }

  set facilityIconSize(data) {
    this._facilityIconSize = data;
  }

  get facilityIconSize() {
    return this._facilityIconSize;
  }

  set facilityStatusList(data) {
    this._facilityStatusList = data;
  }

  get facilityStatusList() {
    return this._facilityStatusList;
  }

  set facilityTypeList(data) {
    this._facilityTypeList = data;
  }

  get facilityTypeList() {
    return this._facilityTypeList;
  }

  set logicAreaList(data) {
    this._logicAreaList = data;
  }

  get logicAreaList() {
    return this._logicAreaList;
  }

  set areaSelectedResults(data) {
    this._areaSelectedResults = data;
  }

  get areaSelectedResults() {
    return this._areaSelectedResults;
  }

  set facilityTypeSelectedResults(data) {
    this._facilityTypeSelectedResults = data;
  }

  get facilityTypeSelectedResults() {
    return this._facilityTypeSelectedResults;
  }

  set equipmentTypeSelectedResults(data) {
    this._equipmentTypeSelectedResults = data;
  }

  get equipmentTypeSelectedResults() {
    return this._equipmentTypeSelectedResults;
  }

  set workOrderTypeSelectedResults(data) {
    this._workOrderTypeSelectedResults = data;
  }

  get workOrderTypeSelectedResults() {
    return this._workOrderTypeSelectedResults;
  }

  set workOrderStatusSelectedResults(data) {
    this._workOrderStatusSelectedResults = data;
  }

  get workOrderStatusSelectedResults() {
    return this._workOrderStatusSelectedResults;
  }

  set logicFacilityList(data) {
    this._logicFacilityList = data;
  }

  get logicFacilityList() {
    return this._logicFacilityList;
  }

  set logicEquipmentList(data) {
    this._logicEquipmentList = data;
  }

  get logicEquipmentList() {
    return this._logicEquipmentList;
  }

  set mapDeviceList(data) {
    this._mapDeviceList = data;
  }

  get mapDeviceList() {
    return this._mapDeviceList;
  }

  set mapEquipmentList(data) {
    this._mapEquipmentList = data;
  }

  get mapEquipmentList() {
    return this._mapEquipmentList;
  }

  set areaDataList(data) {
    this._areaDataList = data;
  }

  get areaDataList() {
    return this._areaDataList;
  }

  set chooseAllAreaID(data) {
    this._chooseAllAreaID = data;
  }

  get chooseAllAreaID() {
    return this._chooseAllAreaID;
  }

  set selectLastAreaID(data) {
    this._selectLastAreaID = data;
  }

  get selectLastAreaID() {
    return this._selectLastAreaID;
  }

  set token(data) {
    this._token = data;
  }

  get token() {
    return this._token;
  }

  updateMarker(facility, bol) {
    if (facility.code) {
      this._areaData.set(facility.code, {
        info: facility,
        isShow: bol
      });
    } else {
      this._mapData.set(facility.deviceId, {
        info: facility,
        isShow: bol
      });
    }

  }


  updateMarkerData(facility) {
    let bol = true;
    if (this._mapData.get(facility.deviceId)) {
      bol = this._mapData.get(facility.deviceId).show;
    }
    const position = facility.positionBase.split(',');
    facility.lng = parseFloat(position[0]);
    facility.lat = parseFloat(position[1]);
    delete facility.positionBase;
    this.updateMarker(facility, bol);
  }

  deleteMarker(facilityId) {
    this._mapData.delete(facilityId);
  }

  getMarker(id) {
    const data = this._mapData.get(id);
    return data ? data.info : data;
  }

  resetData() {
    this._isInitData = false;
    this._isInitLogicAreaData = false;
    this._chooseAllAreaID = [];
    this.mapLastID = '';
    this._mapData = new Map();
    this._areaData = new Map();
  }

  resetConfig() {
    this._isInitConfig = false;
    this._facilityTypeConfig = [];
    this._facilityIconSize = '';
    this._facilityTypeConfig = [];
    this._facilityStatusList = [];
    this._facilityTypeList = [];
  }

  getFacilityInfo(id) {
    return this._mapData.get(id);
  }
}
