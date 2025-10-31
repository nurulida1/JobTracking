import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { environment } from '../../environments/environment.development';
import { DashboardCount } from '../models/AppModels';
import { Observable, retry, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  url = environment.ApiBaseUrl + '/App';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  GetDashboardCount(): Observable<DashboardCount> {
    return this.http
      .get<DashboardCount>(this.url + '/dashboardCount', {})
      .pipe(retry(1), catchError(this.handleError('GetDashboardCount')));
  }

  GetNotifications(): Observable<[{ message: string; time: Date }]> {
    return this.http
      .get<[{ message: string; time: Date }]>(this.url + '/notifications', {})
      .pipe(retry(1), catchError(this.handleError('GetNotifications')));
  }

  QuotationChart(): Observable<[{ date: Date; count: number }]> {
    return this.http
      .get<[{ date: Date; count: number }]>(this.url + '/quotationChart', {})
      .pipe(retry(1), catchError(this.handleError('QuotationChart')));
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
