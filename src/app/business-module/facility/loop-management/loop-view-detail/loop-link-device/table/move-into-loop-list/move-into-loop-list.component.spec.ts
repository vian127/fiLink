import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveIntoLoopListComponent } from './move-into-loop-list.component';

describe('MoveIntoLoopListComponent', () => {
  let component: MoveIntoLoopListComponent;
  let fixture: ComponentFixture<MoveIntoLoopListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveIntoLoopListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveIntoLoopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
