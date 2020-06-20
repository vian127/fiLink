import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {UserService} from '../../../../core-module/api-service/user/user-manage';
import {InformationDeliveryLanguageInterface} from '../../../../../assets/i18n/informationDelivery/informationDelivery-language.interface';
import {ApplicationService} from '../../server';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ClearWorkOrderModel} from '../../../index/shared/model/work-order-condition.model';

/**
 * 内容列表页面
 */
@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss']
})
export class ContentListComponent implements OnInit {
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
  private language: InformationDeliveryLanguageInterface;
  /**
   * 列表查询参数
   */
  private queryCondition: QueryCondition = new QueryCondition();
  /**
   * 预览模态框
   */
  public isPreview: boolean = false;
  /**
   * 发起审核模态框
   */
  public isToExamine: boolean = false;
  /**
   * 文件路径
   */
  public filePath: string = '';
  /**
   * 审核人绑定值
   */
  public reviewedBy: any;
  /**
   * 审核人列表
   */
  public reviewedByArr: any = [];
  /**
   * 单行数据
   */
  private rowData: any;

  /**
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
    this.language = this.$nzI18n.getLocaleData('informationDelivery');
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
        // 节目名称
        {
          title: this.language.programName, key: 'programName', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          title: this.language.state, key: 'programStatus', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.programPurpose, key: 'programPurpose', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.duration, key: 'duration', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.format, key: 'mode', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.resolvingPower, key: 'resolution', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.applicant, key: 'applyUser', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.addBy, key: 'addUser', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.addTime, key: 'createTime', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'date'}
        },
        {
          title: this.language.checker, key: 'reviewedUser', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.auditTime, key: 'reviewedTime', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'date'},
        },
        {
          title: this.language.programFiles, key: 'programmeFileName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.remarks, key: 'remark', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 180, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [
        {
          text: '+  ' + '新增',
          permissionCode: '03-1-2',
          handle: () => {
            this.openContent('add');
          }
        },
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
            const programIdList = [];
            for (const i of data) {
              programIdList.push(i.programId);
            }
            this.deleteReleaseContentList(programIdList);
          }
        },
        {
          text: '启用',
          needConfirm: true,
          canDisabled: true,
          confirmContent: '确定启用?',
          handle: (data) => {
            /*  const programIds = [];
              for (const i of data) {
                programIds.push(i.programId);
              }*/
            const programIds = data.map(item => {
              return item.programId;
            });
            this.updateReleaseContentState(programIds, '0');
          }
        },
        {
          text: '停用',
          needConfirm: true,
          canDisabled: true,
          confirmContent: '确定停用?',
          handle: (data) => {
            const programIds = [];
            for (const i of data) {
              programIds.push(i.programId);
            }
            this.updateReleaseContentState(programIds, '1');
          }
        },
      ],
      operation: [
        {
          text: '编辑',
          className: 'fiLink-lost',
          handle: (data) => {
            this.openContent('update', data.programId);
          },
        },
        {
          text: '删除',
          className: 'fiLink-lost',
          needConfirm: true,
          confirmContent: '是否确认删除操作?',
          handle: (data) => {
            const programIdList = [];
            programIdList.push(data.programId);
            this.deleteReleaseContentList(programIdList);
          }
        },
        {
          text: '预览',
          className: 'fiLink-lost',
          handle: (data) => {
            this.preview(data);
          }
        },
        {
          text: '启用',
          className: 'fiLink-lost',
          needConfirm: true,
          confirmContent: '是否确认启用?',
          handle: (data) => {
            const programIds = [];
            programIds.push(data.programId);
            this.updateReleaseContentState(programIds, '0');
          }
        },
        {
          text: '停用',
          className: 'fiLink-lost',
          needConfirm: true,
          confirmContent: '是否确认启用?',
          handle: (data) => {
            const programIds = [];
            programIds.push(data.programId);
            this.updateReleaseContentState(programIds, '1');
          }
        },
        {
          text: '发起审核',
          className: 'fiLink-lost',
          handle: (data) => {
            this.rowData = data;
            this.toExamine();
          }
        },
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
  private refreshData() {
    this.tableConfig.isLoading = true;
    this.$applicationService.getReleaseContentList(this.queryCondition)
      .subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
        this.tableConfig.isLoading = false;
        this.dataSet = result.data;
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;

        this.dataSet.forEach(item => {
          item.reviewedTime = CommonUtil.dateFmt('yyyy-MM-dd', new Date(item.reviewedTime));
          item.createTime = CommonUtil.dateFmt('yyyy-MM-dd', new Date(item.createTime));
        });

      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

  /**
   * 跳转到新增/编辑页面
   * @param type 跳转类型
   * @param programId 节目ID
   */
  public openContent(type: any, programId?: any) {
    this.$router.navigate([`business/application/release/content-list/${type}`], {
      queryParams: {programId: programId}
    }).then();
  }

  /**
   * 删除列表内容
   * @param programIdList programId集合
   */
  public deleteReleaseContentList(programIdList: any) {
    this.$applicationService.deleteReleaseContentList({programIdList: programIdList})
      .subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
        console.log(result);
        this.refreshData();
      }, () => {
      });
  }

  /**
   * 更新列表状态
   * @param programIds programId集合
   * @param programStatus 状态码 0：启用 1：禁用
   */
  public updateReleaseContentState(programIds: any, programStatus: any) {
    this.$applicationService.updateReleaseContentState({programIds: programIds, programStatus: programStatus})
      .subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
        console.log(result);
        this.refreshData();
      }, () => {
      });
  }

  /**
   * 预览
   * @param data 内容信息
   */
  public preview(data: any) {
    this.isPreview = true;
    // 实际路径是 programPath（路径） +  programFileName（名字） 拼接的
    this.filePath = `${data.programPath}/${data.programFileName}`;
    this.filePath = this.filePath.replace(/\\/g, '/');
    console.log(this.filePath);
  }

  /**
   * 取消预览
   */
  public onPreviewCancel() {
    this.isPreview = false;
    // 预览路径置空
    this.filePath = '';
  }

  /**
   * 预览确定
   */
  public onPreviewOk() {
    this.isPreview = false;
    // 预览路径置空
    this.filePath = '';
  }

  /**
   * 发起审核
   */
  public toExamine() {
    this.isToExamine = true;
    // todo 暂无接口 moke数据
    this.reviewedByArr = [
      {
        id: '0',
        name: 'Jack'
      },
      {
        id: '1',
        name: 'Lucy'
      },
      {
        id: '2',
        name: 'Tom'
      }
    ];
    this.reviewedBy = this.reviewedByArr[0].id;
  }

  /**
   * 取消发起审核
   */
  public onToExamineCancel() {
    this.isToExamine = false;
  }

  /**
   * 发起审核确定
   */
  public onToExamineOk() {
    this.isToExamine = false;
    const object = {
      reviewedUser: this.reviewedBy,
      programId: this.rowData.programId
    };
    this.$applicationService.addReleaseWorkProgram(object)
      .subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
        console.log(result);
        this.refreshData();
      }, () => {
      });
  }
}
