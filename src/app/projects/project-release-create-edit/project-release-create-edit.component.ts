import { Component, OnInit } from '@angular/core';
import { ReleasesApiService } from "@engo/release-manager-api-client-angular";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-project-release-create-edit',
  templateUrl: './project-release-create-edit.component.html',
  styleUrls: ['./project-release-create-edit.component.css']
})
export class ProjectReleaseCreateEditComponent implements OnInit {
  isNew: boolean = true;
  loading = true;
  majorHtml: string = "";
  minorHtml: string = "";
  bugfixHtml: string = "";
  otherHtml: string = "";
  majorHtmlBackup: string = "";
  minorHtmlBackup: string = "";
  bugfixHtmlBackup: string = "";
  otherHtmlBackup: string = "";
  releaseForm = new FormGroup({
    releaseNumber: new FormControl("", [Validators.required]),
    headline: new FormControl("", [Validators.required]),
    showMajorInWhatsNew: new FormControl(true),
    showMinorInWhatsNew: new FormControl(true),
    showBugfixInWhatsNew: new FormControl(true),
    showOtherInWhatsNew: new FormControl(true),
  });
  projectId = "";
  releaseId = "";

  constructor(private releaseApi: ReleasesApiService, private route: ActivatedRoute, private router: Router) {
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (!!params) {
        if (!!params.projectId) {
          this.projectId = params.projectId;
        }
        if (!!params.releaseId) {
          this.releaseId = params.releaseId;
          this.isNew = false;
          this.getRelease();
        } else {
          this.isNew = true;
          this.loading = false;
        }
      } else {
        this.toProjects();
      }
    })
  }

  getRelease() {
    this.loading = true;
    this.releaseApi.releaseControllerFindReleaseById(this.releaseId).subscribe((release) => {
      const majorField = !!release.fields ? release.fields.find((f) => f.fieldType === "majorField") : null;
      const minorField = !!release.fields ? release.fields.find((f) => f.fieldType === "minorField"): null;
      const bugfixField = !!release.fields ? release.fields.find((f) => f.fieldType === "bugfixField"): null;
      const otherField = !!release.fields ? release.fields.find((f) => f.fieldType === "otherField"): null;
      this.releaseForm.setValue({
        headline: release.headline,
        releaseNumber: release.releaseNumber,
        showMajorInWhatsNew: !!majorField ? majorField.showInWhatsNew : false,
        showMinorInWhatsNew: !!minorField ? minorField.showInWhatsNew : false,
        showBugfixInWhatsNew: !!bugfixField ? bugfixField.showInWhatsNew : false,
        showOtherInWhatsNew: !!otherField? otherField.showInWhatsNew : false,
      });
      this.majorHtml = !!majorField ? majorField.content : undefined;
      this.minorHtml = !!minorField ? minorField.content : undefined;
      this.bugfixHtml = !!bugfixField ? bugfixField.content : undefined;
      this.otherHtml = !!otherField ? otherField.content : undefined;
      this.majorHtmlBackup = structuredClone(this.majorHtml);
      this.minorHtmlBackup =  structuredClone(this.minorHtml);
      this.bugfixHtmlBackup =  structuredClone(this.bugfixHtml);
      this.otherHtmlBackup =  structuredClone(this.otherHtml);

      this.loading = false;
    })
  }


  setEditorData($event: string, fieldType: string) {
    if (fieldType === "major") {
      this.majorHtml = $event;
    }
    if (fieldType === "minor") {
      this.minorHtml = $event;
    }
    if (fieldType === "bugfix") {
      this.bugfixHtml = $event;
    }
    if (fieldType === "other") {
      this.otherHtml = $event;
    }
  }

  create() {
    this.releaseApi.releaseControllerCreateRelease(this.projectId, {
      majorField: {
        content: this.majorHtml,
        showInWhatsNew: this.releaseForm.get("showMajorInWhatsNew").value,
      },
      minorField: {
        content: this.minorHtml,
        showInWhatsNew: this.releaseForm.get("showMinorInWhatsNew").value,
      },
      bugfixField: {
        content: this.bugfixHtml,
        showInWhatsNew: this.releaseForm.get("showBugfixInWhatsNew").value,
      },
      otherField: {
        content: this.otherHtml,
        showInWhatsNew: this.releaseForm.get("showOtherInWhatsNew").value,
      },
      releaseNumber: this.releaseForm.get("releaseNumber").value,
      headline: this.releaseForm.get("headline").value
    }).subscribe(() => {
      this.router.navigate([`/projects/${this.projectId}/releases`])
    })
  }

  edit() {
    this.releaseApi.releaseControllerUpdateRelease(this.releaseId, {
      majorField: {
        content: this.majorHtml,
        showInWhatsNew: this.releaseForm.get("showMajorInWhatsNew").value,
      },
      minorField: {
        content: this.minorHtml,
        showInWhatsNew: this.releaseForm.get("showMinorInWhatsNew").value,
      },
      bugfixField: {
        content: this.bugfixHtml,
        showInWhatsNew: this.releaseForm.get("showBugfixInWhatsNew").value,
      },
      otherField: {
        content: this.otherHtml,
        showInWhatsNew: this.releaseForm.get("showOtherInWhatsNew").value,
      },
      releaseNumber: this.releaseForm.get("releaseNumber").value,
      headline: this.releaseForm.get("headline").value
    }).subscribe(() => {
      this.router.navigate([`/projects/${this.projectId}/releases`])
    })
  }

  toProjects() {
    this.router.navigate(["/projects"]);
  }

  toReleases() {
    this.router.navigate([`/projects/${this.projectId}/releases/`])
  }
}
