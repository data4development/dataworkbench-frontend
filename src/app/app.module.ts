import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './home/home.component';
import { LayoutModule } from './layout/layout.module';

// TODO: moet lazy loaded worden. Hier verwijderen als lazy loading voor organisations is geimplementeerd.
import { OrganisationsModule } from './organisations/organisations.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    HttpClientModule,
    CoreModule,
    SharedModule,
    LayoutModule,
    OrganisationsModule,
    AppRoutingModule,
  ],
  exports: [
    CoreModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }