import { Component, OnInit, Input } from '@angular/core';
import { AlarmService } from '../../../../core-module/api-service/alarm';
import { NzTreeNode } from 'ng-zorro-antd';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import { AreaConfig } from '../alarmSelectorConfig';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmLanguageInterface} from 'src/assets/i18n/alarm/alarm-language.interface';
import {FacilityUtilService} from 'src/app/business-module/facility';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

  display = {
    areaSelectVisible: false,
    areadisplay: false
  };
  treeSetting = {};
  treeSelectorConfig: TreeSelectorConfig;
  _type: 'form' | 'table'  = 'table';
  // 区域
  areaList = {
    ids: [],
    name: ''
  };
  areaSelectorConfig: any = new TreeSelectorConfig();
  _areaConfig: AreaConfig;
  public language: AlarmLanguageInterface;
  @Input()
  set areaConfig(areaConfig: AreaConfig) {
    if ( areaConfig ) {
      this._areaConfig = areaConfig;
      this.setData();
    }
  }

  @Input()
  filterValue;

  constructor(
    public $alarmService: AlarmService,
    public $nzI18n: NzI18nService,
    private $facilityUtilService: FacilityUtilService,
  ) {
    this.language = this.$nzI18n.getLocaleData('alarm');
  }

  /**
   * 打开区域选择器
   */
  showAreaSelectorModal() {
    const userIds = this._areaConfig.userIds ? this._areaConfig.userIds : [];
    // 请求区域
    this.$alarmService.getArea(userIds).subscribe((data: NzTreeNode[]) => {
      // this.areaNodes = data['data'];
      this.$facilityUtilService.setAreaNodesStatus(data['data'], null, null);
      this.areaSelectorConfig.treeNodes = data['data'];
      this.display.areaSelectVisible = true;
      // 如果有数据 就默认勾选
      if ( this.areaList.ids && this.areaList.ids.length ) {
        this.isCheckData(this.areaSelectorConfig.treeNodes, this.areaList.ids);
      } else {
        // 如果没有数据 遍历循环 添加name
        this.addName(this.areaSelectorConfig.treeNodes);
      }
      this.initTreeSelectorConfig();
    });
  }

  // 递归循环 勾选数据
  isCheckData(data, ids) {
    ids.forEach( id => {
      data.forEach(item => {
        item.id = item.areaId;
        if ( id === item.areaId ) {
          item.checked = true;
        }
        if (item.children && item.children) {
          this.isCheckData(item.children, ids);
        }
        //  item.name = item.areaName;
      });
    });
  }

  addName(data) {
    data.forEach(item => {
      item.id = item.areaId;
      item.value = item.areaId;
      if (item.children && item.children) {
        this.addName(item.children);
      }
    });
  }

  /**
   * 初始化树选择器配置
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
          enable: false,
          idKey: 'areaId',
        },
        key: {
          name: 'areaName',
          // children: 'childDepartmentList'
        },
      },
      view: {
        showIcon: false,
        showLine: false
      }
    };
    this.treeSelectorConfig = {
      title: this.language.area,
      width: '1000px',
      height: '300px',
      treeNodes: this.areaSelectorConfig.treeNodes,
      treeSetting: this.treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.language.areaNames, key: 'areaName', width: 300,
        }
      ]
    };
  }

  /**
   * 区域选择结果
   * param event
   */
  selectDataChange(event) {
    this.areaList = {
      ids: event.map(item => item.areaId ),
      name: event.map(item => item.areaName).join(',')
    };
    // this.checkArea.emit(this.areaList);
    if ( this._type === 'table' ) {
      this.filterValue['filterValue'] = this.areaList.ids;
    }
    this._areaConfig.checkArea(this.areaList);
    // this.initTreeSelectorConfig();
  }

  setData() {
    if ( this._areaConfig.type ) {
      this._type = this._areaConfig.type;
    }
    // 获取默认数据
    if ( this._areaConfig.initialValue &&  this._areaConfig.initialValue.ids
      && this._areaConfig.initialValue.ids.length ) {
      this.areaList = this._areaConfig.initialValue;
    }

    // 禁用和启用
    // this.display.areadisplay = this._areaConfig.areadisplay;
    if ( this._areaConfig.clear ) {
      // 清除数据
      this.areaList = {
        ids: [],
        name: ''
      };
    }
  }

  ngOnInit() {
    // 区域弹框
    this.initTreeSelectorConfig();
  }

}
