import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleStatisticalComponent } from './trouble-statistical.component';

describe('TroubleStatisticalComponent', () => {
  let component: TroubleStatisticalComponent;
  let fixture: ComponentFixture<TroubleStatisticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroubleStatisticalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroubleStatisticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
