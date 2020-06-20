import {Component, OnInit, ViewChild, OnDestroy, ɵLContext} from '@angular/core';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {NzI18nService, NzModalService, NzTreeNode} from 'ng-zorro-antd';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {FormControl} from '@angular/forms';
import {Result} from '../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {FacilityUtilService} from '../../../facility';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {InspectionService} from '../../../../core-module/api-service/work-order/inspection';
import {AreaService} from '../../../../core-module/api-service/facility/area-manage';
import {MapSelectorConfig} from '../../../../shared-module/entity/mapSelectorConfig';
import {UserService} from '../../../../core-module/api-service/user/user-manage';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {MapSelectorInspectionComponent} from '../../../../shared-module/component/map-selector/map-selector-inspection/map-selector-inspection.component';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {differenceInCalendarDays} from 'date-fns';
import {ClearBarrierService} from '../../../../core-module/api-service/work-order/clear-barrier';
import {MapService} from '../../../../core-module/api-service/index/map';
import {
  WORK_ORDER_UNFINISHED_INSPECTION_NUMBER,
  WORK_ORDER_DEVICE_TYPE,
} from '../../../../shared-module/const/work-order';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {IsSelectAll, ResultCode} from '../../work-order.config';
// import {MapEquipmentSelectorInspectionComponent} from '../map-selector/map-equipment-selector-inspection/map-equipment-selector-inspection.component';

/**
 * 未完工巡检工单新增修改页面
 */
@Component({
  selector: 'app-inspection-work-order-detail',
  templateUrl: './inspection-work-order-detail.component.html',
  styleUrls: ['./inspection-work-order-detail.component.scss']
})
export class InspectionWorkOrderDetailComponent implements OnInit, OnDestroy {
  // 巡检开始时间模板
  @ViewChild('inspectionStartDate') public inspectionStartDate;
  // 巡检结束时间模板
  @ViewChild('inspectionEndDate') public inspectionEndDate;
  // 区域选择模板
  @ViewChild('areaSelector') public areaSelector;
  // 单位选择模板
  @ViewChild('departmentSelector') public departmentSelector;
  // 巡检设施
  @ViewChild('inspectionFacilitiesSelector') public inspectionFacilitiesSelector;
  @ViewChild('mapSelectorInspection') public mapSelectorInspection: MapSelectorInspectionComponent;
  // 巡检模板
  @ViewChild('inspectionTemplate') public inspectionTemplate;
  // 选择巡检模板
  @ViewChild('selectInspectionTemp') public selectInspectionTemp;
  // 巡检设备
  @ViewChild('inspectionEquipmentSelector') public inspectionEquipmentSelector;
  // @ViewChild('mapEquipmentSelectorInspection') public mapEquipmentSelectorInspection: MapEquipmentSelectorInspectionComponent;
  // 工单状态码
  public WorkOrder = WORK_ORDER_UNFINISHED_INSPECTION_NUMBER;
  // 备注是否可修改
  public remarkDisabled;
  // 修改时存放责任单位
  public updateDeptList = [];
  // 修改时存放巡检设施
  public updataDeviceList = [];
  // 获取当前日期
  public today = new Date();
  // form表单配置
  public formColumn: FormItem[] = [];
  public formStatus: FormOperate;
  // 国际化
  public InspectionLanguage: InspectionLanguageInterface;
  public facilityLanguage: FacilityLanguageInterface;
  // 单位选择器
  public areaSelectorConfig: any = new TreeSelectorConfig();
  // 树配置
  public treeSelectorConfig: TreeSelectorConfig;
  // 责任单位弹框
  public isUnitVisible: boolean = false;
  // 树
  public treeNodes = [];
  // 责任人单位title值
  public departmentSelectorName = '';
  // 巡检设施title值
  public inspectionFacilitiesSelectorName = '';
  // 责任人单位模板button属性绑定
  public departmentSelectorDisabled: boolean = false;
  // 巡检设施模板button属性绑定
  public inspectionFacilitiesSelectorDisabled = true;
  // 页面标题
  public pageTitle: string;
  // 截取URL地址
  public pageType;
  public InquireDeviceTypes = [];
  public deviceType = '';
  // 列表初始加载图标
  public isLoading = false;
  // 区域名称
  public areaName = '';
  // 区域ID
  public areaId: string = null;
  // 区域ID
  public InquireAreaId;
  // 区域id备份
  public inspectAreaId: string;
  // 区域id备份供巡检设施使用
  public inspectAreaIdDevice: string;
  // 设施Id
  public deviceId;
  // 责任单位
  public deptList = [];
  // 巡检设施
  public deviceList = [];
  // 巡检设施列表
  public mapSelectorConfig: MapSelectorConfig;
  // 巡检设备配置
  public mapEquipmentSelectorConfig: MapSelectorConfig;
  // 巡检设施弹框
  public mapVisible = false;
  public mapEquipmentVisible = false;
  // 区域选择器弹框
  public areaSelectVisible: boolean = false;
  // 工单ID
  public procId;
  // 工单状态
  public status;
  // 接收起始时间Value值
  public dateStart;
  // 接受结束时间Value值
  public dateEnd;
  // 巡检区域ID
  public inspectionAreaId;
  // 判断页面是否可修改
  public disabledIf: boolean;
  // 巡检全集是否可编辑
  public disabledSelect: boolean = true;
  // 责任单位名称集合
  public selectArr;
  // 是否巡检全集 // 1:是  0:否 // 默认状态
  public isSelectAll;
  // 巡检开始时间
  public inspectionStartTime;
  // 巡检结束时间
  public inspectionEndTime;
  // 剩余天数
  public lastDays;
  // 工单名称
  public inspectionName;
  // 存储双重过滤后的设施数据
  public facilityData;
  // 拷贝巡检设施
  public inspectDeviceName;
  // 区域信息
  public areaInfo: any = new AreaModel();
  // 单位名称
  public selectUnitName: string = '';
  private treeSetting: any;
  public areaDisabled: boolean;
  // 设施列表数据
  public deviceSet = [];
  // 区域节点数据
  private areaNodes: any = [];
  public inspectDeviceType: any;
  private changeDevice: any;
  // 模板名称
  public tempName = '';
  // 按钮显示
  public tempNameDisabled: boolean;
  // 列表数据
  public listData = [];
  // 模板数据
  public templateList = [];
  // radio值
  public radioValue = '';
  // 当前选择的模板
  public selectTemplateData: any;
  // 设备名称
  public equipmentName = '';
  // 选择设备名称
  public inspectEquipmentName;
  // 按钮隐藏
  public inspectEquipmentDisabled;
  // 全选
  public allChecked = false;
  // 参数
  public modalData: any;
  // 单位id
  public deptId;
  // 弹窗显示
  public tempSelectVisible: boolean = false;
  constructor(private $activatedRoute: ActivatedRoute,
              private $nzI18n: NzI18nService,
              private $modelService: NzModalService,
              private $facilityUtilService: FacilityUtilService,
              private $inspectionService: InspectionService,
              private $modalService: FiLinkModalService,
              private $areaService: AreaService,
              private $userService: UserService,
              private $clearBarrierService: ClearBarrierService,
              private $ruleUtil: RuleUtil,
              private $mapService: MapService,
              private $router: Router) {
  }

