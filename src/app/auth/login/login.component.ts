import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgModel } from "@angular/forms";
import { AuthService } from "../auth.service";
import { EMPTY, Observable, Subscription, tap } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { isEmpty as _isEmpty } from "lodash";
import { CountdownConfig, CountdownEvent } from "ngx-countdown";
import { Router } from "@angular/router";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { AuthenticationApiService } from "@engo/release-manager-api-client-angular";
import { ILoginPayload } from "../interfaces/ILoginPayload.interface";
import { catchError } from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
  isLoggedIn = false;
  isLoggingIn = false;
  username = "";
  password: NgModel | undefined;
  loginDisabled = false;
  loginSnoozeActive = false;
  loginSnoozeTime = 0;
  loginSnoozeCountdown: CountdownConfig = {};
  loginSuccessful = false;
  hidePassword = true;
  stayLoggedIn = true;
  credentialsChecked = false;
  showLoadingCircle = false;
  tfaEnabled = false;
  code = "";

  private loginSubscription: Subscription = new Subscription();
  private permissionSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog, private authApi: AuthenticationApiService) {
  }

  ngOnInit(): void {
    this.initLogin();
  }

  public initLogin() {
    const ls = localStorage.getItem("loginCount")!;
    if (!_isEmpty(ls) && parseInt(ls) >= 2) {
      this.clearAndDisableInputAndSnoozeLogin();
    }
    const lsStayLoggedIn = localStorage.getItem("stayLoggedIn");
    if (!_isEmpty(lsStayLoggedIn)) {
      this.stayLoggedIn = JSON.parse(lsStayLoggedIn!);
    }
  }

  public login() {
    this.showLoadingCircle = true;
    this.login$(this.username, this.password!.value).subscribe((loginPayload) => {
      this.loginSuccessful = true;
      this.isLoggedIn = true;
      this.resetLoginSnooze();
      this.authService.setParamsAfterLoginOrRefresh(loginPayload);
      setTimeout(() => {
        this.showLoadingCircle = false;
      }, 2000);
    });
  }

  public onCountdownEvent(event: CountdownEvent): void {
    const leftTime = event.left;
    if (leftTime === 0) {
      this.loginDisabled = false;
      this.loginSnoozeActive = false;
    }
  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
    this.permissionSubscription?.unsubscribe();
  }

  stayLoggedInChange($event: MatCheckboxChange) {
    this.stayLoggedIn = $event.checked;
    localStorage.setItem("stayLoggedIn", String($event.checked));
  }

  checkCredentials(password: NgModel) {
    this.password = password;
    this.authApi.authControllerValidateLogin({username: this.username, password: this.password.value}).subscribe({
      next: (validation) => {
        this.credentialsChecked = validation.credentialsValid;
        this.tfaEnabled = !!validation.twoFactorEnabled ? validation.twoFactorEnabled : false;
      },
      error: () => {
        this.credentialsChecked = false;
        this.tfaEnabled = false;
        this.loginFailed();
      },
    });
  }

  private login$(username: string, password: string): Observable<ILoginPayload> {
    return this.authApi.authControllerLogin({username: username, password: password, stayLoggedIn: this.stayLoggedIn, code: this.code}).pipe(
      tap((loginstatus) => {
        this.loginDisabled = true;
        this.isLoggedIn = true;
        this.authService.setLoginStatus(loginstatus);
        return loginstatus;
      }),
      catchError(() => {
        this.loginFailed();
        return EMPTY;
      }),
    );
  }
  private loginFailed() {
    this.showLoadingCircle = false;
    this.isLoggingIn = false;
    this.clearAndDisableInputAndSnoozeLogin();
    this.loginTryCounter();
    this.loginSuccessful = false;
  }

  private clearAndDisableInputAndSnoozeLogin() {
    this.loginDisabled = true;
    this.loginSnoozeActive = true;
    if (this.username && this.password && this.password.value) {
      this.code = "";
    }
  }

  private loginTryCounter(): void {
    const loginCount = localStorage.getItem("loginCount");
    if (!_isEmpty(loginCount) && loginCount !== null) {
      if (parseInt(loginCount, 10) >= 2) {
        const newLoginCount = (parseInt(loginCount, 10) + 1).toString(10);
        this.loginSnoozeTime = 300;
        localStorage.setItem("loginCount", newLoginCount);
      } else {
        const newLoginCount = (parseInt(loginCount, 10) + 1).toString(10);
        this.loginSnoozeTime = parseInt(loginCount, 10) * 5;
        localStorage.setItem("loginCount", newLoginCount);
      }
    } else {
      const newLoginCount = "0";
      this.loginSnoozeTime = 5;
      localStorage.setItem("loginCount", newLoginCount);
    }
    this.loginSnoozeCountdown = {
      leftTime: this.loginSnoozeTime,
      formatDate: ({ date }) => `${date / 1000}`,
    };
  }

  private resetLoginSnooze(): void {
    localStorage.setItem("loginCount", "0");
    this.loginSnoozeTime = 0;
    this.loginSnoozeActive = false;
  }
}
