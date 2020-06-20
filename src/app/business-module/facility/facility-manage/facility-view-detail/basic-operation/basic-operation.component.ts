import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Result} from '../../../../../shared-module/entity/result';
import {FacilityService} from '../../../../../core-module/api-service/facility/facility-manage';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {NzI18nService, NzModalService, UploadFile} from 'ng-zorro-antd';
import {LockService} from '../../../../../core-module/api-service/lock';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {FacilityMissionService} from '../../../../../core-module/mission/facility.mission.service';
import {UPLOAD_IMG} from '../../../../../core-module/api-service/facility/facility-request-url';
import {DeviceTypeCode, wellCover} from '../../../share/const/facility.config';

/**
 * 设施详情操作按钮组件
 */
@Component({
  selector: 'app-basic-operation',
  templateUrl: './basic-operation.component.html',
  styleUrls: ['./basic-operation.component.scss']
})
export class BasicOperationComponent implements OnInit {
  // 设施id
  @Input()
  public deviceId: string;
  // 序列号
  @Input()
  public serialNum: string;
  // 设施类型
  @Input()
  public deviceType: string;
  // 设施名称
  @Input()
  public deviceName: string;
  // 位置
  @Input()
  public positionBase: string;
  // 是否有主控
  @Input()
  public hasControl: boolean = false;
  // 是否有智能标签配置
  @Input()
  public intelligentLabelDetail: boolean;
  @Input()
  public isEndVisible = false; // 纤芯成端
  @Input()
  public viewIsEndVisible = false;
  // 远程开锁模板
  @ViewChild('openLockTemp') public openLockTemp: TemplateRef<{}>;
  // 纤芯成端模板
  @ViewChild('coreEndTemp') public coreEndTemp: TemplateRef<void>;
  // 锁数据
  public lockInfo = [];
  // 分页实体
  public pageBean: PageBean = new PageBean();
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 锁配置
  public lockInfoConfig: TableConfig;
  // 显示纤芯成端弹窗
  public show = false;
  // 显示查看纤芯成端弹窗
  public ViewShow = false;
  // 是否显示纤芯成端按钮
  public isCoreEnd = false;
  // 是否显示纤芯熔接按钮
  public isCoreFusion = false;
  // 是否显示查看详情按钮
  public isJointClosure = true;
  // 图片上传数据模型
  public formData: {
    objectId: string,
    objectType: number,
    pic: {},
    resource: string
  };
  // 图片上传地址
  public actionUrl: string;

