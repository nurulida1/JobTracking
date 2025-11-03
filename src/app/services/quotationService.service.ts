import { Injectable } from '@angular/core';
import {
  CreateQuotationRequest,
  QuotationDto,
  UpdateQuotationRequest,
} from '../models/QuotationModel';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Observable, retry, catchError, of, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  GridifyQueryExtend,
  PagingContent,
  BaseResponse,
} from '../shared/helpers/helpers';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  url = environment.ApiBaseUrl + '/Quotation';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  GetMany(query: GridifyQueryExtend): Observable<PagingContent<QuotationDto>> {
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
      .get<PagingContent<QuotationDto>>(this.url + '/GetMany', {
        params,
      })
      .pipe(retry(1), catchError(this.handleError('GetMany')));
  }

  GetOne(query: GridifyQueryExtend): Observable<QuotationDto | null> {
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

    return this.http.get<QuotationDto>(this.url + '/GetOne', { params }).pipe(
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

  Create(request: CreateQuotationRequest): Observable<QuotationDto> {
    return this.http
      .post<QuotationDto>(`${this.url}/Create`, request) // no { Data: ... }
      .pipe(retry(1), catchError(this.handleError('Create')));
  }

  Update(request: UpdateQuotationRequest): Observable<QuotationDto> {
    return this.http
      .put<{ Data: QuotationDto }>(`${this.url}/Update`, request)
      .pipe(
        retry(1),
        catchError(this.handleError('Update')),
        map((res) => res?.Data)
      );
  }

  Delete(staff_id: string): Observable<BaseResponse> {
    return this.http
      .delete<BaseResponse>(`${this.url}/Delete/${staff_id}`)
      .pipe(retry(1), catchError(this.handleError('Delete')));
  }

  Approve(id: number): Observable<BaseResponse> {
    const params = new HttpParams().set('id', id.toString());
    return this.http
      .put<BaseResponse>(`${this.url}/approve`, null, { params })
      .pipe(retry(1), catchError(this.handleError('Approve')));
  }

  Reject(id: number, remark?: string): Observable<BaseResponse> {
    let params = new HttpParams().set('id', id.toString());
    if (remark) params = params.set('remark', remark);
    return this.http
      .put<BaseResponse>(`${this.url}/reject`, null, { params })
      .pipe(retry(1), catchError(this.handleError('Reject')));
  }

  GetDashboardCount(): Observable<{
    pending: number;
    approved: number;
    rejected: number;
  }> {
    return this.http
      .get<{ pending: number; approved: number; rejected: number }>(
        this.url + '/DashboardCount',
        {}
      )
      .pipe(retry(1), catchError(this.handleError('GetDashboardCount')));
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
