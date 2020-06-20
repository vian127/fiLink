import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionBoxTableComponent } from './distribution-box-table.component';

describe('DistributionBoxTableComponent', () => {
  let component: DistributionBoxTableComponent;
  let fixture: ComponentFixture<DistributionBoxTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionBoxTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionBoxTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
