import { Component, OnInit } from '@angular/core';
import { versionRM } from "../../../version.const";

@Component({
  selector: 'app-chassis-footer',
  templateUrl: './chassis-footer.component.html',
  styleUrls: ['./chassis-footer.component.css']
})
export class ChassisFooterComponent {
	version = versionRM;
}
