import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BasicConfig} from '../../../../../basic-config';
import {NzI18nService} from 'ng-zorro-antd';
import {SmartService} from '../../../../../../core-module/api-service/facility/smart/smart.service';
import {Result} from '../../../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityPortInfo} from '../../../../../../core-module/model/facility/facility-port-info';
import {PortStateEnum, LabelTypeEnum, AdapterTypeEnum} from '../../../../../../shared-module/entity/template';

@Component({
  selector: 'app-facility-port-info',
  templateUrl: './facility-port-info.component.html',
  styleUrls: ['./facility-port-info.component.scss']
})
export class FacilityPortInfoComponent extends BasicConfig implements OnInit, OnChanges {
  // 表格配置
  @Input() public eChartOption = null;
  // 端口id
  @Input() public portID = '';
  public facilityPortInfo = new FacilityPortInfo();
  // 端口状态
  public portStateEnum;
  // 标签类型
  public labelTypeEnum;
  // 适配器类型
  public adapterTypeEnum;

  constructor(public $nzI18n: NzI18nService,
              private $smartService: SmartService,
              private $message: FiLinkModalService) {
    super($nzI18n);
  }

  public ngOnInit(): void {
    this.portStateEnum = PortStateEnum;
    this.labelTypeEnum = LabelTypeEnum;
    this.adapterTypeEnum = AdapterTypeEnum;
    // 端口信息显示配置
    this.formColumn = [
      // 端口号
      {
        label: this.language.facility.viewFacilityPicture.portNo, key: 'portNum', type: 'input', rule: [], disabled: true, col: 24
      },
      // 智能标签ID
      {
        label: this.language.facility.viewFacilityPicture.smartID, key: 'rfId', type: 'input', rule: [], disabled: true, col: 24
      },
      // 状态
      {
        label: this.language.facility.viewFacilityPicture.state, key: 'state', type: 'input', rule: [], disabled: true, col: 24
      },
      // 适配器类型
      {
        label: this.language.facility.viewFacilityPicture.adaptorType, key: 'adapterType', type: 'input',
        rule: [], disabled: true, col: 24
      },
      // 标签类型
      {
        label: this.language.facility.viewFacilityPicture.tagType, key: 'labelType', type: 'input', rule: [], disabled: true, col: 24
      },
      // 光缆段信息
      {
        label: this.language.facility.viewFacilityPicture.opticCableSectionName, key: 'opticCableSectionName', type: 'input',
        rule: [], disabled: true, col: 24
      },
      // 纤芯信息
      {
        label: this.language.facility.viewFacilityPicture.cableCoreInfo, key: 'cableCore', type: 'input',
        rule: [], disabled: true, col: 24
      },
      // 智能标签备注信息
      {
        label: this.language.facility.viewFacilityPicture.smartRemark, key: 'remark', type: 'input',
        rule: [], disabled: true, col: 24
      },
    ];
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('portID') && changes.portID.currentValue) {
      // 当端口改变 重新查询端口信息
      this.$smartService.queryPortInfoByPortId(changes.portID.currentValue).subscribe((result: Result) => {
        if (result.code === 0) {
          // 查询成功 重新设置表格值
          this.facilityPortInfo = result.data;
        } else {
          this.$message.warning(result.msg);
        }
      });
    }
  }
}
