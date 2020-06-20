import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {Result} from '../../../../../shared-module/entity/result';
import {FacilityService} from '../../../../../core-module/api-service/facility/facility-manage';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {InspectionLanguageInterface} from '../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {AlarmObjectConfig, AreaConfig} from '../../../../../shared-module/component/alarm/alarmSelectorConfig';
import {TreeSelectorConfig} from '../../../../../shared-module/entity/treeSelectorConfig';
import {FacilityUtilService} from '../../../share/service/facility-util.service';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {MapService} from '../../../../../core-module/api-service/index/map';
import {AdjustMapComponent} from './adjust/adjustMap.component';
import {SmartLabelComponent} from './table/smart-label.component';
import {ExportParams} from '../../../../../shared-module/entity/exportParams';
import {CoreFusionComponent} from './core-fusion/core-fusion.component';
import {
  coreDeviceType,
  getCableDeviceType,
  getCableLevel,
  getCableSectionStatus,
  getTopologyName,
  getWiringType
} from '../../../share/const/facility.config';

const Operate = 'eq';


declare let BMap: any;   // 一定要声明BMap，要不然报错找不到BMap

/**
 * 查看光缆组件
 */
@Component({
  selector: 'app-view-cable',
  templateUrl: './view-cable.component.html',
  styleUrls: ['./view-cable.component.scss']
})
export class ViewCableComponent implements OnInit {
  // 光缆名称
  @ViewChild('cableName') public cableNameTemp: TemplateRef<void>;
  // 起始节点选择器
  @ViewChild('UnitNameSearch') public unitNameSearch: TemplateRef<void>;
  // 终止节点选择器
  @ViewChild('EndUnitNameSearch') public EndUnitNameSearch: TemplateRef<void>;
  // 光缆纤芯
  @ViewChild('cableCoreTemp') public cableCoreTemp: TemplateRef<void>;
  // 光缆长度
  @ViewChild('lengthTemp') public lengthTemp: TemplateRef<void>;
  // 光缆芯数
  @ViewChild('cableCoreNumTemp') public cableCoreNumTemp: TemplateRef<void>;
  // 调整智能标签坐标
  @ViewChild('adjustMap') public adjustMap: AdjustMapComponent;
  // 智能标签列表
  @ViewChild('smartLabel') public smartLabel: SmartLabelComponent;
  // 熔纤和查看熔纤
  @ViewChild('coreFusion') public coreFusion: CoreFusionComponent;
  // 巡检区域
  @ViewChild('areaSelector') private areaSelectorTemp;
  // 设施id 设施名称
  public deviceId: string;
  public deviceName: string;
  // 光缆段id
  public opticCableSectionId: string;
  // 光缆段纤芯数
  public num: number;
  // 光缆段名称
  public name: string;
  // 光缆段id
  public id: string;
  // 光缆段起始节点
  public startNode;
  // 光缆段终止节点
  public terminationNode;
  // 光缆段终止节点类型
  public terminationNodeDeviceType: string;
  // 光缆段起始节点类型
  public startNodeDeviceType: string;
  // 光缆段终止节点名称
  public terminationNodeName: string;
  // 光缆段起始节点名称
  public startNodeName: string;
  // 引入设施国际化
  public language: FacilityLanguageInterface;
  // 引入巡检国际化
  public InspectionLanguage: InspectionLanguageInterface;
  // 光缆信息表格配置
  public tableConfig: TableConfig;
  // 光缆信息列表分页
  public pageBean: PageBean = new PageBean(5, 1, 1);
  // 光缆信息列表分页条件
  public queryCondition: QueryCondition = new QueryCondition();
  // 光缆信息列表数据存放
  public _dataSet = [];
  // 光缆段信息列表配置
  public section_tableConfig: TableConfig;
  // 光缆段信息列表分页
  public section_pageBean: PageBean = new PageBean(5, 1, 1);
  // 光缆段信息列表分页条件
  public section_queryCondition: QueryCondition = new QueryCondition(); // 分页条件
  // 光缆段信息列表数据存放
  public section_dataSet = [];
  // 区域配置
  public areaSelectorConfig = new TreeSelectorConfig();
  // 区域初始化配置
  public areaConfig: AreaConfig;
  // 导出参数
  public exportParams: ExportParams = new ExportParams();
  // 节点选择器配置
  public treeSelectorConfig: TreeSelectorConfig;
  // 新增光缆按钮是否可以点击
  public isDisabled = false;
  // 光缆id
  public opticCableId: string;
  // 区域
  public areaList = {
    ids: [],
    name: ''
  };
  // 区域名称
  public areaName = '';
  // 区域数据存放
  public areaNodes = [];
  // 区域弹框
  public areaSelectVisible: boolean = false;
  // 初始化选择器配置
  public treeSetting;
  // 筛选
  public filterValue: string;
  // 设施起始节点选择器数据
  public treeNodes = [];
  // 选中设施起始节点名称
  public selectUnitName: string;
  // 设施节点的显示隐藏
  public isVisible = false;
  // 光缆纤芯筛选输入值
  public cableCoreInputValue: string;
  // 光缆纤芯筛选默认等于
  public cableCoreSelectValue = Operate;
  // 长度筛选输入值
  public lengthInputValue: string;
  // 长度筛选默认等于
  public lengthSelectValue = Operate;
  // 光缆芯数筛选输入值
  public cableCoreNumInputValue: string;
  // 光缆芯数筛选默认等于
  public cableCoreNumSelectValue = Operate;
  // 光缆弹框
  public mapIsible = false;
  // 智能标签弹框
  public labelVisible = false;
  // 纤芯熔接弹框
  public coreVisible = false;
  // 查看纤芯熔接标识数据
  public viewCoreFusion: boolean;
  // 光缆坐标数据
  public mapData = [];
  // 光缆坐标数据id
  public mapDataId = '';
  // 起始节点或终止节点title
  public title: string;
  // 设施选择器配置
  public deviceObjectConfig: AlarmObjectConfig;
  // 结束光缆设施选择器配置
  public deviceObjectConfigEnd: AlarmObjectConfig;
  // 已选设施
  public checkDeviceObject = {
    ids: [],
    name: ''
  };
  // 结束光缆
  public checkDeviceObjectEnd = {
    ids: [],
    name: ''
  };

