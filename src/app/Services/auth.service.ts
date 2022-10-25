import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs';
import { WebrequestService } from './webrequest.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webService: WebrequestService, private router: Router) { }

  //*----------------- SESSION METHODS START -----------------------------
  private setSession(userId: any, accessToken: any, refreshToken: any) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }

  getAccessToken() {
    return localStorage.getItem('access-token')
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('access-token', accessToken);
  }

  getRefreshToken() {
    return localStorage.getItem('refresh-token');
  }

  setRefreshToken(refreshToken: string) {
    localStorage.setItem('refresh-token', refreshToken);
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
  }


}
