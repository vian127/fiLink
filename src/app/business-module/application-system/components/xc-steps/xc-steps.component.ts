import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-xc-steps',
  templateUrl: './xc-steps.component.html',
  styleUrls: ['./xc-steps.component.scss']
})
export class XcStepsComponent implements OnInit {
  @Input() isActiveStepsCount;
  @Output() notify = new EventEmitter();
  @Input() setData;
  constructor() {
  }

  ngOnInit() {
  }
  handChangeSteps(data) {
    this.notify.emit(data.number);
  }
}
