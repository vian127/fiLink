import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityStatusComponent } from './facility-status.component';

describe('FacilityStatusComponent', () => {
  let component: FacilityStatusComponent;
  let fixture: ComponentFixture<FacilityStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
