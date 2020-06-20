import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzI18nService, NzModalService, NzTreeNode} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {Result} from '../../../../shared-module/entity/result';
import {FacilityService} from '../../../../core-module/api-service/facility/facility-manage';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FormLanguageInterface} from '../../../../../assets/i18n/form/form.language.interface';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {ResultModel} from '../../../../core-module/model/result.model';
import {UploadImgComponent} from '../../common-component/upload-img/upload-img.component';
import {UPLOAD_IMG} from '../../../../core-module/api-service/facility/facility-request-url';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {FacilityInfo} from '../../../../core-module/model/facility/facility';
import {operateTypeConst} from '../../share/const/facility-common.const';
import {FacilityDetailFormModel} from '../../share/model/facility-detail-form.model';
import {getDeviceType} from '../../share/const/facility.config';
import {FacilityUtilService} from '../../share/service/facility-util.service';


/**
 * 新增（修改）设施组件
 */
@Component({
  selector: 'app-facility-detail',
  templateUrl: './facility-detail.component.html',
  styleUrls: ['./facility-detail.component.scss']
})
export class FacilityDetailComponent implements OnInit, AfterViewInit {
  // 自定义模板
  @ViewChild('customTemplate') private customTemplate: TemplateRef<Element>;
  // 位置选择模板
  @ViewChild('positionTemplate') private positionTemplate: TemplateRef<Element>;
  // 区域选择器
  @ViewChild('areaSelector') private areaSelector: TemplateRef<Element>;
  // 自动生成名称模板
  @ViewChild('autoNameTemplate') private autoNameTemplate: TemplateRef<Element>;
  // 型号关联类型变动模板
  @ViewChild('modelByTypeTemplate') private modelByTypeTemplate: TemplateRef<Element>;
  // 供应商模板
  @ViewChild('supplierTemplate') private supplierTemplate: TemplateRef<Element>;
  // 安装日期模板
  @ViewChild('installationDate') public installationDateTemp: TemplateRef<Element>;
  // 报废年限模板
  @ViewChild('scrapTimeTemplate') public scrapTimeTemplate: TemplateRef<Element>;
  // 上传图片模板
  @ViewChild('uploadImgTemp') public uploadImgTemp: TemplateRef<Element>;
  // 上传图片组件
  @ViewChild('uploadImg') public uploadImg: UploadImgComponent;
  // 表单配置
  public formColumn: FormItem[] = [];
  // 表单状态
  public formStatus: FormOperate;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 区域选择器显示隐藏
  public areaSelectVisible = false;
  // 页面类型 新增修改
  public pageType = operateTypeConst.add;
  // 页面标题
  public pageTitle: string;
  // 城市信息 抽出模型
  /*{
  address: '',
  point: {lat: '', lng: ''},
  addressComponents: {
    province: '',
    city: '',
    district: ''
  }
};*/
  public cityInfo = {province: '', city: '', district: '', detailInfo: {lng: 0, lat: 0}};
  // 已选择的点
  public selectPoint = {lat: 0, lng: 0};
  // 设施地理位置
  public facilityAddress = '';
  // 设施id
  public deviceId: string;
  // 地理位置选择器显示隐藏
  public isVisible = false;
  // 区域名称
  public areaName = '';
  // 责任单位选择器
  public selectorData = {parentId: '', accountabilityUnit: ''};
  // 区域选择器配置信息
  public areaSelectorConfig = new TreeSelectorConfig();
  // 区域信息
  public areaInfo: AreaModel = new AreaModel();
  // 区域选择节点
  private areaNodes = [];
  // 是否加载
  public isLoading = false;
  // 页面是否加载
  public pageLoading = false;
  // 区域禁用
  public areaDisabled: boolean;
  // 地理位置选择禁用
  public positionDisabled: boolean;
  // 表单语言包
  public formLanguage: FormLanguageInterface;
  // 根据类型变动的型号下拉内容
  public modelChangeValue: Array<string>;
  // 根据类型获取的型号、供应商、报废年限信息 todo 抽取模型
  public getDetailByModel: Array<any>;
  // 报废年限
  public scrapTime: string;
  // 供应商
  public supplier: string;
  // 选中型号value
  public selectModelValue: string;
  // 自动生成名称
  public autoName: string;
  // 输入框名称行是否显示
  public inputName = false;
  // 自动生成名称行是否显示
  public inputAutoName = false;
  // 项目列表
  public projectList: Array<{ projectId: string, projectName: string }> = [];

