import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {ActivatedRoute, Router} from '@angular/router';
import {DateHelperService, NzI18nService, NzModalService} from 'ng-zorro-antd';
import {TroubleService} from '../../../../core-module/api-service/trouble';
import {Result} from '../../../../shared-module/entity/result';
import {ResultModel} from '../../../../core-module/model/result.model';
import {FaultLanguageInterface} from '../../../../../assets/i18n/fault/fault-language.interface';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmStoreService} from '../../../../core-module/store/alarm.store.service';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import * as TroubleListUtil from './trouble-list-util';
import {FilterCondition, QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {TroubleHintList} from '../../model/const/trouble-hint-list.const';
import {TroubleLevel} from '../../model/const/trouble-level.const';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {UserService} from '../../../../core-module/api-service/user/user-manage';
import {FacilityUtilService} from '../../../facility';
import {getAlarmLevel, getHandleStatus, getTroubleSource} from '../../../trouble/model/const/trouble.config';
import {TroubleModel} from '../../model/trouble.model';
import {TroubleFacilityConfig} from './trouble-facility/troubleFacilityConfig';
import {TroubleObjectConfig} from './trouble-equipment/troubleSelectorConfig';

@Component({
  selector: 'app-trouble-list',
  templateUrl: './trouble-list.component.html',
  styleUrls: ['./trouble-list.component.scss']
})
export class TroubleListComponent implements OnInit {
  // 故障处理状态
  @ViewChild('handleStatusTemp') handleStatusTemp: TemplateRef<any>;
  // 故障级别模板
  @ViewChild('troubleLevelTemp') troubleLevelTemp: TemplateRef<any>;
  // 故障类型
  @ViewChild('troubleTypeTemp') troubleTypeTemp: TemplateRef<any>;
  // 故障来源
  @ViewChild('troubleSourceTemp') troubleSourceTemp: TemplateRef<any>;
  // 表格组件引用
  @ViewChild('table') table: TableComponent;
  @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  // 故障设施
  @ViewChild('facilityTemp') facilityTemp: TemplateRef<any>;
  // 故障设备
  @ViewChild('equipmentTemp') equipmentTemp: TemplateRef<any>;
  // 告警国际化引用
  public language: FaultLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 表格数据
  public _dataSet: any = [];
  // 表格翻页对象
  public pageBean: PageBean = new PageBean(10, 1, 1);
  // 表格配置
  public tableConfig: TableConfig;
  // 查询条件
  public queryCondition: QueryCondition = new QueryCondition();
  // 遮罩加载
  public ifSpin: boolean = false;
  // 告警id
  public alarmId = null;
  // 设施id
  public deviceId = null;
  // token
  public token: string = '';
  // 用户信息
  public userInfo = {};
  // 用户id
  public userId: string = '';
  // 故障类型
  public troubleType = [];
  // 备注，模板查询是否可见
  public display = {
    remarkTable: false,
  };
  public Data = {};
  // 修改备注
  public checkRemark: any[];
  public isLoading: boolean = false;
  // 修改备注弹框
  public formColumnRemark: FormItem[] = [];
  public formStatusRemark: FormOperate;
  // 模板ID
  public templateId: any;
  // 卡片数据
  public sliderConfig = [];
  // 告警提示选择
  public troubleHintList = [];
  // 默认选中告警级别
  public troubleHintValue = 1;
  // 是否从slide进入标志
  public isClickSlider = false;
  // 单位过滤
  private filterValue: any;
  // 选择的单位名称
  public selectUnitName;
  // 单位下拉树设置
  public treeSetting;
  // 从别的页面跳告警的时候 无数据给提示只给一次
  public hasPrompt: boolean = false;
  public isVisible: boolean = false;
  public treeSelectorConfig: TreeSelectorConfig;
  private treeNodes: any = [];
  // 故障设施
  public troubleFacilityConfig: TroubleFacilityConfig;
  // 故障设备
  troubleObjectConfig: TroubleObjectConfig;
  // 故障类型
  private troubleTypeList: any = {};
  public isShowTable: boolean = false;
  public typeStatus: any = {};
  // 勾选的设施
  public checkTroubleData = {
    name: '',
    id: ''
  };
  // 勾选的设备
  public checkTroubleObject = {
    name: '',
    ids: [],
    type: '',
  };
  constructor(public $router: Router,
              public $nzI18n: NzI18nService,
              public $troubleService: TroubleService,
              public $message: FiLinkModalService,
              public $active: ActivatedRoute,
              public $alarmStoreService: AlarmStoreService,
              private $dateHelper: DateHelperService,
              private $ruleUtil: RuleUtil,
              private modalService: NzModalService,
              private $userService: UserService,
              private $facilityUtilService: FacilityUtilService) {
    this.language = this.$nzI18n.getLocaleData('fault');
    this.commonLanguage = $nzI18n.getLocaleData('common');
  }

  ngOnInit() {
    // 告警选择显示初始化
    this.troubleHintList = [
      {label: this.language.displayTroubleLevel, code: TroubleHintList.troubleLevelCode},
      {label: this.language.displayTroubleFacilityType, code: TroubleHintList.troubleFacilityTypeCode}
    ];
    // 表格配置初始化
    TroubleListUtil.initTableConfig(this);
    // 获取故障类型
    this.getTroubleType();
    // 获取用户信息
    if (SessionUtil.getToken()) {
      this.token = SessionUtil.getToken();
      this.userInfo = SessionUtil.getUserInfo();
      this.userId = this.userInfo['id'];
    }
    this.queryCondition.pageCondition.pageSize = this.pageBean.pageSize;
    this.queryCondition.pageCondition.pageNum = this.pageBean.pageIndex;
    this.refreshData();
    // 修改备注弹框
    this.initFormRemark();
    // 卡片请求, 默认请求故障级别
    this.queryDeviceTypeCount(TroubleHintList.troubleLevelCode);
    // 初始化单位下拉树
    this.initTreeSelectorConfig();
    // 初始化故障设施
    this.initTroubleObjectConfig();
    // 初始化故障设备
    this.initTroubleEquipmentConfig();
  }
  /**
   * 表格翻页
   */
  pageChange(event) {
    if (!this.templateId) {
      this.queryCondition.pageCondition.pageNum = event.pageIndex;
      this.queryCondition.pageCondition.pageSize = event.pageSize;
      this.refreshData();
    } else {
      const data = {
        queryCondition: {},
        pageCondition: {
          'pageNum': event.pageIndex,
          'pageSize': this.pageBean.pageSize
        }
      };
    }
  }

  /**
   * 备注配置
   */
  public initFormRemark() {
    this.formColumnRemark = [
      {
        // 备注
        label: this.language.remark,
        key: 'remark',
        type: 'textarea',
        width: 1000,
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }

  /**
   * 修改备注表单实例
   */
  formInstanceRemark(event) {
    this.formStatusRemark = event.instance;
  }

  /**
   * 获取当前告警列表信息
   */
  refreshData() {
    // this.ifSpin = true;
    this.tableConfig.isLoading = true;
    this.$troubleService.queryTroubleList(this.queryCondition).subscribe((res: ResultModel<TroubleModel>) => {
      // this.ifSpin = false;
      this.tableConfig.isLoading = false;
      this.giveList(res);
    }, () => {
      // this.ifSpin = false;
      this.tableConfig.isLoading = false;

    });
  }
  /**
   * 故障类型
   */
  public getTroubleType() {
    // this.ifSpin = true;
    this.$troubleService.queryTroubleType().subscribe((res: ResultModel<TroubleModel[]>) => {
      if (res.code === 0) {
        // this.ifSpin = false;
        const data = res.data || [];
        this.troubleTypeList = data.map(item => {
          return ({
            'label': item.value,
            'code': item.key,
          });
        });
        this.isShowTable = true;
        // 故障类型枚举
        if (data && data.length > 0) {
            data.forEach(item => {
              this.typeStatus[item.key] = item.value;
            });
        }
        TroubleListUtil.initTableConfig(this);
      }
    }, () => {
      // this.ifSpin = false;
    });
  }

  /**
   * 请求过来的数据 赋值到列表
   */
  giveList(res) {
    this.pageBean.Total = res.totalCount;
    this.tableConfig.isLoading = false;
    this.pageBean.pageIndex = res.pageNum;
    this.pageBean.pageSize = res.size;
    this._dataSet = res.data || [];
    // 从其他页面跳转到告警第一次没数据给出提示
    const hasId = this.$active.snapshot.queryParams.id || this.$active.snapshot.queryParams.deviceId;
    if ((!this.hasPrompt) && this._dataSet.length === 0 && hasId) {
      this.hasPrompt = true;
      this.$message.info(this.language.noCurrentAlarmData);
    }
    this._dataSet.forEach(item => {
      if (item.handleStatus !== 'uncommit' || item.handleStatus !== 'done') {
        item.isDelete = true;
      }
      // 判断故障列表操作按钮 禁启用
      item.isShowBuildOrder = item.alarmCode === 'orderOutOfTime' ? 'disabled' : true;
      item.isShowFlow = item.handleStatus === 'uncommit' ? 'disabled' : true;
    });
    this._dataSet = res.data.map(item => {
      item.style = this.$alarmStoreService.getAlarmColorByLevel(item.troubleLevel);
      item.handleStatusName = getHandleStatus(this.$nzI18n, item.handleStatus);
      item.troubleLevelName = getAlarmLevel(this.$nzI18n, item.troubleLevel);
      item.troubleSourceTypeName = getTroubleSource(this.$nzI18n, item.troubleSource);
      return item;
    });
  }
  /**
   * 路由跳转
   */
  private navigateToDetail(url, extras = {}) {
    this.$router.navigate([url], extras).then();
  }
  /**
   * 点击卡片，数据刷新
   * TroubleLevel 为告警级别
   * deviceType 为设施类型
   */
  sliderChange(event) {
    // 清空筛选条件
    // TroubleListUtil.clearData(this);
    // 判断点击的是不是故障总数,
    this.table.tableService.resetFilterConditions(this.table.queryTerm);
    // // 设置从slide进入的标志
    this.isClickSlider = true;
    // if (this.deviceId) {
    //   const filter = new FilterCondition('alarmSource');
    //   filter.operator = 'eq';
    //   filter.filterValue = this.deviceId;
    //   this.table.queryTerm.set('deviceId', filter);
    // }
    if (this.alarmId) {
      const filter = new FilterCondition('id');
      filter.operator = 'eq';
      filter.filterValue = this.alarmId;
      this.table.queryTerm.set('alarmId', filter);
    }
    // this.table.handleSetControlData('alarmCleanStatus', [alarmCleanStatus.noClean]);
    if (event.label === this.language.troubleSum) {
      this.table.handleSearch();
    } else {
      // 不是总数时，分为故障级别和设施类型
      // 先清空表格里面的查询条件
      this.table.searchDate = {};
      this.table.rangDateValue = {};
      if (event.type === 'troubleLevel') {
        this.table.handleSetControlData('troubleLevel', [(event.levelCode)]);
      } else {
        this.table.handleSetControlData('alarmSourceTypeId', [event.levelCode]);
      }
      this.table.handleSearch();
    }
  }

  /**
   * 滑块变化
   * param event
   */
  slideShowChange(event) {
    if (event) {
      this.tableConfig.outHeight = 108;
    } else {
      this.tableConfig.outHeight = 8;
    }
    this.table.calcTableHeight();
  }

  /**
   * 故障级别，故障对象类型切换
   */
  troubleHintValueModelChange() {
    if (this.troubleHintValue === TroubleHintList.troubleLevelCode) {
      this.queryDeviceTypeCount(TroubleHintList.troubleLevelCode);
    } else {
      this.queryDeviceTypeCount(TroubleHintList.troubleFacilityTypeCode);
    }
  }

  /**
   * 查询告警提示 设施类型总数
   * 1. 为告警级别
   * 2. 设施类型
   */
  private queryDeviceTypeCount(selectType: number) {
    this.sliderConfig = [];
    this.troubleType = [];
    if (selectType === TroubleHintList.troubleLevelCode) {
        const urgentAlarm = TroubleListUtil.cardDataAnalysis(this, 'urgentAlarmCount', 0);
        const mainAlarm = TroubleListUtil.cardDataAnalysis(this, 'mainAlarmCount', 0);
        const secondaryAlarm = TroubleListUtil.cardDataAnalysis(this, 'minorAlarmCount', 0);
        const promptAlarm = TroubleListUtil.cardDataAnalysis(this, 'hintAlarmCount', 0);
        this.troubleType = [urgentAlarm, mainAlarm, secondaryAlarm, promptAlarm];
        TroubleListUtil.assignmentCard(this, 'level');
        // 选择告警级别显示
        this.$troubleService.queryTroubleLevel(TroubleHintList.troubleLevelCode).subscribe((res: ResultModel<TroubleModel>) => {
          if (res['code'] === 0) {
            // tslint:disable-next-line:forin
            for ( const k in res['data']) {
              switch (k) {
                case 'troubleTotal':  // 总数
                  this.sliderConfig[0]['sum'] = res['data'].troubleTotal;
                  break;
                case 'troubleLevel1':  // 紧急
                  this.sliderConfig[1]['sum'] = res['data'].troubleLevel1 ? res['data'].troubleLevel1 : 0;
                  // tslint:disable-next-line:max-line-length
                  this.sliderConfig[1]['color'] = this.$alarmStoreService.getAlarmColorByLevel(TroubleLevel.urgentTroubleCode).backgroundColor;
                  break;
                case 'troubleLevel2':  // 主要
                  this.sliderConfig[2]['sum'] = res['data'].troubleLevel2 ? res['data'].troubleLevel2 : 0;
                  // tslint:disable-next-line:max-line-length
                  this.sliderConfig[2]['color'] = this.$alarmStoreService.getAlarmColorByLevel(TroubleLevel.mainTroubleCode).backgroundColor;
                  break;
                case 'troubleLevel3':  // 次要
                  this.sliderConfig[3]['sum'] = res['data'].troubleLevel3 ?　res['data'].troubleLevel3 : 0;
                  // tslint:disable-next-line:max-line-length
                  this.sliderConfig[3]['color'] = this.$alarmStoreService.getAlarmColorByLevel(TroubleLevel.minorTroubleCode).backgroundColor;
                  break;
                case 'troubleLevel4':  // 提示
                  this.sliderConfig[4]['sum'] = res['data'].troubleLevel4 ? res['data'].troubleLevel4 : 0;
                  // tslint:disable-next-line:max-line-length
                  this.sliderConfig[4]['color'] = this.$alarmStoreService.getAlarmColorByLevel(TroubleLevel.hintTroubleCode).backgroundColor;
                  break;
              }
            }
          }
        });
    } else {
        const Optical_Box = TroubleListUtil.cardDataAnalysis(this, 'opticalBok', 0);
        const Well = TroubleListUtil.cardDataAnalysis(this, 'well', 0);
        const Distribution_Frame = TroubleListUtil.cardDataAnalysis(this, 'distributionFrame', 0);
        const Junction_Box = TroubleListUtil.cardDataAnalysis(this, 'junctionBox', 0);
        const OUTDOOR_CABINET = TroubleListUtil.cardDataAnalysis(this, 'splittingBox', 0);
        const MULTI = TroubleListUtil.cardDataAnalysis(this, 'multi', 0);
        this.sliderConfig = [Optical_Box, Well, Distribution_Frame, Junction_Box, OUTDOOR_CABINET, MULTI];
        TroubleListUtil.assignmentCard(this, 'device');
        this.$troubleService.queryTroubleLevel(TroubleHintList.troubleFacilityTypeCode).subscribe((result: ResultModel<TroubleModel>) => {
          // 光交箱
          if (result['code'] === 0 ) {
            // tslint:disable-next-line:forin
              for (let k in result['data']) {
                switch (k) {
                  case 'troubleTotal': // 总数
                    this.sliderConfig[0]['sum'] = result['data'].troubleTotal ? result['data'].troubleTotal : 0;
                    break;
                  case 'opticalBox':  // 光交箱
                    this.sliderConfig[1]['sum'] = result['data'].opticalBox ? result['data'].opticalBox : 0;
                    break;
                  case 'manWell':  // 人井
                    this.sliderConfig[2]['sum'] = result['data'].manWell ? result['data'].manWell : 0;
                    break;
                  case 'patchPanel':  // 配线架
                    this.sliderConfig[3]['sum'] = result['data'].patchPanel ? result['data'].patchPanel : 0;
                    break;
                  case 'jointClosure': // 接头盒
                    this.sliderConfig[4]['sum'] = result['data'].jointClosure ? result['data'].jointClosure : 0;
                    break;
                  case 'outDoorCabinet': // 室外柜
                    this.sliderConfig[5]['sum'] = result['data'].outDoorCabinet ? result['data'].outDoorCabinet : 0;
                    break;
                }
              }
          }
        });
      }
  }
  /**
   * 打开责任单位选择器
   */
  showModal(filterValue) {
    if (this.treeSelectorConfig.treeNodes.length === 0) {
      this.queryDeptList().then((bool) => {
        if (bool === true) {
          this.filterValue = filterValue;
          if (!this.filterValue['filterValue']) {
            this.filterValue['filterValue'] = [];
          }
          this.treeSelectorConfig.treeNodes = this.treeNodes;
          this.isVisible = true;
        }
      });
    } else {
      this.isVisible = true;
    }
  }
  /**
   * 查询所有的区域
   */
  private queryDeptList() {
    return new Promise((resolve, reject) => {
      this.$userService.queryAllDepartment().subscribe((result: Result) => {
        this.treeNodes = result.data || [];
        resolve(true);
      }, (error) => {
        reject(error);
      });
    });
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
      // title: `${this.facilityLanguage.selectUnit}`,
      title: `测试`,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: '测试1', key: 'deptName', width: 100,
        },
        {
          title: '测试2', key: 'deptLevel', width: 100,
        },
        {
          title: '测试3', key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }
  /**
   * 责任单位选择结果
   * param event
   */
  selectDataChange(event) {
    let selectArr = [];
    this.selectUnitName = '';
    if (event.length > 0) {
      selectArr = event.map(item => {
        this.selectUnitName += `${item.deptName},`;
        return item.id;
      });
    } else {
    }
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    if (selectArr.length === 0) {
      this.filterValue['filterValue'] = null;
    } else {
      this.filterValue['filterValue'] = selectArr;
    }
    this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, selectArr);
  }
  /**
   * 跳转到详情
   * param url
   */
  private navigateToPath(url, extras = {}) {
    this.$router.navigate([url], extras).then();
  }

  /**
   * 删除故障
   *
   */
  deleteTrouble(ids) {
    this.$troubleService.deleteTrouble(ids).subscribe((result: ResultModel<TroubleModel>) => {
      if (result.code === 0) {
        this.tableConfig.isLoading = false;
        this.$message.success(result.msg);
        // 删除跳第一页
        this.queryCondition.pageCondition.pageNum = 1;
        this.troubleHintValueModelChange();
        this.refreshData();
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
  /**
   * 备注
   */
  troubleRemark() {
    const remarkData = this.formStatusRemark.getData().remark;
    const remark = remarkData ? remarkData : null;
    const ids = [];
    this.checkRemark.forEach(item => {
      ids.push(item.id);
    });
    const data = { troubleId: ids.join(), troubleRemark: remark };
    this.tableConfig.isLoading = true;
    this.$troubleService.troubleRemark(data).subscribe((res: ResultModel<TroubleModel>) => {
      if (res.code === 0) {
        this.refreshData();
        this.$message.success(res.msg);
      } else {
        this.$message.info(res.msg);
        this.tableConfig.isLoading = false;
      }
      this.display.remarkTable = false;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 判断是否可指派
   */
  isDesignate(selecteData) {
    let flag = true;
    if (selecteData && selecteData.length > 0) {
        for (let i = 0; i < selecteData.length; i++) {
          if (selecteData[i].handleStatus !== 'uncommit') {
            flag = false;
            break;
          }
        }
    }
    return flag;
  }
  /**
   * 判断是否可指派流程
   */
  isDesignateFlow(selecteData) {
    let flowId = null;
    if (selecteData && selecteData.length > 0) {
      for (let i = 0; i < selecteData.length; i++) {
        if (selecteData[i].handleStatus !== 'uncommit') {
          flowId = false;
          break;
        }
      }
    }
    return flowId;
  }
  /**
   * 故障设施
   */
  initTroubleObjectConfig() {
    this.troubleFacilityConfig = {
      clear: !this.checkTroubleData.id.length,
      facilityObject: (event) => {
        this.checkTroubleData = event;
      }
    };
  }
  /**
   * 故障设备
   */
  initTroubleEquipmentConfig() {
    this.troubleObjectConfig = {
      clear: !this.checkTroubleObject.ids.length,
      troubleObject: (event) => {
        this.checkTroubleObject = event;
      }
    };
  }
}

