import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChassisFooterComponent } from './chassis-footer.component';

describe('ChassisFooterComponent', () => {
  let component: ChassisFooterComponent;
  let fixture: ComponentFixture<ChassisFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChassisFooterComponent]
    });
    fixture = TestBed.createComponent(ChassisFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
