import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {LocalStorageService} from 'ngx-webstorage';
import { HttpService } from '../../shared/provider/http.service';


declare var google;

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {
  user: any;
  service = new google.maps.places.AutocompleteService();
  geocoder = new google.maps.Geocoder();
  autocompleteItems;
  autocomplete;
  showAddressList: boolean = false;
  event: any;
  lat: string;
  lng: string;
  file: any;
  options: any;
  
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
    this.initTest();
    this.paymentCheck();
    this.event = {};
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
    });
    
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
    console.log(this.file);
  }

  /*uploadPicture(){
    this.file = this.event.img // Array of file objects
    this.options = {
      url: "http://localhost:8000/api/speevent/upload",
      headers: { "Authorization": "Bearer asd", "Accept" : "something" },
      params: { "param1": "val1", "param2": "val2" }
    };
    this.uploader.setOptions(this.options); // Global options applied for each upload
    this.uploader.addFiles(this.file);
    this.uploader.uploadAll();
  }*/

}
