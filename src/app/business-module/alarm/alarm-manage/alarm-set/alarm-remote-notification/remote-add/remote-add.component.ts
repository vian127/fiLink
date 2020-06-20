import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormItem } from '../../../../../../shared-module/component/form/form-config';
import { FormOperate } from '../../../../../../shared-module/component/form/form-opearte.service';
import { NzI18nService } from 'ng-zorro-antd';
import { AlarmLanguageInterface } from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import { FacilityLanguageInterface } from '../../../../../../../assets/i18n/facility/facility.language.interface';
import { UserService } from '../../../../../../core-module/api-service/user';
import { ActivatedRoute, Router } from '@angular/router';
import {PageBean} from '../../../../../../shared-module/entity/pageBean';
import { Result } from '../../../../../../shared-module/entity/result';
import { FiLinkModalService } from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import { QueryCondition } from '../../../../../../shared-module/entity/queryCondition';
import { AlarmService } from '../../../../../../core-module/api-service/alarm';
import { FacilityService } from '../../../../../../core-module/api-service/facility/facility-manage';
import { TableComponent } from 'src/app/shared-module/component/table/table.component';
import {TableConfig} from '../../../../../../shared-module/entity/tableConfig';
import { getDeviceType, getAlarmLevel } from '../../../../../facility/share/const/facility.config';
import { NzTreeNode } from 'ng-zorro-antd';
import {RuleUtil} from '../../../../../../shared-module/util/rule-util';
import { AreaConfig, User } from 'src/app/shared-module/component/alarm/alarmSelectorConfig';
import {TroubleService} from '../../../../../../core-module/api-service/trouble/trouble-manage';
/**
 * 告警设置-告警远程通知 新增和编辑页面
 */
@Component({
  selector: 'app-remote-add',
  templateUrl: './remote-add.component.html',
  styleUrls: ['./remote-add.component.scss']
})
export class RemoteAddComponent implements OnInit {
  @ViewChild('isNoStartUsing') private isNoStartUsing;
  @ViewChild('xCTableComp') private xCTableComp: TableComponent;
  @ViewChild('notifierTemp') notifierTemp: TemplateRef<any>;
  @ViewChild('alarmFixedLevelListTemp') alarmFixedLevelListTemp: TemplateRef<any>;
  @ViewChild('areaSelector') private areaSelector;
  @ViewChild('deviceTypeTemp') private deviceTypeTemp;
  @ViewChild('deviceEquipmentTemp') private  deviceEquipmentTemp;
  @ViewChild('deviceComponent') private deviceComponent: TableComponent;
  @ViewChild('equipmentComponent') private equipmentComponent: TableComponent;
  formColumn: FormItem[] = [];
  formStatus: FormOperate;
  queryCondition: QueryCondition = new QueryCondition();
  public language: AlarmLanguageInterface;
  public facilityLanguage: FacilityLanguageInterface;
  public pageType = 'add';
  // 是否存库 默认 是
  public defaultStatus: string = '1'; // 默认状态
  // 启用状态 默认 启用
  public isNoStartData: boolean = true;
  isLoading = false;
  areaConfig: AreaConfig;
  // 勾选的通知人
  checkAlarmNotifier = {
    name: '',
    ids: []
  };
  display = {
    deviceTypeDisplay: true,
    areadisplay: true
  };
  // 标题
  title: string = '';
  // 编辑状态下 告警id
  alarmId;
  // 基本类型
  fundamental: string;
  // 过滤条件
  filtration: string;
  // 编辑id
  updateParamsId;
  // 告警级别 多选值
  alarmFixedLevelListValue = [];
  // 告警级别 1 紧急  2 主要 3 次要 4 提示
  public alarmFixedLevelList;

