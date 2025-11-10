import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { RoleService } from '../../../services/roleService';
import { ConfirmationService } from 'primeng/api';
import { LoadingService } from '../../../services/loading.service';
import { NotificationService } from '../../../services/notificationService.service';
import { finalize, Subject, Subscription, takeUntil } from 'rxjs';
import {
  BuildFilterText,
  BuildSortText,
  GridifyQueryExtend,
  PagingContent,
} from '../../../shared/helpers/helpers';
import { DashboardSummaryRole, Role } from '../../../models/RoleModel';
import { RoleRequestStatus } from '../../../shared/enum/enum';

@Component({
  selector: 'app-request-role-view',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    InputTextModule,
    FormsModule,
    DataViewModule,
  ],
  template: `
    <div
      class="relative w-full bg-cover bg-center flex items-center justify-center bg-white/60"
    >
      <div class="relative w-full min-h-[98vh] md:min-h-[91.8vh] flex flex-col">
        <div class="w-full pt-14 md:pt-0">
          <div class="p-4 flex flex-col">
            <h3
              class="text-xl font-semibold mb-3 text-gray-600 text-shadow-md text-shadow-black/10 tracking-wider"
            >
              Role Management
            </h3>
            <div class="grid grid-cols-3 gap-2 mb-4">
              <div
                class=" px-3 flex flex-row gap-4 shadow-lg bg-gradient-to-r from-[#9B7DE2] to-[#c8b8eb] border border-gray-200 flex-1 rounded-md"
              >
                <div class="flex flex-row items-center justify-between w-full">
                  <div class="flex flex-col gap-5 justify-between py-2 h-full">
                    <div
                      class="text-xs text-white font-semibold text-shadow-md tracking-widest"
                    >
                      Pending Approval
                    </div>
                    <div
                      class="text-4xl font-semibold text-white text-shadow-lg tracking-widest"
                    >
                      {{ dashboardCount?.summary?.pending }}
                    </div>
                  </div>
                  <div
                    class="bg-[#9B7DE2] inset-shadow-sm inset-shadow-black/50 w-10 h-10 rounded-full inset-shadow-sm flex items-center justify-center"
                  >
                    <div
                      class="pi pi-hourglass text-[#543896] !text-shadow-md
"
                    ></div>
                  </div>
                </div>
              </div>
              <div
                class=" px-3 flex flex-row gap-5 shadow-lg bg-gradient-to-r from-[#81e424] to-[#ace78b] border border-gray-200 flex-1 rounded-md"
              >
                <div class="flex flex-row items-center justify-between w-full">
                  <div class="flex flex-col gap-4 justify-between py-2 h-full">
                    <div
                      class="text-xs text-white font-semibold text-shadow-md tracking-widest"
                    >
                      Approved
                    </div>
                    <div
                      class="text-4xl font-semibold text-white text-shadow-lg tracking-widest"
                    >
                      {{ dashboardCount?.summary?.approved }}
                    </div>
                  </div>
                  <div
                    class="bg-[#81e424] inset-shadow-sm inset-shadow-black/50 w-10 h-10 rounded-full inset-shadow-sm flex items-center justify-center"
                  >
                    <div
                      class="pi pi-check text-[#51881e] !text-shadow-md
"
                    ></div>
                  </div>
                </div>
              </div>
              <div
                class=" px-3 flex flex-row gap-5 shadow-lg bg-gradient-to-r from-[#F86464] to-[#f38282] border border-gray-200 flex-1 rounded-md"
              >
                <div class="flex flex-row items-center justify-between w-full">
                  <div class="flex flex-col gap-4 justify-between py-2 h-full">
                    <div
                      class="text-xs text-white font-semibold text-shadow-md tracking-widest"
                    >
                      Rejected
                    </div>
                    <div
                      class="text-4xl font-semibold text-white text-shadow-lg tracking-widest"
                    >
                      {{ dashboardCount?.summary?.rejected }}
                    </div>
                  </div>
                  <div
                    class="bg-[#F86464] inset-shadow-sm inset-shadow-black/50 w-10 h-10 rounded-full inset-shadow-sm flex items-center justify-center"
                  >
                    <div
                      class="pi pi-times text-[#c42d2d] !text-shadow-md
"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-2 relative">
              <input
                type="text"
                pInputText
                [(ngModel)]="search"
                class="w-full !text-sm !tracking-wide !border-gray-200"
                placeholder="Search by name"
                (keyup)="Search(search)"
              />
              <i
                class="pi pi-search !text-sm absolute top-2 right-3 !text-gray-500"
              ></i>
            </div>
            <div
              class="w-full p-2 md:flex flex-col items-center justify-center hidden md:block"
            >
              <div class="w-full">
                <p-table
                  #fTable
                  dataKey="id"
                  styleClass="!w-full"
                  tableStyleClass="!w-full border border-gray-200"
                  [tableStyle]="{ 'min-width': '50rem' }"
                  [value]="PagingSignal().data"
                  [paginator]="true"
                  [rows]="Query.PageSize"
                  [totalRecords]="PagingSignal().totalElements"
                  [rowsPerPageOptions]="[10, 20, 30, 50]"
                  size="small"
                  [lazy]="true"
                  (onLazyLoad)="NextPage($event)"
                >
                  <ng-template #header>
                    <tr>
                      <th
                        class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[30%]"
                      >
                        Username
                      </th>
                      <th
                        class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[15%]"
                      >
                        Requested Role
                      </th>
                      <th
                        class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[25%]"
                      >
                        Justification
                      </th>
                      <th
                        class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[15%]"
                      >
                        Requested Date
                      </th>
                      <th
                        class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[15%]"
                      >
                        Status
                      </th>
                      <th
                        class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[10%]"
                      >
                        Action
                      </th>
                    </tr>
                  </ng-template>
                  <ng-template #body let-data>
                    <tr>
                      <td class="!text-center !text-sm !border-gray-200">
                        {{ data.user.username }}
                      </td>
                      <td class="!text-center !text-sm !border-gray-200">
                        {{ data.requestedRole }}
                      </td>
                      <td class="!text-center !text-sm !border-gray-200">
                        {{ data.justification }}
                      </td>
                      <td class="!text-center !text-sm !border-gray-200">
                        {{ data.createdAt | date : 'dd/MM/YYYY' }}
                      </td>
                      <td class="!text-center !text-sm !border-gray-200">
                        <p-tag
                          styleClass="!tracking-wider !text-xs !px-4 !rounded-full"
                          [value]="data.status"
                          [severity]="SeverityStatus(data.status)"
                        ></p-tag>
                      </td>
                      <td>
                        <div
                          *ngIf="data.status === 'Pending'"
                          class="!text-center !text-sm flex flex-row justify-center items-center !border-gray-200"
                        >
                          <p-button
                            (onClick)="ActionClick(data.id, 'approve')"
                            styleClass="!text-xs"
                            [text]="true"
                            severity="success"
                            pTooltip="Approve"
                            tooltipPosition="top"
                            ><ng-template pTemplate="icon">
                              <i
                                class="pi pi-check-circle !text-[15px]"
                              ></i> </ng-template
                          ></p-button>
                          <p-button
                            (onClick)="ActionClick(data.id, 'reject')"
                            styleClass="!text-xs"
                            [text]="true"
                            severity="danger"
                            pTooltip="Reject"
                            tooltipPosition="top"
                            ><ng-template pTemplate="icon">
                              <i
                                class="pi pi-times-circle !text-[15px]"
                              ></i> </ng-template
                          ></p-button>
                        </div>
                      </td>
                    </tr>
                  </ng-template>
                  <ng-template #emptymessage>
                    <tr>
                      <td
                        colspan="100%"
                        class="!w-full !text-center !text-gray-500 !text-sm"
                      >
                        No data found.
                      </td>
                    </tr>
                  </ng-template>
                </p-table>
              </div>
            </div>
            <div class="block md:hidden pb-20 mt-3">
              <p-dataview
                [value]="PagingSignal().data"
                [rows]="Query.PageSize"
                [paginator]="true"
              >
                <ng-template #list let-items>
                  <div class="grid grid-cols-12 gap-4 grid-nogutter">
                    <div
                      class="col-span-12"
                      *ngFor="let item of items; let first = first"
                    >
                      <div
                        class="flex flex-col sm:flex-row sm:items-center px-6 pt-6 pb-2 gap-4"
                        [ngClass]="{
                          'border-t border-gray-200': !first
                        }"
                      >
                        <div
                          class="flex flex-col gap-1 tracking-wider text-gray-700"
                        >
                          <div
                            class="flex flex-row items-center justify-between pb-3"
                          >
                            <span class="font-medium"
                              >#{{ item.quotationNo }}</span
                            >
                            <p-tag
                              [value]="item.status"
                              class="!text-xs dark:!bg-surface-900 !tracking-wider !rounded-full !px-4"
                            />
                          </div>
                          <div
                            class="text-xs text-gray-600 font-thin flex flex-row justify-between items-center"
                          >
                            <div>Vendor Name</div>
                            <div>{{ item.vendorName }}</div>
                          </div>
                          <div
                            class="text-xs text-gray-600 font-thin flex flex-row justify-between items-center"
                          >
                            <div>Received Date</div>
                            <div>
                              {{ item.receivedDate | date : 'dd/MM/YYYY' }}
                            </div>
                          </div>
                          <div
                            class="text-xs text-gray-600 font-thin flex flex-row justify-between items-center"
                          >
                            <div>Amount</div>
                            <div>
                              {{ item.quotationAmount | currency : 'RM ' }}
                            </div>
                          </div>
                        </div>
                        <div
                          class="border-b border-dashed border-gray-300"
                        ></div>
                        <div
                          class="flex flex-row items-center justify-end gap-3"
                        >
                          <i
                            (click)="ActionClick(item.id, 'reject')"
                            class="pi pi-times-circle !text-sm !text-red-500 !text-shadow-md"
                          ></i>
                          <i
                            (click)="ActionClick(item.id, 'approve')"
                            class="pi pi-check-circle !text-sm !text-green-500 !text-shadow-md"
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </ng-template>
                <ng-template #emptymessage>
                  <div class="flex justify-center items-center pt-3">
                    <img src="assets/no-results.png" alt="" class="w-[50px]" />
                  </div>
                  <div
                    class="text-sm text-gray-500 tracking-wider text-center p-3"
                  >
                    No results found
                  </div>
                </ng-template>
              </p-dataview>
            </div>
          </div>
        </div>
      </div>

      <div
        *ngIf="confirmationDialog"
        class="absolute inset-0 flex items-center justify-center backdrop-blur-xs"
      >
        <div class="bg-white/90 w-[40%] shadow-md rounded-b-lg">
          <!-- Header -->
          <div
            class="bg-blue-400 rounded-t-lg px-3 py-2 text-shadow-md text-white tracking-wider"
          >
            Confirmation
          </div>

          <!-- Message -->
          <div
            class="px-3 pt-4 flex flex-row items-center gap-2 text-sm text-gray-700"
          >
            <i class="pi pi-exclamation-triangle"></i>
            <div class="tracking-wider">
              Are you sure to {{ type }} this user's role request?
            </div>
          </div>

          <!-- Reason Input -->
          <div
            *ngIf="type === 'reject'"
            class="flex flex-col px-3 text-xs tracking-wider pt-4 text-gray-700 gap-2"
          >
            <div>
              Reason <span class="italic text-gray-600">(Optional)</span>
            </div>
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
                (onClick)="CancelAction()"
                label="Cancel"
                severity="secondary"
                styleClass="!w-full !text-sm !tracking-wider !text-shadow-md !border-gray-300 !shadow-sm"
              ></p-button>
            </div>

            <div class="flex-1">
              <p-button
                (onClick)="ConfirmAction(type)"
                label="Confirm"
                severity="info"
                styleClass="!w-full !text-sm !tracking-wider !text-shadow-md !shadow-sm"
              ></p-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './request-role-view.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestRoleView implements OnInit, OnDestroy {
  @ViewChild('fTable') fTable?: Table;

  private readonly notificationService = inject(NotificationService);
  private readonly loadingService = inject(LoadingService);
  private readonly roleService = inject(RoleService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  private notificationSub!: Subscription;
  notifications: { message: string; time: Date }[] = [];

  Query: GridifyQueryExtend = {} as GridifyQueryExtend;
  PagingSignal = signal<PagingContent<Role>>({} as PagingContent<Role>);

  dashboardCount: DashboardSummaryRole | null = null;

  confirmationDialog: boolean = false;

  type: string = '';
  search: string = '';
  reason: string = '';
  id: number | null = null;

  isMobile = window.innerWidth < 770;

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 770;
  }

  constructor() {
    this.Query.Page = 1;
    this.Query.PageSize = 10;
    this.Query.OrderBy = 'CreatedAt desc';
    this.Query.Filter = null;
    this.Query.Select = null;
    this.Query.Includes = 'User';
  }

  ngOnInit(): void {
    this.loadingService.start();

    // 1️⃣ Load dashboard count
    this.roleService
      .DashboardSummary()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.dashboardCount = res;
          this.cdr.markForCheck();
        },
        error: () => this.loadingService.stop(),
        complete: () => this.loadingService.stop(),
      });

    this.notificationSub = this.notificationService.message$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((msg) => {
        if (msg) {
          console.log('📢 SignalR update received:', msg);
          this.refreshDashboard();
          this.addNotification(msg);
        }
      });

    if (this.isMobile) this.GetData();
  }

  refreshDashboard() {
    this.roleService.DashboardSummary().subscribe({
      next: (res) => {
        this.dashboardCount = res;
        this.cdr.markForCheck();
      },
    });

    this.GetData(); // refresh table too
  }

  GetData() {
    this.loadingService.start();
    this.roleService
      .GetMany(this.Query)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.PagingSignal.set(res);
          // this.dashboardCount = res;
          this.cdr.markForCheck();
        },
        error: () => this.loadingService.stop(),
        complete: () => this.loadingService.stop(),
      });
  }

  NextPage(event: TableLazyLoadEvent) {
    if ((event?.first || event?.first === 0) && event?.rows) {
      this.Query.Page = event.first / event.rows + 1 || 1;
      this.Query.PageSize = event.rows;
    }

    const sortText = BuildSortText(event);
    this.Query.OrderBy = sortText ? sortText : 'CreatedAt desc';

    const filtered = BuildFilterText(event);

    if (!filtered || filtered === '') {
      this.Query.Filter = null;
    } else {
      this.Query.Filter = filtered;
    }

    this.GetData();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.Search(this.search);
    } else if (event.key === 'Backspace' && this.search === '') {
      this.Search('');
    }
  }

  Search(data: string) {
    const filter = {
      'user.username': [
        {
          value: data,
          matchMode: '=',
          operator: 'and',
        },
      ],
    };
    if (this.fTable != null) {
      this.fTable.first = 0;
      this.fTable.filters = filter;
    }
    const event: TableLazyLoadEvent = {
      first: 0,
      rows: this.fTable?.rows,
      sortField: null,
      sortOrder: null,
      filters: filter,
    };
    this.NextPage(event);
  }

  ResetTable() {
    if (this.fTable) {
      this.fTable.first = 0;
      this.fTable.clearFilterValues();
      this.fTable.saveState();
    }
  }

  ActionClick(id: number, type: string) {
    this.id = id;
    this.reason = '';
    this.type = type;
    this.confirmationDialog = true;
    this.cdr.detectChanges();
  }

  CancelAction() {
    this.id = null;
    this.reason = '';
    this.type = '';
    this.confirmationDialog = false;
    this.cdr.detectChanges();
  }

  ConfirmAction(type: string) {
    if (this.id) {
      this.loadingService.start();
      let action$ =
        type === 'approve'
          ? this.roleService.Approve(this.id)
          : this.roleService.Reject(this.id, this.reason || undefined);
      action$
        .pipe(
          takeUntil(this.ngUnsubscribe),
          finalize(() => this.loadingService.stop())
        )
        .subscribe({
          next: (res) => {
            // Update list
            this.PagingSignal.update((state) => {
              const newData = state.data.map((item) => {
                if (item.id === this.id) {
                  const newStatus =
                    type === 'approve'
                      ? RoleRequestStatus.Approved
                      : RoleRequestStatus.Rejected;
                  return { ...item, status: newStatus };
                }
                return item;
              });
              return { ...state, data: newData };
            });
            // Update dashboard summary
            if (this.dashboardCount) {
              if (type === 'approve') {
                this.dashboardCount.summary.pending = Math.max(
                  this.dashboardCount.summary.pending - 1,
                  0
                );
                this.dashboardCount.summary.approved += 1;
              } else if (type === 'reject') {
                this.dashboardCount.summary.pending = Math.max(
                  this.dashboardCount.summary.pending - 1,
                  0
                );
                this.dashboardCount.summary.rejected += 1;
              }
            }
            this.confirmationDialog = false;
            this.cdr.markForCheck();
          },
          error: (err) => console.error(err),
        });
    }
  }

  SeverityStatus(status: RoleRequestStatus) {
    switch (status) {
      case RoleRequestStatus.Pending:
        return 'warn';
      case RoleRequestStatus.Rejected:
        return 'danger';
      default:
        return 'success';
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
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    if (this.notificationSub) this.notificationSub.unsubscribe();
    this.loadingService.stop();
  }
}
