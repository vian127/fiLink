import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaManageComponent } from './area-manage.component';

describe('AreaManageComponent', () => {
  let component: AreaManageComponent;
  let fixture: ComponentFixture<AreaManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
