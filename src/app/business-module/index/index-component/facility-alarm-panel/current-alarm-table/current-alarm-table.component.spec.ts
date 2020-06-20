import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentAlarmTableComponent } from './current-alarm-table.component';

describe('CurrentAlarmTableComponent', () => {
  let component: CurrentAlarmTableComponent;
  let fixture: ComponentFixture<CurrentAlarmTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentAlarmTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentAlarmTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
