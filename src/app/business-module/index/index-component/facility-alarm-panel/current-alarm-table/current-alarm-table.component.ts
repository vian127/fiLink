import {Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexTable} from '../../../util/index.table';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {IndexWorkOrderService} from '../../../../../core-module/api-service/index/index-work-order';
import {QueryCondition} from '../../../../../shared-module/entity/queryCondition';
import {ResultCodeEnum} from '../../../../../core-module/model/result-code.enum';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {AlarmModel} from '../../../shared/model/area-facility-model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {MapCoverageService} from '../../../service/map-coverage.service';
import {IndexAlarmTypeEnum, IndexLayeredTypeEnum, IndexPageSizeEnum} from '../../../shared/const/index-enum';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';

/**
 * 当前告警组件
 */
@Component({
  selector: 'app-current-alarm-table',
  templateUrl: './current-alarm-table.component.html',
  styleUrls: ['./current-alarm-table.component.scss']
})
export class CurrentAlarmTableComponent extends IndexTable implements OnInit {
  // 设施id
  @Input() facilityId: string;
  // 当前的状态（设施或设备）
  @Input() facilityType: string;
  // 当前告警列表数据集
  private currentAlarmDataSet: AlarmModel[] = [];
  // 当前告警列表分页
  public currentAlarmPageBean: PageBean = new PageBean(5, 1, 1);
  // 当前告警表格配置
  private currentAlarmTableConfig: TableConfig;
  // 当前设施告警查询条件
  private queryAlarmByFacilityCondition: QueryCondition = new QueryCondition();
  // 告警类别枚举
  private alarmStateEnum = IndexAlarmTypeEnum;

  // 当前图层
  private indexType = this.$mapCoverageService.showCoverage;

  public constructor(
    public $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $mapCoverageService: MapCoverageService,
    private $indexWorkOlder: IndexWorkOrderService) {
    super($nzI18n);
  }

  public ngOnInit(): void {
    this.initAlarmCurrentTableConfig();
    this.getAlarmCurrentTableByFacilityData();
  }

  /**
   * 当前告警表格配置
   */
  private initAlarmCurrentTableConfig(): void {
    this.currentAlarmTableConfig = {
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
   * 获取设施当前告警数据
   */
  private getAlarmCurrentTableByFacilityData(): void {
    // 查询参数配置
    this.queryAlarmByFacilityCondition.filterConditions = [];
    this.queryAlarmByFacilityCondition.pageCondition.pageNum = IndexPageSizeEnum.pageSizeOne;
    this.queryAlarmByFacilityCondition.pageCondition.pageSize = IndexPageSizeEnum.pageSizeFive;

    if (this.facilityId) {
      // 设施查询条件
      if (this.indexType === IndexLayeredTypeEnum.facility) {
        this.queryAlarmByFacilityCondition.filterConditions.push({
          filterField: 'alarm_source', operator:  OperatorEnum.eq, filterValue: this.facilityId
        });
      }
      // 设备查询条件
      if (this.indexType === IndexLayeredTypeEnum.device) {
        this.queryAlarmByFacilityCondition.filterConditions.push({
          filterField: 'alarm_equipment_id', operator:  OperatorEnum.eq, filterValue: this.facilityId
        });
      }
    }

    this.currentAlarmTableConfig.isLoading = true;
    // 接口获取当前告警数据
    this.$indexWorkOlder.getAlarmInfoListById(this.queryAlarmByFacilityCondition)
      .subscribe((result: ResultModel<AlarmModel[]>) => {
        // 一期接口暂不修改result.code
        if (result.code === 0) {
          this.currentAlarmDataSet = result.data;
          // 数据遍历改造
          this.currentAlarmDataSet.forEach(item => {
            item.alarmType = this.getStatusName(item.alarmType);
          });
          this.currentAlarmTableConfig.isLoading = false;
        } else {
          this.$message.error(result.msg);
          this.currentAlarmTableConfig.isLoading = false;
        }
      }, () => {
        this.currentAlarmTableConfig.isLoading = false;
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

