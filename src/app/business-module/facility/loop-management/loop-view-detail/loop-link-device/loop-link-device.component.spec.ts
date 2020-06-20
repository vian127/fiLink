import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoopLinkDeviceComponent } from './loop-link-device.component';

describe('LoopLinkDeviceComponent', () => {
  let component: LoopLinkDeviceComponent;
  let fixture: ComponentFixture<LoopLinkDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoopLinkDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoopLinkDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
