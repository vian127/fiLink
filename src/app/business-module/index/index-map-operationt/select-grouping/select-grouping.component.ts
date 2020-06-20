import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {NzI18nService} from 'ng-zorro-antd';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {ResultModel} from '../../../../core-module/model/result.model';
import {IndexFacilityService} from '../../../../core-module/api-service/index/facility/facility.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {BusinessFacilityService} from '../../../../shared-module/service/business-facility/business-facility.service';
import {IndexGroupTypeEnum, IndexLayeredTypeEnum} from '../../shared/const/index-enum';
import {MapCoverageService} from '../../service/map-coverage.service';
import {AddToExistGroupInfoModel} from '../../shared/model/facility-condition.model';

@Component({
  selector: 'app-select-grouping',
  templateUrl: './select-grouping.component.html',
  styleUrls: ['./select-grouping.component.scss']
})
export class SelectGroupingComponent implements OnInit, OnDestroy {
  @ViewChild('textAreaTemp') private textAreaTemp;
  // 显示添加分组卡片
  private addGrouping = false;
  // 显示添加分组弹框
  private isVisible = false;
  // 列表数据集
  public dataSet = [];
  // 表格分页
  public pageBean: PageBean = new PageBean(5, 1, 1);
  // 表格配置
  public tableConfig: TableConfig;
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 头名称
  private title: string;
  // 现存分组数据集
  private listOfOption;
  // 备注数据
  private remarkValue: string;
  // 显示第一步表格内容
  private showTable = false;
  // 显示第二步选择分组内容
  private showAddGroup = true;
  // 上一步按钮
  private showBack = false;
  // 下一步按钮
  private showNext = true;
  // 确定按钮
  private showOk = false;
  // 步骤
  private stepIndex = 0;
  // 选择已有分组
  private selectExistingGroup = true;
  // 选择新建分组
  private selectAddGroup = false;
  // 选中的当前分组
  private selectValue: string;
  // 分组枚举
  public groupTypeEnum = IndexGroupTypeEnum;
  // 选中的操作
  private radioValue = IndexGroupTypeEnum.current;
  // 分组列表查询条件
  public queryGroupListCondition: QueryCondition = new QueryCondition();
  // 当前图层
  public indexType = this.$mapCoverageService.showCoverage;
  // 所有的设施ID
  public allDeviceId: string[] = [];
  // 所有的设备ID
  public allEquipmentId: string[] = [];
  // 框选选择的设施ID
  private selectDeviceId: string[] = [];
  // 框选选中的设备ID
  private selectEquipmentId: string[] = [];
  // 表单配置
  private formColumn: FormItem[] = [];
  // 表单状态
  private formStatus: FormOperate;

  private addToExistGroupPara: AddToExistGroupInfoModel;

