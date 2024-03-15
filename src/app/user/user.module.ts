import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from "./user.component";
import { TwoFactorComponent } from "./user-profile/two-factor/two-factor.component";
import { RouterModule } from "@angular/router";
import {
  TwoFactorCreateDialogComponent
} from "./user-profile/two-factor/two-factor-create-dialog/two-factor-create-dialog.component";
import {
  TwoFactorDeleteDialogComponent
} from "./user-profile/two-factor/two-factor-delete-dialog/two-factor-delete-dialog.component";
import { QRCodeModule } from "angularx-qrcode";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { FormsModule } from "@angular/forms";
import { MatDialogActions, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { UikFormsModule } from "@engo/engo-ui-kit-lib";
import { UserRoutingModule } from "./user-routing.module";
import { UserAdminModule } from "./user-admin/user-admin.module";



@NgModule({
  declarations: [UserComponent, TwoFactorComponent, TwoFactorCreateDialogComponent, TwoFactorDeleteDialogComponent, UserProfileComponent],
  imports: [
    CommonModule, RouterModule, QRCodeModule, FormsModule, MatDialogActions, MatDialogTitle, MatDialogContent, UikFormsModule, UserRoutingModule, UserAdminModule
  ]
})
export class UserModule { }
