import {Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import { FaultLanguageInterface } from '../../../../../../assets/i18n/fault/fault-language.interface';
import {ActivatedRoute} from '@angular/router';
import {Result} from '../../../../../shared-module/entity/result';
import {TroubleService} from '../../../../../core-module/api-service/trouble/trouble-manage';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {getAlarmLevel, getHandleStatus, getTroubleSource} from '../../../model/const/trouble.config';
import {TroubleInfo, FacilityInfo} from '../../../../../core-module/entity/trouble/trouble';
@Component({
  selector: 'app-trouble-detail',
  templateUrl: './trouble-detail.component.html',
  styleUrls: ['./trouble-detail.component.scss']
})
export class TroubleDetailComponent implements OnInit {
  @Input() alarmCode: string;
  // 告警国际化引用
  public language: FaultLanguageInterface;
  // 故障基本信息
  public troubleInfo: any = new TroubleInfo;
  public ifSpin: boolean = false;
  // 标题
  public title: string = '';
  public troubleId: string;
  public isShow: boolean = false;
  // 故障处理状态
  public handleStatus: string;
  // 流程节点
  public flowId: string;
  // 流程实例id
  public instanceId: string;
  // 流程名称
  public currentHandleProgress: string;
  constructor(
    public $nzI18n: NzI18nService,
    private $active: ActivatedRoute,
    public $troubleService: TroubleService,
    public $message: FiLinkModalService,
  ) {
    this.language = this.$nzI18n.getLocaleData('fault');
  }

  ngOnInit() {
    this.title = this.language.troubleDetail;
    this.$active.queryParams.subscribe(params => {
      this.troubleId = params.id;
      this.alarmCode = params.alarmCode;
      this.refreshData(params.id);
    });
  }
  /**
   * 获取故障详情
   */
  refreshData(id) {
    this.ifSpin = true;
    this.$troubleService.queryTroubleDetail(id).subscribe((res: Result) => {
      if (res.code === 0) {
        this.ifSpin = false;
        this.troubleInfo = res.data;
        this.troubleInfo.handleStatusName = getHandleStatus(this.$nzI18n, res.data.handleStatus);
        this.troubleInfo.troubleLevelName = getAlarmLevel(this.$nzI18n, res.data.troubleLevel);
        this.troubleInfo.troubleSourceName = getTroubleSource(this.$nzI18n, res.data.troubleSource);
        this.troubleInfo.troubleTypeName = getAlarmLevel(this.$nzI18n, res.data.troubleType);
        this.flowId = res.data.progessNodeId;
        this.handleStatus = res.data.handleStatus;
        this.instanceId = res.data.instanceId;
        this.currentHandleProgress = res.data.currentHandleProgress;
        this.isShow = true;
      }
    }, (res) => {
      this.ifSpin = false;
      this.$message.success(res.msg);
    });
  }
}
