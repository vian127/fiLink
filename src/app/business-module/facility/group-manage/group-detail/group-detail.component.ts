import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';
import {NzI18nService} from 'ng-zorro-antd';
import {GroupApiService} from '../../share/service/group/group-api.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {EquipmentApiService} from '../../share/service/equipment/equipment-api.service';
import {FacilityUtilService} from '../..';
import {FacilityService} from '../../../../core-module/api-service/facility/facility-manage';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {AssetManagementLanguageInterface} from '../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {FilterCondition, QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {ResultModel} from '../../../../core-module/model/result.model';
import {FacilityListModel} from '../../share/model/facility-list.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment-list.model';
import {getDeviceStatus} from '../../share/const/facility.config';
import {historyGoStepConst, operateTypeConst} from '../../share/const/facility-common.const';
import {QuickGroupTypeEnum} from '../../share/enum/group.enum';
import {GroupDetailModel} from '../../share/model/group-detail.model';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {FilterSelectEnum} from '../../share/enum/equipment.enum';

/**
 * 新增设备或编辑设备组件
 */
@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss',
    '../../facility-common.scss'],
})
export class GroupDetailComponent implements OnInit, OnDestroy {

  // 设施状态
  @ViewChild('deviceStatusTemplate') private deviceStatusTemplate: TemplateRef<HTMLDocument>;
  // 分组类容模版
  @ViewChild('groupContentTemp') private groupContentTemp: TemplateRef<HTMLDocument>;
  // 设备类型
  @ViewChild('equipmentTypeTemp') private equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  设备状态模版
  @ViewChild('equipmentStatusTemp') private equipmentStatusTemp: TemplateRef<HTMLDocument>;
  // 设备数量模版
  @ViewChild('equipmentNumTemplate') private equipmentNumTemplate: TemplateRef<HTMLDocument>;
  // 设施列表
  @ViewChild('facilityTable') private facilityTable: TableComponent;
  // 设施列表
  @ViewChild('equipmentTable') private equipmentTable: TableComponent;
  // 页面加载状态
  public pageLoading: boolean = false;
  // 表单字段
  public formColumn: FormItem[] = [];
  // 保存按钮状态
  public saveButtonDisable: boolean = true;
  // 保存按钮状态
  public isLoading: boolean = false;
  // 表单实例
  public formStatus: FormOperate;
  // 公用国际化
  public commonLanguage: CommonLanguageInterface;
  // 资产管理国际化
  public assetLanguage: AssetManagementLanguageInterface;
  // 资产管理公用国际化
  public language: FacilityLanguageInterface;
  // 分组内容选择器是否显示
  public showGroupContent: boolean = false;
  // 设施快速分组
  public deviceGroupType: string;
  // 设备快速分组类型
  public equipmentGroupType: string;
  // 设施列表数据集
  public facilityData: FacilityListModel[] = [];
  // 设备列表数据集
  public equipmentData: EquipmentListModel[] = [];
  // 设施列表分页参数
  public facilityPageBean: PageBean = new PageBean();
  // 设备列表分页参数
  public equipmentPageBean: PageBean = new PageBean();
  // 设施列表表格参数
  public facilityTableConfig: TableConfig;
  // 过滤操作符号
  public filterOperateEnum = OperatorEnum;
  //  过滤下拉选
  public filterSelectEnum = FilterSelectEnum;
  // 设备列表参数
  public equipmentTableConfig: TableConfig;
  // 页面操作类型
  public operateType: string = operateTypeConst.add;
  // 页面标题
  public pageTitle: string;
  // 选择分组内容中设施和设备的条数
  public groupContentMessage: string = '';
  //  快速分组类型枚举
  public quickGroupTypeEnum = QuickGroupTypeEnum;
  // 设备数量过滤操作符号
  public equipmentNumFilterValue: string = OperatorEnum.eq;
  //  设施查询参数
  private queryCondition: QueryCondition = new QueryCondition();
  // 设备列表查询参数
  private equipmentQueryCondition: QueryCondition = new QueryCondition();
  // 新增-编辑（回显）公用参数
  private addGroupParams: GroupDetailModel = new GroupDetailModel();

  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $ruleUtil: RuleUtil,
    private $groupApiService: GroupApiService,
    private $equipmentApiService: EquipmentApiService,
    private $active: ActivatedRoute,
    private $message: FiLinkModalService,
    private $facilityUtilService: FacilityUtilService,
    private $facilityApiService: FacilityService) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.assetLanguage = this.$nzI18n.getLocaleData('assets');
    // 初始化设施表格
    this.initFacilityTableConfig();
    // 初始化设备表格
    this.initEquipmentTableConfig();
    // 初始化表单
    this.initForm();
    // 获取操作类型生成title
    this.operateType = this.$active.snapshot.params.type;
    // 获取页面标题
    this.pageTitle = this.operateType === operateTypeConst.update ?
      this.assetLanguage.updateGroup : this.assetLanguage.addGroup;
    // 如果是修改页面则需要查询分组信息进行数据回显
    if (this.operateType === operateTypeConst.update) {
      this.handelGroupDetail();
    }
  }

  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    this.deviceStatusTemplate = null;
    this.groupContentTemp = null;
    this.equipmentTypeTemp = null;
    this.equipmentStatusTemp = null;
  }

  /**
   * 取消和关闭弹框
   */
  public onClose(): void {
    this.showGroupContent = false;
  }

  /**
   * 修改设施列表的分页
   */
  public facilityPageChange(event: PageBean): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryDeviceList();
  }

  /**
   * 修改设备列表的分页
   */
  public equipmentPageChange(event: PageBean): void {
    this.equipmentQueryCondition.pageCondition.pageSize = event.pageSize;
    this.equipmentQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryEquipmentList();
  }

  /**
   * 确定选择分组内容
   */
  public onOk(): void {
    this.showGroupContent = false;
  }

  /**
   * 设施快速分组勾选数据
   */
  public onClickQuickDevice(): void {
    this.$groupApiService.quickSelectGroupDeviceInfoList(this.deviceGroupType, this.queryCondition).subscribe(
      (result: ResultModel<string[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.addGroupParams.groupDeviceInfoIdList = _.cloneDeep(result.data);
          this.facilityData.forEach(item => {
            // 设置选中的状态
            item.checked = this.addGroupParams.groupDeviceInfoIdList.includes(item.deviceId);
          });
          // 触发表格修改状态事件，便于获取一次性获取跨页的设施数据
          this.facilityTable.updateSelectedData();
        }
      });
  }

  /**
   * 设备快速分组选择数据
   */
  public onClickQuickEquipment(): void {
    this.$groupApiService.quickSelectGroupEquipmentInfoList(this.equipmentGroupType, this.equipmentQueryCondition)
      .subscribe((res: ResultModel<string[]>) => {
        if (res.code === ResultCodeEnum.success) {
          // 获取返回的设备数据集
          this.addGroupParams.groupEquipmentIdList = _.cloneDeep(res.data);
          this.equipmentData.forEach(item => {
            // 设置设备回显勾中
            item.checked = this.addGroupParams.groupEquipmentIdList.includes(item.equipmentId);
          });
          // 触发表格选择事件便于一次性获取表格勾选项
          this.equipmentTable.updateSelectedData();
        }
      });
  }

  /**
   * 获取表单实例
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formColumn['formInstance'] = event;
    this.formColumn['formInstance'].instance.group.statusChanges.subscribe(() => {
      // 判断是否选择了分组内容的设施或者设备
      const selectedContent = _.isEmpty(this.addGroupParams.groupDeviceInfoIdList) &&
        _.isEmpty(this.addGroupParams.groupEquipmentIdList);
      // 表单校验是否填写了分组名称
      this.saveButtonDisable = this.formColumn['formInstance'].instance.getValid('groupName') && selectedContent;
    });
  }

  /**
   * 保存分组信息
   */
  public onClickSaveGroup(): void {
    const formValue = this.formStatus.group.getRawValue();
    this.addGroupParams.groupInfo.groupName = formValue.groupName;
    this.addGroupParams.groupInfo.remark = formValue.remark;
    this.isLoading = true;
    // 新增操作
    if (this.operateType === operateTypeConst.add) {
      this.$groupApiService.addGroupInfo(this.addGroupParams).subscribe(
        (result: ResultModel<string>) => {
          this.isLoading = false;
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(result.msg);
            this.onClickCancel();
          } else {
            this.$message.error(result.msg);
          }
        }, () => {
          this.isLoading = false;
        });
    } else {
      // 修改分组操作
      this.$groupApiService.updateGroupInfo(this.addGroupParams).subscribe(
        (result: ResultModel<string>) => {
          this.isLoading = false;
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(result.msg);
            this.onClickCancel();
          } else {
            this.$message.error(result.msg);
          }
        }, () => {
          this.isLoading = false;
        });
    }
  }

  /**
   * 确定选择分组内容
   */
  public onClickSelectContent(): void {
    // 拼接已选数据再文本框中显示
    this.groupContentMessage = `${this.assetLanguage.selectedDevice
    }${this.addGroupParams.groupDeviceInfoIdList.length}
     ${this.assetLanguage.item}
    ,${this.assetLanguage.selectedEquipment}
     ${this.addGroupParams.groupEquipmentIdList.length}${this.assetLanguage.item} `;
    this.formStatus.resetControlData('groupContent', this.groupContentMessage);
    this.showGroupContent = false;
  }

  /**
   * 取消编辑
   */
  public onClickCancel(): void {
    // 回到之前的页面
    window.history.go(historyGoStepConst);
  }

  /**
   * 打开分组类容选择器
   */
  public onShowGroupContent(): void {
    this.showGroupContent = true;
    // 查询设施列表
    this.queryDeviceList();
    // 查询设备列表
    this.queryEquipmentList();
  }

  /**
   *  处理分组基本信息进行回显
   */
  private handelGroupDetail(): void {
    let groupId = '';
    this.$active.queryParams.subscribe(params => {
      groupId = params.groupId;
    });
    // 根据分组ID查询分组信息
    this.$groupApiService.queryGroupDeviceAndEquipmentByGroupInfoId(groupId).subscribe(
      (res: ResultModel<any>) => {
        if (res.code === ResultCodeEnum.success) {
          this.addGroupParams = res.data;
          this.onClickSelectContent();
          // 处理表单数据进行回显
          if (this.addGroupParams && this.addGroupParams.groupInfo) {
            this.formStatus.resetData(this.addGroupParams.groupInfo);
          }
        } else {
          this.$message.error(res.msg);
        }
      });
  }

  /**
   *  查询设施列表
   */
  private queryDeviceList(): void {
    this.facilityTableConfig.isLoading = true;
    this.$facilityApiService.deviceListByPage(this.queryCondition).subscribe(
      (result: ResultModel<FacilityListModel[]>) => {
        this.facilityTableConfig.isLoading = false;
        this.facilityPageBean.Total = result.totalCount;
        this.facilityPageBean.pageIndex = result.pageNum;
        this.facilityPageBean.pageSize = result.size;
        if (result.code === ResultCodeEnum.success) {
          this.facilityData = result.data;
          if (!_.isEmpty(this.facilityData)) {
            this.facilityData.forEach(item => {
              // 处理状态图标和国际化
              item._deviceStatus = item.deviceStatus;
              item.deviceStatus = getDeviceStatus(this.$nzI18n, item.deviceStatus) as string;
              const statusType = FacilityUtilService.getFacilityDeviceStatusClassName(item._deviceStatus);
              item.deviceStatusIconClass = statusType.iconClass;
              item.deviceStatusColorClass = statusType.colorClass;
              // 设置数据回勾选
              if (this.addGroupParams.groupDeviceInfoIdList.includes(item.deviceId)) {
                item.checked = true;
              }
            });
          }
          // 如果是修改的就就需要回显

        }
      }, () => {
        this.facilityTableConfig.isLoading = false;
      });
  }

  /**
   *  查询设备列表
   */
  private queryEquipmentList(): void {
    this.equipmentTableConfig.isLoading = true;
    this.$equipmentApiService.equipmentListByPage(this.equipmentQueryCondition).subscribe(
      (result: ResultModel<EquipmentListModel[]>) => {
        this.equipmentTableConfig.isLoading = false;
        this.equipmentPageBean.Total = result.totalCount;
        this.equipmentPageBean.pageSize = result.size;
        this.equipmentPageBean.pageIndex = result.pageNum;
        if (result.code === ResultCodeEnum.success) {
          this.equipmentData = result.data;
          if (!_.isEmpty(this.equipmentData)) {
            this.equipmentData.forEach(item => {
              // 设置设备类型的图标
              item.iconClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
              // 设备类型和状态国际化以及状态样式
              item._equipmentType = item.equipmentType;
              item.equipmentType = this.$facilityUtilService.getEquipmentType(this.$nzI18n, item.equipmentType);
              item._equipmentStatus = item.equipmentStatus;
              // 设置设备状态图标样式
              const iconStyle = FacilityUtilService.getFacilityDeviceStatusClassName(item._equipmentStatus);
              item.equipmentStatusIconClass = iconStyle.iconClass;
              item.equipmentStatusColorClass = iconStyle.colorClass;
              // 设备状态国际化
              item.equipmentStatus = this.$facilityUtilService.getEquipmentStatus(this.$nzI18n, item.equipmentStatus);
              // 获取详细地址
              item.address = item.deviceInfo ? item.deviceInfo.address : '';
              // 设置设备列表反勾选
              if (this.addGroupParams.groupEquipmentIdList.includes(item.equipmentId)) {
                item.checked = true;
              }
            });
          }
        }
      }, () => {
        this.equipmentTableConfig.isLoading = false;
      });
  }

  /**
   * 初始化表单字段
   */
  private initForm(): void {
    this.formColumn = [
      {
        label: this.language.name,
        key: 'groupName',
        type: 'input',
        placeholder: this.language.pleaseEnter,
        col: 24,
        require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value =>
              this.$groupApiService.checkGroupInfoByName(value),
            res => res.data)
        ],
      },
      {
        label: this.assetLanguage.groupContent,
        key: 'groupContent',
        type: 'custom',
        template: this.groupContentTemp,
        placeholder: this.language.picInfo.pleaseChoose,
        col: 24,
        require: true,
        rule: [
          {required: true}],
        customRules: [],
        asyncRules: [],
      },
      {
        label: this.language.remarks,
        key: 'remark',
        type: 'textarea',
        placeholder: this.language.pleaseEnter,
        col: 24,
        require: false,
        rule: [],
        customRules: [],
        asyncRules: [],
      }
    ];
  }

  /**
   *  初始化设施表格参数
   */
  private initFacilityTableConfig(): void {
    this.facilityTableConfig = {
      primaryKey: '03-1',
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: false,
      notShowPrint: true,
      scroll: {x: '600px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      keepSelected: true,
      selectedIdKey: 'deviceId',
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 名称
          title: this.language.deviceName, key: 'deviceName', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        { // 设备数量
          title: this.language.equipmentQuantity,
          key: 'equipmentQuantity', width: 120,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.equipmentNumTemplate
          }
        },
        {  // 详细地址
          title: this.language.address,
          key: 'address',
          width: 150,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 状态
          title: this.language.deviceStatus,
          key: 'deviceStatus',
          width: 120,
          type: 'render',
          renderTemplate: this.deviceStatusTemplate,
          configurable: false,
          isShowSort: true,
          searchable: true,
          minWidth: 90,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: getDeviceStatus(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.initFacilityTableConfig();
      },
      // 过滤查询
      handleSearch: (event: FilterCondition[]) => {
        const index = event.findIndex(item => item.filterField === 'equipmentQuantity');
        if (index >= 0) {
          event[index].operator = this.equipmentNumFilterValue;
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.initFacilityTableConfig();
      },
      // 勾选或去勾选数据做处理
      handleSelect: (event: FacilityListModel[]) => {
        // 获取列表中未选中的数据
        const unChecked = this.facilityData.filter(item => !item.checked);
        const unCheckIds = unChecked.map(item => {
          return item.deviceId;
        });
        // 获取选中数据的id
        const checkIdIds = event.map(row => {
          return row.deviceId;
        });
        //  将选中的数据添加进list并且去重
        this.addGroupParams.groupDeviceInfoIdList =
          _.uniq(this.addGroupParams.groupDeviceInfoIdList.concat(checkIdIds));
        this.addGroupParams.groupDeviceInfoIdList = this.addGroupParams.groupDeviceInfoIdList.filter(
          row => !unCheckIds.includes(row));
      }
    };
  }

  /**
   *  初始化设备的配置
   */
  private initEquipmentTableConfig(): void {
    this.equipmentTableConfig = {
      primaryKey: '03-1',
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: false,
      notShowPrint: true,
      scroll: {x: '600px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      showPagination: true,
      bordered: false,
      showSearch: false,
      keepSelected: true,
      selectedIdKey: 'equipmentId',
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 名称
          title: this.language.name,
          key: 'equipmentName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 类型
          title: this.language.type,
          key: 'equipmentType',
          isShowSort: true,
          type: 'render',
          width: 200,
          searchable: true,
          renderTemplate: this.equipmentTypeTemp,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.$facilityUtilService.getEquipmentType(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        { // 详细地址
          title: this.language.address,
          key: 'address',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 状态
          title: this.language.status,
          key: 'equipmentStatus',
          width: 200,
          type: 'render',
          renderTemplate: this.equipmentStatusTemp,
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
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        }
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.equipmentQueryCondition.sortCondition.sortField = event.sortField;
        this.equipmentQueryCondition.sortCondition.sortRule = event.sortRule;
        this.queryEquipmentList();
      },
      // 过滤查询数据
      handleSearch: (data: FilterCondition[]) => {
        this.equipmentQueryCondition.filterConditions = data;
        this.equipmentQueryCondition.pageCondition.pageNum = 1;
        this.queryEquipmentList();
      },
      // 选中或去勾选
      handleSelect: (data: EquipmentListModel[]) => {
        // 获取选中数据的id
        const checkIdIds = data.map(row => {
          return row.equipmentId;
        });
        const unCheckedEquipment = this.equipmentData.filter(item => !item.checked);
        // 获取列表中未选中的数据
        const unCheckEquipmentIds = unCheckedEquipment.map(item => {
          return item.deviceId;
        });
        //  将选中的数据添加进list并且去重
        this.addGroupParams.groupEquipmentIdList =
          _.uniq(this.addGroupParams.groupEquipmentIdList.concat(checkIdIds));
        this.addGroupParams.groupEquipmentIdList = this.addGroupParams.groupEquipmentIdList.filter(
          item => !unCheckEquipmentIds.includes(item));
      }
    };
  }
}

