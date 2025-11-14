import { Injectable } from '@angular/core';
import { JobDto, UpdateJobRequest } from '../models/JobModels';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Observable, retry, catchError, of, throwError, map } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { GridifyQueryExtend, PagingContent } from '../shared/helpers/helpers';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  url = environment.ApiBaseUrl + '/Job';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  GetMany(query: GridifyQueryExtend): Observable<PagingContent<JobDto>> {
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
      .get<PagingContent<JobDto>>(this.url + '/GetMany', {
        params,
      })
      .pipe(retry(1), catchError(this.handleError('GetMany')));
  }

  GetOne(query: GridifyQueryExtend): Observable<JobDto | null> {
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

    return this.http.get<JobDto>(this.url + '/GetOne', { params }).pipe(
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

  Start(id: string): Observable<{
    success: boolean;
    message: string;
    job: JobDto;
  }> {
    const params = new HttpParams().set('id', id); // query parameter

    return this.http
      .put<{
        success: boolean;
        message: string;
        job: JobDto;
      }>(`${this.url}/Start`, {}, { params }) // empty body, id in query string
      .pipe(retry(1), catchError(this.handleError('Start')));
  }

  OnHold(id: string): Observable<{
    success: boolean;
    message: string;
    job: JobDto;
  }> {
    const params = new HttpParams().set('id', id); // query parameter

    return this.http
      .put<{
        success: boolean;
        message: string;
        job: JobDto;
      }>(`${this.url}/OnHold`, {}, { params }) // empty body, id in query string
      .pipe(retry(1), catchError(this.handleError('OnHold')));
  }

  Resume(id: string): Observable<{
    success: boolean;
    message: string;
    job: JobDto;
  }> {
    const params = new HttpParams().set('id', id); // query parameter

    return this.http
      .put<{
        success: boolean;
        message: string;
        job: JobDto;
      }>(`${this.url}/Resume`, {}, { params }) // empty body, id in query string
      .pipe(retry(1), catchError(this.handleError('Resume')));
  }

  Complete(id: string): Observable<{
    success: boolean;
    message: string;
    job: JobDto;
  }> {
    const params = new HttpParams().set('id', id); // query parameter

    return this.http
      .put<{
        success: boolean;
        message: string;
        job: JobDto;
      }>(`${this.url}/Complete`, {}, { params }) // empty body, id in query string
      .pipe(retry(1), catchError(this.handleError('Complete')));
  }

  Cancel(id: string): Observable<{
    success: boolean;
    message: string;
    job: JobDto;
  }> {
    const params = new HttpParams().set('id', id); // query parameter

    return this.http
      .put<{
        success: boolean;
        message: string;
        job: JobDto;
      }>(`${this.url}/Cancel`, {}, { params }) // empty body, id in query string
      .pipe(retry(1), catchError(this.handleError('Cancel')));
  }

  UpdatePriority(
    id: string,
    priority: string
  ): Observable<{
    success: boolean;
    message: string;
    job: JobDto;
  }> {
    const params = new HttpParams().set('id', id).set('priority', priority); // query parameter

    return this.http
      .put<{
        success: boolean;
        message: string;
        job: JobDto;
      }>(`${this.url}/UpdatePriority`, {}, { params }) // empty body, id in query string
      .pipe(retry(1), catchError(this.handleError('UpdatePriority')));
  }

  Update(request: UpdateJobRequest): Observable<{
    success: boolean;
    message: string;
    job: JobDto;
  }> {
    return this.http
      .put<{
        success: boolean;
        message: string;
        job: JobDto;
      }>(`${this.url}/Update`, request)
      .pipe(retry(1), catchError(this.handleError('Update')));
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
