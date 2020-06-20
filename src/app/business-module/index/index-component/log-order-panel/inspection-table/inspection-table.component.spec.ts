import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionTableComponent } from './inspection-table.component';

describe('InspectionTableComponent', () => {
  let component: InspectionTableComponent;
  let fixture: ComponentFixture<InspectionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
