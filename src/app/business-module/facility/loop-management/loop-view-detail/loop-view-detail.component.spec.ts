import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoopViewDetailComponent } from './loop-view-detail.component';

describe('LoopViewDetailComponent', () => {
  let component: LoopViewDetailComponent;
  let fixture: ComponentFixture<LoopViewDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoopViewDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoopViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
