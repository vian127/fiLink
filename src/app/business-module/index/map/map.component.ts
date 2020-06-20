import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MapControl} from '../util/map-control';
import {MapStoreService} from '../../../core-module/store/map.store.service';
import {MapService} from '../../../core-module/api-service/index/map';
import {IndexApiService} from '../service/index/index-api.service';
import {FacilityService} from '../../../core-module/api-service/facility/facility-manage';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {Result} from '../../../shared-module/entity/result';
import {MyCollectionComponent} from '../index-component/my-collection/my-collection.component';
import {FacilityListComponent} from '../index-component/index-facility-list/facility-list.component';
import {FacilityTypeComponent} from '../index-component/facility-type/facility-type.component';
import {FibreListComponent} from '../index-component/index-fibre-list/fibre-list.component';
import {DeviceNodeComponent} from '../index-component/index-device-node/device-node.component';
import {IndexMissionService} from '../../../core-module/mission/index.mission.service';
import {FacilityDetailPanelComponent} from '../index-component/facility-detail-panel/facility-detail-panel.component';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {MapConfig} from '../../../shared-module/component/map/map.config';
import {LogicAreaComponent} from '../index-component/logic-area/logic-area.component';
import {MAP_ICON_CONFIG} from '../../../shared-module/const/facility';
import {MapAbstract} from '../../../shared-module/component/map/map-abstract';
import {MapComponent} from '../../../shared-module/component/map/map.component';
import {DeviceDetailCode} from '../../facility/share/const/facility.config';
import {
  index_card_type,
  index_facility_config,
  index_facility_event,
  index_facility_panel,
  index_facility_type,
  index_layered_type,
  index_left_panel,
  index_map_type,
  index_update_type
} from '../shared/const/index-const';
import {Title} from '@angular/platform-browser';
import {ResultModel} from '../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../core-module/model/result-code.enum';
import {AreaFacilityModel} from '../shared/model/area-facility-model';
import {MapCoverageService} from '../service/map-coverage.service';
import {BusinessFacilityService} from '../../../shared-module/service/business-facility/business-facility.service';

declare const MAP_TYPE;

