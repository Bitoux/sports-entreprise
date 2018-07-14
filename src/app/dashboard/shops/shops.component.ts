import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {LocalStorageService} from 'ngx-webstorage';
import { HttpService } from '../../shared/provider/http.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.css']
})
export class ShopsComponent implements OnInit {
  user: any;
  spots: any;
  modalRef: BsModalRef;
  spotToDelete: any;

  constructor(
    private router: Router,
    private storage: LocalStorageService,
    private httpService: HttpService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.spots = [];

    this.initTest();
    this.paymentCheck();
    this.getUserShop();
  }

  goCreateSpot(){
    console.log('create spot');
    this.router.navigate(['dashboard/shops/create']);
  }

  openModal(template, event) {
    this.modalRef = this.modalService.show(template);
    this.spotToDelete = event;
  }

  closeModal() {
    this.modalRef.hide();
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

  deleteSpot(){
    console.log(this.spotToDelete.id);
    this.httpService.delete('/api/spots/' + this.spotToDelete.id + '/delete')
    .subscribe(data => {
      this.closeModal();
    });
  }

  editSpot(event){
    this.router.navigate(['/dashboard/shops/' + event.id]);
  }

  getUserShop(){
    console.log(this.user);
    this.httpService.get('/api/map/' + this.user.map.id + '/shops')
    .subscribe( data => {
      this.spots = data;
    });
  }

}
