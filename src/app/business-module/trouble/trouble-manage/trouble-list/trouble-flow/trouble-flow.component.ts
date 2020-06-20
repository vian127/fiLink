import { Component, OnInit } from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import { FaultLanguageInterface } from '../../../../../../assets/i18n/fault/fault-language.interface';
import {QueryCondition, SortCondition} from '../../../../../shared-module/entity/queryCondition';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {ActivatedRoute} from '@angular/router';
import {TroubleService} from '../../../../../core-module/api-service/trouble/trouble-manage';
import {Result} from '../../../../../shared-module/entity/result';
import {getAlarmLevel, getHandleStatus, getTroubleSource} from '../../../model/const/trouble.config';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {TroubleModel} from '../../../model/trouble.model';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-trouble-flow',
  templateUrl: './trouble-flow.component.html',
  styleUrls: ['./trouble-flow.component.scss']
})
export class TroubleFlowComponent implements OnInit {
  // 告警国际化引用
  public language: FaultLanguageInterface;
  // 标题
  public title: string = '';
  // 历史流程记录
  troubleRecord: any = [];
  // 流程记录分页
  troubleRecordPageBean: PageBean = new PageBean(10, 1, 1);
  // 流程记录列表配置
  troubleRecordTableConfig: TableConfig;
  // 查询条件
  private queryCondition: QueryCondition = new QueryCondition();
  // 流程节点
  public flowId: string;
  // 流程实例id
  public instanceId: string;
  // 图片路径
  public imgSrc: string;
  public isSpinning: boolean = false;
  constructor(
    public $nzI18n: NzI18nService,
    private $active: ActivatedRoute,
    public $troubleService: TroubleService,
    public $message: FiLinkModalService,
    private $http: HttpClient,
  ) {
    this.language = this.$nzI18n.getLocaleData('fault');
  }

  ngOnInit() {
    this.title = this.language.troubleFlow;
    this.$active.queryParams.subscribe(params => {
      this.instanceId = params.instanceId;
    });
    this.initTableConfig();
    this.refreshData();
    this.getFlowChart();
  }
  // 获取流程图
  getFlowChart() {
    this.isSpinning = true;
    this.$troubleService.getFlowChart(this.instanceId).subscribe((res) => {
        const render = new FileReader();
        const that = this;
        render.onload = function (e) {
          that.imgSrc = e.target['result'];
        };
        render.readAsDataURL(<Blob>res);
      this.isSpinning = false;
    }, (res) => {
      this.$message.success(res.msg);
    });
  }
  /**
   * 初始化列表配置
   */
  private initTableConfig() {
    this.troubleRecordTableConfig = {
      isDraggable: false,
      isLoading: false,
      showPagination: true,
      bordered: false,
      showSearch: false,
      scroll: {x: '512px', y: '600px'},
      columnConfig: [
        {title: this.language.name, key: 'nodeName', isShowSort: true},
        {
          title: this.language.operator, key: 'optUserName', isShowSort: true
        },
        {
          title: this.language.time, key: 'optTime', isShowSort: true, pipe: 'date'
        },
        {
          title: this.language.troubleRemark, key: 'optRemark', isShowSort: true
        },
      ],
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
      },
      handleSearch: (event) => {
      }
    };
  }

  /**
   * 历史流程翻页处理
   * param event
   */
  troubleRecordPageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
  }

  /**
   * 获取故障历史流程记录
   */
  private refreshData() {
    this.$troubleService.queryTroubleProcessHistory(this.instanceId).subscribe((res: ResultModel<TroubleModel>) => {
      if (res.code === '00000') {
        this.troubleRecord = res.data || [];
      }
    }, (res) => {
      this.$message.success(res.msg);
    });
  }
}
