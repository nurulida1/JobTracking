import { Injectable } from '@angular/core';
import { CreateWorkOrderRequest, WorkOrderDto } from '../models/WorkOrderModel';
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
export class WorkOrderService {
  url = environment.ApiBaseUrl + '/WorkOrder';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  GetMany(query: GridifyQueryExtend): Observable<PagingContent<WorkOrderDto>> {
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
      .get<PagingContent<WorkOrderDto>>(this.url + '/GetMany', {
        params,
      })
      .pipe(retry(1), catchError(this.handleError('GetMany')));
  }

  GetOne(query: GridifyQueryExtend): Observable<WorkOrderDto | null> {
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

    return this.http.get<WorkOrderDto>(this.url + '/GetOne', { params }).pipe(
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

  Create(request: CreateWorkOrderRequest): Observable<WorkOrderDto> {
    return this.http
      .post<WorkOrderDto>(`${this.url}/Create`, request) // no { Data: ... }
      .pipe(retry(1), catchError(this.handleError('Create')));
  }

  Start(id: number): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', id);
    return this.http
      .put<BaseResponse>(`${this.url}/Start`, params)
      .pipe(retry(1), catchError(this.handleError('Start')));
  }

  OnHold(id: number): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', id);
    return this.http
      .put<BaseResponse>(`${this.url}/OnHold`, params)
      .pipe(retry(1), catchError(this.handleError('OnHold')));
  }

  Resume(id: number): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', id);
    return this.http
      .put<BaseResponse>(`${this.url}/Resume`, params)
      .pipe(retry(1), catchError(this.handleError('Resume')));
  }

  Complete(id: number): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', id);
    return this.http
      .put<BaseResponse>(`${this.url}/Complete`, params)
      .pipe(retry(1), catchError(this.handleError('Complete')));
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
