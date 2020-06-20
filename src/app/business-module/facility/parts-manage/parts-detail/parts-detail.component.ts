import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-opearte.service';
import {Result} from '../../../../shared-module/entity/result';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityUtilService} from '../../share/service/facility-util.service';
import {getPartsType} from '../../share/const/facility.config';
import {TreeSelectorConfig} from '../../../../shared-module/entity/treeSelectorConfig';
import {TreeSelectorComponent} from '../../../../shared-module/component/tree-selector/tree-selector.component';
import {UserService} from '../../../../core-module/api-service/user/user-manage';
import {PartsService} from '../../../../core-module/api-service/facility/parts-manage/parts.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';


@Component({
  selector: 'app-parts-detail',
  templateUrl: './parts-detail.component.html',
  styleUrls: ['./parts-detail.component.scss']
})
export class PartsDetailsComponent implements OnInit, AfterViewInit {
  // 表单配置
  public formColumn: FormItem[] = [];
  // 表单状态
  public formStatus: FormOperate;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 区域选择器显示隐藏
  areaSelectVisible: boolean = false;
  // 页面类型
  pageType = 'add';
  // 页面标题
  pageTitle: string;
  // 是否加载
  isLoading = false;
  // 责任单位显示隐藏
  isVisible = false;
  // 已选责任单位
  selectUnitName: string = '';
  // 单位模板
  @ViewChild('department') private departmentTep;
  // 单位选择器模板
  @ViewChild('unitTreeSelector') private unitTreeSelector: TreeSelectorComponent;
  // 树选择器配置
  treeSelectorConfig: TreeSelectorConfig;
  // 树设置
  treeSetting = {};
  // 树数据
  treeNodes = [];
  // 责任人
  resultPerson = [];
  // 配件id
  partId = '';
  // 责任单位数据
  ckkId: any;

  selectorData: any = {parentId: '', accountabilityUnit: ''};

  constructor(private $nzI18n: NzI18nService,
              private $active: ActivatedRoute,
              private $userService: UserService,
              private $facilityUtilService: FacilityUtilService,
              private $partsService: PartsService,
              private $message: FiLinkModalService,
              private $router: Router,
              private $ruleUtil: RuleUtil,
  ) {
  }

