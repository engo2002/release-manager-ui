import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectReleaseCreateEditComponent } from './project-release-create-edit.component';

describe('ProjectReleaseCreateEditComponent', () => {
  let component: ProjectReleaseCreateEditComponent;
  let fixture: ComponentFixture<ProjectReleaseCreateEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectReleaseCreateEditComponent]
    });
    fixture = TestBed.createComponent(ProjectReleaseCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
