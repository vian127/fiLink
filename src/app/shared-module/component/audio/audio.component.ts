import {Component, OnInit, Output, EventEmitter} from '@angular/core';

/**
 * 播放组件
 */
@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss']
})
export class AudioComponent implements OnInit {
  // 当前播放次数
  start;
  // 总播放次数
  times = 1;
  // audio标签元素
  audioElem;

  constructor() {
  }

  // 停止播放
  @Output() stopAudio = new EventEmitter();

  /**
   * 告警播放音乐
   */
  alarmMusic(data?) {
    // if (data.channelKey === 'alarm') {
    this.audioElem = document.querySelector('#audio');
    this.start = 0;
    if (data.msg.alarmMessage.playCount) {
      this.times = data.msg.alarmMessage.playCount;
    }
    if (data.msg.alarmMessage.prompt) {
      this.audioElem.src = `assets/audio/${data.msg.alarmMessage.prompt}`;
      // this.elem.addEventListener('ended', this.playFunction());
      this.audioElem.play();
      // setTimeout(() => {
      //   this.audioElem.src = ``;
      // }, 0);
    }

    // }

  }

  /**
   * 告警播放音乐 结束时
   */
  audioEnded() {
    this.start++;
    if (this.start < this.times) {
      this.audioElem.play();
    } else {
      this.stopAudio.emit();
    }
  }

  ngOnInit() {
  }

}
