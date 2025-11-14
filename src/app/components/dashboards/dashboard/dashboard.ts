import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SpeedDialModule } from 'primeng/speeddial';
import { TooltipModule } from 'primeng/tooltip';
import { LoadingService } from '../../../services/loading.service';
import { DashboardCount } from '../../../models/AppModels';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import { UserRole } from '../../../shared/enum/enum';
import { UserService } from '../../../services/userService.service';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../../services/roleService';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { DashboardGuest } from '../dashboard-guest/dashboard-guest';
import { DashboardTechnician } from '../dashboard-technician/dashboard-technician';
import { DashboardAdmin } from '../dashboard-admin/dashboard-admin';
import { DashboardApprover } from '../dashboard-approver/dashboard-approver';
import { ValidateAllFormFields } from '../../../shared/helpers/helpers';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    SpeedDialModule,
    TooltipModule,
    ChartModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    DashboardTechnician,
    DashboardGuest,
    DashboardAdmin,
    DashboardApprover,
  ],
  template: `
    <div class="relative w-full flex items-center justify-center">
      <div
        class="relative 2xl:rounded-3xl w-full min-h-[77vh] flex flex-col p-4 md:p-0"
      >
        <div
          class="w-full flex"
          [ngClass]="{ 'flex-row': !isMobile, 'flex-col': isMobile }"
        >
          <div class="flex-1 p-2">
            <ng-container [ngSwitch]="role">
              <!-- GUEST VIEW -->
              <ng-container *ngSwitchCase="'Guest'">
                <app-dashboard-guest
                  [FG]="FG"
                  (onRequest)="RequestRole()"
                ></app-dashboard-guest>
              </ng-container>

              <!-- TECHNICIAN VIEW -->
              <ng-container *ngSwitchCase="'Technician'">
                <app-dashboard-technician
                  [dashboardCount]="dashboardCount"
                ></app-dashboard-technician>
              </ng-container>

              <!-- APPROVER && PLANNER VIEW -->
              <ng-container *ngSwitchCase="'Planner'">
                <app-dashboard-approver
                  [dashboardCount]="dashboardCount"
                  [quotationChartData]="quotationChartData"
                  [quotationChartOptions]="quotationChartOptions"
                ></app-dashboard-approver>
              </ng-container>

              <ng-container *ngSwitchCase="'Approver'">
                <app-dashboard-approver
                  [dashboardCount]="dashboardCount"
                  [quotationChartData]="quotationChartData"
                  [quotationChartOptions]="quotationChartOptions"
                ></app-dashboard-approver>
              </ng-container>

              <!-- ADMIN VIEW -->
              <ng-container *ngSwitchCase="'Admin'">
                <app-dashboard-admin
                  [dashboardCount]="dashboardCount"
                  [quotationChartData]="quotationChartData"
                  [quotationChartOptions]="quotationChartOptions"
                ></app-dashboard-admin>
              </ng-container>
            </ng-container>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './dashboard.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit, OnDestroy {
  isMobile = window.innerWidth < 770;

  private readonly loadingService = inject(LoadingService);
  private readonly messageService = inject(MessageService);
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  private notificationSub!: Subscription;

  dashboardCount: any;
  notifications: { message: string; time: Date }[] = [];

  quotationChartData: any;
  quotationChartOptions: any;
  role: UserRole | null = null;

  FG!: FormGroup;

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 770;
  }

  constructor() {
    this.role = this.userService.currentUser?.userRole ?? UserRole.Guest;

    this.FG = new FormGroup({
      userId: new FormControl<string | null>(
        this.userService.currentUser?.userId ?? null,
        Validators.required
      ),
      requestedRole: new FormControl<string | null>(null, Validators.required),
      justification: new FormControl<string | null>(null),
      status: new FormControl<string>('Pending'),
      createdAt: new FormControl<Date>(new Date()),
      updatedAt: new FormControl<Date | null>(null),
    });
  }

  ngOnInit(): void {}

  RequestRole() {
    if (this.FG.valid) {
      this.loadingService.start();
      this.roleService
        .RequestRole(this.FG.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res) => {
            setTimeout(() => {
              this.loadingService.stop();
              if (res.success) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Request Sent',
                  detail:
                    res.message || 'Your role request has been submitted.',
                });
                this.FG.get('requestedRole')?.patchValue(null);
                this.FG.get('justification')?.patchValue(null);
              } else {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Request Failed',
                  detail: res.message || 'Unable to process role request.',
                });
              }
            }, 1000);
          },
          error: (err) => {
            this.loadingService.stop();
          },
        });
    }
    ValidateAllFormFields(this.FG);
  }

  addNotification(message: string) {
    const newNotification = { message, time: new Date() };
    this.notifications = this.notifications
      ? [newNotification, ...this.notifications]
      : [newNotification];
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
    this.loadingService.stop();
  }
}
