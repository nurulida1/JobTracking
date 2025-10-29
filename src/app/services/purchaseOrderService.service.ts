import { Injectable } from '@angular/core';
import {
  CreatePurchaseOrderRequest,
  PurchaseOrderDto,
  UpdatePurchaseOrderRequest,
} from '../models/PurchaseOrderModel';
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
export class PurchaseOrderService {
  url = environment.ApiBaseUrl + '/PurchaseOrders';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  GetMany(
    query: GridifyQueryExtend
  ): Observable<PagingContent<PurchaseOrderDto>> {
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
      .get<PagingContent<PurchaseOrderDto>>(this.url + '/GetMany', {
        params,
      })
      .pipe(retry(1), catchError(this.handleError('GetMany')));
  }

  GetOne(query: GridifyQueryExtend): Observable<PurchaseOrderDto | null> {
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

    return this.http
      .get<PurchaseOrderDto>(this.url + '/GetOne', { params })
      .pipe(
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

  Create(request: CreatePurchaseOrderRequest): Observable<PurchaseOrderDto> {
    return this.http
      .post<PurchaseOrderDto>(`${this.url}/Create`, request) // no { Data: ... }
      .pipe(retry(1), catchError(this.handleError('Create')));
  }

  Update(request: UpdatePurchaseOrderRequest): Observable<PurchaseOrderDto> {
    return this.http
      .put<{ Data: PurchaseOrderDto }>(`${this.url}/Update`, request)
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

  Submit(id: number): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', id);
    return this.http
      .put<BaseResponse>(`${this.url}/Submit`, params)
      .pipe(retry(1), catchError(this.handleError('Submit')));
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