  constructor(
    private $router: Router,
    private $activatedRoute: ActivatedRoute,
    private $nzI18n: NzI18nService,
    private $facilityService: FacilityService,
    private $modalService: FiLinkModalService,
    private $facilityUtilService: FacilityUtilService,
    public $mapService: MapService,
  ) {
  }

  public ngOnInit(): void {
    this.queryCondition.pageCondition.pageSize = 5;
    this.section_queryCondition.pageCondition.pageSize = 5;
    this.InspectionLanguage = this.$nzI18n.getLocaleData('inspection');
    this.language = this.$nzI18n.getLocaleData('facility');
    this.title = this.language.selectTheNode;
    this.initTableConfig();
    this.section_initTableConfig();
    this.refreshData();
    this.section_refreshData();
    this.initAreaConfig();
    this.initTreeSelectorConfig();
    this.initDeviceObjectConfig();
    this.initDeviceObjectConfigEnd();

  }

  /**
   *获取光缆信息列表
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$activatedRoute.queryParams.subscribe(params => {
      this.deviceId = params.id;
      this.queryCondition.bizCondition.deviceId = this.deviceId;
      if (!this.deviceId) {
        this.isDisabled = true;
      }
      this.$facilityService.getCableList(this.queryCondition).subscribe((result: Result) => {
        this.pageBean.Total = result.totalCount;
        this.tableConfig.isLoading = false;
        const data = result.data;
        data.forEach(item => {
          item.opticCableLevel = getCableLevel(this.$nzI18n, item.opticCableLevel);
          item.topology = getTopologyName(this.$nzI18n, item.topology);
          item.wiringType = getWiringType(this.$nzI18n, item.wiringType);
        });
        this._dataSet = result.data;
      }, () => {
        this.tableConfig.isLoading = false;
      });
    });
  }

  /**
   *光缆信息列表分页
   */
  public pageChange(event): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 设施选择器起始节点选择器
   */
  public initDeviceObjectConfig(): void {
    this.deviceObjectConfig = {
      clear: !this.checkDeviceObject.ids.length,
      alarmObject: (event) => {
        this.checkDeviceObject = event;
      }
    };

  }

