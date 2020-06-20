import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-finish-details',
  templateUrl: './finish-details.component.html',
  styleUrls: ['./finish-details.component.scss']
})
export class FinishDetailsComponent implements OnInit {
  dimming = 0;
  volume = 0;

  constructor() {
  }

  ngOnInit() {
  }

}
