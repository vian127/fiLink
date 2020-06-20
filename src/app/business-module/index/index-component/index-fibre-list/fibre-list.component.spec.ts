import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FibreListComponent} from './fibre-list.component';

describe('FacilityListComponent', () => {
  let component: FibreListComponent;
  let fixture: ComponentFixture<FibreListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FibreListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FibreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
