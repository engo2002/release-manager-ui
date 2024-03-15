import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatSelectChange } from "@angular/material/select";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../../../auth/auth.service";
import { AuthenticationApiService, RolesDto, UserRolesApiService } from "@engo/release-manager-api-client-angular";

@Component({
    selector: "app-user-administration-roles",
    templateUrl: "./user-administration-roles.component.html",
    styleUrls: ["./user-administration-roles.component.css"],
})
export class UserAdministrationRolesComponent implements OnInit, OnDestroy {
    public primaryRole: RolesDto.PrimaryRoleEnum = "Viewer";
    public username = "";
    public fullname = "";
    public secondaryRole: RolesDto.PrimaryRoleEnum | null = null;
    private userId = "";
    private subscription: Subscription = new Subscription();

    constructor(private rolesApi: UserRolesApiService, private authApi: AuthenticationApiService, private authService: AuthService, public snackbar: MatSnackBar, private route: ActivatedRoute, protected router: Router) {
    }

    ngOnInit(): void {
        this.authService.checkPermission("canWriteUsers");
        this.route.queryParams.subscribe((params) => {
            if (params["id"]) {
                this.userId = params["id"];
                this.getUserData();
            } else {
                this.router.navigate(["/user/admin"])
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

    onSubmit(): void {
        this.subscription.add(
            this.rolesApi.rolesControllerUpdate(this.userId, {user: this.userId, primaryRole: this.primaryRole, secondaryRole: this.secondaryRole}).subscribe(() => {
                const config = new MatSnackBarConfig();
                config.duration = 3000;
                config.panelClass = ["snackbar"];
                this.router.navigate(["/user/admin"]).then((navigated: boolean) => {
                    if (navigated) {
                        this.snackbar.open("Rollen für Benutzer " + this.username + " geändert", undefined, config);
                    }
                });
            }),
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
