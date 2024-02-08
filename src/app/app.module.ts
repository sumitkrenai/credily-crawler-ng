import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { StateDropdownComponent } from './state-dropdown/state-dropdown.component';
import { AccountUserComponent } from './account-user/account-user.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ReportComponent } from './report/report.component';
import { ProviderReportComponent } from './provider-report/provider-report.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { QueueComponent } from './queue/queue.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfigurationComponent,
    StateDropdownComponent,
    AccountUserComponent,
    HeaderComponent,
    ReportComponent,
    ProviderReportComponent,
    QueueComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    AngularMultiSelectModule,
    DragDropModule,
    // NgxDaterangepickerMd.forRoot(),
    SharedModule

  ],
  exports:[
    HeaderComponent
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }] ,
  bootstrap: [AppComponent]
})
export class AppModule { }
