import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm, NgModel } from "@angular/forms";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../../../auth/auth.service";
import { AuthenticationApiService } from "@engo/release-manager-api-client-angular";

@Component({
    selector: "app-user-administration-password",
    templateUrl: "./user-administration-password.component.html",
    styleUrls: ["./user-administration-password.component.css"],
})
export class UserAdministrationPasswordComponent implements OnInit, OnDestroy {
    public userId = "";
    public username = "";
    public fullname = "";
    public passwordsNotIdentical = false;
    public newPasswort!: NgModel;
    public newPasswortCheck!: NgModel;
    public hidePasswordNew = true;
    public hidePasswordNewCheck = true;
    private subscription: Subscription = new Subscription();

    constructor(private authApi: AuthenticationApiService, private route: ActivatedRoute, private authService: AuthService, public snackbar: MatSnackBar, protected router: Router) {
    }

    ngOnInit(): void {
        this.authService.checkPermission("canWriteUsers");
        this.route.queryParams.subscribe((params) => {
            if (params["id"]) {
                this.userId = params["id"];
                this.getUserData();
            } else {
                this.router.navigate(["/user/admin"]);
            }
        });
    }

    getUserData(): void {
        this.subscription.add(
            this.authApi.authControllerGetGeneralUserDataById(this.userId).subscribe((response) => {
                this.username = response.username;
                this.fullname = response.fullname;
            }),
        );
    }

    onSubmit(form: NgForm): void {
        const newPassword = form.value.newPasswort;
        const newPasswortCheck = form.value.newPasswortCheck;

        this.subscription.add(
            this.authApi.authControllerUpdatePwAdmin({username: this.username, newPassword: newPassword, newPasswordCheck: newPasswortCheck}).subscribe(() => {
                const config = new MatSnackBarConfig();
                config.duration = 3000;
                config.panelClass = ["snackbar"];
                this.router.navigate(["/user/admin"]).then((navigated: boolean) => {
                    if (navigated) {
                        this.snackbar.open("Passwort für Benutzer " + this.username + " geändert", undefined, config);
                    }
                });
            }),
        );
    }

    checkPasswords(newPassword: string, newPasswortCheck: string): void {
        this.passwordsNotIdentical = newPassword !== newPasswortCheck;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
