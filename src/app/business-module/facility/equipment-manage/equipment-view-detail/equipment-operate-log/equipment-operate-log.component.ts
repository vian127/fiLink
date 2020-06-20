import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {EquipmentApiService} from '../../../share/service/equipment/equipment-api.service';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {IndexLanguageInterface} from '../../../../../../assets/i18n/index/index.language.interface';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../../../core-module/model/result-code.enum';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';

/**
 * 操作日志组件
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-operate-log',
  templateUrl: './equipment-operate-log.component.html',
  styleUrls: ['./equipment-operate-log.component.scss']
})
export class EquipmentOperateLogComponent implements OnInit {
  @Input()
  public equipmentId: string = '';
  // 操作结果
  @ViewChild('optResult') private optResult;
  // 日志国际化
  public language: any = {};
  // 操作日志数据集
  public dataSet = [];
  // 表格参数
  public tableConfig: TableConfig;
  // 设备国际化
  public equipmentLanguage: FacilityLanguageInterface;
  // 列表分页实体 卡片列表只显示5条
  public pageBean: PageBean = new PageBean(5);
  // 首页词条国际化
  public indexLanguage: IndexLanguageInterface;
  // 查询条件
  private queryCondition: QueryCondition = new QueryCondition();

  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $equipmentApiService: EquipmentApiService,
    private $router: Router,
  ) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('systemSetting');
    this.equipmentLanguage = this.$nzI18n.getLocaleData('facility');
    this.indexLanguage = this.$nzI18n.getLocaleData('index');
    this.initTableConfig();
    this.refreshData();
  }

  /**
   *  跳转到更多操作日志
   */
  public onClickShowMoreOperateLog(): void {
    this.$router.navigate(['business/system/log'],
      {queryParams: {id: this.equipmentId}}).then();
  }

  /**
   * 刷新列表数据
   */
  private refreshData(): void {
    // 卡片列表只显示5条数据
    this.queryCondition.pageCondition.pageNum = 1;
    this.queryCondition.pageCondition.pageSize = 5;
    const index = this.queryCondition.filterConditions.findIndex(
      item => item.filterField === 'optObjId');
    if (index < 0) {
      const filterTemp = [{
        filterField: 'optObjId',
        filterValue: this.equipmentId,
        operator: OperatorEnum.eq
      }];
      this.queryCondition.filterConditions = this.queryCondition.filterConditions.concat(filterTemp);
    }
    this.tableConfig.isLoading = true;
    // 此处any是因为后台还没提供模型
    this.$equipmentApiService.findOperateLog(this.queryCondition).subscribe((result: ResultModel<any>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.dataSet = result.data || [];
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   *  初始化表格参数
   */
  private initTableConfig(): void {
    this.tableConfig = {
      topButtons: [],
      primaryKey: '03-5',
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: false,
      scroll: {x: '1000px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        {
          type: 'serial-number',
          width: 62,
          title: this.equipmentLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0'}}
        },
        {
          title: this.language.optUserName,
          isShowSort: true,
          key: 'optUserName', width: 100,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}},
        },
        {
          title: this.language.optTime,
          key: 'optTime',
          width: 100,
          pipe: 'date',
          isShowSort: true,
        },
        {
          title: this.language.optResult,
          key: 'optResult',
          width: 100,
          type: 'render',
          renderTemplate: this.optResult,
          isShowSort: true
        },
        {
          title: this.language.detailInfo,
          key: 'detailInfo',
          width: 124,
          isShowSort: true,
        }
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      operation: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      }
    };
  }
}
