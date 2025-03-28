import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  const token = authService.getToken();


  const authReq = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    : req;


  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {

        authService.logout();
        router.navigate(['/login'], {
          queryParams: { sessionExpired: true }
        });
      }


      return throwError(() => error);
    })
  );
};
