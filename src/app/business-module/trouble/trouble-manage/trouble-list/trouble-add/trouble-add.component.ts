import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormOperate} from '../../../../../shared-module/component/form/form-opearte.service';
import { FaultLanguageInterface } from '../../../../../../assets/i18n/fault/fault-language.interface';
import {NzI18nService, NzModalService, NzTreeNode} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {Observable} from 'rxjs';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {
  getTroubleType,
  getAlarmLevel,
  getTroubleSource,
} from '../../../../facility/share/const/facility.config';
import {FacilityUtilService} from '../../../../facility';
import {Result} from '../../../../../shared-module/entity/result';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {TreeSelectorConfig} from '../../../../../shared-module/entity/treeSelectorConfig';
import {TroubleObjectConfig} from '../trouble-equipment/troubleSelectorConfig';
import {differenceInCalendarDays} from 'date-fns';
import {InspectionService} from '../../../../../core-module/api-service/work-order/inspection';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {TreeSelectorComponent} from '../../../../../shared-module/component/tree-selector/tree-selector.component';
import {UserUtilService} from '../../../../user/user-util.service';
import {TroubleService} from '../../../../../core-module/api-service/trouble/trouble-manage';
import {TroubleModel} from '../../../model/trouble.model';
import {TroubleFacilityConfig} from '../trouble-facility/troubleFacilityConfig';
@Component({
  selector: 'app-trouble-add',
  templateUrl: './trouble-add.component.html',
  styleUrls: ['./trouble-add.component.scss'],
  providers: [FacilityUtilService, UserUtilService]
})
export class TroubleAddComponent implements OnInit {
  // 故障设备
  @ViewChild('equipmentTemp') private equipmentTemp;
  // 故障设施
  @ViewChild('facilityTemp') private facilityTemp;
  // 状态
  @ViewChild('troubleStatusTemp') troubleStatusTemp: TemplateRef<any>;
  // 发生时间
  @ViewChild('happenDate') public happenDate: TemplateRef<any>;
  // 责任单位
  @ViewChild('department') private department;
  // 故障设备
  troubleObjectConfig: TroubleObjectConfig;
  // 勾选的设备
  public checkTroubleObject = {
    name: '',
    ids: [],
    type: '',
  };
  // 获取故障ID
  public troubleId: string;
  // 标题
  public pageTitle: string = '';
  // 判断当前页新增还是修改
  public pageType = 'add';
  // 区域名称
  public areaName = '';
  // 区域选择节点
  private areaNodes: any = [];
  // 单位弹窗展示
  public areaSelectVisible: boolean = false;
  // 区域选择器配置信息
  public areaSelectorConfig: any = new TreeSelectorConfig();
  // 责任单位选择器
  public selectorData: any = {parentId: '', accountabilityUnit: ''};
  public isLoading: boolean = false;
  // 接收发生时间的value
  public happenTime: any;
  // 获取当前日期
  public today: any = new Date();
  // 故障类型
  private troubleTypeList: any = [];
  // 单位数据
  private treeNodes: any = [];
  // 表单项
  public formColumn: FormItem[] = [];
  // 表单操作
  public formStatus: FormOperate;
  // 告警国际化引用
  public language: FaultLanguageInterface;
  // 设施语言包
  public facilityLanguage: FacilityLanguageInterface;
  // 遮罩层
  public ifSpin: boolean = false;
  // 故障设施
  public troubleFacilityConfig: TroubleFacilityConfig;
  // 勾选的设施
  public checkTroubleData = {
    deviceName: '',
    deviceId: '',
    deviceType: '',
    area: '',
    areaId: '',
  };
  public deptCode: string = '';
  constructor(
    public $nzI18n: NzI18nService,
    private $modal: NzModalService,
    public $facilityUtilService: FacilityUtilService,
    private $inspectionService: InspectionService,
    public $message: FiLinkModalService,
    public $router: Router,
    private $active: ActivatedRoute,
    private $userUtilService: UserUtilService,
    public $troubleService: TroubleService,
  ) {
    this.language = this.$nzI18n.getLocaleData('fault');
    this.facilityLanguage = this.$nzI18n.getLocaleData('facility');
  }

  ngOnInit() {
    this.$active.queryParams.subscribe(params => {
      this.troubleId = params.id;
      this.pageType = params.type;
      this.pageTitle = this.getPageTitle(this.pageType);
      // 故障类型
      this.getTroubleType();
      // 初始化故障设备
      this.initTroubleEquipmentConfig();
      // 初始化故障设施
      this.initTroubleFacilityConfig();
    });
  }