  /**
   * 终止节点选择器
   */
  public initDeviceObjectConfigEnd(): void {
    this.deviceObjectConfigEnd = {
      clear: !this.checkDeviceObjectEnd.ids.length,
      alarmObject: (event) => {
        this.checkDeviceObjectEnd = event;
      }
    };
  }

  /**
   * 光缆列表生成导出条件
   */
  public createExportParams(event): void {
    this.exportParams.queryCondition = this.queryCondition;
    if (event.selectItem.length > 0) {
      this.exportParams.queryCondition.bizCondition.opticCableIds = event.selectItem.map(item => item.opticCableId);
    }
    this.exportParams.excelType = event.excelType;
  }

  /**
   * 光缆信息列表筛选
   * param event
   */
  public handleSearch(event): void {
    this.queryCondition.bizCondition = this.setBizCondition(event);
    if (this.cableCoreInputValue || this.cableCoreSelectValue) {
      this.queryCondition.bizCondition.coreNum = this.cableCoreInputValue;
      this.queryCondition.bizCondition.coreNumOperate = this.cableCoreSelectValue;
    }
    this.setPageCondition(event);
  }

  /**
   * 设置光缆信息列表查询条件
   */
  public setPageCondition(event): void {
    this.queryCondition.pageCondition.pageNum = 1;
  }

  /**
   * 光缆信息列表筛选下拉
   */
  public setBizCondition(event) {
    const _bizCondition = CommonUtil.deepClone(event);
    if (_bizCondition.opticCableLevel) {
      _bizCondition.opticCableLevels = CommonUtil.deepClone(_bizCondition.opticCableLevel);
      delete _bizCondition.opticCableLevel;
    }
    return _bizCondition;
  }

  /**
   *获取光缆段信息列表
   */
  public section_refreshData(): void {
    this.section_tableConfig.isLoading = true;
    this.$activatedRoute.queryParams.subscribe(params => {
      this.section_queryCondition.bizCondition.deviceId = params.id;
      this.$facilityService.getCableSegmentList(this.section_queryCondition).subscribe((result: Result) => {
        this.section_pageBean.Total = result.totalCount;
        this.section_tableConfig.isLoading = false;
        const data = result.data;
        data.forEach(item => {
          this.setIconStatus(item);
          item.startNodeDeviceType = getCableDeviceType(this.$nzI18n, item.startNodeDeviceType);
          item.terminationNodeDeviceType = getCableDeviceType(this.$nzI18n, item.terminationNodeDeviceType);
          if (item.status !== null) {
            item.status = getCableSectionStatus(this.$nzI18n, item.status);
          }
        });
        this.section_dataSet = result.data;
      }, () => {
        this.section_tableConfig.isLoading = false;
      });
    });
  }

  /**
   *光缆段信息列表分页
   */
  public section_pageChange(event): void {
    this.section_queryCondition.pageCondition.pageNum = event.pageIndex;
    this.section_queryCondition.pageCondition.pageSize = event.pageSize;
    this.section_refreshData();
  }

  /**
   * 熔纤业务是否可操作(按钮显灰)
   * Distribution_Frame
   */
  public setIconStatus(item): void {
    if (item.startNodeDeviceType !== coreDeviceType.junction_box &&
      item.startNodeDeviceType !== coreDeviceType.optical_box &&
      item.terminationNodeDeviceType !== coreDeviceType.junction_box &&
      item.terminationNodeDeviceType !== coreDeviceType.optical_box &&
      item.startNodeDeviceType !== coreDeviceType.Distribution_Frame &&
      item.terminationNodeDeviceType !== coreDeviceType.Distribution_Frame) {
      item.isShowIcon = 'disabled';
    } else {
      item.isShowIcon = true;
    }
  }

