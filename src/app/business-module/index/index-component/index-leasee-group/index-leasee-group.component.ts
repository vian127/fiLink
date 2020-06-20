import {Component, Input, OnInit} from '@angular/core';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {NzI18nService} from 'ng-zorro-antd';

@Component({
  selector: 'app-index-leasee-group',
  templateUrl: './index-leasee-group.component.html',
  styleUrls: ['./index-leasee-group.component.scss']
})
export class IndexLeaseeGroupComponent implements OnInit {
  @Input() isShowLeasee = false;
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 选中的租赁方
  public selectRentValue = [];
  // 选中可选项目
  public selectRentItem = [
    {key: '1', value: '租户1'},
    {key: '2', value: '租户2'},
    {key: '3', value: '租户3'},
  ];

  constructor(public $nzI18n: NzI18nService) {
    this.indexLanguage = $nzI18n.getLocaleData('index');
  }

  ngOnInit() {
  }

}
