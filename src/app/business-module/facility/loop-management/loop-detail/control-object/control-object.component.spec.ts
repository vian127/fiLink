import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlObjectComponent } from './control-object.component';

describe('ControlObjectComponent', () => {
  let component: ControlObjectComponent;
  let fixture: ComponentFixture<ControlObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
