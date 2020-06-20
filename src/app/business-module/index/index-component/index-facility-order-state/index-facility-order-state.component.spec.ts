import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {IndexFacilityOrderStateComponent} from './index-facility-order-state.component';

describe('IndexFacilityOrderStateComponent', () => {
  let component: IndexFacilityOrderStateComponent;
  let fixture: ComponentFixture<IndexFacilityOrderStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexFacilityOrderStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexFacilityOrderStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
