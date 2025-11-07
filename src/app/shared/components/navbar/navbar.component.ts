import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Subject, Subscription, filter, takeUntil } from 'rxjs';
import { PopoverModule } from 'primeng/popover';
import { DialogModule } from 'primeng/dialog';
import { AppConfigService } from '../../../services/appConfig.service';
import { LoadingService } from '../../../services/loading.service';
import { NotificationService } from '../../../services/notificationService.service';
import { UserService } from '../../../services/userService.service';
import { NotificationDto } from '../../../models/notificationModels';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    AvatarModule,
    ButtonModule,
    PopoverModule,
    DialogModule,
    AvatarModule,
  ],
  template: `<div class="px-2 py-1 w-full ">
    <div class="flex flex-row items-center justify-between">
      <div
        class="font-semibold tracking-widest text-cyan-500 text-shadow-md text-shadow-black/10 text-base md:text-xl"
      >
        YL Works
      </div>

      <div class="flex flex-row items-center gap-6">
        <div class="relative">
          <div
            class="pi pi-bell !text-xl !cursor-pointer hover:!text-gray-500 !text-gray-400 !text-shadow-md !text-shadow-black/10"
            (click)="onBellClick()"
          ></div>
          <div
            *ngIf="unreadCount > 0"
            class="absolute -top-1 right-1 bg-blue-400 rounded-full w-5 h-5 flex justify-center items-center shadow-md text-xs"
          >
            {{ unreadCount }}
          </div>

          <div
            *ngIf="notificationVisible"
            class="h-[300px] overflow-y-scroll absolute z-10 top-9 -right-4 shadow-md border border-gray-200 bg-white flex flex-col gap-2 text-xs tracking-wider text-gray-400 rounded-md w-[300px]"
          >
            <div class="relative flex flex-col">
              <ng-container *ngFor="let notification of notificationLists">
                <div
                  class="rounded border-b border-gray-200 p-2 py-3"
                  [ngClass]="!notification.isRead ? 'bg-gray-100' : 'bg-white'"
                >
                  <div class="text-gray-900 text-[12px]">
                    {{ notification.message }}
                  </div>
                  <div
                    class="text-right pt-1 text-gray-500 text-[10px] font-thin"
                  >
                    ~
                    {{
                      notification.createdAt | date : 'dd/MM/yyyy hh:mm:ss a'
                    }}
                  </div>
                </div>
              </ng-container>
            </div>
          </div>
        </div>
        <div class="relative hidden md:block md:border-l pl-4 border-gray-200">
          <p-avatar
            (click)="ShowSettingDialog()"
            icon="pi pi-user"
            shape="circle"
            styleClass="inset-shadow-sm !text-shadow-md !cursor-pointer"
          ></p-avatar>
          <div
            *ngIf="visibleSetting"
            class="absolute top-10 right-0 shadow-md border py-2 border-gray-200 bg-white flex flex-col gap-2 z-30 text-xs tracking-wider text-gray-600 rounded-md w-[150px]"
          >
            <div
              class="px-3 py-1 cursor-pointer hover:text-gray-700 hover:font-semibold"
            >
              Edit Profile
            </div>
            <div
              class="px-3 py-1 cursor-pointer hover:text-gray-700 hover:font-semibold"
            >
              Change Password
            </div>
            <div
              (click)="toggleDarkMode()"
              class="px-3 py-1 cursor-pointer hover:text-gray-700 hover:font-semibold"
            >
              Dark Theme
            </div>
            <div
              (click)="LogoutClick()"
              class="px-3 py-1 cursor-pointer hover:text-gray-700 hover:font-semibold"
            >
              Sign out
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      *ngIf="logoutPopup"
      class="backdrop-blur-xs z-20 absolute top-0 left-0 w-full h-full flex justify-center items-center transition-opacity duration-300"
      [ngClass]="{ 'opacity-0': !logoutPopup, 'opacity-100': logoutPopup }"
    >
      <div class="w-full min-h-screen flex justify-center items-center">
        <div
          class="w-[30%] shadow-md rounded-lg bg-white flex flex-col justify-center items-center transform transition-all duration-300 ease-out scale-95 opacity-0"
          [ngClass]="{ 'scale-100 opacity-100': logoutPopup }"
        >
          <div class="pt-5">
            <img src="assets/sad.png" alt="" class="w-[50px]" />
          </div>
          <div class="font-medium text-lg pb-2  text-gray-800 tracking-wider">
            Leaving so soon ?
          </div>
          <div class="text-gray-600 text-sm tracking-wide">
            Are you sure you want to log out ?
          </div>
          <div
            class="flex flex-row items-center w-full border-t mt-4 border-gray-200"
          >
            <div
              (click)="closeDialog()"
              class="flex-1 border-r hover:shadow-md cursor-pointer text-sm tracking-wider border-gray-200 py-4 text-center text-gray-600"
            >
              Cancel
            </div>
            <div
              (click)="logoutConfirm()"
              class="flex-1 text-sm hover:shadow-md cursor-pointer tracking-wider text-blue-600 text-center py-4"
            >
              Confirm
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,
  styleUrl: './navbar.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnDestroy, OnInit {
  private readonly notificationService = inject(NotificationService);
  private readonly appConfigService = inject(AppConfigService);
  private readonly loadingService = inject(LoadingService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  private notificationSub!: Subscription;
  notifications: { message: string; time: Date }[] = [];

  private destroy$ = new Subject<void>();
  isDarkMode = computed(
    () => this.appConfigService.appState()?.darkTheme ?? false
  );
  role: string | null = localStorage.getItem('role');
  isMobile = window.innerWidth < 770;

  notificationVisible: boolean = false;
  showLogoutDialog: boolean = false;
  visibleSetting: boolean = false;
  logoutPopup: boolean = false;
  isLogin: boolean = false;

  currentUrl: string = '';
  unreadCount: number = 0;

  notificationLists: NotificationDto[] = [];

  constructor() {
    this.currentUrl = this.router.url;
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  ngOnInit(): void {
    this.notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe((count) => {
        this.unreadCount = count;
        this.cdr.markForCheck();
      });

    this.notificationService.loadUnreadCount(this.userService.currentUser?.id);

    this.notificationService.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe((msg) => {
        if (msg) {
          this.addNotification(msg);
          this.notificationService.refreshUnreadCount(
            this.userService.currentUser?.id
          );
        }
      });

    if (!this.isMobile) {
      this.notificationService
        .GetNotifications(this.userService.currentUser?.id ?? 0)
        .subscribe({
          next: (res) => (this.notificationLists = res),
          error: (err) => console.error('Failed to load notifications', err),
        });
    } else {
      this.notificationLists = [];
    }
  }

  refreshUnreadCount() {
    this.loadingService.start();
    this.notificationService.UnreadCount().subscribe({
      next: (res) => {
        this.loadingService.stop();
        if (res.success) {
          this.unreadCount = res.unreadCount;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.loadingService.stop();
      },
    });
  }

  isActive(route: string): boolean {
    return this.currentUrl.includes(route);
  }

  LogoutClick() {
    this.logoutPopup = true;
    this.visibleSetting = false;
    this.cdr.detectChanges();
  }

  closeDialog() {
    this.logoutPopup = false;
    this.cdr.detectChanges();
  }

  logoutConfirm() {
    setTimeout(() => {
      this.userService.logout();
    }, 50);
  }

  cancelLogout() {
    this.showLogoutDialog = false;
  }

  confirmLogout() {
    this.showLogoutDialog = false;
  }

  ShowSettingDialog() {
    this.visibleSetting = !this.visibleSetting;
    if (this.notificationVisible && this.visibleSetting) {
      this.notificationVisible = false;
    }
    this.cdr.detectChanges();
  }

  toggleDarkMode() {
    this.appConfigService.appState.update((state) => ({
      ...state,
      darkTheme: !state?.darkTheme,
    }));
  }

  onBellClick() {
    if (this.isMobile) {
      this.router.navigate(['/notifications']);
    } else {
      this.notificationVisible = !this.notificationVisible;
      if (this.notificationVisible && this.visibleSetting) {
        this.visibleSetting = false;
      }
      this.cdr.detectChanges();
    }
  }

  addNotification(message: string) {
    const newNotification = { message, time: new Date() };
    this.notifications = this.notifications
      ? [newNotification, ...this.notifications]
      : [newNotification];
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.notificationSub) this.notificationSub.unsubscribe();
    this.loadingService.stop();
  }
}
