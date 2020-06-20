import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MapSelectorComponent} from '../map-selector.component';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {AreaService} from '../../../../core-module/api-service/facility';
import {NzI18nService} from 'ng-zorro-antd';
import {MapService} from '../../../../core-module/api-service/index/map';
import {Result} from '../../../entity/result';
import {getDeviceStatus, getDeviceType} from '../../../../business-module/facility/share/const/facility.config';
import {CommonUtil} from '../../../util/common-util';
import {iconSize} from '../map.config';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {FACILITY_STATUS_COLOR} from '../../../const/facility';
import {PageBean} from '../../../entity/pageBean';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';

declare const MAP_TYPE;

/**
 * 巡检设施地图选择器
 */
@Component({
  selector: 'xc-map-selector-inspection',
  templateUrl: './map-selector-inspection.component.html',
  styleUrls: ['../map-selector.component.scss']
})
export class MapSelectorInspectionComponent extends MapSelectorComponent implements OnInit, OnChanges, AfterViewInit {
  // 选择器分页
  selectPageBean: PageBean = new PageBean(10, 1, 0);
  // 传入的设施集合
  @Input()
  deviceSet: any[];
  // 选择器类型 inspection 巡检 setDevice 关联设施（默认不传）
  @Input()
  selectorType: string;
  // 是否关联全集
  @Input()
  isSelectAll;
  // 设施右边表格能否去勾选
  @Input()
  noEdit: boolean;
  // 区域id
  @Input()
  areaId;
  // 设施类型
  @Input()
  deviceType: string;
  // 重置键是否隐藏
  @Input() isHiddenButton = false;
  // 确定按钮赋予取消功能
  @Input() switchHiddenButton = true;
  // 确定键是否隐藏
  @Input() selectHiddenButton = false;
  // 是否去掉框选功能
  @Input() mapBoxSelect = false;
  // 语言类型
  public typeLg;


  private markerClusterer: any;
  // 国际化
  indexLanguage: IndexLanguageInterface;
  public InspectionLanguage: InspectionLanguageInterface; // 国际化
  private markersArr: any[] = [];

  constructor(public $mapService: MapService,
              public $areaService: AreaService,
              public $modalService: FiLinkModalService,
              public $i18n: NzI18nService) {
    super($mapService, $areaService, $modalService, $i18n);
  }

  /**
   * 巡检工单设施应用类型切换
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.xcVisible) {
      this.getFacilityFilterByAreaId(this.areaId, this.deviceType);
    }
    if ((this.selectorType === 'inspection' || this.selectorType === 'inspectionTask') && this.facilityData.length > 0) {
      this.restSelectData();
    }
  }

  /**
   * 页面初始化
   */
  ngAfterViewInit(): void {
    this.initMap();
  }

  /**
   * 确定
   */
  handleOk() {
    if (this.selectorType === 'inspection' || this.selectorType === 'inspectionTask') {
      // this.selectDataChange.emit(this.selectData);
      // 确定时将当前数据发射给组件用于回显
      this.selectDataChange.emit(this.selectData);
      this.handleCancel();
    } else {
      // 改为不传数据 组件内部关联设施 (关联设施时使用)
    }
  }

  ngOnInit() {
    this.mapType = MAP_TYPE;
    this.language = this.$i18n.getLocaleData('common');
    this.initSelectorConfig();
    this.indexLanguage = this.$i18n.getLocaleData('index');
    this.InspectionLanguage = this.$i18n.getLocaleData('inspection');
    // 语言类型
    this.typeLg = JSON.parse(localStorage.getItem('localLanguage'));
    this.searchTypeName = this.indexLanguage.searchDeviceName;
    this.getAreaInfoCurrentUser();
  }

