import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { DashboardSummaryRole, Role, RoleRequest } from '../models/RoleModel';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  BaseResponse,
  GridifyQueryExtend,
  PagingContent,
} from '../shared/helpers/helpers';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  url = environment.ApiBaseUrl + '/Role';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  GetMany(query: GridifyQueryExtend): Observable<PagingContent<Role>> {
    let params = new HttpParams()
      .set('page', query.Page.toString())
      .set('pageSize', query.PageSize.toString());

    if (query.Select) {
      params = params.set('select', query.Select);
    }
    if (query.OrderBy) {
      params = params.set('orderBy', query.OrderBy);
    }
    if (query.Filter) {
      params = params.set('filter', query.Filter);
    }
    if (query.Includes) {
      params = params.set('includes', query.Includes);
    }

    return this.http
      .get<PagingContent<Role>>(this.url + '/GetMany', {
        params,
      })
      .pipe(retry(1), catchError(this.handleError('GetMany')));
  }

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

  DashboardSummary(): Observable<DashboardSummaryRole> {
    return this.http
      .get<DashboardSummaryRole>(this.url + '/DashboardSummary')
      .pipe(retry(1), catchError(this.handleError('DashboardSummary')));
  }

  Approve(id: number): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', id);
    return this.http
      .put<BaseResponse>(`${this.url}/Approve`, params)
      .pipe(retry(1), catchError(this.handleError('Approve')));
  }

  Reject(id: number, reason?: string): Observable<BaseResponse> {
    let params = new HttpParams().set('id', id.toString());
    if (reason) params = params.set('reason', reason);

    return this.http
      .put<BaseResponse>(`${this.url}/Reject`, {}, { params })
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
