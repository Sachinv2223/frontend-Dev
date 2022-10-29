import { Injectable, SkipSelf } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebrequestService {

  readonly ROOT_URL: any;

  constructor(private http: HttpClient) {
    this.ROOT_URL = environment.ROOT_URL;
  }

  get(uri: string) {
    return this.http.get(`${this.ROOT_URL}/${uri}`);
  }


  post(uri: string, payload: object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload);
  }

  patch(uri: string, payload: object) {
    return this.http.patch(`${this.ROOT_URL}/${uri}`, payload);
  }

  delete(uri: string) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
  }

  login(email: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/user/login`, {
      email,
      password
    }, /* Telling the httpClient to return the full response instead of just the body. */
      { observe: 'response' });
  }

  signup(email: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/user`, {
      email,
      password
    }, /* Telling the httpClient to return the full response instead of just the body. */
      { observe: 'response' });
  }

}
