import { Component, OnInit, Input } from '@angular/core';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import { UnitConfig } from '../alarmSelectorConfig';
import {UserService} from '../../../../core-module/api-service/user/user-manage';
import {Result} from '../../../../shared-module/entity/result';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmLanguageInterface} from 'src/assets/i18n/alarm/alarm-language.interface';
import {SessionUtil} from '../../../../shared-module/util/session-util';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {

  treeSelectorConfig: TreeSelectorConfig;   // 树选择器配置
  isVisible: boolean = false;
  treeSetting;
  treeNodes = [];     // 树节点
  _type: 'form' | 'table' = 'table';
  _unitConfig: UnitConfig;
  // 勾选的告警名称
  checkUnit = {
    name: '',
    ids: []
  };
  public language: AlarmLanguageInterface;
  // 用户
  userInfo;
  @Input()
  set unitConfig(unitConfig: UnitConfig) {
    if (unitConfig) {
      this._unitConfig = unitConfig;
      this.setData();
    }
  }

  @Input()
  filterValue;

  constructor(
    private $userService: UserService,
    public $nzI18n: NzI18nService,
  ) {
    this.language = this.$nzI18n.getLocaleData('alarm');
    // super($nzI18n);
  }

  setData() {
    // 获取类型
    if (this._unitConfig.type) {
      this._type = this._unitConfig.type;
    }
    // 获取默认数据
    if (this._unitConfig.initialValue && this._unitConfig.initialValue.ids
      && this._unitConfig.initialValue.ids.length) {
      this.checkUnit = this._unitConfig.initialValue;
    }
    if (this._unitConfig.clear) {
      this.checkUnit = {
        name: '',
        ids: []
      };
    }
  }

  /**
   * 初始化单位选择器配置
   */
  private initTreeSelectorConfig() {
    this.treeSetting = {
      check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: {'Y': '', 'N': ''},
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
      title: this.language.selectUnit,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.language.unitName, key: 'deptName', width: 100,
        },
        {
          title: this.language.unitLevel, key: 'deptLevel', width: 100,
        },
        {
          title: this.language.placeUnit, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }

    /**
   * 责任单位选择结果
   * param event
   */
  selectDataChange(event) {
    this.checkUnit = {
      ids: event.map(item => item.id ),
      name: event.map(item => item.deptName).join(',')
    };
    // this.checkArea.emit(this.areaList);
    if ( this._type === 'table' ) {
      this.filterValue['filterValue'] = this.checkUnit.ids;
    }
    this._unitConfig.checkUnit(this.checkUnit);
  }

  /**
   * 打开责任单位选择器
   */
  showModal() {
      this.isVisible = true;
      // this.treeSelectorConfig.treeNodes = this.treeNodes;
      // 根据当前用户 权限效验
      if ( this.treeNodes && this.treeNodes.length ) {
        this.isDisabled();
      }
      // 如果有数据 就默认勾选
      if ( this.checkUnit.ids && this.checkUnit.ids.length ) {
        this.isCheckData(this.treeNodes, this.checkUnit.ids);
      }
      this.initTreeSelectorConfig();
  }

  // 递归循环 勾选数据
  isCheckData(data, ids) {
    ids.forEach( id => {
      data.forEach(item => {
         if ( id === item.id ) {
             item.checked = true;
         }
         if (item.childDepartmentList && item.childDepartmentList) {
           this.isCheckData(item.childDepartmentList, ids);
         }
      });
    });
  }
  // 根据当前用户 权限效验
  isDisabled() {
    if ( this.userInfo.id !== '1' ) {
      // 非admin账户进入
      this.treeNodes.forEach(item => {
        if ( this.userInfo.deptId !== item.id ) {
          item.chkDisabled = true;
        } else {
          item.chkDisabled = false;
        }
      });
    }

  }

  /**
   * 查询所有的区域
   */
  private queryDeptList() {
    this.$userService.queryAllDepartment().subscribe((result: Result) => {
      this.treeNodes = result.data || [];
    });
  }

  ngOnInit() {
    // 获取当前用户的单位
    // this.userDeptId = SessionUtil.getUserInfo().deptId;
    this.userInfo = SessionUtil.getUserInfo();
    this.queryDeptList();
    this.initTreeSelectorConfig();
  }

}
