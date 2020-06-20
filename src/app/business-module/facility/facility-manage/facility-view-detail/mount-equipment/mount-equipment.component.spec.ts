import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MountEquipmentComponent } from './mount-equipment.component';

describe('MountEquipmentComponent', () => {
  let component: MountEquipmentComponent;
  let fixture: ComponentFixture<MountEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MountEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MountEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
