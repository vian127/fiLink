import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {PictureInfo} from '../../../business-module/facility/facility-manage/photo-viewer/photo-viewer-entity';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss']
})
export class ImageViewComponent implements OnInit, OnChanges {

  @Input() curPicInfo: PictureInfo;
  @Input() picList: Array<PictureInfo> = [];
  @Output() viewClose = new EventEmitter();
  // 滑动图片列表
  slidePicList: Array<PictureInfo> = [];
  // 图片放大缩小状态
  imgState = {
    rot : 0, // 图片旋转角度
    scale: 1
  };
  // 鼠标是否按下
  isMousedown = false;
  // 记录鼠标原始位置
  imgCoordinate = {
    x: 0,
    y: 0,
    left: 0,
    top: 0
  };
  @ViewChild('img') imgElementRef: ElementRef;
  constructor(private renderer2: Renderer2) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dealSlidePicList(changes.curPicInfo.currentValue, changes.picList.currentValue);
  }

  close() {
    this.viewClose.emit();
  }

  /**
   * 图片处理
   * param curPicInfo
   * param showPicList
   */
  dealSlidePicList(curPicInfo, picList) {
    this.picList = picList.map((item, index) => {
      item.indexNo = index + 1;
      return item;
    });
    this.curPicInfo = (this.picList.filter(item => item.devicePicId === this.curPicInfo.devicePicId))[0];
    if (picList.length <= 5) {
      this.slidePicList = picList;
    } else {
      this.initSlidePicList();
    }
  }

  /**
   * 上一页
   */
  last() {
    const indexNo = this.curPicInfo.indexNo;
    if (indexNo === 1) {
      return;
    }
    this.curPicInfo = this.picList[indexNo - 2];
    if (this.picList.length > 5) {
      this.initSlidePicList();
    }
    // 初始化图片状态
    this.imgReset();
  }

  /**
   * 下一页
   */
  next() {
    const indexNo = this.curPicInfo.indexNo;
    if (indexNo === this.picList.length) {
      return;
    }
    this.curPicInfo = this.picList[indexNo];
    if (this.picList.length > 5) {
      this.initSlidePicList();
    }
    // 初始化图片状态
    this.imgReset();
  }

  /**
   * 点击滑动图片选择
   * param item
   */
  choosePic(item) {
    this.curPicInfo = item;
    if (this.picList.length > 5) {
      this.initSlidePicList();
    }
    this.imgReset();
  }

  /**
   * 图片向右旋转
   */
  imgRight() {
    this.imgState.rot ++;
    if (this.imgState.rot > 3) {
      this.imgState.rot = 0;
    }
    this.imgScaleRotate();
  }
  /**
   * 图片向左旋转
   */
  imgLeft() {
    this.imgState.rot --;
    if (this.imgState.rot < 0) {
      this.imgState.rot = 3;
    }
    this.imgScaleRotate();
  }

  /**
   * 图片放大缩小
   * param multiple
   */
  imgToSize(multiple) {
    this.imgState.scale = this.imgState.scale * (1 + multiple) ;
    this.imgScaleRotate();
  }

  /**
   * 图片放大旋转
   */
  imgScaleRotate() {
    this.renderer2.setStyle(this.imgElementRef.nativeElement,
      'transform', `scale(${this.imgState.scale}) rotate(${this.imgState.rot * 90}deg)`);
  }

  /**
   * 图片比例还原
   */
  imgResetScale() {
    this.imgState.scale = 1;
    this.imgScaleRotate();
    this.movePicture(0, 0);
  }

  /**
   * 图片还原
   */
  imgReset() {
    this.imgState.scale = 1;
    this.imgState.rot = 0;
    this.imgScaleRotate();
    this.movePicture(0, 0);
  }
  /**
   * 监听鼠标点击图片
   * param event
   */
  imgMousedown(event: MouseEvent) {
    this.isMousedown = true;
    this.imgCoordinate.x = event.clientX;
    this.imgCoordinate.y = event.clientY;
    if (this.imgElementRef.nativeElement.style.left) {
      this.imgCoordinate.left = parseInt(this.imgElementRef.nativeElement.style.left, 0);
    }
    if (this.imgElementRef.nativeElement.style.top) {
      this.imgCoordinate.top = parseInt(this.imgElementRef.nativeElement.style.top, 0);
    }
    return false;
  }

  /**
   * 监听鼠标在图片上移动
   * param event
   */
  imgMousemove(event: MouseEvent) {
    if (this.isMousedown) {
      const x = event.clientX;
      const y = event.clientY;
      this.movePicture(this.imgCoordinate.left + x - this.imgCoordinate.x, this.imgCoordinate.top + y - this.imgCoordinate.y);
    }
  }

  /**
   * 监听鼠标离开和鼠标放开
   */
  imgMouseup() {
    this.isMousedown = false;
  }

  /**
   * 图片拖拽
   * param left
   * param top
   */
  movePicture(left, top) {
    this.renderer2.setStyle(this.imgElementRef.nativeElement, 'left', `${left}px`);
    this.renderer2.setStyle(this.imgElementRef.nativeElement, 'top', `${top}px`);
  }
  /**
   * 初始化slidePicList
   */
  private initSlidePicList() {
    const indexNo = this.curPicInfo.indexNo;
    if (indexNo >= 3 && this.picList.length - indexNo >= 2) {
      this.slidePicList = this.picList.slice(indexNo - 3, indexNo + 2);
    } else if (indexNo < 3) {
      this.slidePicList = this.picList.filter(item => item.indexNo < 6);
    } else {
      this.slidePicList = this.picList.filter(item => item.indexNo > this.picList.length - 5);
    }
  }

}
