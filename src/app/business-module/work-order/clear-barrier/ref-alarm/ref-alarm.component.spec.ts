import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefAlarmComponent } from './ref-alarm.component';

describe('RefAlarmComponent', () => {
  let component: RefAlarmComponent;
  let fixture: ComponentFixture<RefAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
