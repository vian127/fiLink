import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityBusinessInformationComponent } from './facility-business-information.component';

describe('FacilityBusinessInformationComponent', () => {
  let component: FacilityBusinessInformationComponent;
  let fixture: ComponentFixture<FacilityBusinessInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityBusinessInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityBusinessInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
