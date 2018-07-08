import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: LocalStorageService
  ) { }

  ngOnInit() {
    this.initTest();

    this.paymentCheck();
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


  paymentCheck(){
    if(this.user.company.last_pay === null){
      this.router.navigate(['/payment']);
    }
  }

}
