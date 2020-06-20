import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityEquipmentTypeComponent } from './facility-equipment-type.component';

describe('FacilityEquipmentTypeComponent', () => {
  let component: FacilityEquipmentTypeComponent;
  let fixture: ComponentFixture<FacilityEquipmentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityEquipmentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityEquipmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
