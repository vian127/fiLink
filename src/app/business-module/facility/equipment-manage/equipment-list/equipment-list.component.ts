import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {EquipmentApiService} from '../../share/service/equipment/equipment-api.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityUtilService} from '../..';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {FilterCondition, QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FacilityListModel} from '../../share/model/facility-list.model';
import {hiddenSliderHighConst, isTranslationConst, showSliderHighConst} from '../../share/const/facility-common.const';
import {EquipmentListModel} from '../../../../core-module/model/equipment-list.model';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {EquipmentStatisticsModel} from '../../share/model/equipment-statistics.model';
import {SliderConfig} from '../../share/model/slider-config';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {EquipmentStatusEnum, FilterSelectEnum} from '../../share/enum/equipment.enum';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment.enum';

/**
 * 设备列表组件
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss',
    '../../facility-common.scss']
})
export class EquipmentListComponent implements OnInit, OnDestroy {
  // 设备类型
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  // 报废年限过滤模版
  @ViewChild('scrapTimeTemp') scrapTimeTemp: TemplateRef<HTMLDocument>;
  //  设备状态模版
  @ViewChild('equipmentStatusTemp') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // 列表实例
  @ViewChild('tableComponent') tableRef: TableComponent;
  // 设施过滤模版
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  // 设施列表展示模版
  @ViewChild('deviceNameTemplate') deviceNameTemplate: TemplateRef<HTMLDocument>;
  // 滑块配置
  public sliderConfig: SliderConfig[] = [];
  // 列表数据
  public dataSet: EquipmentListModel[] = [];
  // 列表分页实体
  public pageBean: PageBean = new PageBean();
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 首页语言包
  public commonLanguage: CommonLanguageInterface;
  // 列表配置
  public tableConfig: TableConfig;
  // 列表查询条件
  public queryCondition: QueryCondition = new QueryCondition();
  // 报废年限默认等于
  public scrapTimeSelectValue = OperatorEnum.eq;
  //  过滤下拉选-- label
  public filterSelectEnum = FilterSelectEnum;
  // 过滤操作类型--value
  public filterOperateEnum = OperatorEnum;
  // 设备设置弹框是否显示
  public equipmentSettingShow = false;
  // 设备设置表单
  public formColumn: FormItem[] = [];
  // 表单状态
  public formStatus: FormOperate;
  // 设备配置弹框是否显示
  public equipmentDeployShow = false;
  // 设备配置表单
  public deployFormColumn: FormItem[] = [];
  // 设施过滤选择器
  public facilityVisible = false;
  // 过滤数据所选的设施
  public deviceInfo: FacilityListModel[] = [];
  // 过滤框显示设施名
  public filterDeviceName: string = '';

  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $router: Router,
    private $message: FiLinkModalService,
    private $facilityUtilService: FacilityUtilService,
    private $equipmentAipService: EquipmentApiService
  ) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    // 查询设备统计数据
    this.queryEquipmentCount();
    // 初始化表格参数
    this.initTableConfig();
    // 查询列表数据
    this.refreshData();
    // 初始化表单
    this.initEquipmentForm();
  }

  /**
   * 将实例化模版进行销毁
   */
  public ngOnDestroy(): void {
    this.equipmentTypeTemp = null;
    this.scrapTimeTemp = null;
    this.deviceNameTemplate = null;
    this.equipmentStatusFilterTemp = null;
    this.tableRef = null;
    this.deviceFilterTemplate = null;
  }

  /**
   * 滑块显示和隐藏
   */
  public slideShowChange(event: boolean): void {
    this.tableConfig.outHeight = event ? showSliderHighConst : hiddenSliderHighConst;
    this.tableRef.calcTableHeight();
  }


  /**
   * 切换滑块的类型
   */
  public onSliderChange(event): void {
    if (event.code !== null) {
      // 先清空表格里面的查询条件
      this.tableRef.searchDate = {};
      this.tableRef.rangDateValue = {};
      this.tableRef.tableService.resetFilterConditions(this.tableRef.queryTerm);
      this.tableRef.handleSetControlData('equipmentType', [event.code]);
      this.tableRef.handleSearch();
    } else {
      this.tableRef.handleSetControlData('equipmentType', []);
      this.tableRef.handleSearch();
    }
  }

  /**
   * 设置自动删除表单操作
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
  }

  /**
   * 关闭设备设置弹框
   */
  public onCloseSetting(): void {
    this.equipmentSettingShow = false;
  }

  /**
   * 确定设置设备自动删除时间
   */
  public onOkSetting(): void {
    this.equipmentSettingShow = false;
  }

  /**
   * 关闭设备弹框
   */
  public onCloseDeploy(): void {
    this.equipmentDeployShow = false;
  }

  /**
   * 确定配置设备
   */
  public onOkDeploy(): void {
    this.equipmentDeployShow = false;
  }

  /**
   * 切换分页
   */
  public pageChange(event: PageBean): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 点击输入框弹出设施选择
   */
  public onShowFacility(): void {
    this.facilityVisible = true;
  }

  /**
   * 显示设施弹框
   */
  public onFacilityChange(event: FacilityListModel[]): void {
    if (!_.isEmpty(event)) {
      this.deviceInfo = event;
      this.filterDeviceName = this.deviceInfo.map(item => {
        return item.deviceName;
      }).join(',');
    }
  }

  /**
   * 路由跳转
   */
  private routingJump(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

  /**
   * 查询各种类型设备总量
   */
  private queryEquipmentCount(): void {
    // 调用统计接口
    this.$equipmentAipService.equipmentCount().subscribe(
      (result: ResultModel<EquipmentStatisticsModel[]>) => {
        // 获取所有的设备类型
        const equipmentTypeList: SliderConfig[] = this.$facilityUtilService.getEquipmentType(this.$nzI18n);
        const equipmentTypeData: EquipmentStatisticsModel[] = result.data || [];
        equipmentTypeList.forEach(item => {
          const type = equipmentTypeData.find(row => item.code === row.equipmentType);
          item.sum = type ? type.equipmentNum : 0;
          item.textClass = CommonUtil.getEquipmentTextColor(item.code);
          item.iconClass = CommonUtil.getEquipmentIconClassName(item.code);
        });
        // 计算设备总数量
        const sum = _.sumBy(equipmentTypeList, 'sum') || 0;
        equipmentTypeList.unshift({
          // 设备总数
          label: this.language.equipmentTotal,
          iconClass: CommonUtil.getEquipmentIconClassName(null),
          textClass: CommonUtil.getEquipmentTextColor(null),
          code: null, sum: sum
        });
        this.sliderConfig = equipmentTypeList;
      });
  }

  /**
   *  刷新列表数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$equipmentAipService.equipmentListByPage(this.queryCondition)
      .subscribe((result: ResultModel<EquipmentListModel[]>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
          this.dataSet = result.data || [];
          // 处理各种状态的显示情况
          this.dataSet.forEach(item => {
            const statusArr: string[] = [EquipmentStatusEnum.unSet, EquipmentStatusEnum.dismantled];
            item.deleteButtonShow = statusArr.includes(item.equipmentStatus);
            // 设备类型国际化转换
            item.equipmentTypeName = this.$facilityUtilService.getEquipmentType(this.$nzI18n, item.equipmentType);
            // 设备状态国际化转换
            item.equipmentStatusName = item.equipmentStatus ?
              this.$facilityUtilService.getEquipmentStatus(this.$nzI18n, item.equipmentStatus) : '';
            // 设置状态样式
            const iconStyle = FacilityUtilService.getFacilityDeviceStatusClassName(item.equipmentStatus);
            item.equipmentStatusIconClass = iconStyle.iconClass;
            item.equipmentStatusColorClass = iconStyle.colorClass;
            // 设置设备类型的图标
            item.iconClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
            item.areaName = item.areaInfo ? item.areaInfo.areaName : '';
            item.deviceName = item.deviceInfo ? item.deviceInfo.deviceName : '';
            // 计算安装时间和当前时间是否超过报废年限
            if (item.installationDate && item.scrapTime) {
              const now = new Date().getTime();
              const tempDate = new Date(Number(item.installationDate));
              tempDate.setFullYear(tempDate.getFullYear() + Number(item.scrapTime));
              item.rowStyle = now > tempDate.getTime() ? {color: 'red'} : {};
            }
          });
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

  /**
   * 初始化表格参数
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      primaryKey: '03-5',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      showSearchExport: true,
      columnConfig: [
        { // 选择
          type: 'select',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62
        },
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 资产编码
          title: this.language.deviceCode,
          key: 'equipmentCode',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
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
            type: 'select', selectType: 'multiple',
            selectInfo: this.$facilityUtilService.getEquipmentType(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        { // 状态
          title: this.language.status,
          key: 'equipmentStatus',
          width: 200,
          type: 'render',
          renderTemplate: this.equipmentStatusFilterTemp,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: this.$facilityUtilService.getEquipmentStatus(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        { //  型号
          title: this.language.model,
          key: 'equipmentModel',
          width: 124,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 供应商
          title: this.language.supplierName,
          key: 'supplier',
          width: 125,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 报废时间
          title: this.language.scrapTime,
          key: 'scrapTime',
          width: 140,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.scrapTimeTemp,
          }
        },
        { // 所属设施
          title: this.language.affiliatedDevice,
          key: 'deviceId',
          width: 150,
          type: 'render',
          renderTemplate: this.deviceNameTemplate,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.deviceFilterTemplate
          },
        },
        { // 挂载位置
          title: this.language.mountPosition,
          key: 'mountPosition',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 安装时间
          title: this.language.installationDate,
          width: 280,
          configurable: true,
          isShowSort: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'},
          key: 'installationDate'
        },
        { // 所属公司
          title: this.language.company, key: 'company',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        { // 业务状态
          title: this.language.businessStatus, key: 'businessStatus',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        { // 区域名称
          title: this.language.areaName, key: 'areaName',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'},
        },
        { // 所属网关
          title: this.language.gatewayName, key: 'gatewayName',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        { // 备注
          title: this.language.remark, key: 'remark',
          configurable: true,
          width: 200,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '',
          width: 150,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          text: `+  ${this.language.add}`,
          permissionCode: '03-1-2',
          handle: () => {
            this.routingJump('business/facility/equipment-detail/add', {});
          }
        },
        {
          text: this.commonLanguage.deleteBtn,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '03-1-4',
          needConfirm: true,
          canDisabled: false,
          confirmContent: this.language.confirmDeleteData,
          handle: (data: EquipmentListModel[]) => {
            this.handelDeleteEquipment(data);
          }
        }
      ],
      operation: [
        { // 编辑
          permissionCode: '03-1-3',
          text: this.commonLanguage.edit, className: 'fiLink-edit',
          handle: (data: EquipmentListModel) => {
            this.routingJump('business/facility/equipment-detail/update',
              {queryParams: {equipmentId: data.equipmentId}});
          },
        },
        { //  定位
          permissionCode: '03-1-5',
          text: this.language.location, className: 'fiLink-location',
          handle: (data: EquipmentListModel) => {
            this.routingJump('business/index', {queryParams: {id: data.equipmentId}});
          },
        },
        { // 设备配置
          permissionCode: '03-1-5',
          text: this.language.deviceConfiguration,
          className: 'fiLink-business-info',
          handle: (data: EquipmentListModel) => {
            // 设备类型为网关时 跳转网关配置界面
            if (data.equipmentType === EquipmentTypeEnum.gateway) {
              this.routingJump('business/facility/gateway-config',
                {
                  queryParams: {
                    id: data.equipmentId,
                    name: data.equipmentName,
                    model: data.equipmentModel
                  }
                });
            } else {
              // 设备配置弹框开启
              this.equipmentDeployShow = true;
            }
          },
        },
        { // 设备详情
          permissionCode: '03-1-5',
          text: this.language.equipmentDetail, className: 'fiLink-view-detail',
          handle: (data: EquipmentListModel) => {
            this.routingJump('business/facility/equipment-view-detail',
              {
                queryParams: {
                  equipmentId: data.equipmentId,
                  equipmentType: data.equipmentTyp,
                  equipmentModel: data.equipmentModel
                }
              });
          },
        },
        { // 删除
          permissionCode: '03-1-5',
          text: this.commonLanguage.deleteBtn, className: 'fiLink-delete red-icon',
          key: 'deleteButtonShow',
          needConfirm: true,
          handle: (data: EquipmentListModel) => {
            this.handelDeleteEquipment([data]);
          }
        },
      ],
      leftBottomButtons: [],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 过滤查询数据
      handleSearch: (event: FilterCondition[]) => {
        // 对报废时间做特殊处理
        const index = event.findIndex(item => item.filterField === 'scrapTime');
        if (index >= 0) {
          event[index].operator = this.scrapTimeSelectValue;
        }
        // 使用设施选择器的设施之后对设施ID过滤进行处理
        if (!_.isEmpty(this.deviceInfo)) {
          const filterValue = this.deviceInfo.map(item => {
            return item.deviceId;
          });
          const temp = [{
            filterField: 'deviceId',
            operator: 'in',
            filterValue: filterValue
          }];
          event = event.concat(temp);
        }
        this.queryCondition.filterConditions = event;
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      },
      //  导出数据
      handleExport: (event) => {
        this.handelExportEquipment(event);
      },
    };
  }

  /**
   * 删除设备数据
   */
  private handelDeleteEquipment(data: EquipmentListModel[]): void {
    const statusArr: string[] = [EquipmentStatusEnum.unSet, EquipmentStatusEnum.dismantled];
    const tempArr = data.filter(item => !statusArr.includes(item.equipmentStatus));
    if (!_.isEmpty(tempArr)) {
      this.$message.warning(this.language.dataCanBeDelete);
      return;
    }
    // 提取所选数据的设备id
    const ids = data.map(v => {
      return v.equipmentId;
    });
    this.$equipmentAipService.deleteEquipmentByIds(ids).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(result.msg);
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryEquipmentCount();
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 初始化设备自动删除表单
   */
  private initEquipmentForm(): void {
    // 初始化设备设置表单
    this.formColumn = [
      {
        label: this.language.setAutoDeleteTime,
        key: 'deleteTime',
        type: 'radio',
        require: true,
        width: 1000,
        col: 24,
        rule: [{required: true}],
        initialValue: 1,
        radioInfo: {
          data: [
            {label: this.language.oneWeek, value: 1},
            {label: this.language.oneMonth, value: 2},
            {label: this.language.threeMonth, value: 3},
            {label: this.language.halfYear, value: 4},
          ],
          label: 'label',
          value: 'value'
        },
      },
    ];
    // 初始化设备配置表单
    this.deployFormColumn = [
      {
        label: this.language.ipAddress,
        key: 'ipAddress',
        type: 'input',
        width: 300,
        col: 24,
        rule: [{required: true}]
      },
      {
        label: this.language.portNo,
        key: 'portNo',
        type: 'input',
        width: 300,
        col: 24,
        rule: [{required: true}]
      },
      {
        label: this.language.protocolType,
        key: 'protocolType',
        type: 'select',
        col: 24,
        width: 300,
        rule: [{required: true}],
        selectInfo: {
          data: [
            {label: 'HTTP', value: 'HTTP'},
            {label: 'TCP', value: 'TCP'},
            {label: 'Websocket', value: 'Websocket'},
          ],
          label: 'label',
          value: 'value'
        }
      },
    ];
  }

  /**
   * 导出数据 todo 后台接口未好
   */
  private handelExportEquipment(event): void {
    // 处理参数
    const exportBody = {
      queryCondition: new QueryCondition(),
      columnInfoList: event.columnInfoList,
      excelType: event.excelType
    };
    exportBody.columnInfoList.forEach(item => {
      if (item.propertyName === 'equipmentType'
        || item.propertyName === 'equipmentStatus') {
        // 后台处理字段标示
        item.isTranslation = isTranslationConst;
      }
    });
    // 处理选择的项目
    if (event && !_.isEmpty(event.selectItem)) {
      const ids = event.selectItem.map(item => item.deviceId);
      const filter = new FilterCondition('deviceId');
      filter.filterValue = ids;
      filter.operator = OperatorEnum.in;
      exportBody.queryCondition.filterConditions.push(filter);
    } else {
      // 处理查询条件
      exportBody.queryCondition.filterConditions = event.queryTerm;
    }
    // 调用后台接口
    this.$equipmentAipService.exportEquipmentData(exportBody).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}
