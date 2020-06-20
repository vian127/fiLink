import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FacilityService} from '../../../../core-module/api-service/facility/facility-manage';
import {ActivatedRoute} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {FilterCondition} from '../../../../shared-module/entity/queryCondition';
import {Result} from '../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';

/**
 * 回路新增、编辑组件
 */
@Component({
  selector: 'app-loop-detail',
  templateUrl: './loop-detail.component.html',
  styleUrls: ['./loop-detail.component.scss']
})

export class LoopDetailComponent implements OnInit, OnDestroy {
  // 控制对象模板
  @ViewChild('controlObjectTemp') private controlObjectTemp: TemplateRef<any>;
  // 所属配电箱模板
  @ViewChild('distributionBoxTemp') private distributionBoxTemp: TemplateRef<any>;
  // 关联设施模板
  @ViewChild('linkDeviceTemp') private linkDeviceTemp: TemplateRef<any>;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 表单配置
  public formColumn: FormItem[] = [];
  // 表单状态
  public formStatus: FormOperate;
  // 页面是否加载
  public pageLoading = false;
  // 页面类型 新增修改
  public pageType: string;
  // 页面标题
  public pageTitle: string;
  // 是否加载
  public isLoading: boolean = false;
  // 所属配电箱弹框是否展开
  public distributionBoxVisible: boolean = false;
  // 所属配电箱名称拼接
  public distributionBoxName: string;
  // 关联设施弹框是否显示
  public linkDeviceVisible: boolean = false;
  // 关联设施名称拼接
  public linkDeviceName: string;
  // 设施选择器是否显示
  public mapVisible: boolean = false;
  // 配电箱查询条件
  public distributionBoxFilter: FilterCondition[] = [];
  // 选中所属配电箱下的控制对象数据
  public controlObjectData: Array<any> = [];
  //  控制对象下拉选
  public controlObjectValue = [];
  // 控制对象名称
  public controlObjectName: string;


  constructor(
    private $nzI18n: NzI18nService,
    private $ruleUtil: RuleUtil,
    private $active: ActivatedRoute,
    private $facilityService: FacilityService,
    private $message: FiLinkModalService,
  ) {
  }

  /**
   * 初始化
   */
  ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData('facility');
    // 新增、编辑标识
    this.pageType = this.$active.snapshot.params.type;
    // 新增、编辑标题获取
    this.pageTitle = this.getPageTitle(this.pageType);
    if (this.pageType !== 'add') {

    } else {

    }
    this.initColumn();
    // 初始化配电箱的查询条件
    this.distributionBoxFilter = [{
      filterField: 'deviceType',
      filterValue: ['003'],
      operator: 'in'
    }];
  }

  /**
   * 销毁组件事件
   */
  public ngOnDestroy(): void {
    this.controlObjectTemp = null;
    this.distributionBoxTemp = null;
    this.linkDeviceTemp = null;
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
        title = `${this.language.addLoop}`;
        break;
      case 'update':
        title = `${this.language.editLoop}`;
        break;
    }
    return title;
  }


  /**
   * 所属配电箱按钮点击事件
   */
  public showDistributionBoxModal(): void {
    this.distributionBoxVisible = true;
  }

  /**
   *  选择所属配电箱列表弹框数据
   */
  public selectDataChange(event): void {
    if (!_.isEmpty(event)) {
      this.distributionBoxName = event[0].deviceName;
      // const deviceId = event[0].deviceId;
      const deviceId = 'iQw0wGLUoGMZmjuijai';
      // 获取配电箱下挂载设备数据
      this.$facilityService.queryMountEquipment({deviceId: deviceId})
        .subscribe((result: Result) => {
          if (!_.isEmpty(result.data)) {
            // 筛选出挂载设备中的集中控制器
            this.controlObjectData = result.data.filter(item => item.equipmentType === '003');
            this.controlObjectValue = [];
            this.controlObjectData.forEach(item => {
              this.controlObjectValue.push({label: item.equipmentName, value: item.equipmentId});
            });
          }
        });
    }
  }

  /**
   *  关联设施按钮点击事件
   */
  public showLinkDeviceModal(): void {
    this.linkDeviceVisible = true;
  }

  /**
   * 初始化表单配置
   */
  private initColumn(): void {
    this.formColumn = [
      { // 回路名称
        label: this.language.loopName,
        key: 'loopName',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          // this.$ruleUtil.getNameAsyncRule((value) => {
          //   return this.$facilityService.queryDeviceNameIsExist({deviceId: this.deviceId, deviceName: value});
          // }, (res) => {
          //   return res['data'];
          // })
        ]
      },
      { // 回路类型
        label: this.language.loopType,
        key: 'loopType',
        type: 'select',
        selectInfo: {
          data: [{label: '照明回路', code: '1'}, {label: '通信回路', code: '2'}, {label: '自定义', code: '3'}],
          label: 'label',
          value: 'code'
        },
        require: true,
        rule: [{required: true}], asyncRules: [],
        modelChange: (controls, $event, key) => {

        },
      },
      { // 所属配电箱
        label: this.language.distributionBox,
        key: 'distributionBoxId',
        type: 'custom',
        template: this.distributionBoxTemp,
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        modelChange: (controls, $event, key) => {

        },
      },
      { // 关联设施
        label: this.language.setDevice,
        key: 'deviceIds',
        type: 'custom',
        template: this.linkDeviceTemp,
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        modelChange: (controls, $event, key) => {
        },
      },
      // { // 控制对象
      //   label: this.language.controlledObject,
      //   key: 'object',
      //   type: 'custom',
      //   require: true,
      //   rule: [{required: true}],
      //   template: this.controlObjectTemp,
      //   asyncRules: [],
      //   modelChange: (controls, $event, key) => {
      //
      //   },
      // },
      { // 控制对象下拉框
        label: this.language.controlledObject,
        key: 'object',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        template: this.controlObjectTemp,
      },
      { // 备注
        label: this.language.remarks,
        key: 'remark',
        type: 'input',
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }

  /**
   * 表格实例化
   */
  public formInstance(event): void {
    this.formStatus = event.instance;
  }


  /**
   * 控制对象下拉选择
   */
  public onSelectedObjectChange(ev: string): void {
    alert('2');
  }


  /**
   * 关联设施选中数据
   */
  public selectLinkDeviceData(ev: Array<any>): void {
    console.log(ev);
  }


  /**
   * 新增或编辑
   */
  public addOrEditLoop(): void {

  }

  /**
   * 返回
   */
  public goBack(): void {
    window.history.go(-1);
  }

}