  /**
   * 设置熔纤参数
   */
  public setCoreFusion(data): void {
    this.id = data.opticCableSectionId;
    this.num = data.coreNum;
    this.name = data.opticCableSectionName;
    this.coreVisible = true;
    this.startNode = data.startNode;
    this.terminationNode = data.terminationNode;
    if (this.startNode === this.deviceId) {
      this.deviceName = data.startNodeName;
    }
    if (this.terminationNode === this.deviceId) {
      this.deviceName = data.terminationNodeName;
    }
    this.terminationNodeDeviceType = data.terminationNodeDeviceType;
    this.startNodeDeviceType = data.startNodeDeviceType;
    this.terminationNodeName = data.terminationNodeName;
    this.startNodeName = data.startNodeName;
    if (data.startNodeDeviceType === this.language.opticalBox) {
      this.startNodeDeviceType = coreDeviceType.opticalBox;
    } else if (data.startNodeDeviceType === this.language.junctionBox) {
      this.startNodeDeviceType = coreDeviceType.junctionBox;
    } else if (data.startNodeDeviceType === this.language.DistributionFrame) {
      this.startNodeDeviceType = coreDeviceType.DistributionFrame;
    }
    if (data.terminationNodeDeviceType === this.language.opticalBox) {
      this.terminationNodeDeviceType = coreDeviceType.opticalBox;
    } else if (data.terminationNodeDeviceType === this.language.junctionBox) {
      this.terminationNodeDeviceType = coreDeviceType.junctionBox;
    } else if (data.startNodeDeviceType === this.language.DistributionFrame) {
      this.terminationNodeDeviceType = coreDeviceType.DistributionFrame;
    }
  }

  /**
   * 光缆段列表生成导出条件
   */
  public createSectionExportParams(event): void {
    this.exportParams.queryCondition = this.queryCondition;
    if (event.selectItem.length > 0) {
      this.exportParams.queryCondition.bizCondition.opticCableSectionIds = event.selectItem.map(item => item.opticCableSectionId);
    }
    this.exportParams.excelType = event.excelType;
  }

  /**
   *光缆段列表筛选
   */
  public section_handleSearch(event): void {
    this.section_queryCondition.bizCondition = this.section_setBizCondition(event);
    if (this.cableCoreNumInputValue || this.cableCoreNumSelectValue) {
      this.section_queryCondition.bizCondition.coreNum = this.cableCoreNumInputValue;
      this.section_queryCondition.bizCondition.coreNumOperate = this.cableCoreNumSelectValue;
    }
    if (this.lengthInputValue || this.lengthSelectValue) {
      this.section_queryCondition.bizCondition.length = this.lengthInputValue;
      this.section_queryCondition.bizCondition.lengthOperate = this.lengthSelectValue;
    }
    this.section_setPageCondition(event);
  }

  /**
   * 设置光缆段信息列表查询条件
   */
  public section_setPageCondition(event): void {
    this.section_queryCondition.pageCondition.pageNum = 1;
  }

  /**
   * 光缆段信息列表筛选下拉
   */
  public section_setBizCondition(event): void {
    return CommonUtil.deepClone(event);
  }

  /**
   *区域配置
   */
  public initAreaConfig(): void {
    const clear = !this.areaList.ids.length;
    this.areaConfig = {
      clear: clear,
      checkArea: (event) => {
        this.areaList = event;
      }
    };
  }

  /**
   * 打开区域选择器
   */
  public showAreaSelectorModal(filterValue): void {
    this.filterValue = filterValue;
    if (!this.filterValue['filterValue']) {
      this.filterValue['filterValue'] = [];
    }
    this.treeSelectorConfig.treeNodes = this.areaNodes;
    this.areaSelectVisible = true;
  }

  /**
   * 打开起始节点选择器
   */
  public showModal(filterValue): void {
    this.filterValue = filterValue;
    if (!this.filterValue['filterValue']) {
      this.filterValue['filterValue'] = [];
    }
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isVisible = true;
  }

