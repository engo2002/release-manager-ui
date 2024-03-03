import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MatCardModule } from "@angular/material/card";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from "./auth-routing.module";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CountdownComponent } from "ngx-countdown";
import { MatButton } from "@angular/material/button";
import { MatInput } from "@angular/material/input";

@NgModule({
  declarations: [
    LoginComponent,
    AuthComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    AuthRoutingModule,
    MatFormFieldModule,
    MatCheckboxModule,
    CountdownComponent,
    MatButton,
    MatInput,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
