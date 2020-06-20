import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {Result} from '../../../../shared-module/entity/result';
import {FacilityService} from '../../../../core-module/api-service/facility/facility-manage';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {LockService} from '../../../../core-module/api-service/lock';
import {FilterCondition, QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {FACILITY_TYPE_ICON_CLASS, FACILITY_TYPE_NAME} from '../../../../shared-module/const/facility';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {FacilityListModel} from '../../share/model/facility-list.model';
import {FacilityUtilService} from '../../share/service/facility-util.service';
import {SliderConfig} from '../../share/model/slider-config';
import {DeployStatus, DeviceTypeCode, getDeployStatus, getDeviceStatus, getDeviceType, wellCover} from '../../share/const/facility.config';


/**
 * 设施列表组件
 */
@Component({
  selector: 'app-facility-list',
  templateUrl: './facility-list.component.html',
  styleUrls: ['./facility-list.component.scss']
})
export class FacilityListComponent implements OnInit, OnDestroy {
  // 列表数据
  public dataSet = [];
  // 列表分页实体
  public pageBean: PageBean = new PageBean();
  // 远程开锁列表分页实体
  public lockPageBean: PageBean = new PageBean();
  // 列表配置
  public tableConfig: TableConfig;
  // 远程开锁列表配置
  public lockInfoConfig: TableConfig;
  // 远程开锁列表数据
  public lockInfo = [];
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 首页语言包
  public indexLanguage: IndexLanguageInterface;
  // 列表查询条件
  public queryCondition: QueryCondition = new QueryCondition();
  // 滑块配置
  public sliderConfig: Array<SliderConfig> = [];
  // 设施状态
  @ViewChild('deviceStatusTemp') deviceStatusTemp: TemplateRef<void>;
  // 开锁模板
  @ViewChild('openLockTemp') openLockTemp: TemplateRef<{}>;
  // 设施类型模板
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<void>;
  // 列表实例
  @ViewChild('tableComponent') tableComponent: TableComponent;


  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $modal: NzModalService,
              private $lockService: LockService,
              private $facilityService: FacilityService,
              private $router: Router) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.indexLanguage = this.$nzI18n.getLocaleData('index');
    this.initTableConfig();
    this.refreshData();
    this.queryDeviceTypeCount();
  }

  public ngOnDestroy(): void {
    this.deviceStatusTemp = null;
    this.openLockTemp = null;
    this.deviceTypeTemp = null;
    this.tableComponent = null;
  }

  /**
   * 分页查询
   * @param event PageBean
   */
  public pageChange(event: PageBean): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 获取电子锁信息
   */
  public getLockInfo(deviceId: string, deviceType: string): Promise<[]> {
    return new Promise((resolve, reject) => {
      this.lockInfoConfig.isLoading = true;
      this.$lockService.getLockInfo(deviceId).subscribe((result: ResultModel<any>) => {
        this.lockInfoConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.lockInfo = result.data || [];
          // 当为外盖的都过滤掉
          if (deviceType === DeviceTypeCode.well) {
            this.lockInfo = this.lockInfo.filter(item => item.doorNum !== wellCover.outCover);
          }
          resolve();
        }
      });
    });
  }

  /**
   * 开锁
   * @param body ({deviceId: string, doorNumList: string})
   */
  public openLock(body: { deviceId: string, doorNumList: string[] }): void {
    this.$lockService.openLock(body).subscribe((result: ResultModel<void>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 选中卡片查询相应的类型
   * param event
   */
  public sliderChange(event: SliderConfig): void {
    if (event.code) {
      // 先清空表格里面的查询条件
      this.tableComponent.searchDate = {};
      this.tableComponent.rangDateValue = {};
      this.tableComponent.tableService.resetFilterConditions(this.tableComponent.queryTerm);
      this.tableComponent.handleSetControlData('deviceType', [event.code]);
      this.tableComponent.handleSearch();
    } else {
      this.tableComponent.handleRest();
    }
  }

  /**
   * 滑块变化
   * param event
   */
  public slideShowChange(event: SliderConfig): void {
    if (event) {
      this.tableConfig.outHeight = 108;
    } else {
      this.tableConfig.outHeight = 10;
    }
    this.tableComponent.calcTableHeight();
  }

  /**
   * 判断设施有没有电子锁 是否可以配置或者改变部署状态
   * param deviceType
   * returns {boolean} 不能改变部署状态返回true
   */
  public checkCanNotChangeStatus(selectData): boolean {
    let deviceType, isSame = true, allHasControl = true;
    // 循环判断是否有重复的
    selectData.forEach(item => {
      if (!deviceType) {
        deviceType = item._deviceType;
      } else {
        if (deviceType !== item._deviceType) {
          isSame = false;
        }
      }
      if (item._deviceType === DeviceTypeCode.distributionFrame ||
        item._deviceType === DeviceTypeCode.junctionBox) {
        allHasControl = false;
      }
    });
    // 所选设施类型是不相同
    if (!isSame) {
      this.$message.error(this.language.errMsg);
      return true;
    }
    // 所选设施有一个没有主控
    if (!allHasControl) {
      this.$message.error(this.language.noControlMsg);
      return true;
    }
  }

  public facilityTypeList(): Array<{ value: string, label: string, iconClass: string, checked: boolean }> {
    return Object.keys(FACILITY_TYPE_NAME).map(key => {
      return {
        value: key,
        label: this.indexLanguage[FACILITY_TYPE_NAME[key]],
        iconClass: FACILITY_TYPE_ICON_CLASS[key],
        checked: true,
      };
    });
  }

  /**
   * 跳转到新增设施页面
   */
  private addFacility(): void {
    this.navigateToDetail(`business/facility/facility-detail/add`);
  }

  /**
   * 跳转到详情
   * param url
   */
  private navigateToDetail(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

  /**
   * 刷新表格数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$facilityService.deviceListByPage(this.queryCondition).subscribe((result: ResultModel<FacilityListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.dataSet = result.data || [];
        this.dataSet.forEach(item => {
          item.areaName = item.areaInfo ? item.areaInfo.areaName : '';
          item._deviceType = item.deviceType;
          item.deviceType = getDeviceType(this.$nzI18n, item.deviceType);
          item._deviceStatus = item.deviceStatus;
          item.deviceStatus = getDeviceStatus(this.$nzI18n, item.deviceStatus);
          item.deployStatus = getDeployStatus(this.$nzI18n, item.deployStatus);
          item.iconClass = CommonUtil.getFacilityIconClassName(item._deviceType);
          item.deviceStatusIconClass = FacilityUtilService.getFacilityDeviceStatusClassName(item._deviceStatus).iconClass;
          item.deviceStatusColorClass = FacilityUtilService.getFacilityDeviceStatusClassName(item._deviceStatus).colorClass;
          // 光交箱 配线架 接头盒显示配置业务信息按钮
          if (item._deviceType === DeviceTypeCode.opticalBox
            || item._deviceType === DeviceTypeCode.distributionFrame
            || item._deviceType === DeviceTypeCode.junctionBox
          ) {
            item.infoButtonShow = true;
          }
          // 光交箱 人井 室外柜显示控制按钮
          if (item._deviceType === DeviceTypeCode.well ||
            item._deviceType === DeviceTypeCode.opticalBox ||
            item._deviceType === DeviceTypeCode.outdoorCabinet
          ) {
            item.controlButtonShow = true;
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
   * 更新设施状态
   * param {string} deviceStatus
   * param {Array<FacilityListModel>} devices
   */
  private updateDeviceStatus(deviceStatus: string, devices: Array<FacilityListModel>): void {
    const arr = devices.map(item => item.deviceId);
    const body = {deviceIds: arr, deployStatus: deviceStatus};
    this.tableConfig.isLoading = true;
    this.$lockService.updateDeviceStatus(body).subscribe((result: ResultModel<void>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(result.msg);
        this.refreshData();
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 查询设施类型总数
   */
  private queryDeviceTypeCount(): void {
    this.$facilityService.queryDeviceTypeCount().subscribe((result: ResultModel<any>) => {
      const deviceTypes: Array<SliderConfig> = getDeviceType(this.$nzI18n);
      const data: Array<{ deviceNum: number, deviceType: string }> = result.data || [];
      deviceTypes.forEach(deviceType => {
        const type = data.find(item => item.deviceType === deviceType.code);
        if (type) {
          deviceType.sum = type.deviceNum;
        } else {
          deviceType.sum = 0;
        }
        deviceType.textClass = CommonUtil.getFacilityTextColor(deviceType.code);
        deviceType.iconClass = CommonUtil.getFacilityIconClassName(deviceType.code);
      });
      let sum = 0;
      data.forEach(item => {
        sum += item.deviceNum;
      });
      deviceTypes.unshift({
        // 设施总数
        label: this.language.totalFacilities,
        iconClass: CommonUtil.getFacilityIconClassName(null),
        textClass: CommonUtil.getFacilityTextColor(null),
        code: null, sum: sum
      });
      this.sliderConfig = deviceTypes;
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      primaryKey: '03-1',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      showSearchExport: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 资产编号
          title: this.language.deviceCode, key: 'deviceCode', width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 名称
          title: this.language.deviceName, key: 'deviceName', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        { // 类型
          title: this.language.deviceType, key: 'deviceType', width: 150,
          configurable: true,
          type: 'render',
          renderTemplate: this.deviceTypeTemp,
          minWidth: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: getDeviceType(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        { // 状态
          title: this.language.deviceStatus, key: 'deviceStatus', width: 120,
          type: 'render',
          renderTemplate: this.deviceStatusTemp,
          configurable: true,
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
        },
        { // 型号
          title: '型号',
          key: 'deviceModel',
          width: 120,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 供应商
          title: '供应商',
          key: 'supplier', width: 120,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 报废年限
          title: '报废年限',
          key: 'scrapTime', width: 120,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 权属公司
          title: '权属公司',
          key: 'company', width: 120,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 安装日期
          title: '安装日期',
          key: 'installationDate', width: 120,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 所属区域
          title: this.language.parentId, key: 'areaName', width: 100,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        { // 省
          title: this.language.provinceName, key: 'provinceName', width: 100,
          configurable: true,
          isShowSort: true,
          searchable: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        { // 市
          title: this.language.cityName, key: 'cityName', width: 100, configurable: true,
          isShowSort: true,
          searchable: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        { // 区域
          title: this.language.districtName, key: 'districtName', width: 100, configurable: true,
          isShowSort: true,
          searchable: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {  // 详细地址
          title: this.language.address, key: 'address', width: 150, configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 是否确认布防
          title: this.language.deployStatus, key: 'deployStatus', configurable: true, width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: getDeployStatus(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        { // 备注
          title: this.language.remarks, key: 'remarks', configurable: true,
          searchable: true,
          isShowSort: true,
          hidden: true,
          width: 150,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 210, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          text: '+  ' + this.language.addArea,
          permissionCode: '03-1-2',
          handle: () => {
            this.addFacility();
          }
        },
        {
          text: this.language.deleteHandle,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '03-1-4',
          needConfirm: true,
          canDisabled: true,
          confirmContent: this.language.deleteFacilityMsg,
          handle: (data: Array<FacilityListModel>) => {
            this.deleteHandle(data);
          }
        },
      ],
      operation: [
        {
          text: this.language.viewDetail, className: 'fiLink-view-detail', handle: (currentIndex) => {
            this.navigateToDetail('business/facility/facility-detail-view',
              {
                queryParams: {
                  id: currentIndex.deviceId, deviceType: currentIndex._deviceType,
                  serialNum: currentIndex.serialNum
                }
              });
          },
          permissionCode: '03-1-5',
        },
        {
          text: this.language.location, className: 'fiLink-location',
          permissionCode: '03-1-13',
          handle: (currentIndex: FacilityListModel) => {
            this.navigateToDetail('business/index', {queryParams: {id: currentIndex.deviceId}});
          }
        },
        {
          text: this.language.update,
          permissionCode: '03-1-3',
          className: 'fiLink-edit',
          handle: (currentIndex: FacilityListModel) => {
            this.navigateToDetail('business/facility/facility-detail/update',
              {queryParams: {id: currentIndex.deviceId}});
          }
        },
        {
          // 控制按钮
          text: this.language.control, className: 'fiLink-control',
          permissionCode: '03-1-11',
          key: 'controlButtonShow',
          handle: (currentIndex: FacilityListModel) => {
            this.controlHandle(currentIndex);
          }
        },
        {
          text: this.language.setBusinessInfo,
          className: 'fiLink-business-info',
          permissionCode: '03-1-7',
          key: 'infoButtonShow',
          handle: (currentIndex: FacilityListModel) => {
            if (currentIndex._deviceType === DeviceTypeCode.opticalBox
              || currentIndex._deviceType === DeviceTypeCode.distributionFrame
              || currentIndex._deviceType === DeviceTypeCode.junctionBox
            ) {
              this.navigateToDetail('business/facility/business-information',
                {
                  queryParams: {
                    id: currentIndex.deviceId,
                    deviceType: currentIndex._deviceType,
                    deviceName: currentIndex.deviceName
                  }
                });
            } else {
            }

          }
        },
        {
          text: this.language.deleteHandle,
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          permissionCode: '03-1-4',
          confirmContent: this.language.deleteFacilityMsg,
          handle: (currentIndex: FacilityListModel) => {
            this.tableConfig.isLoading = true;
            this.$facilityService.deleteDeviceDyIds([currentIndex.deviceId]).subscribe((result: Result) => {
              if (result.code === 0) {
                this.$message.success(result.msg);
                // 删除跳第一页
                this.queryCondition.pageCondition.pageNum = 1;
                this.queryDeviceTypeCount();
                this.refreshData();
              } else {
                this.tableConfig.isLoading = false;
                this.$message.error(result.msg);
              }
            }, () => {
              this.tableConfig.isLoading = false;
            });
          }
        },
      ],
      leftBottomButtons: [
        // 二期使用 布防 撤防  停用 维护 拆除
        {
          text: this.language.deployed, handle: (event) => {
            if (this.checkCanNotChangeStatus(event)) {
              return;
            }
            this.updateDeviceStatus(DeployStatus.DEPLOYED, event);
          },
          needConfirm: true,
          permissionCode: '03-1-14',
          canDisabled: true,
          confirmContent: this.language.editDeployStatusMsg,
          className: 'small-button'
        },
        {
          canDisabled: true,
          className: 'small-button',
          needConfirm: true,
          confirmContent: this.language.editNoDefenceStatusMsg,
          permissionCode: '03-1-15',
          text: this.language.noDefence, handle: (event) => {
            if (this.checkCanNotChangeStatus(event)) {
              return;
            }
            this.updateDeviceStatus(DeployStatus.NODEFENCE, event);
          }
        },
        {
          canDisabled: true,
          needConfirm: true,
          confirmContent: this.language.editNotUsedStatusMsg,
          className: 'small-button',
          permissionCode: '03-1-16',
          text: this.language.config.NOTUSED, handle: (event) => {
            if (this.checkCanNotChangeStatus(event)) {
              return;
            }
            this.updateDeviceStatus(DeployStatus.NOTUSED, event);

          }
        },
        {
          canDisabled: true,
          needConfirm: true,
          confirmContent: this.language.editMaintenanceStatusMsg,
          className: 'small-button',
          permissionCode: '03-1-17',
          text: this.language.config.MAIINTENANCE, handle: (event) => {
            if (this.checkCanNotChangeStatus(event)) {
              return;
            }
            this.updateDeviceStatus(DeployStatus.MAIINTENANCE, event);

          }
        },
        {
          canDisabled: true,
          needConfirm: true,
          className: 'small-button',
          // tslint:disable-next-line
          confirmContent: this.language.dismantleMsg,
          permissionCode: '03-1-18',
          text: this.language.config.DISMANTLE, handle: (event) => {
            const ids = event.map(item => item.deviceId);
            this.$facilityService.deleteDeviceDyIds(ids).subscribe((result: Result) => {
              if (result.code === 0) {
                this.$message.success(result.msg);
                // 删除跳第一页
                this.queryCondition.pageCondition.pageNum = 1;
                this.queryDeviceTypeCount();
                this.refreshData();
              } else {
                this.$message.error(result.msg);
              }
            });
          }
        },
        {
          text: this.language.configuration,
          canDisabled: true,
          permissionCode: '03-1-6',
          className: 'small-button',
          handle: (selectData) => {
            if (selectData.length > 0) {
              if (this.checkCanNotChangeStatus(selectData)) {
                return;
              }
              // 跳转到 配置设施策略页面
              sessionStorage.setItem('facility_config_info', JSON.stringify(selectData));
              this.navigateToDetail('business/facility/facility-config', {queryParams: {deviceType: selectData[0]._deviceType}});
            } else {
              this.$message.error(this.language.errorMsg);
            }
          }
        }

      ],
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
        // 处理参数
        const body = {
          queryCondition: new QueryCondition(),
          columnInfoList: event.columnInfoList,
          excelType: event.excelType
        };
        body.columnInfoList.forEach(item => {
          if (item.propertyName === 'deviceType'
            || item.propertyName === 'deviceStatus' || item.propertyName === 'deployStatus') {
            item.isTranslation = 1;
          }
        });
        // 处理选择的项目
        if (event.selectItem.length > 0) {
          const ids = event.selectItem.map(item => item.deviceId);
          const filter = new FilterCondition('deviceId');
          filter.filterValue = ids;
          filter.operator = 'in';
          body.queryCondition.filterConditions.push(filter);
        } else {
          // 处理查询条件
          body.queryCondition.filterConditions = event.queryTerm;
        }
        this.$facilityService.exportDeviceList(body).subscribe((res: Result) => {
          if (res.code === 0) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    };
    this.lockInfoConfig = {
      noIndex: true,
      columnConfig: [
        {type: 'select', width: 62},
        {type: 'serial-number', width: 62, title: this.language.serialNumber},
        {title: this.language.doorNum, key: 'doorNum', width: 100},
        {title: this.language.doorName, key: 'doorName', width: 100},
      ]
    };
  }

  /**
   * 删除操作
   * @param data (Array<FacilityListModel>)
   */
  private deleteHandle(data: Array<FacilityListModel>): void {
    const ids: Array<string> = data.map(item => item.deviceId);
    this.tableConfig.isLoading = true;
    this.$facilityService.deleteDeviceDyIds(ids).subscribe((result: ResultModel<void>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(result.msg);
        // 删除跳第一页
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
        this.queryDeviceTypeCount();
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 控制操作
   */
  private controlHandle(currentIndex: FacilityListModel): void {
    if (currentIndex._deviceType === DeviceTypeCode.well ||
      currentIndex._deviceType === DeviceTypeCode.opticalBox ||
      currentIndex._deviceType === DeviceTypeCode.outdoorCabinet
    ) {
      this.lockInfo = [];
      this.getLockInfo(currentIndex.deviceId, currentIndex._deviceType).then(() => {
        const modal = this.$modal.create({
          nzTitle: this.language.control,
          nzContent: this.openLockTemp,
          nzOkText: this.language.handleCancel,
          nzCancelText: this.language.handleOk,
          nzOkType: 'danger',
          nzClassName: 'custom-create-modal',
          nzMaskClosable: false,
          nzFooter: [
            {
              // 远程开锁按钮
              label: this.language.remoteUnlock,
              disabled: () => {
                // 远程开锁权限id
                const appAccessPermission = '03-1-11';
                return !SessionUtil.checkHasRole(appAccessPermission);
              },
              onClick: () => {
                const slotNum = [];
                this.lockInfo.forEach(item => {
                  if (item.checked) {
                    slotNum.push(item.doorNum);
                  }
                });
                if (slotNum.length === 0) {
                  this.$message.error(this.language.chooseDoorLock);
                  return;
                }
                const body = {deviceId: currentIndex.deviceId, doorNumList: slotNum};
                this.openLock(body);
                modal.destroy();
              }
            },
            {
              // 授权按钮
              label: this.language.authorization,
              type: 'danger',
              disabled: () => {
                // 授权操作权限id
                const appAccessPermission = '01-5-1-2';
                return !SessionUtil.checkHasRole(appAccessPermission);
              },
              onClick: () => {
                const slotNum = [];
                this.lockInfo.forEach(item => {
                  if (item.checked) {
                    slotNum.push(item.doorNum);
                  }
                });
                if (slotNum.length === 0) {
                  this.$message.error(this.language.chooseDoorLock);
                  return;
                }
                // 跳转到设施授权传入设施id和门号
                this.$router.navigate(['/business/user/unified-details/add'],
                  {queryParams: {id: currentIndex.deviceId, slotNum: slotNum.join(',')}}).then(() => {
                  modal.destroy();
                });
              }
            },
            {
              label: this.language.handleCancel,
              type: 'danger',
              onClick: () => {
                modal.destroy();
              }
            },
          ]
        });
      }, () => {
      }).catch();
    } else {
      this.$message.error(this.language.noSupport);
    }
  }
}
