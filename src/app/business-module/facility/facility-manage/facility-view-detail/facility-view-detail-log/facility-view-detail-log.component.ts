import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {FilterCondition, QueryCondition} from '../../../../../shared-module/entity/queryCondition';
import {getDeviceType} from '../../../share/const/facility.config';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {Result} from '../../../../../shared-module/entity/result';
import {FacilityService} from '../../../../../core-module/api-service/facility/facility-manage';
import {Router} from '@angular/router';
import {LogManageService} from '../../../../../core-module/api-service/system-setting/log-manage/log-manage.service';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';

/**
 * 设施详情设施日志组件
 */
@Component({
  selector: 'app-facility-view-detail-log',
  templateUrl: './facility-view-detail-log.component.html',
  styleUrls: ['./facility-view-detail-log.component.scss']
})
export class FacilityViewDetailLogComponent implements OnInit {
  // 操作结果
  @ViewChild('optResult') private optResult: TemplateRef<void>;
  // 设施id
  @Input()
  public deviceId: string;
  // 是否有主控
  @Input()
  public hasControl: boolean;
  // 设施日志列表数据 todo 模型
  public facilityLogSet = [];
  // 操作日志数据 todo 模型
  public operationLogSet = [];
  // 设施日志分页
  public facilityLogPageBean: PageBean = new PageBean(5);
  // 操作日志分页
  public operationLogPageBean: PageBean = new PageBean(5);
  // 设施日志列表配置
  public facilityLogTableConfig: TableConfig;
  // 操作日志列表配置
  public operationLogTableConfig: TableConfig;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 系统设置语言包
  public systemSettingLogLanguage;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 日志语言包
  public logLanguage;
  // 查询条件
  private queryCondition: QueryCondition = new QueryCondition();

  constructor(private $nzI18n: NzI18nService,
              private $facilityService: FacilityService,
              private $logManageService: LogManageService,
              private $router: Router) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.systemSettingLogLanguage = this.$nzI18n.getLocaleData('systemSetting');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.logLanguage = this.$nzI18n.getLocaleData('log');
    this.initTableConfig();
    this.refreshData();
  }

  /**
   * 设施日志翻页处理
   * param event
   */
  public facilityLogPageChange(event): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 操作日志翻页处理
   * param event
   */
  public operationLogPageChange(event): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 初始化列表配置
   */
  private initTableConfig(): void {
    this.facilityLogTableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '512px', y: '600px'},
      noIndex: true,
      columnConfig: [
        { // 日志名称
          title: this.language.deviceLogName, key: 'logName', width: 150
        },
        { // 日志类型
          title: '日志类型', key: 'logType', width: 150,
          searchConfig: {type: 'input'}
        },
        { // 设备名称
          title: '设备名称', key: 'deviceName', width: 150,
          searchConfig: {type: 'input'}
        },
        { // 设备类型
          title: '设备类型', key: 'deviceType', width: 150,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.extraRemarks, key: 'remarks', width: 150,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.createTime, key: 'currentTime', width: 150, pipe: 'date',
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
    };
    this.operationLogTableConfig = {
      isDraggable: this.hasControl,
      isLoading: false,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: false,
      scroll: {x: '662px', y: '600px'},
      noIndex: true,
      columnConfig: [
        // {type: 'serial-number', width: 62, title: this.language.serialNumber, fixedStyle: {fixedLeft: true, style: {left: '0px'}}},
        {
          title: this.systemSettingLogLanguage.optUserName,
          key: 'optUserName',
          width: 150
        },
        {
          title: this.systemSettingLogLanguage.optTime,
          key: 'optTime',
          width: 150,
          pipe: 'date',
        },
        {
          title: this.systemSettingLogLanguage.optResult,
          key: 'optResult',
          width: 80,
          type: 'render',
          renderTemplate: this.optResult,
        },
        {
          title: this.systemSettingLogLanguage.detailInfo,
          key: 'detailInfo',
          width: 150,
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
    };
  }

  /**
   * 导航跳转
   * param url
   */
  public navigatorTo(url: string): void {
    this.$router.navigate([url], {queryParams: {id: this.deviceId}}).then();
  }

  /**
   * 刷新数据
   */
  private refreshData(): void {
    this.facilityLogTableConfig.isLoading = true;
    this.operationLogTableConfig.isLoading = true;
    const condition = new FilterCondition('deviceId');
    condition.filterValue = this.deviceId;
    condition.operator = 'eq';
    this.queryCondition.filterConditions = [condition];
    this.$facilityService.queryDeviceLogListByPage(this.queryCondition).subscribe((result: Result) => {
      this.facilityLogTableConfig.isLoading = false;
      this.facilityLogSet = result.data || [];
      this.facilityLogSet.forEach(item => {
        if (item.deviceType) {
          item['_deviceType'] = item.deviceType;
          item.deviceType = getDeviceType(this.$nzI18n, item.deviceType);
        }
      });
      if (this.facilityLogSet.length > 5) {
        this.facilityLogSet = this.facilityLogSet.slice(0, 5);
      }
    }, () => {
      this.facilityLogTableConfig.isLoading = false;
    });
    condition.filterField = 'optObjId';
    this.queryCondition.sortCondition.sortField = 'optTime';
    this.queryCondition.sortCondition.sortRule = 'desc';
    this.$logManageService.findOperateLog(this.queryCondition).subscribe((result: Result) => {
      this.operationLogTableConfig.isLoading = false;
      this.operationLogSet = result.data || [];
      if (this.operationLogSet.length > 5) {
        this.operationLogSet = this.operationLogSet.slice(0, 5);
      }
    }, () => {
      this.operationLogTableConfig.isLoading = false;
    });
  }
}
