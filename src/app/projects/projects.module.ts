import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from './project-list/project-list.component';
import { MatTableModule } from "@angular/material/table";
import { ProjectCreateComponent } from './project-create/project-create.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ProjectsComponent } from './projects.component';
import { ProjectsRoutingModule } from "./projects-routing.module";



@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectCreateComponent,
    ProjectsComponent
  ],
	imports: [
		CommonModule,
		MatTableModule,
		ProjectsRoutingModule
	]
})
export class ProjectsModule { }
