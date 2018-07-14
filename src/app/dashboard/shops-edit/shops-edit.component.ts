import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {LocalStorageService} from 'ngx-webstorage';
import { HttpService } from '../../shared/provider/http.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

declare var google;

@Component({
  selector: 'app-shops-edit',
  templateUrl: './shops-edit.component.html',
  styleUrls: ['./shops-edit.component.css']
})
export class ShopsEditComponent implements OnInit {

  // GOOGLE
  @ViewChild('mapGoogle') mapElement: ElementRef;
  service = new google.maps.places.AutocompleteService();
  geocoder = new google.maps.Geocoder();
  autocompleteItems;
  autocomplete;
  showAddressList: boolean = false;
  lat: string;
  lng: string;loui
  mapGoogle: any;
  marker: any;

  // PAGE
  user: any;
  spot: any;
  modalRef: BsModalRef;
  errorRegister: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private zone: NgZone,
    private storage: LocalStorageService,
    private modalService: BsModalService
  ) { 
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
   }

  ngOnInit() {
    this.spot = {};
    this.errorRegister = true;

    this.initTest();
    this.paymentCheck();
    this.getSpot();
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

  getSpot(){
    let id = this.route.snapshot.paramMap.get('id');
    this.httpService.get('/api/shops/' + id + '/get')
    .subscribe(data => {
      this.spot = data;
      console.log(this.spot);
      if(this.spot !== 'KO'){
        this.checkSpot();
        this.autocomplete.query = this.spot.address;
        let latLng = new google.maps.LatLng(this.spot.latitude, this.spot.longitude);
        this.loadMap(latLng);
      }else{
        this.router.navigate(['/dashboard/spots']);
      }
    });
  }

  checkSpot(){

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
          let latLng = new google.maps.LatLng(me.lat, me.lng);
          me.loadMap(latLng);
        }
      }
    });
  }

  loadMap(latLng){
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
    let content = this.spot.name;
    this.addInfoWindow(this.marker, content);
  }

  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({ content: content });
    google.maps.event.addListener(marker, 'click', () => { infoWindow.open(this.mapGoogle, marker); });
  }

  saveSpot(template){
    let spot = {
      lng: this.lng,
      lat: this.lat,
      address: this.autocomplete.query,
      name: this.spot.name,
      description: this.spot.description,
      id: this.spot.id
    };
    console.log(spot);
    this.httpService.post('/api/spot/pro/edit', spot)
    .subscribe(data => {
      this.openModal(template);
    }, error => {
      this.errorRegister = true;
    });
  }

  openModal(template) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

  goShops(){
    this.closeModal();
    this.router.navigate(['/dashboard/shops']);
  }

}
