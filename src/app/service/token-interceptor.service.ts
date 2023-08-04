import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let token = this.authService.getAuthToken();

    if (token !== null) {
      req = req.clone({
        setHeaders: {
          Authorization: "Bearer " + token
        }
      }); 
    } else {
      req = req.clone({
        setHeaders: {}
      }); 
    }
    
    return next.handle(req);
  }
}
