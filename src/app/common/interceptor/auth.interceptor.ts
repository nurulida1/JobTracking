import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export function AuthInterceptorFn(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  // const authService = inject();

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 403 Forbidden (Token expired or invalid)
      if (error.status === 403) {
        // Clear the token
        // authService.logout();

        // Redirect to homepage
        router.navigate(['/']);

        // Return the error to be handled by other interceptors if needed
        return throwError(() => error);
      }

      // For other errors, just pass them through
      return throwError(() => error);
    })
  );
}
