import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Role, RoleRequest } from '../models/RoleModel';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseResponse } from '../shared/helpers/helpers';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  url = environment.ApiBaseUrl + '/Role';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  RequestRole(
    request: RoleRequest
  ): Observable<{ success: boolean; message?: string }> {
    return this.http
      .post<{ success: boolean; message?: string }>(
        `${this.url}/RequestRole`,
        request
      )
      .pipe(retry(1), catchError(this.handleError('RequestRole')));
  }

  PendingRequests(): Observable<Role[]> {
    return this.http
      .get<Role[]>(this.url + '/PendingRequests')
      .pipe(retry(1), catchError(this.handleError('PendingRequests')));
  }

  Approve(id: number): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', id);
    return this.http
      .put<BaseResponse>(`${this.url}/Approve`, params)
      .pipe(retry(1), catchError(this.handleError('Approve')));
  }

  Reject(id: number): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', id);
    return this.http
      .put<BaseResponse>(`${this.url}/Reject`, params)
      .pipe(retry(1), catchError(this.handleError('Reject')));
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