  constructor(private $router: Router,
              private $message: FiLinkModalService,
              private $facilityService: FacilityService,
              private $modal: NzModalService,
              private $lockService: LockService,
              private $refresh: FacilityMissionService,
              private $nzI18n: NzI18nService) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.facilityTypeJudgment();
    this.lockInfoConfig = {
      noIndex: true,
      columnConfig: [
        {type: 'select', width: 62},
        {type: 'serial-number', width: 62, title: this.language.serialNumber},
        {title: this.language.doorNum, key: 'doorNum', width: 100},
        {title: this.language.doorName, key: 'doorName', width: 100},
      ]
    };
    this.actionUrl = UPLOAD_IMG;
    this.formData = {
      objectId: this.deviceId,
      objectType: 1,
      pic: {},
      resource: '3'
    };
  }

  public clickButton(): void {
    this.getLockInfo(this.deviceId).then((res: any[]) => {
      if (res.length > 0) {
        this.$router.navigate(['business/facility/facility-config'],
          {queryParams: {id: this.deviceId, serialNum: this.serialNum, deviceType: this.deviceType}}).then();
      } else {
        this.$message.error(this.language.noControlMsg);
      }
    });
  }

  public deleteFacility(): void {
    // 组件中的确定取消按钮是反的所以反着用
    this.$modal.confirm({
      nzTitle: this.language.prompt,
      nzContent: this.language.deleteFacilityMsg,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOkText: this.language.handleCancel,
      nzCancelText: this.language.handleOk,
      nzOkType: 'danger',
      nzOnOk: () => {
      },
      nzOnCancel: () => {
        this.$facilityService.deleteDeviceDyIds([this.deviceId]).subscribe((result: Result) => {
          if (result.code === 0) {
            this.$message.success(result.msg);
            this.$router.navigate(['business/facility/facility-list']).then();
          } else {
            this.$message.error(result.msg);
          }
        });
      }
    });

  }

  public updateFacility(): void {
    this.$router.navigate(['business/facility/facility-detail/update'],
      {queryParams: {id: this.deviceId}}).then();
  }

  /**
   * 查看光缆
   */
  public viewCable(): void {
    this.$router.navigate(['business/facility/view-cable'],
      {queryParams: {id: this.deviceId}}).then();
  }

  public authorization(): void {
    if ([DeviceTypeCode.well, DeviceTypeCode.opticalBox, DeviceTypeCode.outdoorCabinet].includes(this.deviceType as DeviceTypeCode)) {
      // 设施授权弹框
      const modal = this.$modal.create({
        nzTitle: this.language.authorization,
        nzContent: this.openLockTemp,
        nzOkText: this.language.handleCancel,
        nzCancelText: this.language.handleOk,
        nzOkType: 'danger',
        nzClassName: 'custom-create-modal',
        nzMaskClosable: false,
        nzFooter: [
          {
            label: this.language.handleOk,
            onClick: () => {
              const slotNum = [];
              this.lockInfo.forEach(item => {
                if (item.checked) {
                  slotNum.push(item.doorNum);
                }
              });
              if (slotNum.length === 0) {
                this.$message.error(this.language.chooseDoorLock);
                return;
              }
              // 跳转到设施授权传入设施id和门号
              this.$router.navigate(['/business/user/unified-details/add'],
                {queryParams: {id: this.deviceId, slotNum: slotNum.join(',')}}).then(() => {
                modal.destroy();
              });
            }
          },
          {
            label: this.language.handleCancel,
            type: 'danger',
            onClick: () => {
              modal.destroy();
            }
          },
        ]
      });
      this.getLockInfo(this.deviceId).then();
    } else {
      this.$message.error(this.language.noSupport);
    }
  }

  /**
   * 获取电子锁信息
   */
  public getLockInfo(deviceId): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.$lockService.getLockInfo(deviceId).subscribe((result: Result) => {
        this.lockInfo = result.data || [];
        if (this.deviceType === DeviceTypeCode.well) {
          this.lockInfo = this.lockInfo.filter(item => item.doorNum !== wellCover.outCover);
        }
        resolve(this.lockInfo);
      }, (err) => {
        reject(err);
      });
    });

  }

  /**
   * 更新设施状态
   */
  public updateDeviceStatus(deviceStatus: string, msg: string): void {
    this.handlePrompt(msg, () => {
      const body = {deviceIds: [this.deviceId], deployStatus: deviceStatus};
      this.$lockService.updateDeviceStatus(body).subscribe((result: Result) => {
        if (result.code === 0) {
          this.$message.success(result.msg);
          // 请求成功要求面板刷新数据
          this.$refresh.refreshChange(true);
        } else {
          this.$message.error(result.msg);
        }
      });
    });

  }

  /**
   *  处理提示消息
   *  param nzContent
   *  param handle
   */
  public handlePrompt(nzContent: string, handle: () => void): void {
    this.$modal.confirm({
      nzTitle: this.language.prompt,
      nzContent: nzContent,
      nzMaskClosable: false,
      nzOkText: this.language.handleCancel,
      nzCancelText: this.language.handleOk,
      nzOkType: 'danger',
      nzOnOk: () => {
      },
      nzOnCancel: () => {
        handle();
      }
    });
  }

  /**
   * 显示纤芯成端弹窗
   */
  public coreEnd(): void {
    this.isEndVisible = true;
    this.show = true;
  }

  /**
   * 显示查看纤芯成端弹窗
   */
  public viewCoreEnd(): void {
    this.viewIsEndVisible = true;
    this.ViewShow = true;
  }

  /**
   * 跳转到实景图
   */
  public viewFacilities(): void {
    this.$router.navigate(['/business/facility/view-facility-picture'],
      {queryParams: {id: this.deviceId}, queryParamsHandling: 'preserve'}).then();
  }


  /**
   * 成端: 光交箱 配线架  熔纤: 光交箱 配线架 接头盒
   */
  public facilityTypeJudgment(): void {
    const type = DeviceTypeCode;
    // 接头盒没有查看设施详情
    if (this.deviceType === type.junctionBox) {
      this.isJointClosure = false;
    }
    if (this.deviceType === type.opticalBox || this.deviceType === type.distributionFrame) {
      this.isCoreEnd = true;
    } else {
      this.isCoreEnd = false;
    }
    if (this.deviceType === type.opticalBox || this.deviceType === type.distributionFrame ||
      this.deviceType === type.junctionBox) {
      this.isCoreFusion = true;
    } else {
      this.isCoreFusion = false;
    }
  }

  /**
   * 上传图片前校验操作
   * @param file UploadFile
   */
  public beforeUpload = (file: UploadFile): boolean => {
    const fileType = 'image/png,image/jpg,image/jpeg,image/gif';
    if (!fileType.includes(file.type)) {
      this.$message.error('图片格式不正确');
      return false;
    }
    const isLt100K = file.size / 1024 < 100;
    if (!isLt100K) {
      this.$message.error('图片大小不能超过100K!');
      return false;
    }
    this.formData.pic = file;
    return true;
  }

}

