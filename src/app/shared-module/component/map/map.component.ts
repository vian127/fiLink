import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import * as lodash from 'lodash';
import {CommonUtil} from '../../util/common-util';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexLanguageInterface} from '../../../../assets/i18n/index/index.language.interface';
import {DEVICE_DEPLOY, FACILITY_STATUS_COLOR, FACILITY_STATUS_NAME, FACILITY_TYPE_NAME} from '../../const/facility';
import {BMapService} from './b-map.service';
import {GMapService} from './g-map.service';
import {MapConfig as BMapConfig} from './b-map.config';
import {MapConfig as GMapConfig} from './g-map.config';
import {MapConfig} from './map.config';
import {AREA_LEVEL_COLOR, AREA_LEVEL_NAME} from '../../const/area';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {TableConfig} from '../../entity/tableConfig';
import {QueryCondition, SortCondition} from '../../entity/queryCondition';
import {PageBean} from '../../entity/pageBean';
import {Router} from '@angular/router';
import {FacilityService} from '../../../core-module/api-service/facility/facility-manage';
import {Result} from '../../entity/result';
import {FacilityLanguageInterface} from '../../../../assets/i18n/facility/facility.language.interface';
import {InspectionLanguageInterface} from '../../../../assets/i18n/inspection-task/inspection.language.interface';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {getCableLevel} from '../../../business-module/facility/share/const/facility.config';
import {index_facility_type} from '../../../business-module/index/shared/const/index-const';
import {MapStoreService} from '../../../core-module/store/map.store.service';
import {BMapPlusService} from '../../service/map-service/b-map/b-map-plus.service';
import {BMAP_ARROW, BMAP_DRAWING_RECTANGLE, DEFAUT_ZOOM, iconSize} from '../map-selector/map.config';
import {MapCoverageService} from '../../../business-module/index/service/map-coverage.service';
import {ResultModel} from '../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../core-module/model/result-code.enum';
import {IndexApiService} from '../../../business-module/index/service/index/index-api.service';
import {AreaFacilityModel} from '../../../business-module/index/shared/model/area-facility-model';
import {BusinessFacilityService} from '../../service/business-facility/business-facility.service';
import {BMapDrawingService} from '../../service/map-service/b-map/b-map-drawing.service';
import {MapDrawingService} from '../map-selector/map-drawing.service';

// 一定要声明BMap，要不然报错找不到BMap
declare let BMap: any;
declare let BMapLib: any;

declare let google: any;
declare let MarkerClusterer: any;

