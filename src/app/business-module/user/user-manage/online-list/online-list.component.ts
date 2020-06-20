import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PageBean } from '../../../../shared-module/entity/pageBean';
import { TableConfig } from '../../../../shared-module/entity/tableConfig';
import { Router } from '@angular/router';
import { DateHelperService, NzI18nService } from 'ng-zorro-antd';
import { UserService } from '../../../../core-module/api-service/user';
import { Result } from '../../../../shared-module/entity/result';
import { OnlineLanguageInterface } from '../../../../../assets/i18n/online/online-language.interface';
import { FiLinkModalService } from '../../../../shared-module/service/filink-modal/filink-modal.service';
import { QueryCondition, SortCondition } from '../../../../shared-module/entity/queryCondition';
import { DateFormatString } from '../../../../shared-module/entity/dateFormatString';
import { TreeSelectorConfig } from '../../../../shared-module/entity/treeSelectorConfig';
import { FacilityLanguageInterface } from '../../../../../assets/i18n/facility/facility.language.interface';
import { FacilityUtilService } from '../../../facility/share/service/facility-util.service';
import { CommonLanguageInterface } from '../../../../../assets/i18n/common/common.language.interface';

@Component({
  selector: 'app-online-list',
  templateUrl: './online-list.component.html',
  styleUrls: ['./online-list.component.scss']
})
export class OnlineListComponent implements OnInit {
  _dataSet = [];
  pageBean: PageBean = new PageBean(10, 1, 1);
  tableConfig: TableConfig;
  queryCondition: QueryCondition = new QueryCondition();
  filterObject = {};
  language: OnlineLanguageInterface;
  areaLanguage: FacilityLanguageInterface;
  commonLanguage: CommonLanguageInterface;
  @ViewChild('roleTemp') roleTemp: TemplateRef<any>;
  @ViewChild('deptTemp') deptTemp: TemplateRef<any>;
  @ViewChild('loginSourseTemp') loginSourseTemp: TemplateRef<any>;
  @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  roleArray: Array<any> = [];
  deptArray: Array<any> = [];
  // 责任单位选择器
  isVisible: boolean = false;
  selectUnitName: string = '';
  treeSelectorConfig: TreeSelectorConfig;
  treeNodes = [];
  treeSetting = {};
  filterValue: any;
  percent;     // 进度条初始进度
  increasePercent; // 进度条增长百分比
  isShowProgressBar: boolean = false;
  timer;
  constructor(
    public $router: Router,
    public $nzI18n: NzI18nService,
    public $userService: UserService,
    public $message: FiLinkModalService,
    private $dateHelper: DateHelperService,
    private $facilityUtilService: FacilityUtilService
  ) {
    this.language = this.$nzI18n.getLocaleData('online');
    this.areaLanguage = this.$nzI18n.getLocaleData('facility');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
  }

  ngOnInit() {
    this.queryDeptList();
    this.initTableConfig();
    this.initTreeSelectorConfig();
    this.refreshData();
    this.queryAllRoles();
    this.queryAllDept();
  }

  pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  private refreshData() {
    this.tableConfig.isLoading = true;
    this.$userService.getOnLineUser(this.queryCondition).subscribe((res: Result) => {
      this.tableConfig.isLoading = false;
      this.hideProgressBar();
      this._dataSet = res.data.data;
      this.pageBean.Total = res.data.totalCount;
      this.pageBean.pageIndex = res.data.pageNum;
      this.pageBean.pageSize = res.data.size;
      this._dataSet.forEach(item => {
        if (item.loginTime) {
          item.loginTime = this.$dateHelper.format(new Date(item.loginTime), DateFormatString.DATE_FORMAT_STRING);
        }
      });
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  private initTableConfig() {
    this.tableConfig = {
      primaryKey: '01-4',
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: { x: '1600px', y: '600px' },
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        { type: 'select', fixedStyle: { fixedLeft: true, style: { left: '0px' } }, width: 62 },
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: { fixedLeft: true, style: { left: '62px' } }
        },
        {
          title: this.language.userCode, key: 'userCode', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
          fixedStyle: { fixedLeft: true, style: { left: '124px' } }
        },
        {
          title: this.language.userName, key: 'userName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: { type: 'input' }
        },
        {
          title: this.language.userNickname, key: 'userNickname', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: { type: 'input' }
        },
        {
          title: this.language.role, key: 'roleName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: this.roleArray
          }
        },
        {
          title: this.language.department, key: 'deptName', width: 200, configurable: true,
          searchKey: 'departmentNameList',
          searchable: true,
          searchConfig: { type: 'render', renderTemplate: this.UnitNameSearch }
        },
        {
          title: this.language.loginTime, key: 'loginTime', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: { type: 'dateRang' }
        },
        {
          title: this.language.lastLoginIp, key: 'loginIp', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: { type: 'input' }
        },
        {
          title: this.language.loginSourse, key: 'loginSource', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.loginSourseTemp,
          searchConfig: {
            type: 'select',
            selectInfo: [
              { label: this.language.pcTerminal, value: '1' },
              { label: this.language.mobileTerminal, value: '0' }
            ]
          },
          handleFilter: ($event) => {
          }
        },
        {
          title: this.language.phoneNumber, key: 'phoneNumber', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: { type: 'input' }
        },
        {
          title: this.language.email, key: 'email', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          title: this.language.address, key: 'address', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: { type: 'input' }
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: { type: 'operate' }, key: '', width: 150, fixedStyle: { fixedRight: true, style: { right: '0px' } }
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [
        {
          text: this.language.offline,
          needConfirm: true,
          canDisabled: true,
          confirmContent: this.language.mandatoryOfflineTips,
          permissionCode: '01-4-1',
          handle: (data) => {
            const params = {};
            data.forEach(item => {
              params[item.id] = item['userId'];
            });
            this.$userService.offline(params).subscribe(res => {
              if (res['code'] === 0) {
                this.$message.success(res['msg']);
                this.goToFirstPage();
              } else if (res['code'] === 120290) {
                this.$message.info(res['msg']);
              } else {
                this.$message.error(res['msg']);
              }
            });
          }
        },
        {
          text: this.language.refresh,
          className: 'fiLink-refresh',
          handle: (currentIndex) => {
            if (this.isShowProgressBar) {
              this.$message.warning(this.language.loadingMsg);
              return;
            } else {
              this.showProgressBar();
            }
            this.refreshData();
          }
        }
      ],
      operation: [
        {
          text: this.language.offline,
          className: 'fiLink-lost',
          needConfirm: true,
          confirmContent: this.language.mandatoryOfflineTips,
          permissionCode: '01-4-1',
          handle: (currentIndex) => {
            const _params = {};
            _params[currentIndex.id] = currentIndex.userId;
            this.$userService.offline(_params).subscribe(res => {
              if (res['code'] === 0) {
                this.$message.success(res['msg']);
                this.goToFirstPage();
              } else if (res['code'] === 120290) {
                this.$message.info(res['msg']);
              } else {
                this.$message.error(res['msg']);
              }
            });
          }
        }
      ],
      sort: (event: SortCondition) => {
        const obj = {};
        obj['sortProperties'] = event.sortField;
        obj['sort'] = event.sortRule;
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      },
      handleSearch: (event) => {
        const obj = {};
        event.forEach(item => {
          if (item.operator === 'gte') {
            obj['loginTime'] = item.filterValue;
          } else if (item.operator === 'lte') {
            obj['loginTimeEnd'] = item.filterValue;
          } else if (item.filterField === 'roleName') {
            obj['roleNameList'] = item.filterValue;
          } else {
            obj[item.filterField] = item.filterValue;
          }
        });
        if (event.length === 0) {
          this.selectUnitName = '';
        }
        if (!event.departmentNameList) {
          this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, []);
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.filterObject = obj;
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      }
    };
  }


  /**
   * 查询角色
   */
  queryAllRoles() {
    this.$userService.queryAllRoles().subscribe((res: Result) => {
      const roleArr = res.data;
      if (roleArr) {
        roleArr.forEach(item => {
          this.roleArray.push({ 'label': item.roleName, 'value': item.roleName });
        });
      }

    });
  }


  /**
 * 查询所有部门
 */
  queryAllDept() {
    this.$userService.queryTotalDepartment().subscribe((res: Result) => {
      if (res.data) {
        res.data.forEach(item => {
          this.deptArray.push({ 'label': item.deptName, 'value': item.deptName });
        });
      }
    });
  }


  // 跳第一页
  goToFirstPage() {
    this.queryCondition.pageCondition.pageNum = 1;
    this.refreshData();
  }


  /**
* 打开责任单位选择器
*/
  showModal(filterValue) {
    this.filterValue = filterValue;
    if (!this.filterValue['filterValue']) {
      this.filterValue['filterValue'] = [];
    }
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isVisible = true;
  }

  /**
     * 责任单位选择结果
     * param event
     */
  selectDataChange(event) {
    let selectArr = [];
    let selectNameArr = [];
    this.selectUnitName = '';
    if (event.length > 0) {
      selectArr = event.map(item => {
        this.selectUnitName += `${item.deptName},`;
        return item.id;
      });
      selectNameArr = event.map(item => {
        return item.deptName;
      });
    } else {
    }
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    if (selectArr.length === 0) {
      this.filterValue['filterValue'] = null;
    } else {
      this.filterValue['filterValue'] = selectNameArr;
    }
    this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, selectArr);
  }


  /**
  * 初始化单位选择器配置
  */
  private initTreeSelectorConfig() {
    this.treeSetting = {
      check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: { 'Y': '', 'N': '' },
      },
      data: {
        simpleData: {
          enable: true,
          idKey: 'id',
          pIdKey: 'deptFatherId',
          rootPid: null
        },
        key: {
          name: 'deptName',
          children: 'childDepartmentList'
        },
      },
      view: {
        showIcon: false,
        showLine: false
      }
    };
    this.treeSelectorConfig = {
      title: `${this.areaLanguage.selectUnit}`,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.areaLanguage.deptName, key: 'deptName', width: 100,
        },
        {
          title: this.areaLanguage.deptLevel, key: 'deptLevel', width: 100,
        },
        {
          title: this.areaLanguage.parentDept, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }

  /**
  * 查询所有的区域
  */
  private queryDeptList() {
    this.$userService.queryAllDepartment().subscribe((result: Result) => {
      this.treeNodes = result.data || [];
    });
  }

  /**
   * 显示加载进度条
   */
  showProgressBar() {
    this.percent = 0;
    this.increasePercent = 50;
    this.isShowProgressBar = true;
    this.timer = setInterval(() => {
      if (this.percent >= 100) {
        clearInterval(this.timer);
      } else {
        this.percent += this.increasePercent;
        if (this.percent === 50) {
          this.increasePercent = 2;
        } else if (this.percent === 80) {
          this.increasePercent = 1;
        } else if (this.percent === 99) {
          this.increasePercent = 0;
        }
      }
    }, 500);
  }

  /**
  * 隐藏加载进度条
  */
  hideProgressBar() {
    this.percent = 100;
    setTimeout(() => {
      this.isShowProgressBar = false;
    }, 1000);
  }
}
