import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import * as Constants from '../shared/constants';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  countries: any;
  company: any;
  registrationGroup: FormGroup;

  constructor(private http: Http) { }

  ngOnInit() {
    this.countries = [
      'France',
      'United Kingdom',
      'Germany',
      'Spain',
      'United states'
    ];
    this.company = {};

  }


  submitRegistration(){
    console.log(this.company);
    this.register();
  }

  register(){
    let user = {
      username : this.company.name,
      email : this.company.email,
      password : this.company.password,
      adress : this.company.address,
      city : this.company.city,
      country: this.company.country
    };
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url = Constants.API_ENDPOINT + '/api/users/create/company';
    this.http.post(url, user, options)
    .subscribe(data => {
      console.log(data);
    });
  }

}
