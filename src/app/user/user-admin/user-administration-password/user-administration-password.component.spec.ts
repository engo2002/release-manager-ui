import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserAdministrationPasswordComponent } from "./user-administration-password.component";

describe("UserAdministrationPasswordComponent", () => {
    let component: UserAdministrationPasswordComponent;
    let fixture: ComponentFixture<UserAdministrationPasswordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserAdministrationPasswordComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserAdministrationPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
