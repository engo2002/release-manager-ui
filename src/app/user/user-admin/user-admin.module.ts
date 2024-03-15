import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UikTableCheckboxModule, UikTableLoadingModule, UikTableMoreActionsModule } from "@engo/engo-ui-kit-lib";
import { MatSelectModule } from "@angular/material/select";
import { UserAdminComponent } from "./user-admin.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { UserAdministrationRolesComponent } from "./user-administration-roles/user-administration-roles.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  UserAdministrationRegisterComponent
} from "./user-administration-register/user-administration-register.component";
import {
  UserAdministrationPasswordComponent
} from "./user-administration-password/user-administration-password.component";
import { UserAdministrationComponent } from "./user-administration/user-administration.component";
@NgModule({
    declarations: [UserAdministrationComponent, UserAdministrationPasswordComponent, UserAdministrationRegisterComponent, UserAdministrationRolesComponent, UserAdminComponent],
  imports: [CommonModule, RouterModule, FormsModule, UikTableCheckboxModule, ReactiveFormsModule, MatSelectModule, MatSlideToggleModule, MatFormFieldModule, MatCheckboxModule, UikTableLoadingModule, UikTableMoreActionsModule, UikTableLoadingModule],
})
export class UserAdminModule {}
