// In der TypeScript-Datei der Komponente (project-list.component.ts)
import { Component, OnInit } from '@angular/core';
import { Project, ProjectsApiService } from "@engo/release-manager-api-client-angular";
import { MatDialog } from "@angular/material/dialog";
import { ProjectCreateComponent } from "../project-create/project-create.component";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  constructor(private dialog: MatDialog, private projectApi: ProjectsApiService) {
  }
  projects: MatTableDataSource<Project> = new MatTableDataSource([]);
  loading = false;

  displayedColumns: string[] = ['name', 'description', 'link'];
  ngOnInit(): void {
    this.loadProjects();
  }

  openDialog() {
    if (this.dialog.openDialogs.length === 0) {
      this.dialog.open(ProjectCreateComponent).afterClosed().subscribe((created) => {
        if (created) {
          this.loadProjects();
        }
      });
    }
  }

  loadProjects() {
    this.loading = true;
    this.projectApi.projectsControllerFindAll().subscribe((projects) => {
      this.projects = new MatTableDataSource<Project>(projects);
      this.loading = false;
    })
  }
}
