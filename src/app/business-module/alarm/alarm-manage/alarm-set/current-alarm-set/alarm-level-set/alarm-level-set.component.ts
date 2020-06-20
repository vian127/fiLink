import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageBean} from '../../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../../shared-module/entity/tableConfig';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {FormItem} from '../../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../../shared-module/component/form/form-opearte.service';
import {AlarmService} from '../../../../../../core-module/api-service/alarm';
import {Result} from '../../../../../../shared-module/entity/result';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {QueryCondition} from '../../../../../../shared-module/entity/queryCondition';
import {AlarmLevelSetConfig} from './config';
import {AlarmStoreService} from '../../../../../../core-module/store/alarm.store.service';
import {CurrAlarmServiceService} from '../../../current-alarm/curr-alarm-service.service';
import {getAlarmLevel} from '../../../../../facility/share/const/facility.config';

/**
 * 告警设置 当前告警设置 告警级别设置
 */
@Component({
  selector: 'app-alarm-level-set',
  templateUrl: './alarm-level-set.component.html',
  styleUrls: ['./alarm-level-set.component.scss']
})
export class AlarmLevelSetComponent implements OnInit {
  // 表格数据源
  _dataSet = [];
  // 表格翻页实例
  pageBean: PageBean = new PageBean(10, 1, 1);
  // 表格配置项
  tableConfig: TableConfig;
  // 查询条件
  queryCondition: QueryCondition = new QueryCondition();
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 告警id
  alarmId: string = '';
  // 告警提示音播放次数
  countValue: number;
  // 告警编辑弹窗
  isVisible: boolean = false;
  // 提示音是否播放
  isPlay: boolean = false;
  // audio音频
  player1: any;
  player2: any;
  // 编辑弹窗表单项
  tableColumnEdit: FormItem[];
  // 编辑弹窗表单实例
  formStatus: FormOperate;
  // 告警颜色集合
  selectOptions: any[] = [];
  _selectOptions: any[] = [];
  // 选中的颜色值
  selectedColor;
  _selectedColor;
  // 告警颜色
  alarmColorObj = {};
  // 告警名称
  alarmName;
  // 表格告警级别模板
  @ViewChild('alarmLevelTemp') alarmLevelTemp: TemplateRef<any>;
  // 表格告警颜色模板
  @ViewChild('alarmColorTemp') alarmColorTemp: TemplateRef<any>;
  // 表格提示音模板
  @ViewChild('musicSwitchTemp') musicSwitchTemp: TemplateRef<any>;
  // 提示音播放次数模板
  @ViewChild('playCountTemp') playCountTemp: TemplateRef<any>;
  // 编辑表单里告警颜色选择模板
  @ViewChild('selectOptionsTemp') selectOptionsTemp: TemplateRef<any>;
  // 提示音是否播放模板
  @ViewChild('isPlayTemp') isPlayTemp;
  // 保存按钮加载
  isLoading: boolean = false;

