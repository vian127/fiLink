import {Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Result} from '../../../../../shared-module/entity/result';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexTable} from '../../../util/index.table';
import {InspectionService} from '../../../../../core-module/api-service/work-order/inspection/index';
import {WORK_ORDER_STATUS_CLASS} from '../../../../../shared-module/const/work-order';
import {InspectionLanguageInterface} from '../../../../../../assets/i18n/inspection-task/inspection.language.interface';

/**
 * 巡检工单组件
 */
@Component({
  selector: 'app-inspection-table',
  templateUrl: './inspection-table.component.html',
  styleUrls: ['./inspection-table.component.scss']
})
export class InspectionTableComponent extends IndexTable implements OnInit, OnChanges {
  @Input() facilityId: string;
  @ViewChild('inspectionResultTemp') inspectionResultTemp: TemplateRef<any>;
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  @Input() tableFieldWidth: any = {};
  private inspectionLanguage: InspectionLanguageInterface;

  constructor(public $nzI18n: NzI18nService,
              private $router: Router,
              private $inspectionService: InspectionService) {
    super($nzI18n);
  }

  ngOnInit() {
    this.inspectionLanguage = this.$nzI18n.getLocaleData('inspection');
    this.initTableConfig();
    this.refreshData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.facilityId && changes.facilityId.previousValue) {
      this.refreshData();
    }
  }

  refreshData() {
    this.tableConfig.isLoading = true;
    this.$inspectionService.getFiveWorkOrder(this.facilityId).subscribe((result: Result) => {
      this.tableConfig.isLoading = false;
      if (result.code === 0) {
        this._dataSet = result.data;
        this._dataSet.forEach(item => {
          item.statusName = this.getWorkOrderStatusName(item.status);
          item.statusClass = this.getStatusClass(item.status);
          if (item.procInspectionRecordVoList) {
            const deviceResult = item.procInspectionRecordVoList.filter(facility => facility.deviceId === this.facilityId);
            if (deviceResult.length > 0) {
              item.result = this.getResult(deviceResult[0].result);
              // 巡检结果异常时给出详情提示
              if (deviceResult[0].result === '1' && deviceResult[0].exceptionDescription) {
                item.exceptionDesp = deviceResult[0].exceptionDescription;
              }
            } else {
              item.result = '';
            }
          }
        });
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 获取巡检结果
   * param result     // 0正常  1异常  null未巡检
   */
  getResult(result) {
    let _result;
    if (result === '0') {
      _result = this.inspectionLanguage.normal;
    } else if (result === '1') {
      _result = this.inspectionLanguage.abnormal;
    } else {
      _result = '';
    }
    return _result;
  }

  /**
   * 跳转至对应巡检工单
   * param id
   */
  goToFacilityLogById(id) {
    this.$router.navigate([`/business/work-order/inspection/unfinished`], {queryParams: {id: id}}).then();
  }

  /**
   * 获取工单类型样式
   * param status
   * returns {string}
   */
  getStatusClass(status) {
    return `iconfont icon-fiLink ${WORK_ORDER_STATUS_CLASS[status]}`;
  }

  initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '366px', y: '250px'},
      topButtons: [],
      noIndex: true,
      columnConfig: [
        {
          title: this.workOrderLanguage.name, key: 'title', width: this.tableFieldWidth.title || 76,
          searchable: false
        },
        {
          title: this.workOrderLanguage.status, key: 'statusName', width: this.tableFieldWidth.statusName || 73,
          searchable: false,
          type: 'render',
          renderTemplate: this.statusTemp,
        },
        {
          title: this.workOrderLanguage.expectedCompleteTime, key: 'ecTime', width: this.tableFieldWidth.ecTime || 72, pipe: 'date',
          searchable: false,
        },
        {
          title: this.workOrderLanguage.accountabilityUnitName,
          key: 'accountabilityDeptName',
          width: this.tableFieldWidth.accountabilityDeptName || 70,
          searchable: false,
        },
        {
          title: this.workOrderLanguage.inspectionResult, key: 'result', width: this.tableFieldWidth.result || 100,
          type: 'render',
          renderTemplate: this.inspectionResultTemp,
        },
        // {
        //   title: this.commonLanguage.operate, searchable: false,
        //   searchConfig: {type: 'operate'}, key: '', width: 90, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        // },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      operation: [
        {
          text: this.indexLanguage.viewLog,
          className: 'fiLink-log',
          handle: (currentIndex) => {
            this.goToFacilityLogById(currentIndex.procId);
          }
        },
      ]
    };
  }

  /**
   * 设置table isDraggable配置
   * param isDraggable
   */
  setTableConfigIsDraggable(isDraggable) {
    this.tableConfig.isDraggable = isDraggable;
  }
}

