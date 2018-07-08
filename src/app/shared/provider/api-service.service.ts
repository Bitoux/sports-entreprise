import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'
 
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  baseURL = "http://localhost:8000";

  constructor(private httpClient: HttpClient) { }
  
}
