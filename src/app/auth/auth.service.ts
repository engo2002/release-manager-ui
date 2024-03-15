import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { isEmpty as _isEmpty, isEqual as _isEqual } from "lodash";
import { CookieService } from "ngx-cookie-service";
import { BehaviorSubject, Observable, of, switchMap } from "rxjs";
import { environment } from "src/environments/environment";
import { jwtDecode } from "jwt-decode";
import {
  AuthenticationApiService, PermissionsApiService
} from "@engo/release-manager-api-client-angular";
import { IRefreshTokenPayload } from "./interfaces/refreshTokenPayload.interface";
import { ILoginStatus } from "./interfaces/loginStatus.interface";
import { ILoginPayload } from "./interfaces/ILoginPayload.interface";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    loggedInStatusSubject: BehaviorSubject<ILoginStatus | null>;

    constructor(private authApi: AuthenticationApiService, private router: Router, public snackbar: MatSnackBar, private cookieService: CookieService, private permissionApi: PermissionsApiService, private http: HttpClient) {
        this.loggedInStatusSubject = new BehaviorSubject<ILoginStatus | null>({
            userId: this.userId,
            email: null,
            fullname: null,
            username: null,
        });
    }

    public get httpOptions() {
        return new HttpHeaders({
            "Content-Type": "application/json",
            // tslint:disable-next-line: object-literal-key-quotes
            Authorization: "Bearer " + this.bearerToken,
            "Access-Control-Allow-Origin": environment.backendUrl.toString(),
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
        });
    }

    public get httpOptionsForMultipartForm() {
        return new HttpHeaders({
            // eslint-disable-next-line quote-props
            Authorization: "Bearer " + this.bearerToken,
            enctype: "multipart/form-data",
            "Access-Control-Allow-Origin": environment.backendUrl.toString(),
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
        });
    }

    public get bearerToken() {
        return this.cookieService.check("accessToken") ? this.cookieService.get("accessToken") : "";
    }

    public get refreshToken(): string | null {
        return this.cookieService.check("refreshToken") ? this.cookieService.get("refreshToken") : "";
    }

    public get sessionId(): string | null {
        return this.cookieService.check("sessionId") ? this.cookieService.get("sessionId") : "";
    }

    public get loggedInStatus(): ILoginStatus {
        return <ILoginStatus>this.loggedInStatusSubject.getValue();
    }

    public get isLoggedIn(): boolean {
        return !!this.bearerToken && !!this.refreshToken;
    }

    private get userId() {
        return this.cookieService.check("userId") ? this.cookieService.get("userId") : null;
    }

    public getUserDataIfNotExist$(): Observable<ILoginStatus | null> {
        if (this.isLoggedIn && !!this.userId) {
            const payload = this.getBearerDecoded(this.bearerToken);
            if (Object.values(this.loggedInStatus).includes(null) || (payload && payload["userId"] !== this.loggedInStatus.userId)) {
                return this.validateAccessToken(this.bearerToken).pipe(
                    switchMap((payload) => {
                        this.setLoginStatus(payload);
                        return of(this.loggedInStatus);
                    }),
                );
            } else {
                return of(this.loggedInStatus);
            }
        } else {
            if (this.isLoggedIn) {
                this.clearLoginAndUser();
            }
            return of(null);
        }
    }

    getBearerDecoded(token: string) {
        try {
            return jwtDecode(token);
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    public setLoginStatus(data: any) {
        const oldData = structuredClone(this.loggedInStatus);
        if (data && !!data.username) {
            const loginStatus: ILoginStatus = {
                userId: this.userId,
                fullname: data.fullname,
                username: data.username,
                email: !!data.email ? data.email : oldData.email,
            };
            const hasChanged = !_isEqual(oldData, loginStatus);
            if (hasChanged) {
                this.loggedInStatusSubject.next(loginStatus);
            }
        }
    }
    public checkPermission(permissionValueNeed: any) {
        const config = new MatSnackBarConfig();
        config.duration = 3000;
        config.panelClass = ["snackbar"];
        if (this.isLoggedIn) {
            this.permissionApi.permissionsControllerGetUserPermissions(this.userId!).subscribe(
              { next: ((permissions) => {
                    if (permissions[permissionValueNeed] === true) {
                        return true;
                    } else {
                        this.router.navigate(["no-permission"]);
                        return false;
                    }}), error: (() => {
                    this.router.navigate(["no-permission"]);
                })});
        } else {
            this.router.navigate(["no-permission"]);
        }
    }

    public clearLoginAndUser() {
        const stayloggedin = localStorage.getItem("stayLoggedIn");
        localStorage.clear();
        sessionStorage.clear();
        if (!!stayloggedin) {
            localStorage.setItem("stayLoggedIn", stayloggedin!);
        }
        this.cookieService.deleteAll("/", this.extractDomainFromEnvUrl(this.getCurrentDomain()), !this.isLocalhost(this.getCurrentDomain()), "Lax");
    }

    public logout(sessionExpired?: boolean) {
      this.clearLoginAndUser();
      if (this.refreshToken && !_isEmpty(this.refreshToken)) {
        this.logoutEndpoint(this.refreshToken).subscribe({
            next:
              () => {
                this.router.navigate(["/"], {queryParams: {expired: sessionExpired}});
              },
            error:
              () => {
                this.router.navigate(["/"], {queryParams: {expired: sessionExpired}});
              },
          },
        );
      } else {
        this.router.navigate(["/"], {queryParams: {expired: sessionExpired}});
      }
    }

    public setParamsAfterLoginOrRefresh(payload: IRefreshTokenPayload | ILoginPayload) {
        this.setAuthTokenInBrowser(payload.accessToken, payload.refreshExpiresIn);
        this.setRefreshTokenInBrowser(payload.refreshToken, payload.refreshExpiresIn);
        this.setSessionIdInBrowser(payload.session.sessionId, payload.refreshExpiresIn);
        this.setUserIdInBrowser(payload.session.userId, payload.refreshExpiresIn);
    }

    public setRefreshTokenInBrowser(refreshtoken: string, refreshTokenExpiration: string) {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + this.convertTokenExpirationTimeToMilliseconds(refreshTokenExpiration));

        this.cookieService.set("refreshToken", refreshtoken, expirationDate, "/", this.extractDomainFromEnvUrl(this.getCurrentDomain()), !this.isLocalhost(this.getCurrentDomain()), "Lax");
    }

    public setAuthTokenInBrowser(accessToken: string, refreshTokenExpiration: string) {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + this.convertTokenExpirationTimeToMilliseconds(refreshTokenExpiration));

        this.cookieService.set("accessToken", accessToken, expirationDate, "/", this.extractDomainFromEnvUrl(this.getCurrentDomain()), !this.isLocalhost(this.getCurrentDomain()), "Lax");
    }

    public setSessionIdInBrowser(sessionId: string, refreshTokenExpiration: string) {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + this.convertTokenExpirationTimeToMilliseconds(refreshTokenExpiration));

        this.cookieService.set("sessionId", sessionId, expirationDate, "/", this.extractDomainFromEnvUrl(this.getCurrentDomain()), !this.isLocalhost(this.getCurrentDomain()), "Lax");
    }

    public setUserIdInBrowser(userId: string, refreshTokenExpiration: string) {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + this.convertTokenExpirationTimeToMilliseconds(refreshTokenExpiration));

        this.cookieService.set("userId", userId, expirationDate, "/", this.extractDomainFromEnvUrl(this.getCurrentDomain()), !this.isLocalhost(this.getCurrentDomain()), "Lax");
    }

    private convertTokenExpirationTimeToMilliseconds(expiration: string): number {
        // Beispiel: "5d" für 5 Tage
        const unit = expiration.charAt(expiration.length - 1);
        const value = parseInt(expiration.slice(0, expiration.length - 1));

        switch (unit) {
            case "d": // Tage
                return value * 24 * 60 * 60 * 1000;
            case "h": // Stunden
                return value * 60 * 60 * 1000;
            case "m": // Minuten
                return value * 60 * 1000;
            default:
                return 0;
        }
    }

    private extractDomainFromEnvUrl(url: string) {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname.split(".");

        if (hostname.length >= 3) {
            // Wenn es mehr als 2 Teile gibt, nimm die letzten beiden Segmente der Domain
            return hostname.slice(-2).join(".");
        } else {
            return parsedUrl.hostname;
        }
    }

    private getCurrentDomain() {
        return window.location.origin;
    }

    private isLocalhost(url: string): boolean {
        const lowerCaseUrl = url.toLowerCase();
        return lowerCaseUrl.includes("localhost") || lowerCaseUrl.includes("127.0.0.1");
    }

  public validateAccessToken(token: string): Observable<any> {
    const httpOptions = new HttpHeaders({
      "Content-Type": "application/json",
      // tslint:disable-next-line: object-literal-key-quotes
      Authorization: "Bearer " + token,
      "Access-Control-Allow-Origin": environment.backendUrl.toString(),
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
      "ngsw-bypass": "",
    });
    return this.http.get<any>(environment.backendUrl + "auth/validateToken/", { headers: httpOptions });
  }

  public refreshAccessToken(httpOptions: HttpHeaders, sessionId?: string): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        sessionId: sessionId!,
      },
    });
    return this.http.get<any>(environment.backendUrl + "auth/refresh", {
      headers: httpOptions,
      params: params,
    });
  }

  public refreshAccessTokenForLoggedInUser$(): Observable<IRefreshTokenPayload> {
    const refreshHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // tslint:disable-next-line: object-literal-key-quotes
      Authorization: "Bearer " + this.refreshToken,
      "Access-Control-Allow-Origin": environment.backendUrl.toString(),
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
      "ngsw-bypass": "",
    });
    const sessionId = this.sessionId;
    return this.refreshAccessToken(refreshHeader, sessionId!);
  }

  public logoutEndpoint(refreshToken: string): Observable<any> {
      const logoutHeader = new HttpHeaders({
        "Content-Type": "application/json",
        // tslint:disable-next-line: object-literal-key-quotes
        Authorization: "Bearer " + refreshToken,
        "Access-Control-Allow-Origin": environment.backendUrl.toString(),
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
        "ngsw-bypass": "",
      });
      return this.http.post<any>(environment.backendUrl + "auth/logout/", {}, { headers: logoutHeader });
    }
}
