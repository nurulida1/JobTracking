import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { AppService } from '../../services/appService.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  template: `<div
    class="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center"
    style="background-image: url('assets/background.png');"
  >
    <div class="absolute inset-0 backdrop-blur-sm bg-black/40 z-10"></div>
    <div
      class="relative z-20 border border-gray-400/30 bg-black/20 
          w-full min-h-screen shadow-xl
          shadow-[0_0_40px_rgba(173,216,230,0.5)] text-white backdrop-filter backdrop-blur-xl
          flex flex-col"
    >
      <div
        class="flex flex-row items-center justify-between p-3 py-5 border border-white/10 shadow-md"
      >
        <div (click)="CloseNotification()">
          <svg
            class="w-6 h-6 text-white/50"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.5 8.046H11V6.119c0-.921-.9-1.446-1.524-.894l-5.108 4.49a1.2 1.2 0 0 0 0 1.739l5.108 4.49c.624.556 1.524.027 1.524-.893v-1.928h2a3.023 3.023 0 0 1 3 3.046V19a5.593 5.593 0 0 0-1.5-10.954Z"
            />
          </svg>
        </div>
        <div class="tracking-widest">Notifications</div>
        <div></div>
      </div>
      <div class="flex flex-col gap-3 mt-3 p-3" *ngIf="notifications">
        <ng-container *ngFor="let notification of notifications">
          <div class="rounded shadow-md p-2 py-3 bg-white/30">
            <div>{{ notification.message }}</div>
            <div class="text-white/50 text-sm font-thin">
              {{ notification.time | date : 'dd/MM/yyyy hh:mm:ss a' }}
            </div>
          </div>
        </ng-container>
      </div>
      <div
        class="flex flex-col gap-3 justify-center items-center mt-6"
        *ngIf="!notifications"
      >
        <div><img src="assets/no-spam.png" alt="" class="w-[70px]" /></div>
        <div class="text-xl tracking-widest">No notification yet</div>
        <div class="px-10 text-center tracking-wider font-thin">
          Your notification will appear here once you've received them.
        </div>
      </div>
    </div>
  </div>`,
  styleUrl: './notifications.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notifications implements OnInit, OnDestroy {
  private readonly location = inject(Location);
  private readonly loadingService = inject(LoadingService);
  private readonly appService = inject(AppService);
  private readonly cdr = inject(ChangeDetectorRef);
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  notifications: [{ message: string; time: Date }] | null = null;

  ngOnInit(): void {
    this.loadingService.start();
    this.appService
      .GetNotifications()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.notifications = res;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.loadingService.stop();
        },
        complete: () => {
          this.loadingService.stop();
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.loadingService.stop();
  }

  CloseNotification() {
    this.location.back();
  }
}
