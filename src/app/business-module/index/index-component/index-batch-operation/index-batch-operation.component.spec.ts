import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexBatchOperationComponent } from './index-batch-operation.component';

describe('IndexBatchOperationComponent', () => {
  let component: IndexBatchOperationComponent;
  let fixture: ComponentFixture<IndexBatchOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexBatchOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexBatchOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
