import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {LocalStorageService} from 'ngx-webstorage';
import { HttpService } from '../../shared/provider/http.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {
  user: any;
  file: any;
  changedFile: boolean;
  countries: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private storage: LocalStorageService
  ) { }

  ngOnInit() {
    this.changedFile = false;
    this.user = {};
    this.countries = [
      'France',
      'United Kingdom',
      'Germany',
      'Spain',
      'United states'
    ];

    this.initTest();
    this.paymentCheck();
    console.log(this.user);
    //this.getUser();
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

  getUser(){
    let username = this.user.username;
    this.httpService.get('/api/users/' + username + '/get')
    .subscribe(data => {
      this.user = data;
      console.log(this.user);
    });
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
    this.changedFile = true;
    console.log(this.file);
  }

  updateAccount(){
    console.log(this.user);
    let user = {
      id: this.user.id,
      username: this.user.username,
      email: this.user.email,
      address: this.user.adress,
      city: this.user.city,
      country: this.user.country,
      picture: this.user.picture
    }
    if(this.changedFile){
      user.picture = this.file;
    }

    let fd = new FormData();

    fd.append('id', user.id);
    fd.append('username', user.username);
    fd.append('email', user.email);
    fd.append('address', user.address);
    fd.append('city', user.city);
    fd.append('country', user.country);
    fd.append('picture', user.picture);
    fd.append('changed', this.changedFile.toString());

    this.httpService.post('/api/user/company/edit', fd)
    .subscribe(data => {
      this.user = data;
      this.storage.clear('user');
      this.storage.store('user', this.user);
    });
    
  }

}
