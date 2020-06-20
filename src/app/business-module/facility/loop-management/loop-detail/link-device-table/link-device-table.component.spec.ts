import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkDeviceTableComponent } from './link-device-table.component';

describe('LinkDeviceTableComponent', () => {
  let component: LinkDeviceTableComponent;
  let fixture: ComponentFixture<LinkDeviceTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkDeviceTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkDeviceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
