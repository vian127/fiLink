import {Component, OnInit, Input} from '@angular/core';
import {Method} from '../../../model/const/method';

@Component({
  selector: 'app-policy-add-details',
  templateUrl: './policy-add-details.component.html',
  styleUrls: ['./policy-add-details.component.scss']
})
export class PolicyAddDetailsComponent implements OnInit {
  @Input() strategyDetails: any = [];
  methodFun = Method;
  constructor() {
  }

  ngOnInit() {

  }
}
