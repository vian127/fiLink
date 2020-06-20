import {Component, OnInit} from '@angular/core';
import {Result} from '../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {AreaService} from '../../../../core-module/api-service/facility';
import {NzI18nService} from 'ng-zorro-antd';
import {MapSelectorConfig} from '../../../../shared-module/entity/mapSelectorConfig';
import {ActivatedRoute, Router} from '@angular/router';
import {MapService} from '../../../../core-module/api-service/index/map';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {InspectionService} from '../../../../core-module/api-service/work-order/inspection';

/**
 * 巡检设施组件
 */
@Component({
  selector: 'app-set-area-device',
  templateUrl: './set-area-device.component.html',
  styleUrls: ['./set-area-device.component.scss']
})
export class SetAreaDeviceComponent implements OnInit {
  // 国际化
  public language: InspectionLanguageInterface;
  // 选中设施数据存放
  public deviceSet = [];
  // 设施选择配置
  public mapSelectorConfig: MapSelectorConfig;
  // 区域id
  public areaId: string = null;
  // 设施弹框默认开启
  mapVisible = true;
  // 巡检任务ID
  inspectionTaskId;
  // 是否巡检全集
  isSelectAll = true;

  constructor(public $message: FiLinkModalService,
              public $nzI18n: NzI18nService,
              public $router: Router,
              public $active: ActivatedRoute,
              public $mapService: MapService,
              public $inspection: InspectionService,
              public $areaService: AreaService) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('inspection');
    this.initMapSelectorConfig();
    this.inspectionWorkSelectDevice();
  }

  /**
   * 关联每条巡检任务所选设施
   * param id
   */
  inspectionWorkSelectDevice() {
    this.$active.queryParams.subscribe(param => {
      this.inspectionTaskId = param.id;
      const id = new Object();
      id['inspectionTaskId'] = this.inspectionTaskId;
      this.$inspection.inspectionFacility(id).subscribe((result: Result) => {
        if (result.code === 0) {
          if (result.data.length > 0) {
            this.areaId = result.data[0].deviceAreaId;
            this.deviceSet = result.data.map(item => item.deviceId);
          }
        }
      });
    });
  }

  /**
   * 关联区域所选结果
   * param event
   */
  mapSelectDataChange(event) {
    const list = event.map(item => item.deviceId);
    const obj = {};
    obj[this.areaId] = list;
    this.setAreaDevice(obj);
  }

  /**
   * 弹框的显示隐藏
   * param event
   */
  xcVisibleChange(event) {
    if (event) {
    } else {
      this.$router.navigate(['/business/work-order/inspection/task-list']).then();
    }
  }

  /**
   * 关联设施
   * param body
   */
  public setAreaDevice(body) {
    this.$areaService.setAreaDevice(body).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 设施选择配置
   * param body
   */
  public initMapSelectorConfig() {
    this.mapSelectorConfig = {
      title: this.language.inspectionFacility,
      width: '1100px',
      height: '465px',
      mapData: [],
      selectedColumn: [
        {
          title: this.language.deviceName, key: 'deviceName', width: 80
        },
        {
          title: this.language.deviceCode, key: 'deviceCode', width: 80,
        },
        {
          title: this.language.deviceType, key: '_deviceType', width: 60,
        },
        {
          title: this.language.parentId, key: 'areaName', width: 80,
        }
      ]
    };
  }
}
