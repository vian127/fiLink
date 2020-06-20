import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersCancelAccountComponent } from './orders-cancel-account.component';

describe('OrdersCancelAccountComponent', () => {
  let component: OrdersCancelAccountComponent;
  let fixture: ComponentFixture<OrdersCancelAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersCancelAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersCancelAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
