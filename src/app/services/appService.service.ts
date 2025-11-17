import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { environment } from '../../environments/environment.development';
import { DashboardCount, DashboardSummary } from '../models/AppModels';
import { Observable, retry, catchError, throwError } from 'rxjs';
import { JobDto, JobTaskResponse } from '../models/JobModels';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  url = environment.ApiBaseUrl + '/App';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  GetDashboardAdmin(): Observable<DashboardSummary> {
    return this.http
      .get<DashboardSummary>(this.url + '/dashboardSummary', {})
      .pipe(retry(1), catchError(this.handleError('GetDashboardAdmin')));
  }

  GetDashboardCount(): Observable<DashboardCount> {
    return this.http
      .get<DashboardCount>(this.url + '/dashboardCount', {})
      .pipe(retry(1), catchError(this.handleError('GetDashboardCount')));
  }

  QuotationChart(): Observable<[{ date: Date; count: number }]> {
    return this.http
      .get<[{ date: Date; count: number }]>(this.url + '/quotationChart', {})
      .pipe(retry(1), catchError(this.handleError('QuotationChart')));
  }

  TodayTasks(userId: string): Observable<JobTaskResponse> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http
      .get<JobTaskResponse>(`https://192.168.1.75:5000/technician/todayTasks`, {
        params,
      })
      .pipe(retry(1), catchError(this.handleError('TodayTasks')));
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
