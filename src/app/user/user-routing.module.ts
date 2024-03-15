import { UserProfileComponent } from "./user-profile/user-profile.component";
import { UserAdminComponent } from "./user-admin/user-admin.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserAdminRoutes } from "./user-admin/user-admin.routes";
import { UserComponent } from "./user.component";

const routes: Routes = [
	{
		path: "",
		component: UserComponent,
    children: [
      {
        path: "",
        redirectTo: "profile",
        pathMatch: "full",
      },
      {
        path: "profile",
        component: UserProfileComponent
      },
      UserAdminRoutes
    ]
	},

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class UserRoutingModule {}