  /**
   * 获取数据回显
   */
  getUpdateData() {
    if (this.pageType !== 'add') {
      this.$troubleService.queryTroubleDetail(this.troubleId).subscribe((res: ResultModel<TroubleModel>) => {
        if (res.code === 0) {
          this.areaName = res.data.deptName;
          this.formStatus.resetData(res.data);
          this.formStatus.resetControlData('happenDate', new Date(res.data['happenTime']));
          // debugger
          this.$userUtilService.getDept().then((data: NzTreeNode[]) => {
            this.areaNodes = data || [];
            // 递归设置区域的选择情况
            this.$userUtilService.setAreaNodesStatus(this.areaNodes, res.data.deptId);
            this.initAreaSelectorConfig(data);
          });
        }
      }, (res) => {
        this.ifSpin = false;
        this.$message.success(res.msg);
      });
    } else {
      this.$userUtilService.getDept().then((data: NzTreeNode[]) => {
        this.areaNodes = data || [];
        this.initAreaSelectorConfig(data);
      });
    }
    this.initColumn();
  }
  /**
   * 获取页面类型(add/update)
   * param type
   * returns {string}
   */
  private getPageTitle(type): string {
    let title;
    switch (type) {
      case'add':
        title = `${this.language.add}${this.language.trouble}`;
        break;
      case 'update':
        title = `${this.language.trouble}${this.language.update}`;
        break;
    }
    return title;
  }

  /**
   * 故障类型
   */
  public getTroubleType() {
    this.ifSpin = true;
    this.$troubleService.queryTroubleType().subscribe((res: ResultModel<TroubleModel>) => {
      if (res.code === 0) {
        this.ifSpin = false;
        this.troubleTypeList = res.data;
        this.getUpdateData();
      }
    }, () => {
      this.ifSpin = false;
    });
  }

