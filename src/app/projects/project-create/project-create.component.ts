import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ProjectsApiService } from "@engo/release-manager-api-client-angular";
import { MatDialogRef } from "@angular/material/dialog";
import { subscribeOn } from "rxjs";

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css']
})
export class ProjectCreateComponent {
  projectForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    link: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required])
  });

  constructor(private projectApi: ProjectsApiService, private dialog: MatDialogRef<ProjectCreateComponent>) {
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      // Hier kannst du die Daten speichern oder weiterverarbeiten
      this.projectApi.projectsControllerCreate({
        name: this.projectForm.value.name!,
        link: this.projectForm.value.link!,
        description: this.projectForm.value.description!
      }).subscribe(() => {
        this.dialog.close(true);
      })
    }
  }

  protected readonly subscribeOn = subscribeOn;
}
