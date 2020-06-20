import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {Result} from '../../../../shared-module/entity/result';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FacilityService} from '../../../../core-module/api-service/facility/facility-manage';
import {FilterCondition, QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {getSimPackageType} from '../../share/const/facility.config';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {LockService} from '../../../../core-module/api-service/lock';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';

/**
 * 设施列表组件
 */
@Component({
  selector: 'app-control-list',
  templateUrl: './control-list.component.html',
  styleUrls: ['./control-list.component.scss']
})

export class ControlListComponent implements OnInit {
  // 自定义模板
  @ViewChild('simPackageTypeTemp') private simPackageTypeTemp: TemplateRef<Element>;
  // 列表数据 todo 定义模型 ControlModel
  public dataSet = [];
  // 列表分页实体
  public pageBean: PageBean = new PageBean();
  // 列表配置
  public tableConfig: TableConfig;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 首页语言包
  public indexLanguage: IndexLanguageInterface;
  // 列表查询条件
  public queryCondition: QueryCondition = new QueryCondition();
  // 表单配置
  public formColumn: Array<FormItem> = [];
  // 表单状态
  public formStatus: FormOperate;
  // 套餐编辑弹窗
  public isVisible = false;
  // 保存按钮加载
  public isLoading = false;
  // hostId集合
  public hostIds: Array<string>;

  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $modal: NzModalService,
              private $lockService: LockService,
              private $facilityService: FacilityService) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.indexLanguage = this.$nzI18n.getLocaleData('index');
    this.initTableConfig();
    this.refreshData();
    // 初始化表单配置
    this.initForm();
  }

  public pageChange(event: PageBean): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 刷新表格数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$facilityService.getControlByPackage(this.queryCondition).subscribe((result: Result) => {
      this.tableConfig.isLoading = false;
      if (result.code === 0) {
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.dataSet = result.data || [];
        this.dataSet.forEach(item => {
          item._simPackage = item.simPackage;
          item.simPackage = getSimPackageType(this.$nzI18n, item.simPackage.toString());
        });
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      primaryKey: '03-7',
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
        {
          title: this.language.iccid, key: 'iccid',
          width: 280,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          title: this.language.simPackage, key: 'simPackage',
          width: 200,
          configurable: true,
          isShowSort: true,
          searchable: true,
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
          renderTemplate: this.simPackageTypeTemp,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: getSimPackageType(this.$nzI18n), label: 'label', value: 'code'}

        },
        {
          title: this.language.deviceId, key: 'deviceId',
          width: 280,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          title: this.language.hostId, key: 'hostId',
          width: 280,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          title: this.language.currentTime, key: 'currentTime',
          width: 200,
          pipe: 'date',
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'currentTime',
          searchConfig: {type: 'dateRang'}
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 180, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [
        {
          text: this.language.updatePackage,
          className: 'fiLink-edit',
          handle: (currentIndex) => {
            this.hostIds = [currentIndex.hostId];
            this.openPackageModal();
          }
        },
      ],
      leftBottomButtons: [
        {
          text: this.language.updatePackage,
          handle: (data) => {
            this.hostIds = data.map(item => item.hostId);
            this.tableConfig.isLoading = true;
            this.openPackageModal();
          },
          canDisabled: true,
          className: 'small-button'
        },
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      // todo 此处参数待确定
      handleExport: (event) => {
        // 处理参数
        const body = {
          queryCondition: new QueryCondition(),
          columnInfoList: event.columnInfoList,
          excelType: event.excelType
        };
        // 处理选择的项目
        if (event.selectItem.length > 0) {
          const ids = event.selectItem.map(item => item.hostId);
          const filter = new FilterCondition('hostId');
          filter.filterValue = ids;
          filter.operator = 'in';
          body.queryCondition.filterConditions.push(filter);
        } else {
          // 处理查询条件
          body.queryCondition.filterConditions = event.queryTerm;
        }
        this.$facilityService.expertControl(body).subscribe((res: Result) => {
          if (res.code === 0) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    };
  }

  // 变更套餐
  private updateSimPackage(params: {
    hostIds: Array<string>,
    simPackage: string
  }): void {
    this.$facilityService.updateSimPackage(params).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
        this.isVisible = false;
        this.hostIds = [];
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  private handleUpdate(): void {
    const formData = this.formStatus.getData();
    const params = {
      hostIds: this.hostIds,
      simPackage: formData.simPackage
    };
    if (!params.simPackage) {
      this.$message.info(this.language.pleaseSelectSimPackage);
    } else {
      this.updateSimPackage(params);
    }
  }

  /**
   * 初始化表单
   */
  public initForm(): void {
    this.formColumn = [
      {
        label: this.language.simPackage,
        key: 'simPackage',
        type: 'radio',
        require: false,
        col: 24,
        radioInfo: {
          data: [
            {label: this.language.config.One_Year, value: 1},
            {label: this.language.config.Three_Year, value: 3},
            {label: this.language.config.Five_Year, value: 5},
          ],
          label: 'label',
          value: 'value'
        },
        rule: [],
        asyncRules: []
      },
    ];
  }

  /**
   * 取消修改
   */
  public editHandleCancel(): void {
    this.hostIds = [];
    this.isVisible = false;
    this.refreshData();
  }

  /**
   * 编辑表单实例
   * param event
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
  }

  public openPackageModal(): void {
    this.isVisible = true;
    this.formStatus.resetControlData('simPackage', '');
  }
}
