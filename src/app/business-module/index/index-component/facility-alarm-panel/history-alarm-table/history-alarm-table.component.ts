import {Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexTable} from '../../../util/index.table';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {QueryCondition} from '../../../../../shared-module/entity/queryCondition';
import {IndexWorkOrderService} from '../../../../../core-module/api-service/index/index-work-order';
import {AlarmModel} from '../../../shared/model/area-facility-model';
import {IndexAlarmTypeEnum, IndexLayeredTypeEnum, IndexPageSizeEnum} from '../../../shared/const/index-enum';
import {MapCoverageService} from '../../../service/map-coverage.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';

/**
 * 历史告警组件
 */
@Component({
  selector: 'app-history-alarm-table',
  templateUrl: './history-alarm-table.component.html',
  styleUrls: ['./history-alarm-table.component.scss']
})
export class HistoryAlarmTableComponent extends IndexTable implements OnInit {
  // 设施id
  @Input() facilityId: string;

  // 历史告警列表数据集
  public historyAlarmDataSet: AlarmModel[] = [];
  // 历史告警列表分页
  public historyAlarmPageBean: PageBean = new PageBean(5, 1, 1);
  // 历史告警表格配置
  public historyAlarmTableConfig: TableConfig;
  // 历史设施告警查询条件
  public queryAlarmByFacilityCondition: QueryCondition = new QueryCondition();
  // 工告警类别枚举
  public alarmStateEnum = IndexAlarmTypeEnum;
  // 当前图层
  public indexType = this.$mapCoverageService.showCoverage;

  public constructor(
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    private $mapCoverageService: MapCoverageService,
    public $indexWorkOlder: IndexWorkOrderService) {
    super($nzI18n);
  }

  public ngOnInit(): void {
    this.initAlarmTableByFacilityConfig();
    this.getAlarmTableByFacilityData();
  }

  /**
   * 历史告警表格配置
   */
  private initAlarmTableByFacilityConfig(): void {
    this.historyAlarmTableConfig = {
      isDraggable: true,
      isLoading: false,
      noIndex: true,
      scroll: {x: '366px', y: '250px'},
      topButtons: [],
      columnConfig: [
        {
          // 告警名称
          title: this.indexLanguage.alarmTypeName, key: 'alarmName', width: 96,
          configurable: false,
          searchable: false,
          searchConfig: {type: 'input'}
        },
        {
          // 设备名称
          title: this.indexLanguage.equipmentName, key: 'equipmentName', width: 96,
          configurable: false,
          searchable: false,
          searchConfig: {type: 'input'}
        },
        {
          // 设备类型
          title: this.indexLanguage.equipmentTypeTitle, key: 'equipmentType', width: 96,
          configurable: false,
          searchable: false,
          searchConfig: {type: 'input'}
        },
        {
          // 告警类型
          title: this.indexLanguage.alarmType, key: 'alarmType', width: 96,
          configurable: false,
          searchable: false,
          searchConfig: {type: 'input'}
        },
        {
          // 责任单位
          title: this.indexLanguage.responsibleUnit, key: 'accountabilityUnit', width: 96,
          configurable: false,
          searchable: false,
          searchConfig: {type: 'input'}
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
    };
  }

  /**
   * 获取设施历史告警数据
   */
  private getAlarmTableByFacilityData(): void {
    // 配置查询条件
    this.queryAlarmByFacilityCondition.filterConditions = [];
    this.queryAlarmByFacilityCondition.pageCondition.pageNum = IndexPageSizeEnum.pageSizeOne;
    this.queryAlarmByFacilityCondition.pageCondition.pageSize = IndexPageSizeEnum.pageSizeFive;
    if (this.facilityId) {
      // 设施查询条件
      if (this.indexType === IndexLayeredTypeEnum.facility) {
        this.queryAlarmByFacilityCondition.filterConditions.push({
          filterField: 'alarm_source', operator: OperatorEnum.eq, filterValue: this.facilityId
        });
      }
      // 设备查询条件
      if (this.indexType === IndexLayeredTypeEnum.device) {
        this.queryAlarmByFacilityCondition.filterConditions.push({
          filterField: 'alarm_equipment_id', operator:  OperatorEnum.eq, filterValue: this.facilityId
        });
      }
    }
    this.historyAlarmTableConfig.isLoading = true;
    // 接口获取历史告警数据
    this.$indexWorkOlder.getAlarmHisInfoListById(this.queryAlarmByFacilityCondition)
      .subscribe((result: ResultModel<AlarmModel[]>) => {
        // 一期接口暂不修改result.code
        if (result.code === 0) {
          this.historyAlarmDataSet = result.data;
          // 遍历数据改造
          this.historyAlarmDataSet.forEach(item => {
            item.alarmType = this.getStatusName(item.alarmType);
          });
          this.historyAlarmTableConfig.isLoading = false;
        } else {
          this.$message.error(result.msg);
          this.historyAlarmTableConfig.isLoading = false;
        }
      }, () => {
        this.historyAlarmTableConfig.isLoading = false;
      });
  }

  /**
   * 告警类别
   *
   */
  private getStatusName(alarmType: string) {
    return this.indexLanguage[this.alarmStateEnum[alarmType]] || '';
  }
}

