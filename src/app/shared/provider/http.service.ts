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

  baseUrl: string = 'http://52.ip-193-70-3.eu/app_dev.php';

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

  delete(url) {
    return this.authHttp.delete(this.baseUrl + url)
      .map(resp => resp.json())
      .finally(() => {
        console.log('delete done!')
      });
  }

}
