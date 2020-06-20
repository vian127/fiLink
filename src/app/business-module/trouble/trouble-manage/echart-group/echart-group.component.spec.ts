import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartGroupComponent } from './echart-group.component';

describe('EchartGroupComponent', () => {
  let component: EchartGroupComponent;
  let fixture: ComponentFixture<EchartGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchartGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchartGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
