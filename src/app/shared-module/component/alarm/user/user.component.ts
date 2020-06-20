import {Component, Input, OnInit} from '@angular/core';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {AlarmService} from '../../../../core-module/api-service/alarm';
import {Result} from '../../../../shared-module/entity/result';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {AlarmLanguageInterface} from 'src/assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {User} from '../alarmSelectorConfig';
import {UserLanguageInterface} from '../../../../../assets/i18n/user/user-language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';

@Component({
  selector: 'xc-app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  _dataSetUser = [];
  // 勾选的通知人
  checkAlarmNotifier = {
    name: '',
    ids: []
  };
  checkAlarmNotifierBackups = {
    name: '',
    ids: []
  };
  display = {
    userTable: false,
    disabled: false
  };
  queryCondition: QueryCondition = new QueryCondition();
  // 通知人弹框
  pageBeanUser: PageBean = new PageBean(10, 1, 0);
  tableConfigUser: TableConfig;
  public language: AlarmLanguageInterface;
  public userLanguage: UserLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  _alarmUserConfig: User;
  _type: 'form' | 'table' = 'table';
  // 远程通知中 新增 编辑 通过 区域和设施类型选择
  _condition;
  _allDataSetUser: any[] = [];
  private queryConditions: any;

  constructor(
    public $alarmService: AlarmService,
    public $nzI18n: NzI18nService,
  ) {
    this.language = this.$nzI18n.getLocaleData('alarm');
    this.userLanguage = this.$nzI18n.getLocaleData('user');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
  }

  @Input()
  filterValue;

  @Input()
  set alarmUserConfig(alarmUserConfig: User) {
    if (alarmUserConfig) {
      this.initTableConfigUser();
      this._alarmUserConfig = alarmUserConfig;
      this.setData();
    }
  }

  setData() {
    if (this._alarmUserConfig.type) {
      this._type = this._alarmUserConfig.type;
    }
    if (this._alarmUserConfig.initialValue && this._alarmUserConfig.initialValue.ids && this._alarmUserConfig.initialValue.ids.length) {
      this.checkAlarmNotifierBackups = this.clone(this._alarmUserConfig.initialValue);
      this.checkAlarmNotifier = this.clone(this._alarmUserConfig.initialValue);
    }
    // 禁用和启用
    this.display.disabled = this._alarmUserConfig.disabled;
    // 条件
    if (this._alarmUserConfig.condition) {
      this._condition = this._alarmUserConfig.condition;
    }
    if (this._alarmUserConfig.clear) {
      this.checkAlarmNotifier = {
        name: '',
        ids: []
      };
      this.checkAlarmNotifierBackups = {
        name: '',
        ids: []
      };
    }
  }

  close() {
    this.display.userTable = false;
    this.checkAlarmNotifierBackups = this.clone(this.checkAlarmNotifier);
  }

  // 克隆数据
  clone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  showUser() {
    this.display.userTable = false;
    this.checkAlarmNotifier = this.clone(this.checkAlarmNotifierBackups);
    if (this._type === 'table') {
      this.filterValue['filterValue'] = this.checkAlarmNotifier.ids;
    }
    this._alarmUserConfig.checkUser(this.checkAlarmNotifier);
  }

  openUserSelector() {
    this.display.userTable = true;
    this.getAllUserData();
  }

  pageUserChange(event) {
    this.refreshUserData();
  }

  /**
   * 勾选数据时
   * param currentItem
   */
  checkData(currentItem) {
    this.checkAlarmNotifierBackups.ids.push(currentItem.id);
    const names = this.checkAlarmNotifierBackups.name + ',' + currentItem.userName;
    this.checkAlarmNotifierBackups.name = this.checkAlarmNotifierBackups.name === '' ? currentItem.userName : names;
  }

  /**
   * 取消勾选
   * param currentItem
   */
  cancelCheck(currentItem) {
    this.checkAlarmNotifierBackups.ids = this.checkAlarmNotifierBackups.ids.filter(id => {
      return currentItem.id !== id && id;
    });
    const names = this.checkAlarmNotifierBackups.name.split(',');
    this.checkAlarmNotifierBackups.name = names.filter(name => currentItem.userName !== name && name).join(',');
  }

  /**
   * 通知人请求列表数据
   */
  refreshUserData() {
    this.tableConfigUser.isLoading = true;
    if (this._type === 'table') {
      // 在列表中显示
      const data = {
        filterConditions: [],
        pageCondition: {
          pageNum: this.pageBeanUser['_pageIndex'],
          pageSize: this.pageBeanUser['_pageSize']
        },
        sortCondition: {},
        bizCondition: this.queryConditions
      };
      this.$alarmService.queryUser(data).subscribe((res: Result) => {
        this.tableConfigUser.isLoading = false;
        if (res['code'] === 0) {
          this.pageBeanUser['_pageIndex'] = res.data.pageNum;
          this.pageBeanUser['_pageSize'] = res.data.size;
          this.pageBeanUser['_Total'] = res.data.totalCount;
          this._dataSetUser = res.data.data.map(item => {
            // 点击如果input框中有值 就默认勾选
            this.checkAlarmNotifierBackups.ids.forEach(_item => {
              if (item.id === _item) {
                item.checked = true;
              }
            });
            let deptName;
            if (item.department && item.department.deptName) {
              deptName = item.department.deptName;
            }
            return {...item, department: deptName};
          });
        }
      });
    } else {
      // 新增和编辑
      this.getUserDataByPage();
    }

  }

  ngOnInit() {
    this.initTableConfigUser();
  }

  /**
   * 获取符合条件的通知人数据
   */
  private getAllUserData() {
    this.$alarmService.queryUserInfoByDeptAndDeviceType(this._condition).subscribe((res: Result) => {
      this._allDataSetUser = res.data.map(item => {
        let deptName;
        if (item.department && item.department.deptName) {
          deptName = item.department.deptName;
        }
        return {...item, department: deptName};
      });
      this.getUserDataByPage();
    });
  }

  /**
   * 根据条件查询和过滤获取数据
   */
  private getUserDataByPage() {
    // 根据查询条件过滤数据
    const userData = this._allDataSetUser.filter(item => this.filterCallBack(item)) || [];
    userData.forEach(item => {
      // 点击如果input框中有值 就默认勾选
      const index = this.checkAlarmNotifierBackups.ids.findIndex(_item => item.id === _item);
      if (index > -1) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    });
    //  分页数据
    this.pageBeanUser.Total = userData.length;
    const startIndex = this.pageBeanUser.pageSize * (this.pageBeanUser.pageIndex - 1);
    const endIndex = startIndex + this.pageBeanUser.pageSize - 1;
    this._dataSetUser = userData.filter((item, index) => {
      return index >= startIndex && index <= endIndex;
    });
    this.tableConfigUser.isLoading = false;
  }

  /**
   * 过滤判断
   * param item
   * returns {boolean}
   */
  private filterCallBack(item) {
    const filter = this.queryConditions;
    if (!filter) {
      return true;
    }
    if (filter['department'] && !(item.department.includes(filter['department']))) {
      return false;
    }
    if (filter['userName'] && !(item.userName.includes(filter['userName']))) {
      return false;
    }
    if (filter['phoneNumber'] && !(item.phoneNumber.includes(filter['phoneNumber']))) {
      return false;
    }
    return true;
  }

  // 通知人弹框
  private initTableConfigUser() {
    this.tableConfigUser = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      scroll: {x: '800px', y: '300px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 50},
        {
          type: 'serial-number', width: 50, title: this.language.serialNumber,
        },
        {
          // 名称
          title: this.language.name, key: 'userName', width: 150,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          // 手机号
          title: this.userLanguage.phoneNumber, key: 'phoneNumber', width: 150,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 单位
          title: this.language.responsibleDepartment, key: 'department', width: 150,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '',
          width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.refreshUserData();
      },
      handleSelect: (data, currentItem) => {
        if (!currentItem) {
          // 当前页面全选 获取全部取消时
          if (data && data.length) {
            data.forEach(checkData => {
              if (this.checkAlarmNotifierBackups.ids.indexOf(checkData.id) === -1) {
                // 不存在时 添加进去
                this.checkData(checkData);
              }
            });
          } else {
            // 取消当前页面的全部勾选
            this._dataSetUser.forEach(item => {
              if (this.checkAlarmNotifierBackups.ids.indexOf(item.id) !== -1) {
                // 当该条数据存在于 勾选信息中时 将其移除
                this.cancelCheck(item);
              }
            });
          }
        } else {
          if (currentItem.checked) {
            // 勾选
            this.checkData(currentItem);
          } else {
            // 取消勾选
            this.cancelCheck(currentItem);
          }
        }
      },
      handleSearch: (event) => {
        this.pageBeanUser['_pageIndex'] = 1;
        this.pageBeanUser['_pageSize'] = 10;
        const obj = {};
        event.forEach(item => {
          obj[item.filterField] = item.filterValue;
        });
        this.queryConditions = obj;
        this.refreshUserData();
      }
    };
  }

  /**
   * 选择器里面清空已选数据
   * 只清空选择器数据
   */
  clearSelectData() {
    this.checkAlarmNotifierBackups = {
      name: '',
      ids: []
    };
    this.refreshUserData();
  }
}
