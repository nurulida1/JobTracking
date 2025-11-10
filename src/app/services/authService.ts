import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { retry, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { UserService } from './userService.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private userService: UserService
  ) {}

  login(username: string, password: string) {
    return this.http
      .post<any>(`${environment.ApiBaseUrl}/auth/login`, { username, password })
      .pipe(
        retry(1),
        tap((res) => {
          if (res?.data?.token) {
            this.userService.setCurrentUser(res.data);
            localStorage.setItem('jwtToken', res.data.token);
          }
        }),
        catchError(this.handleError('Login'))
      );
  }

  private handleError = (context: string) => (error: any) => {
    this.messageService.add({
      severity: 'error',
      summary: `Error during ${context}`,
      detail:
        error?.error?.message || error?.message || 'Unexpected error occurred.',
    });
    return throwError(() => error);
  };
}
