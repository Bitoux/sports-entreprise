import { Injectable } from '@angular/core';
import {AuthConfig, AuthHttp} from 'angular2-jwt';
import {Http} from '@angular/http';
import 'rxjs/add/operator/finally';
import {LocalStorageService} from 'ngx-webstorage';

let storage = new LocalStorageService();

export function authHttpServiceFactory(http) {
  return new AuthHttp(new AuthConfig({
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.retrieve('id_token'))
  }), http);
}

@Injectable()
export class HttpService {

  baseUrl: string = 'http://localhost:8000';

  constructor(
    public http: Http,
    public authHttp: AuthHttp
  ) { }

  get(url) {
    return this.authHttp.get(this.baseUrl + url)
      .map(resp => resp.json())
      .finally(() => {
        console.log('get done!')
      });
  }

  postLogin(url, body, options) {
    return this.http.post(this.baseUrl + url, body, options)
      .map(resp => resp.json())
      .finally(() => {
        console.log('post log done!')
      });
  }

  post(url, body) {
    return this.authHttp.post(this.baseUrl + url, body)
      .map(resp => resp.json())
      .finally(() => {
        console.log('post done!')
      });
  }

  uploadSpeEventPicture(file){
    let options = {
      url: "http://localhost:8000/api/speevent/upload",
      headers: { "Authorization": "Bearer " + storage.retrieve('id_token'), "Accept" : "application/json" },
      params: { "param1": "val1", "param2": "val2" }
    };
  }
}
