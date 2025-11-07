import { Injectable, NgZone } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  retry,
  take,
  tap,
  throwError,
} from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NotificationDto } from '../models/notificationModels';
import { BaseResponse } from '../shared/helpers/helpers';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root', // singleton
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;

  private messageSource = new BehaviorSubject<string | null>(null);
  public message$ = this.messageSource.asObservable();

  private _unreadCount$ = new BehaviorSubject<number>(0);
  public unreadCount$ = this._unreadCount$.asObservable();

  private isConnected: boolean = false;
  private hasLoadedUnread: boolean = false; // ✅ load unread only once

  /** ✅ Notification caching */
  private notificationsLoaded = false;
  private _notifications$ = new BehaviorSubject<NotificationDto[]>([]);
  public notifications$ = this._notifications$.asObservable();

  url = environment.ApiBaseUrl + '/Notification';
  private readonly baseUrl = 'https://192.168.1.77:5000/hubs/notifications';

  constructor(
    private zone: NgZone,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  /** Starts SignalR connection only once */
  startConnection() {
    if (this.isConnected) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.isConnected = true;
        console.log('✅ SignalR Connected');
        this.listenForUpdates();
      })
      .catch((err) => console.error('❌ SignalR Connection Error:', err));
  }

  /** Stop connection when user logs out */
  stopConnection() {
    if (this.hubConnection && this.isConnected) {
      this.hubConnection.stop().then(() => {
        this.isConnected = false;
        console.log('🔌 SignalR Disconnected');
      });
    }
  }

  /** Handle incoming notifications from SignalR */
  private listenForUpdates() {
    this.hubConnection.on('ReceiveUpdate', (message: string) => {
      this.zone.run(() => {
        console.log('📢 Received:', message);
        this.messageSource.next(message);

        // Optionally update unread count on each new message
        this.refreshUnreadCount();
      });
    });
  }

  /** Load unread count only once per session */
  loadUnreadCount(userId?: number) {
    if (this.hasLoadedUnread || !userId) return;

    this.UnreadCount(userId)
      .pipe(take(1))
      .subscribe((res) => {
        if (res.success) {
          this._unreadCount$.next(res.unreadCount);
          this.hasLoadedUnread = true;
        }
      });
  }

  /** Refresh unread count dynamically */
  refreshUnreadCount(userId?: number) {
    if (!userId) return;

    this.UnreadCount(userId)
      .pipe(take(1))
      .subscribe((res) => {
        if (res.success) {
          this._unreadCount$.next(res.unreadCount);
        }
      });
  }

  /** API Calls */
  GetNotifications(userId: number): Observable<NotificationDto[]> {
    if (this.notificationsLoaded && this._notifications$.value.length > 0) {
      // 🟢 Return cached data
      return of(this._notifications$.value);
    }

    const params = new HttpParams().set('userId', userId.toString());

    return this.http
      .get<NotificationDto[]>(`${this.url}/GetAll`, { params })
      .pipe(
        retry(1),
        tap((res) => {
          this._notifications$.next(res);
          this.notificationsLoaded = true;
        }),
        catchError(this.handleError('GetNotifications'))
      );
  }

  /** ✅ Manually refresh (optional) */
  RefreshNotifications(userId: number): void {
    const params = new HttpParams().set('userId', userId.toString());

    this.http
      .get<NotificationDto[]>(`${this.url}/GetAll`, { params })
      .pipe(
        retry(1),
        tap((res) => this._notifications$.next(res)),
        catchError(this.handleError('RefreshNotifications'))
      )
      .subscribe();
  }

  MarkAllAsRead(userId: number): Observable<{ success: boolean }> {
    let params = new HttpParams().set('userId', userId.toString());
    return this.http
      .put<{ success: boolean }>(`${this.url}/MarkAllRead`, {}, { params })
      .pipe(retry(1), catchError(this.handleError('MarkAllAsRead')));
  }

  UnreadCount(
    userId?: number
  ): Observable<{ success: boolean; unreadCount: number }> {
    const params: any = {};
    if (userId) params.userId = userId;

    return this.http
      .get<{ success: boolean; unreadCount: number }>(
        `${this.url}/UnreadCount`,
        { params }
      )
      .pipe(retry(1), catchError(this.handleError('UnreadCount')));
  }

  MarkRead(id: number): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', id);
    return this.http
      .put<BaseResponse>(`${this.url}/MarkRead`, params)
      .pipe(retry(1), catchError(this.handleError('MarkRead')));
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
