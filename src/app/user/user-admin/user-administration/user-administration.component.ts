import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import {
  ICheckboxTableClicked, IColumns, ITableMoreAction, UikConfirmationDialogComponent
} from "@engo/engo-ui-kit-lib";
import { AuthService } from "../../../auth/auth.service";
import {
  AuthenticationApiService, GeneralUserDataDto, PermissionsApiService, TwoFactorAuthenticationApiService,
  UserRolesApiService
} from "@engo/release-manager-api-client-angular";
import { configSuccessSnackbar } from "../../../interceptor/http-response.interceptor";

interface UserWithUiData extends GeneralUserDataDto {
    uiData: {
        lastLoginAsDateString: string;
    };
}

@Component({
    selector: "app-user-administration",
    templateUrl: "./user-administration.component.html",
    styleUrls: ["./user-administration.component.css"],
})
export class UserAdministrationComponent implements OnInit {
    @ViewChild(MatTable)
    table!: MatTable<UserWithUiData[]>;
    @ViewChild(MatSort)
    sort!: MatSort;

    public usersWithUiData: UserWithUiData[] = [];
    public errorMessage = "";
    public userId = "";
    public userSelected = -1;
    public columns: IColumns[] = [
        {
            name: "fullname",
            backendName: "fullname",
            displayName: "Vollständiger Name",
        },
        {
            name: "username",
            backendName: "username",
            displayName: "Benutzername",
        },
        {
            name: "email",
            backendName: "email",
            displayName: "E-Mail Adresse",
        },
        {
            name: "primaryRole",
            backendName: "primaryRole",
            displayName: "Primäre Rolle",
        },
        {
            name: "secondaryRole",
            backendName: "secondaryRole",
            displayName: "Sekundäre Rolle",
        },
        {
            name: "uiData.lastLoginAsDateString",
            backendPath: "uiData",
            backendName: "lastLoginAsDateString",
            displayName: "Letzter Login",
        },
    ];
    public dataSource: MatTableDataSource<UserWithUiData> = new MatTableDataSource<UserWithUiData>();
    public loading = true;
    moreActions: ITableMoreAction[] = [];
    hasRightWriteUsers = false;

    constructor(private rolesApi: UserRolesApiService, private twoFactorApi: TwoFactorAuthenticationApiService, private permissionsApiService: PermissionsApiService, private authApi: AuthenticationApiService, private authService: AuthService, protected router: Router, private dialog: MatDialog, private snackbar: MatSnackBar) {
    }

    ngOnInit(): void {
        if (this.authService.isLoggedIn) {
            this.authService.checkPermission("canReadUsers");
            this.permissionsApiService.permissionsControllerGetUserPermissions(this.authService.loggedInStatus.userId!).subscribe((perm) => {
                this.hasRightWriteUsers = !!perm["canWriteUsers"];
            });
        }
        this.authApi.authControllerGetAllUser().subscribe((allusers) => {
            if (allusers.length === 0) {
                this.errorMessage = "Es wurden keine Einträge gefunden.";
            } else {
                this.rolesApi.rolesControllerGetAll().subscribe((allUserRoles) => {
                    allusers.forEach((user, index) => {
                        if (allUserRoles.findIndex((entry) => entry.user === allusers[index].id) !== -1) {
                            const indexRoles = allUserRoles.findIndex((entry) => entry.user === allusers[index].id);
                            allusers[index].primaryRole = allUserRoles[indexRoles].primaryRole;
                            allusers[index].secondaryRole = allUserRoles[indexRoles].secondaryRole;
                        }
                        const lastLoginDateString = allusers[index].lastLogin !== "0" ? new Date(+user.lastLogin).toLocaleString("de") : "Kein Login";
                        this.usersWithUiData.push({
                            ...allusers[index],
                            uiData: {
                                lastLoginAsDateString: lastLoginDateString,
                            },
                        });
                    });
                    this.dataSource = new MatTableDataSource(this.usersWithUiData);
                    this.setMoreActions();
                    this.loading = false;
                });
            }
        });
    }

    getSelectedUserData(event: ICheckboxTableClicked): void {
        this.userSelected = this.dataSource.data.findIndex((user) => user.id === event.elementId);
        this.userId = event.elementId.toString();
        this.setMoreActions();
    }

    deleteUser(): void {
        const dialogRef = this.dialog.open(UikConfirmationDialogComponent, {
            data: {
                message: "Möchten Sie den Benutzer " + this.usersWithUiData[this.userSelected].fullname + " wirklich löschen?",
                buttonText: {
                    ok: "Benutzer löschen",
                    cancel: "Abbrechen",
                },
            },
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.authApi.authControllerDeleteUser(this.userId).subscribe(() => {
                    this.router.navigate(["/user/admin"])
                });
            }
        });
    }

    navigateChangePassword(): void {
        this.authService.checkPermission("canWriteUsers");
        this.router.navigateByUrl("/user/admin/password?id=" + this.userId);
    }

    navigateChangeRoles(): void {
        this.authService.checkPermission("canWriteUsers");
        this.router.navigateByUrl("/user/admin/roles?id=" + this.userId);
    }

    onMoreActions($event: ITableMoreAction) {
        switch ($event.name) {
            case "deleteUser": {
                this.deleteUser();
                break;
            }

            case "changePassword": {
                this.navigateChangePassword();
                break;
            }

            case "changeRoles": {
                this.navigateChangeRoles();
                break;
            }

            case "reset2Fa": {
                this.reset2Fa();
                break;
            }
        }
    }

    setMoreActions() {
        this.moreActions = [
            {
                name: "deleteUser",
                disabled: this.userSelected === -1 || !this.hasRightWriteUsers,
                description: "Benutzer löschen",
                iconClass: "fa fa-user-times",
            },
            {
                name: "changePassword",
                disabled: this.userSelected === -1 || !this.hasRightWriteUsers,
                description: "Benutzer-Passwort ändern",
                iconClass: "fa fa-user-lock",
            },
            {
                name: "changeRoles",
                disabled: this.userSelected === -1 || !this.hasRightWriteUsers,
                description: "Benutzerrollen ändern",
                iconClass: "fa fa-user-shield",
            },
            {
                name: "reset2Fa",
                disabled: this.userSelected === -1 || !this.hasRightWriteUsers,
                description: "Zwei-Faktor zurücksetzen",
                iconClass: "fa fa-mobile-screen",
            },
        ];
    }

    private reset2Fa() {
        const dialogRef = this.dialog.open(UikConfirmationDialogComponent, {
            data: {
                message: "Möchten Sie die Zwei-Faktor-Authentifizierung für den Benutzer entfernen?",
                buttonText: {
                    ok: "Entfernen",
                    cancel: "Abbrechen",
                },
            },
        });
        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.twoFactorApi.twoFactorAuthControllerReset2Fa(this.userId).subscribe(() => {
                    dialogRef.close();
                    this.snackbar.open("Die Zwei-Faktor-Authentifizierung wurde erfolgreich zurückgesetzt.", undefined, configSuccessSnackbar);
                });
            }
        });
    }
}
