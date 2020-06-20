import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerSelectorComponent } from './timer-selector.component';

describe('TimerSelectorComponent', () => {
  let component: TimerSelectorComponent;
  let fixture: ComponentFixture<TimerSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
