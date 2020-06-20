import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import Video from 'video.js';
import zh_CN from '../../service/i18N/language/video/zh_CN';
import en from '../../service/i18N/language/video/en';
import * as $ from 'jquery';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';

@Component({
  selector: 'xc-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, OnDestroy {
  /** 是否需要切换上一条下一条按钮*/
  @Input() hasChangeBtn = false;
  /** 视频容器宽高配置项*/
  @Input() options = {width: '300px', height: '300px'};
  /** 视频播放源地址*/
  @Input()
  set sourceArray(arr: Array<string>) {
    if (arr.length) {
      this.idx = 0;
      if (this.video) {
        this.video.src(arr[this.idx]);
      }
      this.sources = arr;
    }
  }
  /** 视频源地址*/
  private sources: Array<string> = [];
  /** 当前播放视频的索引*/
  private idx = 0;
  private video;

  constructor(private $message: FiLinkModalService) {
  }

  ngOnInit() {
    Video.addLanguage(zh_CN.local, zh_CN);
    Video.addLanguage(en.local, en);
    const language = localStorage.getItem('localId') || 'zh_CN';
    this.video = new Video('video', {
      controls: true,
      loop: false,
      width: this.options.width,
      height: this.options.height,
      language: language,
      controlBar: {
        progressControl: false,
        fullscreenToggle: false,
        pictureInPictureToggle: false,
        volumePanel: false,
        remainingTimeDisplay: false
      }
    });
    this.registerButton();
    if (this.sources.length) {
      this.video.src(this.sources[this.idx]);
    }
    console.log(this.video);
  }

  ngOnDestroy() {
    // 组件销毁时销毁video
    this.video.dispose();
  }

  /**
   * 播放上一条
   */
  changePrev() {
    if (this.idx - 1 < 0) {
      this.$message.warning('已经是第一条视频');
    } else {
      this.idx = this.idx - 1;
      this.video.src(this.sources[this.idx]);
      this.video.play();
    }
  }

  /**
   * 播放下一条
   */
  changeNext() {
    if (this.idx + 1 >= this.sources.length) {
      this.$message.warning('已经是最后一条视频');
    } else {
      this.idx = this.idx + 1;
      this.video.src(this.sources[this.idx]);
      this.video.play();
    }
  }

  /**
   * 注册上一条下一条按钮
   */
  registerButton() {
    // 播放上一条按钮
    const prevButton = Video.getComponent('button');
    Video.registerComponent('prevButton', Video.extend(prevButton, {
      constructor: function() {
        prevButton.apply(this, arguments);
      },
      handleClick: () => {
        this.changePrev();
      },
      buildCSSClass: () => {
        return this.hasChangeBtn ?
          'vjs-control vjs-button iconfont fiLink-pic-view-last register-btn register-prev-btn'
          : 'vjs-control vjs-button iconfont fiLink-pic-view-last register-btn register-prev-btn register-btn-hidden';
      },
      createControlTextEl: function (button) {
        return $(button).attr('title', '上一条');
      }
    }));

    // 播放下一条按钮
    const nextButton = Video.getComponent('button');
    Video.registerComponent('nextButton', Video.extend(nextButton, {
      constructor: function() {
        nextButton.apply(this, arguments);
      },
      handleClick: () => {
        this.changeNext();
      },
      buildCSSClass: () => {
        return this.hasChangeBtn ?
          'vjs-control vjs-button iconfont fiLink-pic-view-last register-btn'
          : 'vjs-control vjs-button iconfont fiLink-pic-view-last register-btn register-btn-hidden';
      },
      createControlTextEl: function (button) {
        return $(button).attr('title', '下一条');
      }
    }));

    this.video.getChild('controlBar').addChild('prevButton', {});
    this.video.getChild('controlBar').addChild('nextButton', {});
  }
}