  // 区域
  areaList = {
    ids: [],
    name: ''
  };
  // 设施类型
  deviceTypeListValue = [];
  deviceTypeList = [];
  allDeviceTypeList = [];
  alarmUserConfig: User;
  /**
   *  通知人默认值
   *  1 deptList 部门
   *  2 deviceTypes 为设施类型
   *  */
  alarmNotifierInitialValue = {
    'deptList': [],
    'deviceTypes': [],
  };
  // 登录用户
  userInfo;
  // 设施设备弹框
  public isVisible: boolean = false;
  // 设施设备名称
  public deviceEquipmentName: string =  '';
  // 设施数据
  public deviceData: any = [];
  // 设施分页
  devicePageBean: PageBean = new PageBean(10, 1, 1);
  // 设施表格配置
  deviceTableConfig: TableConfig;
  // 分页配置
  deviceQueryCondition: QueryCondition = new QueryCondition();
  // 选中的设施数据
  public checkDeviceData: any = [];
  // 设备数据
  public equipmentData: any = [];
  // 设备分页
  equipmentPageBean: PageBean = new PageBean(10, 1, 1);
  // 设备表格配置
  equipmentTableConfig: TableConfig;
  // 设备分页配置
  equipmentQueryCondition: QueryCondition = new QueryCondition();
  // 选中的设备数据
  public checkEquipmentData: any = [];
  constructor(
    public $nzI18n: NzI18nService,
    public $userService: UserService,
    public $message: FiLinkModalService,
    public $active: ActivatedRoute,
    public $router: Router,
    public $alarmService: AlarmService,
    public $facilityService: FacilityService,
    private $ruleUtil: RuleUtil,
    private $troubleService: TroubleService,
  ) {
    this.language = this.$nzI18n.getLocaleData('alarm');
    this.facilityLanguage = this.$nzI18n.getLocaleData('facility');
    // 所有设施类型
    this.allDeviceTypeList = getDeviceType(this.$nzI18n);
    // 告警级别
    this.alarmFixedLevelList = getAlarmLevel(this.$nzI18n);
  }

  ngOnInit() {
    this.initForm();
    this.fundamental = this.language.fundamental;
    this.filtration = this.language.filtration;
    this.pageType = this.$active.snapshot.params.type;
    if (this.pageType === 'add') {
      // 新建
      this.title = this.language.remoteNotificationAdd;
      // 区域
      this.initAreaConfig();
      // 通知人
      this.initAlarmUserConfig();
    } else {
      // 编辑
      this.title = this.language.remoteNotificationUpdate;
      this.$active.queryParams.subscribe(params => {
        this.updateParamsId = params.id;
        this.getAlarmData(params.id);
      });
    }
    this.deviceInitTableConfig();
    this.equipmentInitTableConfig();
    // 获取设施数据
    this.getDeviceData();
    // 获取设备数据
    this.getEquipmentData();
  }

  /**
   * 获取设施数据
   */
  getDeviceData() {
    this.deviceTableConfig.isLoading = true;
    this.$troubleService.queryDevice(this.deviceQueryCondition).subscribe((res: Result) => {
      if (res['code'] === '00000') {
        this.devicePageBean.Total = res.totalCount;
        this.devicePageBean.pageIndex = res.pageNum;
        this.devicePageBean.pageSize = res.size;
        this.deviceData = res.data || [];
        this.deviceTableConfig.isLoading = false;
      }
    }, () => {
      this.deviceTableConfig.isLoading = false;
    });
  }

  /**
   * 获取设备数据
   */
  getEquipmentData() {
    this.equipmentTableConfig.isLoading = true;
    this.$troubleService.queryEquipment(this.equipmentQueryCondition).subscribe((res: Result) => {
      if (res['code'] === '00000') {
        this.equipmentPageBean.Total = res.totalCount;
        this.equipmentPageBean.pageIndex = res.pageNum;
        this.equipmentPageBean.pageSize = res.size;
        this.equipmentData = res.data || [];
        this.equipmentTableConfig.isLoading = false;
      }
    }, () => {
      this.equipmentTableConfig.isLoading = false;
    });
  }
  // 通知人
  initAlarmUserConfig() {
    const clear = this.checkAlarmNotifier.ids.length ? false : true;
    this.alarmUserConfig = {
      type: 'form',
      clear: clear,
      disabled: this.display.areadisplay,
      condition: this.alarmNotifierInitialValue,
      initialValue: this.checkAlarmNotifier,
      checkUser: (event) => {
        this.checkAlarmNotifier = event;
        this.formStatus.resetControlData('alarmForwardRuleUserList', this.checkAlarmNotifier.ids);
      }
    };
  }

  getAlarmData(id) {
    this.$alarmService.queryAlarmRemoteById([id]).subscribe((res: Result) => {
      if (res['code'] === 0) {
        const alarmData = res.data[0];
        this.display = {
          deviceTypeDisplay: false,
          areadisplay: false
        };
        // 区域
        if ( alarmData.alarmForwardRuleAreaList && alarmData.alarmForwardRuleAreaList.length
          && alarmData.alarmForwardRuleAreaName && alarmData.alarmForwardRuleAreaName.length ) {
          this.areaList = {
            ids: alarmData.alarmForwardRuleAreaList,
            name: alarmData.alarmForwardRuleAreaName.join(',')
          };
          // this.alarmNotifierInitialValue.deptList
          // 区域
          this.initAreaConfig();
          // 通过区域获取单位
          this.areaGtUnit();
          // 通过区域获取设施类型
          this.getDeviceType();
          // this.initAreaConfig();
        }
        setTimeout(() => {
          // 设施类型
          if ( alarmData.alarmForwardRuleDeviceTypeList && alarmData.alarmForwardRuleDeviceTypeList.length ) {
            this.deviceTypeListValue = alarmData.alarmForwardRuleDeviceTypeList.map(deviceType => deviceType.deviceTypeId );
            this.changeDeviceType();
          }
        }, 0);
        setTimeout(() => {
          // 给通知人赋值
          if ( alarmData.alarmForwardRuleUserList && alarmData.alarmForwardRuleUserList.length
            && alarmData.alarmForwardRuleUserName && alarmData.alarmForwardRuleUserName.length
            && this.alarmNotifierInitialValue.deptList.length && this.alarmNotifierInitialValue.deviceTypes.length) {
            this.checkAlarmNotifier = {
              name: alarmData.alarmForwardRuleUserName.join(','),
              ids: alarmData.alarmForwardRuleUserList
            };
            alarmData.alarmForwardRuleUserList = alarmData.alarmForwardRuleUserList;
            // 通知人
            this.initAlarmUserConfig();
          }
        }, 1000);
        // 告警级别
        if ( alarmData.alarmForwardRuleLevels && alarmData.alarmForwardRuleLevels.length ) {
          this.alarmFixedLevelListValue = alarmData.alarmForwardRuleLevels.map(level => level.alarmLevelId );
          alarmData.alarmForwardRuleLevels = this.alarmFixedLevelListValue;
        }
        // 推送方式
        // alarmData.pushType = alarmData.pushType + '';
        // 启用 禁用状态
        if (alarmData.status) { this.isNoStartData = alarmData.status === 1 ? true : false; }
        this.formStatus.resetData(alarmData);
      }
    });
  }

  // 区域
  initAreaConfig() {
    const clear = this.areaList.ids.length ? false : true;
    this.areaConfig = {
      clear: clear,
      type: 'form',
      initialValue: this.areaList,
      checkArea: (event) => {
        this.areaList = event;
        this.areaGtUnit();
        this.formStatus.resetControlData('alarmForwardRuleAreaList', this.areaList.ids);
        if ( this.areaList && this.areaList.ids && this.areaList.ids.length ) {
          this.display.deviceTypeDisplay = false;
          // 通过区域获取设施类型
          this.getDeviceType();
          // 当区域的值改变时, 设施类型的值 重新选择
          this.deviceTypeListValue = [];
          this.formStatus.resetControlData('alarmForwardRuleDeviceTypeList', this.deviceTypeListValue);
          // 勾选的通知人
          this.checkAlarmNotifier = {
            name: '',
            ids: []
          };
          this.display.areadisplay = true;
          this.formStatus.resetControlData('alarmForwardRuleUserList', this.checkAlarmNotifier.ids);
          this.initAlarmUserConfig();
        } else {
          // 当区域为空时 设施类型 通知人禁 空
          this.empty();
        }
      }
    };
  }

  // 清空区域
  empty() {
    this.display = {
      deviceTypeDisplay: true,
      areadisplay: true
    };
    this.deviceTypeListValue = [];
    this.checkAlarmNotifier = {
      name: '',
      ids: []
    };
    this.initAlarmUserConfig();
  }
  // 通过区域获取设施类型
  getDeviceType() {
    this.$alarmService.getDeviceType(this.areaList.ids).subscribe((data: NzTreeNode[]) => {
      if ( data['code'] === 0) {
        const deviceTypeList = [];
        this.allDeviceTypeList.forEach(item => {
          data['data'].forEach(id => {
            if ( id === item.code ) {
              deviceTypeList.push(item);
            }
          });
        });
        this.deviceTypeList = deviceTypeList;
      }
    });
  }

