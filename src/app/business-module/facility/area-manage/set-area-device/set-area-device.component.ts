import {Component, OnInit} from '@angular/core';
import {Result} from '../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {AreaService} from '../../../../core-module/api-service/facility';
import {NzI18nService} from 'ng-zorro-antd';
import {MapSelectorConfig} from '../../../../shared-module/entity/mapSelectorConfig';
import {ActivatedRoute, Router} from '@angular/router';
import {MapService} from '../../../../core-module/api-service/index/map';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';

/**
 * 关联设施组件
 */
@Component({
  selector: 'app-set-area-device',
  templateUrl: './set-area-device.component.html',
  styleUrls: ['./set-area-device.component.scss']
})
export class SetAreaDeviceComponent implements OnInit {
  // 地图显示隐藏
  mapVisible = true;
  // 设施语言包
  language: FacilityLanguageInterface;
  // 地图选择器配置
  mapSelectorConfig: MapSelectorConfig;
  // 区域id
  public areaId: string = null;

  constructor(private $message: FiLinkModalService,
              private $nzI18n: NzI18nService,
              private $router: Router,
              private $active: ActivatedRoute,
              private $mapService: MapService,
              private $areaService: AreaService) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.initMapSelectorConfig();
    this.areaId = this.$active.snapshot.queryParams.id;
    this.$active.queryParams.subscribe(params => {
      this.areaId = params.id;
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
      this.$router.navigate(['/business/facility/area-list']).then();
    }
  }

  /**
   * 关联设施
   * param body
   */
  private setAreaDevice(body) {
    this.$areaService.setAreaDevice(body).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  private initMapSelectorConfig() {
    this.mapSelectorConfig = {
      title: this.language.setDevice,
      width: '1100px',
      height: '465px',
      mapData: [],
      selectedColumn: [
        {
          title: this.language.deviceName, key: 'deviceName', width: 100
        },
        {
          title: this.language.deviceCode, key: 'deviceCode', width: 100,
        },
        {
          title: this.language.deviceType, key: '_deviceType', width: 60,
        },
        {
          title: this.language.parentId, key: 'areaName', width: 100,
        }
      ]
    };
  }
}
