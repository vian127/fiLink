import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryAlarmTableComponent } from './history-alarm-table.component';

describe('HistoryAlarmTableComponent', () => {
  let component: HistoryAlarmTableComponent;
  let fixture: ComponentFixture<HistoryAlarmTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryAlarmTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryAlarmTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