  /**
   * 过滤故障来源
   */
  getSource() {
    const sourceList = getTroubleSource(this.$nzI18n);
    let sourceData = [];
    if (typeof sourceList !== 'string') {
      sourceData = sourceList.filter(item => {
        return item.code !== 'alarm';
      });
    }
    return sourceData;
  }
  /**
   * 表单初始化
   */
  public initColumn() {
    const typeData = this.troubleTypeList;
    this.formColumn = [
      { // 故障类型
        label: this.language.troubleType,
        key: 'troubleType',
        require: true,
        type: 'select',
        selectInfo: {
          data: typeData,
          label: 'value',
          value: 'key',
        },
        rule: [{required: true}],
        modelChange: (controls, event, key, formOperate) => {
        }
      },
      { // 故障级别
        label: this.language.troubleLevel,
        key: 'troubleLevel',
        require: true,
        type: 'select',
        selectInfo: {
          data: getAlarmLevel(this.$nzI18n),
          label: 'label',
          value: 'code',
        },
        rule: [{required: true}],
        modelChange: (controls, event, key, formOperate) => {
        }
      },
      { // 故障来源
        label: this.language.troubleSource,
        key: 'troubleSource',
        require: true,
        type: 'select',
        selectInfo: {
          data: this.getSource(),
          label: 'label',
          value: 'code',
        },
        rule: [{required: true}],
        modelChange: (controls, event, key, formOperate) => {
        }
      },
      { // 责任单位
        label: this.language.deptName,
        key: 'deptId',
        type: 'custom',
        template: this.department,
        require: true,
        rule: [{required: true}],
        asyncRules: []
      },
      {// 故障设施
        label: this.language.troubleFacility,
        key: 'troubleFacility',
        type: 'custom',
        require: true,
        rule: [],
        inputType: '',
        template: this.facilityTemp,
      },
      {// 故障设备
        label: this.language.troubleEquipment,
        key: 'equipment',
        type: 'custom',
        inputType: '',
        rule: [],
        template: this.equipmentTemp,
      },
      {// 填报人
        label: this.language.reportUserName,
        key: 'reportUserName',
        type: 'input',
        inputType: '',
        rule: [],
      },
      {// 发生时间
        label: this.language.happenTime,
        key: 'happenDate',
        type: 'custom',
        require: true,
        template: this.happenDate,
        rule: [{required: true}],
        asyncRules: [{
          asyncRule: (control: any) => {
            return Observable.create(observer => {
                this.happenTime = control.value;
                if (true) {
                  observer.next(null);
                  observer.complete();
                } else {
                  observer.next({error: true, duplicated: true});
                  observer.complete();
                }
            });
          },
        }],
      },
      { // 故障描述
        label: this.language.troubleDescribe,
        key: 'troubleDescribe',
        type: 'input',
        inputType: '',
        rule: [],
      },
    ];
  }
  formInstance(event) {
    this.formStatus = event.instance;
  }
  /**
   *  起始日期不可选择小于当前日期
   */
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0 || CommonUtil.checkTimeOver(current);
  }

  /**
   * 打开单位选择器
   */
  showAreaSelectorModal() {
      this.areaSelectorConfig.treeNodes = this.areaNodes;
      this.areaSelectVisible = true;
  }
  /**
   * 区域选中结果
   * param event
   */
  areaSelectChange(event) {
    if (event[0]) {
      this.$userUtilService.setAreaNodesStatus(this.areaNodes, event[0].id);
      this.areaName = event[0].deptName;
      this.deptCode = event[0].deptCode;
      this.selectorData.parentId = event[0].id;
      this.formStatus.resetControlData('deptId', event[0].id);
    } else {
      this.$userUtilService.setAreaNodesStatus(this.areaNodes, null);
      this.areaName = '';
      this.deptCode = '';
      this.selectorData.parentId = null;
      this.formStatus.resetControlData('deptId', null);
    }
  }
  /**
   * 初始化区域选择器配置
   * param nodes
   */
  private initAreaSelectorConfig(nodes) {
    this.areaSelectorConfig = {
      width: '500px',
      height: '300px',
      title: this.language.unitSelect,
      treeSetting: {
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
      },
      treeNodes: nodes
    };
  }
  /**
   *新增故障
   */
  submit() {
    this.isLoading = true;
    const troubleObj = this.formStatus.getData();
    troubleObj.deviceId = troubleObj.troubleFacility['deviceId'];
    troubleObj.deviceName = troubleObj.troubleFacility['deviceName'];
    troubleObj.deviceType = troubleObj.troubleFacility['deviceType'];
    troubleObj.area = troubleObj.troubleFacility['area'];
    troubleObj.areaId = troubleObj.troubleFacility['areaId'];
    troubleObj.deptName = this.areaName;
    troubleObj.deptCode = this.deptCode;
    if (troubleObj.happenTime) {
      troubleObj['happenTime'] = CommonUtil.sendBackEndTime(new Date(troubleObj.happenTime).getTime());
    }
    if (this.pageType === 'add') {
      this.$troubleService.addTrouble(troubleObj).subscribe((res: ResultModel<TroubleModel>) => {
        if (res.code === 0) {
          this.$message.info(res.msg);
          this.$router.navigate(['business/trouble/trouble-list']).then();
        }
      }, () => {
        // this.ifSpin = false;
      });
    } else {
      this.$troubleService.updateTrouble(troubleObj).subscribe((res: ResultModel<TroubleModel>) => {
        console.log(res);
      }, () => {
        // this.ifSpin = false;
      });
    }
  }

  /**
   * 取消
   */
  cancel() {
    window.history.back();
  }
  /**
   * 故障设备
   */
  initTroubleEquipmentConfig() {
    this.troubleObjectConfig = {
      type: 'form',
      initialValue: this.checkTroubleObject, // 默认值
      troubleObject: (event) => {
        this.checkTroubleObject = event;
        const names = this.checkTroubleObject.name.split(',');
        const types = this.checkTroubleObject.type.split(',');
        const troubleEquipment = this.checkTroubleObject.ids.map((id, index) => {
          return {'equipmentName': names[index], 'equipmentId': id, 'equipmentType': types[index]};
        });
        this.formStatus.resetControlData('equipment', troubleEquipment);
      }
    };
  }
  /**
   * 故障设施
   */
  initTroubleFacilityConfig() {
    this.troubleFacilityConfig = {
      initialValue: this.checkTroubleData, // 默认值
      type: 'form',
      facilityObject: (event) => {
        this.checkTroubleData = event;
        const facilityData = {
          deviceName: this.checkTroubleData.deviceName,
          deviceId: this.checkTroubleData.deviceId,
          deviceType: this.checkTroubleData.deviceType,
          areaId: this.checkTroubleData.areaId,
          area: this.checkTroubleData.area,
        };
        this.formStatus.resetControlData('troubleFacility', facilityData);
      }
    };
  }
}
