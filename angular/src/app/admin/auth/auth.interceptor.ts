import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { API_BASE } from '../../core/config/api.config';
import { AuthService } from './auth.service';

/**
 * Attaches the JWT bearer token to admin API calls and logs the user out on 401.
 * The login endpoint and public GETs are left untouched.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  const isApiCall = req.url.startsWith(API_BASE);
  const isLogin = req.url.startsWith(`${API_BASE}/auth/login`);

  const request =
    token && isApiCall && !isLogin
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && isApiCall && !isLogin) {
        auth.logout();
      }
      return throwError(() => error);
    }),
  );
};
