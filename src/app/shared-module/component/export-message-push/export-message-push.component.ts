import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {SessionUtil} from '../../util/session-util';

@Component({
  selector: 'app-export-message-push',
  templateUrl: './export-message-push.component.html',
  styleUrls: ['./export-message-push.component.scss']
})
export class ExportMessagePushComponent implements OnInit {
  exportLanguage;
  @Input() exportMsg: string;
  @Output() closeNz = new EventEmitter();
  @ViewChild('exportOkTemp') exportOkTemp: TemplateRef<any>;

  constructor(private $NzNotificationService: NzNotificationService,
              private $router: Router, private $nzi18n: NzI18nService) {
  }

  ngOnInit() {
    this.exportLanguage = this.$nzi18n.getLocale();
  }

  /**
   * 导出成功提示
   */
  showNotification() {
    this.$NzNotificationService.config({
      nzPlacement: 'bottomRight',
      nzDuration: SessionUtil.getMsgSetting().retentionTime * 1000
    });
    this.$NzNotificationService.template(this.exportOkTemp);
  }

  /**
   * 提示中点击确定跳转导出管理页面
   */
  goExportHTML() {
    this.$router.navigate(['/business/download']);
    this.closeNz.emit();
  }

}
