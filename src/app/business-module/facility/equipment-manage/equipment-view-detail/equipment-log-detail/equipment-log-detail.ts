import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {EquipmentApiService} from '../../../share/service/equipment/equipment-api.service';
import {TableConfig} from '../../../../../shared-module/entity/tableConfig';
import {PageBean} from '../../../../../shared-module/entity/pageBean';
import {EquipmentLogModel} from '../../../share/model/equipment-log.model';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {QueryCondition} from '../../../../../shared-module/entity/queryCondition';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../../../core-module/model/result-code.enum';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';

/**
 *  设备日志详情组件
 *  created by PoHe
 */
@Component({
  selector: 'app-equipment-log-detail',
  templateUrl: './equipment-log-detail.html',
  styleUrls: ['./equipment-log-detail.scss']
})
export class EquipmentLogDetailComponent implements OnInit {

  // 入参设备id
  @Input()
  public equipmentId: string = '';
  // 设备日志列表数据
  public dataSet: EquipmentLogModel[] = [];
  // 表个参数
  public tableConfig: TableConfig;
  // 设备国际化
  public language: FacilityLanguageInterface;
  // 列表分页实体
  public pageBean: PageBean = new PageBean(5, 1);
  //  查询条件
  private queryCondition: QueryCondition = new QueryCondition();

  /**
   * 构造器
   */
  constructor(
    private $equipmentAipService: EquipmentApiService,
    private $router: Router,
    private $nzI18n: NzI18nService) {
  }

  /**
   * 初始化组件
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.initTableConfig();
    this.refreshLogData();
  }

  /**
   * 刷新表格数据
   */
  private refreshLogData(): void {
    this.tableConfig.isLoading = true;
    const condition = [{
      filterField: 'equipmentId',
      filterValue: this.equipmentId, operator: OperatorEnum.like
    }];
    this.queryCondition.filterConditions = this.queryCondition.filterConditions.concat(condition);
    this.queryCondition.pageCondition.pageSize = 5;
    this.queryCondition.pageCondition.pageNum = 1;
    this.$equipmentAipService.queryEquipmentLog(this.queryCondition).subscribe((result: ResultModel<any>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.dataSet = result.data || [];
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
    this.pageBean.Total = this.dataSet.length;
  }

  /**
   * 查询更多的设备日志
   */
  public onClickShowMore(): void {
    this.$router.navigate(['business/facility/facility-log'],
      {queryParams: {logId: this.equipmentId}}).then();
  }

  /**
   * 初始化表格参数
   */
  private initTableConfig(): void {
    this.tableConfig = {
      topButtons: [],
      primaryKey: '03-5',
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: true,
      scroll: {x: '1000px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0'}}
        },
        {
          title: this.language.equipmentLogName,
          isShowSort: true,
          key: 'logName',
          width: 100,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}},
        },
        {
          title: this.language.equipmentLogType,
          key: 'logType',
          width: 100,
          isShowSort: true,
        },
        {
          title: this.language.affiliatedDevice,
          key: 'deviceName',
          width: 100,
          isShowSort: true,
        },
        {
          title: this.language.createTime,
          key: 'currentTime',
          pipe: 'date',
          width: 124,
          isShowSort: true,
        },
        {
          title: this.language.extraRemarks,
          key: 'remarks',
          isShowSort: true,
        }
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      operation: [],
      leftBottomButtons: [],
    };
  }
}
