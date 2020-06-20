import {Component, OnDestroy, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {MapComponent} from '../../../../shared-module/component/map/map.component';
import {MapConfig} from '../../../../shared-module/component/map/map.config';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {MAP_ICON_CONFIG} from '../../../../shared-module/const/facility';
import {LoopService} from '../../../../core-module/api-service/facility/loop-management';
import {ResultModel} from '../../../../core-module/model/result.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment-list.model';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {LoopListModel} from '../../share/model/loop-list.model';
import {MapStoreService} from '../../../../core-module/store/map.store.service';

declare const MAP_TYPE;

/**
 * 回路列表主界面组件
 */
@Component({
  selector: 'app-loop-list',
  templateUrl: './loop-list.component.html',
  styleUrls: ['./loop-list.component.scss']
})

export class LoopListComponent implements OnInit, OnDestroy, AfterViewInit {
  // 地图
  @ViewChild('mainMap') mainMap: MapComponent;
  // 列表实例
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // 地图配置
  public mapConfig: MapConfig;
  // 设施数据
  public data;
  // 设施图标大小
  public iconSize;
  // 路由上的id
  public mapFacilityId;
  // 区域数据
  public areaData;
  // 地图类型
  public mapType;
  // 地图显示界面高度变化
  public mapHeight: string = '200px';
  // 地图是否显示移入移出按钮
  public isShowButton: boolean = false;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 列表数据
  public dataSet = [];
  // 列表分页实体
  public pageBean: PageBean = new PageBean(10, 1, 1);
  // 列表配置
  public tableConfig: TableConfig;
  // 列表查询条件
  public queryCondition: QueryCondition = new QueryCondition();
  // 回路列表复选框勾选数据
  public selectListData: Array<any>;
  // 是否隐藏地图部分
  public isShowMap: boolean = true;
  // 是否隐藏列表部分
  public isShowTable: boolean = true;
  // 是否隐藏地图变小化按钮
  public showUpIcon: boolean = true;
  // 回路弹框是否展开
  public isVisible: boolean = false;
  // 回路弹框标题
  public loopModalTitle: string;
  // 区域中心点
  public centerPoint: string;
  // 连线数据
  public polylineData: Array<any>;

  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $router: Router,
    private $loopService: LoopService,
    private $mapStoreService: MapStoreService,
  ) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.loopModalTitle = '回路列表';
    // 初始化连线数据
    this.polylineData = [];
    // 列表初始化
    this.initTableConfig();
    // 刷新列表数据
    this.refreshData();
    this.mapType = MAP_TYPE;
    this.mapConfig = new MapConfig('loop-map', this.mapType, MAP_ICON_CONFIG.defaultIconSize, []);
    this.iconSize = MAP_ICON_CONFIG.defaultIconSize;
    // 初始化地图数据
    this.initMapData();

  }

  /**
   * 视图记载完成
   */
  public ngAfterViewInit(): void {
  }

  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    this.mainMap = null;
    this.tableComponent = null;
  }

  /**
   * 初始化地图设施数据
   */
  public initMapData(): void {
    // test数据
    const testAreaData = {
      'polymerizationType': '1',
      'filterConditions': {
        'area': [],
        'device': ['002']
      }
    };
    // 用户有权限的区域下所有智慧功能杆子设施
    this.$loopService.queryLoopMapByArea(testAreaData).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.centerPoint = result.data.positionCenter;
        this.cacheData(result.data.polymerizationData);
      } else {
        this.$message.error(result.msg);
      }
    });
  }


  /**
   * 缓存数据
   * param data
   */
  cacheData(data) {
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
   * 地图事件回传
   * param event
   */
  public mapEvent(event): void {

  }


  /**
   * 地图变小化
   */
  public mapMinHeightChange(): void {
    this.isShowTable = true;
    const maxHeight = `${window.innerHeight - 165}px`;
    if (this.mapHeight === maxHeight) {
      this.mapHeight = '200px';
    } else {
      this.mapHeight = '0px';
      this.isShowMap = false;
      this.showUpIcon = false;
    }
  }


  /**
   * 地图变大化
   */
  public mapBigHeightChange(): void {
    const maxHeight = `${window.innerHeight - 165}px`;
    this.isShowMap = true;
    this.showUpIcon = true;
    if (this.mapHeight === '0px') {
      this.mapHeight = '200px';
      this.isShowTable = true;
    } else {
      this.mapHeight = maxHeight;
      this.isShowTable = false;
    }

  }

  /**
   * 点击框选事件
   */
  public mapSelectData(): void {
    this.isShowButton = !this.isShowButton;
    const colorStyle = ['#f40808', '#fbf603', '#35fc09'];
    const data1 = [
      {lng: '116.399', lat: ' 39.910'},
      {lng: '116.405', lat: ' 39.920'},
      {lng: '116.423493', lat: '39.907445'},
      {lng: '116.44', lat: '39.93'},
    ];
    this.mainMap.loopDrawLine( data1, colorStyle[0]);
    const data2 = [
      {lng: '116.405', lat: ' 39.912'},
      {lng: '116.4', lat: ' 39.921'},
      {lng: '116.41', lat: '39.906'},
      {lng: '116.42', lat: '39.93'},
    ];
    this.mainMap.loopDrawLine(data2, colorStyle[2]);
  }

  /**
   * 移入回路事件
   */
  public moveIntoLoop(): void {
    this.isVisible = true;
  }

  /**
   * 移出回路事件
   */
  public moveOutLoop(): void {
    this.isVisible = true;
  }


  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      primaryKey: ' ',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1804px', y: '340px'},
      noIndex: false,
      showSearchExport: true,
      columnConfig: [
        {
          type: 'select',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 62
        },
        { // 回路名称
          title: this.language.loopName,
          key: 'loopName',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 回路类型
          title: this.language.loopType,
          key: 'loopType',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 所属配电箱
          title: this.language.distributionBox,
          key: 'distributionBoxName',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 备注
          title: this.language.remarks,
          key: 'remark',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 操作
          title: this.language.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '',
          width: 180,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        { // 新增
          text: '+  ' + this.language.addArea,
          permissionCode: '',
          handle: () => {
            this.navigateToDetail('business/facility/loop-detail/add',
              {queryParams: {}});
          }
        },
        { // 批量删除
          text: this.language.deleteHandle,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '',
          needConfirm: true,
          canDisabled: true,
          confirmContent: this.language.deleteFacilityMsg,
          handle: (data) => {

          }
        },
        { // 批量拉闸
          text: this.language.brake,
          canDisabled: true,
          permissionCode: '',
          handle: (data) => {

          }
        },
        { // 批量合闸
          text: this.language.closing,
          canDisabled: true,
          permissionCode: '',
          handle: (data) => {

          }
        },
      ],
      operation: [
        { // 查看详情
          text: this.language.viewDetail,
          className: 'fiLink-view-detail',
          permissionCode: '',
          handle: (currentData) => {
            this.navigateToDetail('business/facility/loop-view-detail',
              {
                queryParams: {}
              });
          }
        },
        { // 编辑
          text: this.language.update,
          permissionCode: '',
          className: 'fiLink-edit',
          handle: (currentData) => {
            this.navigateToDetail('business/facility/loop-detail/update',
              {queryParams: {id: currentData.deviceId}});
          }
        },
        { // 拉闸
          text: this.language.brake,
          permissionCode: '',
          className: 'fiLink-edit',
          handle: (currentData) => {

          }
        },
        { // 合闸
          text: this.language.closing,
          permissionCode: '',
          className: 'fiLink-edit',
          handle: (currentData) => {
          }
        },
        { // 删除
          text: this.language.deleteHandle,
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          permissionCode: '',
          confirmContent: this.language.deleteTip,
          handle: (currentData) => {

          }
        },
      ],
      leftBottomButtons: [],
      rightTopButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      handleExport: (event) => {
        // 导出
        // this.$facilityService.exportLoopList( ).subscribe((res: Result) => {
        //   if (res.code === 0) {
        //     this.$message.success(res.msg);
        //   } else {
        //     this.$message.error(res.msg);
        //   }
        // });
      },
      // 点击选择事件
      handleSelect: (event) => {
        this.selectListData = event;
        console.log(this.selectListData);
        // this.addLine(this.selectListData);
      }
    };
  }

  /**
   * 跳转到详情
   * param url
   */
  private navigateToDetail(url, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

  /**
   * 表格分页
   */
  pageChange(event: PageBean): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }


  /**
   * 刷新回路列表
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$loopService.queryLoopList(this.queryCondition).subscribe((result: ResultModel<LoopListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.dataSet = result.data || [];
        console.log(this.dataSet);
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }


  /**
   * 地图回路弹框选择数据
   */
  public selectLoopData(ev: Array<any>): void {

  }


}
