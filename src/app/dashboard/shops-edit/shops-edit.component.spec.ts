import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopsEditComponent } from './shops-edit.component';

describe('ShopsEditComponent', () => {
  let component: ShopsEditComponent;
  let fixture: ComponentFixture<ShopsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
