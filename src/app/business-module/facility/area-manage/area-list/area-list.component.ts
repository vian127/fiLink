import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {Router} from '@angular/router';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {AreaService} from '../../../../core-module/api-service/facility';
import {MapSelectorConfig} from '../../../../shared-module/entity/mapSelectorConfig';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {AreaLevel, getAreaLevel} from '../../share/const/facility.config';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {UserService} from '../../../../core-module/api-service/user/user-manage';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {ResultModel} from '../../../../core-module/model/result.model';
import {FacilityUtilService} from '../..';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';

/**
 * 区域列表组件
 */
@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss']
})
export class AreaListComponent implements OnInit {
  // 区域级别模板
  @ViewChild('areaLevelTemp') areaLevelTemp: TemplateRef<any>;
  // 左上角选择级别模板
  @ViewChild('topCustomButton') topCustomButton: TemplateRef<any>;
  // 责任单位选择模板
  @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  // 列表数据
  public _dataSet = [];
  // 列表配置
  public tableConfig: TableConfig;
  // 列表查询条件
  public queryConditions = {bizCondition: {level: ''}};
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 树选择器配置
  public treeSelectorConfig: TreeSelectorConfig;
  // 树的数据
  public treeNodes: any[] = null;
  // 树配置
  public treeSetting = {};
  // 地图选择器显示隐藏
  public mapVisible = false;
  // 地图选择器配置
  public mapSelectorConfig: MapSelectorConfig;
  // 已选级别
  public selectedValue = 0;
  // 区域级别
  public AreaLevel;
  // 级别选择项
  public selectedOption;
  // 责任单位选择器隐藏显示
  public isVisible: boolean = false;
  // 已选择责任单位名称
  public selectUnitName: string = '';
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 设施id
  private deviceId: string;
  // 过滤的值
  private filterValue: any;

  constructor(private $message: FiLinkModalService, private $router: Router,
              private $modalService: NzModalService,
              private $facilityUtilService: FacilityUtilService,
              private $userService: UserService,
              public $nzI18n: NzI18nService, private $areaService: AreaService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData('facility');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    // 初始化table配置
    this.initTableConfig();
    // 初始化树选择器配置
    this.initTreeSelectorConfig();
    // 属性列表数据
    this.refreshData();
    // 区域级别常量
    this.AreaLevel = AreaLevel;
    // 区域选择下拉选项国际化
    this.selectedOption = [
      {label: `${this.language.open}${this.language.config.AREA_LEV_ONE}${this.language.openArea}`},
      {label: `${this.language.open}${this.language.config.AREA_LEV_TWO}${this.language.openArea}`},
      {label: `${this.language.open}${this.language.config.AREA_LEV_THREE}${this.language.openArea}`},
      {label: `${this.language.open}${this.language.config.AREA_LEV_FOUR}${this.language.openArea}`},
      {label: `${this.language.open}${this.language.config.AREA_LEV_FIVE}${this.language.openArea}`},
    ];
  }

