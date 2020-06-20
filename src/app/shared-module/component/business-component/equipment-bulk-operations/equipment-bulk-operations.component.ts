import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {NzI18nService} from 'ng-zorro-antd';

@Component({
  selector: 'app-equipment-bulk-operations',
  templateUrl: './equipment-bulk-operations.component.html',
  styleUrls: ['./equipment-bulk-operations.component.scss']
})
export class EquipmentBulkOperationsComponent implements OnInit {
  // 弹框是否开启设置
  @Input()
  set xcVisible(params) {
    this.isXcVisible = params;
    this.xcVisibleChange.emit(this.isXcVisible);
  }

  // 弹框title
  @Input() title: string = '批量操作';
  // 是否展示信息屏幕控制
  @Input() isHasScreen: boolean = true;
  // 是否展示广播控制
  @Input() isHasBroadcast: boolean = true;
  // 是否展示照明控制
  @Input() isHasLight: boolean = true;
  // 信息屏播放内容
  @Input() screenContent: string = '测试图片.jpg';
  // 广播内容
  @Input() broadcastContent: string = '测试广播.mp3';
  // 请求未完成遮罩加载状态
  @Input() isShowOver: boolean = true;
  // 照明亮度变化
  @Output() lightChangeValue = new EventEmitter<number>();
  // 信息屏幕亮度变化
  @Output() screenLightChangeValue = new EventEmitter<number>();
  // 信息屏幕音量变化
  @Output() screenVolumeChangeValue = new EventEmitter<number>();
  // 广播音量辩护
  @Output() broadcastVolumeChangeValue = new EventEmitter<number>();
  // 公共操作开关、上下电状态
  @Output() commonSwitchValue = new EventEmitter<string>();
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 广播同步播放事件 screenPlay
  @Output() broadcastPlay = new EventEmitter<boolean>();
  // 信息屏同步播放事件
  @Output() screenPlay = new EventEmitter<boolean>();
  // 摄像头操作事件
  @Output() cameraChangeValue = new EventEmitter<string>();
  // 公共模块国际化
  public commonLanguage: CommonLanguageInterface;
  // 弹框是否开启
  public isXcVisible: boolean = false;
  // 照明亮度初始值
  public lightValue: number = 80;
  // 信息屏亮度初始值
  public screenLightValue: number = 80;
  // 信息屏音量初始值
  public screenVolumeValue: number = 30;
  // 广播音量初始值
  public broadcastValue: number = 30;


  get xcVisible() {
    return this.isXcVisible;
  }


  constructor(
    private $nzI18n: NzI18nService,
  ) {
  }

  ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
  }


  /**
   * 广播同步播放事件
   */
  public broadcastPlayChange(): void {
    this.broadcastPlay.emit(true);
  }

  /**
   * 信息屏同步播放事件
   */
  public screenPlayChange(): void {
    this.screenPlay.emit(true);
  }


  /**
   * 公共操作按钮触发事件
   */
  public commonSwitchChange(ev: string): void {
    this.commonSwitchValue.emit(ev);
  }


  /**
   * 照明控制亮度变化触发事件
   */
  public slideLightChange(ev: number): void {
    this.lightChangeValue.emit(ev);
  }

  /**
   * 信息屏幕亮度变化触发事件
   */
  public slideScreenLightChange(ev: number): void {
    this.screenLightChangeValue.emit(ev);
  }

  /**
   * 信息屏幕音量变化触发事件
   */
  public slideScreenVolumeChange(ev: number): void {
    this.screenVolumeChangeValue.emit(ev);
  }

  /**
   * 广播幕音量变化触发事件
   */
  public slideBroadcastVolumeChange(ev: number): void {
    this.broadcastVolumeChangeValue.emit(ev);
  }

  /**
   *  Modal 打开后的回调
   */
  public afterModelOpen(): void {

  }

  /**
   * Modal 完全关闭后的回调
   */
  public afterModelClose(): void {

  }

  /**
   * 关闭弹框
   */
  public handleCancel(): void {
    this.xcVisible = false;
  }


}
