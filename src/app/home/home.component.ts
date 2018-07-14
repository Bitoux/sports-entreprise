import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthentificationService } from '../shared/authentification.service';
import { HttpService } from '../shared/provider/http.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  modalRef: BsModalRef;
  user: any;
  errorCompany: boolean;
  gotUser: boolean;

  constructor(
    private modalService: BsModalService,
    private authentification: AuthentificationService,
    private httpService: HttpService,
    private router: Router,
    private storage: LocalStorageService
    ) { }

  ngOnInit() {
    this.errorCompany = false;
    this.user = this.storage.retrieve('user');
    console.log(this.user);
    if(this.user){
      this.gotUser = true;
    }else{
      this.gotUser = false;
      this.user = {};
    }
  }

  openModal(template) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

  submitLogin(){
    console.log(this.user);
    this.authentification.authenticate(this.user)
    .then(data => {
      console.log(data);
      let username = data;
      // TODO GET USER BY USERNAME VERIFY COMPANY THEN CONNECT
      this.httpService.get('/api/users/' + username + '/get')
      .subscribe( data => {
        console.log(data);
        this.user = data;
        if(this.user.company) {
          console.log('has company');
          this.closeModal();
          this.storage.store('user', this.user);
          this.redirectToDashBoard();
        }else {
          console.log('NO company');
          this.errorCompany = true;
        }
      });
    });
  }

  redirectToDashBoard(){
    this.router.navigate(['/dashboard/events']);
  }
  

}
