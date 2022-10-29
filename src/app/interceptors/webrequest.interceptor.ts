import { AuthService } from './../Services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError, tap, switchMap, empty, EMPTY, Subject } from 'rxjs';

@Injectable()
export class WebrequestInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  refreshingAccessToken: boolean = false;

  /**
   * "The intercept function takes a request and a next handler, and returns an observable of type
   * HttpEvent."
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //handle request
    let requestMod: HttpRequest<any> = this.addAuthHeader(request)
    // call next()
    return next.handle(requestMod).pipe(

      catchError((err: any) => {
        // console.log(err);
        if (err.status === 401 && !this.refreshingAccessToken) {
          // 401 means Unauthorized
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              requestMod = this.addAuthHeader(requestMod);
              return next.handle(requestMod);
            }),
            catchError((err) => {
              console.log(err);
              this.authService.logOut();
              return EMPTY;
            })
          )
        }

        /* Throwing an error. */
        return throwError(() => err);
      }

      )
    );
  }

  addAuthHeader(request: HttpRequest<any>) {
    //get the access token and append the access token to request header
    const accessToken = this.authService.getAccessToken();
    if (accessToken) {
      return request.clone({
        //setHeaders is used inorder to append it to the already existing header
        setHeaders: {
          'x-access-token': accessToken
        }
        // or we can use headers.set() method
        // headers: request.headers.set('x-access-token', accessToken)
      })
    }
    return request;
  }

  refreshAccessToken() {
    this.refreshingAccessToken = true;
    //call a method in auth-service to send a req to refresh access-token
    return this.authService.getNewAccessToken().pipe(
      tap(() => {
        this.refreshingAccessToken = false;
        this.authService.accessTokenRefreshedSubject.next('SubjectAlert');
        console.log(`Access token refreshed`);
      })
    );
    
  }


}
