import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {LocalStorageService} from 'ngx-webstorage';
import { HttpService } from '../../shared/provider/http.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-special-events',
  templateUrl: './special-events.component.html',
  styleUrls: ['./special-events.component.css']
})
export class SpecialEventsComponent implements OnInit {
  user: any;
  events: any;
  modalRef: BsModalRef;
  eventToDelete: any;

  constructor(
    private router: Router,
    private storage: LocalStorageService,
    private httpService: HttpService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.initTest();

    this.paymentCheck();

    this.getSpecialEvent();
    
  }

  openModal(template, event) {
    this.modalRef = this.modalService.show(template);
    this.eventToDelete = event;
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



  getSpecialEvent(){
    console.log(this.user.company.id);
    this.httpService.get('/api/company/' + this.user.company.id + '/proevents')
    .subscribe(data => {
      this.events = data;
    });
  }

  goCreateEvent(){
    console.log('create event');
    this.router.navigate(['/dashboard/create/events'])
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

  deleteEvent(){
    console.log(this.eventToDelete.id);
    this.httpService.delete('/api/proevents/' + this.eventToDelete.id + '/delete')
    .subscribe(data => {
      console.log(data);
      this.closeModal();
    });
  }

  editEvent(event){
    this.router.navigate(['/dashboard/events/' + event.id]);
  }

}
