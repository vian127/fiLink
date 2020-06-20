import {Component, OnInit} from '@angular/core';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {NzI18nService} from 'ng-zorro-antd';

/**
 * 回路详情操作模块
 */
@Component({
  selector: 'app-loop-basic-operation',
  templateUrl: './loop-basic-operation.component.html',
  styleUrls: ['./loop-basic-operation.component.scss']
})
export class LoopBasicOperationComponent implements OnInit {
  // 设施语言包
  public language: FacilityLanguageInterface;

  constructor(
    private $nzI18n: NzI18nService,
  ) {
  }

  ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData('facility');
  }


  /**
   * 回路拉闸
   */
  public loopBrake(): void {

  }

  /**
   * 回路合闸
   */
  public loopClosing(): void {

  }

}
