import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserAdministrationRegisterComponent } from "./user-administration-register.component";

describe("UserAdministrationRegisterComponent", () => {
    let component: UserAdministrationRegisterComponent;
    let fixture: ComponentFixture<UserAdministrationRegisterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserAdministrationRegisterComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserAdministrationRegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
