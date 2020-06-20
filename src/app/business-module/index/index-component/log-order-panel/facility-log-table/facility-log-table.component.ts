import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {IndexTable} from '../../../util/index.table';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {LogModel} from '../../../shared/model/log-operating.model';
import {QueryCondition} from '../../../../../shared-module/entity/queryCondition';
import {IndexWorkOrderService} from '../../../../../core-module/api-service/index/index-work-order';
import {ResultCodeEnum} from '../../../../../core-module/model/result-code.enum';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {MapCoverageService} from '../../../service/map-coverage.service';
import {IndexLayeredTypeEnum, IndexPageSizeEnum} from '../../../shared/const/index-enum';

/**
 * 设施日志组件
 */
@Component({
  selector: 'app-facility-log-table',
  templateUrl: './facility-log-table.component.html',
  styleUrls: ['./facility-log-table.component.scss']
})
export class FacilityLogTableComponent extends IndexTable implements OnInit, OnChanges {
  // 设施id
  @Input() facilityId: string;

  // 当前图层
  public indexType = this.$mapCoverageService.showCoverage;

  // 设备巡检查询条件
  public queryLogListCondition: QueryCondition = new QueryCondition();

  public constructor(
    public $nzI18n: NzI18nService,
    private $router: Router,
    private $message: FiLinkModalService,
    private $mapCoverageService: MapCoverageService,
    private $indexWorkOlder: IndexWorkOrderService
  ) {
    super($nzI18n);
  }

  public ngOnInit(): void {
    this.initTableConfig();
    this.refreshData();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.facilityId && changes.facilityId.previousValue) {
      this.refreshData();
    }
  }

  /**
   * 刷新数据
   */
  public refreshData(): void {
    this.createQueryConditions();
    this.tableConfig.isLoading = true;
    // 接口查询日志数据
    this.$indexWorkOlder.deviceLogListByPage(this.queryLogListCondition).subscribe((result: ResultModel<LogModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this._dataSet = result.data;
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 创建查询条件
   */
  public createQueryConditions(): void {
    this.queryLogListCondition.filterConditions = [];
    this.queryLogListCondition.pageCondition.pageNum = IndexPageSizeEnum.pageSizeOne;
    this.queryLogListCondition.pageCondition.pageSize = IndexPageSizeEnum.pageSizeFive;
    if (this.facilityId) {
      if (this.indexType === IndexLayeredTypeEnum.facility) {
        this.queryLogListCondition.filterConditions.push({
          filterField: 'deviceId', operator: OperatorEnum.eq, filterValue: this.facilityId
        });
      }
      if (this.indexType === IndexLayeredTypeEnum.device) {
        this.queryLogListCondition.filterConditions.push({
          filterField: 'equipmentId', operator: OperatorEnum.eq, filterValue: this.facilityId
        });
      }
    }
  }


  /**
   * 跳转至对应日志
   * param id
   */
  public goToFacilityLogById(id: string): void {
    this.$router.navigate([`/business/facility/facility-log`], {queryParams: {logId: id}}).then();
  }

  /**
   * 初始化表格配置
   */
  public initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '366px', y: '250px'},
      topButtons: [],
      noIndex: true,
      columnConfig: [
        {
          // 日志名称
          title: this.indexLanguage.logName, key: 'logName', width: 86,
          searchable: false
        },
        {
          // 附加信息
          title: this.indexLanguage.extraInfo, key: 'remarks', width: 85,
          searchable: false,
        },
        {
          // 发生时间
          title: this.indexLanguage.happenTime, key: 'currentTime', width: 70, pipe: 'date',
          searchable: false,
        },
        {
          // 操作
          title: this.commonLanguage.operate, searchable: false,
          searchConfig: {type: 'operate'}, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      operation: [
        {
          text: this.indexLanguage.viewLog,
          className: 'fiLink-log',
          handle: (currentIndex) => {
            this.goToFacilityLogById(currentIndex.logId);
          }
        },
      ]
    };
  }
}
