import { Component, OnInit } from '@angular/core';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {LocalStorageService} from 'ngx-webstorage';
import { HttpService } from '../shared/provider/http.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  user: any;
  public payPalConfig?: PayPalConfig;
  successPayment: boolean;
  errorPayment: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: LocalStorageService,
    private httpService: HttpService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.successPayment = false;
    this.errorPayment = false;

    this.initTest();
    this.initConfig();
  }

  initTest(){
    this.user = this.storage.retrieve('user');
    if(this.user){
      console.log('ok');
    }else{
      console.log('no user');
      this.router.navigate(['/']);
    }
  }

  initConfig(): void {
      this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
        commit: true,
        client: {
          sandbox: 'AWII78IQOYh8Yi7_em0fkLTI5b-3cZb-f-Jo3ZUL8ZKpl69zEpA5BnejhxLAWW7Gjcdui2xquqpsOmKY'
        },
        button: {
          label: 'paypal',
        },
        onPaymentComplete: (data, actions) => {
          this.savePayment(data);
          this.successPayment = true;
          this.errorPayment = false;
        },
        onCancel: (data, actions) => {
          console.log('OnCancel');
        },
        onError: (err) => {
          console.log('OnError', err);
          this.errorPayment = true;
          this.successPayment = false;
        },
        transactions: [{
          amount: {
            currency: 'EUR',
            total: 15
          }
        }]
      });
    }

    savePayment(data){
      let payment = {
        date: new Date(),
        amount: 15,
        company: this.user.company.id,
        order_id: data.orderID,
        payer_id: data.payerID,
        payment_id: data.paymentID,
        payment_token: data.paymentToken,
        return_url: data.returnUrl
      }
      this.spinner.show();
      this.httpService.post('/api/payments/add', payment)
      .subscribe(data => {
        this.user = data;
        this.storage.clear('user');
        this.storage.store('user', this.user);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
      });
    }

    redirectToDashboard(){
      this.router.navigate(['/events']);
    }


}
