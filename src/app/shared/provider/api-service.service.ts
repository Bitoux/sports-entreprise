import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'
 
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  baseURL = "http://52.ip-193-70-3.eu/app_dev.php";

  constructor(private httpClient: HttpClient) { }
  
}
