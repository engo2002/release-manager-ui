import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import dayjs from "dayjs";
import { isEmpty as _isEmpty } from "lodash";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { AuthService } from "../services/auth/auth.service";
import { ErrorHandlingService } from "../services/error-handling-service/error-handling.service";

export const configErrorSnackbar = new MatSnackBarConfig();
configErrorSnackbar.duration = 4000;
configErrorSnackbar.panelClass = ["snackbar-error"];

export const configInfoSnackbar = new MatSnackBarConfig();
configInfoSnackbar.duration = 4000;
configInfoSnackbar.panelClass = ["snackbar-info"];

export const configSuccessSnackbar = new MatSnackBarConfig();
configSuccessSnackbar.duration = 4000;
configSuccessSnackbar.panelClass = ["snackbar"];

export const configSuccessLoginSnackbar = new MatSnackBarConfig();
configSuccessLoginSnackbar.duration = 4000;
configSuccessLoginSnackbar.panelClass = ["snackbar"];

@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {
    private noSessionRefresh = ["refresh", "loginSuccess", "logout", "heartbeat", "login"];
    private errorMessage = "";
    private refreshTokenInProgress = false;
    private tokenRefreshedSource = new Subject();
    private tokenRefreshed$ = this.tokenRefreshedSource.asObservable();
    private noSnackbar: string[] = ["whatsnew", "validateToken", "logout", "loginSuccess", "validateRequest"];

    constructor(private injector: Injector, private router: Router, private authService: AuthService, private errorHandlingService: ErrorHandlingService, private snackbar: MatSnackBar) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if (!!this.authService.bearerToken && this.getShouldRefresh(request)) {
            if (!this.validateTokenExpiration(this.authService.bearerToken)) {
                return this.refreshToken().pipe(
                    switchMap(() => {
                        request = this.addNewAuthHeader(request);
                        return this.handleResponse(next, request);
                    }),
                );
            }
            request = this.addNewAuthHeader(request);
            return this.handleResponse(next, request);
        }

        return this.handleResponse(next, request);
    }

    private getShouldRefresh(request: HttpRequest<any>): boolean {
        return !this.noSessionRefresh.some((r) => this.router.url.includes(r) || request.url.includes(r));
    }

    private handleResponse(next: HttpHandler, request: HttpRequest<any>): Observable<any> {
        return next.handle(request).pipe(
            tap((evt) => {
                if (evt instanceof HttpResponse) {
                    const check = this.errorHandlingService.checkRequest(request, evt, this.router.url, this.authService.isLoggedIn);
                    if (check.type === "info") {
                        this.errorMessage = check.infoMessage!;
                        this.openSnackbar(configInfoSnackbar, request);
                    } else if (check.type === "success") {
                        this.errorMessage = check.successMessage!;
                        this.openSnackbar(configSuccessSnackbar, request);
                    }
                }
            }),
            catchError((error) => this.handleResponseError(error, request, next)),
        );
    }

    private addNewAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
        if (this.authService.bearerToken) {
            const enctype = request.headers.get("enctype");
            const headers = enctype && !!enctype ? this.authService.httpOptionsForMultipartForm : this.authService.httpOptions;
            return request.clone({ headers });
        }
        return request;
    }

    private refreshToken(): Observable<any> {
        if (this.refreshTokenInProgress) {
            return new Observable((observer) => {
                this.tokenRefreshed$.subscribe(() => {
                    observer.next();
                    observer.complete();
                });
            });
        }

        this.refreshTokenInProgress = true;
        return this.authService.refreshAccessTokenForLoggedInUser$().pipe(
            tap((payload) => {
                this.refreshTokenInProgress = false;
                this.authService.setParamsAfterLoginOrRefresh(payload);
                this.tokenRefreshedSource.next("");
            }),
            catchError((e) => {
                this.refreshTokenInProgress = false;
                if ([401, 500, 400].includes(e.status)) {
                    this.logout();
                } else {
                    this.errorMessage = `Die Aktualisierung der Sitzung ist fehlgeschlagen! (${e.status})`;
                    this.snackbar
                        .open(this.errorMessage, undefined, configErrorSnackbar)
                        .afterOpened()
                        .subscribe(() => (this.errorMessage = ""));
                }
                return throwError(() => e);
            }),
        );
    }

    private validateTokenExpiration(token: string): boolean {
        const decoded = this.authService.getBearerDecoded(token);
        if (_isEmpty(decoded) || decoded["exp"] === 1) {
            return false;
        }
        const date = new Date();
        const exp = new Date(+decoded.exp! * 1000);
        return dayjs(exp).isAfter(date);
    }

    private logout() {
        this.authService.logout(true);
    }

    private handleResponseError(error: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if (error.status === 401 && this.getShouldRefresh(request)) {
            return this.refreshToken().pipe(
                switchMap(() => {
                    request = this.addNewAuthHeader(request);
                    return next.handle(request);
                }),
                catchError((e) => {
                    this.authService.clearLoginAndUser();
                    return throwError(() => e);
                }),
            );
        } else {
            const check = this.errorHandlingService.checkError(request, error, this.router.url);
            this.errorMessage = check.errorMessage;
            if (check.hasError) {
                this.openSnackbar(configErrorSnackbar, request);
            }
        }
        return throwError(() => error);
    }

    private openSnackbar(config: MatSnackBarConfig, req: HttpRequest<any>) {
        if (!this.noSnackbar.some((context) => req.url.includes(context))) {
            if (this.errorMessage && this.errorMessage !== "") {
                this.snackbar
                    .open(this.errorMessage, undefined, config)
                    .afterOpened()
                    .subscribe(() => (this.errorMessage = ""));
            }
        } else {
            this.errorMessage = "";
        }
    }
}
