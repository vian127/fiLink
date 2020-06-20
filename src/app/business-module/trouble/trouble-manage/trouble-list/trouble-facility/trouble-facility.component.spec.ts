import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleFacilityComponent } from './trouble-facility.component';

describe('TroubleFacilityComponent', () => {
  let component: TroubleFacilityComponent;
  let fixture: ComponentFixture<TroubleFacilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroubleFacilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroubleFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