  /**
   * 责任单位选择结果
   * param event
   */
  public selectDataChange(event): void {
    let selectArr = [];
    this.selectUnitName = '';
    if (event.length > 0) {
      selectArr = event.map(item => {
        this.selectUnitName += `${item.deptName},`;
        return item.id;
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
   * 打开责任单位选择器
   */
  public showModal(filterValue): void {
    this.filterValue = filterValue;
    if (!this.filterValue['filterValue']) {
      this.filterValue['filterValue'] = [];
    }
    // 当责任单位数据不为空的时候
    if (this.treeNodes) {
      this.treeSelectorConfig.treeNodes = this.treeNodes;
      this.isVisible = true;
    } else {
      // 查询单位列表
      this.$facilityUtilService.getDept().then((data: any[]) => {
        this.treeNodes = data;
        this.treeSelectorConfig.treeNodes = this.treeNodes;
        this.isVisible = true;
      });
    }
  }

  /**
   * 初始化单位选择器配置
   */
  private initTreeSelectorConfig(): void {
    this.treeSetting = {
      check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: {'Y': '', 'N': ''},
      },
      data: {
        simpleData: {
          enable: true,
          idKey: 'id',
          pIdKey: 'deptFatherId',
          rootPid: null
        },
        key: {
          name: 'deptName',
          children: 'childDepartmentList'
        },
      },
      view: {
        showIcon: false,
        showLine: false
      }
    };
    this.treeSelectorConfig = {
      title: `${this.language.selectUnit}`,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.language.deptName, key: 'deptName', width: 100,
        },
        {
          title: this.language.deptLevel, key: 'deptLevel', width: 100,
        },
        {
          title: this.language.parentDept, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }


  /**
   * 刷新区域数据
   */
  private refreshData(): void {
    this.selectedValue = 0;
    this.tableConfig.isLoading = true;
    this.$areaService.areaListByPage(this.queryConditions).subscribe((result: ResultModel<AreaModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this._dataSet = result.data || [];
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      primaryKey: '03-2',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1000px', y: '400px'},
      noIndex: true,
      showSearchExport: true,
      columnConfig: [
        {
          type: 'expend', width: 30, expendDataKey: 'children',
          // fixedStyle: {fixedLeft: true, style: {left: '0px'}}
        },
        {
          type: 'select',
          // fixedStyle: {fixedLeft: true, style: {left: '30px'}},
          width: 62
        },
        {
          key: 'serialNumber', width: 62, title: this.language.serialNumber,
          // fixedStyle: {fixedLeft: true, style: {left: '92px'}}
        },
        {
          title: this.language.areaName, key: 'areaName', width: 124,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
          // fixedStyle: {fixedLeft: true, style: {left: '154px'}}
        },
        {
          title: this.language.parentId, key: 'parentName', width: 124,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.level, key: 'level', width: 100,
          configurable: true,
          type: 'render',
          searchable: true,
          searchConfig: {
            type: 'select', selectInfo: getAreaLevel(this.$nzI18n), label: 'label', value: 'code'
          },
          renderTemplate: this.areaLevelTemp,
        },
        {
          title: this.language.provinceName, key: 'provinceName', width: 100,
          configurable: true,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.cityName, key: 'cityName', width: 100, configurable: true,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.districtName, key: 'districtName', width: 100, configurable: true,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.address, key: 'address', width: 100, configurable: true,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.accountabilityUnit, key: 'accountabilityUnitName', configurable: true,
          searchKey: 'accountabilityUnit',
          searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.UnitNameSearch}
        },
        {
          title: this.language.remarks, key: 'remarks', configurable: true, width: 150,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      searchReturnType: 'object',
      topButtons: [
        {
          text: '+  ' + this.language.addArea,
          handle: (currentIndex) => {
            this.addArea();
          },
          permissionCode: '03-2-2'
        },
        {
          text: this.language.deleteHandle,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          canDisabled: true,
          needConfirm: true,
          handle: (data) => {
            const ids = data.map(item => item.areaId);
            this.$areaService.deleteAreaByIds(ids).subscribe((result: ResultModel<any>) => {
              if (result.code === ResultCodeEnum.success) {
                this.refreshData();
                this.$message.success(result.msg);

              } else {
                this.$message.error(result.msg);
              }
            });
          },
          permissionCode: '03-2-4'
        },
      ],
      operation: [
        {
          text: this.language.setDevice, className: 'fiLink-facility-m', handle: (event) => {
            this.navigateToDetail('business/facility/set-area-device', {queryParams: {id: event.areaId}});
          },
          permissionCode: '03-2-6',
        },
        {
          text: this.language.update,
          permissionCode: '03-2-3',
          className: 'fiLink-edit',
          handle: (currentIndex) => {
            this.navigateToDetail('business/facility/area-detail/update', {queryParams: {id: currentIndex.areaId}});
          }
        },
        {
          text: this.language.deleteHandle,
          needConfirm: true,
          permissionCode: '03-2-4',
          className: 'fiLink-delete red-icon',
          handle: (currentIndex) => {
            this.$areaService.deleteAreaByIds([currentIndex.areaId]).subscribe((result: ResultModel<any>) => {
              if (result.code === ResultCodeEnum.success) {
                this.refreshData();
                this.$message.success(result.msg);
              } else {
                this.$message.error(result.msg);
              }
            });
          }
        },
      ],
      topCustomButton: this.topCustomButton,
      sort: (event) => {
        this.queryConditions.bizCondition['sortField'] = event.sortField;
        this.queryConditions.bizCondition['sortRule'] = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event) => {
        this.queryConditions.bizCondition = event;
        // 没有值的时候重置已选数据
        if (!event.accountabilityUnit) {
          this.selectUnitName = '';
          this.$facilityUtilService.setTreeNodesStatus(this.treeNodes || [], []);
        }
        this.refreshData();
      },
      expandHandle: () => {
        this.selectedValue = null;
      },
      handleExport: (event) => {
        // 处理参数
        const body = {
          queryCondition: new QueryCondition(),
          columnInfoList: event.columnInfoList,
          excelType: event.excelType
        };
        body.columnInfoList.forEach(item => {
          if (item.propertyName === 'level') {
            item.isTranslation = 1;
          }
        });
        // 处理选择的项目
        if (event.selectItem.length > 0) {
          body.queryCondition.bizCondition['areaIds'] = event.selectItem.map(item => item.areaId);
        } else {
          // 处理查询条件
          body.queryCondition.bizCondition = event.queryTerm;

        }
        this.$areaService.exportAreaList(body).subscribe((res: ResultModel<any>) => {
          if (res.code === '0') {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    };
  }

  /**
   * 点击新增区域
   */
  private addArea(): void {
    this.$router.navigate(['business/facility/area-detail/add']).then();
  }

  /**
   * 跳转到详情
   * param url
   */
  private navigateToDetail(url, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }
}
