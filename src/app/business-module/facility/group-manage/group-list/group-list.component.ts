import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {GroupApiService} from '../../share/service/group/group-api.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {AssetManagementLanguageInterface} from '../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {FilterCondition, QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {GroupListModel} from '../../../../core-module/model/group-list.model';

/**
 * 分组列表组件
 */
@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  // 分组列表数据集
  public dataSet: GroupListModel[] = [];
  // 分组分页
  public pageBean: PageBean = new PageBean();
  // 列表配置信息
  public tableConfig: TableConfig = new TableConfig();
  // 列表查询条件
  public queryCondition: QueryCondition = new QueryCondition();
  // 国际化
  public language: FacilityLanguageInterface;
  // 公用国际化
  public commonLanguage: CommonLanguageInterface;
  // 资产管理国际化
  public assetLanguage: AssetManagementLanguageInterface;
  // 是否显示分组详情的弹框
  public showGroupViewDetail: boolean = false;
  // 是否显示分组控制弹框
  public showGroupControlView: boolean = false;
  // 当前分组数据
  public currentGroup: GroupListModel = new GroupListModel();

  /**
   * 构造器
   */
  constructor(private $nzI18n: NzI18nService,
              private $groupApiService: GroupApiService,
              private $message: FiLinkModalService,
              private $router: Router) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.assetLanguage = this.$nzI18n.getLocaleData('assets');
    // 初始化表格
    this.initGroupTableConfig();
    // 刷新列表数据
    this.refreshData();
  }

  /**
   *  切换页面
   */
  public pageChange(event: PageBean): void {
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.refreshData();
  }

  /**
   * 路由跳转
   */
  private routingJump(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

  /**
   * 初始化列表参数
   */
  private initGroupTableConfig(): void {
    this.tableConfig = {
      primaryKey: '03-1',
      isDraggable: false,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: false,
      notShowPrint: true,
      scroll: {x: '1200px', y: '600px'},
      noIndex: false,
      showSearchExport: false,
      columnConfig: [
        { // 选择
          title: this.language.select,
          type: 'select',
          fixedStyle: {
            fixedLeft: true,
            style: {left: '0px'}
          },
          width: 62
        },
        { // 分组名称
          title: this.language.groupName,
          key: 'groupName',
          width: 500,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 备注
          title: this.language.remarks,
          key: 'remark',
          isShowSort: true,
          configurable: false,
          width: 500,
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        { // 操作
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        }
      ],
      topButtons: [
        {
          text: `+  ${this.language.add}`,
          permissionCode: '03-1-2',
          handle: () => {
            this.routingJump('business/facility/group-detail/add', {});
          }
        },
        {
          text: this.commonLanguage.deleteBtn,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '03-1-4',
          needConfirm: true,
          canDisabled: false,
          confirmContent: this.language.confirmDeleteData,
          handle: (data: GroupListModel[]) => {
            const ids = data.map(item => {
              return item.groupId;
            });
            this.handelDeleteGroup(ids);
          }
        }
      ],
      leftBottomButtons: [],
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [
        { // 编辑
          permissionCode: '03-1-3',
          text: this.commonLanguage.edit, className: 'fiLink-edit',
          handle: (data: GroupListModel) => {
            this.routingJump('business/facility/group-detail/update',
              {queryParams: {groupId: data.groupId}});
          },
        },
        { // 分组详情
          permissionCode: '03-1-5',
          text: this.language.groupDetail, className: 'fiLink-view-detail',
          handle: (data: GroupListModel) => {
            this.currentGroup = data;
            this.showGroupViewDetail = true;
          },
        },
        { // 控制
          permissionCode: '03-1-5',
          text: this.language.control, className: 'fiLink-control',
          handle: (data: GroupListModel) => {
            this.currentGroup = data;
            this.showGroupControlView = true;
          },
        },
        { // 删除
          permissionCode: '03-1-5',
          text: this.commonLanguage.deleteBtn, className: 'fiLink-delete red-icon',
          needConfirm: true,
          handle: (data: GroupListModel) => {
            const ids = [data.groupId];
            this.handelDeleteGroup(ids);
          }
        },
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 过滤查询
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      }
    };
  }


  /**
   *  处理删除数据
   */
  private handelDeleteGroup(groupList: string[]): void {
    this.$groupApiService.delGroupInfByIds(groupList).subscribe((res: ResultModel<GroupListModel>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(res.msg);
        this.refreshData();
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 刷新列表数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$groupApiService.queryGroupInfoList(this.queryCondition).subscribe(
      (result: ResultModel<GroupListModel[]>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.dataSet = result.data;
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }
}
