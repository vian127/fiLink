import {AfterContentInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../../core-module/model/result-code.enum';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {IndexFacilityService} from '../../../../core-module/api-service/index/facility';
import {SelectGroupDataModel, SelectGroupItemModel} from '../../shared/model/facility-condition.model';

/**
 * 分组和租赁方组件
 */
@Component({
  selector: 'app-index-facility-group',
  templateUrl: './index-facility-group.component.html',
  styleUrls: ['./index-facility-group.component.scss']
})
export class IndexFacilityGroupComponent implements OnInit, AfterContentInit {
  // 发送选中的分组
  @Output() selectGroupItemEmit = new EventEmitter();
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 选中可选项目
  public selectGroupItem: SelectGroupItemModel[] = [];
  // 选中的分组
  public selectGroupValue = [];
  // 选中的租赁方
  public selectRentValue = [];
  // 租赁方是否展示
  public isShowRent = false;
  // 选中可选项目
  public selectRentItem = [
    {key: '1', value: '租户1'},
    {key: '2', value: '租户2'},
    {key: '3', value: '租户3'},
  ];

  // 分组列表查询条件
  queryGroupListCondition: QueryCondition = new QueryCondition();

  constructor(public $nzI18n: NzI18nService,
              public $IndexFacilityService: IndexFacilityService,) {
    this.indexLanguage = $nzI18n.getLocaleData('index');
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.getGroupList();
  }


  /**
   * 查询分组列表
   */
  public getGroupList(): void {
    this.$IndexFacilityService.queryGroupInfoList(this.queryGroupListCondition)
      .subscribe((result: ResultModel<SelectGroupDataModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          const children: Array<{ label: string; value: string }> = [];
          result.data.forEach(f => {
            children.push({label: f.groupName, value: f.groupId});
          });
          this.selectGroupItem = children;
        }
      });
  }

  /**
   * 发送选中的分组
   */
  public selectItemOption(): void {
    this.selectGroupItemEmit.emit(this.selectGroupValue);
  }

}
