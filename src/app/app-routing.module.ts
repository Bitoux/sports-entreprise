import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { PaymentComponent } from './payment/payment.component';
import { SpecialEventsComponent } from './dashboard/special-events/special-events.component'; 
import { EventCreateComponent } from './dashboard/event-create/event-create.component';
import { EventEditComponent } from './dashboard/event-edit/event-edit.component';
import { BillsComponent } from './dashboard/bills/bills.component';
import { EditAccountComponent } from './dashboard/edit-account/edit-account.component';
import { ShopsComponent } from './dashboard/shops/shops.component';
import { ShopsCreateComponent } from './dashboard/shops-create/shops-create.component';
import { ShopsEditComponent } from './dashboard/shops-edit/shops-edit.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard/payment', component: PaymentComponent },
  { path: 'dashboard/events', component: SpecialEventsComponent },
  { path: 'dashboard/events/create', component: EventCreateComponent },
  { path: 'dashboard/events/:id', component: EventEditComponent },
  { path: 'dashboard/bills', component: BillsComponent },
  { path: 'dashboard/account', component: EditAccountComponent },
  { path: 'dashboard/shops', component: ShopsComponent },
  { path: 'dashboard/shops/create', component: ShopsCreateComponent },
  { path: 'dashboard/shops/:id', component: ShopsEditComponent }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule { }
