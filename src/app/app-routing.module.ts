import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectListComponent } from "./projects/project-list/project-list.component";
import { LoginGuard } from "./guards/login-activate.guard";


const routes: Routes = [
	{
		path: "",
		redirectTo: "/projects",
		pathMatch: "full",
	},
	{
		path: "projects",
		loadChildren:  () => import("./projects/projects.module").then((m) => m.ProjectsModule),
    canActivate: [LoginGuard]
	},
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule)
  }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