  /**
   * 起始节点选择结果
   * param event
   */
  public selectDataChange(event): void {
    let selectArr = [];
    this.selectUnitName = '';
    if (event.length > 0) {
      selectArr = event.map(item => {
        this.selectUnitName += `${item.deviceName},`;
        return item.deviceId;
      });
    } else {
    }
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    if (selectArr.length === 0) {
      this.filterValue['filterValue'] = null;
    } else {
      this.filterValue['filterValue'] = selectArr;
    }
    this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, selectArr);
  }

  /**
   *光缆名称点击筛选光缆段信息列表
   */
  public navigateToCableSegment(data): void {
    this.opticCableId = data.opticCableId;
    this.section_queryCondition.bizCondition.belongOpticCableId = this.opticCableId;
    this.section_refreshData();
  }

  /**
   * 新增光缆跳转
   */
  public addCable(): void {
    this.$router.navigate(['business/facility/view-cable-detail/add']).then();
  }

  /**
   *初始化光缆信息表单配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      primaryKey: '03-6',
      isLoading: false,
      noIndex: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      showSearchExport: true,
      searchReturnType: 'object',
      scroll: {x: '1600px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        { // 光缆名称
          title: this.language.cableName, key: 'opticCableName',
          fixedStyle: {fixedRight: true, style: {left: '62px'}}, width: 170,
          isShowSort: true, searchable: true,
          searchKey: 'opticCableName', type: 'render',
          renderTemplate: this.cableNameTemp,
          searchConfig: {type: 'input'}
        },
        { // 光缆级别
          title: this.language.cableLevel, key: 'opticCableLevel', width: 200,
          isShowSort: true, searchable: true, configurable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: getCableLevel(this.$nzI18n), label: 'label', value: 'code'
          },
        },
        { // 本地网代码

          title: this.language.localNetworkCode, key: 'localCode', width: 200,
          isShowSort: true, configurable: true, searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 光缆拓扑结构
          title: this.language.cableTopology, key: 'topology', width: 140,
          isShowSort: true, configurable: true, searchable: true,
          searchConfig: {
            type: 'select',
            selectInfo: getTopologyName(this.$nzI18n), label: 'label', value: 'code'
          },
        },
        { // 布线类型
          title: this.language.wiringType, key: 'wiringType', width: 120,
          isShowSort: true, configurable: true, searchable: true,
          searchConfig: {
            type: 'select',
            selectInfo: getWiringType(this.$nzI18n), label: 'label', value: 'code'
          },
        },
        { // 光缆纤芯
          title: this.language.cableCore, key: 'coreNum', width: 140,
          isShowSort: true, configurable: true, searchable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.cableCoreTemp,
          }
        },
        { // 业务信息
          title: this.language.businessInformation, key: 'bizId', width: 200,
          isShowSort: true, configurable: true, searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 备注
          title: this.language.remarks, key: 'remark', width: 200,
          isShowSort: true, configurable: true, searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 操作
          title: this.language.operate,
          searchable: true,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}, width: 150,
          searchConfig: {type: 'operate'},
        },
      ],
      showPagination: true, bordered: false, showSearch: false, pageSizeOptions: [5, 10, 15, 20],
      operation: [
        { // 编辑
          text: this.language.update, canDisabled: true,
          className: 'fiLink-edit',
          permissionCode: '03-6-2',
          handle: (data) => {
            this.$router.navigate(['business/facility/view-cable-detail/update'],
              {queryParams: {id: data.opticCableId}}).then();
          }
        },
        { // 单行删除
          text: this.language.deleteHandle,
          className: 'fiLink-delete red-icon',
          permissionCode: '03-6-3',
          canDisabled: true, needConfirm: true,
          handle: (data) => {
            this.$facilityService.deleteCableById(data.opticCableId).subscribe((result: Result) => {
              if (result.code === 0) {
                this.$modalService.success(result.msg);
                // 删除之后返回到第一页
                this.pageBean.pageIndex = 1;
                this.refreshData();
              } else {
                this.$modalService.error(result.msg);
              }
            });
          }
        },
      ],
      // 光缆信息列表排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 光缆信息列表筛选
      handleSearch: (event) => {
        this.cableCoreInputValue = event.coreNum;
        // 纤芯数筛选重置
        if (!event.coreNum) {
          this.cableCoreInputValue = '';
          this.queryCondition.bizCondition.coreNum = '';
          this.cableCoreSelectValue = Operate;
        }
        this.handleSearch(event);
        this.refreshData();
      },
      // 导出
      handleExport: (event) => {
        // 设置导出列
        this.exportParams.columnInfoList = event.columnInfoList;
        this.exportParams.columnInfoList.forEach(item => {
          if (item.propertyName === 'opticCableLevel' || item.propertyName === 'topology' ||
            item.propertyName === 'wiringType') {
            item.isTranslation = 1;
          }
        });
        this.createExportParams(event);
        this.$facilityService.exportCableList(this.exportParams).subscribe((result: Result) => {
          if (result.code === 0) {
            this.$modalService.success(result.msg);
          } else {
            this.$modalService.error(result.msg);
          }
        }, () => {
        });
      }
    };
  }

  /**
   * 初始化节点选择器配置
   */
  private initTreeSelectorConfig(): void  {
    this.treeSetting = {
      check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: {'Y': '', 'N': ''},
      },
      data: {
        simpleData: {
          enable: false,
          idKey: 'deviceId',
        },
        key: {
          name: 'deviceName',
          children: 'childDepartmentList'
        },
      },
      view: {
        showIcon: false,
        showLine: false
      }
    };
    this.treeSelectorConfig = {
      title: this.language.selectNode,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.language.deviceName, key: 'deviceName', width: 80
        },
        {
          title: this.language.deviceCode, key: 'deviceCode', width: 80,
        },
        {
          title: this.language.parentId, key: 'areaName', width: 80,
        }
      ]
    };
  }

  /**
   *初始化光缆段信息表单配置
   */
  private section_initTableConfig() {
    this.section_tableConfig = {
      isDraggable: true,
      primaryKey: '03-6',
      isLoading: false,
      showSearchSwitch: true,
      noIndex: true,
      showSizeChanger: true,
      showSearchExport: true,
      searchReturnType: 'object',
      scroll: {x: '1600px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        { // 光缆段名称
          title: this.language.cableSegmentName,
          fixedStyle: {fixedRight: true, style: {left: '62px'}},
          key: 'opticCableSectionName', width: 170,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 所属光缆名称
          title: this.language.nameOfTheCable, key: 'opticCableName', width: 170,
          isShowSort: true, searchable: true, searchConfig: {type: 'input'}
        },
        { // 所属区域
          title: this.language.affiliatedArea,
          key: 'areaName', width: 120, configurable: true,
          searchable: true, searchKey: 'areaIds',
          searchConfig: {
            type: 'render',
            selectInfo: this.areaList.ids,
            renderTemplate: this.areaSelectorTemp
          },
        },
        { // 起始节点
          title: this.language.startingNode,
          key: 'startNodeName', width: 170,
          searchKey: 'startNodes',
          configurable: true, searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.unitNameSearch}
        },
        { // 起始节点设施类型
          title: this.language.startNodeFacilityType,
          key: 'startNodeDeviceType', width: 150,
          isShowSort: true, searchKey: 'startNodeDeviceTypes',
          configurable: true, searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo:
              getCableDeviceType(this.$nzI18n), label: 'label', value: 'code'
          }
        },
        { // 终止节点
          title: this.language.terminationNode,
          key: 'terminationNodeName', width: 170,
          searchKey: 'terminationNodes', configurable: true, searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.EndUnitNameSearch}
        },
        { // 终止节点设施类型
          title: this.language.terminationNodeFacilityType,
          key: 'terminationNodeDeviceType', width: 150,
          isShowSort: true, configurable: true,
          searchKey: 'terminationNodeDeviceTypes',
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo:
              getCableDeviceType(this.$nzI18n), label: 'label', value: 'code'
          }
        },
        { // 光缆芯数
          title: this.language.numberOfOpticalCores,
          key: 'coreNum', width: 140,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.cableCoreNumTemp,
          }
        },
        { // 长度
          title: this.language.length + '(m)', key: 'length', width: 140,
          isShowSort: true, configurable: true, searchable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.lengthTemp,
          }
        },
        { // 状态
          title: this.language.status, key: 'status', width: 100,
          isShowSort: true, configurable: true, searchable: true,
          searchConfig: {
            type: 'select',
            selectInfo: getCableSectionStatus(this.$nzI18n), label: 'label', value: 'code'
          },
        },
        { // 备注
          title: this.language.remarks, key: 'remark', width: 200,
          isShowSort: true, configurable: true, searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 操作
          title: this.language.operate,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}, width: 150,
          searchable: true,
          searchConfig: {type: 'operate'},
        },
      ],
      showPagination: true, bordered: false, showSearch: false, pageSizeOptions: [5, 10, 15, 20],
      operation: [
        { // 纤芯熔接
          text: this.language.coreFusion, canDisabled: true,
          permissionCode: '03-6-5',
          key: 'isShowIcon',
          className: 'fiLink-fiber-socket',
          disabledClassName: 'fiLink-fiber-socket disabled-icon',
          handle: (data) => {
            this.viewCoreFusion = false;
            this.setCoreFusion(data);
          }
        },
        { // 查看纤芯熔接
          text: this.language.viewCoreFusion,
          permissionCode: '03-6-4',
          key: 'isShowIcon',
          className: 'fiLink-view-fiber', canDisabled: true,
          disabledClassName: 'fiLink-view-fiber disabled-icon',
          handle: (data) => {
            this.viewCoreFusion = true;
            this.setCoreFusion(data);
          }
        },
        { // 调整光缆段坐标
          text: this.language.adjustCableSegmentCoordinates, canDisabled: true,
          className: 'fiLink-location-adjust',
          permissionCode: '03-6-8',
          handle: (data) => {
            const deviceList = [data.startNode, data.terminationNode];
            // 查看有无设施权限
            this.$facilityService.deviceIdCheckUserIfDevicePermission(deviceList).subscribe((result: Result) => {
              if (result.data === true) {
                this.mapDataId = data.opticCableSectionId;
                this.mapIsible = true;
              } else {
                this.$modalService.info(this.language.lackOfFacilityPermissionToOperate);
              }
            });
          }
        },
        { // 查看光缆段智能标签
          text: this.language.viewCableSegmentIntelligenceLabel,
          className: 'fiLink-smart-label',
          permissionCode: '03-6-7',
          handle: (data) => {
            this.labelVisible = true;
            this.opticCableSectionId = data.opticCableSectionId;
          }
        },
        { // 删除
          text: this.language.deleteHandle,
          className: 'fiLink-delete red-icon',
          permissionCode: '03-6-9',
          canDisabled: true, needConfirm: true,
          handle: (data) => {
            const deviceList = [data.startNode, data.terminationNode];
            // 查看有无设施权限
            this.$facilityService.deviceIdCheckUserIfDevicePermission(deviceList).subscribe((result: Result) => {
              if (result.data === true) {
                this.$facilityService.deleteCableSectionById(data.opticCableSectionId).subscribe((results: Result) => {
                  if (results.code === 0) {
                    this.$modalService.success(results.msg);
                    // 删除之后返回到第一页
                    this.section_pageBean.pageIndex = 1;
                    this.section_refreshData();
                  } else {
                    this.$modalService.error(result.msg);
                  }
                });
              } else {
                this.$modalService.info(this.language.lackOfFacilityPermissionToOperate);
              }
            });
          }
        },
      ],
      // 光缆段列表排序
      sort: (event: SortCondition) => {
        this.section_queryCondition.sortCondition.sortField = event.sortField;
        this.section_queryCondition.sortCondition.sortRule = event.sortRule;
        this.section_refreshData();
      },
      // 光缆段列表筛选
      handleSearch: (event) => {
        this.cableCoreNumInputValue = event.coreNum;
        this.lengthInputValue = event.length;
        if (!event.coreNum) {
          this.cableCoreNumInputValue = '';
          this.section_queryCondition.bizCondition.coreNum = '';
          this.cableCoreNumSelectValue = Operate;
        }
        if (!event.length) {
          this.lengthInputValue = '';
          this.queryCondition.bizCondition.length = '';
          this.lengthSelectValue = Operate;
        }
        if (!event.areaIds) {
          this.areaList = {
            ids: [],
            name: ''
          };
          // 区域
          this.initAreaConfig();
        }
        // 没有值的时候重置节点已选数据
        if (!event.startNodes) {
          this.checkDeviceObject = {
            ids: [],
            name: ''
          };
          this.initDeviceObjectConfig();
        }
        if (!event.terminationNodes) {
          this.checkDeviceObjectEnd = {
            ids: [],
            name: ''
          };
          this.initDeviceObjectConfigEnd();
        }
        this.section_handleSearch(event);
        this.section_refreshData();
      },
      // 导出
      handleExport: (event) => {
        // 设置导出列
        this.exportParams.columnInfoList = event.columnInfoList;
        this.exportParams.columnInfoList.forEach(item => {
          if (item.propertyName === 'status' || item.propertyName === 'startNodeDeviceType' ||
            item.propertyName === 'terminationNodeDeviceType') {
            item.isTranslation = 1;
          }
        });
        this.createSectionExportParams(event);
        this.$facilityService.exportCableSectionList(this.exportParams).subscribe((result: Result) => {
          if (result.code === 0) {
            this.$modalService.success(result.msg);
          } else {
            this.$modalService.error(result.msg);
          }
        }, () => {
        });
      }
    };
  }
}
