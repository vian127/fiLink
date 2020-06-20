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
import {TableComponent} from '../table/table.component';
import {PageBean} from '../../entity/pageBean';
import {MapSelectorConfig} from '../../entity/mapSelectorConfig';
import {MapDrawingService} from './map-drawing.service';
import {BMAP_ARROW, BMAP_DRAWING_RECTANGLE, DEFAUT_ZOOM, iconSize} from './map.config';
import {MapService} from '../../../core-module/api-service/index/map';
import {Result} from '../../entity/result';
import {getDeviceStatus, getDeviceType} from '../../../business-module/facility/share/const/facility.config';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../util/common-util';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {TableConfig} from '../../entity/tableConfig';
import {AreaService} from '../../../core-module/api-service/facility';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {IndexLanguageInterface} from '../../../../assets/i18n/index/index.language.interface';
import {MapConfig as GMapConfig} from '../map/g-map.config';
import {FACILITY_STATUS_COLOR} from '../../const/facility';
import {AREA_LEVEL_COLOR, AREA_LEVEL_NAME} from '../../const/area';
import {InspectionLanguageInterface} from '../../../../assets/i18n/inspection-task/inspection.language.interface';
import {GMapPlusService} from '../../service/map-service/g-map/g-map-plus.service';
import {BMapPlusService} from '../../service/map-service/b-map/b-map-plus.service';
import {MapServiceUtil} from '../../service/map-service/map-service.util';
import {BMapDrawingService} from '../../service/map-service/b-map/b-map-drawing.service';
import {GMapDrawingService} from '../../service/map-service/g-map/g-map-drawing.service';

declare const BMap: any;
declare const BMapLib: any;
declare const BMAP_ANCHOR_TOP_LEFT: any;
declare const BMAP_ANCHOR_TOP_RIGHT: any;
declare const MAP_TYPE;

/**
 * 地图选择器组件
 */
