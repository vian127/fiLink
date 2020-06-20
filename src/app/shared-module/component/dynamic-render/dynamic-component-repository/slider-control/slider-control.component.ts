import {Component, Input, OnInit} from '@angular/core';

export class SliderConfig {
  name: string;
  value: any;
  code: any;
  url: string;

  constructor(name: string, value: any, code: any, url: string) {
    this.name = name;
    this.value = value;
    this.code = code;
    this.url = url;
  }
}
@Component({
  selector: 'app-slider-control',
  templateUrl: './slider-control.component.html',
  styleUrls: ['./slider-control.component.scss']
})
export class SliderControlComponent implements OnInit {
  @Input()
  sliderConfig = new SliderConfig('亮度',30,'ld','sssdsds');

  constructor() {
  }

  ngOnInit() {
  }

  change(code, url) {
    console.log(code);
    console.log(url);
  }
}
