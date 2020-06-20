import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {Router} from '@angular/router';
import {FilterCondition, QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {Result} from '../../../../shared-module/entity/result';
import {ResultModel} from '../../../../core-module/model/result.model';
import {InspectionService} from '../../../../core-module/api-service/work-order/inspection';
import {ExportParams} from '../../../../shared-module/entity/exportParams';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {
  WORK_ORDER_UNFINISHED_INSPECTION_NUMBER,
  WORK_ORDER_STATUS,
  WORK_ORDER_STATUS_CLASS,
  SEARCH_NUMBER
} from '../../../../shared-module/const/work-order';
import {Operate} from '../../work-order.config';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {InspectionTemplateModel} from '../../model/template/inspection-template.model';

/**
 * 巡检模板
 */
@Component({
  selector: 'app-inspection-template',
  templateUrl: './inspection-template.component.html',
  styleUrls: ['./inspection-template.component.scss']
})
export class InspectionTemplateComponent implements OnInit {
  // 公共语言国际化
  public commonLanguage: CommonLanguageInterface;
  // 选值范围
  public searchNumber = SEARCH_NUMBER;
  // 工单状态码
  public WorkOrder = WORK_ORDER_UNFINISHED_INSPECTION_NUMBER;
  // 模板数据
  public tableDataSet = [];
  // 分页
  public pageBean: PageBean = new PageBean(10, 1, 1);
  // 列表配置
  public tableConfig: TableConfig;
  // 导出
  public exportParams: ExportParams = new ExportParams();
  // 巡检模块国际化
  public InspectionLanguage: InspectionLanguageInterface;
  // 设施模块国际化
  public facilityLanguage: FacilityLanguageInterface;
  // 表格参数模型
  public queryCondition: QueryCondition = new QueryCondition();
  // 设施总数筛选默认等于
  public deviceCountSelectedValue = Operate.equal;
  // 设施总数
  public inspectionItemSize;
  // 获取责任人数据
  public roleArray = [];
  // 责任人
  @ViewChild('roleTemp') roleTemp: TemplateRef<any>;
  // 设施总数模板
  @ViewChild('deviceCountTemp') deviceCountTemp: TemplateRef<any>;
  constructor(
    private $nzI18n: NzI18nService,
    private $router: Router,
    private $inspection: InspectionService,
    public $message: FiLinkModalService,
  ) { }

  ngOnInit() {
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.InspectionLanguage = this.$nzI18n.getLocaleData('inspection');
    this.facilityLanguage = this.$nzI18n.getLocaleData('facility');
    this.initTableConfig();
    this.refreshData();
  }

  /**
   * 显示巡检完工记录列表数据
   */
  public refreshData() {
    // 别的页面跳转过来参数拼接
    this.tableConfig.isLoading = true;
    this.$inspection.queryInspectionTemplateList(this.queryCondition).subscribe((result: ResultModel<InspectionTemplateModel[]>) => {
      if (result.code === this.WorkOrder.ZERO) {
        this.pageBean.Total = result.totalCount;
        this.tableConfig.isLoading = false;
        const data = result.data ? result.data : [];
        data.forEach(item => {
          item.statusName = this.getStatusName(item.status);
          item.statusClass = this.getStatusClass(item.status);
          item.isShowTurnBackConfirmIcon = true;
        });
        this.tableDataSet = result.data;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
  /**
   * 完工记录分页
   */
  pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
  /**
   * 初始化表格
   */
  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '06-1-3',
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: true,
      scroll: {x: '1600px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {// 模板名称
          title: this.InspectionLanguage.workOrderName, key: 'templateName', width: 220,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchKey: 'templateName',
          searchConfig: {type: 'input'}
        },
        {// 巡检项数量
          title: this.InspectionLanguage.inspectionTotal, key: 'inspectionItemSize',
          configurable: false, width: 220,
          isShowSort: true,
          searchable: true,
          searchKey: 'inspectionItemSize',
          searchConfig: {
            type: 'render',
            renderTemplate: this.deviceCountTemp,
          }
        },
        {// 责任人
          title: this.InspectionLanguage.responsible, key: 'createUserName', width: 190,
          configurable: false,
          searchable: true,
          searchKey: 'createUserName',
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.roleArray, renderTemplate: this.roleTemp}
        },
        {// 完成时间
          title: this.InspectionLanguage.creationTime, key: 'createTime',
          pipe: 'date',
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchKey: 'createTime',
          searchConfig: {type: 'dateRang'}
        },
        {// 操作
          title: this.InspectionLanguage.operate, searchable: true, configurable: false,
          searchConfig: {type: 'operate'}, key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          text: '+  ' + this.InspectionLanguage.addArea,
          permissionCode: '06-1-1-1',
          handle: (currentIndex) => {
            this.addInspectionTemplate('add', null, 'add').then();
          }
        },
        {
          text: this.InspectionLanguage.delete,
          permissionCode: '06-1-1-3',
          btnType: 'danger',
          canDisabled: true,
          needConfirm: true,
          className: 'table-top-delete-btn',
          iconClassName: 'icon-delete',
          handle: (currentIndex) => {
            const arr = [];
            currentIndex.map(item => {
              arr.push(item.templateId);
            });
            this.deleteTemplate(arr);
          }
        },
      ],
      operation: [
        {
          // 编辑
          text: this.InspectionLanguage.edit,
          permissionCode: '06-1-3-2',
          className: 'fiLink-edit',
          handle: (currentIndex) => {
            this.addInspectionTemplate('update', currentIndex.templateId, 'update').then();
          }
        },
        {  // 删除
          text: this.InspectionLanguage.delete,
          permissionCode: '06-1-3-2',
          canDisabled: true,
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          key: 'isShowTurnBackConfirmIcon',
          confirmContent: this.InspectionLanguage.isDeleteTemplate,
          handle: (currentIndex) => {
            const id = currentIndex.templateId;
            const arr = [id];
            this.deleteTemplate(arr);
          }
        }
      ],
      sort: (event) => {
        this.handleSort(event);
        this.refreshData();
      },
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      handleExport: (event) => {
        this.exportParams.columnInfoList = event.columnInfoList;
        this.exportParams.columnInfoList.forEach(item => {
          if (item.propertyName === 'createTime' || item.propertyName === 'templateName' || item.propertyName === 'responsible') {
            item.isTranslation = 1;
          }
        });
        this.createExportParams(event);
        this.$inspection.completionRecordExport(this.exportParams).subscribe((result: Result) => {
          if (result.code === this.WorkOrder.ZERO) {
            this.$message.success(result.msg);
          } else {
            this.$message.error(result.msg);
          }
        }, () => {
        });
      },
      openTableSearch: (event) => {
        this.getAllUser();
      }
    };
  }

  /**
   * 删除模板
   */
  deleteTemplate(arr) {
    this.$inspection.deleteTemplate({'inspectionTemplateIdList': arr}).subscribe((result: Result) => {
      if (result.code === this.WorkOrder.ZERO) {
        this.$message.success(result.msg);
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
    });
  }
  /**
   *添加/修改路由跳转
   */
  addInspectionTemplate(type, procId?, status?) {
    return this.$router.navigate([`/business/work-order/inspection-template/template-detail/${type}`],
      {queryParams: {procId: procId, status: status}});
  }
  getStatusName(status) {
    return this.InspectionLanguage[WORK_ORDER_STATUS[status]];
  }
  /**
   * 排序
   * param event
   */
  handleSort(event) {
    this.queryCondition.sortCondition.sortField = event.sortField;
    this.queryCondition.sortCondition.sortRule = event.sortRule;
  }

  /**
   * 生成导出条件
   */
  createExportParams(event) {
    this.exportParams.queryCondition = this.queryCondition;
    if (event.selectItem.length > this.WorkOrder.ZERO) {
      this.exportParams.queryCondition.bizCondition.procIds = event.selectItem.map(item => item.procId);
    }
    this.exportParams.excelType = event.excelType;
  }
  /**
   * 工单类型小图标
   */
  getStatusClass(status) {
    return `iconfont icon-fiLink ${WORK_ORDER_STATUS_CLASS[status]}`;
  }

  /**
   * 设置设施总数输入值
   */
  setInputVal(value) {
    return value = value.replace(/\D/g, '');
  }
  /**
   * 获得所有的责任人
   */
  getAllUser() {
    this.$inspection.queryAllUser(null).subscribe((result: Result) => {
      const roleArr = result.data;
      if (roleArr) {
        roleArr.forEach(item => {
          this.roleArray.push({'label': item.userName, 'value': item.id});
        });
      }
    });
  }
}
