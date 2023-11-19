import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectListComponent } from "./projects/project-list/project-list.component";


const routes: Routes = [
	{
		path: "",
		redirectTo: "/projects",
		pathMatch: "full",
	},
	{
		path: "projects",
		loadChildren:  () => import("./projects/projects.module").then((m) => m.ProjectsModule)

	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