  // 通过选择的区域 获取单位
  areaGtUnit() {
    this.$alarmService.areaGtUnit(this.areaList.ids).subscribe((data: NzTreeNode[]) => {
      if ( data['code'] === 0) {
        if ( data['data'] && data['data'].length ) {
          this.alarmNotifierInitialValue.deptList = data['data'].map(item => item.deptId);
        } else {
          setTimeout( () => {
            this.areaList = {
              ids: [],
              name: ''
            };
            this.initAreaConfig();
            this.display.deviceTypeDisplay = true;
            this.deviceTypeListValue = [];
            // 勾选的通知人
            this.checkAlarmNotifier = {
              name: '',
              ids: []
            };
            this.display.areadisplay = true;
            this.initAlarmUserConfig();
          }, 0);
          this.$message.info(this.language.noResponsibleEntityIsAssociatedWithTheSelectedArea);
        }
      }
    });
  }

  formInstance(event) {
    this.formStatus = event.instance;
  }

  // 表单
  public initForm() {
    this.formColumn = [
      {
        label: this.language.name,
        key: 'ruleName',
        type: 'input',
        require: true,
        width: 280,
        rule: [
          { required: true },
          { maxLength: 32 },
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      {
        // 区域
        label: this.language.area,
        key: 'alarmForwardRuleAreaList', type: 'custom',
        width: 430,
        template: this.areaSelector,
        require: true,
        rule: [{required: true}], asyncRules: []
      },
      {
        // 设施类型
        label: this.language.alarmSourceType, key: 'alarmForwardRuleDeviceTypeList',
        type: 'custom',
        require: true,
        width: 430,
        rule: [{ required: true }],
        asyncRules: [],
        template: this.deviceTypeTemp,
      },
      {
        // 设施设备
        label: this.language.deviceEquipment,
        key: 'deviceEquipment',
        type: 'custom',
        require: true,
        width: 430,
        rule: [{ required: true }],
        asyncRules: [],
        template: this.deviceEquipmentTemp,
      },
      {
        // 通知人
        label: this.language.notifier,
        key: 'alarmForwardRuleUserList',
        type: 'custom',
        require: true,
        width: 430,
        rule: [{ required: true }],
        asyncRules: [],
        template: this.notifierTemp,
      },
      {
        // 告警级别
        label: this.language.alarmFixedLevel,
        key: 'alarmForwardRuleLevels',
        type: 'custom',
        require: true,
        width: 430,
        rule: [{ required: true }],
        asyncRules: [],
        template: this.alarmFixedLevelListTemp,
        initialValue: this.alarmFixedLevelList
      },
      {
        // 是否启用
        label: this.language.openStatus,
        key: 'status',
        type: 'custom',
        template: this.isNoStartUsing,
        initialValue: this.isNoStartData,
        require: true,
        rule: [{ required: true }],
        asyncRules: [],
        radioInfo: {
          type: 'select', selectInfo: [
            { label: this.language.disable, value: 2 },
            { label: this.language.enable, value: 1 }
          ]
        },
      },
      {
        label: this.language.remark,
        key: 'remark',
        type: 'input',
        // require: true,
        width: 430,
        rule: [
          // { required: true },
          this.$ruleUtil.getRemarkMaxLengthRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }

  onChangeLevel() {
    setTimeout( () => {
       if ( this.alarmFixedLevelListValue && !this.alarmFixedLevelListValue.length ) {
         this.formStatus.resetControlData('alarmForwardRuleLevels', []);
       }
    }, 0);
  }
  // 告警级别
  changeLevel() {
    this.formStatus.resetControlData('alarmForwardRuleLevels', this.alarmFixedLevelListValue.map(item => {
      return {'alarmLevelId': item };
    }));
  }

  onSearchDeviceType() {
    setTimeout( () => {
      if ( this.deviceTypeListValue && !this.deviceTypeListValue.length ) {
        this.formStatus.resetControlData('alarmForwardRuleDeviceTypeList', null);
        this.display.areadisplay = true;
        // 当设施类型为空时
        this.checkAlarmNotifier = {
          name: '',
          ids: []
        };
        this.formStatus.resetControlData('alarmForwardRuleUserList', this.checkAlarmNotifier.ids);
        this.initAlarmUserConfig();
      }
    }, 0);
  }
  // 设施类型
  changeDeviceType() {
    // 将值传递给 通知人
    this.alarmNotifierInitialValue = {
      'deptList': this.alarmNotifierInitialValue.deptList,
      'deviceTypes': this.deviceTypeListValue,
    };
    setTimeout( () => {
      // 设施类型选择后 开启通知人
      if ( this.deviceTypeListValue && this.deviceTypeListValue.length ) {
        this.display.areadisplay = false;
        this.formStatus.resetControlData('alarmForwardRuleDeviceTypeList',
          this.deviceTypeListValue.map(deviceTypeId => {
            return { 'deviceTypeId': deviceTypeId };
          }));
      } else {
        this.formStatus.resetControlData('alarmForwardRuleDeviceTypeList', null);
        this.display.areadisplay = true;
        // 当设施类型为空时
        this.checkAlarmNotifier = {
          name: '',
          ids: []
        };
        // this.initAlarmUserConfig();
      }
      this.initAlarmUserConfig();
    }, 0);
  }

  /**
   *新增告警
   */
  submit() {
    this.isLoading = true;
    const alarmObj = this.formStatus.getData();
    alarmObj.ruleName = alarmObj.ruleName.trim();
    alarmObj.remark = alarmObj.remark && alarmObj.remark.trim();
    // 禁启用状态 需要通过转化
    alarmObj.status = this.isNoStartData ? 1 : 2;
    // 设施类型
    alarmObj.alarmForwardRuleDeviceTypeList = this.deviceTypeListValue.map(deviceTypeId => {
      return { 'deviceTypeId': deviceTypeId };
    });
    // 告警级别
    alarmObj.alarmForwardRuleLevels  = this.alarmFixedLevelListValue.map(item => {
      return {'alarmLevelId': item };
    });
    // 设施设备
    alarmObj.alarmForwardRuleDeviceList = this.checkDeviceData;
    alarmObj.alarmForwardRuleEquipmentList = this.checkEquipmentData;
    if (this.pageType === 'add') {
      this.$alarmService.addAlarmRemote(alarmObj).subscribe((res: Result) => {
        this.isLoading = false;
        if (res && res.code === 0) {
          this.$message.success(res.msg);
          this.$router.navigate(['business/alarm/alarm-remote-notification']).then();
        }
      });
    } else {
      alarmObj.id = this.updateParamsId;
      this.$alarmService.updateAlarmRemarklist(alarmObj).subscribe((res: Result) => {
        this.isLoading = false;
        if (res && res.code === 0) {
          this.$message.success(res.msg);
          this.$router.navigate(['business/alarm/alarm-remote-notification']).then();
        }
      });
    }
  }
  // 新增远程通知取消
  cancel() {
    this.$router.navigate(['business/alarm/alarm-remote-notification']).then();
  }

  /**
   * 设施设备
   */
  showDeviceEquipmentTemp () {
    this.isVisible = true;
  }
  /**
   * 关闭设施设备弹框
   */
  close() {
    this.isVisible = false;
  }
  /**
   * 设施分页显示
   */
  devicePageChange(event) {
    this.deviceQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.deviceQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getDeviceData();
  }
  /**
   * 设施分页显示
   */
  equipmentPageChange(event) {
    this.equipmentQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.equipmentQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getEquipmentData();
  }

  /**
   * 初始化设施列表配置
   */
  private deviceInitTableConfig() {
    this.deviceTableConfig = {
      isDraggable: false,
      primaryKey: '06-1-1-1',
      isLoading: false,
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      notShowPrint: true,
      searchReturnType: 'object',
      scroll: {x: '1600px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {// 资产编号
          title: this.facilityLanguage.deviceCode, key: 'deviceCode',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 名称
          title: this.facilityLanguage.name, key: 'deviceName',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 类型
          title: this.facilityLanguage.type, key: 'deviceType',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 状态
          title: this.facilityLanguage.status, key: 'deviceStatus',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 型号
          title: this.facilityLanguage.model, key: 'deviceModel',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 供应商
          title: this.facilityLanguage.supplierName, key: 'supplier',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 报废年限
          title: this.facilityLanguage.scrapTime, key: 'scrapTime',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 设备数量
          title: this.facilityLanguage.equipmentQuantity, key: 'equipmentQuantity',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 业务状态
          title: this.facilityLanguage.businessStatus, key: 'businessStatus',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 详细地址
          title: this.facilityLanguage.address, key: 'address',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 所属项目
          title: this.facilityLanguage.project, key: 'projectName',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 所属区域
          title: this.facilityLanguage.areaId, key: 'areaName',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 权属公司
          title: this.facilityLanguage.company, key: 'company',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 安装日期
          title: this.facilityLanguage.installTime, key: 'installationDate',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 备注
          title: this.facilityLanguage.remarks, key: 'remarks',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [],
      sort: (event) => {

      },
      handleSearch: (event) => {},
      handleSelect: (data, currentItem) => {
        this.checkDeviceData = [];
        if (data && data.length > 0) {
          this.checkDeviceData = data.map(item => ({
            deviceId: item.deviceId,
            deviceName: item.deviceName,
          }));
        }
      },
      openTableSearch: (event) => {},
    };
  }
  /**
   * 初始化设备列表配置
   */
  private equipmentInitTableConfig() {
    this.equipmentTableConfig = {
      isDraggable: false,
      primaryKey: '06-1-1-1',
      isLoading: false,
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      notShowPrint: true,
      searchReturnType: 'object',
      scroll: {x: '1600px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {// 资产编号
          title: this.facilityLanguage.deviceCode, key: 'equipmentCode',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 名称
          title: this.facilityLanguage.name, key: 'equipmentName',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 类型
          title: this.facilityLanguage.type, key: 'equipmentType',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 状态
          title: this.facilityLanguage.status, key: 'equipmentStatus',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 型号
          title: this.facilityLanguage.model, key: 'equipmentModel',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 供应商
          title: this.facilityLanguage.supplierName, key: 'supplier',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 报废年限
          title: this.facilityLanguage.scrapTime, key: 'scrapTime',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 所属设施
          title: this.facilityLanguage.affiliatedDevice, key: 'deviceId',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 挂载位置
          title: this.facilityLanguage.mountPosition, key: 'mountPosition',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 安装时间
          title: this.facilityLanguage.installationDate, key: 'installationDate',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 权属公司
          title: this.facilityLanguage.company, key: 'company',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 业务状态
          title: this.facilityLanguage.businessStatus, key: 'businessStatus',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 所属区域
          title: this.facilityLanguage.areaId, key: 'areaName',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 所属网关
          title: this.facilityLanguage.gatewayName, key: 'gatewayId',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// 备注
          title: this.facilityLanguage.remarks, key: 'remarks',
          searchable: true,
          configurable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [],
      sort: (event) => {
        console.log(12);
      },
      handleSelect: (data, currentItem) => {
        // this.checkEquipmentData = {ids: [], name: ''};
        // if (data && data.length > 0) {
        //   data.forEach(item => {
        //     this.checkEquipmentData.ids.push(item.id);
        //     this.checkEquipmentData.name += item.name + ',';
        //   });
        // }
        this.checkEquipmentData = [];
        if (data && data.length > 0) {
          this.checkEquipmentData = data.map(item => ({
            equipmentId: item.equipmentId,
            equipmentName: item.equipmentName
          }));
        }
      },
      handleSearch: (event) => {},
      openTableSearch: (event) => {},
    };
  }

  /**
   * 设施设备确认
   */
  sureClick() {
    const deviceData = this.checkDeviceData;
    const equipmentData = this.checkEquipmentData;
    const resultData = [];
    const device = [];
    if (deviceData && deviceData.length > 0) {
      deviceData.forEach(item => {
        resultData.push(item.name);
      });
    }
    if (equipmentData && equipmentData.length > 0) {
      equipmentData.forEach(item => {
        resultData.push(item.name);
      });
    }
    // 展示的值
    this.deviceEquipmentName = resultData.join(',');
    this.isVisible  = false;
    this.formStatus.resetControlData('deviceEquipment', this.deviceEquipmentName);
  }
  // 设施设备取消
  cancelModal() {
    this.isVisible  = false;
  }
}
