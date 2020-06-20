import {Component, OnInit, ViewChild} from '@angular/core';
import {ColumnConfigService} from '../../column-config.service';
import {NzI18nService} from 'ng-zorro-antd';
import {BasicConfig} from '../../../basic-config';
import {SecurityPolicyService} from '../../../../core-module/api-service/system-setting/security-policy/security-policy.service';
import {Result} from '../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';


@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  styleUrls: ['./access-control.component.scss']
})
export class AccessControlComponent extends BasicConfig implements OnInit {
  // 状态模板
  @ViewChild('templateStatus') private templateStatus;
  // 分页参数设置
  public pageBean: PageBean = new PageBean(10, 1, 1);
  // 查询条件
  public  queryConditions: QueryCondition = new QueryCondition();
  // 新增修改是否显示
  public isVisible = false;
  // 当前访问控制信息
  public curIpInfo = {};
  // 新增修改title
  public title = this.language.systemSetting.addIPAddressRange;

  constructor(private $columnConfigService: ColumnConfigService,
              private $securityPolicyService: SecurityPolicyService,
              private $message: FiLinkModalService,
              public $nzI18n: NzI18nService) {
    super($nzI18n);
  }

  ngOnInit() {
    this.tableConfig = {
      primaryKey: '04-4-1',
      isDraggable: true,
      isLoading: false,
      showSizeChanger: true,
      showSearchSwitch: true,
      scroll: {x: '600px', y: '325px'},
      showPagination: true,
      columnConfig: this.$columnConfigService.getAccessControlColumnConfig(
        {statue: this.templateStatus}),
      bordered: false,
      showSearch: false,
      sort: (e) => {
        this.queryConditions.sortCondition = e;
        this.searchList();
      },
      handleSearch: (event) => {
        this.queryConditions.pageCondition.pageNum = 1;
        this.handleSearch(event);
      },
      topButtons: [
        {
          text: '+  ' + this.language.table.add,
          permissionCode: '04-4-1-1',
          handle: () => {
            this.curIpInfo = {};
            this.title = this.language.systemSetting.addIPAddressRange;
            this.isVisible = true;
          }
        }
        , {
          text: this.language.table.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          permissionCode: '04-4-1-3',
          needConfirm: true,
          canDisabled: true,
          iconClassName: 'fiLink-delete',
          handle: (data) => {
            const rangeIds = data.map(item => item.rangeId);
            this.delList(rangeIds);
          }
        }
      ],
      leftBottomButtons: [
        {
          text: this.language.systemSetting.allEnabled,
          btnType: 'danger',
          needConfirm: true,
          confirmContent: this.language.systemSetting.isItAllEnabled + '？',
          permissionCode: '04-4-1-4',
          handle: () => {
            this.updateAllRangesStatus({rangeStatus: '1'});
          }
        },
        {
          text: this.language.systemSetting.disableAll,
          btnType: 'danger',
          needConfirm: true,
          permissionCode: '04-4-1-4',
          confirmContent: this.language.systemSetting.isItAllDisabled + '？',
          handle: () => {
            this.updateAllRangesStatus({rangeStatus: '0'});
          }
        },
        {
          text: this.language.systemSetting.selectEnable,
          btnType: 'danger',
          permissionCode: '04-4-1-4',
          handle: (data) => {
            const rangeIds = data.map(item => item.rangeId);
            console.log(rangeIds);
            const sentData = {
              rangeIds: rangeIds,
              rangeStatus: '1'
            };
            this.rangeStatus(sentData);

          },
          canDisabled: true,
          className: 'small-button'
        },
        {
          text: this.language.systemSetting.prohibit,
          btnType: 'danger',
          permissionCode: '04-4-1-4',
          handle: (data) => {
            const rangeIds = data.map(item => item.rangeId);
            console.log(rangeIds);
            const sentData = {
              rangeIds: rangeIds,
              rangeStatus: '0'
            };
            this.rangeStatus(sentData);

          },
          canDisabled: true,
          className: 'small-button'
        }
      ],
      operation: [
        {
          text: this.language.facility.update,
          className: 'fiLink-edit',
          permissionCode: '04-4-1-2',
          handle: (current) => {
            this.title = this.language.systemSetting.modifyIPAddressRange;
            this.isVisible = true;
            this.curIpInfo = current;
          }
        },
        {
          text: this.language.table.delete,
          className: 'fiLink-delete red-icon',
          permissionCode: '04-4-1-3',
          needConfirm: true,
          handle: (current) => {
            this.delList([current.rangeId]);
          }
        }],
    };
    this.searchList();
  }

  pageChange(event) {
    this.queryConditions.pageCondition.pageNum = event.pageIndex;
    this.queryConditions.pageCondition.pageSize = event.pageSize;
    this.searchList();
  }

  /**
   * 新增修改取消按钮
   */
  detailCancel(item) {
    this.isVisible = false;
    // 取消则不重新查询
    if (item) {
      this.searchList();
    }
  }

  /**
   * 启用/禁用切换
   * param item
   */
  changeStatue(item) {
    const sentData = {
      rangeIds: [item.rangeId],
      rangeStatus: '1'
    };
    // 处理动画
    this._dataSet.forEach(obj => {
      if (obj.rangeId === item.rangeId) {
        obj.clicked = true;
      }
    });
    item.rangeStatus === '1' ? sentData.rangeStatus = '0' : sentData.rangeStatus = '1';
    this.$securityPolicyService.updateRangeStatus(sentData).subscribe((result: Result) => {
      if (result.code === 0) {
        this._dataSet.forEach(obj => {
          obj.clicked = false;
          if (obj.rangeId === item.rangeId) {
            obj.rangeStatus === '1' ? obj.rangeStatus = '0' : obj.rangeStatus = '1';
          }
        });
      } else {
        this.$message.error(result.msg);
        this.searchList();
      }
    });
  }

  /**
   * 查询控制列表
   */
  searchList() {
    this.tableConfig.isLoading = true;
    this.$securityPolicyService.queryRangesAll(this.queryConditions).subscribe((result: Result) => {
      this.tableConfig.isLoading = false;
      if (result.code === 0) {
        this._dataSet = result.data;
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
      }
    });
  }

  /**
   * 删除访问控制列表
   * param ids
   */
  delList(ids) {
    this.$securityPolicyService.deleteRanges(ids).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
        this.searchList();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 全部启用/禁用
   */
  updateAllRangesStatus(body) {
    this.$securityPolicyService.updateAllRangesStatus(body).subscribe((result: Result) => {
      if (result.code === 0) {
        this.searchList();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 批量启用/禁用
   */
  rangeStatus(body) {
    this.$securityPolicyService.updateRangeStatus(body).subscribe((result: Result) => {
      if (result.code === 0) {
        this.searchList();
      } else {
        this.$message.error(result.msg);
        this.searchList();
      }
    });
  }
}
