import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleEquipmentComponent } from './trouble-equipment.component';

describe('TroubleEquipmentComponent', () => {
  let component: TroubleEquipmentComponent;
  let fixture: ComponentFixture<TroubleEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroubleEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroubleEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
