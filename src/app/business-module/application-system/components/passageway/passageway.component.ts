import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-passageway',
  templateUrl: './passageway.component.html',
  styleUrls: ['./passageway.component.scss']
})
export class PassagewayComponent implements OnInit {

  // 点击配置之后需要关闭弹窗
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * 关闭弹窗  打开通道配置
   */
  openPassageway() {
    this.close.emit();
  }
}
