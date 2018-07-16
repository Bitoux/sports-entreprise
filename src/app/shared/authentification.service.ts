import { Injectable } from '@angular/core';
import {Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {JwtHelper} from 'angular2-jwt';
import 'rxjs/add/operator/map';
import {HttpService} from "./provider/http.service";
import {LocalStorageService} from 'ngx-webstorage';

@Injectable()
export class AuthentificationService {
  jwtHelper = new JwtHelper();
  user: any;

  constructor(
    private storage: LocalStorageService,
    private httpService: HttpService
  ) { }

  authenticate(user: any) {
    console.log('begin auth', user);
    return new Promise((resolve, reject) => {
      let url = '/login_check';
      let body = new URLSearchParams();
      body.append('_username', user.username);
      body.append('_password', user.password);
      let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
      let options = new RequestOptions({headers: headers});

      this.httpService.postLogin(url, body.toString(), options)
        .map((data) => data)
        .subscribe(
        data => {
          console.log(data);
          this.storage.store('id_token', data.token);
          this.user = this.jwtHelper.decodeToken(data.token).username;
          resolve(this.user)
        }, err => { return false; }
      );
    });
  }

  logout() {
    this.storage.clear('id_token');
    this.storage.clear('user');
  }

  hasAuthToken() {
    return this.storage.retrieve('id_token');
  }
}
