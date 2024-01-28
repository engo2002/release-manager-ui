import { Component, OnInit } from '@angular/core';
import { Project, ProjectsApiService, Release, ReleasesApiService } from "@engo/release-manager-api-client-angular";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap, tap } from "rxjs";

@Component({
  selector: 'app-project-release-list',
  templateUrl: './project-release-list.component.html',
  styleUrls: ['./project-release-list.component.css']
})
export class ProjectReleaseListComponent implements OnInit{
  releases: MatTableDataSource<Release> = new MatTableDataSource<Release>();
  projectId: string = "";
  project: Project = {
    description: "",
    id: "",
    link: "",
    name: "",
    releases: undefined
  }
  loading = true;
  displayedColumns: string[] = ['version', 'headline'];

  constructor(private projectApi: ProjectsApiService, private releaseApi: ReleasesApiService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (!!params) {
        if (!!params.projectId) {
          this.projectId = params.projectId;
          this.getReleases();
        } else {
          this.toProjects();
        }
      } else {
        this.toProjects();
      }
    })
  }

  private toProjects() {
    this.router.navigate(["/projects"])
  }

  getReleases() {
    this.loading = true;
    this.projectApi.projectsControllerFindOne(this.projectId).pipe(tap(project => {
      this.project = project;
    }), switchMap(() => this.releaseApi.releaseControllerFindReleasesByProjectId(this.projectId).pipe(tap((releases) => {
      this.releases = new MatTableDataSource<Release>(releases);
    })))).subscribe(() => {
      this.loading = false;
    })
  }

  createRelease() {
    this.router.navigate([`/projects/${this.projectId}/releases/create`])
  }

}
