import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserAdministrationRolesComponent } from "./user-administration-roles.component";

describe("UserAdministrationRolesComponent", () => {
    let component: UserAdministrationRolesComponent;
    let fixture: ComponentFixture<UserAdministrationRolesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserAdministrationRolesComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserAdministrationRolesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
