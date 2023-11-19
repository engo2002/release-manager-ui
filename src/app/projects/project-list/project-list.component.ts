// In der TypeScript-Datei der Komponente (project-list.component.ts)
import { Component, OnInit } from '@angular/core';
import { Project } from "@engo/release-manager-api-client-angular";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];

  displayedColumns: string[] = ['name', 'description', 'link'];

  constructor() { }

  ngOnInit(): void {
  }
}
