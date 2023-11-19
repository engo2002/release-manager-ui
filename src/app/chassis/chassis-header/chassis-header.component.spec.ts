import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChassisHeaderComponent } from './chassis-header.component';

describe('ChassisHeaderComponent', () => {
  let component: ChassisHeaderComponent;
  let fixture: ComponentFixture<ChassisHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChassisHeaderComponent]
    });
    fixture = TestBed.createComponent(ChassisHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
