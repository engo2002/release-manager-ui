import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { IFormFields } from "@engo/engo-ui-kit-lib";
import { AuthService } from "../../../../auth/auth.service";
import { TwoFactorAuthenticationApiService } from "@engo/release-manager-api-client-angular";

@Component({
    selector: "app-two-factor-create-dialog",
    templateUrl: "./two-factor-create-dialog.component.html",
    styleUrls: ["./two-factor-create-dialog.component.css"],
})
export class TwoFactorCreateDialogComponent implements OnInit {
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
                submitLabel: "QR-Code generieren",
                submitIconFaClass: "fa fa-qrcode",
                submitDisabled: false,
            },
        },
    ];
    generated = false;
    showError = false;
    otpUrl = "";
    otpSecret = "";
    hasCopied = false;

    constructor(private dialog: MatDialog, private twoFactorApi: TwoFactorAuthenticationApiService, private authService: AuthService) {
    }

    ngOnInit(): void {
    }

    onSubmit($event: any) {
        this.showError = false;
        this.twoFactorApi.twoFactorAuthControllerGenerateQrCode({userId: this.authService.loggedInStatus.userId!, email: this.authService.loggedInStatus.email!, password: $event.form.value.password}).subscribe(
            (otp) => {
                this.otpUrl = otp.otpAuthUrl;
                this.otpSecret = otp.secret.trim();
                this.generated = true;
            },
            () => (this.showError = true),
        );
    }

    toLogout() {
        this.authService.logout();
    }

    discard() {
        this.dialog.closeAll();
    }

    copyToClipboard() {
        navigator.clipboard.writeText(this.otpSecret).then(() => {
            this.hasCopied = true;
        });
    }
}
