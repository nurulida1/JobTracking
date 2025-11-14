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
import { InputTextModule } from 'primeng/inputtext';
import { LoadingService } from '../../../services/loading.service';
import { DeliveryService } from '../../../services/deliveryService.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { NotificationService } from '../../../services/notificationService.service';
import {
  BuildFilterText,
  BuildSortText,
  GridifyQueryExtend,
} from '../../../shared/helpers/helpers';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { DeliveryStatus } from '../../../shared/enum/enum';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DeliveryRoutingModule } from '../delivery-rounting.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-delivery-view',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    DataViewModule,
    AvatarModule,
    TagModule,
    ButtonModule,
    TableModule,
    RouterLink,
  ],
  template: `<div
    class="relative w-full bg-cover bg-center flex items-center justify-center bg-white/60"
  >
    <div
      class="relative w-full min-h-[98vh] md:min-h-[91.8vh] flex flex-col pt-4 px-3 md:px-5 md:pt-4"
    >
      <div
        class="text-xl pt-13 md:pt-0 tracking-widest pb-3 text-gray-700 font-semibold"
      >
        Delivery Tracking
      </div>
      <div class="w-full flex flex-row items-center md:gap-2">
        <div class="w-full relative">
          <input
            type="text"
            pInputText
            class="w-full !text-sm !tracking-wide"
            placeholder="Search by your tracking number"
          />
          <i class="pi pi-search absolute top-3 right-3 !text-gray-600"></i>
        </div>
        <p-button
          *ngIf="!isMobile"
          [routerLink]="'/delivery/form'"
          label="Add New Delivery"
          severity="info"
          styleClass="flex items-center gap-2 !text-xs md:!text-sm !tracking-wide whitespace-nowrap"
        >
          <ng-template pTemplate="icon">
            <i class="pi pi-plus !text-xs md:!text-sm"></i>
          </ng-template>
        </p-button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-2 pt-4">
        <div
          class="flex-1 p-3 bg-white border shadow-md border-gray-200 rounded-md h-[100px] flex justify-center items-center"
        >
          <div class="flex flex-row items-center justify-between px-2 w-full">
            <div class="flex flex-col justify-between gap-2">
              <div class="text-gray-600 italic text-xs tracking-wider">
                Total delivery
              </div>
              <div class="pt-2 font-bold text-5xl text-shadow-lg text-blue-500">
                {{ dashboardCount?.total }}
              </div>
            </div>
            <div
              class="bg-gray-100 rounded-full p-3 inset-shadow-sm inset-shadow-black/30"
            >
              <img src="assets/box.png" alt="" class="w-[40px] md:w-[60px]" />
            </div>
          </div>
        </div>
        <div
          class="flex-1 p-3 bg-white border shadow-md border-gray-200 rounded-md h-[100px] flex justify-center items-center"
        >
          <div class="flex flex-row items-center justify-between px-2 w-full">
            <div class="flex flex-col justify-between gap-2">
              <div class="text-gray-600 italic text-xs tracking-wider">
                Pending
              </div>
              <div
                class="pt-2 font-bold text-5xl text-shadow-lg text-yellow-500"
              >
                {{ dashboardCount?.pending }}
              </div>
            </div>
            <div
              class="bg-gray-100 rounded-full p-3 inset-shadow-sm inset-shadow-black/30"
            >
              <img
                src="assets/pending-delivery.png"
                alt=""
                class="w-[40px] md:w-[60px]"
              />
            </div>
          </div>
        </div>
        <div
          class="flex-1 p-3 bg-white border shadow-md border-gray-200 rounded-md h-[100px] flex justify-center items-center"
        >
          <div class="flex flex-row items-center justify-between px-2 w-full">
            <div class="flex flex-col justify-between gap-2">
              <div class="text-gray-600 italic text-xs tracking-wider">
                Delivered
              </div>
              <div
                class="pt-2 font-bold text-5xl text-shadow-lg text-green-500"
              >
                {{ dashboardCount?.delivered }}
              </div>
            </div>
            <div
              class="bg-gray-100 rounded-full p-4 inset-shadow-sm inset-shadow-black/30"
            >
              <img
                src="assets/delivered.png"
                alt=""
                class="w-[40px] md:w-[60px]"
              />
            </div>
          </div>
        </div>
        <div
          *ngIf="isMobile"
          class="flex-1 p-3 bg-white border shadow-md border-gray-200 rounded-md h-[100px] flex justify-center items-center"
        >
          <div class="flex flex-row items-center justify-between px-2 w-full">
            <div class="font-bold text-xs text-gray-600 tracking-widest">
              Add New Delivery
            </div>
            <div
              class="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center inset-shadow-sm inset-shadow-black/30"
            >
              <i
                class="pi pi-plus !text-[12px] !font-bold !text-blue-500 !text-shadow-md"
              ></i>
            </div>
          </div>
        </div>
      </div>
      <div class="border-b border-gray-200 py-2"></div>
      <div class="hidden md:block w-full">
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
                  Record No
                </th>
                <th
                  class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[20%]"
                >
                  Est. Delivery Date
                </th>
                <th
                  class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[20%]"
                >
                  Delivery Date
                </th>
                <th
                  class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[15%]"
                >
                  Received By
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
                  {{ data.recordNo }}
                </td>
                <td class="!text-center !text-sm !border-gray-200">
                  {{ data.deliveryETA | date : 'dd/MM/YYYY' }}
                </td>
                <td class="!text-center !text-sm !border-gray-200">
                  {{ data.deliveryDate | date : 'dd/MM/YYYY' }}
                </td>
                <td class="!text-center !text-sm !border-gray-200">
                  {{ data.receivedBy }}
                </td>
                <td class="!text-center !text-sm !border-gray-200">
                  <p-tag
                    styleClass="!tracking-wider !text-xs !px-4 !rounded-full"
                    [value]="data.status"
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
                      <i class="pi pi-pencil !text-[15px]"></i> </ng-template
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
                    'border-t border-white/10': !first
                  }"
                >
                  <div class="flex flex-col gap-1 tracking-wider text-white">
                    <div
                      class="relative flex flex-row items-center justify-between pb-3 border-b border-white/30"
                    >
                      <span class="font-medium">#{{ item.id }}</span>
                      <p-tag
                        [value]="item.status"
                        [severity]="SeverityStatus(item.status)"
                        class="!text-xs !tracking-wider !rounded-full !px-4"
                      />
                    </div>
                    <div
                      class="pt-3 text-xs text-white/70 font-thin flex flex-row justify-between items-center"
                    >
                      <div>Received by</div>
                      <div>{{ item.receivedBy }}</div>
                    </div>
                    <div
                      class="pt-1 text-xs text-white/70 font-thin flex flex-row justify-between items-center"
                    >
                      <div>Delivery date</div>
                      <div>
                        {{ item.deliveryDate | date : 'dd/MM/YYYY' }}
                      </div>
                    </div>
                    <div
                      class="pt-1 text-xs text-white/70 font-thin flex flex-col gap-1"
                    >
                      <div class="underline">Remarks</div>
                      <div class="text-white/50 italic">
                        *{{ item.remarks }}
                      </div>
                    </div>
                  </div>
                  <div class="border-b border-dashed border-white/20"></div>
                  <div
                    class="flex flex-row items-center justify-between gap-1 text-xs pb-2"
                  >
                    <div class="flex flex-row items-center gap-2">
                      <p-avatar
                        icon="pi pi-user"
                        shape="circle"
                        styleClass="!bg-black/30 !text-white/50 !shadow-md"
                      ></p-avatar>
                      <div class="flex flex-col">
                        <div class="text-white/70">Client</div>
                        <div class="text-white">Nurul</div>
                      </div>
                    </div>
                    <div class="flex flex-row items-center gap-2">
                      <div
                        class="w-8 h-8 flex items-center justify-center bg-white/20 p-2 rounded-full shadow-md"
                      >
                        <i
                          class="pi pi-phone !text-sm !text-shadow-md !text-white"
                        ></i>
                      </div>
                      <div
                        class="w-8 h-8 flex items-center justify-center bg-white/20 p-2 rounded-full shadow-md"
                      >
                        <i
                          class="pi pi-send !text-sm !text-shadow-md !text-white"
                        ></i>
                      </div>
                    </div>
                    <!-- <i
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
                            ></i> -->
                  </div>
                </div>
              </div>
            </div>
          </ng-template>
          <ng-template #emptymessage>
            <div class="flex justify-center items-center pt-3">
              <img src="assets/no-results.png" alt="" class="w-[40px]" />
            </div>
            <div class="text-xs text-gray-500 tracking-wider text-center p-3">
              No results found
            </div>
          </ng-template>
        </p-dataview>
      </div>
    </div>
  </div>`,
  styleUrl: './delivery-view.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryView implements OnInit, OnDestroy {
  @ViewChild('fTable') fTable?: Table;

  private readonly loadingService = inject(LoadingService);
  private readonly deliveryService = inject(DeliveryService);
  private readonly notificationService = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  private notificationSub!: Subscription;
  notifications: { message: string; time: Date }[] = [];

  Query: GridifyQueryExtend = {} as GridifyQueryExtend;
  PagingSignal = signal<{ Data: any[]; TotalElements: number }>({
    Data: [],
    TotalElements: 0,
  });

  dashboardCount: {
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
  } | null = null;

  search: string = '';
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

    this.deliveryService
      .CountSummary()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.dashboardCount = res;
          this.cdr.markForCheck();
          this.GetData(); // ✅ load table after summary
        },
        error: (err) => {
          this.loadingService.stop();
        },
        complete: () => {
          this.loadingService.stop();
        },
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
  }

  refreshDashboard() {
    this.deliveryService.CountSummary().subscribe({
      next: (res) => {
        this.dashboardCount = res;
        this.cdr.markForCheck();
      },
    });

    this.GetData();
  }

  GetData() {
    this.loadingService.start();
    this.deliveryService
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
      id: [
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

  addNotification(message: string) {
    const newNotification = { message, time: new Date() };
    this.notifications = this.notifications
      ? [newNotification, ...this.notifications]
      : [newNotification];
    this.cdr.detectChanges();
  }

  ActionClick(id: number, type: string, event?: Event) {}

  SeverityStatus(status: DeliveryStatus) {
    switch (status) {
      case DeliveryStatus.Delivered:
        return 'success';
      case DeliveryStatus.Pending:
        return 'warning';
      default:
        return 'info';
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    if (this.notificationSub) this.notificationSub.unsubscribe();
    this.loadingService.stop();
  }
}
