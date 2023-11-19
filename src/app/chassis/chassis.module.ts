import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChassisHeaderComponent } from './chassis-header/chassis-header.component';
import { ChassisFooterComponent } from './chassis-footer/chassis-footer.component';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { ChassisMenuComponent } from './chassis-menu/chassis-menu.component';
import { RouterLink, RouterModule } from "@angular/router";



@NgModule({
	declarations: [
		ChassisHeaderComponent,
		ChassisFooterComponent,
  ChassisMenuComponent
	],
  exports: [
    ChassisHeaderComponent,
    ChassisFooterComponent
  ],
	imports: [
		CommonModule,
		MatIconModule,
		MatMenuModule,
		MatButtonModule,
		RouterLink
	]
})
export class ChassisModule { }
