import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {EquipmentApiService} from '../../share/service/equipment/equipment-api.service';
import {FacilityUtilService} from '../..';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {MapSelectorConfig} from '../../../../shared-module/entity/mapSelectorConfig';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {EquipmentAddInfoModel} from '../../share/model/equipment-add-info.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment-list.model';
import {FilterCondition} from '../../../../shared-module/entity/queryCondition';
import {ResultModel} from '../../../../core-module/model/result.model';
import {historyGoStepConst, objectTypeConst, operateTypeConst, realPicNumConst} from '../../share/const/facility-common.const';
import {UploadImgComponent} from '../../common-component/upload-img/upload-img.component';
import {UPLOAD_IMG} from '../../../../core-module/api-service/facility/facility-request-url';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {FacilityListModel} from '../../share/model/facility-list.model';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment.enum';
import {EquipmentStatusEnum} from '../../share/enum/equipment.enum';
import {formItemIndexConst} from '../../share/const/equipment.const';


/**
 * 新增设备或编辑设备组件
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-detail',
  templateUrl: './equipment-detail.component.html',
  styleUrls: ['./equipment-detail.component.scss'],
})
export class EquipmentDetailComponent implements OnInit, OnDestroy {

  // 是否显示表单标题
  @Input() public isHasTitle: boolean = true;
  // 是否显示表单底部按钮
  @Input() public isHasButton: boolean = true;
  // 判断是否只要add操作
  @Input() public isAddOperate: boolean = false;
  // 所属网关
  @Input() public gatewayName: string;
  // 所属网关端口
  @Input() public gatewayPort: string | number;
  // 获取表单实例
  @Output() public getFormStatus = new EventEmitter<FormOperate>();
  // 图片上传模版
  @ViewChild('uploadImgTemp') private uploadImgTemp: TemplateRef<HTMLDocument>;
  // 上传图片组件
  @ViewChild('uploadImg') public uploadImg: UploadImgComponent;
  // 告警名称模版
  @ViewChild('equipmentNameTemp') private equipmentNameTemp: TemplateRef<HTMLDocument>;
  // 设施表单显示模版
  @ViewChild('facilitiesSelector') private facilitiesSelector: TemplateRef<HTMLDocument>;
  // 区域选择模版
  @ViewChild('areaSelector') private areaSelectorTemp: TemplateRef<HTMLDocument>;
  // 挂载位置
  @ViewChild('positionByDeviceTemplate') private positionByDeviceTemplate: TemplateRef<HTMLDocument>;
  // 类型选择
  @ViewChild('modelByTypeTemplate') private modelByTypeTemplate: TemplateRef<HTMLDocument>;
  // 网关模型
  @ViewChild('gatewaySelectorTemp') private gatewaySelectorTemp: TemplateRef<HTMLDocument>;
  // 电源控制器设备
  @ViewChild('powerControlTemp') private powerControlTemp: TemplateRef<HTMLDocument>;
  // 网关端口下拉选
  @ViewChild('gatewayPortTemp') private gatewayPortTemp: TemplateRef<HTMLDocument>;
  // 表单配置
  public formColumn: FormItem[] = [];
  // 表单实例
  public formStatus: FormOperate;
  // 页面标题
  public pageTitle: string;
  // 页面加载状态
  public pageLoading = false;
  // 确定按钮状态
  public isLoading = false;
  // 设备国际化
  public language: FacilityLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 设施选择器是否显示
  public mapVisible: boolean = false;
  // 设施选择器配置
  public mapSelectorConfig: MapSelectorConfig;
  // 区域选择器配置
  public areaSelectorConfig: TreeSelectorConfig = new TreeSelectorConfig();
  // 区域选择器弹框是否展示
  public areaSelectVisible: boolean = false;
  //  挂载位置下拉选
  public positionSelectList = [];
  //  型号下拉选
  public modelChangeValue = [];
  // 新增或修改设备信息数据模型
  public saveEquipmentModel: EquipmentAddInfoModel = new EquipmentAddInfoModel();
  // 页面操作类型，新增或编辑
  public operateType: string = operateTypeConst.add;
  // 网关端口下拉选
  public gatewayPortList: string[] = [];
  // 网关选择器是否展示
  public gatewayVisible: boolean = false;
  // 网关查询条件
  public gatewayFilter: FilterCondition[] = [];
  // 区域选择节点
  private areaNodes: NzTreeNode[] = [];
  // 控制表单项是否能操作
  private formItemDisable: boolean = false;
  // 关联设施所选设施
  private selectDeviceInfo: FacilityListModel;
  // 选择区域对象
  private areaInfo: AreaModel;
  // 电源控制器设备是否展示
  private powerEquipmentPortShow: boolean = true;

  /**
   * 构造器
   */
  constructor(
    private $equipmentUtilService: FacilityUtilService,
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $ruleUtil: RuleUtil,
    private $active: ActivatedRoute,
    private $equipmentAipService: EquipmentApiService,
  ) {
  }

  /**
   * 初始化组件
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.operateType = this.$active.snapshot.params.type;
    // 获取页面标题
    this.pageTitle = this.operateType === operateTypeConst.update ?
      this.language.editEquipment : this.language.addEquipment;
    // 根据新增或编辑进行初始化数据
    this.handelInit();
  }

  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    this.areaSelectorTemp = null;
    this.positionByDeviceTemplate = null;
    this.modelByTypeTemplate = null;
    this.gatewaySelectorTemp = null;
    this.equipmentNameTemp = null;
    this.uploadImgTemp = null;
    this.facilitiesSelector = null;
  }

  /**
   * 保存设备
   */
  public onClickSaveEquipment(): void {
    this.isLoading = true;
    const formValue = _.cloneDeep(this.formStatus.group.getRawValue());
    formValue.installationDate = new Date(formValue.installationDate).getTime();
    formValue.equipmentId = this.saveEquipmentModel.equipmentId;
    formValue.areaCode = this.saveEquipmentModel.areaCode;
    formValue.equipmentName = this.saveEquipmentModel.equipmentName;
    formValue.mountPosition = this.saveEquipmentModel.mountPosition;
    // 新增操作
    if (this.operateType === operateTypeConst.add) {
      this.$equipmentAipService.addEquipment(formValue).subscribe((result: ResultModel<any>) => {
        this.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.uploadImg.formData.append('objectId', result.data.equipmentId);
          this.uploadImg.formData.append('objectType', objectTypeConst.equipment);
          this.uploadImg.handleUpload(UPLOAD_IMG);
          // 获取设备id进行图片上传
          this.$message.success(result.msg);
          this.onClickCancel();
        } else {
          this.$message.error(result.msg);
        }
      }, () => this.isLoading = false);
      // 修改操作
    } else {
      this.$equipmentAipService.updateEquipmentById(formValue).subscribe((result: ResultModel<any>) => {
        this.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          // 触发图片上传
          this.uploadImg.formData.append('objectId', this.saveEquipmentModel.equipmentId);
          this.uploadImg.formData.append('objectType', objectTypeConst.equipment);
          this.uploadImg.handleUpload(UPLOAD_IMG);
          this.$message.success(result.msg);
          this.onClickCancel();
        } else {
          this.$message.error(result.msg);
        }
      }, () => this.isLoading = false);
    }
  }

  /**
   * 修改网关触发事件
   */
  public onGatewayDataChange(event: EquipmentListModel): void {
    if (event) {
      // 根据网关查询网关端口
      this.formStatus.resetControlData('gatewayId', event.equipmentId);
      this.saveEquipmentModel.gatewayName = event.equipmentName;
      const body = {gatewayId: event.equipmentId, equipmentType: event.equipmentType};
      this.$equipmentAipService.queryGatewayPort(body).subscribe(
        (result: ResultModel<string[]>) => {
          if (result.code === ResultCodeEnum.success) {
            this.gatewayPortList = result.data;
          }
        });
    }
  }

  /**
   * 取消编辑设备
   */
  public onClickCancel(): void {
    // 回到之前的页面
    window.history.go(historyGoStepConst);
  }

  /**
   * 显示网关显示器
   */
  public onShowGateway(): void {
    this.gatewayVisible = true;
  }

  /**
   * 获取表单实例
   */
  public formInstance(event: {instance: FormOperate}): void {
    this.formStatus = event.instance;
    this.getFormStatus.emit(this.formStatus);
  }

  /**
   * 自动生成设备名称
   */
  public onClickAuto(): void {
    // 校验类型和所属区域
    if (!this.formStatus.getData('equipmentType')
      || !this.formStatus.getData('areaId')) {
      this.$message.warning(this.language.pleaseCompleteTheInformation);
      return;
    }
     const equipmentTypeName = this.$equipmentUtilService.getEquipmentType(this.$nzI18n,
      this.formStatus.getData('equipmentType'));
    const temp = {equipmentName: `${this.areaInfo.cityName}${equipmentTypeName}`};
    // 调用后台自动生成名称接口
    this.$equipmentAipService.getEquipmentName(temp).subscribe(
      (result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.saveEquipmentModel.equipmentName = result.data;
          // 将设备名称设置进表单
          this.formStatus.resetControlData('equipmentName', result.data);
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 打开设施选择器
   */
  public onShowFacilityModal(): void {
    this.mapVisible = true;
  }

  /**
   * 打开区域选择器
   */
  public onShowAreaModal(): void {
    this.areaSelectVisible = true;
  }

  /**
   * 选择区域
   */
  public areaSelectChange(event: AreaModel[]): void {
    if (!_.isEmpty(event)) {
      this.areaInfo = _.first(event);
      this.$equipmentUtilService.setAreaNodesStatus(this.areaNodes, this.areaInfo.areaId);
      this.saveEquipmentModel.areaName = this.areaInfo.areaName;
      this.saveEquipmentModel.areaId = this.areaInfo.areaId;
      this.saveEquipmentModel.areaCode = this.areaInfo.areaCode;
      this.formStatus.resetControlData('areaId', this.areaInfo.areaId);
    } else {
      this.areaInfo = null;
      this.$equipmentUtilService.setAreaNodesStatus(this.areaNodes, null);
      this.saveEquipmentModel.areaName = '';
      this.saveEquipmentModel.areaId = null;
      this.saveEquipmentModel.areaCode = null;
      this.formStatus.resetControlData('areaId', null);
    }
  }

  /**
   *  选择设施
   */
  public selectDataChange(event: FacilityListModel): void {
    if (!_.isEmpty(event)) {
      // 此处出现选择第一个 是因为可能是单选或多选，事件以数组形式抛出
      const tempData = _.first(event);
      this.saveEquipmentModel.deviceName = tempData.deviceName;
      this.saveEquipmentModel.deviceId = tempData.deviceId;
      this.formStatus.resetControlData('deviceId', tempData.deviceId);
      this.selectDeviceInfo = tempData;
    }
    // 查询设施下面的挂载位置
    this.findMountPositionById();
  }

  /**
   *  设备名称更新事件
   */
  public onNameChange(data: string): void {
    this.formStatus.resetControlData('equipmentName', data);
  }

  /**
   * 选择挂载位置事件
   */
  public onPositionChange(event: string): void {
    this.formStatus.resetControlData('mountPosition', event);
  }

  /**
   * 型号选择
   */
  public onSelectedModelChange(event: string): void {
    const tempModel = this.modelChangeValue.find(item => item.model === event);
    if (tempModel) {
      this.saveEquipmentModel.equipmentModel = tempModel.event;
      this.formStatus.resetControlData('supplier', tempModel.supplierName);
      this.formStatus.resetControlData('scrapTime', tempModel.scrapTime);
      this.formStatus.resetControlData('equipmentModel', event);
    }
  }

  /**
   * 跳转到页面之后进行新增或者编辑的路由参数
   */
  private handelInit(): void {
    //  初始化设施选择器
    if (this.operateType !== operateTypeConst.add) {
      this.$active.queryParams.subscribe(params => {
        this.saveEquipmentModel.equipmentId = params.equipmentId;
      });
      this.pageLoading = false;
      // 查询详情
      this.queryEquipmentDetailById();
      // 需要查询设备的图片
      this.queryEquipmentImg();
      //  查询区域
      this.$equipmentUtilService.getArea().then((data: NzTreeNode[]) => {
        this.areaNodes = data;
        // 递归设置区域的选择情况
        this.$equipmentUtilService.setAreaNodesStatus(data, null, null);
        this.initAreaConfig(data);
      });
    } else {
      // 新增时有自动生成名称功能
      this.$equipmentUtilService.getArea().then((data: NzTreeNode[]) => {
        this.areaNodes = data;
        // 递归设置区域的选择情况
        this.$equipmentUtilService.setAreaNodesStatus(this.areaNodes, null, null);
        this.initAreaConfig(data);
      });
    }
    // 初始化表单
    this.initForm();
    // 初始化网关的查询条件
    this.gatewayFilter = [{
      filterField: 'equipmentType', operator: OperatorEnum.in,
      filterValue: [EquipmentTypeEnum.gateway]
    }];
  }

  /**
   *  初始化表单
   */
  private initForm(): void {
    this.formColumn = [
      {
        label: this.language.name,
        key: 'equipmentName',
        type: 'custom',
        template: this.equipmentNameTemp,
        width: 300,
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
              this.$equipmentAipService.queryEquipmentNameIsExist({equipmentId: this.saveEquipmentModel.equipmentId, equipmentName: value}),
            res => res.data)
        ],
      },
      { // 类型
        label: this.language.type,
        key: 'equipmentType',
        type: 'select',
        width: 300,
        col: 24,
        require: true,
        placeholder: this.language.picInfo.pleaseChoose,
        rule: [{required: true}],
        selectInfo: {
          data: this.getRoleEquipmentType(),
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, $event, key, formOperate: FormOperate) => {
          this.handelTypeChange($event, formOperate);
        },
      },
      { // 设备ID
        label: this.language.sequenceId,
        key: 'sequenceId',
        type: 'input',
        width: 300,
        col: 24,
        require: true,
        placeholder: this.language.pleaseEnter,
        rule: [{required: true}]
      },
      { // 型号
        label: this.language.model,
        key: 'equipmentModel',
        type: 'custom',
        template: this.modelByTypeTemplate,
        width: 300,
        col: 24,
        require: true,
        rule: []
      },
      { // 运营商
        label: this.language.supplierName,
        key: 'supplier',
        type: 'input',
        disabled: true,
        width: 300,
        col: 24,
        require: true,
        placeholder: this.language.autoInputByModel,
        rule: [{required: true}]
      },
      { // 报废年限
        label: this.language.scrapTime,
        key: 'scrapTime',
        type: 'input',
        disabled: true,
        width: 300,
        col: 24,
        require: true,
        placeholder: this.language.autoInputByModel,
        rule: [{required: true}]
      },
      { // 所属设施
        label: this.language.affiliatedDevice,
        key: 'deviceId',
        type: 'custom',
        template: this.facilitiesSelector,
        width: 300,
        disabled: this.formItemDisable,
        col: 24,
        require: true,
        rule: [{required: true}]
      },
      { //  挂载位置
        label: this.language.mountPosition,
        key: 'mountPosition',
        type: 'custom',
        require: true,
        disabled: this.formItemDisable,
        rule: [],
        template: this.positionByDeviceTemplate,
        asyncRules: [],
      },
      { // 所属区域
        label: this.language.parentId,
        key: 'areaId',
        type: 'custom',
        width: 300,
        col: 24,
        require: false,
        template: this.areaSelectorTemp,
        rule: [{required: false}]
      },
      { // 所属网关
        label: this.language.gatewayName,
        key: 'gatewayId',
        type: 'custom',
        template: this.gatewaySelectorTemp,
        width: 300,
        col: 24,
        require: false,
        rule: []
      },
      { // 网关端口
        label: this.language.gatewayPort,
        key: 'portNo',
        type: 'custom',
        template: this.gatewayPortTemp,
        width: 300,
        col: 24,
        require: false,
        placeholder: this.language.picInfo.pleaseChoose,
        rule: [{required: false}],
      },
      { // 回路
        label: this.language.loop,
        key: 'loopId',
        type: 'select',
        width: 300,
        col: 24,
        require: false,
        placeholder: this.language.picInfo.pleaseChoose,
        rule: [{required: false}],
        selectInfo: {
          data: [],
          label: 'label',
          value: 'value'
        }
      },
      { // 所属公司
        label: this.language.company,
        key: 'company',
        type: 'input',
        width: 300,
        col: 24,
        placeholder: this.language.pleaseEnter,
        rule: [{required: true}]
      },
      { // 安装时间
        label: this.language.installationDate,
        key: 'installationDate',
        type: 'time-picker',
        width: 300,
        col: 24,
        placeholder: this.language.pleaseEnter,
        rule: [{required: true}]
      },
      { // 电源控制设备
        label: this.language.powerControlEquipment,
        key: 'powerControlEquipment',
        type: 'select',
        width: 300,
        col: 24,
        disabled: this.formItemDisable,
        require: false,
        placeholder: this.language.picInfo.pleaseChoose,
        rule: [{required: false}],
        selectInfo: {
          data: [],
          label: 'label',
          value: 'value'
        }
      },
      { // 电源控制设备端口
        label: this.language.powerControlEquipmentPort,
        key: 'powerControlEquipmentPort',
        type: 'select',
        width: 300,
        col: 24,
        hidden: this.powerEquipmentPortShow,
        disabled: this.formItemDisable,
        require: false,
        placeholder: this.language.picInfo.pleaseChoose,
        rule: [{required: false}],
        selectInfo: {
          data: [],
          label: 'label',
          value: 'value'
        }
      },
      { // 三方编码
        label: this.language.thirdPartyCode,
        key: 'otherSystemNumber',
        type: 'input',
        width: 300,
        col: 24,
        require: false,
        placeholder: this.language.pleaseEnter,
        rule: [{required: false}, this.$ruleUtil.getCode()]
      },
      { // 资产编码
        label: this.language.deviceCode,
        key: 'equipmentCode',
        type: 'input',
        width: 300,
        col: 24,
        require: true,
        placeholder: this.language.pleaseEnter,
        rule: [{required: true}, this.$ruleUtil.getCode()],
        asyncRules: [
          // 校验设施编码是否重复
          this.$ruleUtil.getNameAsyncRule(value =>
              this.$equipmentAipService.queryEquipmentCodeIsExist({equipmentCode: value}),
            res => res.data, this.language.equipmentCodeExist)
        ],
      },
      { // 备注
        label: this.language.remarks,
        key: 'remarks',
        type: 'textarea',
        width: 300,
        col: 24,
        placeholder: this.language.pleaseEnter,
        rule: [{required: false}]
      },
      { // 设备实景图
        label: this.language.equipmentPicture,
        key: 'company',
        type: 'custom',
        width: 300,
        col: 24,
        rule: [{required: false}],
        template: this.uploadImgTemp
      },
    ];
  }

  /**
   *  设备类型下拉选修改事件
   */
  private handelTypeChange(typeCode: string, formOperate: FormOperate): void {
    this.$equipmentAipService.getDeviceModelByType({type: typeCode}).subscribe((result: ResultModel<any>) => {
      if (result.code === 0) {
        this.modelChangeValue = result.data;
      }
    });
    // 如果类型为集中控制器就增加挂载位置，不是集中控制器就删除挂载位置
    if (typeCode === EquipmentTypeEnum.centralController) {
      formOperate.deleteColumn('mountPosition');
    } else {
      formOperate.addColumn({ //  挂载位置
        label: this.language.mountPosition,
        key: 'mountPosition',
        type: 'custom',
        require: true,
        rule: [],
        template: this.positionByDeviceTemplate,
        asyncRules: [],
      }, formItemIndexConst.mountPosition);
    }
    // 当选择的是网关时需要增加网关配置
    if (typeCode !== EquipmentTypeEnum.gateway) {
      // 网关
      formOperate.addColumn({
        label: this.language.gatewayName,
        key: 'gatewayId',
        type: 'custom',
        template: this.gatewaySelectorTemp,
        width: 300,
        col: 24,
        require: false,
        rule: []
      }, formItemIndexConst.gateway);
      // 网关端口
      formOperate.addColumn({
        label: this.language.gatewayPort,
        key: 'portNo',
        type: 'custom',
        template: this.gatewayPortTemp,
        width: 300,
        col: 24,
        require: false,
        placeholder: this.language.picInfo.pleaseChoose,
        rule: [{required: false}],
      }, formItemIndexConst.gatewayPort);
    } else {
      formOperate.deleteColumn('gatewayId');
      formOperate.deleteColumn('portNo');
    }
  }

  /**
   *  初始化区域
   */
  private initAreaConfig(nodes: NzTreeNode[]): void {
    this.areaSelectorConfig = {
      width: '500px',
      title: this.language.selectArea,
      height: '300px',
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'checkbox',
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
   * 查询设备详情
   */
  private queryEquipmentDetailById(): void {
    this.$equipmentAipService.getEquipmentById(
      {equipmentId: this.saveEquipmentModel.equipmentId}).subscribe((result: ResultModel<any>) => {
      this.pageLoading = false;
      if (result.code === ResultCodeEnum.success) {
        const temp = result.data.filter(item => item.equipmentId === this.saveEquipmentModel.equipmentId);
        if (!_.isEmpty(temp) && _.first(temp)) {
          const formData = _.first(temp);
          this.saveEquipmentModel = formData;
          this.selectDeviceInfo = formData.deviceInfo;
          this.saveEquipmentModel.deviceName = this.selectDeviceInfo ? this.selectDeviceInfo.deviceName : '';
          this.areaInfo = formData.areaInfo;
          // 设置表单数据回显
          this.saveEquipmentModel.areaName = this.areaInfo ? this.areaInfo.areaName : '';
          this.formStatus.resetControlData('installationDate', formData.installationDate ?
            new Date(Number(formData.installationDate)) : null);
          this.formStatus.resetControlData('equipmentType', formData.equipmentType);
          this.formStatus.resetControlData('equipmentCode', formData.equipmentCode);
          this.formStatus.resetControlData('equipmentModel', formData.equipmentModel);
          this.formStatus.resetControlData('areaId', formData.areaId);
          this.formStatus.resetControlData('sequenceId', formData.sequenceId);
          this.formStatus.resetControlData('deviceId', formData.deviceId);
          this.formStatus.resetControlData('otherSystemNumber', formData.otherSystemNumber);
          this.formStatus.resetControlData('company', formData.company);
          this.formStatus.resetControlData('supplier', formData.supplier);
          this.formStatus.resetControlData('scrapTime', formData.scrapTime);
          this.formStatus.resetControlData('remarks', formData.remarks);
          this.formStatus.resetControlData('equipmentName', formData.equipmentName);
          this.formStatus.resetControlData('mountPosition', formData.mountPosition);
          this.formStatus.resetControlData('loopId', formData.loopId);
          this.formItemDisable = formData.equipmentStatus !== EquipmentStatusEnum.unSet;
          // 查询挂载位置
          this.findMountPositionById();
        }
      }
    });
  }

  /**
   * 查询设备图片
   */
  private queryEquipmentImg(): void {
    const tempBody = {picNum: realPicNumConst, objectId: this.saveEquipmentModel.equipmentId};
    this.$equipmentAipService.getPicDetailForNew(tempBody).subscribe(
      (res: ResultModel<any>) => {
        this.uploadImg.previewUrl = !_.isEmpty(res.data) ? _.first(res.data).picUrlBase : '';
      });
  }

  /**
   * 根据设备设施id查询设施下面的挂载位置
   */
  private findMountPositionById(): void {
    const deviceId = this.selectDeviceInfo ? this.selectDeviceInfo.deviceId : '';
    this.$equipmentAipService.findMountPositionById({deviceId: deviceId}).subscribe(
      (result: ResultModel<string[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.positionSelectList = result.data || [];
        }
      });
  }

  /**
   *  查询当前登录用户权限的设备类型 todo 暂时接口登录之后不支持先写死测试
   */
  private getRoleEquipmentType(): any[] {
    return [
      {label: this.language.gateway, value: EquipmentTypeEnum.gateway},
      {label: this.language.singleLightController, value: EquipmentTypeEnum.singleLightController},
      {label: this.language.centralController, value: EquipmentTypeEnum.centralController},
      {label: this.language.informationScreen, value: EquipmentTypeEnum.informationScreen},
      {label: this.language.camera, value: EquipmentTypeEnum.camera}
    ];
  }
}
