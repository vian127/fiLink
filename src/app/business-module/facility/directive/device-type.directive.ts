import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {DeviceTypeCode} from '../share/const/facility.config';

@Directive({
  selector: '[appDeviceType]',
})
export class DeviceTypeDirective implements OnInit {
  @Input() appDeviceType = ''; // 设施类型
  private commonClass = 'device-type-icon iconfont facility-icon'; // 公共class
  private diffClassMap = new Map<string, string>();
  private i: Element;  // i标签

  constructor(private render: Renderer2, private el: ElementRef) {
  }

  public ngOnInit(): void {
    this.diffClassMap
      .set(DeviceTypeCode.distributionPanel, 'fiLink-distributionPanel distributionPanel-color')
      .set(DeviceTypeCode.opticalBox, 'fiLink-opticalBox opticalBox-color')
      .set(DeviceTypeCode.wisdom, 'fiLink-wisdom wisdom-color')
      .set(DeviceTypeCode.distributionFrame, 'fiLink-patchPanel patchPanel-color')
      .set(DeviceTypeCode.junctionBox, 'fiLink-jointClosure jointClosure-color')
      .set(DeviceTypeCode.outdoorCabinet, 'fiLink-outDoorCabinet outDoorCabinet-color')
      .set(DeviceTypeCode.well, 'fiLink-manWell manWell-color');
    this.addIcon();
  }

  /**
   * 添加icon
   */
  private addIcon(): void {
    this.i = this.render.createElement('i'); // 创建i标签
    this.diffClassMap.forEach((value, key) => {
      if (key === this.appDeviceType) {
        this.i.className = `${this.commonClass} ${value}`;
        this.render.appendChild(this.el.nativeElement, this.i); // 插入新建icon
      }
    });
  }

}
