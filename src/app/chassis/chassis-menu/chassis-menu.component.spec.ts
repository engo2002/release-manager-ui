import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChassisMenuComponent } from './chassis-menu.component';

describe('ChassisMenuComponent', () => {
  let component: ChassisMenuComponent;
  let fixture: ComponentFixture<ChassisMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChassisMenuComponent]
    });
    fixture = TestBed.createComponent(ChassisMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
