import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import Viewer from 'viewerjs';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {PictureInfo} from '../photo-viewer-entity';
import {Download} from '../../../../../shared-module/util/download';
import {NzI18nService} from 'ng-zorro-antd';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent implements OnInit, OnChanges {

  @Input() public photoList: Array<PictureInfo> = [];
  @Input() public timeStr = '';
  @Output() public selectChange = new EventEmitter();
  @Output() public viewItem = new EventEmitter();
  @Output() public delImg = new EventEmitter();
  @Output() public viewLargerImage = new EventEmitter();

  // 当前图片信息
  public curPhoto = {
    picName: ''
  };
  public viewer: Viewer;
  // 全部勾选
  public allChecked = false;
  // 已勾选列表
  public selectedList = [];
  public hidden = true;
  // 国际化
  public language: any;
  public overlayRef: OverlayRef;
  @ViewChild('picInfo') public picInfoTemplate: TemplateRef<any>;
  constructor( private overlay: Overlay,
               private $download: Download,
               private $nzI18n: NzI18nService,
               private viewContainerRef: ViewContainerRef) { }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    // 图片大小转换
    this.photoList.forEach((item: any) => {
      item.picSize = item.picSize ? (item.picSize / 1000).toFixed(2) + 'kb' : '';
    });
  }

  /**
   * 监听数据变化
   * param changes
   */
  public ngOnChanges(changes: SimpleChanges): void {
    // 监听到数据变化时取消全选
    this.allChecked = false;
  }

  /**
   * 勾选
   */
  public checkItem(item): void {
    if (!this.selectedList.some((el) => item.devicePicId === el.devicePicId)) {
      this.selectedList.push(item);
    } else {
      this.selectedList = this.selectedList.filter(el => el.devicePicId !== item.devicePicId);
      item.checked = false;
    }
    this.updateAllChecked();
    const obj = {};
    obj[this.timeStr] = this.selectedList;
    this.selectChange.emit(obj);
  }

  /**
   * 全部勾选/取消
   */
  public selectAll(): void {
    if (this.allChecked) {
      this.photoList.forEach(item => item.checked = true);
      this.selectedList = this.photoList;
    } else {
      this.photoList.forEach(item => item.checked = false);
      this.selectedList = [];
    }
    const obj = {};
    obj[this.timeStr] = this.selectedList;
    this.selectChange.emit(obj);
  }

  /**
   * 图片删除
   * param item
   */
  public delete(item): void {
    // 如果该图片已勾选则先去掉勾选
    if (item.checked) {
      this.checkItem(item);
    }
    this.delImg.emit([item]);
  }
  /**
   * 大图退出
   */
  public close(): void {
    this.curPhoto = {picName: ''};
    this.viewer.hide();
  }

  /**
   * 查看详情
   * param item
   */
  public clickItem(event, item): void {
    event.stopPropagation();
    this.viewItem.emit(item);
  }

  /**
   * 鼠标移动到眼睛显示图片信息
   * param item
   * param picInfo
   */
  public showPicInfo(item, picInfo): void {
    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(item.target).withPositions([{ originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: 10
        }]);
    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: strategy
    });
    this.overlayRef.attach(new TemplatePortal(this.picInfoTemplate, this.viewContainerRef, {picInfo}));
  }

  /**
   * 移开隐藏图片信息
   */
  public hidePicInfo(): void {
    this.overlayRef.detach();
  }

  /**
   * 点击图片查看大图
   * param item
   */
  public viewBigPic(item): void {
    this.viewLargerImage.emit({
      curPicInfo: item,
      bigPicList: this.photoList
    });
  }

  /**
   * 图片下载
   * param url
   */
  public download(url): void {
    this.$download.downloadFile(url);
  }
  /**
   * 更新全选
   */
  private updateAllChecked(): void {
    if (this.selectedList.length === this.photoList.length) {
      this.allChecked = true;
    } else {
      this.allChecked = false;
    }
  }
}
