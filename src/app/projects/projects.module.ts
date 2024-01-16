import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from './project-list/project-list.component';
import { MatTableModule } from "@angular/material/table";
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectsComponent } from './projects.component';
import { ProjectsRoutingModule } from "./projects-routing.module";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { UikTableLoadingModule } from "@engo/engo-ui-kit-lib";



@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectCreateComponent,
    ProjectsComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    ProjectsRoutingModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    UikTableLoadingModule
  ]
})
export class ProjectsModule { }
