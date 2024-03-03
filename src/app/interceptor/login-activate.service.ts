import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth/auth.service";

@Injectable({
    providedIn: "root",
})
export class LoginActivate implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authService.isLoggedIn) {
            const configInfoSnackbar = new MatSnackBarConfig();
            configInfoSnackbar.duration = 6000;
            configInfoSnackbar.panelClass = ["snackbar-info"];
            this.router.navigate(["login"]).then((navigated) => {
                if (navigated) {
                    this.snackbar.open("Um diese Seite zu betreten müssen Sie sich anmelden.", undefined, configInfoSnackbar);
                }
            });
        }
        return true;
    }
}
