import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FormComponent } from './form/form.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import {SliderModule} from "primeng/slider";
import { GraphComponent } from './form/graph/graph.component';
import { HttpClientModule } from "@angular/common/http";
import { TableComponent } from './form/table/table.component';
import { RouterModule, Routes } from "@angular/router";
import { LoggingComponent } from './logging/logging.component';
import { AuthGuard } from './auth-guard/auth.guard'
import {CookieService} from "ngx-cookie-service";
import { ModeratorComponent } from './form/moderator/moderator.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from "../environments/environment";

const appRoutes: Routes = [
  { path: '', component: FormComponent, canActivate: [AuthGuard] },
  { path: 'login',      component: LoggingComponent },
  { path: "**", component: FormComponent, canActivate:[AuthGuard]}

];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FormComponent,
    GraphComponent,
    TableComponent,
    LoggingComponent,
    ModeratorComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    RouterModule,
    BrowserModule,
    HttpClientModule,
    AutoCompleteModule,
    FormsModule,
    BrowserAnimationsModule,
    SliderModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [ CookieService ],
  bootstrap: [AppComponent],
  schemas:
    [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor() {
  }
}
