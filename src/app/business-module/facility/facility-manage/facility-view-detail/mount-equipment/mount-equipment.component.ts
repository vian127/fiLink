import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {TableComponent} from '../../../../../shared-module/component/table/table.component';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {PageCondition, QueryCondition} from '../../../../../shared-module/entity/queryCondition';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityService} from '../../../../../core-module/api-service/facility/facility-manage';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../../../core-module/model/result-code.enum';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';

class EquipmentInfoModel {
}

/**
 * 设施详情挂载设备列表
 */
@Component({
  selector: 'app-mount-equipment',
  templateUrl: './mount-equipment.component.html',
  styleUrls: ['./mount-equipment.component.scss']
})
export class MountEquipmentComponent implements OnInit, OnDestroy {
  // 设施id
  @Input()
  public deviceId: string;
  // 列表实例
  @ViewChild('tableComponent') public tableComponent: TableComponent;
  // 设备状态template
  @ViewChild('equipmentStatusTemplate') public equipmentStatusTemplate: TemplateRef<Element>;
  // 列表数据
  public dataSet: Array<EquipmentInfoModel> = [];
  // 列表分页实体
  public pageBean: PageBean = new PageBean(5);
  // 列表配置
  public tableConfig: TableConfig;
  // 列表查询条件
  public queryCondition = new QueryCondition();
  // 设施类型
  public deviceType: string;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;

  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $facilityService: FacilityService,
    private $router: Router
  ) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.initTableConfig();
    this.queryCondition.pageCondition.pageSize = 5;
    this.queryCondition.bizCondition = {deviceId: this.deviceId};
    this.refreshData();
  }

  /**
   * 获取当期设施详情设备列表
   */
  public refreshData(): void {
    // 获取设施详情页面挂载设备概览列表
    this.$facilityService.queryMountEquipment(this.queryCondition)
      .subscribe((result: ResultModel<Array<EquipmentInfoModel>>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.dataSet = result.data;
        } else {
          this.$message.error(result.msg);
        }
      });
  }


  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      primaryKey: '',
      isDraggable: false,
      isLoading: false,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      columnConfig: [
        { // 挂载位置
          title: this.language.mountPosition, key: 'mountPosition',
          fixedStyle: {fixedRight: true, style: {left: '0px'}},
          width: 230,
          searchable: false,
        },
        { // 名称
          title: this.language.equipmentName, key: 'equipmentName', width: 230,
          searchable: false,
        },
        { // 类型
          title: this.language.equipmentType, key: 'equipmentType', width: 230,
          searchable: false,
        },
        { // 状态
          title: this.language.equipmentStatus, key: 'equipmentStatus',
          width: 230,
          type: 'render',
          renderTemplate: this.equipmentStatusTemplate,
          searchable: false,
        },
        { // 型号
          title: this.language.model,
          key: 'equipmentModel',
          width: 230,
          searchable: false,
        },
        { // 资产编号
          title: this.language.assetNumbers,
          key: 'assetNumbers',
          width: 250,
          searchable: false,
        },
        {
          title: this.commonLanguage.operate,
          searchable: false,
          key: '',
          width: 150,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [
        {
          text: '查看详情', className: 'fiLink-view-detail', handle: (currentIndex) => {
            this.navigateToDetail('business/facility/equipment-view-detail', {
              queryParams: {equipmentId: currentIndex.equipmentId, equipmentType: currentIndex.equipmentType}
            });
          },
        },
      ],
    };
  }

  public ngOnDestroy(): void {
    this.tableComponent = null;
  }

  /**
   * 分页查询
   * @param event PageBean
   */
  public pageChange(event: PageBean): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 跳转到详情
   * param url
   */
  private navigateToDetail(url, extras = {}): void {
    this.$router.navigateByUrl(url, extras).then();
  }

}
