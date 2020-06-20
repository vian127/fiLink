import {Component, OnInit, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {ColumnConfigService} from '../column-config.service';
import {Router} from '@angular/router';
import {MenuManageService} from '../../../core-module/api-service/system-setting';
import {Result} from '../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {BasicConfig} from '../../basic-config';

@Component({
  selector: 'app-memu-management',
  templateUrl: './memu-management.component.html',
  styleUrls: ['./memu-management.component.scss']
})
export class MemuManagementComponent extends BasicConfig implements OnInit {
  // 模板状态
  @ViewChild('templateStatus') private templateStatus;

  constructor(public $nzI18n: NzI18nService,
              private $columnConfigService: ColumnConfigService,
              private $systemSettingService: MenuManageService,
              private $message: FiLinkModalService,
              private $router: Router) {
    super($nzI18n);
  }

  ngOnInit() {
    this.tableConfig = {
      primaryKey: '04-1-1',
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '700px', y: '325px'},
      columnConfig: this.$columnConfigService.getSystemSettingColumnConfig({templateStatus: this.templateStatus}),
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          text: '+  ' + this.language.table.add,
          permissionCode: '04-1-3',
          handle: () => {
            this.$router.navigate(['business/system/menu-add']).then();
          }
        }
        , {
          text: this.language.table.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '04-1-5',
          handle: (data) => {
            if (data.find(item => item.templateStatus === '1')) {
              this.$message.warning(this.language.systemSetting.openStateDisableDelect);
            } else {
              const ids = data.map(item => item.menuTemplateId);
              if (ids) {
                this.delTemplate(ids);
              }
            }
          }
        }
      ],
      operation: [
        {
          text: this.language.facility.update,
          className: 'fiLink-edit',
          permissionCode: '04-1-4',
          handle: (currentIndex) => {
            const menuTemplateId = currentIndex.menuTemplateId;
            this.$router.navigate([`/business/system/menu-update/${menuTemplateId}`]).then();
          }
        }, {
          text: this.language.table.delete,
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          permissionCode: '04-1-5',
          handle: (currentIndex) => {
            if (currentIndex.templateStatus === '1') {
              this.$message.warning(this.language.systemSetting.openStateDisableDelect);
            } else {
              this.delTemplate([currentIndex.menuTemplateId]);
            }
          }
        }],
      sort: (e) => {
        this.queryConditions.sortCondition = e;
        e.sortField = 'createTime';
        this.searchList();
      },
      handleSearch: (event) => {
        this.handleSearch(event);
      }
    };
    // 初始化查询菜单列表
    this.searchList();
  }

  /**
   * 查询菜单模板列表
   */
  searchList() {
    this.createQueryConditions();
    this.tableConfig.isLoading = true;
    this.$systemSettingService.queryListMenuTemplateByPage(this.queryConditions).subscribe((result: Result) => {
      this.tableConfig.isLoading = false;
      if (result.code === 0) {
        this._dataSet = result.data;
        this.pageBean.Total = result.totalCount;
      } else {
        // TODO 查询失败！
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 启用么个模板
   * param templateInfo
   */
  useTemplate(templateInfo) {
    if (templateInfo && templateInfo.menuTemplateId) {
      // 当前开关出现加载动画
      this._dataSet.forEach(item => {
        if (templateInfo.menuTemplateId === item.menuTemplateId) {
          item.clicked = true;
        }
      });
      this.$systemSettingService.openMenuTemplate(templateInfo.menuTemplateId).subscribe((result: Result) => {
        if (result.code === 0) {
          this.searchList();
        } else {
          // TODO 模板启用失败
        }
      });
    }
  }

  /**
   * 删除模板
   * param ids
   */
  delTemplate(ids) {
    this.$systemSettingService.deleteMenuTemplate(ids).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
        // 删除之后返回到第一页
        this.pageBean.pageIndex = 1;
        this.searchList();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 创建查询条件  主要是条件拼接
   */
  createQueryConditions() {
    this.queryConditions.pageCondition = {
      pageNum: this.pageBean.pageIndex,
      pageSize: this.pageBean.pageSize
    };
  }
}
