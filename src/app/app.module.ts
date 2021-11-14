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


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FormComponent,
    GraphComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AutoCompleteModule,
    FormsModule,
    BrowserAnimationsModule,
    SliderModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas:
    [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
