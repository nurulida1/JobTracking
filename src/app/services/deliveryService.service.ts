import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Observable, retry, catchError, of, map, throwError } from 'rxjs';
import {
  GridifyQueryExtend,
  PagingContent,
  BaseResponse,
} from '../shared/helpers/helpers';
import {
  CreateDeliveryRequest,
  DeliveryDto,
  UpdateDeliveryRequest,
} from '../models/DeliveryModel';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  url = environment.ApiBaseUrl + '/Deliveries';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  GetMany(query: GridifyQueryExtend): Observable<PagingContent<DeliveryDto>> {
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
      .get<PagingContent<DeliveryDto>>(this.url + '/GetMany', {
        params,
      })
      .pipe(retry(1), catchError(this.handleError('GetMany')));
  }

  GetOne(query: GridifyQueryExtend): Observable<DeliveryDto | null> {
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

    return this.http.get<DeliveryDto>(this.url + '/GetOne', { params }).pipe(
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

  Create(request: CreateDeliveryRequest): Observable<DeliveryDto> {
    return this.http
      .post<DeliveryDto>(`${this.url}/Create`, request) // no { Data: ... }
      .pipe(retry(1), catchError(this.handleError('Create')));
  }

  Update(request: UpdateDeliveryRequest): Observable<DeliveryDto> {
    return this.http
      .put<{ Data: DeliveryDto }>(`${this.url}/Update`, request)
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

  ConfirmDelivery(id: number): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', id);
    return this.http
      .put<BaseResponse>(`${this.url}/ConfirmDelivery`, params)
      .pipe(retry(1), catchError(this.handleError('ConfirmDelivery')));
  }

  MarkShipped(id: number): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', id);
    return this.http
      .put<BaseResponse>(`${this.url}/MarkShipped`, params)
      .pipe(retry(1), catchError(this.handleError('MarkShipped')));
  }

  MarkDelivered(id: number): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', id);
    return this.http
      .put<BaseResponse>(`${this.url}/MarkDelivered`, params)
      .pipe(retry(1), catchError(this.handleError('MarkDelivered')));
  }

  UndoDelivery(id: number): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', id);
    return this.http
      .put<BaseResponse>(`${this.url}/UndoDelivery`, params)
      .pipe(retry(1), catchError(this.handleError('UndoDelivery')));
  }

  CountSummary(): Observable<{
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
  }> {
    return this.http
      .get<{
        total: number;
        pending: number;
        confirmed: number;
        shipped: number;
        delivered: number;
      }>(this.url + '/CountSummary', {})
      .pipe(retry(1), catchError(this.handleError('CountSummary')));
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
