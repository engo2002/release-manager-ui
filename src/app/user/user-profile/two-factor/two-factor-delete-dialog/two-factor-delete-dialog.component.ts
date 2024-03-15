import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { IFormFields } from "@engo/engo-ui-kit-lib";
import { AuthService } from "../../../../auth/auth.service";
import { configSuccessSnackbar } from "../../../../interceptor/http-response.interceptor";
import { AuthenticationApiService, TwoFactorAuthenticationApiService } from "@engo/release-manager-api-client-angular";

@Component({
    selector: "app-two-factor-delete-dialog",
    templateUrl: "./two-factor-delete-dialog.component.html",
    styleUrls: ["./two-factor-delete-dialog.component.css"],
})
export class TwoFactorDeleteDialogComponent {
    formStructure: IFormFields[] = [
        {
            type: "input",
            inputContent: {
                inputType: "password",
                inputName: "password",
                inputLabel: "Passwort eingeben",
                inputNgModelRequired: true,
                inputAlerting: {
                    alertErrorTextRequired: "Bitte geben Sie Ihr aktuelles Passwort ein.",
                },
            },
        },
        {
            type: "submit",
            submitContent: {
                submitLabel: "Zweiten Faktor entfernen",
                submitIconFaClass: "fa fa-mobile-screen",
                submitDisabled: false,
            },
        },
    ];
    showError = false;

    constructor(public dialog: MatDialog, private twoFactor: TwoFactorAuthenticationApiService, private authService: AuthService, private snackbar: MatSnackBar) {
    }

    onSubmit($event: any) {
        this.showError = false;
        this.twoFactor.twoFactorAuthControllerDelete2Fa({userId: this.authService.loggedInStatus.userId!, password: $event.form.value.password}).subscribe(
            () => {
                this.dialog.closeAll();
                this.snackbar.open("Die Zwei-Faktor-Authentifizierung wurde erfolgreich entfernt.", undefined, configSuccessSnackbar);
            },
            (e) => {
                if (e) {
                    this.showError = true;
                }
            },
        );
    }

    discard() {
        this.dialog.closeAll();
    }
}
