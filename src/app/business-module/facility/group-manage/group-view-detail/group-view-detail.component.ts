import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FacilityUtilService} from '../..';
import {GroupApiService} from '../../share/service/group/group-api.service';
import {FacilityListModel} from '../../share/model/facility-list.model';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {EquipmentListModel} from '../../../../core-module/model/equipment-list.model';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {AssetManagementLanguageInterface} from '../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {FilterCondition, QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {getDeviceStatus} from '../../share/const/facility.config';
import {GroupListModel} from '../../../../core-module/model/group-list.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {FilterSelectEnum} from '../../share/enum/equipment.enum';

/**
 * 查看分组详情
 */
@Component({
  selector: 'app-group-view-detail',
  templateUrl: './group-view-detail.component.html',
  styleUrls: ['./group-view-detail.component.scss', '../../facility-common.scss']
})
export class GroupViewDetailComponent implements OnInit, OnDestroy {

  @Input()
  public groupModel: GroupListModel = new GroupListModel();
  // 设施状态
  @ViewChild('deviceStatusRef') private deviceStatusRef: TemplateRef<HTMLDocument>;
  // 设备状态
  @ViewChild('equipmentStatusRef') private equipmentStatusRef: TemplateRef<HTMLDocument>;
  // 设备类型
  @ViewChild('equipmentTypeRef') private equipmentTypeRef: TemplateRef<HTMLDocument>;
  // 设备数量过滤
  @ViewChild('equipmentNumRef') equipmentNumRef: TemplateRef<HTMLDocument>;
  // 设施数据集
  public facilityRefGroupData: FacilityListModel[] = [];
  // 设施的分页参数
  public facilityRefGroupPageBean: PageBean = new PageBean();
  // 设施列表的表格参数
  public facilityRefGroupTableConfig: TableConfig;
  // 过滤操作类型
  public filterOperateEnum = OperatorEnum;
  //  过滤下拉选
  public filterSelectEnum = FilterSelectEnum;
  // 设备列表数据集
  public equipmentRefGroupData: EquipmentListModel[] = [];
  // 设备列表分页参数
  public equipmentRefGroupPageBean: PageBean = new PageBean();
  // 设备列表的参数
  public equipmentRefGroupTableConfig: TableConfig;
  // 设施国际化
  public facilityLanguage: FacilityLanguageInterface;
  // 资产国际化
  public assetLanguage: AssetManagementLanguageInterface;
  //  公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 设备数量操作符
  public equipmentNumSelectValue = OperatorEnum.eq;
  // 查询设施列表的参数
  private queryFacilityCondition: QueryCondition = new QueryCondition();
  // 查询设备列表的参数
  private queryEquipmentCondition: QueryCondition = new QueryCondition();

