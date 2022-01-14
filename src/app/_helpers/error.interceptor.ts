import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { IfStmt } from '@angular/compiler';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) {}
    error;
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.accountService.logout();
            }
            console.log(err);
            if(err.url.includes('register')){
                this.error=err.error.errors.message;
            }
            else{
                this.error = err.error.message || err.statusText;
            }
            return throwError(this.error);
        }))
    }
}