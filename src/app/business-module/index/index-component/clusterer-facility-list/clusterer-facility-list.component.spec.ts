import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClustererFacilityListComponent } from './clusterer-facility-list.component';

describe('ClustererFacilityListComponent', () => {
  let component: ClustererFacilityListComponent;
  let fixture: ComponentFixture<ClustererFacilityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClustererFacilityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClustererFacilityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
