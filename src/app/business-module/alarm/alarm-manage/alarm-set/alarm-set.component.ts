import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

/**
 * 告警设置
 */
@Component({
  selector: 'app-alarm-set',
  templateUrl: './alarm-set.component.html',
  styleUrls: ['./alarm-set.component.scss']
})
export class AlarmSetComponent implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit() {}
}
