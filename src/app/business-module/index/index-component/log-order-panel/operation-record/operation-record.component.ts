import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {MapService} from '../../../../../core-module/api-service/index/map/index';
import {IndexTable} from '../../../util/index.table';
import {NzI18nService} from 'ng-zorro-antd';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {OperationRecordsModel} from '../../../shared/model/log-operating.model';
import {ResultCodeEnum} from '../../../../../core-module/model/result-code.enum';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {ResultItem} from '../../../shared/const/index-enum';

/**
 * 操作记录工单组件
 */
@Component({
  selector: 'app-operation-record',
  templateUrl: './operation-record.component.html',
  styleUrls: ['./operation-record.component.scss']
})
export class OperationRecordComponent extends IndexTable implements OnInit, OnChanges {
  // 设施id
  @Input() facilityId: string;

  public constructor(
    public $nzI18n: NzI18nService,
    private $router: Router,
    private $mapService: MapService,
    private $message: FiLinkModalService) {
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
    this.tableConfig.isLoading = true;
    this.createQueryConditions();
    // 接口查询操作记录数据
    this.$mapService.findOperateLog(this.queryCondition).subscribe((result: ResultModel<OperationRecordsModel[]>) => {
      this.tableConfig.isLoading = false;
      // 一期接口暂不修改result.code
      if (result.code === 0) {
        this._dataSet = result.data.map(item => {
          if (item.optResult === ResultItem.success) {
            item.optResult = this.indexLanguage.success;
          } else {
            item.optResult = this.indexLanguage.failure;
          }
          return item;
        });
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
    // 查询参数
    this.queryCondition.filterConditions = [];
    this.queryCondition.filterConditions.push({
      filterField: 'optObjId', operator: OperatorEnum.eq, filterValue: this.facilityId
    });

    // 分页参数
    this.queryCondition.pageCondition = {
      pageNum: this.pageBean.pageIndex,
      pageSize: this.pageBean.pageSize
    };
  }

  /**
   * 跳转至对应日志
   * param id
   */
  public goToFacilityLogById(id): void {
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
          title: this.indexLanguage.operationPerson, key: 'optUserName', width: 86,
          searchable: false
        },
        {
          title: this.indexLanguage.operationTime, key: 'optTime', width: 85, pipe: 'date',
          searchable: false,
        },
        {
          title: this.indexLanguage.operationResult, key: 'optResult', width: 70,
          searchable: false,
        },
        {
          title: this.indexLanguage.detailInfo, searchable: false,
          searchConfig: {type: 'operate'}, key: 'detailInfo', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
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

