import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {ClearWorkOrderModel} from '../../../../index/shared/model/work-order-condition.model';
import {ApplicationService} from '../../../server';
import {ActivatedRoute} from '@angular/router';

/**
 * 通道配置基本信息页面
 */
@Component({
  selector: 'app-passageway-information',
  templateUrl: './passageway-information.component.html',
  styleUrls: ['./passageway-information.component.scss']
})
export class PassagewayInformationComponent implements OnInit, AfterViewInit {

  /**
   * 通道配置组件
   */
  @ViewChild('channelConfiguration') channelConfiguration;

  /**
   * 基础配置模态框
   */
  public isBasics = false;

  /**
   * 设备ID
   */
  private equipmentId: string;
  /**
   * 通道列表
   */
  public passagewayList = [];

  /**
   * 通道数据
   */
  public passagewayData: any;

  /**
   * @param $applicationService 后台接口服务
   * @param $activatedRoute 路由传参服务
   */
  constructor(
    private $applicationService: ApplicationService,
    private $activatedRoute: ActivatedRoute,
  ) {
    this.$activatedRoute.queryParams.subscribe(params => {
      if (params.equipmentId) {
        this.equipmentId = params.equipmentId;
      }
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.onInitialization();
  }

  private onInitialization(): void {
    this.$applicationService.getSecurityPassagewayList(this.equipmentId).subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
      if (result.code === '00000') {
        this.passagewayList = result.data;
      }
    }, () => {

    });
  }

  /**
   * 模态框取消方法
   */
  public handleCancel(): void {
    this.isBasics = false;
  }

  /**
   * 模态框确定方法
   */
  public handleOk(): void {
    this.isBasics = false;
    // 发送请求: 新增/修改通道配置
    console.log(this.channelConfiguration.formStatus.group.getRawValue());
    const channelConfigurationParameter = this.channelConfiguration.formStatus.group.getRawValue();
    channelConfigurationParameter.equipmentId = this.equipmentId;
    this.$applicationService.securityChannel(channelConfigurationParameter).subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
      if (result.code === '00000') {
        this.onInitialization();
      }
    }, () => {

    });
  }

  /**
   * 打开通道模态
   * @param update 修改：true
   * @param index 修改：下标
   */
  public openPassageway(index?: number, update?: boolean): void {
    if (update) {
      this.passagewayData = this.passagewayList[index];
    } else {
      this.passagewayData = null;
    }
    this.isBasics = true;
  }

}
