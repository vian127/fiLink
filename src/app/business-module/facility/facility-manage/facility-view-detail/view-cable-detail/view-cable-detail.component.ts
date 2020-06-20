import {Component, OnInit} from '@angular/core';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-opearte.service';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {ActivatedRoute, Router} from '@angular/router';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {Result} from '../../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityService} from '../../../../../core-module/api-service/facility/facility-manage';
import {TreeSelectorConfig} from '../../../../../shared-module/entity/treeSelectorConfig';
import {FacilityUtilService} from '../../../share/service/facility-util.service';
import {getCableLevel, getTopologyName, getWiringType} from '../../../share/const/facility.config';
import {operateTypeConst} from '../../../share/const/facility-common.const';

/**
 * 光缆列表新增、编辑组件
 */
@Component({
  selector: 'app-view-cable-detail',
  templateUrl: './view-cable-detail.component.html',
  styleUrls: ['./view-cable-detail.component.scss']
})

export class ViewCableDetailComponent implements OnInit {
  // 引入设施国际化
  public language: FacilityLanguageInterface;
  // 本地网代码初始化
  public treeSelectorConfig = new TreeSelectorConfig();
  // 表单项
  public formColumn: FormItem[] = [];
  // 表单操作
  public formStatus: FormOperate;
  // 页面标题
  public pageTitle: string;
  // 加载
  public pageLoading = false;
  // 是否加载
  public isLoading = false;
  // 新增或编辑页面
  public pageType: string = operateTypeConst.add;
  // 光缆id
  public opticCableId: string;
  // 光缆名称value值
  public opticCableName: string;
  // 光缆级别value值
  public opticCableLevel: string;
  // 光缆拓扑结构value值
  public topology: string;
  // 布线类型value值
  public wiringType: string;
  // 光缆芯数value值
  public coreNum: string;
  // 判断是否可修改项
  public disabledIf: boolean;
  // 是否是编辑
  public updateStatus: boolean;
  // 表单占位符
  public prompt: string;

  constructor(
    public $activatedRoute: ActivatedRoute,
    public $nzI18n: NzI18nService,
    public $modalService: FiLinkModalService,
    public $router: Router,
    public $facilityService: FacilityService,
    public $facilityUtilService: FacilityUtilService,
    public $ruleUtil: RuleUtil,
  ) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.judgePageJump();
    this.initColumn();
  }

  /**
   * 表单状态
   */
  public formInstance(event): void {
    this.formStatus = event.instance;
  }

  /**
   * 页面切换 新增/修改
   */
  public judgePageJump(): void {
    this.pageType = this.$activatedRoute.snapshot.params.type;
    this.pageTitle = this.getPageTitle(this.pageType);
    if (this.pageType !== operateTypeConst.add) {
      this.prompt = ' ';
      this.disabledIf = true;
      this.$activatedRoute.queryParams.subscribe(params => {
        this.opticCableId = params.id;
        this.getUpdateCable(this.opticCableId);
      });
    } else {
    }
  }

  /**
   * 获取页面标题类型
   * param type
   * returns {string}
   */
  public getPageTitle(type): string {
    let title;
    switch (type) {
      case operateTypeConst.add:
        title = `${this.language.addArea}${this.language.cable}`;
        break;
      case operateTypeConst.update:
        title = `${this.language.modify}${this.language.cable}`;
        break;
    }
    return title;
  }

  /**
   * 新增和编辑光缆信息
   * param event
   */
  public cableDetail(): void {
    const data = this.formStatus.group.getRawValue();
    if (this.pageType === operateTypeConst.add) {
      this.$facilityService.addCable(data).subscribe((result: Result) => {
        this.isLoading = false;
        if (result.code === 0) {
          window.history.go(-1);
          this.$modalService.success(result.msg);
        } else {
          this.$modalService.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    } else if (this.pageType === operateTypeConst.update) {
      data.opticCableId = this.opticCableId;
      this.$facilityService.updateCable(data).subscribe((result: Result) => {
        this.isLoading = false;
        if (result.code === 0) {
          window.history.go(-1);
          this.$modalService.success(result.msg);
        } else {
          this.$modalService.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    }
  }

  /**
   * 根据id查询光缆信息
   * param id
   */
  public getUpdateCable(id: string): void {
    this.updateStatus = true;
    this.$facilityService.queryCableById(id).subscribe((result: Result) => {
      this.formStatus.resetData(result.data);
    });
  }

  /**
   * 取消后退
   */
  public goBack(): void {
    window.history.go(-1);
  }

  /**
   * 表单初始化
   */
  public initColumn(): void {
    this.formColumn = [
      { // 光缆名称
        label: this.language.cableName,
        key: 'opticCableName',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$facilityService.checkCableName(value,
            this.updateStatus ? this.opticCableId : null),
            res => res.code === 0)
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        modelChange: (controls, event, key, formOperate) => {
          this.opticCableName = event;
        }
      },
      { // 光缆级别
        label: this.language.cableLevel,
        key: 'opticCableLevel',
        require: true,
        type: 'select',
        disabled: this.disabledIf,
        selectInfo: {
          data: getCableLevel(this.$nzI18n),
          label: 'label',
          value: 'code',
        },
        rule: [{required: true}],
        modelChange: (controls, event, key, formOperate) => {
          this.opticCableLevel = event;
        }
      },
      { // 本地网代码
        label: this.language.localNetworkCode,
        key: 'localCode',
        type: 'input',
        require: false,
        rule: [{maxLength: 64}],
      },
      { // 光缆拓扑结构
        label: this.language.cableTopology,
        key: 'topology',
        disabled: this.disabledIf,
        type: 'select',
        require: true,
        selectInfo: {
          data: getTopologyName(this.$nzI18n),
          label: 'label',
          value: 'code',
        },
        rule: [{required: true}],
        modelChange: (controls, event, key, formOperate) => {
          this.topology = event;
        }
      },
      { // 布线类型
        label: this.language.wiringType,
        key: 'wiringType',
        require: true,
        disabled: this.disabledIf,
        type: 'select',
        selectInfo: {
          data: getWiringType(this.$nzI18n),
          label: 'label',
          value: 'code',
        },
        rule: [{required: true}],
        modelChange: (controls, event, key, formOperate) => {
          this.wiringType = event;
        }
      },
      { // 光缆芯数
        label: this.language.numberOfOpticalCores,
        key: 'coreNum',
        type: 'input',
        disabled: this.disabledIf,
        require: true,
        rule: [
          {required: true},
          this.$ruleUtil.getCoreNumRule()
        ],
        modelChange: (controls, event) => {
          this.coreNum = event;
        }
      },
      { // 业务信息
        label: this.language.businessInformation,
        key: 'bizId',
        type: 'input',
        placeholder: this.prompt,
        require: false,
        disabled: this.disabledIf,
        rule: [{maxLength: 255}],
      },
      { // 备注
        label: this.language.remarks,
        key: 'remark',
        type: 'input',
        placeholder: this.prompt,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }
}