  constructor(private $nzI18n: NzI18nService,
              private $active: ActivatedRoute,
              private $facilityUtilService: FacilityUtilService,
              private $facilityService: FacilityService,
              private $modalService: FiLinkModalService,
              private $modelService: NzModalService,
              private $ruleUtil: RuleUtil) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.formLanguage = this.$nzI18n.getLocaleData('form');
    this.pageType = this.$active.snapshot.params.type;
    this.pageTitle = this.getPageTitle(this.pageType);
    if (this.pageType !== operateTypeConst.add) {
      // 编辑时名称没有自动生成
      this.inputAutoName = true;
      this.$active.queryParams.subscribe(params => {
        this.deviceId = params.id;
        this.pageLoading = true;
        this.$facilityService.deviceCanChangeDetail(this.deviceId).subscribe((result: Result) => {
          if (result.code !== 0) {
            this.modifyPermission();
          }
        });
        this.$facilityUtilService.getArea().then((data: NzTreeNode[]) => {
          this.areaNodes = data;
          this.initAreaSelectorConfig(data);
          this.queryDeviceById();
        });
      });
    } else {
      // 新增时有自动生成名称功能
      this.inputName = true;
      this.$facilityUtilService.getArea().then((data: NzTreeNode[]) => {
        this.areaNodes = data;
        // 递归设置区域的选择情况
        this.$facilityUtilService.setAreaNodesStatus(this.areaNodes, null, null);
        this.initAreaSelectorConfig(data);
      });
    }

