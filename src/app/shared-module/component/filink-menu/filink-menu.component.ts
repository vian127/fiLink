import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-filink-menu',
  templateUrl: './filink-menu.component.html',
  styleUrls: ['./filink-menu.component.scss']
})
export class FilinkMenuComponent implements OnInit {

  @Input() menuList: Array<any> ;
  constructor() { }

  ngOnInit() {
  }

}
