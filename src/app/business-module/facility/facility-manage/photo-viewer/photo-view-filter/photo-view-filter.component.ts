import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {getDeviceType} from '../../../share/const/facility.config';
import {Option} from '../../../../../shared-module/component/check-select-input/check-select-input.component';
import {TreeSelectorConfig} from '../../../../../shared-module/entity/treeSelectorConfig';
import {AreaService} from '../../../../../core-module/api-service/facility/area-manage';
import {FacilityUtilService} from '../../../share/service/facility-util.service';
import {AlarmObjectConfig} from '../../../../../shared-module/component/alarm/alarmSelectorConfig';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';

@Component({
  selector: 'app-photo-view-filter',
  templateUrl: './photo-view-filter.component.html',
  styleUrls: ['./photo-view-filter.component.scss']
})
export class PhotoViewFilterComponent implements OnInit {
  @Output() public changeFilter = new EventEmitter();
  // 过滤条件
  public filterObj = {
    picName: '',
    deviceName: '',
    deviceCode: '',
    areaName: '',
    resource: null,
    areaId: '',
    deviceIds: [],
    deviceTypes: []
  };
  // 来源列表
  public resourceList = [];
  // 控制区域显示隐藏
  public areaSelectVisible = false;
  // 国际化配置
  public language: FacilityLanguageInterface;
  public areaSelectorConfig = new TreeSelectorConfig();
  public checkList = [];
  // 设施选择器配置
  public deviceObjectConfig: AlarmObjectConfig;
  // 勾选的告警对象
  public checkDeviceObject = {
    name: '',
    ids: []
  };
  private areaNodes;

  constructor(private $areaService: AreaService,
              private $facilityUtilService: FacilityUtilService,
              private $nzI18n: NzI18nService) {
    this.language = $nzI18n.getLocaleData('facility');
  }

  public ngOnInit(): void {
    // 设施类型查询列表
    this.checkList = getDeviceType(this.$nzI18n).map(item => {
      const obj: Option = {
        label: '',
        value: ''
      };
      obj.label = item.label;
      obj.value = item.code;
      return obj;
    });
    this.resourceList = [
      {
        label: this.language.picInfo.alarm,
        value: '1'
      }, {
        label: this.language.picInfo.worker,
        value: '2',
      }, {
        label: this.language.picInfo.picture,
        value: '3',
      }
      , {
        label: this.language.picInfo.openDoor,
        value: '4',
      }
    ];
    this.initAreaSelectorConfig();
    this.initDeviceObjectConfig();
  }

  /**
   * 区域选择监听
   * param item
   */
  public areaSelectChange(item): void {
    if (item && item[0]) {
      this.filterObj.areaId = item[0].areaId;
      this.filterObj.areaName = item[0].areaName;
      this.$facilityUtilService.setAreaNodesStatus(this.areaNodes, item[0].areaId);

    } else {
      this.filterObj.areaId = '';
      this.filterObj.areaName = '';
      this.$facilityUtilService.setAreaNodesStatus(this.areaNodes, null);
    }
  }

  /**
   * 手动查询
   */
  public handleSearch(): void {
    const filterObj = JSON.parse(JSON.stringify(this.filterObj));
    if (filterObj.deviceTypes.length > 0) {
      filterObj.deviceTypes = filterObj.deviceTypes.map(item => item.value);
    }
    this.changeFilter.emit(filterObj);
  }

  /**
   * 重置
   */
  public handleReset(): void {
    this.filterObj = {
      picName: '',
      deviceName: '',
      deviceCode: '',
      areaName: '',
      resource: null,
      areaId: '',
      deviceIds: [],
      deviceTypes: []
    };
    this.initDeviceObjectConfig();
    this.$facilityUtilService.setAreaNodesStatus(this.areaNodes, null, null);
    this.changeFilter.emit(this.filterObj);
  }

  // 设施选择器
  public initDeviceObjectConfig(): void {
    this.deviceObjectConfig = {
      clear: !this.filterObj.deviceIds.length,
      alarmObject: (event) => {
        this.checkDeviceObject = event;
        this.filterObj.deviceIds = event.ids;
      }
    };
  }

  /**
   * 支持enter搜索
   * param item
   */
  public keydown(item): void {
    if (item.key === 'Enter') {
      this.handleSearch();
    }
  }

  /**
   * 初始化选择区域配置
   * param nodes
   */
  private initAreaSelectorConfig(): void {
    this.$facilityUtilService.getArea().then(data => {
      this.areaNodes = data;
      this.$facilityUtilService.setAreaNodesStatus(this.areaNodes, null, null);
      this.areaSelectorConfig = {
        width: '500px',
        height: '300px',
        title: `${this.language.select}${this.language.area}`,
        treeSetting: {
          check: {
            enable: true,
            chkStyle: 'checkbox',
            chkboxType: {'Y': '', 'N': ''},
          },
          data: {
            simpleData: {
              enable: true,
              idKey: 'areaId',
            },
            key: {
              name: 'areaName'
            },
          },

          view: {
            showIcon: false,
            showLine: false
          }
        },
        treeNodes: this.areaNodes
      };
    });
  }

  public openAreaSelector(): void {
    this.areaSelectVisible = true;
    this.areaSelectorConfig.treeNodes = this.areaNodes;
  }
}
