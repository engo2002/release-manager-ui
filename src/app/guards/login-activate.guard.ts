import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn: "root",
})
export class LoginGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authService.isLoggedIn) {
            return true;
        } else {
            this.router.navigate(["/auth/login"]);
            return false;
        }
    }
}
