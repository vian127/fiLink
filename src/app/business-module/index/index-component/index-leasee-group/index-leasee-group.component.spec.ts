import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexLeaseeGroupComponent } from './index-leasee-group.component';

describe('IndexLeaseeGroupComponent', () => {
  let component: IndexLeaseeGroupComponent;
  let fixture: ComponentFixture<IndexLeaseeGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexLeaseeGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexLeaseeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
