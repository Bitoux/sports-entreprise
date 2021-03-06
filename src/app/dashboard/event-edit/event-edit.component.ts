import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {LocalStorageService} from 'ngx-webstorage';
import { HttpService } from '../../shared/provider/http.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

declare var google;

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {

  //GOOGLE
  @ViewChild('mapGoogle') mapElement: ElementRef;
  service = new google.maps.places.AutocompleteService();
  geocoder = new google.maps.Geocoder();
  autocompleteItems;
  autocomplete;
  showAddressList: boolean = false;
  lat: string;
  lng: string;
  mapGoogle: any;
  marker: any;

  //PAGE
  user: any;
  event: any;
  modalRef: BsModalRef;
  errorRegister: boolean;
  filters: any;
  checkedFilters: any;
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private zone: NgZone,
    private storage: LocalStorageService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService
  ) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
   }

  ngOnInit() {
    this.event = {};
    this.errorRegister = false;
    this.checkedFilters = {};

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
    this.spinner.show();
    this.httpService.get('/api/events/' + id + '/get')
    .subscribe(data => {
      console.log(data);
      this.spinner.hide();
      this.event = data;
      if(this.event !== 'KO'){
        this.checkProEvent();
        this.event.name = this.event.spot.name;
        this.autocomplete.query = this.event.spot.address;
        this.lat = this.event.spot.latitude;
        this.lng = this.event.spot.longitude;
        this.loadMap();
        this.getFilters();
      }else{
        this.router.navigate(['/dashboard/events']);
      }
    }, erro => {
      this.spinner.hide();
    });
  }

  getFilters(){
    this.spinner.show();
    this.httpService.get('/api/filters')
    .subscribe(data => {
      this.filters = data;
      this.spinner.hide();
      this.event.filters.forEach(data => {
        this.checkedFilters[data.id - 1 ] = true;
      })
    }, error => {
      this.spinner.hide();
    });
  }

  checkProEvent(){
    if(this.event.owner.id !== this.user.id){
      this.router.navigate(['/dashboard/events']);
    }
  }

  updateSearch() {
    console.log('In update');
    this.showAddressList = true;
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: {country: 'FR'} }, function (predictions, status) {
      me.autocompleteItems = [];
      if(predictions){
        me.zone.run(function () {
          predictions.forEach(function (prediction) {
            me.autocompleteItems.push(prediction);
          });
        });
      }
    });
  }

  chooseItem(item: any) {
    this.showAddressList = false;
    let me = this;
    console.log(item);
    this.geocoder.geocode({'placeId': item.place_id}, function(results, status) {
      if(status == 'OK'){
        if(results[0]){
          me.autocomplete.query = results[0].formatted_address;
          me.lat = results[0].geometry.location.lat();
          me.lng = results[0].geometry.location.lng();
          me.deleteMarker();
          let latLng = new google.maps.LatLng(me.lat, me.lng);
          me.addMarker(latLng);
          me.mapGoogle.setCenter(latLng);
        }
      }
    });
  }


  saveEvent(template){
    this.spinner.show();
    let event = {
      id: this.event.id,
      spotID: this.event.spot.id,
      name: this.event.name,
      description: this.event.description,
      address: this.autocomplete.query,
      latitude: this.lat,
      longitude: this.lng,
      date: this.event.date,
      hour: this.event.hour,
      filters: this.checkedFilters,
      price: this.event.price,
      nb_user: this.event.nb_user,
      level: this.event.level,
      time: this.event.time
    };

    console.log(event);

    this.httpService.post('/api/proevents/edit', event)
    .subscribe(data => {
      this.spinner.hide();
      console.log(data);
      /*this.user = data;
      this.storage.clear('user');
      this.storage.store('user', this.user);*/
      this.openModal(template)
    }, error => {
      this.errorRegister = true;
      this.spinner.hide();
    });
  }

  loadMap(){
    let latLng = new google.maps.LatLng(this.lat, this.lng);
    let mapOptions = {
      center: latLng,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.mapGoogle = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker(latLng);
  }

  addMarker(latLng){
    this.marker = new google.maps.Marker({
      map: this.mapGoogle,
      animation: google.maps.Animation.DROP,
      position: latLng
    });
    let content = this.event.name;
    this.addInfoWindow(this.marker, content);
  }

  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({ content: content });
    google.maps.event.addListener(marker, 'click', () => { infoWindow.open(this.mapGoogle, marker); });
  }

  deleteMarker(){
    this.marker.setMap(null);
  }

  openModal(template) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

  goEvents(){
    this.closeModal();
    this.router.navigate(['/dashboard/events']);
  }

}
