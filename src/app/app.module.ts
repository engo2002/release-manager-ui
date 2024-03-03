import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ChassisModule } from "./chassis/chassis.module";
import { AppRoutingModule } from "./app-routing.module";
import { Configuration } from "@engo/release-manager-api-client-angular";
import { environment } from "../environments/environment";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpTimeoutInterceptor } from "./interceptor/http-timeout.interceptor";
import { HttpResponseInterceptor } from "./interceptor/http-response.interceptor";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ChassisModule,
      AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTimeoutInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpResponseInterceptor,
      multi: true,
    },
    {
      provide: Configuration,
      useFactory: () =>
        new Configuration({
          basePath: environment.backendUrl.replace("/api/", ""),
        }),
      multi: false,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
