import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {LocalStorageService} from 'ngx-webstorage';
import { HttpService } from '../../shared/provider/http.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

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
    private modalService: BsModalService,
    private spinner: NgxSpinnerService
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
    this.spinner.show();
    this.httpService.get('/api/proevents/' + this.user.id + '/user')
    .subscribe(data => {
      console.log(data);
      this.events = data;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  goCreateEvent(){
    console.log('create event');
    this.router.navigate(['/dashboard/events/create'])
  }

  paymentCheck(){
    if(this.user.company.payments.length === 0){
      this.router.navigate(['/dashboard/payment']);
    }else{
      let last_pay = this.user.company.payments[this.user.company.payments.length -1].date;
      last_pay = new Date(last_pay);
      last_pay.setMonth(last_pay.getMonth() + 1);
      let today = new Date();
      if(last_pay <= today){
        this.router.navigate(['/dashboard/payment']);
      }
    }
  }

  deleteEvent(){
    console.log(this.eventToDelete.id);
    this.spinner.show();
    this.httpService.delete('/api/events/' + this.eventToDelete.id + '/delete')
    .subscribe(data => {
      this.events = this.events.filter(el => el.id !== this.eventToDelete.id);
      this.spinner.hide();
      console.log(data);
      this.closeModal();
      this.router.navigate(['/dashboard/events/']);
    }, error => {
      this.spinner.hide();
    });
  }

  editEvent(event){
    this.router.navigate(['/dashboard/events/' + event.id]);
  }

}
