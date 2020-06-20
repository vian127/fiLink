import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexFacilityGroupComponent } from './index-facility-group.component';

describe('IndexFacilityGroupComponent', () => {
  let component: IndexFacilityGroupComponent;
  let fixture: ComponentFixture<IndexFacilityGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexFacilityGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexFacilityGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
