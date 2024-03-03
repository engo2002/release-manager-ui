import { HttpErrorResponse, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { isEmpty as _isEmpty } from "lodash";
import { Router } from "@angular/router";

export interface ErrorCheckResponse {
    hasError: boolean;
    errorMessage: string;
}

export interface RequestCheckResponse {
    type: "info" | "success" | "none";
    infoMessage?: string;
    successMessage?: string;
}

@Injectable({
    providedIn: "root",
})
export class ErrorHandlingService {
  constructor(private router: Router) {
  }

    checkRequest(req: HttpRequest<any>, evt: HttpResponse<any>, routeUrl: string, isLoggedIn: boolean): RequestCheckResponse {
        let response: RequestCheckResponse = { type: "none" };
        if (req.method !== "OPTIONS") {
            // SUCCESS HANDLING
            if (evt instanceof HttpResponse) {
                if (req.method === "POST" && evt.status === 201 && !routeUrl.includes("/login")) {
                    response = {
                        type: "success",
                        successMessage: "Der Eintrag wurde erfolgreich erstellt.",
                    };
                }

                if (req.method === "PUT" && evt.status === 200) {
                    response = {
                        type: "success",
                        successMessage: "Der Eintrag wurde erfolgreich aktualisiert.",
                    };
                }

                if (req.method === "DELETE" && evt.status === 200) {
                    response = {
                        type: "success",
                        successMessage: "Der Eintrag wurde erfolgreich gelöscht.",
                    };
                }
            }
            // INFO-HANDLING
            // no further handling on indexpage and loginpage
            if (!routeUrl.includes("/index") && !routeUrl.includes("/login") && !routeUrl.includes("/landing")) {
                // intercept empty response (info-snackbar)
                if (evt.body && evt.body.length === 0 && evt.status === 200 && req.method === "GET") {
                    response = {
                        type: "info",
                        infoMessage: "Das angeforderte Objekt ist leer. Es sind keine Daten vorhanden.",
                    };
                }
                // not Logged in (Login needed)
                if (evt.status === 401 && !isLoggedIn) {
                  this.router.navigate(["/auth/login"]);
                }
            }
        }
        return response;
    }

    public checkError(req: HttpRequest<any>, error: HttpErrorResponse, routeUrl: string): ErrorCheckResponse {
        let errorMessage = "";
        // ERROR-HANDLING
        // no error-handling on indexpage
        // Session expired
        if (!routeUrl.includes("/index")) {
            // Login-Page Error Handling
            if (routeUrl.includes("/login")) {
                errorMessage = "Beim Login ist es zu einem Fehler gekommen. Bitte überprüfen Sie die eingegebenen Zugangsdaten sowie die Serververfügbarkeit.";
                if (error.message === "User not found" || error.status === 501 || error.status === 302) {
                    errorMessage = "Der Benutzer konnte nicht gefunden werden.";
                } else {
                    if (error.error.message === "Invalid credentials" || error.status === 417) {
                        errorMessage = "Die für den Benutzer angegebenen Zugangsdaten sind nicht korrekt.";
                    }
                }
            }

            // Error-Code-Handling
            if (error.status === 500) {
                errorMessage = "Interner Serverfehler. Der Server kann Ihre Anfrage gerade nicht verarbeiten. Bitte informieren Sie die IT.";
                if (req.method === "POST") {
                    errorMessage = "Die an den Server übermittelten Daten sind entweder ungültig oder existiert bereits ein Eintrag. Es wurde kein Eintrag angelegt.";
                }
                if (req.method === "PUT") {
                    errorMessage = "Die an den Server übermittelten Daten sind ungültig. Es wurden keine bestehenden Daten verändert.";
                }
            }
            if (error.status === 404) {
                errorMessage = "Das angeforderte Objekt konnte nicht gefunden werden oder ist nicht vorhanden.";
            }
            if (_isEmpty(errorMessage)) {
                if (error.error.message) {
                    errorMessage = "Fehler: " + error.error.message + ` (${error.status})`;
                }
            }
        }
        return <ErrorCheckResponse>{
            hasError: !_isEmpty(errorMessage),
            errorMessage: _isEmpty(errorMessage) ? undefined : errorMessage,
        };
    }
}
