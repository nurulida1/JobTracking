import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import {
  Subject,
  Subscription,
  filter,
  finalize,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { PopoverModule } from 'primeng/popover';
import { DialogModule } from 'primeng/dialog';
import { AppConfigService } from '../../../services/appConfig.service';
import { LoadingService } from '../../../services/loading.service';
import { NotificationService } from '../../../services/notificationService.service';
import { UserService } from '../../../services/userService.service';
import { NotificationDto } from '../../../models/notificationModels';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RoleService } from '../../../services/roleService';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    AvatarModule,
    ButtonModule,
    PopoverModule,
    DialogModule,
    AvatarModule,
    RouterLink,
    FormsModule,
    InputTextModule,
  ],
  template: `<div class="px-2 py-1 w-full">
    <div class="flex flex-row items-center justify-between">
      <div
        class="font-semibold tracking-widest text-cyan-500 text-shadow-md text-shadow-black/10 text-base md:text-xl"
      >
        YL Works
      </div>

      <div class="flex flex-row items-center gap-6">
        <div class="relative" (click)="onBellClick()">
          <div
            class="pi pi-bell !text-xl !cursor-pointer hover:!text-gray-500 !text-gray-400 !text-shadow-md !text-shadow-black/10"
          ></div>
          <div
            *ngIf="unreadCount > 0"
            class="!cursor-pointer absolute -top-1 right-1 bg-blue-400 rounded-full w-5 h-5 flex justify-center items-center shadow-md text-xs"
          >
            {{ unreadCount }}
          </div>

          <div
            *ngIf="notificationVisible"
            class="max-h-[300px] overflow-y-auto absolute z-10 top-9 -right-4 shadow-md border border-gray-200 bg-white flex flex-col gap-2 text-xs tracking-wider text-gray-400 rounded-md w-[300px]"
          >
            <div class="relative flex flex-col">
              <ng-container *ngIf="notificationLists.length > 0; else noData">
                <ng-container *ngFor="let notification of notificationLists">
                  <!-- Role Request Type -->
                  <ng-container
                    *ngIf="notification.type === 'RoleRequest'; else otherNotif"
                  >
                    <div
                      class="rounded border-b border-gray-200 p-2 py-3 bg-blue-50 transition-all"
                      [ngClass]="
                        !notification.isRead
                          ? 'border-l-4 border-blue-500 cursor-pointer hover:bg-blue-100'
                          : 'bg-white'
                      "
                      (click)="
                        !notification.isRead && RoleRequestClick(notification)
                      "
                    >
                      <div class="text-gray-900 text-[12px] font-medium">
                        🧑‍💼 {{ notification.message }}
                      </div>
                      <div
                        class="text-right pt-1 text-gray-500 text-[10px] font-thin"
                      >
                        {{
                          notification.createdAt
                            | date : 'dd/MM/yyyy hh:mm:ss a'
                        }}
                      </div>
                    </div>
                  </ng-container>

                  <!-- Other Notification Types -->
                  <ng-template #otherNotif>
                    <div
                      class="rounded border-b border-gray-200 p-2 py-3"
                      [ngClass]="
                        !notification.isRead ? 'bg-gray-100' : 'bg-white'
                      "
                    >
                      <div class="text-gray-900 text-[12px]">
                        {{ notification.message }}
                      </div>
                      <div
                        class="text-right pt-1 text-gray-500 text-[10px] font-thin"
                      >
                        {{
                          notification.createdAt
                            | date : 'dd/MM/yyyy hh:mm:ss a'
                        }}
                      </div>
                    </div>
                  </ng-template>
                </ng-container></ng-container
              >
              <ng-template #noData>
                <div class="flex flex-col items-center gap-3 p-2">
                  <img
                    src="assets/no-notification.png"
                    alt=""
                    class="w-[60px] opacity-75"
                  />
                  <div>No notification yet!</div>
                </div>
              </ng-template>
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
              class="px-3 py-1"
              [routerLink]="'/change-password'"
              [ngClass]="{
                'text-gray-700 font-semibold': isActive('/change-password'),
                'cursor-pointer hover:text-gray-700 hover:font-semibold':
                  !isActive('/change-password')
              }"
            >
              Change Password
            </div>
            <div
              (click)="toggleDarkMode()"
              class="px-3 py-1 cursor-pointer hover:text-gray-700 hover:font-semibold"
            >
              {{ isDarkMode() ? 'Light' : 'Dark' }} Theme
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
      class="backdrop-blur-xs z-20 shadow-md absolute top-0 left-0 w-full h-full md:min-h-[100vh] flex justify-center items-center transition-opacity duration-300"
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

    <div
      *ngIf="userRequestVisible"
      class="absolute inset-0 flex items-center justify-center backdrop-blur-xs z-30"
    >
      <div class="bg-white/90 w-[40%] shadow-md rounded-lg">
        <!-- Header -->
        <div
          class="bg-blue-400 rounded-t-lg px-3 py-2 text-shadow-md text-white tracking-wider"
        >
          Role Request Confirmation
        </div>

        <!-- Message -->
        <div class="pt-4 flex flex-row items-center">
          <div class="px-3 text-gray-600 text-xs tracking-wider font-bold">
            Requested Date :
          </div>
          <div
            class="px-3 flex flex-row items-center justify-between gap-2 text-sm text-gray-700"
          >
            <div class="tracking-wide text-gray-600 text-xs">
              {{ selectedNotification?.createdAt | date : 'dd/MM/YYYY' }}
            </div>
          </div>
        </div>
        <div class="pt-2 px-3 text-gray-600 text-xs tracking-wider font-bold">
          Request Details :
        </div>
        <div
          class="px-3 pt-1 flex flex-row items-center justify-between gap-2 text-sm text-gray-700"
        >
          <div class="tracking-wide text-gray-600">
            {{ selectedNotification?.message }}
          </div>
        </div>

        <!-- Reason Input -->
        <div
          *ngIf="type === 'reject'"
          class="flex flex-col px-3 text-xs tracking-wider pt-4 text-gray-700 gap-2"
        >
          <div>Reason <span class="italic text-gray-600">(Optional)</span></div>
          <input
            type="text"
            pInputText
            [(ngModel)]="reason"
            class="w-full !py-1 !border-gray-200"
          />
        </div>

        <!-- Divider -->
        <div class="px-3">
          <div class="border-b border-gray-200 mt-3 mb-3"></div>
        </div>

        <!-- Buttons -->
        <div class="flex flex-row items-center gap-2 w-full pb-5 px-4">
          <div class="flex-1">
            <p-button
              (onClick)="CancelDialog()"
              label="Cancel"
              severity="secondary"
              styleClass="!w-full !text-sm !tracking-wider !text-shadow-md !border-gray-300 !shadow-sm"
            ></p-button>
          </div>
          <div class="flex-1">
            <p-button
              (onClick)="ConfirmRoleRequest('approve')"
              label="Approve"
              severity="success"
              styleClass="!w-full !text-sm !tracking-wider !text-shadow-md !shadow-sm"
            ></p-button>
          </div>
          <div class="flex-1">
            <p-button
              (onClick)="ConfirmRoleRequest('reject')"
              label="Reject"
              severity="danger"
              styleClass="!w-full !text-sm !tracking-wider !text-shadow-md !shadow-sm"
            ></p-button>
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
  private readonly messageService = inject(MessageService);
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  private notificationSub!: Subscription;
  private destroy$ = new Subject<void>();
  notifications: { message: string; time: Date }[] = [];

  isDarkMode = computed(
    () => this.appConfigService.appState()?.darkTheme ?? false
  );
  role: string | null = localStorage.getItem('role');
  isMobile = window.innerWidth < 770;

  notificationVisible: boolean = false;
  userRequestVisible: boolean = false;
  showLogoutDialog: boolean = false;
  visibleSetting: boolean = false;
  logoutPopup: boolean = false;
  isLogin: boolean = false;

  type: string = '';
  reason: string = '';
  currentUrl: string = '';
  userId: string | null = null;
  unreadCount: number = 0;

  selectedNotification: NotificationDto | null = null;

  notificationLists: NotificationDto[] = [];

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 770;
  }

  constructor() {
    this.userId = this.userService.currentUser?.userId ?? null;

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

    this.notificationService.loadUnreadCount(
      this.userService.currentUser?.userId
    );

    this.notificationService.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe((msg) => {
        if (msg) {
          this.addNotification(msg);
          if (this.userId)
            this.notificationService.refreshUnreadCount(this.userId);
        }
      });

    if (!this.isMobile && this.userId) {
      this.notificationService.GetNotifications(this.userId).subscribe({
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
      if (this.notificationLists.some((x) => !x.isRead)) {
        setTimeout(() => {
          if (this.userId) {
            this.notificationService.MarkAllAsRead(this.userId).subscribe({
              next: (res) => {
                if (res.success) {
                  // ✅ update each notification in place
                  this.notificationLists.forEach((x) => (x.isRead = true));

                  // ✅ update unread count
                  this.notificationService['_unreadCount$'].next(0);
                }
              },
              error: (err) => {
                console.error(err);
              },
            });
          }
        }, 2000);
      }

      this.cdr.detectChanges();
    }
  }

  RoleRequestClick(notification: NotificationDto) {
    this.selectedNotification = notification;
    this.userRequestVisible = true;
    this.cdr.detectChanges();
  }

  CancelDialog() {
    this.userRequestVisible = false;

    //markAsRead
    this.cdr.detectChanges();
  }

  ConfirmRoleRequest(type: string) {
    if (!this.selectedNotification?.roleId) return;

    this.loadingService.start();

    const action$ =
      type === 'approve'
        ? this.roleService.Approve(this.selectedNotification.roleId)
        : this.roleService.Reject(
            this.selectedNotification.roleId,
            this.reason || undefined
          );

    action$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.loadingService.stop())
      )
      .subscribe({
        next: () => {
          this.userRequestVisible = false;

          // Update local notificationLists (optional)
          if (this.selectedNotification?.id) {
            this.notificationLists = this.notificationLists.map((notif) =>
              notif.id === this.selectedNotification?.id
                ? { ...notif } // keep isRead as it is
                : notif
            );
          }

          // Show success message
          const actionText = type === 'approve' ? 'approved' : 'rejected';
          this.messageService.add({
            severity: 'success',
            summary: 'Role Request',
            detail: `Role request has been ${actionText} successfully.`,
          });

          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Role Request',
            detail: `Failed to ${type} role request.`,
          });
        },
      });
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
