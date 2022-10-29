import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { shareReplay, Subject, tap } from 'rxjs';
import { WebrequestService } from './webrequest.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webService: WebrequestService, private router: Router, private webReqService: WebrequestService, private http: HttpClient) { }

  accessTokenRefreshedSubject: Subject<any> = new Subject<any>();

  //*----------------- SESSION METHODS START -----------------------------
  private setSession(userId: any, accessToken: any, refreshToken: any) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token')
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken);
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  setRefreshToken(refreshToken: string) {
    return localStorage.setItem('x-refresh-token', refreshToken);
  }

  getUserId() {
    return localStorage.getItem('user-id');
  }
  //*----------------- SESSION METHODS END -----------------------------

  logIn(email: string, password: string) {
    return this.webService.login(email, password)
      .pipe(
        shareReplay(),
        tap((res: HttpResponse<any>) => {
          // auth token will be in header
          this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
        })
      )
  }

  logOut() {
    this.removeSession();
    this.router.navigate(['/login']);
  }

  getNewAccessToken() {
    let refreshToken = this.getRefreshToken() || '';
    let userId = this.getUserId() || '';
    return this.http.get(`${this.webReqService.ROOT_URL}/user/me/access-token`, {
      headers: {
        'x-refresh-token': refreshToken,
        '_id': userId
      }, observe: 'response'
    }).pipe(
      tap((res) => {
        let resAccessToken = res.headers.get('x-access-token') || '';
        console.log(`New Access token : ${resAccessToken}`)
        this.setAccessToken(resAccessToken);
        console.log('LOGGED IN...!');
      })
    )
  }

  signUp(email: string, password: string) {
    return this.webService.signup(email, password)
      .pipe(
        shareReplay(),
        tap((res: HttpResponse<any>) => {
          // auth token will be in header
          // this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
          console.log('SIGNED UP SUCCESSFULLY...!');
          this.logOut();
        })
      )
  }
}
