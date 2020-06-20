import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmSetComponent } from './alarm-set.component';

describe('AlarmSetComponent', () => {
  let component: AlarmSetComponent;
  let fixture: ComponentFixture<AlarmSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
