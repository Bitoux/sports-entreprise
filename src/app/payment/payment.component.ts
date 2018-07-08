import { Component, OnInit } from '@angular/core';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  user: any;
  public payPalConfig?: PayPalConfig;

  constructor() { }

  ngOnInit() {
    this.initConfig();
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
          console.log('OnPaymentComplete');
          console.log('data', data),
          console.log('actions', actions);
        },
        onCancel: (data, actions) => {
          console.log('OnCancel');
        },
        onError: (err) => {
          console.log('OnError', err);
        },
        transactions: [{
          amount: {
            currency: 'EUR',
            total: 9
          }
        }]
      });
    }

    savePayment(){
      let payment = {
        date: new Date(),
        amount: 9,
        company: this.user
      }
    }

}
