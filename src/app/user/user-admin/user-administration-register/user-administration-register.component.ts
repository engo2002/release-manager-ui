import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthenticationApiService, CreateUserDto, RolesDto } from "@engo/release-manager-api-client-angular";
import { AuthService } from "../../../auth/auth.service";

@Component({
    selector: "app-user-administration-register",
    templateUrl: "./user-administration-register.component.html",
    styleUrls: ["./user-administration-register.component.css"],
})
export class UserAdministrationRegisterComponent implements OnInit, OnDestroy {
    public username = "";
    public fullname = "";
    public password = "";
    public email = "";
    public primaryRole: RolesDto.PrimaryRoleEnum = "Viewer";
    public secondaryRole: RolesDto.SecondaryRoleEnum | null = null;
    private subscription: Subscription = new Subscription();

    constructor(private authApi: AuthenticationApiService, private authService: AuthService, public snackbar: MatSnackBar, protected router: Router) {
    }

    ngOnInit(): void {
        this.authService.checkPermission("canWriteUsers");
    }

    public onSubmit(form: NgForm): void {
        this.username = form.value.username;
        this.fullname = form.value.fullname;
        this.password = form.value.password;
        this.email = form.value.email;
        if (this.primaryRole !== null) {
            this.registerUser();
        }
    }

    public registerUser(): void {
        const config = new MatSnackBarConfig();
        config.duration = 3000;
        config.panelClass = ["snackbar"];
        const newUser: CreateUserDto = {
            username: this.username.trim(),
            fullname: this.fullname,
            password: this.password,
            email: this.email.trim(),
            primaryRole: this.primaryRole,
            secondaryRole: this.secondaryRole,
        };
        this.subscription.add(
            this.authApi.authControllerRegister(newUser).subscribe(() =>
                this.router.navigate(["/user/admin"]).then((navigated: boolean) => {
                    if (navigated) {
                        this.snackbar.open("Benutzer erstellt", undefined, config);
                    }
                }),
            ),
        );
    }

    getSelectedValuePrimary(select: MatSelectChange): void {
        this.primaryRole = select.value;
    }

    getSelectedValueSecondary(select: MatSelectChange): void {
        this.secondaryRole = select.value;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
