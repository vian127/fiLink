import {Component, OnInit} from '@angular/core';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {Result} from '../../../../../shared-module/entity/result';
import {UserService} from '../../../../../core-module/api-service/user/user-manage';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {ApplicationService} from '../../../server';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../../../core-module/model/result-code.enum';
import {Electric, execStatus, SwitchAction} from '../../../model/const/const';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
  // 设备列表数据集合
  _dataSet = [];
  // 分页参数
  pageBean: PageBean = new PageBean(10, 1, 1);
  // 表格配置
  tableConfig: TableConfig;
  // 批量选中的亮度数据
  dimmingLight = [];
  // 选中的亮度数据
  dimmingLightObj = {
    equipmentId: ''
  };
  // 表格多语言
  language: OnlineLanguageInterface;
  // 策略状态
  roleArray: Array<any> = [];
  // 设备详情的显隐
  isEquipmentModel: boolean = false;
  // 亮度显隐
  isBrightness = false;
  // 亮度值
  dimmingLightValue = 0;
  // 表格查询条件
  queryCondition: QueryCondition = new QueryCondition();

  constructor(
    public $nzI18n: NzI18nService,
    public $applicationService: ApplicationService,
    public $userService: UserService,
  ) {
    this.language = this.$nzI18n.getLocaleData('online');
  }

  ngOnInit() {
    this.initTableConfig();
    this.refreshData();
  }

  /**
   * 分页查询
   * @ param event
   */
  pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   *  取消操作
   */
  handleCancel() {
    this.isEquipmentModel = false;
    this.isBrightness = false;
  }

  /**
   * 亮度调整
   */
  handleOk() {
    let equipmentIds;
    if (this.dimmingLight && this.dimmingLight.length) {
      equipmentIds = this.dimmingLight.map(item => item.equipmentId);
    } else {
      equipmentIds = [this.dimmingLightObj.equipmentId];
    }
    const params = {
      equipmentIds: equipmentIds,
      lightnessNum: String(this.dimmingLightValue)
    };
    this.$applicationService.dimmingLight(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.isEquipmentModel = false;
        this.isBrightness = false;
        this.refreshData();
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
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
          title: '资产编号', key: 'equipmentCode', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          title: '名称', key: 'equipmentName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: '类型', key: 'equipmentType', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: '状态', key: 'equipmentStatus', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: this.roleArray
          }
        },
        {
          title: '型号', key: 'equipmentModel', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        {
          title: '供应商', key: 'supplier', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: '报废年限', key: 'scrapTime', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 300, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [
        {
          text: '开启',
          needConfirm: true,
          canDisabled: true,
          confirmContent: '确定开启?',
          handle: (data) => {
            this.switchLight(data, SwitchAction.open);
          }
        },
        {
          text: '关闭',
          needConfirm: true,
          canDisabled: true,
          confirmContent: '确定关闭?',
          handle: (data) => {
            this.switchLight(data, SwitchAction.close);
          }
        },
        {
          text: '上电',
          needConfirm: true,
          canDisabled: true,
          confirmContent: '确定上电?',
          handle: (data) => {
            this.upOrDownElectric(data, Electric.up);
          }
        },
        {
          text: '下电',
          needConfirm: true,
          canDisabled: true,
          confirmContent: '确定下电?',
          handle: (data) => {
            this.upOrDownElectric(data, Electric.down);
          }
        },
        {
          text: '亮度',
          canDisabled: true,
          handle: (data) => {
            this.dimmingLight = data;
            this.isBrightness = true;
          }
        },
      ],
      operation: [
        {
          text: '查看详情',
          className: 'fiLink-view-detail',
          handle: (currentIndex) => {
            this.handEquipmentOperation();
            console.log(currentIndex);
          },
        },
        {
          text: '开',
          className: 'fiLink-lost',
          needConfirm: true,
          confirmContent: '是否确认开启操作?',
          handle: (currentIndex) => {
            this.switchLight(currentIndex, SwitchAction.open);
          }
        },
        {
          text: '关',
          className: 'fiLink-lost',
          needConfirm: true,
          confirmContent: '是否确认关闭操作?',
          handle: (currentIndex) => {
            this.switchLight(currentIndex, SwitchAction.close);
          }
        },
        {
          text: '上电',
          className: 'fiLink-lost',
          needConfirm: true,
          confirmContent: '是否确认上电操作?',
          handle: (currentIndex) => {
            this.upOrDownElectric(currentIndex, Electric.up);
          }
        },
        {
          text: '下电',
          className: 'fiLink-lost',
          needConfirm: true,
          confirmContent: '是否确认下电操作?',
          handle: (currentIndex) => {
            this.upOrDownElectric(currentIndex, Electric.down);
          }
        },
        {
          text: '亮度',
          className: 'fiLink-view-detail',
          handle: (data) => {
            this.dimmingLightObj = data;
            this.isBrightness = true;
          },
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
   * 刷新表格数据
   */
  private refreshData() {
    this.tableConfig.isLoading = true;
    this.$applicationService.equipmentListByPage(this.queryCondition).subscribe((res: Result) => {
      this.tableConfig.isLoading = false;
      this._dataSet = res.data;
      this.pageBean.Total = res.totalCount;
      this.pageBean.pageIndex = res.pageNum;
      this.pageBean.pageSize = res.size;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 设备开关
   * @ param data 选中的数据
   * @ param type 区分开和关
   */
  switchLight(data, type) {
    let equipmentIds;
    if (data && data.length) {
      equipmentIds = data.map(item => item.equipmentId);
    } else {
      equipmentIds = [data.equipmentId];
    }
    const action = type === SwitchAction.open ? execStatus.free : execStatus.implement;
    const params = {
      equipmentIds: equipmentIds,
      action: action
    };
    this.$applicationService.switchLight(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.refreshData();
      }
    }, () => {

    });
  }

  /**
   *上电下电
   * @ param data 选中的数据
   * @ param type 操作类型
   */
  upOrDownElectric(data, type) {
    let equipmentIds;
    if (data && data.length) {
      equipmentIds = data.map(item => item.equipmentId);
    } else {
      equipmentIds = [data.equipmentId];
    }
    const action = type === Electric.up ? execStatus.free : execStatus.implement;
    const params = {
      equipmentIds: equipmentIds,
      action: action
    };
    this.$applicationService.switchLight(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.refreshData();
      }
    }, () => {

    });
  }

  /**
   * 设备详情
   */
  handEquipmentOperation() {
    this.isEquipmentModel = true;
  }
}
