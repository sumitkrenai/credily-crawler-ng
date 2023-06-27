import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CircularLoaderComponent } from './circular-loader/circular-loader.component';
import { FormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { SafePipe } from './pipe/safe.pipe';
import { StateDropdownComponent } from './state-dropdown/state-dropdown.component';
import { AccountUserComponent } from './account-user/account-user.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfigurationComponent,
    CircularLoaderComponent,
    SafePipe,
    StateDropdownComponent,
    AccountUserComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    AngularMultiSelectModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
