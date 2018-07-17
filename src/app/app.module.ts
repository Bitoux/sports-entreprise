import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { Ng2Webstorage } from 'ngx-webstorage';
import { AuthHttp } from 'angular2-jwt';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';
import { CompareValidatorDirective } from './shared/compare-validator.directive';
import { AuthentificationService } from './shared/authentification.service';
import { authHttpServiceFactory, HttpService } from "./shared/provider/http.service";
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { SpecialEventsComponent } from './dashboard/special-events/special-events.component';
import { PaymentComponent } from './payment/payment.component';
import { EventCreateComponent } from './dashboard/event-create/event-create.component';
import { EventEditComponent } from './dashboard/event-edit/event-edit.component';
import { BillsComponent } from './dashboard/bills/bills.component';
import { EditAccountComponent } from './dashboard/edit-account/edit-account.component';
import { ShopsComponent } from './dashboard/shops/shops.component';
import { ShopsCreateComponent } from './dashboard/shops-create/shops-create.component';
import { ShopsEditComponent } from './dashboard/shops-edit/shops-edit.component';
import {FilterPipe} from './shared/filter.pipe';
import {FilterSpotPipe} from './shared/filterSpot.pipe';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    RegisterComponent,
    CompareValidatorDirective,
    SidebarComponent,
    SpecialEventsComponent,
    PaymentComponent,
    EventCreateComponent,
    EventEditComponent,
    BillsComponent,
    EditAccountComponent,
    ShopsComponent,
    ShopsCreateComponent,
    ShopsEditComponent,
    FilterPipe,
    FilterSpotPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    Ng2Webstorage,
    NgxPayPalModule,
    NgxSpinnerModule
  ],
  providers: [
    AuthentificationService,
    HttpService,
    {provide: AuthHttp, useFactory: authHttpServiceFactory, deps: [ Http, RequestOptions ]},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
