import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilinkMenuComponent } from './filink-menu.component';

describe('FilinkMenuComponent', () => {
  let component: FilinkMenuComponent;
  let fixture: ComponentFixture<FilinkMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilinkMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilinkMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