    this.initColumn();
    this.getProjectList()
      .pipe(map((result: ResultModel<Array<{ projectId: string, projectName: string }>>) => {
        if (result.code === ResultCodeEnum.success) {
          this.projectList = result.data;
        }
      }))
      .subscribe(() => {
        this.initColumn();
      });
  }

  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.controls['deviceName'].setValue('嚣张跋扈001');
  }

  /**
   * 新增区域
   */
  public addFacility(): void {
    this.isLoading = true;
    const data: FacilityDetailFormModel = this.formStatus.group.getRawValue();
    data.provinceName = this.cityInfo.province;
    data.cityName = this.cityInfo.city;
    data.districtName = this.cityInfo.district;
    const positionBase = `${this.cityInfo.detailInfo.lng},${this.cityInfo.detailInfo.lat}`;
    data.positionBase = positionBase;
    data.positionGps = '12,33';
    if (this.pageType === operateTypeConst.add) {
      // 格式化安装时间
      data.installationDate = new Date(this.formStatus.group.controls['installationDate'].value).getTime();
      this.$facilityService.addDevice(data).subscribe((result: ResultModel<{ deviceId: string }>) => {
        this.isLoading = false;
        if (result.code === '0') {
          this.uploadImg.formData.append('objectId', result.data.deviceId);
          this.uploadImg.formData.append('objectType', '1');
          if (this.uploadImg.handleUpload(UPLOAD_IMG)) {
            this.goBack();
            this.$modalService.success(result.msg);
          }
        } else {
          this.$modalService.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    } else if (this.pageType === operateTypeConst.update) {
      data.deviceId = this.deviceId;
      this.$facilityService.updateDeviceById(data).subscribe((result: Result) => {
        this.isLoading = false;
        if (result.code === 0) {
          this.goBack();
          this.$modalService.success(result.msg);
        } else {
          this.$modalService.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    }
  }

  public goBack(): void {
    window.history.go(-1);
  }

  /**
   * 打开地理位置选择器
   */
  public showModal(): void {
    this.isVisible = true;
  }

  /**
   * 打开区域选择器
   */
  public showAreaSelectorModal(): void {
    if (this.areaDisabled) {
      return;
    }
    this.areaSelectorConfig.treeNodes = this.areaNodes;
    this.areaSelectVisible = true;
  }

  /**
   * 区域选中结果
   * param event
   */
  public areaSelectChange(event): void {
    if (event[0]) {
      this.$facilityUtilService.setAreaNodesStatus(this.areaNodes, event[0].areaId);
      this.areaName = event[0].areaName;
      this.selectorData.parentId = event[0].areaId;
      this.formStatus.resetControlData('areaId', event[0].areaId);
    } else {
      this.$facilityUtilService.setAreaNodesStatus(this.areaNodes, null);
      this.areaName = '';
      this.selectorData.parentId = null;
      this.formStatus.resetControlData('areaId', null);
    }
  }

  /**
   * 地图选择器结果
   * param result
   */
  public selectDataChange(result: any): void {
    if (result.addressComponents.province && result.addressComponents.city && result.addressComponents.district) {
      this.cityInfo = result.addressComponents;
      this.cityInfo.detailInfo = result.point;
      this.selectPoint = result.point;
      const str = `${result.addressComponents.province},${result.addressComponents.city},${result.addressComponents.district}`;
      this.facilityAddress = result.address;
      this.formStatus.resetControlData('position', str);
      this.formStatus.resetControlData('address', result.address);

    }
  }

  /**
   * 根据id查询设备详情
   */
  private queryDeviceById(): void {
    this.$facilityService.queryDeviceById({deviceId: this.deviceId}).subscribe((result: ResultModel<FacilityInfo>) => {
      this.pageLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.formStatus.resetData(result.data.pop());
        this.facilityAddress = result.data.pop().address;
        this.formStatus.group.controls['deviceType'].disable();
        this.selectModelValue = result.data.pop().deviceModel;
        this.supplier = result.data.pop().supplier;
        this.scrapTime = result.data.pop().scrapTime;
        this.formStatus.resetControlData('deviceModel', result.data.pop().deviceModel);
        this.formStatus.resetControlData('supplier', result.data.pop().supplier);
        this.formStatus.resetControlData('scrapTime', result.data.pop().scrapTime);
        this.formStatus.group.controls['areaId'].reset(result.data.pop().areaInfo.areaId);
        if (result.data.pop().provinceName && result.data.pop().cityName && result.data.pop().districtName) {
          this.cityInfo.province = result.data.pop().provinceName;
          this.cityInfo.city = result.data.pop().cityName;
          this.cityInfo.district = result.data.pop().districtName;
          const str = `${result.data.pop().provinceName},${result.data.pop().cityName},${result.data.pop().districtName}`;
          this.formStatus.resetControlData('position', str);
        }
        // 地址选择器
        const position = result.data.pop().positionBase.split(',');
        const _lng = parseFloat(position[0]);
        const __lat = parseFloat(position[1]);
        this.selectPoint.lat = __lat;
        this.selectPoint.lng = _lng;
        this.cityInfo.detailInfo = this.selectPoint;
        // 递归设置区域的选择情况
        this.areaName = result.data.pop().areaInfo.areaName;
        this.$facilityUtilService.setAreaNodesStatus(this.areaNodes, result.data.pop().areaInfo.areaId);
      } else if (result.code === 130204) {
        this.$modalService.error(result.msg);
        this.goBack();
      }
    }, () => {
      this.pageLoading = false;
    });
  }

  /**
   * 初始化表单配置
   */
  private initColumn(): void {
    this.autoName = '魔改';
    this.formColumn = [
      { // 自动生成名称
        label: this.language.deviceName,
        key: 'deviceName',
        type: 'custom',
        hidden: this.inputAutoName,
        require: true,
        template: this.autoNameTemplate,
        rule: [],
      },
      { // 名称
        label: this.language.deviceName,
        key: 'deviceName',
        type: 'input',
        hidden: this.inputName,
        require: true,
        rule: [],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule((value) => {
            return this.$facilityService.queryDeviceNameIsExist({deviceId: this.deviceId, deviceName: value});
          }, (res) => {
            return res['data'];
          })
        ]
      },
      { // 类型
        label: this.language.deviceType, key: 'deviceType', type: 'select',
        selectInfo: {
          data: this.getRoleDeviceType(),
          label: 'label',
          value: 'code'
        },
        require: true,
        rule: [{required: false}], asyncRules: [],
        modelChange: (controls, $event, key) => {
          // 类型变换清空型号显示
          this.selectModelValue = '';
          this.supplier = '';
          this.scrapTime = '';
          this.formStatus.group.controls['deviceModel'].reset(this.selectModelValue);
          this.formStatus.group.controls['supplier'].reset(this.supplier);
          this.formStatus.group.controls['scrapTime'].reset(this.scrapTime);
          // 根据设施类型获取型号
          const deviceType = getDeviceType(this.$nzI18n, $event);
          this.$facilityService.getModelByType({'type': deviceType}).subscribe((result: ResultModel<any>) => {
            const data = result.data || [];
            this.getDetailByModel = result.data || [];
            this.modelChangeValue = [];
            if (data.length !== 0) {
              data.forEach(item => {
                this.modelChangeValue.push(item.model);
              });
            }
          });
        },
      },
      { // 型号
        label: this.language.deviceModel,
        key: 'deviceModel',
        type: 'custom',
        require: true,
        rule: [],
        template: this.modelByTypeTemplate,
        asyncRules: [],
      },
      { // 供应商
        label: this.language.supplierName,
        key: 'supplier',
        type: 'custom',
        require: true,
        rule: [],
        template: this.supplierTemplate,
        asyncRules: [],
      },
      { // 报废年限
        label: this.language.scrapTime,
        key: 'scrapTime',
        type: 'custom',
        require: true,
        rule: [],
        template: this.scrapTimeTemplate,
        asyncRules: [],
      },
      { // 权属公司
        label: this.language.company,
        key: 'company',
        type: 'input',
        require: false,
        rule: [],
        asyncRules: []
      },
      { // 安装日期
        label: this.language.installationDate,
        key: 'installationDate',
        require: false,
        type: 'custom',
        template: this.installationDateTemp,
        rule: [],
        asyncRules: []
      },
      { // 第三方编码
        label: this.language.otherSystemNumber,
        key: 'otherSystemNumber',
        type: 'input',
        require: false,
        rule: [this.$ruleUtil.getCode()],
        asyncRules: []
      },
      { // 资产编码
        label: this.language.assetNumbers,
        key: 'assetNumbers',
        type: 'input',
        require: true,
        rule: [{required: true}, this.$ruleUtil.getCode()],
        asyncRules: []
      },
      {  // 所属区域
        label: this.language.areaId, key: 'areaId', type: 'custom',
        require: true,
        template: this.areaSelector,
        modelChange: (controls, $event, key) => {
        },
        rule: [{required: true}], asyncRules: []
      },
      { // 所属项目
        label: this.language.projectName, key: 'projectId', type: 'select',
        placeholder: this.language.pleaseChoose,
        selectInfo: {
          data: this.projectList,
          label: 'projectName',
          value: 'projectId'
        },
        modelChange: (controls, $event, key) => {
        },
        rule: [], asyncRules: []
      },
      { // 地理位置
        label: this.language.position,
        key: 'position',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        template: this.positionTemplate
      },
      { // 省市区
        label: this.language.region,
        key: 'managementFacilities', type: 'custom', rule: [], require: true, template: this.customTemplate
      },
      { // 详细地址
        label: this.language.address,
        key: 'address',
        type: 'input',
        disabled: true,
        require: true,
        rule: [{required: true}, this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      { // 备注
        label: this.language.remarks, key: 'remarks', type: 'input',
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      {
        label: this.language.facilityPicture,
        key: 'facilityPicture',
        type: 'custom',
        width: 300,
        col: 24,
        rule: [{required: false}],
        template: this.uploadImgTemp
      },
    ];
  }

  /**
   * 获取页面标题类型
   * param type
   * returns {string}
   */
  private getPageTitle(type): string {
    let title;
    switch (type) {
      case'add':
        title = `${this.language.addArea}${this.language.device}`;
        break;
      case 'update':
        title = `${this.language.modify}${this.language.device}`;
        break;
    }
    return title;
  }

  public ngAfterViewInit(): void {
  }

  /**
   * 初始化区域选择器配置
   * param nodes
   */
  private initAreaSelectorConfig(nodes): void {
    this.areaSelectorConfig = {
      width: '500px',
      height: '300px',
      title: `${this.language.select}${this.language.area}`,
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
   * 处理设施是否能改
   */
  private modifyPermission(): void {
    this.formStatus.group.disable();
    this.formStatus.group.controls['deviceName'].enable();
    this.formStatus.group.controls['remarks'].enable();
    this.areaDisabled = true;
    this.positionDisabled = false;
  }

  /**
   * 获取当前用户有权限的设施类型
   * returns {any[]}
   */
  private getRoleDeviceType(): Array<{ label: string, code: string }> {
    // 从用户信息里面获取权限列表
    const userInfo = SessionUtil.getUserInfo();
    // 获取所有的设施类型
    const deviceType = getDeviceType(this.$nzI18n);
    let roleDeviceType = [];
    if (userInfo.role && userInfo.role.roleDevicetypeList) {
      // todo 添加假数据
      userInfo.role.roleDevicetypeList = userInfo.role.roleDevicetypeList.concat([{deviceTypeId: '002'}, {deviceTypeId: '003'}]);
      //  过滤有权限的设施类型
      roleDeviceType = deviceType.filter(item => {
        return (userInfo.role.roleDevicetypeList.findIndex(_item => item.code === _item.deviceTypeId) !== -1);
      });
    }
    return roleDeviceType;
  }


  /**
   * 自动生成名称
   */
  public getAutoName(): void {
    const data: FacilityDetailFormModel = this.formStatus.group.getRawValue();
    const cityName = this.cityInfo.city;
    const deviceType = 'wqerdfg';
    if (deviceType && cityName) {
      const param = {deviceName: `${cityName}${deviceType}`};
      this.$facilityService.getDeviceAutoName(param).subscribe((result: ResultModel<string>) => {
        const code = result.data;
        this.autoName = code;
        this.formStatus.resetControlData('deviceName', this.autoName);
      });
    } else {
      this.$modalService.warning('请先选择区域和设备类型');
    }

  }

  public autoNameChange(ev: string): void {
    this.autoName = ev;
    this.formStatus.resetControlData('deviceName', ev);
  }

  /**
   * 型号选择自动填写供应商和报废年限
   */
  public selectedModelChange(ev: string): void {
    this.formStatus.resetControlData('deviceModel', ev);
    if (this.getDetailByModel.length > 0) {
      this.getDetailByModel.forEach(item => {
        if (item.model === ev) {
          this.supplier = item.supplierName;
          this.scrapTime = item.scrapTime;
          this.formStatus.group.controls['supplier'].reset(item.supplierName);
          this.formStatus.group.controls['scrapTime'].reset(item.scrapTime);
        }
      });
    }
  }

  /**
   * 获取项目列表
   */
  private getProjectList(): Observable<object> {
    return this.$facilityService.getProjectList({});
  }

}
