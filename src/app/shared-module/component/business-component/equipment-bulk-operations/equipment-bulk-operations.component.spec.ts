import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentBulkOperationsComponent } from './equipment-bulk-operations.component';

describe('EquipmentBulkOperationsComponent', () => {
  let component: EquipmentBulkOperationsComponent;
  let fixture: ComponentFixture<EquipmentBulkOperationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentBulkOperationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentBulkOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
