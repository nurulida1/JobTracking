import { Injectable } from '@angular/core';
import {
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UserDto,
} from '../models/UserModel';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import {
  Observable,
  retry,
  catchError,
  of,
  throwError,
  BehaviorSubject,
  tap,
} from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  GridifyQueryExtend,
  PagingContent,
  BaseResponse,
} from '../shared/helpers/helpers';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = environment.ApiBaseUrl + '/Users';
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router
  ) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  get currentUser(): UserDto | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: UserDto | null): void {
    this.currentUserSubject.next(user);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  GetMany(query: GridifyQueryExtend): Observable<PagingContent<UserDto>> {
    let params = new HttpParams()
      .set('page', query.Page.toString())
      .set('page_size', query.PageSize.toString());

    if (query.Select) {
      params = params.set('Select', query.Select);
    }
    if (query.OrderBy) {
      params = params.set('OrderBy', query.OrderBy);
    }
    if (query.Filter) {
      params = params.set('Filter', query.Filter);
    }

    return this.http
      .get<PagingContent<UserDto>>(this.url + '/GetMany', {
        params,
      })
      .pipe(retry(1), catchError(this.handleError('GetMany')));
  }

  GetOne(query: GridifyQueryExtend): Observable<UserDto | null> {
    let params = new HttpParams()
      .set('Page', query.Page.toString())
      .set('PageSize', query.PageSize.toString());

    if (query.Select) {
      params = params.set('Select', query.Select);
    }
    if (query.OrderBy) {
      params = params.set('OrderBy', query.OrderBy);
    }
    if (query.Filter) {
      params = params.set('Filter', query.Filter);
    }

    return this.http.get<UserDto>(this.url + '/GetOne', { params }).pipe(
      retry(1),
      catchError((error) => {
        if (error.status === 404) {
          // Return null gracefully when not found
          return of(null);
        } else {
          // Handle all other errors
          return this.handleError('GetOne')(error);
        }
      })
    );
  }

  GetProfile(): Observable<UserDto> {
    return this.http
      .get<UserDto>(`${this.url}/Profile`) // no { Data: ... }
      .pipe(retry(1), catchError(this.handleError('GetProfile')));
  }

  Login(request: LoginRequest): Observable<{
    success: boolean;
    token: string;
    user: UserDto;
    message?: string;
  }> {
    return this.http
      .post<{
        success: boolean;
        token: string;
        user: UserDto;
        message?: string;
      }>(`${this.url}/Login`, request)
      .pipe(
        retry(1),
        tap((res) => {
          if (res.success && res.user) {
            this.setCurrentUser(res.user);
          }
        }),
        catchError(this.handleError('Login'))
      );
  }

  Register(
    request: RegisterRequest
  ): Observable<{ success: boolean; user: UserDto; message?: string }> {
    return this.http
      .post<{ success: boolean; user: UserDto; message?: string }>(
        `${this.url}/Register`,
        request
      ) // no { Data: ... }
      .pipe(retry(1), catchError(this.handleError('Register')));
  }

  ResetPasswordLink(email: string): Observable<BaseResponse> {
    const params = new HttpParams().set('Email', email); // Match [FromQuery] Email (case-sensitive)

    return this.http
      .post<BaseResponse>(`${this.url}/ForgotPassword`, {}, { params }) // empty body, params in options
      .pipe(retry(1), catchError(this.handleError('ResetPasswordLink')));
  }

  ResetPassword(request: ResetPasswordRequest): Observable<BaseResponse> {
    return this.http
      .post<BaseResponse>(`${this.url}/ResetPassword`, request) // no { Data: ... }
      .pipe(retry(1), catchError(this.handleError('ResetPassword')));
  }

  ChangePassword(request: ChangePasswordRequest): Observable<BaseResponse> {
    return this.http
      .post<BaseResponse>(`${this.url}/ChangePassword`, request) // no { Data: ... }
      .pipe(retry(1), catchError(this.handleError('ChangePassword')));
  }

  Enable(id: number): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', id);
    return this.http
      .put<BaseResponse>(`${this.url}/enable`, params)
      .pipe(retry(1), catchError(this.handleError('Enable')));
  }

  Disable(id: number): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', id);
    return this.http
      .put<BaseResponse>(`${this.url}/disable`, params)
      .pipe(retry(1), catchError(this.handleError('Disable')));
  }

  logout(): void {
    this.setCurrentUser(null);
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/']);
  }

  private handleError = (context: string) => (error: any) => {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail:
        error?.error?.detail || error?.message || 'Unexpected error occurred.',
    });
    return throwError(() => error);
  };
}
