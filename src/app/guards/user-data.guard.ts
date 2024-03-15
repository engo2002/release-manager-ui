import { inject } from "@angular/core";
import { of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

export const UserDataGuard = () => {
    const authService = inject(AuthService);
    return authService.getUserDataIfNotExist$().pipe(switchMap(() => of(true)));
};
