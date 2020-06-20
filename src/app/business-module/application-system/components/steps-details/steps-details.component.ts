import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {Router} from '@angular/router';
import {QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {Result} from '../../../../shared-module/entity/result';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TableConfig} from '../../../../shared-module/entity/tableConfig';
import {OnlineLanguageInterface} from '../../../../../assets/i18n/online/online-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {UserService} from '../../../../core-module/api-service/user/user-manage';
import {ApplicationService} from '../../server';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';

@Component({
  selector: 'app-steps-details',
  templateUrl: './steps-details.component.html',
  styleUrls: ['./steps-details.component.scss']
})
export class StepsDetailsComponent implements OnInit {
  pageBean: PageBean = new PageBean(10, 1, 1);
  tableConfig: TableConfig;
  language: OnlineLanguageInterface;
  queryCondition: QueryCondition = new QueryCondition();
  @Input() isOperation = false;
  @Input() strategyId;
  @Input() lightingData: any = {};
  @Input() isShowTable = true;
  @Output('deleteNotify') deleteNotify = new EventEmitter();
  @Output('editNotify') editNotify = new EventEmitter();
  @Output('downNotify') downNotify = new EventEmitter();
  constructor(
    public $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    public $router: Router,
    public $applicationService: ApplicationService,
    public $userService: UserService,
  ) {
    this.language = this.$nzI18n.getLocaleData('online');
  }

  ngOnInit() {
    this.initTableConfig();
  }

  pageChange(event) {
    console.log(event);
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          title: '设备名称', key: 'refName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        // this.refreshData();
      },
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        // this.refreshData();
      }
    };
  }

  /**
   * 策略下发
   */
  handDown() {
    this.downNotify.emit(this.strategyId);
  }

  /**
   * 策略禁用和启用
   * @ param value
   */
  switchChange(value) {
    const params = {
      'strategyType': '1',
      'operation': value === true ? '1' : '2',
      'strategyIds': [this.strategyId]
    };
    this.$applicationService.enableOrDisableStrategy(params).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.success('请求成功！');
      }
    }, () => {

    });
  }
  /**
   * 编辑
   */
  handEdit() {
    this.editNotify.emit();
  }

  /**
   * 删除
   */
  handDelete() {
    this.deleteNotify.emit();
  }
}
