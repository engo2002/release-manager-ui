import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TwoFactorCreateDialogComponent } from "./two-factor-create-dialog.component";

describe("TwoFactorCreateDialogComponent", () => {
    let component: TwoFactorCreateDialogComponent;
    let fixture: ComponentFixture<TwoFactorCreateDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TwoFactorCreateDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TwoFactorCreateDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
