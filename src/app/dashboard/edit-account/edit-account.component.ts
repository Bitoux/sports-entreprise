import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {LocalStorageService} from 'ngx-webstorage';
import { HttpService } from '../../shared/provider/http.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

declare var google;

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {
  
  // GOOGLE MAP
  @ViewChild('mapGoogle') mapElement: ElementRef;
  lat: string;
  lng: string;
  mapGoogle: any;
  marker: any;

  // PAGE
  user: any;
  countries: any;
  modalRef: BsModalRef;
  errorRegister: boolean;
  
  // FILE
  file: any;
  pinMap: any;
  changedFile: boolean;
  changedPin: boolean;
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private storage: LocalStorageService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.changedFile = false;
    this.changedPin = false;
    this.user = {};
    this.errorRegister = false;
    this.countries = [
      'France',
      'United Kingdom',
      'Germany',
      'Spain',
      'United states'
    ];

    this.initTest();
    this.paymentCheck();
    console.log(this.user);
    this.lat = '48.866667';
    this.lng = '2.333333';
    if(this.user.pin_map){
      this.loadMap('http://52.ip-193-70-3.eu/app_dev.php/uploads/company/'+this.user.pin_map);
    }else{
      console.log('No pic');
    }
    
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

  getUser(){
    let username = this.user.username;
    this.spinner.show();
    this.httpService.get('/api/users/' + username + '/get')
    .subscribe(data => {
      this.user = data;
      console.log(this.user);
      this.spinner.hide();
    });
  }

  handleFileInput(files: FileList, string) {
    if(string == 'picture'){
      this.file = files.item(0);
      this.changedFile = true;
    }else{
      console.log(files.item(0));
      this.pinMap = files.item(0);
      this.changedPin = true;
      //this.loadMap('aze');
    }
    
    console.log(this.file);
    console.log(this.pinMap);
  }

  updateAccount(template){
    let user = {
      id: this.user.id,
      username: this.user.username,
      email: this.user.email,
      address: this.user.adress,
      city: this.user.city,
      country: this.user.country,
      picture: this.user.picture,
      pinMap: this.user.pin_map
    }
    console.log(user);
    if(this.changedFile){
      user.picture = this.file;
    }
    if(this.changedPin){
      user.pinMap = this.pinMap;
    }

    console.log('changed', this.changedFile);
    console.log('pin', this.changedPin);

    let fd = new FormData();

    fd.append('id', user.id);
    fd.append('username', user.username);
    fd.append('email', user.email);
    fd.append('address', user.address);
    fd.append('city', user.city);
    fd.append('country', user.country);
    fd.append('picture', user.picture);
    fd.append('changed', this.changedFile.toString());
    fd.append('pinMap', user.pinMap);
    fd.append('changedPin', this.changedPin.toString());
    this.spinner.show();

    this.httpService.post('/api/user/company/edit', fd)
    .subscribe(data => {
      this.user = data;
      this.storage.clear('user');
      this.storage.store('user', this.user);
      this.openModal(template);
      this.spinner.hide();
      if(this.changedPin){
        this.deleteMarker();
        let latLng = new google.maps.LatLng(this.lat, this.lng);
        this.addMarker(latLng, 'http://52.ip-193-70-3.eu/app_dev.php/uploads/company/'+this.user.pin_map);
      }
    }, error => {
      this.errorRegister = true;
      this.spinner.hide();
    });
    
  }

  openModal(template) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

  goDashboard(){
    this.closeModal();
    this.router.navigate(['/dashboard/events']);
  }

  loadMap(image){
    let latLng = new google.maps.LatLng(this.lat, this.lng);
    let mapOptions = {
      center: latLng,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.mapGoogle = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker(latLng, image);
  }

  addMarker(latLng, img){
    console.log(img);
    this.marker = new google.maps.Marker({
      map: this.mapGoogle,
      animation: google.maps.Animation.DROP,
      position: latLng,
      icon : {
        url: img, origin: new google.maps.Point(0, 0), anchor: new google.maps.Point(5, 0), scaledSize: new google.maps.Size(25, 25)
      }
    });
    let content = 'Pin Example';
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
