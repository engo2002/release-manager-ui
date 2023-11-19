import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ProjectsComponent } from "./projects.component";
import { ProjectListComponent } from "./project-list/project-list.component";

const routes: Routes = [
	{
		path: "",
		component: ProjectsComponent,
		children: [
			{
				path: "",
				pathMatch: "full",
				redirectTo: "overview",
			},
			{
				path: "overview",
				component: ProjectListComponent,
			}
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ProjectsRoutingModule {}
