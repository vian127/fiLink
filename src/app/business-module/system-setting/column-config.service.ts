import {NzI18nService} from 'ng-zorro-antd';
import {ColumnConfig} from '../../shared-module/entity/tableConfig';
import {Injectable, NgModule} from '@angular/core';
import {FormItem} from '../../shared-module/component/form/form-config';
import {BasicConfig} from '../basic-config';
import {AsyncRuleUtil} from '../../shared-module/util/async-rule-util';
import {RuleUtil} from '../../shared-module/util/rule-util';
import {MenuManageService} from '../../core-module/api-service/system-setting';
import {Result} from '../../shared-module/entity/result';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ColumnConfigService extends BasicConfig {
  constructor( public $nzI18n: NzI18nService,
               public $asyncRuleUtil: AsyncRuleUtil,
               private $ruleUtil: RuleUtil,
               private $systemSettingService: MenuManageService) {
    super($nzI18n);
  }

  /**
   * 获取菜单管理列表列配置
   */
  getSystemSettingColumnConfig(tempalteObj: any): Array<ColumnConfig> {
    const config: Array<ColumnConfig> = [
      {type: 'select', width: 62, fixedStyle: {fixedLeft: true, style: {left: '0px'}}},
      {
        title: this.language.systemSetting.menuTemplateName,
        fixedStyle: {fixedLeft: true, style: {left: '124px'}},
        key: 'templateName',
        width: 150,
        searchable: true,
        isShowSort: true,
        configurable: false,
        searchConfig: {type: 'input'}
      },
      {
        title: this.language.systemSetting.menuTemplateStatus,
        key: 'templateStatus',
        configurable: true,
        width: 150,
        minWidth: 120,
        searchable: true,
        isShowSort: true,
        type: 'render',
        renderTemplate: tempalteObj.templateStatus,
        searchConfig: {
          type: 'select',
          selectInfo: [{label: this.language.systemSetting.prohibit, value: '0'}, {
            label: this.language.systemSetting.selectEnable,
            value: '1'
          }],
          label: 'label', value: 'value'
        }
      },
      {
        title: this.language.systemSetting.cdate,
        key: 'createTimeTimestamp',
        configurable: true,
        pipe: 'date',
        width: 370,
        searchKey: 'createTime',
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'dateRang'},
      },
      {
        title: this.language.systemSetting.remark,
        key: 'remark',
        width: 200,
        configurable: true,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        title: this.language.table.operate, searchable: true,
        searchConfig: {type: 'operate'}, key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ];
    return config;
  }

  /**
   * 获取菜单管理表单列配置
   */
  getSystemSettingAddColumn(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.menuTemplateName,
        key: 'templateName',
        type: 'input',
        initialValue: initData.templateName || '',
        require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          {
            asyncRule: (control: FormControl) => {
              return Observable.create(observer => {
                this.$systemSettingService.queryMenuExists({
                  templateName: control.value,
                  menuTemplateId: initData.menuTemplateId
                })
                  .subscribe((result: Result) => {
                    if (result.code === 0) {
                      observer.next(null);
                      observer.complete();
                    } else {
                      observer.next({error: true, duplicated: true});
                      observer.complete();
                    }
                  });
              });
            },
            asyncCode: 'duplicated', msg: this.language.systemSetting.nameExists
          }
        ]
      },
      {
        label: this.language.systemSetting.menuId,
        key: 'menuInfoTrees',
        type: 'custom',
        labelHeight: 400,
        require: true,
        rule: [],
        asyncRules: [],
        template: initData.menuTreeTemplate
      },
      {
        label: this.language.systemSetting.remark, key: 'remark', type: 'input',
        initialValue: initData.remark || '',
        rule: [{maxLength: 255}]
      },
      {
        label: this.language.systemSetting.enable, key: 'templateStatus', type: 'radio',
        initialValue: initData.templateStatus || '1',
        radioInfo: {
          data: [{
            label: this.language.systemSetting.selectEnable,
            value: '1'
          },
            {
              label: this.language.systemSetting.prohibit,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        },
        rule: [], asyncRules: []
      },
    ];

    return formColumn;
  }

  /**
   * 获取设施协议列表配置
   * param tempalteObj
   */
  getLogManagementColumnConfig(tempalteObj: any): Array<ColumnConfig> {
    const config: Array<ColumnConfig> = [
      {type: 'select', width: 62, fixedStyle: {fixedLeft: true, style: {left: '0px'}}},
      {
        title: this.language.systemSetting.optName,
        key: 'optName',
        width: 150,
        configurable: false,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'},
        fixedStyle: {fixedLeft: true, style: {left: '124px'}}
      },
      {
        title: this.language.systemSetting.optType,
        key: 'optType',
        configurable: true,
        width: 150,
        searchable: true,
        isShowSort: true,
        type: 'render',
        renderTemplate: tempalteObj.optType,
        searchConfig: {
          type: 'select',
          selectInfo: [{
            label: this.language.log.web,
            value: 'web'
          }, {
            label: this.language.log.pda,
            value: 'pda'
          }]
        }
      },
      {
        title: this.language.systemSetting.dangerLevel,
        key: 'dangerLevel',
        configurable: true,
        width: 120,
        isShowSort: true,
        searchable: true,
        minWidth: 80,
        type: 'render',
        renderTemplate: tempalteObj.dangerLevel,
        searchConfig: {
          type: 'select',
          selectType: 'multiple',
          selectInfo: [{
            label: this.language.log.danger,
            value: 3
          }, {
            label: this.language.log.general,
            value: 2
          }, {
            label: this.language.log.prompt,
            value: 1
          }]
        }
      },
      {
        title: this.language.systemSetting.optUserName,
        key: 'optUserName',
        configurable: true,
        width: 120,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        title: this.language.systemSetting.optTerminal,
        key: 'optTerminal',
        configurable: true,
        width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        title: this.language.systemSetting.optTime,
        key: 'optTime',
        configurable: true,
        width: 200,
        pipe: 'date',
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'dateRang'}
      },
      {
        title: this.language.systemSetting.optObj,
        key: 'optObj',
        configurable: true,
        width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        title: this.language.systemSetting.optResult,
        key: 'optResult',
        configurable: true,
        width: 120,
        isShowSort: true,
        searchable: true,
        type: 'render',
        renderTemplate: tempalteObj.optResult,
        searchConfig: {
          type: 'select',
          selectInfo: [{
            label: this.language.log.failure,
            value: 'failure'
          }, {
            label: this.language.log.success,
            value: 'success'
          }]
        }
      },
      {
        title: this.language.systemSetting.detailInfo,
        key: 'detailInfo',
        configurable: true,
        width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        title: this.language.systemSetting.remark,
        key: 'remark',
        configurable: true,
        width: 200,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        title: this.language.table.operate, searchable: true,
        searchConfig: {type: 'operate'}, key: '', width: 80, fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ];
    return config;
  }

  /**
   * 获取设施协议列配置
   */
  getFacilityColumnConfig(tempalteObj: any) {
    const config: Array<ColumnConfig> = [
      {type: 'select', width: 62, fixedStyle: {fixedLeft: true, style: {left: '0px'}}},
      {
        title: this.language.agreement.protocolName,
        key: 'protocolName',
        searchable: true,
        isShowSort: true,
        configurable: true,
        width: 150,
        searchConfig: {type: 'input'}
      },
      {
        title: this.language.agreement.hardwareVersion,
        key: 'hardwareVersion',
        searchable: true,
        isShowSort: true,
        configurable: true,
        width: 150,
        searchConfig: {
          type: 'input',
        }
      },
      {
        title: this.language.agreement.softwareVersion,
        key: 'softwareVersion',
        configurable: true,
        searchable: true,
        isShowSort: true,
        width: 150,
        searchConfig: {type: 'input'}
      },
      {
        title: this.language.systemSetting.scriptFile,
        key: 'fileName',
        configurable: true,
        searchable: true,
        isShowSort: true,
        width: 150,
        type: 'render',
        renderTemplate: tempalteObj.fileName,
        searchConfig: {type: 'input'}
      },
      {
        title: this.language.table.operate, searchable: true,
        searchConfig: {type: 'operate'}, key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ];
    return config;
  }

  /**
   * 获取安全策略列表
   * param tempalteObj
   */
  getAccessControlColumnConfig(tempalteObj: any) {
    const config: Array<ColumnConfig> = [
      {type: 'select', width: 62, fixedStyle: {fixedLeft: true, style: {left: '0px'}}},
      {
        title: this.language.systemSetting.startIp,
        key: 'startIp',
        searchable: true,
        isShowSort: true,
        configurable: false,
        width: 150,
        searchConfig: {
          type: 'input',
        }
      },
      {
        title: this.language.systemSetting.endIp,
        key: 'endIp',
        searchable: true,
        isShowSort: true,
        configurable: false,
        width: 150,
        searchConfig: {
          type: 'input',
        }
      },
      {
        title: this.language.systemSetting.statue,
        key: 'rangeStatus',
        width: 150,
        type: 'render',
        searchable: true,
        isShowSort: true,
        minWidth: 120,
        configurable: true,
        renderTemplate: tempalteObj.statue,
        searchConfig: {
          type: 'select',
          selectInfo: [{label: this.language.systemSetting.prohibit, value: '0'}, {
            label: this.language.systemSetting.selectEnable,
            value: '1'
          }]
        }
      },
      {
        title: this.language.systemSetting.mask,
        key: 'mask',
        searchable: true,
        isShowSort: true,
        configurable: true,
        width: 150,
        searchConfig: {type: 'input'}
      },
      {
        title: this.language.table.operate,
        searchable: true,
        searchConfig: {type: 'operate'}, key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ];
    return config;
  }

  /**
   * 获取安全策略表单配置
   * param initData
   */
  getAccessControlFormConfig(initData, ipTpl): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.IPRules,
        key: 'ipType',
        type: 'select',
        require: true,
        selectInfo: {
          data: [{
            label: 'IPV4',
            value: 'ipv4'
          },
            {
              label: 'IPV6',
              value: 'ipv6'
            }],
          label: 'label',
          value: 'value'
        },
        col: 24,
        rule: [],
        initialValue: 'ipv4',
        modelChange: ipTpl.modelChange
      },
      {
        label: this.language.systemSetting.startIp,
        key: 'startIp',
        col: 24,
        width: 950,
        require: true,
        type: 'custom',
        template: ipTpl.startIPV4Template,
        rule: [],
        // IPV4 IPV6校验待定
        asyncRules: [this.$asyncRuleUtil.IPV4Reg(this.language.systemSetting.serviceInterfaceAddressFormatIncorrect)]
      },
      {
        label: this.language.systemSetting.endIp,
        key: 'endIp',
        col: 24,
        width: 950,
        type: 'custom',
        require: true,
        template: ipTpl.endIPV4Template,
        rule: [],
        // IPV4 IPV6校验待定
        asyncRules: [this.$asyncRuleUtil.IPV4Reg(this.language.systemSetting.serviceInterfaceAddressFormatIncorrect)]
      },
      {
        label: this.language.systemSetting.mask,
        key: 'mask',
        type: 'custom',
        require: true,
        col: 24,
        width: 750,
        template: ipTpl.maskIpv4Template,
        rule: []
      },
    ];

    return formColumn;
  }

  /**
   * 获取账号安全策略表单配置
   * param initData
   */
  getIDAccessControlFormConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.userMinLength,
        key: 'minLength',
        type: 'input',
        require: true,
        col: 24,
        labelWidth: 240,
        rule: [{require: true}, {min: 6}, {max: 18}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      {
        label: this.language.systemSetting.illegalLoginCount,
        key: 'illegalLoginCount',
        labelWidth: 240,
        col: 24,
        require: true,
        type: 'input',
        rule: [{require: true}, {min: 5}, {max: 99}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      {
        label: this.language.systemSetting.intervalTime,
        key: 'intervalTime',
        labelWidth: 240,
        require: true,
        col: 24,
        type: 'input',
        rule: [{require: true}, {min: 1}, {max: 99}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      {
        label: this.language.systemSetting.lockStrategy,
        key: 'lockStrategy',
        type: 'radio',
        radioInfo: {
          data: [{
            label: this.language.systemSetting.selectEnable,
            value: '1'
          },
            {
              label: this.language.systemSetting.discontinueUse,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        },
        labelWidth: 240,
        col: 24,
        rule: [],
        modelChange: initData.modelChange,
      },
      {
        label: this.language.systemSetting.lockedTime,
        key: 'lockedTime',
        labelWidth: 240,
        type: 'input',
        col: 24,
        rule: [{require: true}, {min: 5}, {max: 1440}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      {
        label: this.language.systemSetting.forbidStrategy,
        key: 'forbidStrategy',
        labelWidth: 240,
        type: 'radio',
        radioInfo: {
          data: [{
            label: this.language.systemSetting.selectEnable,
            value: '1'
          },
            {
              label: this.language.systemSetting.discontinueUse,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        },
        col: 24,
        rule: [],
        modelChange: initData.modelChange,
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      {
        label: this.language.systemSetting.noLoginTime,
        key: 'noLoginTime',
        labelWidth: 240,
        type: 'input',
        col: 24,
        rule: [{require: true}, {min: 1}, {max: 1000}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      {
        label: this.language.systemSetting.noOperationTime,
        key: 'noOperationTime',
        require: true,
        labelWidth: 240,
        type: 'input',
        col: 24,
        rule: [{require: true}, {min: 1}, {max: 99}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
    ];

    return formColumn;
  }

  /**
   * 获取密码安全策略表格配置
   * param initData
   */
  getPasswordAccessControlFormConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.passwordMinLength,
        key: 'minLength',
        require: true,
        type: 'input',
        labelWidth: 200,
        col: 24,
        initialValue: initData.minLength || '',
        rule: [{require: true}, {min: 6}, {max: 18}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      {
        label: this.language.systemSetting.containUpper,
        key: 'containUpper',
        labelWidth: 200,
        col: 24,
        type: 'select',
        selectInfo: {
          data: [{
            label: this.language.systemSetting.selectEnable,
            value: '1'
          },
            {
              label: this.language.systemSetting.discontinueUse,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        },
        initialValue: initData.containUpper || '',
        rule: [],
        asyncRules: [],
      },
      {
        label: this.language.systemSetting.containLower,
        key: 'containLower',
        labelWidth: 200,
        col: 24,
        type: 'select',
        selectInfo: {
          data: [{
            label: this.language.systemSetting.selectEnable,
            value: '1'
          },
            {
              label: this.language.systemSetting.discontinueUse,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        },
        initialValue: initData.containLower || '',
        rule: [],
        asyncRules: [],
      },
      {
        label: this.language.systemSetting.containNumber,
        key: 'containNumber',
        labelWidth: 200,
        type: 'select',
        selectInfo: {
          data: [{
            label: this.language.systemSetting.selectEnable,
            value: '1'
          },
            {
              label: this.language.systemSetting.discontinueUse,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        },
        col: 24,
        initialValue: initData.containNumber || '',
        rule: []
      },
      {
        label: this.language.systemSetting.containSpecialCharacter,
        key: 'containSpecialCharacter',
        labelWidth: 200,
        type: 'select',
        selectInfo: {
          data: [{
            label: this.language.systemSetting.selectEnable,
            value: '1'
          },
            {
              label: this.language.systemSetting.discontinueUse,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        },
        col: 24,
        initialValue: initData.containSpecialCharacter || '',
        rule: []
      }
    ];
    return formColumn;
  }

  /**
   * 获取系统参数 显示设置表单配置
   * param initData
   */
  getShowSystemParameterFormConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.enableLargeScreen,
        key: 'screenDisplay',
        type: 'radio',
        radioInfo: {
          data: [{
            label: this.language.systemSetting.selectEnable,
            value: '1'
          },
            {
              label: this.language.systemSetting.discontinueUse,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        },
        labelWidth: 200,
        col: 24,
        modelChange: initData.modelChange,
        initialValue: initData.code || '',
        rule: [],
      },
      {
        label: this.language.systemSetting.bigScreenScroll,
        key: 'screenScroll',
        labelWidth: 200,
        col: 24,
        type: 'radio',
        radioInfo: {
          data: [{
            label: this.language.systemSetting.selectEnable,
            value: '1'
          },
            {
              label: this.language.systemSetting.discontinueUse,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        },
        modelChange: initData.modelChange,
        rule: [],
      },
      {
        label: this.language.systemSetting.largeScreenScrollTimeInterval,
        key: 'screenScrollTime',
        labelWidth: 200,
        col: 24,
        require: true,
        type: 'input',
        rule: [{require: true}, {min: 10}, {max: 60}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      {
        label: this.language.systemSetting.firstLoadingThresholdOfHomePage,
        key: 'homeDeviceLimit',
        labelWidth: 200,
        col: 24,
        require: true,
        type: 'input',
        rule: [{require: true}, {min: 100}, {max: 100000}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      {
        label: this.language.systemSetting.systemLanguage,
        key: 'systemLanguage',
        labelWidth: 200,
        col: 24,
        type: 'select',
        selectInfo: {
          data: initData.languageAll,
          label: 'label',
          value: 'value'
        },
        rule: [],
      },
      {
        label: this.language.systemSetting.systemLogo,
        key: 'logo',
        labelWidth: 200,
        type: 'custom',
        template: initData.logo,
        col: 24,
        rule: []
      },
      {
        label: this.language.systemSetting.timeSetting,
        key: 'timeType',
        labelWidth: 200,
        type: 'radio',
        initialValue: initData.mask || '1',
        radioInfo: {
          data: [{
            label: this.language.systemSetting.localTime,
            value: 'local'
          },
            {
              label: this.language.systemSetting.UTCTime,
              value: 'universal'
            }],
          label: 'label',
          value: 'value'
        },
        col: 24,
        rule: []
      },
    ];

    return formColumn;
  }

  /**
   * 获取系统参数 消息通知表单配置
   * param initData
   */
  getMsgSystemParameterFormConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.enableMessageAlerts,
        key: 'messageRemind',
        labelWidth: 200,
        type: 'radio',
        radioInfo: {
          data: [{
            label: this.language.systemSetting.selectEnable,
            value: '1'
          },
            {
              label: this.language.systemSetting.discontinueUse,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        },
        col: 24,
        rule: [],
        modelChange: initData.modelChange
      },
      {
        label: this.language.systemSetting.messageRetentionTime,
        key: 'retentionTime',
        labelWidth: 200,
        col: 24,
        type: 'input',
        rule: [{require: true}, {min: 1}, {max: 10}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      {
        label: this.language.systemSetting.enableSoundReminder,
        key: 'soundRemind',
        labelWidth: 200,
        type: 'radio',
        radioInfo: {
          data: [{
            label: this.language.systemSetting.selectEnable,
            value: '1'
          },
            {
              label: this.language.systemSetting.discontinueUse,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        },
        col: 24,
        rule: [],
        modelChange: initData.modelChange
      },
      {
        label: this.language.systemSetting.selectedReminders,
        key: 'soundSelected',
        labelWidth: 200,
        type: 'select',
        col: 24,
        selectInfo: {
          data: [
            {label: 'a.mp3', value: 'a.mp3'},
            {label: 'b.mp3', value: 'b.mp3'},
            {label: 'c.mp3', value: 'c.mp3'},
            {label: 'd.mp3', value: 'd.mp3'},
            {label: 'e.mp3', value: 'e.mp3'},
            {label: 'f.mp3', value: 'f.mp3'},
            {label: 'g.mp3', value: 'g.mp3'}
          ],
          label: 'label',
          value: 'value'
        },
        rule: [],
        openChange: (a, b, c) => {
          const srcPath = 'assets/audio';
          if (b) {
            initData.play.pause();
          } else {
            if (a.soundSelected.value) {
              const muiscPath = `${srcPath}/${a.soundSelected.value}`;
              initData.play.src = muiscPath;
              initData.play.play();
            }
          }
        }
      },
    ];

    return formColumn;
  }

  /**
   * 获取系统参数 邮件服务器表单配置
   * param initData
   */
  getEmailSystemParameterFormConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: 'AccessKey ID',
        key: 'accessKeyId',
        type: 'input',
        labelWidth: 200,
        col: 24,
        rule: [{require: true}],
        require: true,
        asyncRules: [this.$asyncRuleUtil.mailReg(this.language.systemSetting.CharactersCannotExceed32Bits)]
      },
      {
        label: 'Access Key Secret',
        key: 'accessKeySecret',
        labelWidth: 200,
        col: 24,
        type: 'input',
        require: true,
        rule: [{require: true}],
        asyncRules: [this.$asyncRuleUtil.mailReg(this.language.systemSetting.CharactersCannotExceed32Bits)]
      },
      {
        label: this.language.systemSetting.testEmailAddress,
        key: 'toAddress',
        labelWidth: 200,
        col: 24,
        type: 'input',
        require: false,
        rule: [{maxLength: 255}],
        asyncRules: [this.$asyncRuleUtil.emailRegExp()]
      }
    ];

    return formColumn;
  }

  /**
   * 获取系统参数 短信服务表单配置
   * param initData
   */
  getNoteSystemParameterFormConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: 'AccessKey ID',
        key: 'accessKeyId',
        type: 'input',
        labelWidth: 200,
        col: 24,
        require: true,
        rule: [{require: true}],
        asyncRules: [this.$asyncRuleUtil.mailReg(this.language.systemSetting.CharactersCannotExceed32Bits)]
      },
      {
        label: 'Access Key Secret',
        key: 'accessKeySecret',
        labelWidth: 200,
        labelHeight: 60,
        col: 24,
        type: 'input',
        rule: [{require: true}],
        require: true,
        asyncRules: [this.$asyncRuleUtil.mailReg(this.language.systemSetting.CharactersCannotExceed32Bits)]
      }
    ];

    return formColumn;
  }

  /**
   * 获取系统参数 推送服务表单配置
   * param initData
   */
  getPushSystemParameterFormConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: 'AccessKey ID',
        key: 'accessKeyId',
        type: 'input',
        labelWidth: 200,
        col: 24,
        rule: [{require: true}],
        require: true,
        asyncRules: [this.$asyncRuleUtil.mailReg(this.language.systemSetting.CharactersCannotExceed32Bits)]
      },
      {
        label: 'Access Key Secret',
        key: 'accessKeySecret',
        labelWidth: 200,
        col: 24,
        type: 'input',
        rule: [{require: true}],
        require: true,
        asyncRules: [this.$asyncRuleUtil.mailReg(this.language.systemSetting.CharactersCannotExceed32Bits)]
      }
    ];

    return formColumn;
  }

  /**
   * 获取系统参数 FTP服务表单配置
   * param initData
   */
  getFTPSystemParameterFormConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.FTPAddress,
        key: 'ipAddress',
        type: 'input',
        labelWidth: 200,
        require: true,
        col: 24,
        initialValue: initData.code || '',
        rule: [],
        asyncRules: [this.$asyncRuleUtil.IPV4Reg()]
      },
      {
        label: this.language.systemSetting.webFTPAddress,
        key: 'innerIpAddress',
        type: 'input',
        labelWidth: 200,
        require: true,
        col: 24,
        initialValue: initData.code || '',
        rule: [],
        asyncRules: [this.$asyncRuleUtil.IPV4Reg()]
      },
      {
        label: this.language.systemSetting.port,
        key: 'port',
        labelWidth: 200,
        require: true,
        col: 24,
        type: 'input',
        initialValue: initData.startIp || '',
        rule: [{require: true}, {min: 1}, {max: 65535}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      {
        label: this.language.systemSetting.userName,
        key: 'userName',
        labelWidth: 200,
        require: true,
        col: 24,
        type: 'input',
        initialValue: initData.endIp || '',
        rule: [{required: true}, {maxLength: 50}],
      },
      {
        label: this.language.systemSetting.password,
        key: 'password',
        labelWidth: 200,
        require: true,
        type: 'input',
        col: 24,
        rule: [{required: true}, {maxLength: 50}],
      },
      {
        label: this.language.systemSetting.breakTime,
        key: 'disconnectTime',
        labelWidth: 200,
        require: true,
        type: 'input',
        col: 24,
        initialValue: initData.mask || '',
        rule: [{require: true}, {min: 2}, {max: 5}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
    ];
    return formColumn;
  }

  /**
   * 获取关于配置
   * param initData
   */
  getAboutFormConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.systemVersionInformation,
        key: 'version',
        type: 'input',
        labelWidth: 160,
        col: 24,
        disabled: true,
        rule: [],
      },
      {
        label: this.language.systemSetting.versionInformation,
        key: 'copyright',
        labelWidth: 160,
        col: 24,
        type: 'input',
        disabled: true,
        rule: [],
        asyncRules: [],
      },
      {
        label: this.language.systemSetting.licensesAuthorizationStatus,
        key: 'license',
        labelWidth: 160,
        col: 24,
        type: 'input',
        disabled: true,
        rule: [],
        asyncRules: [],
      },
      {
        label: this.language.systemSetting.companyInformation,
        key: 'companyInfo',
        labelWidth: 160,
        type: 'input',
        disabled: true,
        col: 24,
        rule: []
      }
    ];
    return formColumn;
  }

  /**
   * 获取http服务表单配置
   */
  getHttpServeFormConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.serviceInterfaceAddress,
        key: 'ip',
        type: 'input',
        labelWidth: 160,
        col: 24,
        require: true,
        rule: [{require: true}, {minLength: 1}, {maxLength: 50}],
        placeholder: 'http://',
        asyncRules: [this.$asyncRuleUtil.HttpReg(this.language.common.typeIncorrect)]
      }
    ];
    return formColumn;
  }

  /**
   * 获取http客户端表单配置
   * param initData
   */
  getHttpClientFormConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.serviceInterfaceAddress,
        key: 'code',
        type: 'input',
        labelWidth: 160,
        col: 24,
        require: true,
        initialValue: initData.code || '',
        rule: [],
      },
      {
        label: this.language.systemSetting.servicePort,
        key: 'startIp',
        labelWidth: 160,
        col: 24,
        type: 'input',
        initialValue: initData.startIp || '',
        rule: [],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      {
        label: 'APIkey',
        key: 'endIp',
        labelWidth: 160,
        col: 24,
        type: 'input',
        initialValue: initData.endIp || '',
        rule: [],
        asyncRules: [],
      },
    ];
    return formColumn;
  }

  /**
   * 获取https服务表单配置
   * param initData
   */
  getHttpsServeFormConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.serviceInterfaceAddress,
        key: 'ip',
        type: 'input',
        labelWidth: 160,
        col: 24,
        require: true,
        placeholder: 'https://',
        rule: [{require: true}, {minLength: 1}, {maxLength: 50}],
        asyncRules: [this.$asyncRuleUtil.HttpsReg(this.language.common.typeIncorrect)]
      },
    ];
    return formColumn;
  }

  /**
   * 获取https客户端表单配置
   * param initData
   */
  getHttpsClientFormConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.serviceInterfaceAddress,
        key: 'code',
        type: 'input',
        require: true,
        labelWidth: 160,
        col: 24,
        initialValue: initData.code || '',
        rule: [],
      },
      {
        label: this.language.systemSetting.servicePort,
        key: 'startIp',
        labelWidth: 160,
        col: 24,
        type: 'input',
        initialValue: initData.startIp || '',
        rule: [],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      {
        label: 'APIkey',
        key: 'endIp',
        labelWidth: 160,
        col: 24,
        type: 'input',
        initialValue: initData.endIp || '',
        rule: [],
        asyncRules: [],
      },
      {
        label: this.language.systemSetting.certificateSettings,
        key: 'mask',
        labelWidth: 160,
        require: true,
        type: 'input',
        col: 24,
        initialValue: initData.mask || '',
        rule: []
      },
    ];
    return formColumn;
  }

  /**
   * 获取webservice服务表单配置
   */
  getWebserviceServeFormConfig(): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.serviceInterfaceAddress,
        key: 'ip',
        type: 'input',
        labelWidth: 160,
        col: 24,
        require: true,
        rule: [],
        asyncRules: [this.$asyncRuleUtil.IPV4Reg(this.language.systemSetting.serviceInterfaceAddressFormatIncorrect)]
      },
      {
        label: this.language.systemSetting.servicePort,
        key: 'port',
        labelWidth: 160,
        col: 24,
        type: 'input',
        rule: [{require: true}, {min: 1}, {max: 65535}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      {
        label: this.language.systemSetting.timeout,
        key: 'maxWait',
        labelWidth: 160,
        col: 24,
        type: 'input',
        rule: [{require: true}, {min: 30}, {max: 600}],
        asyncRules: [this.$asyncRuleUtil.mustInt()],
      },
    ];
    return formColumn;
  }

  /**
   * 获取webservice客户端表单配置
   * param initData
   */
  getWebserviceClientFormConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.serviceInterfaceAddress,
        key: 'code',
        type: 'input',
        require: true,
        labelWidth: 160,
        col: 24,
        initialValue: initData.code || '',
        rule: [],
      },
      {
        label: this.language.systemSetting.servicePort,
        key: 'startIp',
        labelWidth: 160,
        col: 24,
        type: 'input',
        initialValue: initData.startIp || '',
        rule: [],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      {
        label: 'APIkey',
        key: 'endIp',
        labelWidth: 160,
        col: 24,
        type: 'input',
        initialValue: initData.endIp || '',
        rule: [],
        asyncRules: [],
      },
    ];
    return formColumn;
  }

  /**
   * 获取license列表配置
   * param tempalteObj
   */
  getLicenseColumnConfig(templateObj: any) {
    const config: Array<ColumnConfig> = [
      {
        type: 'serial-number', width: 62, title: this.language.facility.serialNumber,
        fixedStyle: {fixedLeft: true, style: {left: '0'}}
      },
      {
        title: this.language.systemSetting.controlName,
        key: 'controlName',
        searchable: true,
        width: 150,
        searchConfig: {
          type: 'input',
        }
      },
      {
        title: this.language.systemSetting.controlDescription,
        key: 'controlDesc',
        searchable: true,
        width: 350,
        searchConfig: {type: 'input'}
      },
      {
        title: this.language.systemSetting.controlData,
        key: 'controlData',
        searchable: true,
        width: 150,
        searchConfig: {type: 'input'}
      },
      {
        title: this.language.systemSetting.consumptionValue,
        key: 'controlValue',
        searchable: true,
        width: 150,
        searchConfig: {type: 'input'},
        fixedStyle: {fixedRight: true, style: {right: '0'}}
      },
    ];
    return config;
  }

  agreementConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.protocolName,
        key: 'agreementName',
        type: 'input',
        require: true,
        col: 24,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$systemSettingService.checkDeviceProtocolNameRepeat(
            {protocolId: initData.protocolId, protocolName: value}),
            res => res.code === 0)
        ]
      },
      {
        label: this.language.systemSetting.scriptFile,
        key: 'file',
        type: 'custom',
        require: true,
        template: initData.uploads,
        col: 24,
        rule: []
      },
    ];
    return formColumn;
  }

  /**
   * 获取告警转储设置表单配置
   */
  getAlarmDumpSettingConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.enableAlarmDump,
        key: 'enableDump',
        type: 'radio',
        labelWidth: 160,
        col: 24,
        radioInfo: {
          data: [{
            label: this.language.systemSetting.using,
            value: '1'
          },
            {
              label: this.language.systemSetting.noUsing,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        },
        rule: [],
        modelChange: initData.modelChange,
      },
      {
        label: this.language.systemSetting.triggerCondition,
        key: 'triggerCondition',
        labelWidth: 160,
        col: 24,
        asyncRules: [],
        type: 'radio',
        rule: [],
        radioInfo: {
          data: [
            {label: this.language.systemSetting.dataOverrun, value: '0'},
            {label: this.language.systemSetting.executeMonthly, value: '1'},
          ],
          label: 'label',
          value: 'value'
        },
        modelChange: initData.modelChange,
      },
      {
        label: this.language.systemSetting.dumpQuantityThreshold,
        key: 'dumpQuantityThreshold',
        labelWidth: 160,
        col: 24,
        type: 'input',
        rule: [],
        customRules: [this.$ruleUtil.getDumpNumRule('1')]
      },
      {
        label: this.language.systemSetting.turnOutNumber,
        key: 'turnOutNumber',
        labelWidth: 160,
        type: 'input',
        col: 24,
        rule: [],
        customRules: [this.$ruleUtil.getDumpNumRule('0')]
      },
      {
        label: this.language.systemSetting.dumpInterval,
        key: 'dumpInterval',
        labelWidth: 160,
        type: 'input',
        col: 24,
        rule: [],
        customRules: [this.$ruleUtil.getDumpMonthRule()]
      },
      {
        label: this.language.systemSetting.dumpOperation,
        key: 'dumpOperation',
        labelWidth: 160,
        type: 'radio',
        col: 24,
        radioInfo: {
          data: [{
            label: this.language.systemSetting.removeFromTheDatabase,
            value: '0'
          },
            {
              label: this.language.systemSetting.reserved,
              value: '1'
            }],
          label: 'label',
          value: 'value'
        },
        modelChange: initData.modelChange,
        rule: []
      },
      {
        label: this.language.systemSetting.dumpPlace,
        key: 'dumpPlace',
        labelWidth: 160,
        type: 'select',
        col: 24,
        selectInfo: {
          data: [{
            label: this.language.systemSetting.dumpToLocal,
            value: '0'
          },
            {
              label: this.language.systemSetting.dumpToFileServer,
              value: '1'
            }],
          label: 'label',
          value: 'value'
        },
        rule: []
      }
    ];
    return formColumn;
  }

  /**
   * 获取系统日志转储表单配置
   */
  getSystemDumpSettingConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.enableSystemLogDump,
        key: 'enableDump',
        type: 'radio',
        labelWidth: 160,
        col: 24,
        modelChange: initData.modelChange,
        radioInfo: {
          data: [{
            label: this.language.systemSetting.using,
            value: '1'
          },
            {
              label: this.language.systemSetting.noUsing,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        },
        rule: [],
      },
      {
        label: this.language.systemSetting.triggerCondition,
        key: 'triggerCondition',
        labelWidth: 160,
        col: 24,
        asyncRules: [],
        type: 'radio',
        modelChange: initData.modelChange,
        rule: [],
        radioInfo: {
          data: [
            {label: this.language.systemSetting.dataOverrun, value: '0'},
            {label: this.language.systemSetting.executeMonthly, value: '1'},
          ],
          label: 'label',
          value: 'value'
        },
      },
      {
        label: this.language.systemSetting.dumpQuantityThreshold,
        key: 'dumpQuantityThreshold',
        labelWidth: 160,
        col: 24,
        type: 'input',
        rule: [],
        customRules: [this.$ruleUtil.getDumpNumRule('1')],
      },
      {
        label: this.language.systemSetting.turnOutNumber,
        key: 'turnOutNumber',
        labelWidth: 160,
        type: 'input',
        col: 24,
        rule: [],
        customRules: [this.$ruleUtil.getDumpNumRule('0')]
      },
      {
        label: this.language.systemSetting.dumpInterval,
        key: 'dumpInterval',
        labelWidth: 160,
        type: 'input',
        col: 24,
        rule: [],
        customRules: [this.$ruleUtil.getDumpMonthRule()]
      },
      {
        label: this.language.systemSetting.dumpOperation,
        key: 'dumpOperation',
        labelWidth: 160,
        type: 'radio',
        col: 24,
        modelChange: initData.modelChange,
        radioInfo: {
          data: [{
            label: this.language.systemSetting.removeFromTheDatabase,
            value: '0'
          },
            {
              label: this.language.systemSetting.reserved,
              value: '1'
            }],
          label: 'label',
          value: 'value'
        },
        rule: []
      },
      {
        label: this.language.systemSetting.dumpPlace,
        key: 'dumpPlace',
        labelWidth: 160,
        type: 'select',
        selectInfo: {
          data: [{
            label: this.language.systemSetting.dumpToLocal,
            value: '0'
          },
            {
              label: this.language.systemSetting.dumpToFileServer,
              value: '1'
            }],
          label: 'label',
          value: 'value'
        },
        col: 24,
        rule: []
      }
    ];
    return formColumn;
  }

  /**
   * 获取设施日志转储表单配置
   */
  getFacilityDumpSettingConfig(initData): FormItem[] {
    const formColumn: FormItem[] = [
      {
        label: this.language.systemSetting.enableFacilityLogDump,
        key: 'enableDump',
        type: 'radio',
        labelWidth: 160,
        col: 24,
        modelChange: initData.modelChange,
        radioInfo: {
          data: [{
            label: this.language.systemSetting.using,
            value: '1'
          },
            {
              label: this.language.systemSetting.noUsing,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        },
        rule: [],
      },
      {
        label: this.language.systemSetting.triggerCondition,
        key: 'triggerCondition',
        labelWidth: 160,
        col: 24,
        asyncRules: [],
        type: 'radio',
        modelChange: initData.modelChange,
        rule: [],
        radioInfo: {
          data: [
            {label: this.language.systemSetting.dataOverrun, value: '0'},
            {label: this.language.systemSetting.executeMonthly, value: '1'},
          ],
          label: 'label',
          value: 'value'
        },
      },
      {
        label: this.language.systemSetting.dumpQuantityThreshold,
        key: 'dumpQuantityThreshold',
        labelWidth: 160,
        col: 24,
        type: 'input',
        rule: [],
        customRules: [this.$ruleUtil.getDumpNumRule('1')],
      },
      {
        label: this.language.systemSetting.turnOutNumber,
        key: 'turnOutNumber',
        labelWidth: 160,
        type: 'input',
        col: 24,
        rule: [],
        customRules: [this.$ruleUtil.getDumpNumRule('0')]
      },
      {
        label: this.language.systemSetting.dumpInterval,
        key: 'dumpInterval',
        labelWidth: 160,
        type: 'input',
        col: 24,
        rule: [],
        customRules: [this.$ruleUtil.getDumpMonthRule()]
      },
      {
        label: this.language.systemSetting.dumpOperation,
        key: 'dumpOperation',
        labelWidth: 160,
        type: 'radio',
        col: 24,
        modelChange: initData.modelChange,
        radioInfo: {
          data: [{
            label: this.language.systemSetting.removeFromTheDatabase,
            value: '0'
          },
            {
              label: this.language.systemSetting.reserved,
              value: '1'
            }],
          label: 'label',
          value: 'value'
        },
        rule: []
      },
      {
        label: this.language.systemSetting.dumpPlace,
        key: 'dumpPlace',
        labelWidth: 160,
        type: 'select',
        selectInfo: {
          data: [{
            label: this.language.systemSetting.dumpToLocal,
            value: '0'
          },
            {
              label: this.language.systemSetting.dumpToFileServer,
              value: '1'
            }],
          label: 'label',
          value: 'value'
        },
        col: 24,
        rule: []
      }
    ];
    return formColumn;
  }
}
