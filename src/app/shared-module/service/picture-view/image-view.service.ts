import {ComponentRef, Injectable} from '@angular/core';
import {PictureInfo} from '../../../business-module/facility/facility-manage/photo-viewer/photo-viewer-entity';
import {ImageViewComponent} from '../../component/image-view/image-view.component';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';

@Injectable()
export class ImageViewService {
  private imageViewRef: ComponentRef<ImageViewComponent> | null;
  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay) {
  }

  showPictureView(picList: Array<PictureInfo>, curPicInfo?: PictureInfo) {
    this.overlayRef = this.overlay.create();
    this.imageViewRef = this.overlayRef.attach(new ComponentPortal(ImageViewComponent));
    if (picList && picList.length > 0) {
      picList = picList.map((item, index) => {
        item.indexNo = index + 1;
        return item;
      });
      if (!curPicInfo) {
        curPicInfo = picList[0];
      }
      this.imageViewRef.instance.picList = picList;
      this.imageViewRef.instance.curPicInfo = curPicInfo;
    }
    this.imageViewRef.instance.dealSlidePicList(curPicInfo, picList);
    this.imageViewRef.instance.viewClose.subscribe(() => {
      this.imageViewRef.destroy();
      this.overlayRef.detach();
    });
  }
}
