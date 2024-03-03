import { inject } from "@angular/core";
import { of } from "rxjs";
import { AuthService } from "../services/auth/auth.service";
import { switchMap } from "rxjs/operators";

export const UserDataGuard = () => {
    const authService = inject(AuthService);
    return authService.getUserDataIfNotExist$().pipe(switchMap(() => of(true)));
};
