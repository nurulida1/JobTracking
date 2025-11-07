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
import { LoadingService } from '../../../services/loading.service';
import { QuotationService } from '../../../services/quotationService.service';
import {
  BuildFilterText,
  BuildSortText,
  GridifyQueryExtend,
} from '../../../shared/helpers/helpers';
import { finalize, Subject, Subscription, takeUntil } from 'rxjs';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { QuotationStatus } from '../../../shared/enum/enum';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { NotificationService } from '../../../services/notificationService.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-quotation-view',
  imports: [
    CommonModule,
    RouterLink,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    InputTextModule,
    FormsModule,
    DataViewModule,
    ConfirmDialogModule,
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
              Quotations Management
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
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
                      {{ dashboardCount?.pending }}
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
                      {{ dashboardCount?.approved }}
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
                      {{ dashboardCount?.rejected }}
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

              <div
                [routerLink]="'/quotation/form/'"
                class=" px-3 flex flex-row gap-5 shadow-lg cursor-pointer hover:scale-102 bg-gradient-to-r from-[#F79355] to-[#f5b37e] border border-gray-200 flex-1 rounded-md"
              >
                <div
                  class="flex flex-row items-center justify-center gap-2 w-full"
                >
                  <div class="flex flex-col text-center gap-1">
                    <div
                      class="text-xs text-white text-shadow-lg text-shadow-black/30 tracking-widest font-bold"
                    >
                      Add New Quotation
                    </div>
                    <div
                      class="text-[10px] italic text-white/80 text-shadow-md tracking-wider"
                    >
                      Tap here to create your next quotation.
                    </div>
                  </div>
                  <div
                    class="bg-[#F79355] w-10 h-10 rounded-full inset-shadow-sm inset-shadow-black/50 flex items-center justify-center"
                  >
                    <div
                      class="pi pi-plus text-[#a04f1c] !text-shadow-md
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
                placeholder="Search by quotation no"
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
                  [value]="PagingSignal().Data"
                  [paginator]="true"
                  [rows]="Query.PageSize"
                  [totalRecords]="PagingSignal().TotalElements"
                  [rowsPerPageOptions]="[10, 20, 30, 50]"
                  size="small"
                  [lazy]="true"
                  (onLazyLoad)="NextPage($event)"
                >
                  <ng-template #header>
                    <tr>
                      <th
                        class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[20%]"
                      >
                        Quotation No
                      </th>
                      <th
                        class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[20%]"
                      >
                        Vendor Name
                      </th>
                      <th
                        class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[20%]"
                      >
                        Received Date
                      </th>
                      <th
                        class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[15%]"
                      >
                        Amount
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
                        {{ data.quotationNo }}
                      </td>
                      <td class="!text-center !text-sm !border-gray-200">
                        {{ data.vendorName }}
                      </td>
                      <td class="!text-center !text-sm !border-gray-200">
                        {{ data.receivedDate | date : 'dd/MM/YYYY' }}
                      </td>
                      <td class="!text-center !text-sm !border-gray-200">
                        {{ data.quotationAmount | currency : 'RM ' }}
                      </td>
                      <td class="!text-center !text-sm !border-gray-200">
                        <p-tag
                          styleClass="!tracking-wider !text-xs !px-4 !rounded-full"
                          [value]="DisplayStatus(data.status)"
                          [severity]="SeverityStatus(data.status)"
                        ></p-tag>
                      </td>
                      <td
                        class="!text-center !text-sm flex flex-row justify-center items-center !border-gray-200"
                      >
                        <p-button
                          *ngIf="data.status === 0"
                          (onClick)="ActionClick(data.id, 'approve', $event)"
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
                          *ngIf="data.status === 0"
                          (onClick)="ActionClick(data.id, 'reject', $event)"
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
                        <p-button
                          (onClick)="ActionClick(data.id, 'edit')"
                          styleClass="!text-xs"
                          [text]="true"
                          severity="info"
                          pTooltip="Edit"
                          tooltipPosition="top"
                          ><ng-template pTemplate="icon">
                            <i
                              class="pi pi-pencil !text-[15px]"
                            ></i> </ng-template
                        ></p-button>
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
                [value]="PagingSignal().Data"
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
                              [value]="DisplayStatus(item.status)"
                              [severity]="SeverityStatus(item.status)"
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
                            *ngIf="item.status === QuotationStatus.Pending"
                            (click)="ActionClick(item.id, 'reject')"
                            class="pi pi-times-circle !text-sm !text-red-500 !text-shadow-md"
                          ></i>
                          <i
                            *ngIf="item.status === QuotationStatus.Pending"
                            (click)="ActionClick(item.id, 'approve')"
                            class="pi pi-check-circle !text-sm !text-green-500 !text-shadow-md"
                          ></i>
                          <i
                            (click)="ActionClick(item.id, 'edit')"
                            class="pi pi-pencil !text-sm !text-blue-500 !text-shadow-md"
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
    </div>
    <p-confirmdialog />
  `,
  styleUrl: './quotation-view.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotationView implements OnInit, OnDestroy {
  @ViewChild('fTable') fTable?: Table;

  private readonly notificationService = inject(NotificationService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly quotationService = inject(QuotationService);
  private readonly loadingService = inject(LoadingService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  private notificationSub!: Subscription;
  notifications: { message: string; time: Date }[] = [];

  Query: GridifyQueryExtend = {} as GridifyQueryExtend;
  PagingSignal = signal<{ Data: any[]; TotalElements: number }>({
    Data: [],
    TotalElements: 0,
  });
  dashboardCount: {
    pending: number;
    approved: number;
    rejected: number;
  } | null = null;
  search: string = '';
  QuotationStatus = QuotationStatus;
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
  }

  ngOnInit(): void {
    this.loadingService.start();

    // 1️⃣ Load dashboard count
    this.quotationService
      .GetDashboardCount()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.dashboardCount = res;
          this.cdr.markForCheck();
        },
        error: () => this.loadingService.stop(),
        complete: () => this.loadingService.stop(),
      });

    // 2️⃣ Subscribe to SignalR updates
    this.notificationSub = this.notificationService.message$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((msg) => {
        if (msg) {
          console.log('📢 SignalR update received:', msg);
          this.refreshDashboard(); // refresh both table + counts
          this.addNotification(msg);
        }
      });
  }

  refreshDashboard() {
    this.quotationService.GetDashboardCount().subscribe({
      next: (res) => {
        this.dashboardCount = res;
        this.cdr.markForCheck();
      },
    });

    this.GetData(); // refresh table too
  }

  GetData() {
    this.loadingService.start();
    this.quotationService
      .GetMany(this.Query)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.PagingSignal.set({
            Data: res.data,
            TotalElements: res.totalElements,
          });
        },
        error: (err) => {
          this.loadingService.stop();
        },
        complete: () => {
          this.loadingService.stop();
        },
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
      quotationNo: [
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

  DisplayStatus(status: QuotationStatus) {
    switch (status) {
      case QuotationStatus.Approved:
        return 'Approved';
      case QuotationStatus.Pending:
        return 'Pending';
      default:
        return 'Rejected';
    }
  }

  SeverityStatus(status: QuotationStatus) {
    switch (status) {
      case QuotationStatus.Approved:
        return 'success';
      case QuotationStatus.Pending:
        return 'warn';
      default:
        return 'danger';
    }
  }

  ActionClick(id: number, type: string, event?: Event) {
    if (type === 'edit') {
      this.router.navigate(['/quotation/form'], { queryParams: { id } });
      return;
    }

    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirm',
      },
      accept: () => {
        this.loadingService.start();

        let action$ =
          type === 'approve'
            ? this.quotationService.Approve(id)
            : this.quotationService.Reject(id);

        action$
          .pipe(
            takeUntil(this.ngUnsubscribe),
            finalize(() => this.loadingService.stop())
          )
          .subscribe({
            next: (res) => {
              // Update PagingSignal
              this.PagingSignal.update((state) => {
                const newData = state.Data.map((item) => {
                  if (item.id === id) {
                    const newStatus =
                      type === 'approve'
                        ? QuotationStatus.Approved
                        : QuotationStatus.Rejected;
                    return { ...item, status: newStatus };
                  }
                  return item;
                });
                return { ...state, Data: newData };
              });

              // Update dashboardCount locally
              if (this.dashboardCount) {
                if (type === 'approve') {
                  this.dashboardCount.pending = Math.max(
                    this.dashboardCount.pending - 1,
                    0
                  );
                  this.dashboardCount.approved += 1;
                } else if (type === 'reject') {
                  this.dashboardCount.pending = Math.max(
                    this.dashboardCount.pending - 1,
                    0
                  );
                  this.dashboardCount.rejected += 1;
                }
              }

              this.cdr.markForCheck();
            },
            error: (err) => {
              console.error(err);
            },
          });
      },
      reject: () => {},
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
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    if (this.notificationSub) this.notificationSub.unsubscribe();
    this.loadingService.stop();
  }
}
