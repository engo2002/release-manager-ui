import { Component } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import { NgForm } from "@angular/forms";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { AuthenticationApiService } from "@engo/release-manager-api-client-angular";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  public passwordsNotIdentical: boolean = false;
  public passwordNotFitPolicy = false;

  constructor(private authApi: AuthenticationApiService, private authService: AuthService, private dialog: MatDialog, private router: Router, private snackbar: MatSnackBar) {
  }
  onSubmit(form: NgForm): void {
    const oldPasswort = form.value.oldPasswort;
    const newPasswort = form.value.newPasswort;
    const newPasswortCheck = form.value.newPasswortCheck;

    if (!this.passwordsNotIdentical) {
      this.authApi.authControllerUpdatePw({username: this.authService.loggedInStatus.username, oldPassword: oldPasswort, newPassword: newPasswort, newPasswordCheck: newPasswortCheck}).subscribe(() => {
        this.authService.logout();
        const config = new MatSnackBarConfig();
        config.duration = 3000;
        config.panelClass = ["snackbar"];
        this.dialog.closeAll();
        this.router.navigate(["/login"]).then((navigated: boolean) => {
          if (navigated) {
            this.snackbar.open("Passwort erfolgreich geändert. Bitte melden Sie sich neu an.", undefined, config);
          }
        });
      });
    }
  }

  checkPasswords(newPasswort: string, newPasswortCheck: string): void {
    this.passwordsNotIdentical = newPasswort !== newPasswortCheck;
  }
}