@Component({
  selector: 'xc-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() mapConfig: MapConfig;    // 地图配置
  @Input() data: any[];    // 要渲染的设施数据
  @Input() iconSize: string;   // 图标大小   18-24
  @Input() facilityId: string;   // 选中设施id
  @Input() areaData: any[];   //  区域数据
  @Input() centerPoint: string; // 中心点
  @Output() mapEvent = new EventEmitter();    // 地图事件回传
  @ViewChild('map') map: ElementRef;  // 地图模板
  @ViewChild('tplFooter') public tplFooter; // 弹出框底部
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>; // 拓扑单选框
  public _iconSize;  // 图表大小
  public mapService: BMapPlusService; // 地图方法
  public infoData = {  // 信息框
    type: '',
    data: null
  };
  public infoWindowLeft = '0';  // 信息框左边位置
  public infoWindowTop = '0';   // 信息框上边位置
  public isShowInfoWindow = false; // 鼠标移上去时的提示框
  public isShowTableWindow = false; // 多重设备点双击列表弹框
  public facilityIconType = index_facility_type; // 设施类型
  public targetMarker;   // 目标标记点
  public timer;          // 定时器
  public inputValue;     // 搜索框值
  public options: any[] = [];  // 下拉框
  public indexLanguage: IndexLanguageInterface;  // 首页国际化
  public commonLanguage: CommonLanguageInterface;  // 公共国际化
  public searchTypeName;  // 搜索类型名称
  public IndexObj = {      // 地图类型
    facilityNameIndex: 1,
    bMapLocationSearch: -1,
    gMapLocationSearch: -1,
  };
  public fn: any;   // 设施marker点事件
  public en: any;   // 设备marker点事件
  public cb: any;   // 百度地图聚合点回调
  public areaPoint: any;   // 区域点和项目回调
  public maxZoom;   // 最大缩放级别
  public defaultZoom;   // 默认缩放级别
  public searchKey = '';  // 谷歌地图地理位置搜索框
  public mapTypeId;  // 地图类别id
  public mapType;   // 地图类型
  public areaDataMap = new Map();
  public isVisible = false; // 新增弹出框显示隐藏
  public title: string;  // 光缆标题
  public _dataSet = [];  // 数据级
  public pageBean: PageBean = new PageBean(10, 1, 1);  // 分页参数初始化
  public tableConfig: TableConfig; // 表格配置
  public queryCondition: QueryCondition = new QueryCondition(); // 传参条件
  public justId = ''; // 设施ID
  public language: FacilityLanguageInterface; // 国际化
  public InspectionLanguage: InspectionLanguageInterface; // 国际化
  public selectedAlarmId = null; // 选中ID
  public isLight = null;  // 判断是查看拓扑高亮（1） 还是查看拓扑（2）
  public gisData = []; // 显示点连线;
  public lightData = ''; // 高亮数数据
  public gisDataList = []; // gis点数据对象集合
  public typeLg; // 语言类型
  // 区域下设施数据模型
  public areaFacilityModel = new AreaFacilityModel;
  // 设施点数据集合
  public deviceDataList;
  // 设备点数据集合
  public equipmentDataList;
  // 表格配置
  public equipmentTableConfig: TableConfig;
  // 表格数据
  public setData = [];
  // 巡检工单分页
  tablePageBean: PageBean = new PageBean(5, 1, 1);
  // 地图分层设施类型
  public deviceList: string[] = ['002'];
  // 地图分层设施类型
  public equipmentList;
  // 克隆一份地图区域数据
  public mapCloneData: any;

  // 地图绘画工具
  public mapDrawUtil: MapDrawingService;
  // 绘制类型
  public drawType: string = BMAP_ARROW;
  // 覆盖物集合
  overlays = [];

  constructor(private $nzI18n: NzI18nService,
              private $mapStoreService: MapStoreService,
              private $el: ElementRef,
              private $router: Router,
              private $facilityService: FacilityService,
              private $modalService: FiLinkModalService,
              private $mapCoverageService: MapCoverageService,
              private $indexApiService: IndexApiService,
              private $businessFacilityService: BusinessFacilityService
  ) {
  }

  ngOnInit() {
    // 初始化国际化
    this.indexLanguage = this.$nzI18n.getLocaleData('index');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.InspectionLanguage = this.$nzI18n.getLocaleData('inspection');
    this.language = this.$nzI18n.getLocaleData('facility');
    // 语言类型
    this.typeLg = JSON.parse(localStorage.getItem('localLanguage'));
    this.searchTypeName = this.indexLanguage.searchDeviceName;
    this.mapTypeId = 'roadmap';
    this.title = this.indexLanguage.chooseFibre;
    this.initFn();
    this.initEn();
    this.initCb();
    this.initAreaPoint();
    this.initTableConfig();
    this.changChooseUtil();
  }

  ngAfterViewInit() {
    if (!this.mapConfig) {
      // 请传入地图配置信息
      return;
    }
    if (!this.mapConfig.mapId) {
      // 请传入id
    } else {
      this.map.nativeElement.setAttribute('id', this.mapConfig.mapId);
    }
    this.mapType = this.mapConfig.mapType;
    if (this.mapType === 'google') {
      this.initGMap();
    } else if (this.mapType === 'baidu') {
      this.initBMap();
    } else {
      // 不支持该类型地图
    }
    // 地图分层过滤设施类型
    this.$businessFacilityService.eventEmit.subscribe((value) => {
      if (value.deviceType) {
        this.deviceList = value.deviceType;
      } else if (value.equipmentList) {
        this.equipmentList = value.equipmentList;
      } else if (value.mapShowType) {
        this.mapService.clearMarkerMap();
        this.mapService.createPlusMap(this.mapConfig.mapId);
        // this.addMarkers(this.mapCloneData);
      }
    });
    this.addEventListener();
  }

  ngOnChanges(changes: SimpleChanges) {
    // 缩放级别大的时候，拿到缩放层级
    this.maxZoom = BMapConfig.maxZoom;
    this.defaultZoom = BMapConfig.defaultZoom;

    if (this.mapService && changes.data && changes.data.currentValue) {
      if (changes.data.previousValue) {
        this.updateMarkers(changes.data.previousValue);
      } else {
        this.mapCloneData = CommonUtil.deepClone(this.data);
        this.addMarkers(this.data);
      }
    }
    if (this.mapService && changes.iconSize && changes.iconSize.currentValue) {
      this.setIconSize(changes.iconSize.previousValue);
    }
    if (changes.areaData && changes.areaData.currentValue) {
      this.setAreaDataMap();
    }
    if (this.mapService && changes.facilityId) {
      if (changes.facilityId.currentValue) {
        this.selectMarker();
      } else {
        // 设施详情列表id和设施id切换的时候，选中颜色
        // this.resetTargetMarker();
      }
    }
  }

  ngOnDestroy() {
    this.mapService.clearMarkerMap();
  }

  initBMap() {
    this.mapType = 'baidu';
    try {
      if (!BMap || !BMapLib) {
        // 百度地图资源未加载
        return;
      }
      this.mapService = new BMapPlusService();
      this.mapService.createPlusMap(this.mapConfig.mapId);
      this.mapService.addEventListenerToMap();
      this.mapService.addLocationSearchControl('suggestId', 'searchResultPanel');
      this.mapService.cityListHook().subscribe(result => {
        this.mapEvent.emit(result);
      });
      this.addEventListenerToMap();
      this.maxZoom = BMapConfig.maxZoom;
      this.defaultZoom = BMapConfig.defaultZoom;
      const size = this.mapConfig.defaultIconSize.split('-');
      this._iconSize = this.mapService.createSize(size[0], size[1]);
      this.mapService.setCenterPoint();
      // 实例化鼠标绘制工具
      this.mapDrawUtil = new BMapDrawingService(this.mapService.mapInstance);
      this.addMarkers(this.data);
    } catch (e) {
      // 百度地图资源未加载
    }
  }

  initGMap() {
    this.mapType = 'google';
    try {
      if (!google || !MarkerClusterer) {
        // 谷歌地图资源未加载
        return;
      }
      // this.mapService = new GMapService(this.mapConfig);
      this.addEventListenerToMap();
      this.maxZoom = GMapConfig.maxZoom;
      this.defaultZoom = GMapConfig.defaultZoom;
      const size = this.mapConfig.defaultIconSize.split('-');
      this._iconSize = this.mapService.createSize(size[0], size[1]);
      // 实例化鼠标绘制工具
      // this.mapDrawUtil = new GMapDrawingService(this.mapService.mapInstance);
      this.addMarkers(this.data);
    } catch (e) {
      // 谷歌地图资源未加载
    }
  }

  closeOverlayInfoWindow() {
    if (this.targetMarker) {
      this.resetTargetMarker();
    }
    this.targetMarker = null;
  }

  /**
   * 向地图中添加点
   * param {any[]} facilityData
   */
  public addMarkers(facilityData) {
    // const arr = [];
    //
    // if (facilityData.length === 0 && !this.facilityId) {
    //   this.mapService.locateToUserCity();
    // }
    //
    // facilityData.forEach(item => {
    //   arr.push(this.mapService.createMarker(item, this.fn));
    // });
    // this.mapService.addMarkerClusterer(arr, this.cb);
    //
    // if (!this.facilityId) {
    //   this.mapService.setCenterPoint(this.defaultZoom);
    // } else {
    //   this.selectMarker();
    // }
    // this.mapEvent.emit({type: 'isInit'});

    const arr = [];
    const that = this;
    // 区域点
    if (facilityData[0].code) {
      facilityData.forEach(item => {
        arr.push(this.mapService.createMarker(item, this.areaPoint, 1));
      });
      // 设施设备点
    } else if (facilityData[0].deviceId) {
      facilityData.forEach(item => {
        arr.push(this.mapService.createMarker(item, this.fn));
      });
      // 设备点
    } else {
      facilityData.forEach(item => {
        arr.push(this.mapService.createMarker(item[0], this.en));
      });
    }

    this.mapService.addMarkerClusterer(arr, this.cb);
    if (!this.facilityId) {
      // this.mapService.setCenterPoint(this.defaultZoom);
    } else {
      this.selectMarker();
    }
    this.mapEvent.emit({type: 'isInit'});

  }

  /**
   * 更新marker点
   * param {any[]} facilityData
   */
  updateMarkers(facilityData: any[] = []) {
    // const arr = facilityData.map(item => item.deviceId) || [];
    // const that = this;
    // // 如果总数大于10万，解决卡顿问题之setTimeout
    // if (facilityData.length > 100000) {
    //   setTimeout(function () {
    //     facilityData.forEach(item => {
    //       if (!that.mapService.getMarkerDataById(item.deviceId)) {
    //         that.mapService.updateMarker('add', item, that.fn);
    //       } else {
    //         that.mapService.updateMarker('update', item);
    //       }
    //     });
    //   }, 0);
    // } else {
    //   facilityData.forEach(item => {
    //     if (!that.mapService.getMarkerDataById(item.deviceId)) {
    //       that.mapService.updateMarker('add', item, that.fn);
    //     } else {
    //       that.mapService.updateMarker('update', item);
    //     }
    //   });
    // }

    let arr;
    const that = this;
    if (facilityData[0].code) {
      arr = facilityData.map(item => item.code) || [];
      facilityData.forEach(item => {
        if (!that.mapService.getMarkerDataById(item.deviceId)) {
          that.mapService.updateMarker('add', item, that.areaPoint);
        } else {
          that.mapService.updateMarker('update', item);
        }
      });
    } else {
      arr = facilityData.map(item => item.deviceId) || [];
      facilityData.forEach(item => {
        if (!that.mapService.getMarkerDataById(item.deviceId)) {
          that.mapService.updateMarker('add', item, that.fn);
        } else {
          that.mapService.updateMarker('update', item);
        }
      });
    }


    this.mapService.hideOther(arr);
    this.mapService.markerRedraw();
  }

  /**
   * marker点点击事件
   * param event
   */
  markerClickEvent(event) {
    this.resetTargetMarker();
    const id = event.target.customData.id;
    const data = this.mapService.getMarkerDataById(id);
    const imgUrl = CommonUtil.getFacilityIconUrl(this.iconSize, data.deviceType);
    const _icon = this.mapService.toggleIcon(imgUrl, data.deviceType);
    event.target.setIcon(_icon);
    this.targetMarker = this.mapService.getMarkerById(id);
    this.mapService.panTo(data.lng, data.lat);
    this.mapEvent.emit({type: 'selected', id: id});
  }

  /**
   * 聚合点点击事件
   */
  clustererClickEvent(event, markers) {
    const arr = [];
    event.forEach(marker => {
      const info = this.mapService.getMarkerDataById(marker.customData.id);
      arr.push(info);
    });

    const centerPoint = this.mapService.mapInstance.getCenter();
    const clustererCenter = this.getClustererCenter(arr);

    this.mapService.panTo(clustererCenter.lng, clustererCenter.lat);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.mapEvent.emit({type: 'clickClusterer', data: arr});
    }, 0);
  }


  /**
   * 回路画线
   */
  public loopDrawLine(data, colorStyle): void {
    this.mapService.loopDrawLine(data, colorStyle);
    // 根据的数据计算出最佳的中心点和缩放级别
    const view = this.mapService.getViewport(data);
    // baidu地图计算最佳中心点以及缩放级别
    // 最佳缩放级别
    const mapZoom = view.zoom;
    // 最佳中心点
    const centerPoint = view.center;
    alert(mapZoom);
    this.mapService.setCenterAndZoom(centerPoint.lng, centerPoint.lat, mapZoom);
  }


  /**
   * 区域点点击事件
   */
  areaClickEvent(event, markers) {
    this.mapEvent.emit({type: 'areaPoint', data: event});
  }


  /**
   * 获取聚合点的中心点
   * param markers
   * returns {{lat: number; lng: number}}
   */
  getClustererCenter(markers) {
    let sumLng = 0, sumLat = 0;
    markers.forEach(info => {
      sumLng += parseFloat(info.lng);
      sumLat += parseFloat(info.lat);
    });
    const _avgLng = sumLng / markers.length;
    const _avgLat = sumLat / markers.length;
    return {
      lat: _avgLat,
      lng: _avgLng
    };
  }

  /**
   * 模拟title提示框  区域点
   * param e
   */
  openAInfoWindow(e, m) {
    const id = e.target.customData.code;
    const info = this.mapService.getMarkerDataById(id);
    const equipment = [];
    if (this.$mapCoverageService.showCoverage === 'facility') {
      info.equipmentData.forEach(item => {
        const obj = {};
        obj['equipmentType'] = CommonUtil.getFacilityIconClassName(item.equipmentType);
        obj['equipmentCount'] = item.count;
        equipment.push(obj);
      });
    }
    this.infoData = {
      type: 'a',
      data: {
        count: info.count,
        equipment: equipment,
        alarmData: []
      }
    };
    this.showInfoWindow('a', info.lng, info.lat);
  }


  /**
   * 设施点
   * param e
   */
  openMInfoWindow(e, m) {
    let id;
    if (this.mapConfig.mapType === 'google') {
      id = e.target.customData.id;
    } else {
      id = e.currentTarget.customData.id;
    }
    const info = this.mapService.getMarkerDataById(id);
    // const areaLevel = this.getAreaLevel(info.areaId);
    if (this.$mapCoverageService.showCoverage === 'facility' && info.deviceId) {
      info.equipmentDataList.forEach(item => {
        item['_equipmentStatus'] = this.getDeviceStatusColor(item.equipmentStatus);
        item['_equipmentType'] = CommonUtil.getEquipmentIconClassName(item.equipmentType);
      });
      this.infoData = {
        type: 'm',
        data: {
          deviceName: info.deviceName,
          deviceStatusName: this.getFacilityStatusName(info.deviceStatus),
          deviceStatusColor: this.getDeviceStatusColor(info.deviceStatus),
          // areaLevelName: this.getAreaLevelName(areaLevel),
          // areaLevelColor: this.getAreaLevelColor(areaLevel),
          areaLevelName: this.getAreaLevelName('1'),
          areaLevelColor: this.getAreaLevelColor('1'),
          areaName: info.areaName,
          address: info.address,
          deployStatusColor: this.getDeviceDeployColor(info.deployStatus),
          deployStatusName: this.getDeviceDeployName(info.deployStatus),
          equipmentDataList: info.equipmentDataList,
        }
      };
    }
    this.showInfoWindow('m', info.lng, info.lat);
  }

  /**
   * 设备点
   * param e
   */
  openEInfoWindow(e, m) {
    let id;
    if (this.mapConfig.mapType === 'google') {
      id = e.target.customData.id;
    } else {
      id = e.currentTarget.customData.id;
    }
    const info = this.mapService.getMarkerDataById(id);
    // const areaLevel = this.getAreaLevel(info.areaId);
    if (info.equipmentList.length === 1) {
      this.infoData = {
        type: 'm',
        data: {
          deviceName: info.equipmentName,
          deviceStatusName: this.getFacilityStatusName(info.equipmentStatus),
          deviceStatusColor: this.getDeviceStatusColor(info.equipmentStatus),
          // areaLevelName: this.getAreaLevelName(areaLevel),
          // areaLevelColor: this.getAreaLevelColor(areaLevel),
          areaLevelName: this.getAreaLevelName('1'),
          areaLevelColor: this.getAreaLevelColor('1'),
          areaName: info.areaName,
          address: info.address,
          // deployStatusColor: '',
          // deployStatusName: '',
          equipmentDataList: [],
        }
      };
    } else {
      const equipmentNameList = info.equipmentList.map(item => {
        const obj = {
          equipmentName: item.equipmentName,
          equipmentType: CommonUtil.getEquipmentIconClassName(item.equipmentType)
        };
        return obj;
      });
      this.infoData = {
        type: 'e',
        data: {
          equipmentData: equipmentNameList,
        }
      };
    }
    this.showInfoWindow('m', info.lng, info.lat);
  }

  /**
   * 设备重合点弹框
   */
  openETableWindow(e, m) {
    let id;
    if (this.mapConfig.mapType === 'google') {
      id = e.target.customData.id;
    } else {
      id = e.currentTarget.customData.id;
    }
    const info = this.mapService.getMarkerDataById(id);
    // const areaLevel = this.getAreaLevel(info.areaId);

    if (info.equipmentList.length > 1) {
      this.isShowTableWindow = true;
      this.initEquipmentTableConfig();
      this.setData = info.equipmentList.map(item => {
        const obj = {
          areaName: item.areaName,
          equipmentName: item.equipmentName
        };
        return obj;
      });
    }
  }


  /**
   * 模拟title提示框  聚合点点
   * param e
   * param markers
   */
  openCInfoWindow(e, markers = []) {
    const obj = {};
    const _markers = [];
    markers.forEach(marker => {
      const info = this.mapService.getMarkerDataById(marker.customData.id);
      _markers.push(info);
      if (obj[info.deviceType]) {
        obj[info.deviceType].push(info);
      } else {
        obj[info.deviceType] = [info];
      }
    });
    const clustererCenter = this.getClustererCenter(_markers);
    const arr = [];
    Object.keys(obj).forEach(key => {
      arr.push({
        deviceType: key,
        className: CommonUtil.getFacilityIconClassName(key),
        deviceTypeName: this.getFacilityTypeName(key),
        count: `（${obj[key].length}）`
      });
    });
    this.infoData = {
      type: 'c',
      data: arr
    };
    this.showInfoWindow('c', clustererCenter.lng, clustererCenter.lat);
  }

  /**
   * 设置iconSize
   * param previousValue
   */
  setIconSize(previousValue) {
    const size = this.iconSize.split('-');
    this._iconSize = this.mapService.createSize(size[0], size[1]);
    if (this.mapService && previousValue && previousValue !== this.iconSize) {
      this.mapService.changeAllIconSize(this.iconSize);
    }
    if (this.facilityId) {
      this.selectMarker();
    }
  }

  /**
   * 重置之前选中marker点样式
   */
  resetTargetMarker() {
    if (this.targetMarker) {
      const data = this.mapService.getMarkerDataById(this.targetMarker.customData.id);
      const imgUrl = CommonUtil.getFacilityIconUrl(this.iconSize, data.deviceType, data.deviceStatus);
      const _icon = this.mapService.getIcon(imgUrl, this._iconSize);
      this.targetMarker.setIcon(_icon);
    }
  }

  /**
   * 鼠标移入显示信息
   * param info   设施点信息
   * param type   类型  c：聚合点 m：marker点
   */
  showInfoWindow(type, lng, lat) {
    const pixel = this.mapService.pointToOverlayPixel(lng, lat);
    const offset = this.mapService.getOffset();
    let _top = offset.offsetY + pixel.y;
    if (type === 'c') {
      _top = _top - 20;
    } else if (type === 'm') {
      const iconHeight = parseInt(this._iconSize.height, 10);
      _top = _top - iconHeight + 16;
      if (this.mapType === 'google') {
        _top = _top - 10;
      }
    }
    this.infoWindowLeft = offset.offsetX + pixel.x + 'px';
    this.infoWindowTop = _top + 'px';
    this.isShowInfoWindow = true;
  }

  /**
   * 鼠标移入显示信息
   * param info   设施点信息
   * param type   类型  c：聚合点 m：marker点
   */
  showTableWindow(type, lng, lat) {
    const pixel = this.mapService.pointToOverlayPixel(lng, lat);
    const offset = this.mapService.getOffset();
    let _top = offset.offsetY + pixel.y;
    if (type === 'c') {
      _top = _top - 20;
    } else if (type === 'm') {
      const iconHeight = parseInt(this._iconSize.height, 10);
      _top = _top - iconHeight + 16;
      if (this.mapType === 'google') {
        _top = _top - 10;
      }
    }
    this.infoWindowLeft = offset.offsetX + pixel.x + 'px';
    this.infoWindowTop = _top + 'px';
    this.isShowInfoWindow = true;
  }

  /**
   * 鼠标移出隐藏信息
   */
  hideInfoWindow() {
    this.isShowInfoWindow = false;
  }

  /**
   * 获取设施类型名称
   * param deviceType
   * returns {any | string}
   */
  getFacilityTypeName(deviceType) {
    return this.indexLanguage[FACILITY_TYPE_NAME[deviceType]] || '';
  }

  /**
   * 地图添加监听
   */
  addEventListenerToMap() {
    this.mapService.mapEventHook().subscribe(data => {
      const type = data.type;
      const target = data.target;
      // 聚合点
      if (target === 'c') {
        if (type === 'click') {
          this.clustererClickEvent(data.event, data.markers);
        } else if (type === 'mouseover') {
          this.openCInfoWindow(data.event, data.markers);
        } else if (type === 'mouseout') {
          this.hideInfoWindow();
        } else {
        }
      } else {
        // 标记点
        if (type === 'zoomend') {
          this.hideInfoWindow();
          this.hiddenShowTableWindow();
        } else if (type === 'dragend') {
          this.resetTargetMarker();
          this.hideInfoWindow();
          this.hiddenShowTableWindow();
          this.mapEvent.emit({type: 'mapDrag'});
          this.closeOverlayInfoWindow();
        } else if (type === 'click') {
          this.resetTargetMarker();
          this.hiddenShowTableWindow();
          this.mapEvent.emit({type: 'mapBlackClick'});
        }
      }
    });
    // 地图缩放
    this.mapService.mapInstance.addEventListener('zoomend', () => {
      // 操作防抖，两秒后执行操作
      this.zoomEnd();
    });
    // 拖拽结束
    this.mapService.mapInstance.addEventListener('dragend', () => {
      // 操作防抖，两秒后执行操作
      this.dragEnd();
    });
  }

  /**
   * 缩放防抖
   */
  zoomEnd = lodash.debounce(() => {
    // 缩放层级
    if (this.mapService.getZoom() <= 13) {
      // 清除设施设备点
      this.clearDeviceListData();
      // 还原设施或设备以外所有的点
      if (this.mapCloneData && this.mapCloneData.length > 0) {
        this.addMarkers(this.mapCloneData);
      }
    }
    if (this.mapService.getZoom() > 13) {
      // 清除设施或设备以外所有的点
      this.mapService.mapInstance.clearOverlays();
      // 获取窗口内的区域下设施设备点数据
      this.getWindowAreaDatalist();
    }
  }, 2000, {leading: false, trailing: true});

  /**
   * 平移防抖
   */
  dragEnd = lodash.debounce(() => {
    if (this.mapService.getZoom() > 13) {
      // 获取窗口内的区域下设施设备点数据
      this.getWindowAreaDatalist();
    }
  }, 2000, {leading: false, trailing: true});

  /**
   * 获取窗口内的区域下设施设备点数据
   */
  getWindowAreaDatalist(): void {
    // 创建之前先清除设施设备点
    this.clearDeviceListData();
    // 获取可视区域
    const bs = this.mapService.mapInstance.getBounds();
    // 可视区域左下角
    const bssw = bs.getSouthWest();
    // 可视区域右上角
    const bsne = bs.getNorthEast();
    const areaCode = [];
    if (!this.mapCloneData) {
      return;
    }
    // 遍历所有区域点，查找在视图区域内的区域点
    this.mapCloneData.forEach(item => {
      if ((item.lng > bssw.lng && item.lat > bssw.lat) &&
        (item.lng < bsne.lng && item.lat < bsne.lat)) {
        areaCode.push(item.code);
      }
    });
    if (areaCode && areaCode.length > 0) {
      // 创建设施点
      if (this.$mapCoverageService.showCoverage === 'facility') {
        this.getMapDeviceData(areaCode);
      } else {
        this.getMapEquipmentData(areaCode);
      }
    }
  }

  /**
   * 清除设施设备点
   */
  clearDeviceListData(): void {
    // 获取缓存设施设备数据
    let data;
    if (this.$mapCoverageService.showCoverage === 'facility') {
      data = this.$mapStoreService.mapDeviceList ? this.$mapStoreService.mapDeviceList : [];
    } else {
      data = this.$mapStoreService.mapEquipmentList ? this.$mapStoreService.mapEquipmentList : [];
    }
    // 清除设施设备点
    data.forEach(item => {
      this.mapService.updateMarker('delete', item);
    });
    // 重汇聚合点
    // this.mapService.markerClusterer.redraw();
  }

  /**
   * 创建设施点
   */
  getMapDeviceData(areaData): void {
    // 缓存读取筛选条件区域数据
    const areaStoreData = this.$mapStoreService.areaSelectedResults;
    // 缓存读取筛选条件设施类型数据
    const facilityStoreData = this.$mapStoreService.facilityTypeSelectedResults;
    this.areaFacilityModel.polymerizationType = '1';
    this.areaFacilityModel.codeList = areaData;
    this.areaFacilityModel.filterConditions.area = areaStoreData ? areaStoreData : [];
    this.areaFacilityModel.filterConditions.device = facilityStoreData ? facilityStoreData : [];
    this.areaFacilityModel.filterConditions.group = [];
    this.$indexApiService.queryDevicePolymerizations(this.areaFacilityModel).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.deviceDataList = result.data;
        // 分割坐标点字符串
        const centerPoint = this.deviceDataList.positionCenter.split(',');
        const pointData = {lng: centerPoint[0], lat: centerPoint[1]};
        this.deviceDataList.deviceData.forEach(item => {
          this.deviceList.forEach(_item => {
            if (item.deviceType === _item) {
              item['isCreate'] = true;
            }
          });
          const devicePoint = item.positionBase.split(',');
          item['lng'] = +devicePoint[0];
          item['lat'] = +devicePoint[1];
          item['code'] = null;
        });
        this.addMarkers(this.deviceDataList.deviceData);
        this.$mapStoreService.mapDeviceList = this.deviceDataList.deviceData;
        // this.zoomIn();
        // this.centerAndZoom(pointData);
      }
    });
  }

  /**
   * 创建设备点
   */
  getMapEquipmentData(areaData): void {
    // 缓存读取筛选条件区域数据
    const areaStoreData = this.$mapStoreService.areaSelectedResults;
    // 缓存读取筛选条件设备类型数据
    const equipmentStoreData = this.$mapStoreService.equipmentTypeSelectedResults;
    // this.areaFacilityModel.polymerizationType = '1';
    // this.areaFacilityModel.codeList = areaData;
    // this.areaFacilityModel.filterConditions.area = areaStoreData ? areaStoreData : [];
    // this.areaFacilityModel.filterConditions.device = equipmentStoreData ? equipmentStoreData : [];
    // this.areaFacilityModel.filterConditions.group = [];
    this.areaFacilityModel.polymerizationType = '1';
    this.areaFacilityModel.codeList = ['001', '002', '003', '004', '005'],
      this.areaFacilityModel.filterConditions.area = ['001', '002', '003', '004', '005'],
      this.areaFacilityModel.filterConditions.equipment = ['001', '002', '003', '004', '005'],
      this.areaFacilityModel.filterConditions.group = [];
    this.$indexApiService.queryEquipmentPolymerizations(this.areaFacilityModel).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.equipmentDataList = result.data;
        const centerPoint = this.equipmentDataList.positionCenter.split(',');
        const pointData = {lng: centerPoint[0], lat: centerPoint[1]};
        this.equipmentDataList.equipmentData.forEach(item => {
          item.forEach(_item => {
            const a = _item.positionBase.split(',');
            _item['lng'] = +a[0];
            _item['lat'] = +a[1];
            _item['code'] = null;
          });
          item[0]['equipmentList'] = item;
        });
        this.addMarkers(this.equipmentDataList.equipmentData);
        this.$mapStoreService.mapEquipmentList = this.equipmentDataList.equipmentData;
        // this.zoomIn();
        // this.centerAndZoom(pointData);
      }
    });
  }

  /**
   * 设施选中
   */
  selectMarker() {
    // 重置之前的样式
    this.resetTargetMarker();
    // 拿到标记点
    let marker = this.mapService.getMarkerById(this.facilityId);
    let imgUrl;
    if (!marker) {
      // 该设施无法定位
      // 新增数据和地图上没有缓存的数据
      for (const [key, value] of this.$mapStoreService.mapData) {
        if (key === this.facilityId) {
          marker = value.info;
          this.mapService.createMarker(marker, this.fn);
          this.selectMarker();
        }
      }
      this.mapService.setCenterAndZoom(marker.lng, marker.lat, this.maxZoom);
      // this.$modalService.warning(this.indexLanguage.noDeviceSetting);
    } else {
      // 地图缓存的数据
      const data = this.mapService.getMarkerDataById(this.facilityId);
      this.mapService.setCenterAndZoom(data.lng, data.lat, this.maxZoom);
      imgUrl = CommonUtil.getFacilityIconUrl(this.iconSize, data.deviceType);
      const _icon = this.mapService.getIcon(imgUrl, this._iconSize);
      marker.setIcon(_icon);
      this.targetMarker = marker;
    }

  }

  /**
   * 获取地图中心点
   */
  centerAndZoom(data) {
    this.mapService.setCenterAndZoom(data.lng, data.lat, this.maxZoom);
  }

  /**
   * 地图缩小
   * 数字越小，级别越高
   */
  zoomOut() {
    this.mapService.zoomIn();

  }

  /**
   * 地图放大
   * 数字越大，级别越小
   */
  zoomIn() {
    this.mapService.zoomOut(2);
  }

  /**
   * 监听input
   */
  onInput(value: string): void {
    const _value = value.trim();
    this.options = this.data.filter(item => {
      return item.deviceName.includes(_value);
    });
  }


  /**
   * 地图可视区域内的点
   */
  private getOverlayPath() {

    if (this.mapType === 'baidu') {
      const bound = this.mapService.mapInstance.getBounds(); // 地图可视区域
      this.mapService.getMarkerMap().forEach(value => {
        if (bound.containsPoint(value.marker.point) === true) {
        }
      });
    } else {
      // 谷歌地图
      const point = this.mapService.mapInstance.getBounds();
      this.mapService.getMarkerMap().forEach(value => {
        if (point.contains(value.marker.position)) {
          const imgUrl = CommonUtil.getFacilityIconUrl(iconSize, value.data.deviceType);
          const icon = this.mapService.toggleIcon(imgUrl);
          this.mapService.getMarkerById(value.data.deviceId).setIcon(icon);
        }
      });
    }
  }


  /**
   * 键盘事件
   */
  keyDownEvent() {
    this.locationById(this.inputValue);
  }

  /**
   * 清除搜索事件
   */
  clearSearch() {
    this.inputValue = '';
    this.options = [];
  }


  /**
   * 下拉框事件
   */
  optionChange(event, id) {
    this.locationById(id);
  }

  /**
   * 定位通过id
   */
  locationById(id) {
    const data = this.mapService.getMarkerDataById(id);
    if (!data) {
      return;
    }
    this.facilityId = id;
    this.selectMarker();
    this.mapEvent.emit({type: 'selected', id});
  }

  /**
   * 设施名称搜索
   */
  searchFacilityName() {
    this.searchTypeName = this.indexLanguage.searchDeviceName;
    this.IndexObj = {
      facilityNameIndex: 1,
      bMapLocationSearch: -1,
      gMapLocationSearch: -1,
    };
  }

  /**
   * 地址搜索
   */
  searchAddress() {
    this.searchTypeName = this.indexLanguage.searchAddress;
    if (this.mapType === 'baidu') {
      this.IndexObj = {
        facilityNameIndex: -1,
        bMapLocationSearch: 1,
        gMapLocationSearch: -1,
      };
    } else if (this.mapType === 'google') {
      this.IndexObj = {
        facilityNameIndex: -1,
        bMapLocationSearch: -1,
        gMapLocationSearch: 1,
      };
    } else {
    }
  }

  /**
   * 定位
   */
  location() {
    const key = this.searchKey.trim();
    if (!key) {
      return;
    }
    this.mapService.locationByAddress(key);
  }

  /**
   * 设置地图类型
   * terrain  roadmap  hybrid  satellite
   */
  setMapType(type) {
    this.mapTypeId = type;
    this.mapService.setMapTypeId(type);
  }

  /**
   * 获取设施状态名字
   */
  getFacilityStatusName(status) {
    return this.indexLanguage[FACILITY_STATUS_NAME[status]] || '';
  }

  /**
   * 获取区域级别名字
   */
  getAreaLevelName(level) {
    const levelName = this.commonLanguage[AREA_LEVEL_NAME[level]] || '';
    if (this.typeLg === 'US') {
      return `${this.commonLanguage.level}${levelName}`;
    } else {
      return `${levelName}${this.commonLanguage.level}`;
    }
  }

  /**
   * 获取设施建设状态名字
   */
  getDeviceDeployName(name) {
    return this.commonLanguage[DEVICE_DEPLOY[name]] || '';
  }


  /**
   * 通过id判断告警级别
   * param id
   * returns {string}
   */
  getAreaLevel(id) {
    const level = this.areaDataMap.get(id).areaLevel || '';
    return level.toString();
  }

  /**
   * 获取区域级别颜色
   */
  getAreaLevelColor(level) {
    return AREA_LEVEL_COLOR[level];
  }

  /**
   * 获取设施状态颜色
   */
  getDeviceStatusColor(status) {
    return FACILITY_STATUS_COLOR[status];
  }

  /**
   * 获取设施建设状态颜色
   */
  getDeviceDeployColor(status) {
    return FACILITY_STATUS_COLOR[status];
  }

  /**
   * 设置地图区域数据
   */
  setAreaDataMap() {
    this.areaData.forEach(item => {
      this.areaDataMap.set(item.areaId, item);
    });
  }

  // 地图上关闭右键
  closeRightClick() {
    this.infoData.type = null;
  }

  /**
   * 设置地图设施点事件
   */
  initFn() {
    this.fn = [
      {
        eventName: 'click',
        eventHandler: (event) => {
          this.markerClickEvent(event);

        }
      },
      // 地图上的设施点悬浮显示信息面板
      {
        eventName: 'mouseover',
        eventHandler: (event, m) => {
          this.openMInfoWindow(event, m);
        }
      },
      {
        eventName: 'mouseout',
        eventHandler: () => {
          this.hideInfoWindow();
        }
      },
    ];
  }

  /**
   * 设置地图设备点事件
   */
  initEn() {
    this.en = [
      {
        eventName: 'onclick',
        eventHandler: (event, m) => {
          const id = event.target.customData.id;
          const data = this.mapService.getMarkerDataById(id);
          if (data.equipmentList.length === 1) {
            this.markerClickEvent(event);
          }
        }
      },
      {
        eventName: 'rightclick',
        eventHandler: (event, m) => {
          this.openETableWindow(event, m);
        }
      },
      // 地图上的设施点悬浮显示信息面板
      {
        eventName: 'mouseover',
        eventHandler: (event, m) => {
          this.openEInfoWindow(event, m);
        }
      },
      {
        eventName: 'mouseout',
        eventHandler: () => {
          this.hideInfoWindow();
        }
      },
    ];
  }

  /**
   * 设置地图聚合点
   */
  initCb() {
    this.cb = [
      {
        eventName: 'onmouseover',
        eventHandler: (event, markers) => {
          this.openCInfoWindow(event, markers);
        }
      },
      {
        eventName: 'onmouseout',
        eventHandler: (event) => {
          this.hideInfoWindow();
        }
      },
      {
        eventName: 'onclick',
        eventHandler: (event, markers) => {
          this.clustererClickEvent(event, markers);

        }
      }
    ];
  }


  /**
   * 设置地图区域点/项目点
   */
  initAreaPoint() {
    this.areaPoint = [
      {
        eventName: 'onmouseover',
        eventHandler: (event, markers) => {
          this.openAInfoWindow(event, markers);
        }
      },
      {
        eventName: 'onmouseout',
        eventHandler: (event) => {
          this.hideInfoWindow();
        }
      },
      {
        eventName: 'onclick',
        eventHandler: (event, markers) => {
          this.areaClickEvent(event, markers);

        }
      }
    ];
  }

  /**
   * 关闭多重设备弹窗
   */
  hiddenShowTableWindow() {
    this.isShowTableWindow = false;
    this.setData = [];
  }

  /**
   * 高亮
   */
  showLight() {
    this.isVisible = true;
    this.justRefreshData();
    this.isLight = 1;

  }

  /**
   * 查看拓扑
   */
  check() {
    this.isVisible = true;
    this.justRefreshData();
    this.isLight = 2;
  }

  /**
   * 关闭表格
   */
  modalCancel() {
    this.isVisible = false;
  }

  /**
   *选择光缆后点击确定
   */
  showTopology() {
    if (this.selectedAlarmId === null) {
      this.$modalService.warning(this.indexLanguage.chooseFibre);
    } else {
      if (this.isLight === 2) {
        this.isVisible = false;
        this.navigateToDetail(`business/topology`, {queryParams: {opticCableId: this.selectedAlarmId}});
      } else {
        this.isVisible = false;
        this.mapEvent.emit({type: 'showLight', data: this.lightData});
        this.showLightData(this.selectedAlarmId);

      }
    }
  }

  /**
   *点聚合列表点击跳转查看拓扑
   */
  isShowTopolgy(id) {
    this.isVisible = true;
    this.justId = id;
    this.justRefreshData();
    this.isLight = 2;
  }

  /**
   *点聚合列表点击跳转查看高亮
   */
  isShowLight(id) {
    this.isVisible = true;
    this.justId = id;
    this.justRefreshData();
    this.isLight = 1;
    this.infoData.type = null;
  }

  /**
   * 传参显示高亮
   */
  showLightData(id) {
    this.mapService.clearLine();
    this.gisDataList = [];
    const points = [];
    this.$facilityService.cableSectionId(id).subscribe((result: Result) => {
      if (result.data.length > 0) {
        result.data.forEach((itemOne) => { // 小数组
          this.gisData = itemOne;
          this.gisData.map(item => {
            item.lng = item.position.split(',')[0];
            item.lat = item.position.split(',')[1];
            points.push({'lng': item.lng, 'lat': item.lat});
          });
          this.mapService.newAddLine(this.gisData);
          if (this.mapType === 'google') {
            // google地图计算最佳中心点以及缩放级别
            this.mapService.getViewport(points);
          } else {
            // 根据后台返回的数据计算出最佳的中心点和缩放级别
            const view = this.mapService.getViewport(points);
            // baidu地图计算最佳中心点以及缩放级别
            // 最佳缩放级别
            const mapZoom = view.zoom;
            // 最佳中心点
            const centerPoint = view.center;
            this.mapService.setCenterAndZoom(centerPoint.lng, centerPoint.lat, mapZoom);
          }
          this.infoData.type = null;
        });
      } else {
        this.$modalService.warning(this.indexLanguage.noData);
      }
    });
  }

  // 退出高亮模式
  clearLight() {
    this.mapService.clearLine();

  }

  /**
   * 跳转到详情
   * param url
   */
  navigateToDetail(url, extras = {}) {
    this.$router.navigate([url], extras).then();
  }

  /**
   *获取光缆信息列表
   */
  justRefreshData() {
    this.tableConfig.isLoading = true;
    this.queryCondition.pageCondition.pageSize = 10;
    this.queryCondition.bizCondition.deviceId = this.justId;
    this.$facilityService.getCableList(this.queryCondition).subscribe((result: Result) => {
      this.pageBean.Total = result.totalCount;
      this.tableConfig.isLoading = false;
      const data = result.data;
      data.forEach(item => {
        item.opticCableLevel = getCableLevel(this.$nzI18n, item.opticCableLevel);
      });
      this._dataSet = result.data;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   *光缆信息列表分页
   */
  pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.justRefreshData();
  }

  /**
   * 选择告警
   * param event
   * param data
   */
  selectedAlarmChange(event, data) {
    this.lightData = data;
  }

  // 光缆配置
  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      showPagination: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: true,
      showSearchExport: false,
      noIndex: true,
      scroll: {x: '1000px', y: '600px'},
      columnConfig: [
        {
          title: '',
          type: 'render',
          key: 'selectedAlarmId',
          renderTemplate: this.radioTemp,
          width: 42
        },
        {
          title: this.language.cableName, key: 'opticCableName', width: 124,
        },
        {
          title: this.language.cableLevel, key: 'opticCableLevel', width: 80,
        },
        {
          title: this.language.localNetworkCode, key: 'localCode', width: 124,
        },
        {
          title: this.language.cableTopology, key: 'topology', width: 104,
        },
        {
          title: this.language.wiringType, key: 'wiringType', width: 80,
        },
        {
          title: this.language.cableCore, key: 'coreNum', width: 124,
        },
        {
          title: this.language.length, key: 'length', width: 70,
        },
        {
          title: this.language.businessInformation, key: 'bizId', width: 124,
        },
        {
          title: this.language.remarks, key: 'remark', width: 124,
        },

      ]
    };
  }

  public initEquipmentTableConfig(): void {
    this.equipmentTableConfig = {
      isDraggable: false,
      isLoading: false,
      scroll: {x: '440px', y: '250px'},
      searchReturnType: 'object',
      topButtons: [],
      simplePage: false,
      noIndex: true,
      columnConfig: [
        {
          title: this.language.areaName, key: 'areaName', width: 100,
        },
        {
          title: this.language.equipmentName, key: 'equipmentName', width: 100,
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 70, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        }
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      sort: (event) => {
      },
      operation: [
        {
          // 定位
          text: this.language.location,
          permissionCode: '06-1-1-6',
          className: 'fiLink-filink-location-icon',
          handle: (currentIndex) => {
            console.log(currentIndex);
            this.$businessFacilityService.eventEmit.emit({positionBase: currentIndex.positionBase, id: currentIndex.equipmentId});
          }
        },
      ],
      handleSearch: (event) => {
      },
    };
  }

  public changChooseUtil(): void {
    this.$businessFacilityService.eventEmit.subscribe((value) => {
      if (value.isShow === true) {
        this.chooseUtil('rectangle');
      }
      if (value.isShow === false) {
        this.clearAll();
      }
    });
  }

  public addEventListener(): void {
    this.mapDrawUtil.setDrawingMode(null);
    // 添加鼠标绘制工具监听事件，用于获取绘制结果
    this.mapDrawUtil.addEventListener('overlaycomplete', (e) => {
      this.overlays.push(e.overlay);
      this.getOverlayPath();
      this.drawType = BMAP_ARROW;
      this.mapDrawUtil.close();
      this.mapDrawUtil.setDrawingMode(null);
    });
  }


  /**
   * 选择绘画工具
   * param event
   */
  public chooseUtil(event): void {
    this.drawType = event;
    if (event === BMAP_DRAWING_RECTANGLE) {
      this.mapDrawUtil.open();
      this.mapDrawUtil.setDrawingMode(BMAP_DRAWING_RECTANGLE);
    } else if (event === BMAP_ARROW) {
      this.mapDrawUtil.setDrawingMode(null);
      this.mapDrawUtil.close();
    }
  }

  /**
   * 清除所有的覆盖物
   */
  public clearAll(): void {
    for (let i = 0; i < this.overlays.length; i++) {
      this.mapService.removeOverlay(this.overlays[i]);
    }
    this.overlays.length = 0;
    this.drawType = BMAP_ARROW;
    this.mapDrawUtil.close();
    this.mapDrawUtil.setDrawingMode(null);
  }
}
