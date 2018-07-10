import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {LocalStorageService} from 'ngx-webstorage';
import { HttpService } from '../../shared/provider/http.service';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {
  user: any;
  proEvent: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private storage: LocalStorageService
  ) { }

  ngOnInit() {
    this.initTest();

    this.paymentCheck();

    this.getEvent();
    
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

  paymentCheck(){
    if(this.user.company.payments.length === 0){
      this.router.navigate(['/payment']);
    }else{
      let last_pay = this.user.company.payments[this.user.company.payments.length -1].date;
      last_pay = new Date(last_pay);
      last_pay.setMonth(last_pay.getMonth() + 1);
      let today = new Date();
      if(last_pay <= today){
        this.router.navigate(['/payment']);
      }
    }
  }

  getEvent(){
    let id = this.route.snapshot.paramMap.get('id');
    this.httpService.get('/api/proevents/' + id + '/single')
    .subscribe(data => {
      this.proEvent = data;
      if(this.proEvent !== 'KO'){
        this.checkProEvent();
      }else{
        this.router.navigate(['/dashboard/events']);
      }
    });
  }

  checkProEvent(){
    if(this.proEvent.company.id !== this.user.company.id){
      this.router.navigate(['/dashboard/events']);
    }
  }

  //TODO EDIT 

}
