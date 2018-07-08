import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { Ng2Webstorage } from 'ngx-webstorage';
import { AuthHttp } from 'angular2-jwt';
import { NgxPayPalModule } from 'ngx-paypal';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';
import { CompareValidatorDirective } from './shared/compare-validator.directive';
import { AuthentificationService } from './shared/authentification.service';
import { authHttpServiceFactory, HttpService } from "./shared/provider/http.service";
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { SpecialEventsComponent } from './dashboard/special-events/special-events.component';
import { PaymentComponent } from './payment/payment.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    RegisterComponent,
    CompareValidatorDirective,
    DashboardComponent,
    SidebarComponent,
    SpecialEventsComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    Ng2Webstorage,
    NgxPayPalModule
  ],
  providers: [
    AuthentificationService,
    HttpService,
    {provide: AuthHttp, useFactory: authHttpServiceFactory, deps: [ Http, RequestOptions ]},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
