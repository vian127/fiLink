import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeviceNodeComponent} from './device-node.component';

describe('FacilityListComponent', () => {
  let component: DeviceNodeComponent;
  let fixture: ComponentFixture<DeviceNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceNodeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
