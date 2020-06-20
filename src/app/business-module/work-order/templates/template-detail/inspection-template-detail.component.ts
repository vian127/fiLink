import {Component, ɵLContext, ElementRef, TemplateRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {NzI18nService, NzModalService, NzInputDirective, NzTreeNode} from 'ng-zorro-antd';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {Result} from '../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityUtilService} from '../../../facility';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {InspectionService} from '../../../../core-module/api-service/work-order/inspection';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {UserService} from '../../../../core-module/api-service/user/user-manage';
import {ClearBarrierService} from '../../../../core-module/api-service/work-order/clear-barrier';
import {MapService} from '../../../../core-module/api-service/index/map';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {WORK_ORDER_UNFINISHED_INSPECTION_NUMBER} from '../../../../shared-module/const/work-order';
import {ResultModel} from '../../../../core-module/model/result.model';
import {InspectionTemplateModel} from '../../model/template/inspection-template.model';

@Component({
  selector: 'app-template-detail',
  templateUrl: './inspection-template-detail.component.html',
  styleUrls: ['./inspection-template-detail.component.scss']
})
export class InspectionTemplateDetailComponent implements OnInit {
  // 工单状态码
  public WorkOrder = WORK_ORDER_UNFINISHED_INSPECTION_NUMBER;
  // form表单配置
  public formColumn: FormItem[] = [];
  public formStatus: FormOperate;
  // 国际化
  public InspectionLanguage: InspectionLanguageInterface;
  public facilityLanguage: FacilityLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 工单ID
  public procId = null;
  // 页面标题
  public pageTitle: string;
  // 页面类型
  public pageType;
  // 是否可编辑
  public disabledIf: boolean = false;
  // 模板名称
  public templateName;
  // 列表初始加载图标
  public isLoading = false;
  // 巡检总数
  public inspectionTotal: number = 0;
  public inspectionCount;
  // 巡检项列表
  public listOfData: any[] = [];
  public i = 0;
  // 被编辑的id
  public editId: string | null;
  // 添加按钮
  public addBtnClass = false;
  // 巡检项表格
  @ViewChild('tempTable') tempTable: TemplateRef<any>;
  // 输入
  @ViewChild(NzInputDirective, { read: ElementRef }) inputElement: ElementRef;
  // @ts-ignore
  @HostListener('window:click', ['$event'])
  constructor(
    private $activatedRoute: ActivatedRoute,
    private $nzI18n: NzI18nService,
    private $modelService: NzModalService,
    private $facilityUtilService: FacilityUtilService,
    private $inspectionService: InspectionService,
    private $modalService: FiLinkModalService,
    private $userService: UserService,
    private $clearBarrierService: ClearBarrierService,
    private $ruleUtil: RuleUtil,
    private $mapService: MapService,
    private $router: Router,
    private $inspection: InspectionService,
  ) { }

  ngOnInit() {
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.InspectionLanguage = this.$nzI18n.getLocaleData('inspection');
    this.facilityLanguage = this.$nzI18n.getLocaleData('facility');
    this.getInspectionTotal();
    this.judgePageJump();
    this.listOfData = [];
  }

  /***
   * 获取巡检项最大数量
   */
  getInspectionTotal() {
    const id = 'count10';
    this.$inspection.getInspectionTotal(id).subscribe((result: Result) => {
      if (result.code === this.WorkOrder.ZERO) {
        this.inspectionCount = Math.floor(result.data.value);
        this.addBtnClass = true;
      }
    }, () => {
      this.addBtnClass = false;
    });
  }
  // 点击
  handleClick(e: MouseEvent): void {
    if (this.editId && this.inputElement && this.inputElement.nativeElement !== e.target) {
      this.editId = null;
    }
  }

  /**
   * 添加行
   */
  addRow(): void {
    if (!this.inspectionCount || !this.addBtnClass) {
      return;
    }
    if (this.listOfData.length >= this.inspectionCount) {
      this.$modalService.error(this.InspectionLanguage.inspectionMaxTotal + this.inspectionCount.toString());
      return;
    }
    this.listOfData = [
      ...this.listOfData,
      {
        templateId: CommonUtil.getUUid(),
        templateItemName: '',
        remark: '',
        option: this.facilityLanguage.deleteHandle
      }
    ];
    this.i++;
    this.formStatus.resetControlData('inspectionTotal', this.listOfData.length);
  }

  /**
   * 删除行
   */
  deleteRow(templateId: string): void {
    const modal = this.$modelService.confirm({
      nzTitle: this.InspectionLanguage.prompt,
      nzContent: this.InspectionLanguage.isDeleteTemplate,
      // nzOkType: 'danger',
      nzOkType: 'default',
      nzMaskClosable: false,
      nzOkText: this.commonLanguage.confirm,
      nzCancelText: this.commonLanguage.cancel,
      nzOnOk: () => {
        this.listOfData = this.listOfData.filter(d => d.templateId !== templateId);
        this.formStatus.resetControlData('inspectionTotal', this.listOfData.length);
      },
      nzOnCancel: () => { },
    });
  }

  /***
   * 开始编辑
   */
  startEdit(templateId: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.editId = templateId;
  }
  /**
   * 判断页面跳转
   */
  judgePageJump() {
    this.$activatedRoute.queryParams.subscribe(params => {
      this.pageType = params.status;
      if (params.procId && this.pageType === 'update') {
        this.procId = params.procId;
        this.$inspection.getTemplateInfo(this.procId).subscribe((result: ResultModel<InspectionTemplateModel>) => {
          if (result.code === this.WorkOrder.ZERO) {
            this.defaultData(result.data);
          }
        }, () => {
        });
      } else {
        this.disabledIf = false;
      }
      this.pageTitle = this.getPageTitle(this.pageType);
      this.initColumn();
    });
  }
  /**
   * 页面title切换
   */
  private getPageTitle(type): string {
    let title;
    switch (type) {
      case 'add':
        title = `${this.InspectionLanguage.addArea}` + ' ' + `${this.InspectionLanguage.inspectionTemplate}`;
        break;
      case 'update':
        title = `${this.InspectionLanguage.edit}` + ' ' + `${this.InspectionLanguage.inspectionTemplate}`;
        break;
    }
    return title;
  }
  /**
   * 初始化form表单
   */
  private initColumn() {
    this.formColumn = [
      { // 模板名称
        label: this.InspectionLanguage.templateName,
        key: 'templateName',
        type: 'input',
        width: 450,
        require: true,
        disabled: this.disabledIf,
        placeholder: this.InspectionLanguage.pleaseEnter,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$inspectionService.checkTemplateName(value, this.procId),
            res => res.code === 0)
        ],
        modelChange: (controls, event, key, formOperate) => {
          this.templateName = event;
        }
      },
      {// 巡检项
        label: this.InspectionLanguage.inspectionItem,
        key: 'templateItemName',
        type: 'custom',
        require: true,
        template: this.tempTable,
        rule: [],
        asyncRules: [],
      },
      {// 巡检项总数
        label: this.InspectionLanguage.inspectionTotal,
        key: 'inspectionTotal',
        type: 'input',
        width: 450,
        disabled: true,
        initialValue: '0',
        rule: [],
        asyncRules: [],
      }
    ];
    setTimeout(() => {
      this.formStatus.resetControlData('inspectionTotal', this.listOfData.length);
    }, 1000);
  }
  /**
   * 接受表单传进来的参数并赋值
   * param event
   */
  formInstance(event) {
    this.formStatus = event.instance;
  }
  /**
   * 表单提交按钮检查
   */
  confirmButtonIsGray() {
    const newDate = new Date();
    if (this.pageType === 'update') {
      return true;
    } else {
      if (this.templateName && this.listOfData.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  }
  /**
   * 添加/修改/
   */
  saveData() {
    const nowDate = new Date();
    this.isLoading = true;
    const data = this.formStatus.group.getRawValue();
    const newArr = [];
    if (!data.templateName || data.templateName === '') {
      this.$modalService.success(this.InspectionLanguage.hasNullValue);
    }
    this.listOfData.forEach((v, i) => {
      if (v.templateItemName && v.templateItemName.length > 0) {
        newArr.push({
          sort: '',
          templateItemName: v.templateItemName,
          remark: v.remark,
        });
      }
    });
    for (let i = 0; i < newArr.length; i++) {
      newArr[i].sort = (i + 1).toString();
    }
    const param = {
      templateName: data.templateName,
      inspectionTemplateItemList: newArr
    };
    if (this.pageType === 'add') {
      // 调用新增接口
      this.$inspection.addInspectionTemplate(param).subscribe((result: Result) => {
        if (result.code === this.WorkOrder.ZERO) {
          this.goBack();
          this.$modalService.success(result.msg);
        } else {
          this.$modalService.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    } else if (this.pageType === 'update') {
      param['templateId'] = this.procId;
      // 调用修改接口
      this.$inspectionService.updateTemplate(param).subscribe((result: Result) => {
        this.isLoading = false;
        if (result.code === this.WorkOrder.ZERO) {
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
  /**
   * 返回
   */
  goBack() {
    window.history.back();
  }

  /**
   * 获取初始值
   */
  defaultData(data) {
    this.formStatus.resetControlData('templateName', data['templateName']);
    this.formStatus.resetControlData('inspectionTotal', data['inspectionItemSize']);
    // this.listOfData = data.inspectionTemplateItemList;
    const arr = [];
    data.inspectionTemplateItemList.forEach(v => {
      arr.push({
        templateId: CommonUtil.getUUid(),
        templateItemName: v.templateItemName,
        remark: v.templateItemName,
        option: this.facilityLanguage.deleteHandle
      });
    });
    this.listOfData = arr;
  }
}
