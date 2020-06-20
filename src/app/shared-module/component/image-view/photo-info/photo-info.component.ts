import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {PictureInfo} from '../../../../business-module/facility/facility-manage/photo-viewer/photo-viewer-entity';
import {PictureViewService} from '../../../../core-module/api-service/facility/picture-view-manage/picture-view.service';
import {Result} from '../../../entity/result';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {getDeviceType} from '../../../../business-module/facility/share/const/facility.config';
import {Option} from '../../check-select-input/check-select-input.component';

/**
 * 图片来源
 */
export enum resourceType {
  ONE = '1', // 告警
  TWO = '2'  // 工单
}

/**
 * 点击来源
 */
export enum resourceStatus {
  PIC_STATUS_CLEAR_UNFINISHED = '1', // 销账未完工列表
  PIC_STATUS_CLEAR_HIS = '2', // 销账历史列表
  PIC_STATUS_INSPECTION_UNFINISHED = '3', // 巡检未完工列表
  PIC_STATUS_INSPECTION_HIS = '4', // 巡检历史列表
  PIC_STATUS_CURRENT_ALARM = '5', // 当前告警
  PIC_STATUS_HIS_ALARM = '6' // 历史告警
}

@Component({
  selector: 'app-photo-info',
  templateUrl: './photo-info.component.html',
  styleUrls: ['./photo-info.component.scss']
})
export class PhotoInfoComponent implements OnInit {

  @Input() picInfo: PictureInfo;
  @Input() pColor = 'black';
  @Output() pageLink = new EventEmitter();
  // 国际化
  language: any;
  deviceList = [];

  constructor(private $nzI18n: NzI18nService,
              private $router: Router,
              private $message: FiLinkModalService,
              private $pictureViewService: PictureViewService) {
    this.language = $nzI18n.getLocaleData('facility');
  }

  ngOnInit() {
    // 设施类型查询列表
    this.deviceList = getDeviceType(this.$nzI18n).map(item => {
      const obj: Option = {
        label: '',
        value: ''
      };
      obj.label = item.label;
      obj.value = item.code;
      return obj;
    });
  }

  /**
   * 点击来源  页面跳转
   */
  linkTo() {
    let funcName = '';
    if (this.picInfo.resource === resourceType.ONE) {
      funcName = 'queryIsStatus';
    } else if (this.picInfo.resource === resourceType.TWO) {
      funcName = 'getProcessByProcId';
    }
    // 更具来源id查询来源类型  跳转不同页面
    this.$pictureViewService[funcName](this.picInfo.resourceId).subscribe((result: Result) => {
      if (result.code === 0) {
        let url = '';
        switch (result.data.status) {
          case resourceStatus.PIC_STATUS_CLEAR_UNFINISHED:
            url = '/business/work-order/clear-barrier/unfinished-list';
            break;
          case resourceStatus.PIC_STATUS_CLEAR_HIS:
            url = '/business/work-order/clear-barrier/history-list';
            break;
          case resourceStatus.PIC_STATUS_INSPECTION_UNFINISHED:
            url = '/business/work-order/inspection/unfinished-list';
            break;
          case resourceStatus.PIC_STATUS_INSPECTION_HIS:
            url = '/business/work-order/inspection/finished-list';
            break;
          case resourceStatus.PIC_STATUS_CURRENT_ALARM:
            url = '/business/alarm/current-alarm';
            break;
          case resourceStatus.PIC_STATUS_HIS_ALARM:
            url = '/business/alarm/history-alarm';
            break;
          default:
            console.log('default');
        }
        if (url) {
          this.$router.navigate([url], {
            queryParams: {
              id: this.picInfo.resourceId
            }
          }).then();
          this.pageLink.emit();
        }
      } else {
        this.$message.warning(result.msg);
      }
    });
  }
}