  /**
   * 构造器
   */
  constructor(
    public $nzI18n: NzI18nService,
    public $ruleUtil: RuleUtil,
    private $message: FiLinkModalService,
    private $IndexFacilityService: IndexFacilityService,
    private $mapCoverageService: MapCoverageService,
    private $businessFacilityService: BusinessFacilityService
  ) {
    this.indexLanguage = $nzI18n.getLocaleData('index');
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.title = this.indexLanguage.addToGroup;
    this.tableListConfig();
    this.initColumn();
  }

  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    this.textAreaTemp = null;
  }

  /**
   * 显示添加分组卡片
   */
  public groupingShow(): void {
    this.addGrouping = !this.addGrouping;
    this.$businessFacilityService.eventEmit.emit({isShow: this.addGrouping});
  }

  /**
   * 显示添加分组弹框
   */
  public showModal(): void {
    this.initialize();
    this.getSelectListByLayer();
    this.$businessFacilityService.eventEmit.emit({isShow: false});
  }

  // 弹出初始化
  public initialize(): void {
    // 显示卡片
    this.isVisible = true;
    // 上一步按钮
    this.showBack = false;
    // 下一步按钮
    this.showNext = true;
    // 确定按钮
    this.showOk = false;
    // 步骤
    this.stepIndex = 0;
    // 选择已有分组
    this.selectExistingGroup = true;
    // 选择新建分组
    this.selectAddGroup = false;
    // 显示表格
    this.showTable = false;
    // 显示添加分组
    this.showAddGroup = true;
    this.radioValue = IndexGroupTypeEnum.current;
  }

  /**
   * 关闭弹框
   */
  public closeModal(): void {
    this.addGrouping = !this.addGrouping;
    this.$businessFacilityService.eventEmit.emit({isShow: false});
    this.isVisible = false;
  }

  /**
   * 确定
   */
  public handleOk(): void {
    this.addGrouping = !this.addGrouping;
    this.$businessFacilityService.eventEmit.emit({isShow: false});
    // 添加到现存分组
    if (this.radioValue === IndexGroupTypeEnum.current) {
      this.addToExistGroupInfo();
    }
    // 添加分组
    if (this.radioValue === IndexGroupTypeEnum.create) {
      this.addGroupInfo();
    }
  }

  /**
   * 分组类型单选按钮change
   */
  public groupRadioChange(evt: IndexGroupTypeEnum): void {
    if (evt === IndexGroupTypeEnum.current) {
      this.selectExistingGroup = true;
      this.selectAddGroup = false;
    } else {
      this.selectExistingGroup = false;
      this.selectAddGroup = true;
    }
  }

  /**
   * 上一步
   */
  public handleBack(): void {
    this.stepIndex = 0;
    this.showTable = false;
    this.showAddGroup = true;
    this.showNext = true;
    this.showBack = false;
    this.showOk = false;
  }

  /**
   * 下一步
   */
  public handleNext(): void {
    this.stepIndex = 1;
    this.showTable = true;
    this.showAddGroup = false;
    this.showNext = false;
    this.showBack = true;
    this.showOk = true;
    // 查询分组
    this.getGroupList();
    // 赋值
    this.analysisSelectData();
  }

  /**
   * 分页
   */
  public pageChange(event): void {
    this.pageBean.pageIndex = event.pageIndex;
    this.pageBean.pageSize = event.pageSize;
  }

  /**
   * 表格配置
   */
  private tableListConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: false,
      scroll: {x: '800px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          // 编号
          title: this.indexLanguage.serialNumber, key: 'serialNumber', width: 60,
          isShowSort: true,
          searchable: true,
          configurable: false,
          searchConfig: {type: 'input'},
        },
        {
          // 设施名称
          title: this.indexLanguage.searchDeviceName, key: 'name', width: 200,
          isShowSort: true,
          searchable: true,
          configurable: false,
          searchConfig: {type: 'input'},
        },
        {
          // 详细地址
          title: this.indexLanguage.address, key: 'adds', width: 200,
          isShowSort: true,
          searchable: true,
          configurable: false,
          searchConfig: {type: 'input'},
        },
        {
          // 所属区域
          title: this.indexLanguage.area, key: 'area', width: 200,
          isShowSort: true,
          searchable: true,
          configurable: false,
          searchConfig: {type: 'input'},
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [],
      handleSelect: (event) => {
        if (this.indexType === IndexLayeredTypeEnum.facility) {
          this.allDeviceId = event;
        }
        if (this.indexType === IndexLayeredTypeEnum.device) {
          this.allEquipmentId = event;
        }
      }
    };
  }

  /**
   * 查询分组列表
   */
  public getGroupList(): void {
    this.$IndexFacilityService.queryGroupInfoList(this.queryGroupListCondition)
      .subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          const children: Array<{ label: string; value: string }> = [];
          result.data.forEach(f => {
            children.push({label: f.groupName, value: f.groupId});
          });
          this.listOfOption = children;
        }
      });
  }


  /**
   * 向已有分组中添加设备设施
   */
  public addToExistGroupInfo(): void {
    let para;
    if (this.radioValue) {
      para = {
        groupInfo: {
          groupId: this.selectValue
        },
        groupDeviceInfoIdList: this.selectDeviceId,
        groupEquipmentIdList: this.selectEquipmentId,
      };

      this.$IndexFacilityService.addToExistGroupInfo(para)
        .subscribe((result: ResultModel<any>) => {
          if (result.code === ResultCodeEnum.success) {
            this.isVisible = false;
          } else {
            this.$message.error(result.msg);
          }
        });
    }
  }

  /**
   * 新建分组并添加分组信息
   */
  public addGroupInfo(): void {
    let para;
    if (this.formStatus.getData('groupName')) {
      para = {
        groupInfo: {
          groupName: this.formStatus.getData('groupName'),
          remark: this.remarkValue
        },
        groupDeviceInfoIdList: this.selectDeviceId,
        groupEquipmentIdList: this.selectEquipmentId,
      };
      this.$IndexFacilityService.addGroupInfo(para)
        .subscribe((result: ResultModel<any>) => {
          if (result.code === ResultCodeEnum.success) {
            this.isVisible = false;
          } else {
            this.$message.error(result.msg);
          }
        });
    }
  }

  /**
   * 根据当前图层加载表格数据
   */
  public getSelectListByLayer(): void {
    // 当前图层是设施时把缓存数据渲染到表格
    if (this.indexType === IndexLayeredTypeEnum.facility) {
      this.dataSet = [];
    }

    // 当前图层是设备时把缓存数据渲染到表格
    if (this.indexType === IndexLayeredTypeEnum.device) {
      this.dataSet = [];
    }
  }

  /**
   * 解析选中的数据
   */
  public analysisSelectData(): void {
    // 设施图层
    if (this.indexType === IndexLayeredTypeEnum.facility) {
      console.log(this.allDeviceId);
      if (this.allDeviceId) {
        this.allDeviceId.forEach(f => {
          // 解析勾选表格设施ID
        });
      }
    }
    // 设备图层
    if (this.indexType === IndexLayeredTypeEnum.device) {
      if (this.allEquipmentId) {
        this.allEquipmentId.forEach(f => {
          // 解析勾选表格设备ID
        });
      }
    }
  }

  /**
   * 表单数据配置
   */
  private initColumn(): void {
    this.formColumn = [
      {
        label: this.indexLanguage.groupName,
        key: 'groupName',
        type: 'input',
        require: true,
        rule: [],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value =>
              this.$IndexFacilityService.checkGroupInfoByName(value),
            res => res.data)
        ]
      },
      {
        label: this.indexLanguage.remark,
        key: 'remark',
        type: 'custom',
        rule: [],
        asyncRules: [],
        template: this.textAreaTemp
      }
    ];
  }

  /**
   * 表单回调函数
   */
  public formInstance(event): void {
    this.formStatus = event.instance;
  }

}
