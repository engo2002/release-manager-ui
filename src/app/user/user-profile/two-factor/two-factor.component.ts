import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TwoFactorCreateDialogComponent } from "./two-factor-create-dialog/two-factor-create-dialog.component";
import { TwoFactorDeleteDialogComponent } from "./two-factor-delete-dialog/two-factor-delete-dialog.component";
import { AuthService } from "../../../auth/auth.service";
import { TwoFactorAuthenticationApiService } from "@engo/release-manager-api-client-angular";

@Component({
    selector: "app-two-factor",
    templateUrl: "./two-factor.component.html",
    styleUrls: ["./two-factor.component.css"],
})
export class TwoFactorComponent implements OnInit {
    twoFactorActive = false;

    constructor(private dialog: MatDialog, private authService: AuthService, private mfaApi: TwoFactorAuthenticationApiService) {
    }

    ngOnInit(): void {
        this.get2FaActive();
    }

    get2FaActive() {
        this.mfaApi.twoFactorAuthControllerGetActive(this.authService.loggedInStatus.userId!, this.authService.loggedInStatus.username!).subscribe((status) => {
            this.twoFactorActive = status;
        });
    }

    delete2Fa() {
        this.dialog
            .open(TwoFactorDeleteDialogComponent, {
                disableClose: true,
            })
            .afterClosed()
            .subscribe(() => {
                this.get2FaActive();
            });
    }

    add2Fa() {
        this.dialog.open(TwoFactorCreateDialogComponent, {
            disableClose: true,
        });
    }
}
