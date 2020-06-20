import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetAreaDeviceComponent } from './set-area-device.component';

describe('SetAreaDeviceComponent', () => {
  let component: SetAreaDeviceComponent;
  let fixture: ComponentFixture<SetAreaDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetAreaDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetAreaDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
