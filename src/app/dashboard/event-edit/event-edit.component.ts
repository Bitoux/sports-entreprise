import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {LocalStorageService} from 'ngx-webstorage';
import { HttpService } from '../../shared/provider/http.service';

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
  
  // FILE
  file: any;
  changedFile: boolean;
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private zone: NgZone,
    private storage: LocalStorageService
  ) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
   }

  ngOnInit() {
    this.event = {};
    this.changedFile = false;

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
    this.httpService.get('/api/proevents/' + id + '/single')
    .subscribe(data => {
      this.event = data;
      if(this.event !== 'KO'){
        this.checkProEvent();
        this.autocomplete.query = this.event.address;
        this.loadMap();
      }else{
        this.router.navigate(['/dashboard/events']);
      }
    });
  }

  checkProEvent(){
    if(this.event.company.id !== this.user.company.id){
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

  handleFileInput(files: FileList) {
    this.file = files.item(0);
    this.changedFile = true;
    console.log(this.file);
  }

  saveEvent(){
    let event = {
      id: this.event.id,
      name: this.event.name,
      description: this.event.description,
      address: this.autocomplete.query,
      lat: this.lat,
      lng: this.lng,
      date: this.event.date,
      hour: this.event.time,
      img: this.event.picture,
      company: this.user.company.id
    };
    if(this.changedFile){
      event.img = this.file
    }
    console.log(event);

    let fd = new FormData();

    fd.append('id', event.id)
    fd.append('name', event.name);
    fd.append('description', event.description);
    fd.append('address', event.address);
    fd.append('lat', event.lat);
    fd.append('lng', event.lng);
    fd.append('date', event.date);
    fd.append('hour', event.hour);
    fd.append('img', event.img);
    fd.append('company', event.company);
    fd.append('changed', this.changedFile.toString());

    this.httpService.post('/api/proevents/edit', fd)
    .subscribe(data => {
      console.log(data);
      this.user = data;
      this.storage.clear('user');
      this.storage.store('user', this.user);
    });
  }

  loadMap(){
    let latLng = new google.maps.LatLng(this.event.latitude, this.event.longitude);
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

}
