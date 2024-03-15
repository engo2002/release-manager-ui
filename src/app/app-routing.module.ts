import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectListComponent } from "./projects/project-list/project-list.component";
import { LoginGuard } from "./guards/login-activate.guard";
import { UserDataGuard } from "./guards/user-data.guard";


const routes: Routes = [
	{
		path: "",
		redirectTo: "/projects",
		pathMatch: "full",
	},
	{
		path: "projects",
		loadChildren:  () => import("./projects/projects.module").then((m) => m.ProjectsModule),
        canActivate: [LoginGuard, UserDataGuard]
	},
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule)
  },
  {
    path: "user",
    loadChildren: () => import("./user/user.module").then((m) => m.UserModule)
  }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
