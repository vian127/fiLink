import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearBarrierTableComponent } from './clear-barrier-table.component';

describe('ClearBarrierTableComponent', () => {
  let component: ClearBarrierTableComponent;
  let fixture: ComponentFixture<ClearBarrierTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearBarrierTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearBarrierTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
