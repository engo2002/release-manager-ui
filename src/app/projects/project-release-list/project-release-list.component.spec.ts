import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectReleaseListComponent } from './project-release-list.component';

describe('ProjectReleaseListComponent', () => {
  let component: ProjectReleaseListComponent;
  let fixture: ComponentFixture<ProjectReleaseListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectReleaseListComponent]
    });
    fixture = TestBed.createComponent(ProjectReleaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
