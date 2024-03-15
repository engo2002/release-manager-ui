import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import { AuthenticationApiService, PermissionsApiService } from "@engo/release-manager-api-client-angular";
import { Router } from "@angular/router";

@Component({
  selector: 'app-chassis-menu',
  templateUrl: './chassis-menu.component.html',
  styleUrls: ['./chassis-menu.component.css']
})
export class ChassisMenuComponent implements OnInit {
  showLinkUserAdmin = true;

  constructor(public readonly authService: AuthService, private permissionApi: PermissionsApiService, private router: Router) {
  }

  ngOnInit() {

  }

  public getRights() {
    this.permissionApi.permissionsControllerGetUserPermissions(this.authService.loggedInStatus.userId).subscribe((permissions) => {
      this.showLinkUserAdmin = !!permissions["canReadUsers"];
    })
  }

  public toUserProfile() {
    this.router.navigate(["/user/profile"])
  }

  public toUserAdmin() {
    this.router.navigate(["/user/admin"])
  }

  public logout() {
    this.authService.logout();
  }

  public get showLinkLogout() {
    return this.authService.isLoggedIn;
  }



}
