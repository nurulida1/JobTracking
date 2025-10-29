import { Injectable } from '@angular/core';
import {
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  UserDto,
} from '../models/UserModel';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Observable, retry, catchError, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  GridifyQueryExtend,
  PagingContent,
  BaseResponse,
} from '../shared/helpers/helpers';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = environment.ApiBaseUrl + '/Users';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

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

  Login(request: LoginRequest): Observable<UserDto> {
    return this.http
      .post<UserDto>(`${this.url}/Login`, request) // no { Data: ... }
      .pipe(retry(1), catchError(this.handleError('Login')));
  }

  Register(request: RegisterRequest): Observable<UserDto> {
    return this.http
      .post<UserDto>(`${this.url}/Register`, request) // no { Data: ... }
      .pipe(retry(1), catchError(this.handleError('Register')));
  }

  ChangePassword(request: ChangePasswordRequest): Observable<UserDto> {
    return this.http
      .post<UserDto>(`${this.url}/change-password`, request) // no { Data: ... }
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
