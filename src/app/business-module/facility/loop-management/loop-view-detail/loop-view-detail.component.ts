import { Component, OnInit } from '@angular/core';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {NzI18nService} from 'ng-zorro-antd';

@Component({
  selector: 'app-loop-view-detail',
  templateUrl: './loop-view-detail.component.html',
  styleUrls: ['./loop-view-detail.component.scss']
})
export class LoopViewDetailComponent implements OnInit {
  // 设施语言包
  public language: FacilityLanguageInterface;

  constructor(
    private $nzI18n: NzI18nService,
  ) { }

  ngOnInit() {
    // 国际化
    this.language = this.$nzI18n.getLocaleData('facility');
  }

}
