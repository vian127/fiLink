import {Component, OnInit, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {Result} from '../../../../shared-module/entity/result';
import {ClearBarrierService} from '../../../../core-module/api-service/work-order/clear-barrier';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {WorkOrderLanguageInterface} from '../../../../../assets/i18n/work-order/work-order.language.interface';
import {UnfinishedClearBarrierWorkOrderTableComponent} from './table';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {WORK_ORDER_STATUS_CLASS} from '../../../../shared-module/const/work-order';

/**
 * 未完工销账工单卡片
 */
@Component({
  selector: 'app-unfinished-clear-barrier-work-order',
  templateUrl: './unfinished-clear-barrier-work-order.component.html',
  styleUrls: ['./unfinished-clear-barrier-work-order.component.scss']
})
export class UnfinishedClearBarrierWorkOrderComponent implements OnInit {
  // 全部未完成工单数目
  public totalCount;
  // 待指派工单数目
  public assignedCount = 0;
  // 待处理工单数目
  public pendingCount = 0;
  // 处理中工单数目
  public processingCount = 0;
  // 已退单工单数目
  public singleBackCount = 0;
  // 已转派工单数目
  public turnProcessingCount = 0;
  // 新增数目
  public increaseCount = 0;
  // 国际化
  public workOrderLanguage: WorkOrderLanguageInterface;
  public sliderConfig = [];
  public saveConfig = [];
  // 卡片切换时数据
  public slideShowChangeData;
  @ViewChild('table') table: UnfinishedClearBarrierWorkOrderTableComponent;

  constructor(public $nzI18n: NzI18nService,
              private $clearBarrierService: ClearBarrierService,
              private $message: FiLinkModalService,
  ) {
  }

  ngOnInit() {
    this.workOrderLanguage = this.$nzI18n.getLocaleData('workOrder');
    this.getStatistics();
  }

  /**
   * 选中卡片查询相应的类型
   * param event
   */
  sliderChange(event) {
    if (event.code) {
      this.filterByStatus(event.code);
    } else {
      // this.tableComponent.handleRest();
    }
  }

  /**
   * 工单列表事件回传
   */
  workOrderEvent(event) {
    this.getStatistics();
  }

  /**
   * 获取统计信息
   */
  getStatistics() {
    // this.getTotalCount();
    // this.getAssignedCount();
    // this.getPendingCount();
    this.getIncreaseCount().then((bool) => {
      if (bool === true) {
        this.getProcessingCount();
      }
    });
  }

  filterByStatus(status?) {
    this.table.filterByStatus(status);
  }


  /**
   * 获取工单状态数量
   */
  getProcessingCount() {
    this.sliderConfig = [];
    this.saveConfig = [];
    const data = {
      'bizCondition': {
        'procType': 'clear_failure',
        'statisticalType': '1'
      }
    };
    this.$clearBarrierService.getProcessingStatistics(data).subscribe((result: Result) => {
      if (result.code === 0) {
        this.totalCount = 0;
        let resultData;
        if (result.data.length) {
          resultData = result.data;
        } else {
          resultData = [
            {'orderCount': 0, 'status': 'assigned', 'statusName': 'To be assigned', 'orderPercent': 0.0},
            {'orderCount': 0, 'status': 'pending', 'statusName': 'Pending', 'orderPercent': 0.0},
            {'orderCount': 0, 'status': 'processing', 'statusName': 'Processing', 'orderPercent': 0.0},
            {'orderCount': 0, 'status': 'turnProcessing', 'statusName': 'Transferred', 'orderPercent': 0.0},
            {'orderCount': 0, 'status': 'singleBack', 'statusName': 'Canceled', 'orderPercent': 0.0}
          ];
        }
        resultData.forEach(item => {
          if (item.status === 'assigned') {
            this.assignedCount = item.orderCount;
          } else if (item.status === 'pending') {
            this.pendingCount = item.orderCount;
          } else if (item.status === 'processing') {
            this.processingCount = item.orderCount;
          } else if (item.status === 'singleBack') {
            this.singleBackCount = item.orderCount;
          } else {
            this.turnProcessingCount = item.orderCount;
          }
          this.totalCount += item.orderCount;
          this.saveConfig.push({
            label: this.workOrderLanguage[item.status], sum: item.orderCount,
            iconClass: this.getStatusClass(item.status),
            textClass: this.getTextStatus(item.status), code: item.status
          });
        });
        this.saveConfig.unshift({
          label: this.workOrderLanguage.all, sum: this.totalCount,
          iconClass: 'iconfont fiLink-work-order-all statistics-all-color',
          textClass: 'statistics-all-color', code: 'all'
        });
        this.saveConfig.push({
          label: this.workOrderLanguage.addWorkOrderToday, sum: this.increaseCount,
          iconClass: 'iconfont fiLink-add-arrow statistics-add-color',
          textClass: 'statistics-add-color', code: null
        });
        this.sliderConfig = this.saveConfig;
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
    });
  }

  getStatusClass(status) {
    return `iconfont icon-fiLink ${WORK_ORDER_STATUS_CLASS[status]}`;
  }

  getTextStatus(status) {
    return `statistics-${status}-color`;
  }

  /**
   * 获取新增工单数目
   */
  getIncreaseCount() {
    const data = {
      'bizCondition': {
        'procType': 'clear_failure'
      }
    };
    return new Promise((resolve, reject) => {
      this.$clearBarrierService.getIncreaseStatistics(data).subscribe((result: Result) => {
        if (result.code === 0) {
          if (result.data && result.data.length) {
            this.increaseCount = result.data[0].orderCount;
          }
          resolve(true);
        } else {
          resolve(false);
          this.$message.error(result.msg);
        }
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * 滑块变化
   * param event
   */
  slideShowChange(event) {
    this.slideShowChangeData = event;
  }
}

