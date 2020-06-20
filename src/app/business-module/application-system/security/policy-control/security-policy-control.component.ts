import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {Result} from '../../../../shared-module/entity/result';
import {OnlineLanguageInterface} from '../../../../../assets/i18n/online/online-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {ApplicationService} from '../../server';
import {execStatus, routerJump} from '../../model/const/const';
import {getPolicyType, getExecStatus} from '../../model/const/application.config';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';

@Component({
  selector: 'app-security-policy-control',
  templateUrl: './security-policy-control.component.html',
  styleUrls: ['./security-policy-control.component.scss']
})
export class SecurityPolicyControlComponent implements OnInit {
  _dataSet = [];
  pageBean: PageBean = new PageBean(10, 1, 1);
  tableConfig: TableConfig;
  language: OnlineLanguageInterface;
  @ViewChild('policyStatus') policyStatus: TemplateRef<any>;
  filterObject = {};
  roleArray: Array<any> = [];
  queryCondition: QueryCondition = new QueryCondition();

  constructor(
    public $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    public $router: Router,
    public $applicationService: ApplicationService,
  ) {
    this.language = this.$nzI18n.getLocaleData('online');
  }

  ngOnInit() {
    this.initTableConfig();
    this.refreshData();
  }

  pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig() {
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
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          title: '策略名称', key: 'strategyName', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          title: '策略类型', key: 'strategyType', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: '有效期', key: 'effectivePeriodTime', width: 250, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: '执行周期', key: 'execCron', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: this.roleArray
          }
        },
        {
          title: '执行状态', key: 'execStatus', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        {
          title: '创建时间', key: 'createTime', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: '申请人', key: 'applyUser', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: '备注', key: 'remark', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: '策略状态', key: 'strategyStatus', width: 100, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.policyStatus,
          searchConfig: {type: 'input'}
        },
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
          text: '+  ' + '新增',
          permissionCode: '03-1-2',
          handle: (data) => {
            this.openAddPolicyControl();
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
            this.deleteLightStrategy(data);
          }
        },
        {
          text: '启用',
          needConfirm: true,
          canDisabled: true,
          confirmContent: '确定启用?',
          handle: (data) => {
            this.lightingEnableStrategy(data);
          }
        },
        {
          text: '停用',
          needConfirm: true,
          canDisabled: true,
          confirmContent: '确定停用?',
          handle: (data) => {
            this.lightingDisableStrategy(data);
          }
        },
      ],
      operation: [
        {
          text: '查看详情',
          className: 'fiLink-view-detail',
          handle: (data) => {
            this.handPolicyDetails(data);
          },
        },
        {
          text: '编辑',
          className: 'fiLink-edit',
          handle: (data) => {
            this.handPolicyEdit(data);
          }
        },
        {
          text: '删除',
          className: 'fiLink-delete red-icon',
          needConfirm: true,
          confirmContent: '是否确认删除操作?',
          handle: (currentIndex) => {
            this.deleteLightStrategy(currentIndex);
          }
        }
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      }
    };
  }

  /**
   * 启用策略
   * @ param data
   */
  lightingEnableStrategy(data) {
    const isEnable = data.some(item => item.strategyStatus === true);
    if (isEnable) {
      this.$message.error('请选择禁用的数据!');
    } else {
      const params = {
        'strategyType': '1',
        'operation': '1',
        'strategyIds': data.map(item => item.strategyId)
      };
      this.enableOrDisableStrategy(params);
    }
  }

  /**
   * 禁用策略
   * @ param data
   */
  lightingDisableStrategy(data) {
    const isDisable = data.some(item => item.strategyStatus === false);
    if (isDisable) {
      this.$message.error('请选择启用的数据!');
    } else {
      const params = {
        'strategyType': '1',
        'operation': '2',
        'strategyIds': data.map(item => item.strategyId)
      };
      this.enableOrDisableStrategy(params);
    }
  }

  /**
   * 刷新表格数据
   */
  private refreshData() {
    this.tableConfig.isLoading = true;
    this.$applicationService.getLightingPolicyList(this.queryCondition).subscribe((result: Result) => {
      this.tableConfig.isLoading = false;
      this._dataSet = result.data;
      this._dataSet.forEach(item => {
        item.strategyType = getPolicyType(this.$nzI18n, item.strategyType);
        item.execStatus = getExecStatus(this.$nzI18n, item.execStatus);
        item.effectivePeriodTime = `${CommonUtil.dateFmt('yyyy-MM-dd hh:mm:ss', new Date(item.effectivePeriodStart))}
        -${CommonUtil.dateFmt('yyyy-MM-dd hh:mm:ss', new Date(item.effectivePeriodEnd))}`;
        item.createTime = `${CommonUtil.dateFmt('yyyy-MM-dd hh:mm:ss', new Date(item.createTime))}`;
        item.strategyStatus = item.strategyStatus === '1' ? true : false;
      });
      this.pageBean.Total = result.totalCount;
      this.pageBean.pageIndex = result.pageNum;
      this.pageBean.pageSize = result.size;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 启用禁用
   * @ param params
   */
  enableOrDisableStrategy(params) {
    this.$applicationService.enableOrDisableStrategy(params).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.success('请求成功！');
        this.refreshData();
      }
    }, () => {

    });
  }

  /**
   * 监听switch开关事件
   * @ param event
   */
  switchChange(data, event) {
    if (event) {
      const params = {
        'strategyType': '1',
        'operation': '1',
        'strategyIds': [data.strategyId]
      };
      this.enableOrDisableStrategy(params);
    } else {
      const params = {
        'strategyType': '1',
        'operation': '2',
        'strategyIds': [data.strategyId]
      };
      this.enableOrDisableStrategy(params);
    }
  }

  /**
   * 删除策略
   * @ param params
   */
  deleteLightStrategy(data) {
    let params = [];
    if (data && data.strategyId) {
      params = [data.strategyId];
    } else {
      data.forEach(item => {
        params.push(item.strategyId);
      });
    }
    this.$applicationService.deleteLightStrategy(params).subscribe((result: Result) => {
      if (result.code === 0) {
        this.refreshData();
      }
    }, () => {

    });
  }

  /**
   * 跳转到新增页面
   */
  public openAddPolicyControl() {
    this.$router.navigate([routerJump.SECURITY_POLICY_CONTROL_ADD], {}).then();
  }

  /**
   * 跳转到详情位置
   */
  public handPolicyDetails(data) {
    this.$router.navigate([`${routerJump.SECURITY_POLICY_CONTROL_DETAILS}/${data.strategyId}`], {}).then();
  }

  /**
   * 跳转到编辑页面
   */
  public handPolicyEdit(data) {
    this.$router.navigate([`${routerJump.SECURITY_POLICY_CONTROL_EDIT}`], {
      queryParams: {
        id: data.strategyId
      }
    }).then();
  }
}
