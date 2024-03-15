import { Route } from "@angular/router";
import { LoginActivate } from "../../interceptor/login-activate.service";
import { UserAdminComponent } from "./user-admin.component";
import {
    UserAdministrationPasswordComponent,
} from "./user-administration-password/user-administration-password.component";
import {
    UserAdministrationRegisterComponent,
} from "./user-administration-register/user-administration-register.component";
import { UserAdministrationRolesComponent } from "./user-administration-roles/user-administration-roles.component";
import { UserAdministrationComponent } from "./user-administration/user-administration.component";

export const UserAdminRoutes: Route = {
    path: "admin",
    component: UserAdminComponent,
    children: [
        {
            path: "",
            redirectTo: "overview",
            pathMatch: "full",
        },
        {
            path: "overview",
            component: UserAdministrationComponent,
            canActivate: [LoginActivate],
        },
        {
            path: "register",
            component: UserAdministrationRegisterComponent,
            canActivate: [LoginActivate],
        },
        {
            path: "password",
            component: UserAdministrationPasswordComponent,
            canActivate: [LoginActivate],
        },
        {
            path: "roles",
            component: UserAdministrationRolesComponent,
            canActivate: [LoginActivate],
        },
    ],
};