@Component({
  selector: 'xc-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.scss']
})
export class MapSelectorComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  // 选择器配置
  @Input()
  mapSelectorConfig: MapSelectorConfig;
  // 显示隐藏变化
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 选择数据事件
  @Output() selectDataChange = new EventEmitter<any[]>();
  // table实例
  @ViewChild(TableComponent) childCmp: TableComponent;
  // 去选模板
  @ViewChild('handleTemp') handleTemp: TemplateRef<any>;
  // 地图选择器dom
  @ViewChild('mapSelectorDom') mapSelectorDom: ElementRef<any>;
  // 选择器分页
  selectPageBean: PageBean = new PageBean(10, 1, 0);
  // 区域id
  @Input()
  areaId;
  // 选择器table配置
  selectorConfig: TableConfig;
  // 选择器数据
  selectData = [];
  // 已选择分页数据
  selectPageData = [];
  // 地图实例
  mapInstance;
  // 地图绘画工具
  mapDrawUtil: MapDrawingService;
  // 地图服务
  mapService: BMapPlusService | GMapPlusService;
  // 覆盖物集合
  overlays = [];
  // 地图数据
  mapData = [];
  // 被选总数
  treeNodeSum;
  // 设施数据
  facilityData = [];
  // 第一次的数据
  firstData = [];
  // 绘制类型
  public drawType: string = BMAP_ARROW;
  // 地图类型
  public mapType: string = 'baidu';
  // 是否加载
  isLoading = false;
  // 搜索key
  searchKey;
  // 区域没有设施
  public areaNotHasDevice: boolean;
  // 设施信息面板展示
  isShowInfoWindow: boolean = false;
  // 设施信息面板left
  infoWindowLeft;
  // 设施信息面板top
  infoWindowTop;
  // 设施信息面板数据
  infoData = {type: '', data: {}};
  // 区域集合map
  areaMap = new Map<string, any>();
  // 公共语言包
  language: CommonLanguageInterface;
  // 是否显示进度条
  isShowProgressBar = true;
  // 进度条百分比
  percent = 0;
  // 搜素框vale
  inputValue;
  // 搜素结果选项
  options: string[] = [];
  // 首页语言包
  indexLanguage: IndexLanguageInterface;
  // 国际化
  public InspectionLanguage: InspectionLanguageInterface;
  // 搜素类型名称
  searchTypeName;
  // 搜素类型显示隐藏
  IndexObj = {
    facilityNameIndex: 1,
    bMapLocationSearch: -1,
    gMapLocationSearch: -1,
  };
  // 最大缩放级别
  public maxZoom: any;
  // 语言类型
  public typeLg;
  // 进度条增长百分比
  private increasePercent: number;
  // 进度条定时器
  private timer: any;

  constructor(public $mapService: MapService,
              public $areaService: AreaService,
              public $modalService: FiLinkModalService,
              public $i18n: NzI18nService) {
  }

  _xcVisible = false;

  get xcVisible() {
    return this._xcVisible;
  }

  @Input()
  set xcVisible(params) {
    this._xcVisible = params;
    this.xcVisibleChange.emit(this._xcVisible);
  }

  ngOnInit() {
    this.mapType = MAP_TYPE;
    this.language = this.$i18n.getLocaleData('common');
    this.indexLanguage = this.$i18n.getLocaleData('index');
    this.InspectionLanguage = this.$i18n.getLocaleData('inspection');
    this.searchTypeName = this.indexLanguage.searchDeviceName;
    // 语言类型
    this.typeLg = JSON.parse(localStorage.getItem('localLanguage'));
    this.initSelectorConfig();
    // 获取区域列表
    this.getAreaInfoCurrentUser();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.getALLFacilityList();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  /**
   * 选择绘画工具
   * param event
   */
  chooseUtil(event) {
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
   * 取消
   */
  handleCancel() {
    this.xcVisible = false;
  }

  /**
   * 确定
   */
  handleOk() {
    this.setAreaDevice();
  }

  /**
   * 佐罗弹框加载地图方式
   */
  afterModelOpen() {
    if (!this.mapInstance) {
      this.initMap();
    }
  }

  /**
   * 清空数据
   */
  restSelectData() {
    this.selectData.forEach(item => {
      const imgUrl = CommonUtil.getFacilityIconUrl(iconSize, item.deviceType, '1');
      const icon = this.mapService.toggleIcon(imgUrl);
      this.mapService.getMarkerById(item.deviceId).setIcon(icon);
    });
    this.firstData.forEach(item => {
      const imgUrl = CommonUtil.getFacilityIconUrl(iconSize, item.deviceType, '0');
      const icon = this.mapService.toggleIcon(imgUrl);
      this.mapService.getMarkerById(item.deviceId).setIcon(icon);
    });
    this.selectData = this.firstData;
    this.refreshSelectPageData();

  }

  /**
   * 刷新数据
   */
  refreshSelectPageData() {
    this.selectPageBean.Total = this.selectData.length;
    this.selectPageData = this.selectData.slice(this.selectPageBean.pageSize * (this.selectPageBean.pageIndex - 1),
      this.selectPageBean.pageIndex * this.selectPageBean.pageSize);
  }

  /**
   * 左边表格数据变化
   * param event
   */
  selectPageChange(event) {
    this.selectPageBean.pageIndex = event.pageIndex;
    this.selectPageBean.pageSize = event.pageSize;
    this.selectPageData = this.selectData.slice(this.selectPageBean.pageSize * (this.selectPageBean.pageIndex - 1),
      this.selectPageBean.pageIndex * this.selectPageBean.pageSize);
  }

  /**
   * 定位
   */
  location() {
    const key = this.searchKey.trimLeft().trimRight();
    if (!key) {
      return;
    }
    this.mapService.searchLocation(key, (results, status) => {
      if (status === 'OK') {
        this.mapInstance.setCenter(results[0].geometry.location);
      } else {
        // this.$modalService.error('无结果');
      }
    });
  }

  /**
   * 清除所有的覆盖物
   */
  public clearAll() {
    for (let i = 0; i < this.overlays.length; i++) {
      this.mapService.removeOverlay(this.overlays[i]);
    }
    this.overlays.length = 0;
  }

  /**
   * 从列表中删除
   * param currentItem
   */
  public deleteFormTable(currentItem) {
    const index = this.selectData.findIndex(item => item.deviceId === currentItem.deviceId);
    this.selectData.splice(index, 1);
    this.childCmp.checkStatus();
  }

  /**
   * 添加到列表
   * param item
   */
  public pushToTable(item) {
    const index = this.selectData.findIndex(_item => item.deviceId === _item.deviceId);
    if (index === -1) {
      item.checked = true;
      if (item.areaId && item.areaId !== this.areaId) {
        // item.remarks = `当前选择属于${item.areaName}区`;
        item.rowActive = true;
      }
      this.selectData = this.selectData.concat([item]);
    } else {
    }
  }

  /**
   * 去选
   * param currentItem
   */
  handleDelete(currentItem) {
    if (currentItem) {
      if (this.checkFacilityCanDelete(currentItem)) {
        return;
      }
      // 找到要删除的项目
      const index = this.selectData.findIndex(item => item.deviceId === currentItem.deviceId);
      this.selectData.splice(index, 1);
      this.childCmp.checkStatus();
      // 删除完刷新被选数据
      this.refreshSelectPageData();
      const imgUrl = CommonUtil.getFacilityIconUrl(iconSize, currentItem.deviceType, '1');
      const icon = this.mapService.toggleIcon(imgUrl);
      this.mapService.getMarkerById(currentItem.deviceId).setIcon(icon);
    }
  }

  initSelectorConfig() {
    this.selectorConfig = {
      noIndex: true,
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: false,
      searchTemplate: null,
      scroll: {x: '420px'},
      columnConfig: [
        {type: 'render', renderTemplate: this.handleTemp, width: 30},
        {type: 'serial-number', width: 62, title: this.language.serialNumber},
      ].concat(this.mapSelectorConfig.selectedColumn),
      showPagination: true,
      bordered: false,
      showSearch: false,
      showSizeChanger: false,
      simplePage: true,
      hideOnSinglePage: true,
      handleSelect: (data, currentItem) => {
        // 加入被选容器
        if (currentItem) {
          if (this.checkFacilityCanDelete(currentItem)) {
            return;
          }
          // 找到要删除的项目
          const index = this.selectData.findIndex(item => item.deviceId === currentItem.deviceId);
          this.selectData.splice(index, 1);
          this.childCmp.checkStatus();
          // 删除完刷新被选数据
          this.refreshSelectPageData();
          const imgUrl = CommonUtil.getFacilityIconUrl(iconSize, currentItem.deviceType, '1');
          const icon = this.mapService.toggleIcon(imgUrl);
          this.mapService.getMarkerById(currentItem.deviceId).setIcon(icon);
        }
        if (data && data.length === 0) {
          this.restSelectData();
        }
      },
    };
  }

  afterModelClose() {

  }

  /**
   * 初始化地图
   */
  public initMap() {
    // 实例化地图服务类
    if (this.mapType === 'baidu') {
      this.mapService = new BMapPlusService();
      this.mapService.createPlusMap('_mapContainer');
      this.maxZoom = GMapConfig.maxZoom;
      this.mapService.addLocationSearchControl('_suggestId', '_searchResultPanel');
      // 实例化鼠标绘制工具
      this.mapDrawUtil = new BMapDrawingService(this.mapService.mapInstance);
    } else {
      this.maxZoom = GMapConfig.maxZoom;
      this.mapService = new GMapPlusService();
      this.mapService.createPlusMap('_mapContainer');
      // 实例化鼠标绘制工具
      this.mapDrawUtil = new GMapDrawingService(this.mapService.mapInstance);
    }
    // 添加缩放结束事件
    this.mapService.addZoomEnd(() => {
      this.isShowInfoWindow = false;
    });
    this.mapInstance = this.mapService.mapInstance;
    this.mapDrawUtil.setDrawingMode(null);
    // 添加鼠标绘制工具监听事件，用于获取绘制结果
    this.mapDrawUtil.addEventListener('overlaycomplete', (e) => {
      this.overlays.push(e.overlay);
      this.getOverlayPath();
      this.clearAll();
      this.drawType = BMAP_ARROW;
      this.mapDrawUtil.close();
      this.mapDrawUtil.setDrawingMode(null);
    });
  }

  /**
   * 向地图中添加点
   * param {any[]} facilityData
   */
  public addMarkers(facilityData: any[]) {
    const arr = [];
    facilityData.forEach(item => {
      const status = item.checked ? '0' : '1';
      const iconUrl = CommonUtil.getFacilityIconUrl('18-24', item.deviceType, status);
      const position = item.positionBase.split(',');
      item.lng = parseFloat(position[0]);
      item.lat = parseFloat(position[1]);
      arr.push(this.mapService.createMarker(item,
        [
          {
            eventName: 'click',
            eventHandler: (event, __event) => {
              const icon = event.target.getIcon();
              let _icon;
              const data = this.mapService.getMarkerDataById(event.target.customData.id);
              const imgUrl = CommonUtil.getFacilityIconUrl(iconSize, data.deviceType, '1');
              if (icon.imageUrl === imgUrl || icon.url === imgUrl) {
                const _imgUrl = CommonUtil.getFacilityIconUrl(iconSize, data.deviceType);
                _icon = this.mapService.toggleIcon(_imgUrl);
                this.pushToTable(data);
              } else {
                if (this.checkFacilityCanDelete(data)) {
                  return;
                }
                _icon = this.mapService.toggleIcon(imgUrl);
                this.deleteFormTable(data);
              }
              this.refreshSelectPageData();
              event.target.setIcon(_icon);
            }
          },
          // 地图上的设施点悬浮显示信息面板
          {
            eventName: 'mouseover',
            eventHandler: (event, __event) => {
              // 从map中拿到设施数据
              const data = this.mapService.getMarkerDataById(event.target.customData.id);
              const deviceTypeName = getDeviceType(this.$i18n, data.deviceType);
              const areaLevel = this.areaMap.get(data.areaId).areaLevel;
              this.infoData = {
                type: 'm',
                data: {
                  deviceName: data.deviceName,
                  deviceStatusName: getDeviceStatus(this.$i18n, data.deviceStatus),
                  deviceStatusColor: FACILITY_STATUS_COLOR[data.deviceStatus],
                  areaLevelName: this.getAreaLevelName(areaLevel),
                  areaLevelColor: this.getAreaLevelColor(areaLevel),
                  areaName: data.areaName,
                  address: data.address,
                  className: CommonUtil.getFacilityIconClassName(data.deviceType)
                }
              };
              this.showInfoWindow('m', data.lng, data.lat);
            }
          },
          {
            eventName: 'mouseout',
            eventHandler: () => {
              this.isShowInfoWindow = false;
            }
          }
        ]
      , iconUrl));
    });
    this.mapService.addMarkerClusterer(arr, [
      {
        eventName: 'onmouseover',
        eventHandler: (event, markers) => {
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
          const arrInfo = [];
          Object.keys(obj).forEach(key => {
            arrInfo.push({
              deviceType: key,
              className: CommonUtil.getFacilityIconClassName(key),
              deviceTypeName: getDeviceType(this.$i18n, key),
              count: `（${obj[key].length}）`
            });
          });
          this.infoData = {
            type: 'c',
            data: arrInfo
          };
          const clustererCenter = this.getClustererCenter(_markers);
          this.showInfoWindow('c', clustererCenter.lng, clustererCenter.lat);
        }
      },
      {
        eventName: 'onmouseout',
        eventHandler: (event) => {
          this.isShowInfoWindow = false;
        }
      },
      {
        eventName: 'onclick',
        eventHandler: (event, markers) => {
          markers.forEach(marker => {
            const info = this.mapService.getMarkerDataById(marker.customData.id);
            this.pushToTable(info);
          });
          this.refreshSelectPageData();
        }
      }
    ]);
    this.mapService.setCenterPoint();
    const point = CommonUtil.getLatLngCenter(this.mapService.getMarkerMap());
    this.mapService.setCenterAndZoom(point[1], point[0], DEFAUT_ZOOM);
  }

  /**
   * 检查设备是否能被解除关联
   * param facility
   */
  public checkFacilityCanDelete(facility) {
    if (facility.areaId === this.areaId) {
      this.$modalService.error(this.language.setAreaMsg);
      return true;
    }
  }

  ngOnDestroy(): void {
    this.$modalService.remove();
    this.mapService = null;
  }

  /**
   * 显示加载进度条
   */
  showProgressBar() {
    this.percent = 0;
    this.increasePercent = 5;
    this.isShowProgressBar = true;
    this.timer = setInterval(() => {
      if (this.percent >= 100) {
        clearInterval(this.timer);
      } else {
        this.percent += this.increasePercent;
        if (this.percent === 50) {
          this.increasePercent = 2;
        } else if (this.percent === 80) {
          this.increasePercent = 1;
        } else if (this.percent === 99) {
          this.increasePercent = 0;
        }
      }
    }, 500);
  }

  /**
   * 隐藏加载进度条
   */
  hideProgressBar() {
    this.percent = 100;
    setTimeout(() => {
      this.isShowProgressBar = false;
    }, 1000);
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

  onInput(value: string): void {
    const _value = value.trim();
    this.options = this.facilityData.filter(item => {
      return item.deviceName.includes(_value);
    });
  }

  keyDownEvent(event) {
    if (event.key === 'Enter') {
      this.selectMarker(this.inputValue);
    }
  }

  optionChange(event, id) {
    this.selectMarker(id);
  }

  /**
   * 设施选中
   */
  selectMarker(id) {
    const marker = this.mapService.getMarkerById(id);
    if (!marker) {
      return;
    }
    const data = this.mapService.getMarkerDataById(id);
    const position = data.positionBase.split(',');
    const _lng = parseFloat(position[0]);
    const _lat = parseFloat(position[1]);
    this.mapService.setCenterAndZoom(_lat, _lng, 15);
  }

  /**
   * 获取告警级别名称
   * param level
   * returns {string}
   */
  getAreaLevelName(level) {
    const levelName = this.language[AREA_LEVEL_NAME[level]] || '';
    if (this.typeLg === 'US') {
      return `${this.language.level}${levelName}`;
    } else {
      return `${levelName}${this.language.level}`;
    }
  }

  /**
   * 获取告警级别颜色
   * param level
   * returns {any}
   */
  getAreaLevelColor(level) {
    return AREA_LEVEL_COLOR[level];
  }

  /**
   * 获取当前用户的有权限的区域列表
   */
  getAreaInfoCurrentUser() {
    this.$mapService.getALLAreaListForCurrentUser().subscribe((result: Result) => {
      if (result.code === 0) {
        result.data.forEach(item => {
          this.areaMap.set(item.areaId, item);
        });
      }
    });
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

    } else if (type === 'm') {
      const iconHeight = parseInt('10', 10);
      _top = _top - iconHeight + 16;
      if (this.mapType === 'google') {
        _top = _top - 10;
      }
    }
    // 24 为左边padding
    this.infoWindowLeft = offset.offsetX + 24 + pixel.x + 'px';
    this.infoWindowTop = _top + 'px';
    this.isShowInfoWindow = true;
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
   * 放大
   */
  public zoomOut() {
    this.mapService.zoomIn();
  }

  /**
   * 缩小
   */
  public zoomIn() {
    this.mapService.zoomOut();
  }

  /**
   * 获取框选的点
   */
  private getOverlayPath() {
    const box = this.overlays[this.overlays.length - 1];

    if (box.getPath && this.mapType === 'baidu') {
      const pointArray = box.getPath();
      // this.mapInstance.setViewport(pointArray); // 调整视野
      const bound = this.mapInstance.getBounds(); // 地图可视区域
      this.mapService.getMarkerMap().forEach(value => {
        if (bound.containsPoint(value.marker.point) === true) {
          if (MapServiceUtil.isInsidePolygon(value.marker.point, pointArray)) {
            const imgUrl = CommonUtil.getFacilityIconUrl(iconSize, value.data.deviceType);
            const icon = this.mapService.toggleIcon(imgUrl);
            this.mapService.getMarkerById(value.data.deviceId).setIcon(icon);
            this.pushToTable(value.data);
          }
        }
      });
    } else {
      // 谷歌地图
      const point = box.getBounds();
      this.mapService.getMarkerMap().forEach(value => {
        if (point.contains(value.marker.position)) {
          const imgUrl = CommonUtil.getFacilityIconUrl(iconSize, value.data.deviceType);
          const icon = this.mapService.toggleIcon(imgUrl);
          this.mapService.getMarkerById(value.data.deviceId).setIcon(icon);
          this.pushToTable(value.data);
        }
      });
    }
    this.refreshSelectPageData();
  }

  /**
   * 获取所有的设备点
   */
  private getALLFacilityList() {
    // this.$modalService.loading(this.language.loading, 1000 * 60);
    this.showProgressBar();
    this.$mapService.getALLFacilityList().subscribe((result: Result) => {
      // this.$modalService.remove();
      this.hideProgressBar();
      this.facilityData = result.data || [];
      this.treeNodeSum = this.facilityData.length;
      // 默认该区域下没有设施
      this.areaNotHasDevice = true;
      this.facilityData.forEach(item => {
        item._deviceType = getDeviceType(this.$i18n, item.deviceType);
        if (item.areaId === this.areaId) {
          item.checked = true;
          // 该区域下有设施
          this.areaNotHasDevice = false;
          this.firstData.push(item);
          this.pushToTable(item);
        }
      });
      this.refreshSelectPageData();
      this.addMarkers(this.facilityData);
      // 该区域下没有设施定位到用户登陆到位置
      if (this.areaNotHasDevice) {
        this.mapService.locateToUserCity();
      }
    }, () => {
      // this.$modalService.remove();
      this.hideProgressBar();
    });
  }

  /**
   * 关联设施
   * param body
   */
  private setAreaDevice() {
    this.isLoading = true;
    const list = [];
    // 去除已经属于该区域的设施
    this.selectData.map(item => {
      if (item.areaId !== this.areaId) {
        list.push(item.deviceId);
      }
    });
    const obj = {};
    obj[this.areaId] = list;
    this.$areaService.setAreaDevice(obj).subscribe((result: Result) => {
      this.isLoading = false;
      if (result.code === 0) {
        this.$modalService.success(result.msg);
        this.handleCancel();
      } else {
        this.$modalService.error(result.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }
}
