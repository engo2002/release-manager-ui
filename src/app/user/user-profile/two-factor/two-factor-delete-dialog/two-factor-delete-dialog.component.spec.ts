import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TwoFactorDeleteDialogComponent } from "./two-factor-delete-dialog.component";

describe("TwoFactorDeleteDialogComponent", () => {
    let component: TwoFactorDeleteDialogComponent;
    let fixture: ComponentFixture<TwoFactorDeleteDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TwoFactorDeleteDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TwoFactorDeleteDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
