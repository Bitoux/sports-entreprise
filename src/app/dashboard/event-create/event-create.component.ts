import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {LocalStorageService} from 'ngx-webstorage';
import { HttpService } from '../../shared/provider/http.service';


declare var google;

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {

  // GOOGLE
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

  // PAGE
  user: any;
  event: any;
  
  // FILE
  file: any;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: LocalStorageService,
    private zone: NgZone,
    private httpService: HttpService
  ) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
   }

  ngOnInit() {
    this.event = {};

    this.initTest();
    this.paymentCheck();
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
      this.router.navigate(['/payment', { id: this.user.id }]);
    }else{
      let last_pay = this.user.company.payments[this.user.company.payments.length -1].date;
      last_pay = new Date(last_pay);
      last_pay.setMonth(last_pay.getMonth() + 1);
      let today = new Date();
      if(last_pay <= today){
        this.router.navigate(['/payment', { id: this.user.id }]);
      }
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
          let latLng = new google.maps.LatLng(me.lat, me.lng);
          me.loadMap(latLng);
        }
      }
    });
  }

  saveEvent(){
    let event = {
      name: this.event.name,
      description: this.event.description,
      address: this.autocomplete.query,
      lat: this.lat,
      lng: this.lng,
      date: this.event.date,
      hour: this.event.time,
      img: this.file,
      company: this.user.company.id
    };
    let fd = new FormData();
    fd.append('name', event.name);
    fd.append('description', event.description);
    fd.append('address', event.address);
    fd.append('lat', event.lat);
    fd.append('lng', event.lng);
    fd.append('date', event.date);
    fd.append('hour', event.hour);
    fd.append('img', event.img);
    fd.append('company', event.company);

    
    console.log(event);
    this.httpService.post('/api/proevents/create', fd)
    .subscribe(data => {
      console.log(data);
      this.user = data;
      this.storage.clear('user');
      this.storage.store('user', this.user);
    });
    
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
    console.log(this.file);
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
    let content = this.event.name;
    this.addInfoWindow(this.marker, content);
  }

  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({ content: content });
    google.maps.event.addListener(marker, 'click', () => { infoWindow.open(this.mapGoogle, marker); });
  }


}