  ngOnInit() {
    this.InspectionLanguage = this.$nzI18n.getLocaleData('inspection');
    this.facilityLanguage = this.$nzI18n.getLocaleData('facility');
    this.judgePageJump();
    this.initTreeSelectorConfig();
    this.initMapSelectorConfig();
    this.initEquipmentMapSelectorConfig();
  }

  ngOnDestroy() {
  }

  /**
   * 初始化表单
   */
  private initColumn() {
    this.formColumn = [
      { // 工单名称
        label: this.InspectionLanguage.workOrderName,
        key: 'title',
        type: 'input',
        require: true,
        disabled: this.disabledIf,
        placeholder: this.InspectionLanguage.pleaseEnter,
        rule: [
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        asyncRules: [
          {
            asyncRule: (control: FormControl) => {
              return Observable.create(observer => {
                this.inspectionName = control.value;
                observer.next(null);
                observer.complete();
              });
            },
            asyncCode: 'duplicated', msg: this.InspectionLanguage.thisNameExistsTip
          }
        ],
      },
      {// 工单类型
        label: this.InspectionLanguage.typeOfWorkOrder,
        key: 'procResourceType',
        type: 'input',
        disabled: true,
        initialValue: this.InspectionLanguage.inspection,
        require: true,
        rule: [],
        asyncRules: [],
      },
      {// 巡检起始时间
        label: this.InspectionLanguage.inspectionStartTime,
        key: 'inspectionStartTime',
        type: 'custom',
        require: true,
        template: this.inspectionStartDate,
        disabled: this.disabledIf,
        rule: [],
        asyncRules: [{
          asyncRule: (control: any) => {
            return Observable.create(observer => {
              this.dateStart = control.value;
              if (true) {
                observer.next(null);
                observer.complete();
              } else {
                observer.next({error: true, duplicated: true});
                observer.complete();
              }
            });
          },
        }],
      },
      {// 巡检结束时间
        label: this.InspectionLanguage.inspectionEndTime,
        key: 'inspectionEndTime',
        type: 'custom',
        require: true,
        template: this.inspectionEndDate,
        disabled: this.disabledIf,
        rule: [],
        asyncRules: [{
          asyncRule: (control: any) => {
            this.dateEnd = control.value;
            return Observable.create(observer => {
              if (this.dateEnd < this.dateStart && this.dateEnd !== null) {
                this.$modalService.info(`${this.InspectionLanguage.endTimeTip}`);
              }
              if (control.value !== null && control.value > this.dateStart) {
                if (this.dateStart === null || this.dateStart > this.dateEnd) {
                  this.$modalService.info(`${this.InspectionLanguage.firstSelectEndDateTip}`);
                }
                observer.next(null);
                observer.complete();
              } else {
                observer.next({error: true, duplicated: true});
                observer.complete();
              }
              const nowDate = new Date().getTime();
              if (this.dateEnd) {
                this.lastDays = Math.ceil(((this.dateEnd - nowDate) / 86400 / 1000) - 1);
                this.formStatus.resetControlData('lastDays', this.lastDays);
              }
            });
          },
        }],
      },
      {// 剩余天数
        label: this.InspectionLanguage.daysRemaining,
        disabled: true,
        key: 'lastDays',
        type: 'input',
        initialValue: '0',
        rule: [],
      },
      {// 责任单位
        label: this.InspectionLanguage.responsibleUnit,
        key: 'deptList',
        type: 'custom',
        template: this.departmentSelector,
        require: true,
        rule: []
      },
      {// 巡检区域
        label: this.InspectionLanguage.inspectionArea,
        key: 'inspectionAreaName',
        type: 'custom',
        disabled: this.disabledIf,
        require: true,
        inputType: '',
        rule: [],
        template: this.areaSelector,
        modelChange: (controls, event, key, formOperate) => {
        }
      },
      { // 是否巡检全集
        label: this.InspectionLanguage.whetherCompleteWorks,
        key: 'isSelectAll',
        type: 'radio',
        require: true,
        disabled: this.disabledIf,
        rule: [{required: true}],
        initialValue: this.isSelectAll,
        radioInfo: {
          data: [
            {label: this.InspectionLanguage.right, value: this.WorkOrder.StrOne}, // 是
            {label: this.InspectionLanguage.deny, value: this.WorkOrder.StrZero}, // 否
          ],
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, event, key, formOperate) => {
          this.inspectionFacilitiesSelectorName = '';
          this.isSelectAll = event;
          if (this.deviceType !== null) {
            this.changeInspectionFacilities(event);
          }
        }
      },
      {// 巡检设施
        label: this.InspectionLanguage.inspectionFacility,
        key: 'deviceList',
        type: 'custom',
        disabled: this.disabledIf,
        require: true,
        template: this.inspectionFacilitiesSelector,
        rule: [{required: true}],
      },
      {// 巡检设备
        label: this.InspectionLanguage.inspectionEquipment,
        key: 'inspectionEquipment',
        require: true,
        type: 'input',
        /*type: 'custom',
        template: this.inspectionEquipmentSelector,*/
        rule: [{minLength: 0}, {maxLength: 100}],
        modelChange: (controls, event, key, formOperate) => {
          this.equipmentName = event;
        }
      },
      { // 巡检模板
          label: this.InspectionLanguage.inspectionTemplate,
          key: 'inspectionTemplate', type: 'custom',
          require: true,
          rule: [],
          template: this.inspectionTemplate,
      },
      {// 物料
        label: this.InspectionLanguage.materiel,
        key: 'materiel',
        type: 'input',
        rule: [{minLength: 0}, {maxLength: 100}]
      },
      {// 备注
        label: this.InspectionLanguage.remark,
        disabled: this.remarkDisabled,
        key: 'remark',
        type: 'input',
        rule: [{minLength: 0}, {maxLength: 255}]
      },
    ];
  }
  /**
   * 页面切换 新增/修改/重新生成
   */
  pageSwitching() {
    if (this.pageType === 'update' || this.pageType === 'updates') {
      // 显示修改列表页数据
      this.$inspectionService.getUpdateWorkUnfinished(this.procId).subscribe((result: Result) => {
        this.$facilityUtilService.setAreaNodesStatus(this.areaNodes, null, null);
        if (result.code === ResultCode.successCode) {
          result.data.procResourceType = '巡检';
          this.isSelectAll = result.data.isSelectAll;
          this.departmentSelectorName = result.data.accountabilityDeptName;
          const deviceListData = result.data.procRelatedDevices;
          const devNames = [];
          for (let i = 0; i < deviceListData.length; i++) {
            this.updataDeviceList.push({
              'deviceId': deviceListData[i].deviceId,
              'deviceName': deviceListData[i].deviceName,
              'deviceType': deviceListData[i].deviceType,
              'deviceAreaId': deviceListData[i].deviceAreaId,
              'deviceAreaName': deviceListData[i].deviceAreaName
            });
            devNames.push(deviceListData[i].deviceName);
          }
          this.deviceList = deviceListData;
          result.data.deviceList = deviceListData;
          if (result.data.procRelatedDepartments) {
            this.updateDeptList = [{'accountabilityDept': result.data.procRelatedDepartments[0].accountabilityDept}];
          }
          this.deptList = [{'accountabilityDept': result.data.accountabilityDept, 'accountabilityDeptName': result.data.accountabilityDeptName}];
          this.areaName = result.data.deviceAreaName;
          this.inspectionAreaId = deviceListData[0].deviceAreaId;
          this.inspectAreaId = deviceListData[0].deviceAreaId;
          this.inspectAreaIdDevice = deviceListData[0].deviceAreaId;
          this.deviceType = deviceListData[0].deviceType;
          result.data['inspectionStartTime'] = new Date(CommonUtil.convertTime(result.data['inspectionStartTime']));
          result.data['inspectionEndTime'] = new Date(CommonUtil.convertTime(result.data['expectedCompletedTime']));
          this.formStatus.resetData(result.data);
          if (result.data.materiel.length > 0) {
            this.formStatus.resetControlData('materiel', result.data.materiel[0].materielName);
          }
          if (result.data.procRelatedEquipment.length > 0) {
            this.formStatus.resetControlData('inspectionEquipment', result.data.procRelatedEquipment[0].equipmentName);
          }
          if (result.data.template && result.data.template.inspectionItemList.length > 0) {
            this.selectTemplateData = result.data.template;
            this.tempName = result.data.template.templateName;
          }
          // 递归设置责任单位的选择情况
          this.deptId = result.data.accountabilityDept;
          this.queryAreas(result.data.accountabilityDept).then((areaData: NzTreeNode[]) => {
            this.areaNodes = areaData;
            // if (result.data.procRelatedDepartments) {
            if (result.data.accountabilityDept) {
              this.$facilityUtilService.setTreeNodesStatus(this.areaNodes, [this.inspectAreaId]);
            }
            this.initAreaSelectorConfig(areaData);
          });
          this.inspectionFacilitiesSelectorName = devNames.toString();
          this.inspectDeviceName = devNames.toString();
        }
      });
    } else {
      this.queryAreas().then((data: NzTreeNode[]) => {
        this.areaNodes = data;
        this.initAreaSelectorConfig(data);
        // 递归设置区域的选择情况
        this.$facilityUtilService.setAreaNodesStatus(this.areaNodes, this.inspectAreaId);
      });
    }
  }

  /**
   * 页面title切换
   */
  private getPageTitle(type): string {
    let title;
    switch (type) {
      case 'add':
        title = `${this.InspectionLanguage.addArea}` + ' ' + `${this.InspectionLanguage.patrolInspectionSheet}`;
        break;
      case 'update':
        title = `${this.InspectionLanguage.edit}` + ' ' + `${this.InspectionLanguage.patrolInspectionSheet}`;
        break;
      case 'updates':
        title = `${this.InspectionLanguage.edit}` + ' ' + `${this.InspectionLanguage.patrolInspectionSheet}`;
        break;
    }
    return title;
  }

  /**
   * 接受表单传进来的参数并赋值
   * param event
   */
  formInstance(event) {
    this.formStatus = event.instance;
    // event.instance.column[1].initialValue = '巡检';
  }

  /**
   * 返回
   */
  goBack() {
    window.history.back();
  }

  /**
   * 添加/修改/重新生成操作
   */
  saveData() {
    const nowDate = new Date();
    if (new Date(this.dateEnd) < nowDate) {
      this.$modalService.info(this.InspectionLanguage.expectedCompletionTimeMustBeGreaterThanCurrentTime);
    } else {
      this.isLoading = true;
      const data = this.formStatus.group.getRawValue();
      data.deviceList = this.deviceList;
      data.deptList = this.deptList;
      data.procType = 'inspection';
      data.procResourceType = this.WorkOrder.StrOne; // 表示工单的来源类型是手动新增的
      data.expectedCompletedTime = CommonUtil.sendBackEndTime(new Date(data.inspectionEndDate));
      data.accountabilityDept = this.deptList[0].accountabilityDept;
      data.accountabilityDeptName = this.deptList[0].accountabilityDeptName;
      // 模板
      data.template = {
        templateName: this.selectTemplateData.templateName,
        templateId: this.selectTemplateData.templateId,
        inspectionItemList: []
      };
      (this.selectTemplateData.inspectionItemList || []).forEach(v => {
        if (v.checked) {
          data.template.inspectionItemList.push(v);
        }
      });
      // 设备
      data.procRelatedEquipment = [{
        equipmentId: CommonUtil.getUUid(),
        equipmentName: data.inspectionEquipment,
        deviceId: CommonUtil.getUUid(),
        equipmentType: CommonUtil.getUUid()
      }];
      // 物料
      data.materiel = [{
        materielId: CommonUtil.getUUid(),
        materielName: data.materiel,
        materielCode: CommonUtil.getUUid()
      }];
      // 设施
      data.procRelatedDevices = this.deviceList;
      if (this.pageType === 'update' || this.pageType === 'updates') {
        if (this.deviceList.length !== this.WorkOrder.ZERO) {
          data.deviceList = this.deviceList;
          data.procRelatedDevices = this.deviceList;
        } else {
          data.deviceList = this.updataDeviceList;
          data.procRelatedDevices = this.updataDeviceList;
        }
      }
      /*data.procRelatedDevices = [{
        deviceId: 'ASFS1232344545',
        deviceAreaId: 'ASFS1232344545',
        deviceAreaName: '区域1',
        deviceType: '001',
        deviceName: '设施'
      }];*/
      data.inspectionStartTime = CommonUtil.sendBackEndTime(new Date(data.inspectionStartTime).getTime());
      data.inspectionEndTime = CommonUtil.sendBackEndTime(new Date(data.inspectionEndTime).getTime());
      data.expectedCompletedTime = CommonUtil.sendBackEndTime(new Date(data.inspectionEndTime).getTime());
      data.inspectionAreaName = this.areaName;
      data.inspectionAreaId = this.inspectionAreaId;
      if (this.pageType === 'add') {
        this.$inspectionService.addWorkUnfinished(data).subscribe((result: Result) => {
          this.isLoading = false;
          if (result.code === ResultCode.successCode) {
            this.goBack();
            this.$modalService.success(result.msg);
          } else {
            this.$modalService.error(result.msg);
          }
        }, () => {
          this.isLoading = false;
        });
      } else if (this.pageType === 'update') {
        data.procId = this.procId;
        this.$inspectionService.updateWorkUnfinished(data).subscribe((result: Result) => {
          this.isLoading = false;
          if (result.code === ResultCode.successCode) {
            this.goBack();
            this.$modalService.success(result.msg);
          } else {
            this.$modalService.error(result.msg);
          }
        }, () => {
          this.isLoading = false;
        });
      } else if (this.pageType === 'updates') {
        data.regenerateId = this.procId;
        this.$inspectionService.inspectionRegenerate(data).subscribe((result: Result) => {
          this.isLoading = false;
          if (result.code === ResultCode.successCode) {
            this.$router.navigate(['/business/work-order/inspection/unfinished-list']).then();
            this.$modalService.success(this.InspectionLanguage.CreateTheInspectionWorkOrderSuccessfully);
          } else {
            this.$modalService.error(result.msg);
          }
        }, () => {
          this.isLoading = false;
        });
      }
    }
  }
  /**
   * 获取区域id巡检全集的所有设施
   */
  public getFacilityFilterByAreaId(areaId, deviceType?) {
    if (areaId !== '') {
      this.$mapService.getALLFacilityList().subscribe((result: Result) => {
        if (result.code === ResultCode.successCode && result.data.length > 0) {
          const arrTemp = result.data || [];
          const facilityData = arrTemp.filter(item => {
            // 当传入areaId过滤
            if (areaId && item.areaId === areaId) {
              return item;
            }
          });
          // this.deviceSet = [];
          // this.deviceSet = facilityData.map(item => item.deviceId);
          // 设施名称集合
          this.inspectionFacilitiesSelectorName = '';
          facilityData.map(item => {
            this.inspectionFacilitiesSelectorName += `${item.deviceName},`;
            return item;
          });
          if (this.isSelectAll === IsSelectAll.right) {
            this.deviceList = [];
            for (let i = 0; i < facilityData.length; i++) {
              this.deviceList.push(
                {
                  'deviceId': facilityData[i].deviceId,
                  'deviceName': facilityData[i].deviceName,
                  'deviceAreaId': facilityData[i].areaId,
                  'deviceAreaName': facilityData[i].areaName,
                  'deviceType': facilityData[i].deviceType
                }
              );
            }
          }
        }
      });
    }
  }
  /**
   * 打开区域选择器
   */
  showAreaSelectorModal() {
    if (this.departmentSelectorName === '') {
      this.$modalService.error('请选择单位信息');
    } else {
      if (!this.disabledIf) {
        this.areaSelectorConfig.treeNodes = this.areaNodes;
        this.areaSelectVisible = true;
      }
    }
  }

  /**
   * 区域选中结果
   * param event
   */
  areaSelectChange(event) {
    this.inspectionFacilitiesSelectorName = '';
    this.deviceList = [];
    if (event[0]) {
      this.$facilityUtilService.setAreaNodesStatus(this.areaNodes, event[0].areaId, this.areaInfo.areaId);
      this.areaName = event[0].areaName;
      this.inspectionAreaId = event[0].areaId;
      this.areaId = event[0].areaId;
      this.disabledSelect = false;
      //  获取区域id下的所有设施参数
      this.getFacilityFilterByAreaId(this.areaId);
    } else {
      this.$facilityUtilService.setAreaNodesStatus(this.areaNodes, null, this.areaInfo.areaId);
      this.areaName = '';
      // this.inspectionFacilitiesSelectorName = '1';
    }
  }

  /**
   * 责任单位选择结果
   * param event
   */
  selectDataChange(event) {
    this.selectUnitName = '';
    this.selectArr = event.map(item => {
      this.selectUnitName += `${item.deptName}`;
      return item;
    });
    if (event.length > 0) {
      for (let i = 0; i < event.length; i++) {
        this.deptList = [{
          'accountabilityDept': event[i].id,
          'accountabilityDeptName': event[i].deptName
        }];
        this.updateDeptList.push({
          'accountabilityDept': event[i].id,
          'accountabilityDeptName': event[i].deptName
        });
      }
      this.deptId = event[0].id;
      this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, [event[0].id]);
      this.queryAreas(event[0].id).then(areaData => {
        this.areaNodes = areaData;
        this.initAreaSelectorConfig(this.areaNodes);
        this.$facilityUtilService.setAreaNodesStatus(this.areaNodes, this.inspectAreaId);
        this.areaName = '';
      });
    } else {
      this.updateDeptList = [];
      this.deptList = [];
      this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, this.selectArr);
    }
    this.departmentSelectorName = this.selectUnitName;
    this.formStatus.resetControlData('deptList', this.selectArr);
  }

  /**
   * 初始化单位选择器配置
   */
  private initTreeSelectorConfig() {
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
      title: this.InspectionLanguage.responsibleUnit,
      width: '500px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.facilityLanguage.deptName, key: 'deptName', width: 100,
        },
        {
          title: this.facilityLanguage.deptLevel, key: 'deptLevel', width: 100,
        },
        {
          title: this.facilityLanguage.parentDept, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }

  /**
   * 打开责任单位选择器
   */
  showDepartmentSelectorModal() {
    if (!this.disabledIf) {
      this.treeSelectorConfig.treeNodes = this.treeNodes;
      if (this.selectArr) {
        this.areaSelectorConfig.treeNodes = this.selectArr;
      }
    }
    this.isUnitVisible = true;
  }

  /**
   * 根据责任单位查询区域
   */
  queryAreas(deptId?) {
    return new Promise((resolve, reject) => {
      if (this.deptId) {
        const id = [deptId || this.deptId];
        this.$inspectionService.queryAreaByDeptId(id).subscribe((result: Result) => {
          if (result.code === ResultCode.successCode) {
            const areaData = result.data || [];
            this.areaNodes = areaData;
            resolve(areaData);
          }
        });
      } else {
        this.areaSelectVisible = false;
      }
    });
  }
  /**
   * 根据区域ID查询责任单位
   */
  private queryDeptList(areaId?) {
    return new Promise((resolve, reject) => {
      if (this.areaId !== '') {
        const id = [areaId || this.areaId || this.inspectAreaId];
        this.$inspectionService.queryResponsibilityUnit(id).subscribe((result: Result) => {
          if (result.code === ResultCode.successCode) {
            const deptData = result.data || [];
            this.treeNodes = deptData;
            resolve(deptData);
          }
        });
      } else {
        this.isUnitVisible = false;
        this.$modalService.info(`${this.InspectionLanguage.pleaseSelectTheAreaInformationFirstTip}`);
      }
    });
  }

  /**
   * 初始化区域选择器配置
   * param nodes
   */
  private initAreaSelectorConfig(nodes) {
    this.areaSelectorConfig = {
      width: '500px',
      height: '300px',
      title: `${this.facilityLanguage.select}${this.facilityLanguage.area}`,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'checkbox',
          chkboxType: {'Y': '', 'N': ''},
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'areaId',
          },
          key: {
            name: 'areaName'
          },
        },
        view: {
          showIcon: false,
          showLine: false
        }
      },
      treeNodes: nodes
    };
  }

  /**
   * 打开巡检设施选择器
   */
  showInspectionFacilitiesSelectorModal() {
    if ((this.pageType === 'update' || this.pageType === 'updates') && this.inspectionFacilitiesSelectorName !== '') {
      this.deviceSet = this.updataDeviceList.map(item => item.deviceId);
    } else {
      this.deviceSet = this.deviceList.map(item => item.deviceId);
    }
    if (this.areaName === '') {
      this.$modalService.info(this.InspectionLanguage.pleaseSelectTheAreaInformationFirstTip);
    } else {
      if (!this.disabledIf) {
        this.mapVisible = true;
        this.inspectDeviceType = this.formStatus.getData('deviceType');
      } else {
        this.$modalService.info(this.InspectionLanguage.pleaseSelectTheAreaInformationFirstTip);
      }
    }
  }

  /**
   * 巡检设施所选结果
   * param event
   */
  mapSelectDataChange(event) {
    this.inspectionFacilitiesSelectorName = '';
    if (event.length !== this.WorkOrder.ZERO) {
      this.deviceList = [];
      for (let i = 0; i < event.length; i++) {
        this.inspectionFacilitiesSelectorName += event[i].deviceName + ',';
        this.deviceList.push({
          'deviceId': event[i].deviceId, 'deviceName': event[i].deviceName, 'deviceType': event[i].deviceType,
          'deviceAreaId': this.inspectionAreaId, 'deviceAreaName': this.areaName
        });
      }
    } else {
      this.$modalService.info(this.InspectionLanguage.selectDeviceTip);
    }
  }

  /**
   * 巡检设施默认所选结果
   */
  mapSelectDataChanges(event) {
    this.deviceList = [];
    const data = event;
    if (this.isSelectAll === '1') {
      this.inspectionFacilitiesSelectorName = '';
      this.inspectDeviceName = '';
      for (let i = 0; i < data.length; i++) {
        this.inspectionFacilitiesSelectorName += data[i].deviceName + ',';
        this.deviceList.push({
          'deviceId': data[i].deviceId, 'deviceName': data[i].deviceName, 'deviceType': data[i].deviceType,
          'deviceAreaId': this.inspectionAreaId, 'deviceAreaName': this.areaName
        });
      }
    } else {
      this.inspectionFacilitiesSelectorName = this.inspectDeviceName;
    }
  }

  /**
   * 巡检设施初始化
   */
  private initMapSelectorConfig() {
    this.mapSelectorConfig = {
      title: this.InspectionLanguage.setDevice,
      width: '1100px',
      height: '465px',
      mapData: [],
      selectedColumn: [
        {
          title: this.InspectionLanguage.deviceName, key: 'deviceName', width: 80
        },
        {
          title: this.InspectionLanguage.assetNumber, key: 'deviceCode', width: 80,
        },
        {
          title: this.InspectionLanguage.facilityType, key: 'inspectDeviceType', width: 60,
        },
        {
          title: this.InspectionLanguage.area, key: 'areaName', width: 80,
        },
      ]
    };
  }

  /**
   * 打开巡检设备弹窗
   */
  showInspectEquipmentSelectorModal() {
    this.deviceSet = this.deviceList.map(item => item.deviceId);
    if (!this.disabledIf) {
      this.mapEquipmentVisible = true;
      // this.inspectDeviceType = this.formStatus.getData('deviceType');
      this.inspectDeviceType = '1';
    } else {
      this.$modalService.info(this.InspectionLanguage.pleaseSelectTheAreaInformationFirstTip);
    }
  }

  /**
   * 巡检设备选择结果
   */
  mapEquipmentSelectDataChange(event) {
    // debugger;
  }

  /**
   * 巡检设备配置
   */
  initEquipmentMapSelectorConfig() {
    this.mapEquipmentSelectorConfig = {
      title: this.InspectionLanguage.inspectionEquipment,
      width: '1100px',
      height: '465px',
      mapData: [],
      selectedColumn: [
        {
          title: this.InspectionLanguage.deviceName, key: 'deviceName', width: 80
        },
        {
          title: this.InspectionLanguage.assetNumber, key: 'deviceCode', width: 80,
        },
        {
          title: this.InspectionLanguage.facilityType, key: 'inspectDeviceType', width: 60,
        },
        {
          title: this.InspectionLanguage.area, key: 'areaName', width: 80,
        },
      ]
    };
  }
  /**
   * 根据id查询未完成工单
   * param id
   */
  private getUpdateWorkUnfinished(id) {
    this.$inspectionService.getUpdateWorkUnfinished(id).subscribe((result: Result) => {
      if (result.code === ResultCode.successCode) {
        result.data.procResourceType = this.InspectionLanguage.inspection;
        this.formStatus.resetData(result.data);
      }
      this.inspectDeviceName = result.data.deviceName;
    });
  }

  /**
   * 根据是否巡检全集改变巡检设施
   */
  changeInspectionFacilities(event) {
    if (event === this.WorkOrder.StrZero && (this.disabledIf === false || this.disabledIf === undefined)) {
      this.inspectionFacilitiesSelectorDisabled = false;
    } else if (event === this.WorkOrder.StrOne) {
      this.inspectionFacilitiesSelectorDisabled = true;
    }
    // 根据区域ID查询设施
    this.InquireAreaId = [this.areaId];
    this.$mapService.getALLFacilityList().subscribe((result: Result) => {
      const arrTemp = result.data || [];
      this.facilityData = arrTemp.filter(item => {
          // 当传入 areaId 和deviceType 双重过滤
          if ((this.areaId || this.inspectAreaId) && this.deviceType && item.areaId === (this.areaId || this.inspectAreaId) &&
            item.deviceType === this.deviceType) {
            return item;
          } else if (this.areaId && !this.deviceType && item.areaId === this.areaId) {
            return item;
          }
        }
      );
      this.mapSelectDataChanges(this.facilityData);
    }, () => {
    });
  }

  /**
   * 判断页面跳转
   */
  judgePageJump() {
    this.$activatedRoute.queryParams.subscribe(params => {
      if (params.procId) {
        this.procId = params.procId;
        this.queryDeptList().then(() => {
          this.queryAreas().then((data) => {
            this.areaNodes = data;
            // 递归设置区域的选择情况
            this.$facilityUtilService.setAreaNodesStatus(this.areaNodes, null, null);
            this.initAreaSelectorConfig(data);
            this.getUpdateWorkUnfinished(this.procId);
          });
        });
        const url = window.location.href;
        this.pageType = url.indexOf('updates') >= 0 ? 'updates' : 'update';
        const str = url.lastIndexOf('=');
        this.status = url.substring(str + 1, url.length);
        if (this.status === 'assigned' || this.pageType === 'updates' && this.status === 'singleBack') {
          this.disabledIf = false;
        } else {
          this.disabledIf = true;
          this.remarkDisabled = false;
          this.departmentSelectorDisabled = true;
        }
      } else {
        this.isSelectAll = '1';
        this.pageType = params.status;
        this.queryDeptList();
      }
      this.pageTitle = this.getPageTitle(this.pageType);
      this.initColumn();
      this.inspectionFacilitiesSelectorName = this.inspectDeviceName || '';
      this.pageSwitching();
    });
  }

  /**
   *  起始日期不可选择小于当前日期
   */
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0 || CommonUtil.checkTimeOver(current);
  }
  /**
   *  期望完工日期不可选择小于起始日期
   */
  disabledEndDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.dateStart) < 0 || CommonUtil.checkTimeOver(current);
  }

  /**
   * 表单提交按钮检查
   */
  confirmButtonIsGray() {
    const newDate = new Date();
    if (this.pageType === 'update' && this.status !== 'assigned') {
      return true;
    } else {
      if (this.dateEnd && this.dateStart && this.inspectionName && this.areaName && this.equipmentName && this.departmentSelectorName &&
        new Date(this.dateStart) < new Date(this.dateEnd) && this.inspectionFacilitiesSelectorName && this.tempName) {
        if ((this.isSelectAll === this.WorkOrder.StrOne || this.isSelectAll === this.WorkOrder.StrZero)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  /**
   * 显示弹窗
   */
  showTemplate() {
    this.modalData = {
      pageType: this.pageType,
      selectTemplateData: this.selectTemplateData
    };
    this.tempSelectVisible = true;
  }
  selectTemplate(event) {
    this.tempName = event.templateName;
    this.selectTemplateData = event;
    this.tempSelectVisible = false;
  }

}
