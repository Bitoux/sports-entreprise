import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import * as Constants from '../shared/constants';
import {map} from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  //PAGE
  countries: any;
  company: any;
  registrationGroup: FormGroup;
  modalRef: BsModalRef;
  errorRegister: boolean;

  constructor(
    private http: Http,
    private modalService: BsModalService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.countries = [
      'France',
      'United Kingdom',
      'Germany',
      'Spain',
      'United states'
    ];
    this.company = {};
    this.errorRegister = false;

  }

  openModal(template) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

  goBackHome(){
    this.closeModal();
    this.router.navigate(['/']);
  }


  submitRegistration(template){
    console.log(this.company);
    this.register(template);
  }

  register(template){
    let user = {
      username : this.company.name,
      email : this.company.email,
      password : this.company.password,
      adress : this.company.address,
      city : this.company.city,
      country: this.company.country
    };
    this.spinner.show();
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url = Constants.API_ENDPOINT + '/api/users/create/company';
    this.http.post(url, user, options)
    .subscribe(data => {
      this.openModal(template);
      this.spinner.hide();
    }, error => {
      this.errorRegister = true;
      this.spinner.hide();
    });
  }

}