  ngOnInit() {
    this.resultPerson = [{label: '请选择', value: ''}];
    this.language = this.$nzI18n.getLocaleData('facility');
    this.pageType = this.$active.snapshot.params.type;
    this.pageTitle = this.getPageTitle(this.pageType);
    this.initColumn();
    this.initTreeSelectorConfig();
    if (this.pageType !== 'add') {
      this.$active.queryParams.subscribe(params => {
        this.partId = params.partId;
        this.$partsService.queryPartsById(this.partId).subscribe((result: Result) => {
          this.ckkId = result.data.accountabilityUnit;
          this.selectUnitName = result.data.department;
          this.queryPersonList(result.data.accountabilityUnit);
          this.formStatus.resetData(result.data);
          this.queryDeptList().then(() => {
            this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, this.ckkId);
          });

        });
      });

    } else {
      this.queryDeptList();
    }
  }

  formInstance(event) {
    this.formStatus = event.instance;
    this.formStatus.group.controls['trustee'].disable();
  }

  ngAfterViewInit(): void {
    console.log('组件初始化');
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
      title: `${this.language.selectUnit}`,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: `${this.language.deptName}`, key: 'deptName', width: 100,
        },
        {
          title: `${this.language.deptLevel}`, key: 'deptLevel', width: 100,
        },
        {
          title: `${this.language.parentDept}`, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }

  private getPageTitle(type): string {
    let title;
    switch (type) {
      case'add':
        title = this.language.addParts;
        break;
      case 'update':
        title = this.language.updateParts;
        break;
    }
    return title;
  }

  private initColumn() {
    this.formColumn = [
      {
        label: this.language.partName,
        key: 'partName',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$partsService.partNameIsExsit(
            {partId: this.partId, partName: value}),
            res => res.code === 0)
        ]
        // asyncRules: [
        //   {
        //     asyncRule: (control: FormControl) => {
        //       return Observable.create(observer => {
        //         this.$partsService.partNameIsExsit({partName: control.value, partId: this.partId})
        //           .subscribe((result: Result) => {
        //             if (result.code === 0) {
        //               observer.next(null);
        //               observer.complete();
        //             } else {
        //               observer.next({error: true, duplicated: true});
        //               observer.complete();
        //             }
        //           });
        //       });
        //     },
        //     asyncCode: 'duplicated', msg: this.language.nameExists
        //   }
        // ]
      },
      {
        label: this.language.partsType,
        key: 'partType',
        type: 'select',
        selectInfo: {
          data: getPartsType(this.$nzI18n),
          label: 'label',
          value: 'code'
        },
        require: true,
        rule: [{required: true}], asyncRules: []
      },
      {
        label: this.language.department,
        key: 'accountabilityUnit',
        type: 'custom',
        require: true,
        rule: [],
        asyncRules: [],
        template: this.departmentTep
      },
      {
        label: this.language.person,
        key: 'trustee',
        type: 'select',
        selectInfo: {
          data: this.resultPerson,
          label: 'label',
          value: 'value'
        },
        openChange: (a, b, c) => {
          // if (this.resultPerson.length === 0 && b === true) {
          //   this.$message.error(this.language.pleaseSelectTheUnitToWhichYouBelong);
          // }
        },
        require: true,
        rule: [{required: true}], asyncRules: []
      },
      {
        label: this.language.remarks,
        key: 'remark',
        type: 'input',
        width: 300,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      }
    ];
  }


  /**
   * 打开责任单位选择器
   */
  showModal() {
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isVisible = true;
    // this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, this.ckkId);
  }

  /**
   * 责任单位选择结果
   * param event
   */

  selectDataChange(event) {
    this.selectUnitName = '';
    const selectArr = event.map(item => {
      this.selectUnitName += `${item.deptName},`;
      return item.id;
    });
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, selectArr);
    this.formStatus.resetControlData('accountabilityUnit', selectArr);
    this.queryPersonList(selectArr);
  }

  // selectDataChange(event) {
  //   this.selectUnitName = '';
  //   const selectArr = event.map(item => {
  //     this.selectUnitName += `${item.deptName},`;
  //     return item.id;
  //   });
  //   this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
  //   this.$facilityUtilService.setTreeNodesStatus(this.treeNodes, selectArr);
  //   this.formStatus.resetControlData('accountabilityUnit', selectArr);
  //   this.queryPersonList(selectArr);
  // }

  /**
   * 获取所有单位
   */
  queryDeptList() {
    return new Promise((resolve, reject) => {
      this.$userService.queryAllDepartment().subscribe((result: Result) => {
        this.treeNodes = result.data || [];
        resolve();
      });
    });
  }

  /**
   * 获取根据所属单位获取所属人
   */
  queryPersonList(selectData: string[]) {
    this.formColumn[3].selectInfo.data = [];
    this.formStatus.group.controls['trustee'].reset();
    this.formStatus.group.controls['trustee'].enable();
    this.$partsService.queryByDept({firstArrayParameter: selectData}).subscribe((result: Result) => {
      if (result.code === 0) {
        this.resultPerson = result.data;
        this.resultPerson.map(v => {
          v.label = v.userName;
          v.value = v.id;
        });
        if (this.resultPerson.length === 0) {
          this.$message.warning(this.language.noDepositaryUnderResponsibleUnit);
        } else {
          this.formStatus.group.controls['trustee'].enable();
        }
        this.resultPerson = [...this.resultPerson];
        this.formColumn[3].selectInfo.data = this.resultPerson;
      } else {
        this.formColumn[3].selectInfo.data = [];
        this.formStatus.group.controls['trustee'].reset();
      }
    }, () => {
      this.formColumn[3].selectInfo.data = [];
      this.formStatus.group.controls['trustee'].reset();
    });
  }

  // 点击返回
  goBack() {
    window.history.go(-1);
  }

  // 添加或修改配件
  addParts() {
    this.isLoading = true;
    if (this.pageType === 'add') {
      const data = this.formStatus.getData();
      this.$partsService.addParts(data).subscribe((result: Result) => {
        this.isLoading = false;
        if (result.code === 0) {
          this.$message.success(result.msg);
          this.$router.navigate(['/business/facility/facility-parts']).then();
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    } else {
      const data = this.formStatus.getData();
      data['partId'] = this.partId;
      this.$partsService.updatePartsById(data).subscribe((result: Result) => {
        this.isLoading = false;
        if (result.code === 0) {
          this.$message.success(result.msg);
          this.$router.navigate(['/business/facility/facility-parts']).then();
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    }
  }


}
