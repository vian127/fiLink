import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ApplicationService} from '../../server';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ClearWorkOrderModel} from '../../../index/shared/model/work-order-condition.model';


/**
 * 摄像头配置组件
 */
@Component({
  selector: 'app-camera-settings',
  templateUrl: './camera-settings.component.html',
  styleUrls: ['./camera-settings.component.scss']
})
export class CameraSettingsComponent implements OnInit, AfterViewInit {

  @Input()
  equipmentId: string;

  /**
   * @param $applicationService 后台服务
   */
  constructor(
    private $applicationService: ApplicationService,
  ) {
  }

  ngOnInit() {
    console.log(this.equipmentId);
  }

  ngAfterViewInit(): void {
  }


  /**
   * 摄像头云台控制
   * @param direction 方向: TILT_UP:北； TILT_DOWN:南；PAN_LEFT：西；PAN_RIGHT：东；
   * UP_LEFT：西北； UP_RIGHT：东北；DOWN_LEFT：西南；DOWN_RIGHT：东南；
   */
  public onCloudControl(direction: string): void {
    const cloudControlParameter = {
      direction: direction,
      equipmentId: this.equipmentId,
      zoom: 1,
      focus: 1,
      diaphragm: 1,
      type: 1,
    };
    this.$applicationService.cloudControl(cloudControlParameter).subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
      // if (result.code === '00000') {
      //
      // }
    });
  }
}
