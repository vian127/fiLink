import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexStatisticsComponent } from './index-statistics.component';

describe('IndexStatisticsComponent', () => {
  let component: IndexStatisticsComponent;
  let fixture: ComponentFixture<IndexStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
