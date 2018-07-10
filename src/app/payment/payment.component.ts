import { Component, OnInit } from '@angular/core';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {LocalStorageService} from 'ngx-webstorage';
import { HttpService } from '../shared/provider/http.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  user: any;
  public payPalConfig?: PayPalConfig;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: LocalStorageService,
    private httpService: HttpService,
  ) { }

  ngOnInit() {
    this.initTest();
    this.initConfig();
  }

  initTest(){
    let paramID = this.route.snapshot.paramMap.get('id');
    this.user = this.storage.retrieve('user');
    console.log('user', this.user);
    if(this.user){
      if( paramID == this.user.id ){
        console.log('ok');
      }else{
        console.log('not ok');
        this.router.navigate(['/']);
      }
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

    savePayment(data){
      let payment = {
        date: new Date(),
        amount: 9,
        company: this.user.company.id,
        order_id: data.orderID,
        payer_id: data.payerID,
        payment_id: data.paymentID,
        payment_token: data.paymentToken,
        return_url: data.returnUrl
      }
      console.log(payment);
      this.httpService.post('/api/payments/add', payment)
      .subscribe(data => {
        console.log(data);
        this.user = data;
        this.storage.clear('user');
        this.storage.store('user', this.user);
      });
    }

    redirectToDashboard(){
      this.router.navigate(['/events']);
    }


}