  /**
   * 去选
   * param currentItem
   */
  handleDelete(currentItem) {
    if (currentItem) {
      if (this.isSelectAll === '1' || this.noEdit) {
        return false;
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

  /**
   * 获取区域下的设施
   */
  public getFacilityFilterByAreaId(areaId, deviceType?) {
    if (areaId) {
      this.showProgressBar();
      // this.$modalService.loading('加载中', 1000 * 60);
      this.$mapService.getALLFacilityList().subscribe((result: Result) => {
        this.hideProgressBar();
        this.$modalService.remove();
        // 每次切换数据先把原来的数据清空
        this.initMap();
        this.selectData = [];
        this.clearAll();
        const arrTemp = result.data || [];
        this.facilityData = arrTemp.filter(item => {
            // 当传入 areaId 和deviceType 双重过滤
            if (areaId && deviceType && item.areaId === areaId && item.deviceType === deviceType) {
              return item;
            } else if (areaId && !deviceType && item.areaId === areaId) {
              return item;
            }
          }
        );

        this.treeNodeSum = this.facilityData.length;
        this.firstData = [];
        // 默认该区域下没有设施
        this.areaNotHasDevice = true;
        this.facilityData.forEach(item => {
          item._deviceType = getDeviceType(this.$i18n, item.deviceType);
          // 选中全集
          this.areaNotHasDevice = false;
          if (this.isSelectAll === '0' && !this.deviceSet.length) {
            item.checked = true;
            this.firstData.push(item);
            this.pushToTable(item);
          } else {
            // 找出属于传入设施集合的数据加入右边表格
            if (this.deviceSet.includes(item.deviceId)) {
              item.checked = true;
              this.firstData.push(item);
              this.pushToTable(item);
            }
          }
        });
        this.refreshSelectPageData();
        // 先清除上一次的点
        if (this.mapType === 'baidu' && this.markerClusterer) {
          this.markerClusterer.clearMarkers(this.markersArr);
        }
        this.addMarkers(this.facilityData);
        // 该区域下没有设施定位到用户登陆到位置
        if (this.areaNotHasDevice) {
          this.mapService.locateToUserCity();
        }
      }, () => {
        this.hideProgressBar();
        this.$modalService.remove();
      });
    }
  }

  /**
   * 向地图中添加点
   * param {any[]} facilityData
   */
  public addMarkers(facilityData: any[]) {
    const arr = [];
    facilityData.forEach(item => {
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
      ));
    });
  this.markerClusterer = this.mapService.addMarkerClusterer(arr, [
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
  }


  /**
   * 右边表格配置
   */
  // initSelectorConfig() {
  //   this.selectorConfig = {
  //     noIndex: true,
  //     isDraggable: false,
  //     isLoading: false,
  //     showSearchSwitch: false,
  //     searchTemplate: null,
  //     scroll: {x: '420px'},
  //     columnConfig: [
  //       // {type: 'render', renderTemplate: this.handleTemp, width: 30},
  //       {type: 'serial-number', width: 62, title: this.language.serialNumber},
  //     ].concat(this.mapSelectorConfig.selectedColumn),
  //     showPagination: true,
  //     bordered: false,
  //     showSearch: false,
  //     showSizeChanger: false,
  //     simplePage: true,
  //     hideOnSinglePage: true,
  //     handleSelect: (data, currentItem) => {
  //       // 加入被选容器
  //       if (currentItem) {
  //         if (this.checkFacilityCanDelete(currentItem)) {
  //           return;
  //         }
  //         // 找到要删除的项目
  //         const index = this.selectData.findIndex(item => item.deviceId === currentItem.deviceId);
  //         this.selectData.splice(index, 1);
  //         this.childCmp.checkStatus();
  //         // 删除完刷新被选数据
  //         this.refreshSelectPageData();
  //         const imgUrl = CommonUtil.getFacilityIconUrl(iconSize, currentItem.deviceType, '1');
  //         const icon = this.mapService.toggleIcon(imgUrl);
  //         this.mapService.getMarkerById(currentItem.deviceId).setIcon(icon);
  //       }
  //       if (data && data.length === 0) {
  //         this.restSelectData();
  //       }
  //     },
  //   };
  // }
}