/**
 *  初始化首页板块（地图、设施详情、设施列表、我的关注、拓扑高亮等）
 */
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapIndexComponent extends MapControl implements OnInit, AfterViewInit, OnDestroy {
  // 地图设置temp
  @ViewChild('MapConfigTemp') MapConfigTemp: TemplateRef<any>;
  // 地图
  @ViewChild('mainMap') mainMap: MapComponent;
  // 设施类型设置temp
  @ViewChild('facilityTypeConfigTemp') facilityTypeConfigTemp: TemplateRef<any>;
  // 设施列表
  @ViewChild('facilityListComponent') facilityListComponent: FacilityListComponent;
  // 我的关注
  @ViewChild('myCollectionComponent') myCollectionComponent: MyCollectionComponent;
  // 设施类型
  @ViewChild('facilityTypeComponent') facilityTypeComponent: FacilityTypeComponent;
  // 光缆列表
  @ViewChild('fibreListComponent') fibreListComponent: FibreListComponent;
  // 节点设施
  @ViewChild('deviceNodeComponent') deviceNodeComponent: DeviceNodeComponent;
  // 选择区域
  @ViewChild('logicAreaComponent') logicAreaComponent: LogicAreaComponent;
  // 设施详情
  @ViewChild('facilityDetailPanelComponent') facilityDetailPanelComponent: FacilityDetailPanelComponent;
  // 首页左侧面板常量
  public indexLeftPanel = index_left_panel;
  // 权限码
  public powerCode = DeviceDetailCode;
  // 卡片类型
  public cardType = index_card_type;
  // 首页设施事件
  public indexEvent = index_facility_event;
  // 设施类型
  public facilityIconType = index_facility_type;
  // 选中的设施id
  public facilityId;
  // 路由上的id
  public mapFacilityId;
  // 地图类型
  public mapType;
  // 地图配置
  public mapConfig: MapConfig;
  // 地图服务
  public mapService: MapAbstract;
  // 设施类型配置
  public facilityTypeConfig;
  // 地图设施图标大小
  public facilityIconSizeValue;
  // 地图设施图标大小配置
  public facilityIconSizeConfig;
  // 设施图标大小
  public iconSize;
  // 设施数据
  public data;
  // 光纤数据
  public fibreData;
  // 选中的设施类型id集
  public selectedFacilityTypeIdsArr;
  // 选中的设施状态id集
  public selectedFacilityStatusArr;
  // 选中的逻辑区域id集
  public selectedLogicAreaIdsArr;
  // 设施详情tab页选中的index
  public selectedIndex = index_facility_panel.facilityDetail;
  // 聚合点设施list
  public clustererFacilityList = [];
  // 权限code
  public facilityPowerCode = [];
  // public tables;
  // 是否显示设施详情tab
  public isShowFacilityDetailTab = true;
  // 是否显示设施详情面板
  public isShowOpenFacilityPanel = false;
  // 是否显示告警tab
  public isShowFacilityAlarmTab = false;
  // 是否显示日志工单tab
  public isShowFacilityLogAndOrderTab = false;
  // 是否显示实景图tab
  public isShowFacilityRealSceneTab = false;
  // 光交箱和配件架才显示实景图
  public isShowBusinessPicture = false;
  // 是否显示所有的卡片
  public isShowCard = false;
  // 是否显示设施控制面板
  public isShowPanel = false;
  // 设施收藏相关推送
  public facilityNoticeArr = ['focusDevice', 'unFollowDevice'];
  // 是否显示加载进度条
  public isShowProgressBar = false;
  // 进度条初始进度
  public percent;
  // 进度条增长百分比
  public increasePercent;
  // 进度条的定时器
  public timer;
  // 首页设施收藏数据缓存
  public indexMyCollectionCacheData = null;
  // 右侧统计配置
  public statisticsConfig;
  // 区域数据
  public areaData;
  // 退出高亮显示按钮
  public isLightButton = false;
  // 是否从其他页面定位到首页，并且没有缓存数据
  public isNotGetDate = true;
  // 判读是否是不渲染数据
  public isShowNoData = false;
  // 设施设备类型
  public facilityType = index_layered_type.facility;
  // 中西点
  public centerPoint: string;
  // 区域下设施数据模型
  public areaFacilityModel = new AreaFacilityModel;
  // 区域下设施数据
  public areaFacilityList;
  // 区域下设备数据
  public areaEquipmentList;

  // 构造器
  constructor(
    public $nzI18n: NzI18nService,
    public modalService: NzModalService,
    private $mapStoreService: MapStoreService,
    private $facilityService: FacilityService,
    private $mapService: MapService,
    private $indexApiService: IndexApiService,
    private $title: Title,
    private $message: FiLinkModalService,
    private $router: Router,
    private $modal: NzModalService,
    private $activatedRoute: ActivatedRoute,
    private $modalService: FiLinkModalService,
    private $indexMissionService: IndexMissionService,
    private $MapCoverageService: MapCoverageService,
    private $businessFacilityService: BusinessFacilityService
  ) {
    super($nzI18n);
  }

  ngOnInit() {
    console.log('测试git');
    window.addEventListener('popstate', function () {
      sessionStorage.setItem('backHistory', 'backHistory');
    }, false);
    // v1版风格样式不影响设施图标不需要去除商家信息
    // const style = this.mapType === 'baidu' ? BMapStyleConfig : null;
    // 初始化地图配置
    this.facilityNoticeArr = ['focusDevice', 'unFollowDevice'];
    this.mapType = MAP_TYPE;
    this.mapConfig = new MapConfig('index-map', this.mapType, MAP_ICON_CONFIG.defaultIconSize, []);
    // 初始化地图类型
    this.$mapStoreService.mapType = this.mapType;
    // 获取地图设施id
    this.mapFacilityId = this.$activatedRoute.snapshot.queryParams.id;
    // 从其他页面定位到首页
    if (this.mapFacilityId || this.$mapStoreService.mapLastID) {
      // 如果是从缓存页面进来
      if (sessionStorage.getItem('backHistory') === 'backHistory') {
        this.mapFacilityId = this.$mapStoreService.mapLastID;
      }
      // 判断当前设施是否为新增
      for (const [key] of this.$mapStoreService.mapData) {
        if (key === this.mapFacilityId) {
          this.isNotGetDate = false;
        }
      }
      // 如果没有缓存就请求接口
      if (this.isNotGetDate) {
        this.queryHomeDeviceById();
      }
    }

    // 配置设施信息
    this.facilityId = this.mapFacilityId;
    this.facilityIconSizeConfig = MAP_ICON_CONFIG.iconConfig;
    this.iconSize = MAP_ICON_CONFIG.defaultIconSize;
    this.facilityIconSizeValue = MAP_ICON_CONFIG.defaultIconSize;
    this.facilityTypeConfig = this.facilityTypeListArr;
    // 加载区域配置
    this.getAllAreaList();
    // 检查用户
    this.checkUser();
    // 获取首页卡片配置
    this.getStatisticsConfig();
    // 推送监听，实现实时刷新
    this.facilityChangeHook();
  }

  ngAfterViewInit() {
    this.$title.setTitle(`FiLink - ${this.indexLanguage.home}`);
    // 获取全部地图配置
    this.getAllMapConfig();
    // 获取我的关注数据
    this.getMyCollectionData();
    // 获取区域点
    this.queryHomeDeviceArea();
    // 监听设施设备列表定位
    this.$businessFacilityService.eventEmit.subscribe((value) => {
      if (value.positionBase) {
        const a = value.positionBase.split(',');
        const data = {};
        data['lng'] = +a[0];
        data['lat'] = +a[1];
        this.mainMap.centerAndZoom(data);
        // 设施选中，打开设施详情面板
        this.hideFacilityPanel();
        this.closePanel();
        if (value.id) {
          this.facilityId = value.id;
          this.openFacilityPanel();
        }
      }
    });
  }

  ngOnDestroy() {
    // 清除加载条的定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
    sessionStorage.removeItem('backHistory');
    this.$mapStoreService.mapLastID = this.facilityId;
  }

  /**
   * 首页卡片显示的配置文件
   * param  label 标签
   * param  title 标题
   * param  type  顺序显示位置
   * param  isShow 是否展示
   */
  getStatisticsConfig() {
    this.statisticsConfig = [
      {
        label: this.indexLanguage.card.deviceCount,
        title: this.indexLanguage.card.deviceCount,
        type: this.cardType.deviceCount,
        isShow: false
      },
      {
        label: this.indexLanguage.card.typeCount,
        title: this.indexLanguage.card.dfTypeDeviceCount,
        type: this.cardType.typeCount,
        isShow: false
      },
      {
        label: this.indexLanguage.card.deviceStatus,
        title: this.indexLanguage.card.deviceStatus,
        type: this.cardType.deviceStatus,
        isShow: false
      },
      {
        label: this.indexLanguage.card.alarmCount,
        title: this.indexLanguage.card.currentAlarmCount,
        type: this.cardType.alarmCount,
        isShow: false
      },
      {
        label: this.indexLanguage.card.alarmINC,
        title: this.indexLanguage.card.alarmIncrement,
        type: this.cardType.alarmIncrement,
        isShow: false
      },
      {
        label: this.indexLanguage.card.workINC,
        title: this.indexLanguage.card.workIncrement,
        type: this.cardType.workIncrement,
        isShow: false
      },
      {
        label: this.indexLanguage.card.busyTop,
        title: this.indexLanguage.card.busyDeviceTop,
        type: this.cardType.busyTop,
        isShow: false
      },
      {
        label: this.indexLanguage.card.alarmTop,
        title: this.indexLanguage.card.alarmDeviceTop,
        type: this.cardType.alarmTop,
        isShow: false
      },
    ];
  }

  /**
   * 检查用户是否改变
   */
  public checkUser() {
    // 用户改变，清空缓存
    if (SessionUtil.getToken() !== this.$mapStoreService.token) {
      this.$mapStoreService.resetData();
      this.$mapStoreService.resetConfig();
    }
    this.$mapStoreService.token = SessionUtil.getToken();
  }

  /**
   * 推送监听，实现实时刷新
   */
  public facilityChangeHook() {

    this.$indexMissionService.facilityChangeHook.subscribe(data => {
      const {type, items} = data;
      // 开锁
      // if (type === 'unlock') {
      //   if (this.isShowFacilityPanel) {
      //     this.facilityDetailPanelComponent.getLockInfo(this.facilityId);
      //   }
      // } else
      if (this.facilityNoticeArr.indexOf(type) > -1) {
        // 设施收藏更新
        if (this.isExpandMyCollection) {
          this.myCollectionComponent.update(type, items);
        }
        if (this.isShowFacilityPanel && items.deviceId === this.facilityId) {
          this.facilityDetailPanelComponent.updateCollectionStatus(type);
        }
      } else {
        // 设施更新
        this.updateMarkers(index_update_type.webUpdate);

        if (items.indexOf(this.facilityId) > -1) {
          if (type === 'updateDevice') {
            this.facilityDetailPanelComponent.getFacilityDetail(this.facilityId);
          }
          if (type === 'deleteDevice') {
            this.hideFacilityPanel();
          }
        }

        if (this.isExpandFacilityList) {
          this.facilityListComponent.update(type, items);
        }
      }
    });
  }

  /**
   * 检查首次加载
   */
  public queryHomeDeviceArea() {

    // test数据
    const testData = {
      'polymerizationType': '1',
      'filterConditions': {
        'area': ['001', '002', '003', '004', '005'],
        'device': ['002', '003', '001']
      }
    };

    // 设施的区域接口
    this.$indexApiService.queryDevicePolymerizationList(testData).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.centerPoint = result.data.positionCenter;
        this.cacheData(result.data.polymerizationData);
      }
    });
  }


  /**
   * 检查首次大数据刷新
   */
  public getRefreshHomeDeviceAreaHuge(newArea) {
    this.showProgressBar();
    this.$mapService.refreshHomeDeviceAreaHuge(newArea).subscribe((result: Result) => {
      if (result.code === 0) {
        // 缓存区域数据
        this.$mapStoreService.areaDataList = result.data.areaDeviceNumList;
        this.cacheData(result.data.homeDeviceInfoDtoList);
        this.hideProgressBar();
        this.updateMarkers(index_update_type.haveUpdate);
      }
    }, () => {
    });
  }


  /**
   * 刷新
   */
  refresh() {

    if (this.isShowProgressBar) {
      this.$message.warning(this.indexLanguage.loadingMsg);
      return;
    }
    // 大数据加载
    if (this.$mapStoreService.hugeData) {
      // 刷新部分区域
      this.selectedLogicAreaIdsArr = this.$mapStoreService.logicAreaList.filter(item => item.hasPermissions && item.checked)
        .map(item => item.areaId);
      this.$mapStoreService.chooseAllAreaID = this.selectedLogicAreaIdsArr;
      // 当有选择区域才刷新
      if (this.selectedLogicAreaIdsArr) {
        this.getRefreshHomeDeviceAreaHuge(this.selectedLogicAreaIdsArr);
      }
    } else {
      // 刷新全部区域
      this.refreshALLFacilityList();
    }

    // 设施列表展开时刷新设施列表
    if (this.isExpandFacilityList) {
      this.facilityListComponent.setSelectOption();
      this.facilityListComponent.getAllShowData();
    }
    // 我的收藏展开时收起我的收藏
    if (this.isExpandMyCollection) {
      this.myCollectionComponent.setSelectOption();
      this.myCollectionComponent.refreshLeftMenu();
    }
    // 隐藏所有的卡片
    this.statisticsConfig.forEach(_item => _item.isShow = false);
    // 隐藏选择区域
    this.isExpandLeftComponents = false;
    // 选中颜色状态还原
    this.isExpandFacilityList = false;
    this.isExpandTopologicalHigh = false;
    this.isExpandMyCollection = false;
    // 隐藏设施模版
    this.hideFacilityPanel();
    // 隐藏聚合点
    this.hideClustererFacilityTable();
  }

  /**
   * 根据设施id取数据,更新缓存
   */
  queryHomeDeviceById() {
    this.$mapService.queryHomeDeviceById(this.mapFacilityId).subscribe((result: Result) => {
      if (result.code === 0) {
        const position = result.data.positionBase.split(',');
        result.data.lng = parseFloat(position[0]);
        result.data.lat = parseFloat(position[1]);
        delete result.data.positionBase;
        // 将接口数据放到缓存
        this.$mapStoreService.updateMarker(result.data, true);
      }
    });
  }

  /**
   * 获取区域列表
   */
  getAllAreaList() {
    // 初始化区域列表
    const logicAreaListMap = new Map();
    if (this.$mapStoreService.logicAreaList) {
      this.$mapStoreService.logicAreaList.forEach(item => {
        logicAreaListMap.set(item.areaId, item);
      });
    }
    // 获取当前用户下所有的区域
    this.$mapService.getALLAreaListForCurrentUser().subscribe((result: Result) => {
      if (result.code === 0) {
        this.areaData = result.data;
        // 获取所有的区域
        this.$mapStoreService.logicAreaList = result.data.map(item => {
          if (logicAreaListMap.get(item.areaId)) {
            item.checked = logicAreaListMap.get(item.areaId).checked;
          } else {
            item.checked = true;
          }
          item.hasPermissions = item.hasPermissions;
          return item;
        });
        // 选中的区域
        this.selectedLogicAreaIdsArr = this.$mapStoreService.logicAreaList.filter(item => item.hasPermissions && item.checked)
          .map(item => item.areaId);
        // 逻辑区域是否展开
        if (this.isExpandLogicArea) {
          this.logicAreaComponent.getAllAreaListFromStore();
        }
      }
    });
  }

  /**
   * 获取我的关注数据
   */
  getMyCollectionData() {
    this.$mapService.getAllCollectFacilityList().subscribe((result: Result) => {
      if (result.code === 0) {
        this.indexMyCollectionCacheData = CommonUtil.deepClone(result.data);
      }
    });
  }

  /**
   * 刷新设施数据
   */
  refreshALLFacilityList() {
    this.showProgressBar();
    // 获取所有区域
    this.getAllAreaList();
    this.$mapService.refreshHomeDeviceArea().subscribe((result: Result) => {
      this.$message.remove();
      if (result.code === 0) {
        // 重置缓存数据
        this.$mapStoreService.resetData();
        this.$mapStoreService.isInitData = true;
        const markers = [];
        // 缓存区域数据
        this.$mapStoreService.areaDataList = result.data.areaDeviceNumList;
        result.data.homeDeviceInfoDtoList.forEach(item => {
          const position = item.positionBase.split(',');
          item.lng = parseFloat(position[0]);
          item.lat = parseFloat(position[1]);
          delete item.positionBase;
          // 更新设施
          if (this.checkFacility(item)) {
            this.$mapStoreService.updateMarker(item, true);
            markers.push(item);
          } else {
            this.$mapStoreService.updateMarker(item, false);
          }
        });
        this.data = markers;
      } else {
        this.$message.error(result.msg);
      }
      this.hideProgressBar();
    }, () => {
      this.$message.remove();
      this.hideProgressBar();
    });
  }

  /**
   * tabs页签选中变更
   */
  selectedIndexChange(event) {
    if (event === index_facility_panel.facilityDetail) {
      this.isShowFacilityDetailTab = true;
    } else if (event === index_facility_panel.facilityAlarm) {
      this.isShowFacilityAlarmTab = true;
    } else if (event === index_facility_panel.logAndOrderTab) {
      this.isShowFacilityLogAndOrderTab = true;
    } else if (event === index_facility_panel.RealSceneTab) {
      this.isShowFacilityRealSceneTab = true;
    }
  }

  /**
   * 校检设施
   * param item
   * returns {boolean}
   */
  checkFacility(item) {
    if (this.selectedFacilityTypeIdsArr.indexOf(item.deviceType) < 0) {
      return false;
    }
    if (this.selectedFacilityStatusArr.indexOf(item.deviceStatus) < 0) {
      return false;
    }
    if (this.$mapStoreService.isInitLogicAreaData
      && this.selectedLogicAreaIdsArr
      && this.selectedLogicAreaIdsArr.indexOf(item.areaId) < 0) {
      return false;
    }
    return true;
  }

  /**
   * 打开设施类型配置modal
   */
  openFacilityTypeConfigModal() {
    const modal = this.$modal.create({
      nzTitle: this.indexLanguage.facilityTypeConfigTitle,
      nzContent: this.facilityTypeConfigTemp,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzMaskClosable: false,
      nzFooter: [
        {
          label: this.commonLanguage.confirm,
          onClick: () => {
            this.modifyFacilityTypeConfig(modal);
          }
        },
        {
          label: this.commonLanguage.cancel,
          type: 'danger',
          onClick: () => {
            modal.destroy();
          }
        },
      ]
    });
  }

  /**
   * 更新设施数据
   */
  updateDevice() {
    // const markers = [];
    // // 更新设施数据
    // for (const [key, value] of this.$mapStoreService.mapData) {
    //   const point = value['info'];
    //   if (this.checkFacility(point)) {
    //     this.$mapStoreService.updateMarker(point, true);
    //     markers.push(point);
    //   } else {
    //     this.$mapStoreService.updateMarker(point, false);
    //   }
    // }
    // // 更新标记点
    // this.data = markers;
  }

  /**
   * 更新点
   */
  updateMarkers(type: number) {
    // 更新设施数据
    this.updateDevice();
    // 设施列表展开时刷新设施列表
    if (this.isExpandFacilityList) {
      this.facilityListComponent.setSelectOption();
      this.facilityListComponent.getAllShowData();
    }
    // 我的收藏展开时收起我的收藏
    if (this.isExpandMyCollection) {
      this.myCollectionComponent.setSelectOption();
      this.myCollectionComponent.refreshLeftMenu();
    }
    // 聚合点详情点击打开table
    if (this.isShowClustererFacilityTable) {
      this.hideClustererFacilityTable();
    }

    this.$message.remove();

    const that = this;
    // 是否刷新设施统计
    if (that.facilityTypeComponent) {
      that.facilityTypeComponent.showCount();
    }
    // 关闭遮罩
    if (type === index_update_type.noUpdate) {
      setTimeout(function () {
        that.hideProgressBar();
      }, 200);
    }

    // 如果推送过来的
    if (type === index_update_type.webUpdate) {
      return;
    } else {
      // 是否打开设施面板
      if (this.facilityId) {
        this.openFacilityPanel();
      } else {
        this.hideFacilityPanel();
      }
    }

  }

  /**
   * 打开地图配置modal
   */
  openMapSettingModal() {
    const modal = this.$modal.create({
      nzTitle: this.indexLanguage.mapConfigTitle,
      nzContent: this.MapConfigTemp,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzClassName: 'custom-create-modal',
      nzOnCancel: () => {
        // 还原到上次配置
        this.facilityIconSizeConfig = MAP_ICON_CONFIG.iconConfig;
        this.facilityIconSizeValue = this.$mapStoreService.facilityIconSize;
        modal.destroy();
      },
      nzFooter: [
        {
          label: this.commonLanguage.confirm,
          onClick: () => {
            this.modifyMapConfig(modal);
            this.isShowFacilityPanel = false;
          }
        },
        {
          label: this.commonLanguage.cancel,
          type: 'danger',
          onClick: () => {
            // 还原到上次配置
            this.facilityIconSizeConfig = MAP_ICON_CONFIG.iconConfig;
            this.facilityIconSizeValue = this.$mapStoreService.facilityIconSize;
            modal.destroy();
          }
        },
      ]
    });
  }

  /**
   * 缓存数据
   * param data
   */
  cacheData(data) {
    // this.$mapStoreService.isInitData = true;
    // // 更新标记点
    // data.forEach(item => {
    //   const position = item.positionBase.split(',');
    //   item.lng = parseFloat(position[0]);
    //   item.lat = parseFloat(position[1]);
    //   delete item.positionBase;
    //   this.$mapStoreService.updateMarker(item, true);
    // });
    // this.hideProgressBar();
    // // 更新地图数据
    // this.data = data.filter(item => {
    //   return this.checkFacility(item);
    // });
    // if (this.facilityId) {
    //   this.openFacilityPanel();
    // }

    // 更新标记点
    data.forEach(item => {

      if (item.positionCenter) {
        const position = item.positionCenter.split(',');
        item.lng = parseFloat(position[0]);
        item.lat = parseFloat(position[1]);
        delete item.positionCenter;
        this.$mapStoreService.updateMarker(item, true);
      }
    });

    // 更新地图数据
    this.data = data;
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
   * 获取地图配置信息
   */
  getAllMapConfig() {
    // 获取全部设施的配置
    this.$mapService.getALLFacilityConfig().subscribe((result: Result) => {
      // 重置配置
      this.$mapStoreService.resetConfig();
      if (result.code === 0) {
        // 更新设施图标
        if (result.data.deviceIconSize) {
          this.facilityIconSizeValue = result.data.deviceIconSize;
          this.$mapStoreService.facilityIconSize = result.data.deviceIconSize;
          this.iconSize = result.data.deviceIconSize;
        }
        // 设施类型配置
        this.$mapStoreService.facilityTypeConfig = result.data.deviceConfig.map(item => {
          return {
            value: item.deviceType,
            label: this.getFacilityTypeName(item.deviceType),
            checked: item.configValue === index_facility_config.checked,
            iconClass: this.getFacilityTypeIconClass(item.deviceType),
          };
        });
        this.facilityTypeConfig = CommonUtil.deepClone(this.$mapStoreService.facilityTypeConfig);
        this.$mapStoreService.isInitConfig = true;
        // 更新设施列表
        this.$mapStoreService.facilityTypeList = this.$mapStoreService.facilityTypeConfig.filter(item => item.checked);
        this.$mapStoreService.facilityStatusList = this.facilityStatusList();
        this.selectedFacilityTypeIdsArr = this.$mapStoreService.facilityTypeList.map(item => item.value);
        this.selectedFacilityStatusArr = this.$mapStoreService.facilityStatusList.map(item => item.value);
        this.$mapStoreService.isInitData ? this.updateMarkers(index_update_type.haveUpdate) : this.queryHomeDeviceArea();
      } else {
        this.data = [];
        this.$message.error(result.msg);
      }
    }, () => {
      this.data = [];
      this.$message.remove();
    });

    // 小数据量默认选择全部数据
    if (!this.$mapStoreService.hugeData && this.$mapStoreService.isInitData) {
      // 地图数据展示
      for (const [key, value] of this.$mapStoreService.mapData) {
        value.info.isShow = true;
        value.isShow = true;
      }
      // 区域列表全选
      this.$mapStoreService.logicAreaList.map((item) => {
        item.checked = true;
      });
      // 选中区域
      this.selectedLogicAreaIdsArr = this.$mapStoreService.logicAreaList.filter(item => item.hasPermissions && item.checked)
        .map(item => item.areaId);
    }
  }

  /**
   * 打开设施详情面板
   * param target
   */
  openFacilityPanel() {
    console.log(this.facilityId);
    // 初始化默认
    this.isShowOpenFacilityPanel = false;
    // 是否是相同的类型
    for (const [key, value] of this.$mapStoreService.mapData) {
      // 拿到对应的设施数据
      const facility = value['info'];
      // 拿到对应的设施类型状态
      const IsShowType = this.$mapStoreService.facilityTypeList.filter(e => e.value === facility['deviceType']);
      // 如果当前设施Id是当前id和地图上有设施，则打开设施详情
      if (IsShowType.length > 0 && facility['deviceId'] === this.facilityId) {
        this.isShowOpenFacilityPanel = true;
      }
    }

    // // 当代的设施类型选中的不匹配
    // if (!this.isShowOpenFacilityPanel) {
    //     this.$modalService.warning(this.indexLanguage.noDeviceSetting);
    //     return;
    // }

    // 关闭右键
    this.mainMap.closeRightClick();

    // 获取设施类型
    let isFacilityType;
    for (const [key, value] of this.$mapStoreService.mapData) {
      if (key === this.facilityId) {
        isFacilityType = value.info;
      }
    }

    // 判断是否显示实景图
    if (isFacilityType) {
      // 获取 详情页面模块权限id
      this.$facilityService.getDetailCode({deviceId: this.facilityId, deviceType: isFacilityType['deviceType']})
        .subscribe((result: Result) => {
          const data = result.data || [];
          this.facilityPowerCode = data.map(item => item.id);
        });
      // 光交箱和配件架才显示实景图 (接头盒没有端口信息和实景图)
      const e = this.facilityIconType;
      this.isShowBusinessPicture = isFacilityType.deviceType === e.patchPanel || isFacilityType.deviceType === e.opticalBox;
    }
    // 关闭所有卡片
    this.isShowCard = true;
    // 关闭设施状态
    this.isExpandFacilityStatus = false;
    // 点击展开或隐藏所有的卡片
    this.ClickAllItems();
    // 设施详情
    const that = this;
    setTimeout(function () {
      that.isShowFacilityDetailTab = true;
      that.selectedIndex = index_facility_panel.facilityDetail;
      that.showFacilityPanel();
    }, 300);
  }

  /**
   * 修改用户设施类型配置
   */
  modifyFacilityTypeConfig(modal) {

    const data = this.facilityTypeConfig.map(item => {
      return {
        deviceType: item.value,
        configValue: item.checked ? index_facility_config.checked : index_facility_config.noChecked
      };
    });
    this.$message.loading(this.commonLanguage.saving);
    this.$mapService.modifyFacilityTypeConfig(data).subscribe((result: Result) => {
      if (result.code !== 0) {
        this.$message.remove();
        this.$message.error(result.msg);
        return;
      }
      this.$message.remove();
      this.$message.success(this.commonLanguage.operateSuccess);
      // 设施类型配置
      this.$mapStoreService.facilityTypeConfig = this.facilityTypeConfig.map(item => {
        return {
          value: item.value,
          label: item.label,
          checked: item.checked
        };
      });
      this.$mapStoreService.facilityTypeList = this.$mapStoreService.facilityTypeConfig.filter(item => item.checked);
      this.selectedFacilityTypeIdsArr = this.$mapStoreService.facilityTypeList.map(item => item.value);
      // 隐藏面板
      this.hideFacilityPanel();
      // 更新标记点
      this.updateMarkers(index_update_type.webUpdate);
      // 初始化设施类型
      if (this.isExpandLeftComponents) {
        this.facilityTypeComponent.initData();
      }
      setTimeout(() => {
        this.$message.remove();
        modal.destroy();
      }, 500);
    }, err => {
      this.$message.remove();
    });
  }

  /**
   * 修改地图配置
   */
  modifyMapConfig(modal) {
    const data = {configValue: this.facilityIconSizeValue};
    this.$message.loading(this.commonLanguage.saving);
    this.$mapService.modifyFacilityIconSize(data).subscribe((result: Result) => {
      if (result.code !== 0) {
        this.$message.remove();
        this.$message.error(result.msg);
        return;
      }
      this.$message.remove();
      this.$message.success(this.commonLanguage.operateSuccess);
      if (this.$mapStoreService.facilityIconSize !== this.facilityIconSizeValue) {
        this.$mapStoreService.facilityIconSize = this.facilityIconSizeValue;
        this.iconSize = this.facilityIconSizeValue;
      }
      setTimeout(() => {
        modal.destroy();
        this.$message.remove();
      }, 500);
    }, () => {
      this.$message.remove();
    });
  }

  /**
   * 关闭设施详情面板
   * param event
   */
  closePanel() {
    this.hideFacilityPanel();
    this.hideClustererFacilityTable();
  }

  /**
   * 地图事件回传
   * param event
   */
  mapEvent(event) {
    if (event.type === index_map_type.areaPoint) {
      if (this.$MapCoverageService.showCoverage === 'facility') {
        // 清除设施或设备以外所有的点
        this.mainMap.mapService.mapInstance.clearOverlays();
        // 创建设施点
        this.mainMap.getMapDeviceData([event.data.target.customData.code]);
        // this.mainMap.zoomIn();
      } else if (this.$MapCoverageService.showCoverage === 'equipment') {
        // 清除设施或设备以外所有的点
        this.mainMap.mapService.mapInstance.clearOverlays();
        // 创建设备点
        this.mainMap.getMapEquipmentData([event.data.target.customData.code]);
        // this.mainMap.zoomIn();
      }
    } else if (event.type === index_map_type.mapClick) {
      // 关闭设施详情面板
      this.closePanel();
      this.mainMap.closeRightClick();
    } else if (event.type === index_map_type.clickClusterer) {
      // 打开聚合点table
      this.clustererFacilityList = event.data;
      this.showClustererFacilityTable();
    } else if (event.type === index_map_type.cityListControlStatus) {
      // 城市控件打开与关闭
      if (event.value) {
        this.hideLeftComponents();
      } else {
        this.showLeftComponents();
      }
    } else if (event.type === index_map_type.cityChange) {
      // 城市切换
      this.showLeftComponents();
    } else if (event.type === index_map_type.selected) {
      // 设施选中，打开设施详情面板
      this.hideFacilityPanel();
      this.closePanel();
      if (event.id) {
        this.facilityId = event.id;
        this.openFacilityPanel();
      }
    } else if (event.type === index_map_type.mapBlackClick) {
      // 设施选中，打开设施详情面板
      this.hideFacilityPanel();
      this.closePanel();
    } else if (event.type === index_map_type.mapDrag) {
      // 地图拖动
      this.hideFacilityPanel();
      this.facilityId = null;
      this.mainMap.closeRightClick();
      this.hideClustererFacilityTable();
    } else if (event.type === index_map_type.resetFacilityId) {
      // 重置设施id
      this.mapFacilityId = null;
    } else if (event.type === index_map_type.showLight) {
      // 拓扑高亮
      this.clickMapShowTopologicalHigh(event.data);
      this.isLightButton = true;
      this.isShowClustererFacilityTable = false;
      this.statisticsConfig.forEach(_item => _item.isShow = false);
    } else if (event.type === 'isInit') {
      this.isShowPanel = true;
    }
  }


  /**
   * 设施类型回传
   * param event
   */
  facilityTypeEvent(event) {
    if (event.type === this.indexEvent.close) {
      this.foldFacilityType();
    } else if (event.type === this.indexEvent.setting) {
      this.openFacilityTypeConfigModal();
    } else if (event.type === this.indexEvent.update) {
      this.selectedFacilityTypeIdsArr = this.$mapStoreService.facilityTypeList.filter(item => item.checked)
        .map(item => item.value);
      this.hideFacilityPanel();
      this.updateMarkers(index_update_type.haveUpdate);
    } else {
    }
  }

  /**
   * 设施状态回传
   * param event
   */
  facilityStatusEvent(event) {
    if (event.type === this.indexEvent.close) {
      this.foldFacilityStatus();
    } else if (event.type === this.indexEvent.update) {
      this.selectedFacilityStatusArr = this.$mapStoreService.facilityStatusList.filter(item => item.checked)
        .map(item => item.value);
      this.hideFacilityPanel();
      this.updateMarkers(index_update_type.haveUpdate);
    } else {
    }
  }

  /**
   * 设施列表回传
   * param event
   */
  facilityListEvent(event) {
    this.hideFacilityPanel();
    if (event.type === this.indexEvent.location) {
      this.location(event.id);
    } else if (event.type === this.indexEvent.close) {
      this.foldFacilityList();
    }
  }

  /**
   * 光纤列表回传
   * param event
   */
  fibreListEvent(event) {
    if (event.type === 'seeLocation') {
      this.mainMap.closeRightClick();
      this.isLightButton = true;
      this.mainMap.clearLight();
    }
    // 隐藏卡片
    this.statisticsConfig.forEach(_item => _item.isShow = false);
    this.queryDeviceInfoListByOpticCableId(event.id, event.type);
  }

  /**
   * 根据OpticCableId查询节点设施
   */
  queryDeviceInfoListByOpticCableId(opticCableId, type) {
    // 请求设施数据
    this.$mapService.queryDeviceInfoListByOpticCableId(opticCableId).subscribe((result: Result) => {
      if (result.code === 0) {
        this.fibreData = result.data;
        if (type === 'seeLocation') {
          // 点亮拓扑
          result.data.length ? this.mainMap.showLightData(opticCableId) : this.$message.warning(this.indexLanguage.fiberNotNode);
        }
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 光纤列表回传
   * param event
   */
  deviceNodeEvent(event) {
    this.hideFacilityPanel();
    if (event.type === this.indexEvent.location) {
      this.location(event.id);
    } else if (event.type === this.indexEvent.close) {
      this.foldFacilityList();
    }
  }

  /**
   * 区域列表回传
   * param event
   */
  logicAreaEvent(event) {
    this.hideFacilityPanel();
    if (event.type === this.indexEvent.close) {
      this.foldLogicArea();
    } else if (event.type === this.indexEvent.update) {
      const newArea = [];
      this.selectedLogicAreaIdsArr = this.$mapStoreService.logicAreaList.filter(item => item.hasPermissions && item.checked)
        .map(item => item.areaId);
      // 记录上一次选择的
      this.$mapStoreService.selectLastAreaID = this.selectedLogicAreaIdsArr;
      // 大数据加载
      if (this.$mapStoreService.hugeData && event.refresh) {
        // 选中区域
        this.selectedLogicAreaIdsArr.forEach(items => {
          if (this.$mapStoreService.chooseAllAreaID.indexOf(items) === -1) {
            newArea.push(items);
          }
        });
        // 有新增的区域
        if (newArea.length > 0) {
          this.$mapStoreService.chooseAllAreaID = this.selectedLogicAreaIdsArr;
          this.getRefreshHomeDeviceAreaHuge(newArea);
          return;
        }
      }

      if (event.refresh && newArea.length === 0) {
        // 开启遮罩
        this.showProgressBar();
        this.updateMarkers(index_update_type.noUpdate);
      }
    }
  }

  /**
   * 我的收藏回传
   * param event
   */
  myCollectionEvent(event) {
    this.hideFacilityPanel();
    if (event.type === this.indexEvent.location) {
      this.location(event.id);
    } else if (event.type === this.indexEvent.close) {
      this.foldMyCollection();
    } else if (event.type === this.indexEvent.update) {
      this.indexMyCollectionCacheData = CommonUtil.deepClone(event.data);
    } else {
    }
  }

  /**
   * 设施详情回传
   * param event
   */
  facilityDetailEvent(event) {
    // 如果是设施未更新
    if (event.type === this.indexEvent.refresh) {
      this.refresh();
      this.mainMap.clearSearch();
      return;
    }
    const index = this.indexMyCollectionCacheData.findIndex(item => item.deviceId === event.data.deviceId);
    const _data = event.data;
    const _item = {
      address: _data.address,
      areaId: _data.areaId,
      deviceCode: _data.deviceCode,
      deviceId: _data.deviceId,
      deviceName: _data.deviceName,
      deviceStatus: _data.deviceStatus,
      deviceStatusName: this.getFacilityStatusName(_data.deviceStatus),
      deviceType: _data.deviceType,
    };
    if (event.type === this.indexEvent.focusDevice) {
      if (index > -1) {
        this.indexMyCollectionCacheData.splice(index, 1, _item);
      } else {
        this.indexMyCollectionCacheData.push(_item);
      }
    } else if (event.type === this.indexEvent.unFollowDevice) {
      if (index > -1) {
        this.indexMyCollectionCacheData.splice(index, 1);
      }
    }
    if (this.isExpandMyCollection) {
      this.myCollectionComponent.update(event.type, _item);
    }
  }

  /**
   * 聚合点table回传
   * param event
   */
  clustererFacilityListEvent(event) {
    this.hideFacilityPanel();
    if (event.type === this.indexEvent.close) {
      this.foldLogicArea();
    } else if (event.type === this.indexEvent.location) {
      this.facilityId = event.id;
      if (this.facilityId) {
        this.openFacilityPanel();
      }
    } else {
    }
  }

  /**
   * 聚合点table展开列表显示拓扑
   * param event
   */
  isShowTopogy(event) {
    // 隐藏卡片
    this.statisticsConfig.forEach(_item => _item.isShow = false);
    if (event.type === this.indexEvent.isTopog) {
      this.mainMap.isShowTopolgy(event.data.deviceId);
    } else {
      this.mainMap.isShowLight(event.data.deviceId);
    }
  }

  /**
   * 定位设施
   * param id
   * param {boolean} bol  是否判断聚合点table打开
   */
  location(id, bol = true) {
    // this.$businessFacilityService.eventEmit.subscribe((value) => {
    // });
    this.facilityId = id;
    this.mapFacilityId = this.facilityId;
    if (bol && this.isShowClustererFacilityTable) {
      this.hideClustererFacilityTable();
    }
    if (!this.$mapStoreService.getMarker(this.facilityId)) {
      this.$message.warning(this.indexLanguage.facilityNotExist);
      return;
    }
    if (this.facilityId) {
      this.openFacilityPanel();
    }

  }

  /**
   * 隐藏设施列表
   */
  hideFacilityPanel() {
    this.isShowFacilityPanel = false;
    this.facilityId = null;
    this.mapFacilityId = this.facilityId;
  }

  /**
   * 点击地图显示拓扑高亮
   */
  clickMapShowTopologicalHigh(data) {
    this.isExpandTopologicalHigh = false;
    // 打开拓扑高亮列表
    this.tabClick(2);
    setTimeout(() => {
      // 给拓扑设施名称赋值
      this.fibreListComponent.xcTable.handleSetControlData('opticCableName', data.opticCableName);
      // 调用搜索方法
      this.fibreListComponent.xcTable.handleSearch();
      this.queryDeviceInfoListByOpticCableId(data.opticCableId, '');
    }, 300);
  }

  tabClick(index) {
    if (index === index_left_panel.facilitiesList) {
      // 设施列表
      if (this.isExpandFacilityList) {
        this.foldFacilityList();
        this.foldLeftComponents();
      } else {
        this.expandFacilityList();
        this.foldMyCollection();
        this.foldTopoHigh();
        this.expandLeftComponents();
      }
      // this.updateDevice();
    } else if (index === index_left_panel.myCollection) {
      // 我的关注
      if (this.isExpandMyCollection) {
        this.foldMyCollection();
        this.foldLeftComponents();
      } else {
        this.expandMyCollection();
        this.foldFacilityList();
        this.foldTopoHigh();
        this.expandLeftComponents();
      }
    } else if (index === index_left_panel.toLogicalHighLighting) {
      // 拓扑高亮
      if (this.isExpandTopologicalHigh) {
        this.foldTopoHigh();
        this.foldLeftComponents();
      } else {
        this.expandTopoHigh();
        this.foldFacilityList();
        this.foldMyCollection();
        this.expandLeftComponents();
      }
    }
  }

  // 点击展开或隐藏卡片
  statisticsItemClick(item) {
    // 关闭设施详情面板
    if (this.isShowFacilityPanel) {
      this.closePanel();
    }
    // 关闭设施状态
    this.isExpandFacilityStatus = false;
    // 是否全选
    if (item.isShow && this.isShowCard) {
      this.isShowCard = !this.isShowCard;
    }
    // 是否展示
    if (!item.isShow && item.type !== 0) {
      // 总数一定显示
      this.statisticsConfig[0].isShow = true;
      item.isShow = true;
      return;
    }
    item.isShow = !item.isShow;
  }

  // 点击展开或隐藏所有的卡片
  public ClickAllItems() {
    // 关闭设施详情面板
    if (this.isShowFacilityPanel) {
      this.closePanel();
    }
    // 关闭设施状态
    this.isExpandFacilityStatus = false;
    // 展开或隐藏所有的卡片
    this.statisticsConfig.forEach(_item => _item.isShow = !this.isShowCard);
    this.isShowCard = !this.isShowCard;
  }

  /**
   * 点击退出高亮
   */
  exitTopology() {
    this.mainMap.clearLight();
    this.isLightButton = false;
    // this.refresh();
  }
}
