import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, throwError } from "rxjs";
import { catchError, timeout } from "rxjs/operators";
import { configErrorSnackbar } from "./http-response.interceptor";

@Injectable()
export class HttpTimeoutInterceptor implements HttpInterceptor {
    constructor(private snackbar: MatSnackBar) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const timeoutValue = 20000; // 10 seconds in milliseconds

        return next.handle(req).pipe(
            timeout(timeoutValue),
            catchError((error) => {
                if (error.name === "TimeoutError") {
                    this.snackbar.open("Die Anfrage konnte nicht rechtzeitig verarbeitet werden", undefined, configErrorSnackbar).afterOpened().subscribe();
                }
                return throwError(error);
            }),
        );
    }
}
