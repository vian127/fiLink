import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {Result} from '../../../../shared-module/entity/result';
import {UserService} from '../../../../core-module/api-service/user/user-manage';
import {OnlineLanguageInterface} from '../../../../../assets/i18n/online/online-language.interface';
import {ApplicationService} from '../../server';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ClearWorkOrderModel} from '../../../index/shared/model/work-order-condition.model';

/**
 * 审核列表页面
 */
@Component({
  selector: 'app-content-examine',
  templateUrl: './content-examine.component.html',
  styleUrls: ['./content-examine.component.scss']
})
export class ContentExamineComponent implements OnInit {
  /**
   * 列表数据
   */
  public dataSet = [];
  /**
   * 分页初始设置
   */
  public pageBean: PageBean = new PageBean(10, 1, 1);
  /**
   * 列表配置
   */
  public tableConfig: TableConfig;
  /**
   * 国际化
   */
  private language: OnlineLanguageInterface;
  /**
   * 列表查询参数
   */
  private queryCondition: QueryCondition = new QueryCondition();

  /**
   *
   * @param $nzI18n  国际化服务
   * @param $router  路由跳转服务
   * @param $userService  操作用户后台接口服务
   * @param $applicationService  应用系统后台接口服务
   */
  constructor(
    public $nzI18n: NzI18nService,
    public $router: Router,
    public $userService: UserService,
    public $applicationService: ApplicationService
  ) {
    this.language = this.$nzI18n.getLocaleData('online');
  }

  ngOnInit(): void {
    this.initTableConfig();
    this.refreshData();
  }

  public pageChange(event): void {
    console.log(event);
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        // 序号
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        // 工单名称
        {
          title: '工单名称', key: 'workOrderName', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        // 责任人
        {
          title: '责任人', key: 'personLiable', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 工单状态
        {
          title: '工单状态', key: 'workOrderStatus', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 期望完工时间
        {
          title: '期望完工时间', key: 'expectCompTime', width: 150, isShowSort: true, pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // 实际完工时间
        {
          title: '实际完工时间', key: 'actualCompTime', width: 180, isShowSort: true, pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // 创建时间
        {
          title: '创建时间', key: 'createTime', width: 150, isShowSort: true, pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // 审核意见
        {
          title: '审核意见', key: 'examineAdvise', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 审核内容
        {
          title: '审核内容', key: 'examineText', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        // 转派原因
        {
          title: '转派原因', key: 'transferReason', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 退单原因
        {
          title: '退单原因', key: 'causeReason', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 备注
        {
          title: '备注', key: 'remark', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 操作
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [
        {
          text: '删除',
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '03-1-4',
          needConfirm: true,
          canDisabled: true,
          confirmContent: '确定删除?',
          handle: (data) => {
            console.log(data);
            // 遍历data 将data中的programId push到集合中
            const workOrderIds = data.map(item => {
              return item.workOrderId;
            });
            this.workOrderApproval(workOrderIds);
          }
        }
      ],
      operation: [
        {
          text: '查看详情',
          className: 'fiLink-view-detail',
          handle: (data) => {
            this.workOrderDetails(data.workOrderId);
          },
        },
        {
          text: '删除',
          className: 'fiLink-lost',
          needConfirm: true,
          confirmContent: '是否确认删除操作?',
          handle: (data) => {
            this.workOrderApproval(data.workOrderId);
          }
        }
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.refreshData();
      },
      handleSearch: (event) => {
        this.queryCondition.filterConditions = event;
        this.refreshData();
      }
    };
  }


  /**
   * 刷新表格数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$applicationService.getReleaseProgramWorkList(this.queryCondition)
      .subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
      this.tableConfig.isLoading = false;
      this.dataSet = result.data;
      this.pageBean.Total = result.totalCount;
      this.pageBean.pageIndex = result.pageNum;
      this.pageBean.pageSize = result.size;
      console.log(this.dataSet);
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }


  /**
   * 列表删除方法
   * @param workOrderIds 工单ID数组
   */
  private workOrderApproval(workOrderIds: any): void {
    const object = {
      workOrderId: workOrderIds,
      actType: 0
    };
    this.$applicationService.releaseWorkOrder(object).subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
      if (result.code === '00000') {
        this.refreshData();
      }
    }, () => {

    });
  }

  /**
   * 跳转到详情页面
   * @param workOrderId 工单ID
   */
  private workOrderDetails(workOrderId: any): void {
    this.$router.navigate(['business/application/release/content-examine/details'], {
      queryParams: {workOrderId: workOrderId}
    }).then();
  }
}
