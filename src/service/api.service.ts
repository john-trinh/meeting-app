import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { catchError } from 'rxjs/operators';

@Injectable()
export class ApiService {
  private url = 'http://10.0.0.61:3000/api';
  urlLocal = './assets/data';
  headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  constructor(private http: HttpClient) { }

  post(path: string, body: Object = {}) {
    return this.http.post(this.url + path, JSON.stringify(body), { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  get(path: string, params: HttpParams = new HttpParams()) {
    return this.http.get(this.url + path, { params }).pipe(catchError(this.handleError));
  }

  getLocal(path: string, params: HttpParams = new HttpParams()) {
    return this.http.get(this.urlLocal + path, { params }).pipe(catchError(this.handleError));
  }

  handleError(error) {
    return (error || 'Call Api failed');
  }
}