  constructor(private $message: FiLinkModalService,
              private $router: Router,
              private $nzI18n: NzI18nService,
              private $alarmService: AlarmService,
              private $alarmStoreService: AlarmStoreService,
              private $curr: CurrAlarmServiceService,
              private el: ElementRef) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('alarm');
    // 告警颜色初始化配置
    this.initAlarmColor();
    // 初始化颜色选择项
    this.initSelectOptions();
    // 初始化表格配置
    this.initTableConfig();
    // 初始化表单配置
    this.initForm();
    // 查询数据
    this.refreshData();
    // 取得音频播放器对象
    this.player1 = this.el.nativeElement.querySelector('#music');
    this.player2 = this.el.nativeElement.querySelector('#audio');
  }

  /**
   * 分页数据刷新
   * param event
   */
  pageChange(event) {
    this.refreshData();
  }

  /**
   * 告警级别数据查询
   */
  private refreshData() {
    this.tableConfig.isLoading = true;
    this.$alarmService.queryAlarmLevelList(this.queryCondition).subscribe((res: Result) => {
      this.pageBean.Total = res.totalCount;
      this.tableConfig.isLoading = false;
      this._dataSet = res.data;
      this.changeSelectOptions(this._selectedColor);
      if (res.code === 0 && this._dataSet && this._dataSet[0]) {
        this.$alarmStoreService.alarm = this._dataSet.map(item => {
          item.color = this.alarmColorObj[item.alarmLevelColor];
          return item;
        });
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 告警级别颜色初始化
   */
  initAlarmColor() {
    AlarmLevelSetConfig.forEach(item => {
      this.alarmColorObj[item.value] = item;
    });
  }

  /**
   * 告警级别颜色选择项集合初始化
   */
  private initSelectOptions() {
    this._selectOptions = [];
    AlarmLevelSetConfig.forEach(item => {
      this._selectOptions.push({
        value: item.value,
        label: this.language[item.label],
        color: item.color,
        style: item.style
      });
    });
    this.selectOptions = this._selectOptions;
  }

  /**
   * 数据改变，颜色变化
   * param id
   */
  private changeSelectOptions(id) {
    const arr = this._dataSet.map(item => item.alarmLevelColor);
    this.selectOptions = this._selectOptions.filter(item => {
      return arr.indexOf(item.value) === -1 || item.value === id;
    });
  }

  /**
   * 表格配置初始化
   */
  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: false,
      primaryKey: '02-6-1',
      scroll: {x: '1000px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          title: this.language.alarmLevelCode, key: 'alarmLevelCode', width: 200,
          configurable: true,
          type: 'render',
          searchable: true,
          searchConfig: {type: 'input'},
          renderTemplate: this.alarmLevelTemp,
        },
        {
          title: this.language.alarmLevelColor, key: 'alarmLevelColor', width: 200,
          configurable: true,
          type: 'render',
          renderTemplate: this.alarmColorTemp,
        },
        {
          title: this.language.alarmLevelSound,
          key: 'alarmLevelSound',
          width: 200,
          configurable: true,
          type: 'render',
          searchable: true,
          searchConfig: {type: 'input'},
          renderTemplate: this.musicSwitchTemp
        },
        {
          title: this.language.isPlay, key: 'isPlay', width: 200,
          configurable: true,
          type: 'render',
          renderTemplate: this.isPlayTemp
        },
        {
          title: this.language.playCount, key: 'playCount', width: 200,
          configurable: true
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      searchReturnType: 'object',
      topButtons: [],
      operation: [
        {
          text: this.language.update,
          permissionCode: '02-3-1-2-2',
          className: 'iconfont fiLink-edit',
          handle: (data) => {
            this.alarmId = data.id;
            this._selectedColor = data.alarmLevelColor;
            this.changeSelectOptions(data.alarmLevelColor);
            this.isVisible = true;
            this.selectedColor = this._selectedColor;
            this.$alarmService.queryAlarmLevelById(this.alarmId).subscribe((res: Result) => {
              const alarmData = res.data;
              const counts = res.data.playCount;
              console.log('aaa', counts);
              this.formStatus.resetData(alarmData);
              this.countValue = counts;
            });
          }
        }
      ]
    };
  }


  /**
   * 初始化编辑告警级别表单设置信息
   */
  public initForm() {
    this.tableColumnEdit = [
      {
        label: this.language.alarmLevelCode, key: 'alarmLevelCode',
        type: 'select', require: false, col: 24,
        disabled: true,
        selectInfo: {
          data: [
            {label: this.language.urgentAlarm, value: '1'},
            {label: this.language.mainAlarm, value: '2'},
            {label: this.language.secondaryAlarm, value: '3'},
            {label: this.language.promptAlarm, value: '4'}
          ],
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, $event, key) => {
        },
        openChange: (a, b, c) => {

        },
        rule: [], asyncRules: []
      },
      {
        label: this.language.alarmLevelColor, key: 'alarmLevelColor',
        type: 'custom', require: false, col: 24,
        asyncRules: [],
        template: this.selectOptionsTemp,
        rule: [],
      },
      {
        label: this.language.alarmLevelSound, key: 'alarmLevelSound',
        type: 'select', require: false, col: 24,
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
        modelChange: (controls, $event, key) => {
        },
        openChange: (a, b, c) => {
          const srcPath = 'assets/audio';
          if (b) {
            this.player2.pause();
          } else {
            if (a.alarmLevelSound.value) {
              const muiscPath = `${srcPath}/${a.alarmLevelSound.value}`;
              this.player2.src = muiscPath;
              this.player2.play();
            }
          }
        },
        rule: [], asyncRules: []
      },
      {
        label: this.language.isPlay,
        key: 'isPlay',
        type: 'radio',
        require: false,
        col: 24,
        radioInfo: {
          data: [
            {label: this.language.yes, value: 1},
            {label: this.language.no, value: 0},
          ],
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, $event, key, formOperate: FormOperate) => {
        },
        rule: [],
        asyncRules: []
      },
      {
        label: this.language.playCount,
        key: 'playCount',
        type: 'custom',
        col: 24,
        initialValue: 3,
        require: false,
        // rule: [],
        rule: [{required: true}, {min: 0, max: 5, pattern: '^[0-5]\d*$', msg: '输入错误！'}],
        asyncRules: [],
        template: this.playCountTemp
      }
    ];
  }

  /**
   * 编辑告警级别表单实例
   * param event
   */
  formInstance(event) {
    this.formStatus = event.instance;
  }

  /**
   * 播放
   */
  playMusic(data) {
    if (data && data.alarmLevelSound) {
      const srcPath = 'assets/audio';
      const muiscPath = `${srcPath}/${data.alarmLevelSound}`;
      this.player1.src = muiscPath;
      this.player1.play();
    }
  }

  isDisabled() {
    return !(Number.isInteger(this.countValue));
  }

  /**
   * 加
   */
  plus() {
    if (Number.isInteger(this.countValue)) {
      // 在中文输入法下 输入的是字符串 比如 '1'
      this.countValue = Number(this.countValue);
      if (this.countValue >= 5) {
        return;
      } else {
        this.countValue = this.countValue + 1;
      }
    } else {
      this.countValue = 1;
    }
  }

  /**
   * 减
   */
  minus() {
    if (Number.isInteger(this.countValue)) {
      this.countValue = Number(this.countValue);
      if (this.countValue <= 1) {
        this.countValue = 1;
      } else {
        this.countValue = this.countValue - 1;
      }
    } else {
      this.countValue = 1;
    }

  }

  /**
   * keyup 监听播放次数变化
   * param event
   */
  onKey(event: any) {
    const valNumber: number = Number(event.key);
    if (valNumber <= 5 && valNumber > 0) {
      this.countValue = valNumber;
    } else {
      this.countValue = 1;
    }
  }

  /**
   * 修改告警级别设置信息
   */
  editHandle() {
    this.player2.pause();
    this.formStatus.resetControlData('playCount', this.countValue);
    const editData = this.formStatus.getData();
    editData.id = this.alarmId;
    editData.alarmLevelColor = this.selectedColor;
    // switch (editData.id) {
    //   case '1':
    //     editData.alarmLevelName = this.language.urgent;
    //     break;
    //   case '2':
    //     editData.alarmLevelName = this.language.main;
    //     break;
    //   case '3':
    //     editData.alarmLevelName = this.language.secondary;
    //     break;
    //   case '4':
    //     editData.alarmLevelName = this.language.prompt;
    //     break;
    // }
    editData.alarmLevelName = getAlarmLevel(this.$nzI18n, editData.id);
    this.isLoading = true;
    this.$alarmService.updateAlarmLevel(editData).subscribe((res: Result) => {
      this.isLoading = false;
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.isVisible = false;
        this.$curr.sendMessage(1);
        this.refreshData();
      } else if (res.code === 170122) {
        this.$message.info(res.msg);
        this.selectedColor = this._selectedColor;
        this.refreshData();
      } else {
        this.$message.info(res.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }

  /**
   * 取消修改
   */
  editHandleCancel(): void {
    this.isVisible = false;
    this.player2.pause();
  }


}
