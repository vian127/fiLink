import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmContinueTimeComponent } from './alarm-continue-time.component';

describe('AlarmContinueTimeComponent', () => {
  let component: AlarmContinueTimeComponent;
  let fixture: ComponentFixture<AlarmContinueTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmContinueTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmContinueTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
