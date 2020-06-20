import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeListSelectorComponent } from './tree-selector.component';

describe('TreeSelectorComponent', () => {
  let component: TreeListSelectorComponent;
  let fixture: ComponentFixture<TreeListSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeListSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
