import { Injectable } from '@angular/core';
import {
  AssignTechniciansRequest,
  UpdateWorkOrderRequest,
  WorkOrderDto,
} from '../models/WorkOrderModel';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Observable, retry, catchError, of, throwError, map } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  GridifyQueryExtend,
  PagingContent,
  BaseResponse,
} from '../shared/helpers/helpers';
import { JobDto } from '../models/JobModels';

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

  Update(request: UpdateWorkOrderRequest): Observable<WorkOrderDto> {
    return this.http
      .put<WorkOrderDto>(`${this.url}/Update`, request)
      .pipe(retry(1), catchError(this.handleError('Update')));
  }

  Start(id: string): Observable<{
    success: boolean;
    message: string;
    workOrder: WorkOrderDto;
    job: JobDto;
  }> {
    const params = new HttpParams().set('id', id); // query parameter

    return this.http
      .put<{
        success: boolean;
        message: string;
        workOrder: WorkOrderDto;
        job: JobDto;
      }>(`${this.url}/Start`, {}, { params }) // empty body, id in query string
      .pipe(retry(1), catchError(this.handleError('Start')));
  }

  OnHold(id: string): Observable<{
    success: boolean;
    message: string;
    workOrder: WorkOrderDto;
  }> {
    const params = new HttpParams().set('id', id); // query parameter

    return this.http
      .put<{
        success: boolean;
        message: string;
        workOrder: WorkOrderDto;
      }>(`${this.url}/OnHold`, {}, { params }) // empty body, id in query string
      .pipe(retry(1), catchError(this.handleError('OnHold')));
  }

  Resume(id: string): Observable<{
    success: boolean;
    message: string;
    workOrder: WorkOrderDto;
  }> {
    const params = new HttpParams().set('id', id); // query parameter

    return this.http
      .put<{
        success: boolean;
        message: string;
        workOrder: WorkOrderDto;
      }>(`${this.url}/Resume`, {}, { params }) // empty body, id in query string
      .pipe(retry(1), catchError(this.handleError('Resume')));
  }

  Complete(id: string): Observable<{
    success: boolean;
    message: string;
    workOrder: WorkOrderDto;
  }> {
    const params = new HttpParams().set('id', id); // query parameter

    return this.http
      .put<{
        success: boolean;
        message: string;
        workOrder: WorkOrderDto;
      }>(`${this.url}/Complete`, {}, { params }) // empty body, id in query string
      .pipe(retry(1), catchError(this.handleError('Complete')));
  }

  AssignTechnicians(
    request: AssignTechniciansRequest
  ): Observable<BaseResponse> {
    return this.http
      .post<BaseResponse>(`${this.url}/AssignTechnicians`, request)
      .pipe(retry(1), catchError(this.handleError('AssignTechnicians')));
  }

  RemoveTechnician(id: string): Observable<BaseResponse> {
    return this.http
      .delete<BaseResponse>(`${this.url}/RemoveTechnician/${id}`)
      .pipe(retry(1), catchError(this.handleError('RemoveTechnician')));
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
