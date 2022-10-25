import { AuthService } from './../Services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class WebrequestInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

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
        console.log(err);
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
        setHeaders: {
          'x-access-token': accessToken
        }
      })
    }
    return request;
  }


}
