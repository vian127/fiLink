import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {PictureViewService} from '../../../../core-module/api-service/facility/picture-view-manage/picture-view.service';
import {Result} from '../../../../shared-module/entity/result';
import {DateType, TimeItem} from './timer-selector/timeSelector';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {fromEvent} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {PictureInfo} from './photo-viewer-entity';
import {ImageViewService} from '../../../../shared-module/service/picture-view/image-view.service';
import {Subscription} from 'rxjs/src/internal/Subscription';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.scss']
})
export class PhotoViewerComponent implements OnInit {
  @ViewChild('imgView') imgView: ElementRef;
  // 图片列表
  public photoList = [];
  // 控制过滤显示隐藏
  public showFilter = false;
  // 列表查询条件 默认每页30
  public queryConditions = {
    bizCondition: {}, pageCondition: {
      'pageSize': 60,
      'pageNum': 1
    }
  };
  // 当前查看图片信息
  public picInfo: PictureInfo = {};
  // 已勾选图片列表
  public selectPicObj = {};
  // 时间选择器数据
  public timeList: Array<TimeItem> = [];
  // 国际化
  public language;
  // 查询加载动画
  public loading = false;
  // 滚动条监听
  public subscribeScroll;
  // 加载更多
  public loadMore = false;
  // 总页数
  public totalPage = 0;
  // 当前页数据
  public currentPageSize: number;

  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private el: ElementRef,
              private $modalService: NzModalService,
              private $imageViewService: ImageViewService,
              private $pictureViewService: PictureViewService) {
    this.language = $nzI18n.getLocale();
  }

  public ngOnInit(): void {
    // 初始化时间选择器列表
    this.timeList = [{
      label: this.language.facility.picInfo.day,
      value: DateType.DAY
    }, {
      label: this.language.facility.picInfo.week,
      value: DateType.WEEK
    }, {
      label: this.language.facility.picInfo.month,
      value: DateType.MONTH
    }, {
      label: this.language.facility.picInfo.year,
      value: DateType.YEAR
    }];
    this.searchList();
    this.subscribeScroll = fromEvent(this.imgView.nativeElement, 'scroll').pipe(debounceTime(100)).subscribe(result => {
      this.scrollListener(result);
    });
  }

  public deleteDisable(): boolean {
    let delImgList = [];
    Object.values(this.selectPicObj).forEach(item => {
      delImgList = delImgList.concat(item);
    });
    return delImgList.length === 0;
  }

  /**
   * 查询
   */
  public searchList(): void {
    this.loading = true;
    // 将时间转化为时间戳
    const queryConditions = JSON.parse(JSON.stringify(this.queryConditions));
    if (queryConditions.bizCondition && queryConditions.bizCondition['startTime']) {
      queryConditions.bizCondition['startTime'] = (new Date(queryConditions.bizCondition['startTime']).getTime()) / 1000;
    }
    if (queryConditions.bizCondition && queryConditions.bizCondition['endTime']) {
      queryConditions.bizCondition['endTime'] = (new Date(queryConditions.bizCondition['endTime']).getTime()) / 1000;
    }
    this.$pictureViewService.imageListByPage(queryConditions).subscribe(((result: Result) => {
      this.loading = false;
      this.loadMore = false;
      if (result.code === 0) {
        this.totalPage = result.totalPage;
        this.currentPageSize = result.size;
        let photoList = Object.entries(result.data).map((arr) => {
          return {
            time: arr[0].replace(/-/g, '/'),
            picList: arr[1]
          };
        });
        const length = this.photoList.length;
        // 如果第一次和第二次查询上来的结果有冲突则合并
        if (length > 0 && this.photoList[length - 1].time === photoList[0].time) {
          this.photoList[length - 1].picList = this.photoList[length - 1].picList.concat(photoList[0].picList);
          photoList = photoList.slice(1);
        }
        this.photoList = this.photoList.concat(photoList);
      } else {
        this.$message.error(result.msg);
      }
    }), () => {
      this.loading = false;
      this.loadMore = false;
      if (this.queryConditions.pageCondition.pageNum > 1) {
        this.queryConditions.pageCondition.pageNum--;
      }
    });
  }

  /**
   * 监听查看文件变化
   */
  public picInfoChange(item): void {
    this.picInfo = item;
  }

  /**
   * 查询条件变化
   * param filterObj
   */
  public changeFilter(filterObj): void {
    // 初始化列表
    this.photoList = [];
    // 初始化分页条件
    this.queryConditions.pageCondition.pageNum = 1;
    this.queryConditions.bizCondition = Object.assign(this.queryConditions.bizCondition, filterObj);
    this.picInfo = {};
    this.searchList();
  }

  /**
   * 存储所用已选择图片
   * param list
   */
  public dealSelectPic(list): void {
    this.selectPicObj = Object.assign(this.selectPicObj, list);
  }

  /**
   * 批量删除图片
   */
  public handleDelete(): void {
    let delImgList = [];
    Object.values(this.selectPicObj).forEach(item => {
      delImgList = delImgList.concat(item);
    });
    this.delImg(delImgList);
  }

  /**
   * 图片删除
   * param list
   */
  public delImg(list: Array<any>): void {
    this.$modalService.confirm({
      nzTitle: this.language.table.prompt,
      nzContent: `<span>${this.language.table.promptContent}</span>`,
      nzOkText: this.language.table.cancelText,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.language.table.okText,
      nzOnCancel: () => {
        this.$pictureViewService.deleteImageIsDeletedByIds(list).subscribe((result: Result) => {
          if (result.code === 0) {
            // 删除成功之后清空选中的图片
            this.selectPicObj = {};
            this.photoList = [];
            this.queryConditions.pageCondition = {
              'pageSize': 30,
              'pageNum': 1
            };
            // 如果图片被删除 则不显示图片信息
            if (this.picInfo && this.picInfo.devicePicId) {
              const picList = list.filter(item => item.devicePicId === this.picInfo.devicePicId);
              if (picList.length > 0) {
                this.picInfo = {};
              }
            }
            this.searchList();
          } else {
            this.$message.error(result.msg);
          }
        });
      },
    });
  }

  /**
   * 批量下载
   */
  public download(): void {
    const sendData = {
      taskId: '',
      queryCondition: {
        pageCondition: {},
        bizCondition:
          {
            'devicePicIds': []
          }
      }
    };
    let delImgList = [];
    Object.values(this.selectPicObj).forEach(item => {
      delImgList = delImgList.concat(item);
    });
    delImgList = delImgList.map(item => item.devicePicId);
    if (delImgList && delImgList.length > 0) {
      sendData.queryCondition.bizCondition.devicePicIds = delImgList;
      this.$pictureViewService.batchDownLoadImages(sendData).subscribe((result: Result) => {
        if (result.code === 0) {
          this.$message.success(result.msg);
        } else {
          this.$message.error(result.msg);
        }
      });
    } else {
      this.$message.warning(this.language.facility.picInfo.downloadMsg);
    }
  }

  /**
   * 监听滚动条事件
   * param item
   */
  public scrollListener(item): void {
    // 判断是否还有数据 当前的pageSize小于查询的数据pageSize表示没数据了不再查询
    if (!this.loadMore && this.currentPageSize === this.queryConditions.pageCondition.pageSize) {
      const scrollHeight = item['target'].scrollHeight;
      const scrollTop = item['target'].scrollTop;
      const clientHeight = item['target'].clientHeight;
      if (scrollHeight - scrollTop - clientHeight <= 60) {
        this.loadMore = true;
        this.queryConditions.pageCondition.pageNum++;
        this.searchList();
      }
    }
  }

  /**
   * 查看大图
   * param item
   */
  public viewLargerImage(item): void {
    this.$imageViewService.showPictureView(item.bigPicList, item.curPicInfo);
  }
}