  /**
   *  构造器
   */
  constructor(
    private $groupAipService: GroupApiService,
    private $facilityUtilService: FacilityUtilService,
    private $nzI18n: NzI18nService) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.facilityLanguage = this.$nzI18n.getLocaleData('facility');
    this.assetLanguage = this.$nzI18n.getLocaleData('assets');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.queryEquipmentCondition.bizCondition.groupId = this.groupModel.groupId;
    this.queryFacilityCondition.bizCondition.groupId = this.groupModel.groupId;
    // 初始化分组关联设施列表
    this.initFacilityTable();
    //  初始化分组关联设备列表
    this.initEquipmentTable();
    // 查询分组关联设施列表数据
    this.queryFacilityList();
    // 查询分组关联设备列表数据
    this.queryEquipmentList();
  }

  /**
   * 销魂组件
   */
  public ngOnDestroy(): void {
    this.deviceStatusRef = null;
    this.equipmentStatusRef = null;
    this.equipmentTypeRef = null;
  }

  /**
   *  设施列表分页查询
   */
  public onFacilityRefGroupPageChange(event: PageBean): void {
    this.queryFacilityCondition.pageCondition.pageNum = event.pageIndex;
    this.queryFacilityCondition.pageCondition.pageSize = event.pageSize;
    this.queryFacilityList();
  }

  /**
   * 设备列表分页查询
   */
  public onEquipmentRefGroupPageChange(event: PageBean): void {
    this.queryEquipmentCondition.pageCondition.pageSize = event.pageSize;
    this.queryEquipmentCondition.pageCondition.pageNum = event.pageIndex;
    this.queryEquipmentList();
  }

  /**
   * 初始化设施列表
   */
  private initFacilityTable(): void {
    this.facilityRefGroupTableConfig = {
      primaryKey: '03-1',
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: false,
      notShowPrint: true,
      scroll: {x: '600px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.facilityLanguage.serialNumber
        },
        { // 名称
          title: this.facilityLanguage.deviceName,
          key: 'deviceName',
          isShowSort: true,
          searchable: true,
          width: 200,
          searchConfig: {type: 'input'},
        },
        { // 设备数量
          title: this.assetLanguage.equipmentInfoNum,
          key: 'equipmentInfoNum',
          isShowSort: true,
          width: 150,
          searchable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.equipmentNumRef
          },
        },
        { // 详细地址
          title: this.facilityLanguage.address,
          key: 'address',
          isShowSort: true,
          width: 200,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        { // 设施状态
          title: this.facilityLanguage.deviceStatus_a,
          key: 'deviceStatus',
          isShowSort: true,
          type: 'render',
          renderTemplate: this.deviceStatusRef,
          width: 150,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: getDeviceStatus(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        {
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 150,
          fixedStyle:
            {fixedRight: false, style: {right: '0px'}}
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      handleSearch: (event: FilterCondition[]) => {
        // 如果是根据设备数量进行过滤则操作符号需要特殊处理一下
        const index = event.findIndex(item => item.filterField === 'equipmentInfoNum');
        if (index >= 0) {
          event[index].operator = this.equipmentNumSelectValue;
        }
        this.queryFacilityCondition.filterConditions = event;
        this.queryFacilityCondition.pageCondition.pageNum = 1;
        this.queryFacilityList();
      },
      sort: (event: SortCondition) => {
        this.queryFacilityCondition.sortCondition = event;
        this.queryFacilityList();
      },
    };
  }

  /**
   *  初始化设备列表
   */
  private initEquipmentTable(): void {
    this.equipmentRefGroupTableConfig = {
      primaryKey: '03-1',
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: false,
      notShowPrint: true,
      scroll: {x: '600px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.facilityLanguage.serialNumber,
        },
        { // 名称
          title: this.facilityLanguage.name,
          key: 'equipmentName',
          width: 200,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 类型
          title: this.facilityLanguage.type,
          key: 'equipmentType',
          isShowSort: true,
          type: 'render',
          renderTemplate: this.equipmentTypeRef,
          width: 150,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.$facilityUtilService.getEquipmentType(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        {  // 详细地址
          title: this.facilityLanguage.address,
          key: 'address',
          width: 250,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 状态
          title: this.facilityLanguage.status,
          key: 'equipmentStatus',
          width: 100,
          type: 'render',
          renderTemplate: this.equipmentStatusRef,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.$facilityUtilService.getEquipmentStatus(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        {
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 150,
          fixedStyle:
            {fixedRight: false, style: {right: '0px'}}
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      handleSearch: (event: FilterCondition[]) => {
        this.queryEquipmentCondition.filterConditions = event;
        this.queryEquipmentCondition.pageCondition.pageNum = 1;
        this.queryEquipmentList();
      },
      sort: (event: SortCondition) => {
        this.queryEquipmentCondition.sortCondition = event;
        this.queryEquipmentList();
      }
    };
  }

  /**
   * 查询分组设施详情列表
   */
  private queryFacilityList(): void {
    this.facilityRefGroupTableConfig.isLoading = true;
    this.$groupAipService.queryGroupDeviceInfoList(this.queryFacilityCondition).subscribe(
      (result: ResultModel<FacilityListModel[]>) => {
        this.facilityRefGroupTableConfig.isLoading = false;
        this.facilityRefGroupPageBean.Total = result.totalCount;
        this.facilityRefGroupPageBean.pageIndex = result.pageNum;
        this.facilityRefGroupPageBean.pageSize = result.size;
        if (result.code === ResultCodeEnum.success) {
          this.facilityRefGroupData = result.data;
          if (!_.isEmpty(this.facilityRefGroupData)) {
            this.facilityRefGroupData.forEach(row => {
              // 处理状态图标和国际化
              row.deviceStatusTemp = row.deviceStatus;
              row.deviceStatus = getDeviceStatus(this.$nzI18n, row.deviceStatus) as string;
              const statusStyle = FacilityUtilService.getFacilityDeviceStatusClassName(row.deviceStatusTemp);
              row.deviceStatusIconClass = statusStyle.iconClass;
              row.deviceStatusColorClass = statusStyle.colorClass;
            });
          }
        }
      }, () => {
        this.facilityRefGroupTableConfig.isLoading = false;
      });
  }

  /**
   * 查询设备的分组详情列表
   */
  private queryEquipmentList(): void {
    this.equipmentRefGroupTableConfig.isLoading = true;
    this.$groupAipService.queryGroupEquipmentInfoList(this.queryEquipmentCondition).subscribe(
      (result: ResultModel<EquipmentListModel[]>) => {
        this.equipmentRefGroupTableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.equipmentRefGroupPageBean.Total = result.totalCount;
          this.equipmentRefGroupPageBean.pageIndex = result.pageNum;
          this.equipmentRefGroupPageBean.pageSize = result.size;
          this.equipmentRefGroupData = result.data;
          if (!_.isEmpty(this.equipmentRefGroupData)) {
            this.equipmentRefGroupData.forEach(item => {
              item.equipmentTypeName = item.equipmentType ?
                this.$facilityUtilService.getEquipmentType(this.$nzI18n, item.equipmentType) : '';
              item.equipmentStatusName = item.equipmentStatus ?
                this.$facilityUtilService.getEquipmentStatus(this.$nzI18n, item.equipmentStatus) : '';
              const statusStyle = FacilityUtilService.getFacilityDeviceStatusClassName(item.equipmentStatus);
              item.deviceStatusIconClass = statusStyle.iconClass;
              item.deviceStatusColorClass = statusStyle.colorClass;
            });
          }
        }
      }, () => {
        this.equipmentRefGroupTableConfig.isLoading = false;
      });
  }
}
