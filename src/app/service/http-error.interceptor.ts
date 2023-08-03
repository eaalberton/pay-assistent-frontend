import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private _snackBar: MatSnackBar,
    private router: Router
    ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {

        let errorMsg = '';

        if (err.error.message != undefined) {
          errorMsg = `Error: ${err.error.message}`;
        } else {
          if (err.error instanceof ErrorEvent) {
            errorMsg = `Error: ${err.error.message}`;
          } else if (Array.isArray(err.error) && err.error.length) {
            errorMsg = `Error: ${err.error[0]}`;
          } else if (err.error.errors) {
            errorMsg = `Error: ${err.error.errors}`;
          } else {
            errorMsg = `Error Code: ${err.status}, Message: ${err.message}`;
          }
        }  

        if (err.status === 401) {
          this.router.navigate(['/auth']);
        }

        this.openSnackBar(errorMsg, 'Close');
        return throwError(() => err);
      })
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 20000 });
  }
}
