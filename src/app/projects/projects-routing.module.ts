import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ProjectsComponent } from "./projects.component";
import { ProjectListComponent } from "./project-list/project-list.component";
import { ProjectReleaseListComponent } from "./project-release-list/project-release-list.component";
import { ProjectReleaseCreateEditComponent } from "./project-release-create-edit/project-release-create-edit.component";

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
			},
      {
        path: ":projectId/releases",
        component: ProjectReleaseListComponent,
      },
      {
        path: ":projectId/releases/create",
        component: ProjectReleaseCreateEditComponent
      },
      {
        path: ":projectId/releases/edit/:releaseId",
        component: ProjectReleaseCreateEditComponent
      }
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ProjectsRoutingModule {}
