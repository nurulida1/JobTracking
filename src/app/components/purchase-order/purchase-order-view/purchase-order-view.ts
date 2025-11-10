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
import { NotificationService } from '../../../services/notificationService.service';
import { ConfirmationService } from 'primeng/api';
import { PurchaseOrderService } from '../../../services/purchaseOrderService.service';
import { LoadingService } from '../../../services/loading.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import {
  BuildFilterText,
  BuildSortText,
  GridifyQueryExtend,
  PagingContent,
} from '../../../shared/helpers/helpers';
import { PurchaseOrderDto } from '../../../models/PurchaseOrderModel';
import { PurchaseOrderStatus } from '../../../shared/enum/enum';

@Component({
  selector: 'app-purchase-order-view',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    InputTextModule,
    FormsModule,
    DataViewModule,
    ConfirmDialogModule,
  ],
  template: ` <div
      class="relative w-full bg-cover bg-center flex items-center justify-center bg-white/60"
    >
      <div class="relative w-full min-h-[98vh] md:min-h-[91.8vh] flex flex-col">
        <div class="w-full pt-14 md:pt-0">
          <div class="p-4 flex flex-col">
            <h3
              class="text-xl font-semibold mb-3 text-gray-600 text-shadow-md text-shadow-black/10 tracking-wider"
            >
              Purchase Order Management
            </h3>

            <div class="w-full mb-2 flex flex-row items-center gap-2">
              <div class="relative w-[70%] md:w-[85%]">
                <input
                  type="text"
                  pInputText
                  [(ngModel)]="search"
                  class="w-full !text-sm !tracking-wide !border-gray-200"
                  placeholder="Search by PO"
                  (keyup)="Search(search)"
                />
                <i
                  class="pi pi-search !text-sm absolute top-2 right-3 !text-gray-500"
                ></i>
              </div>
              <div class="w-[30%] md:w-[15%]">
                <p-button
                  label="Create New PO"
                  severity="info"
                  icon="pi pi-plus"
                  styleClass="!text-xs !tracking-wider !w-full !shadow-md !text-shadow-md whitespace-nowrap"
                ></p-button>
              </div>
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
                        class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[20%]"
                      >
                        PO
                      </th>
                      <th
                        class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[20%]"
                      >
                        PO Date
                      </th>
                      <th
                        class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[20%]"
                      >
                        Amount
                      </th>
                      <th
                        class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[15%]"
                      >
                        Quotation ID
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
                        {{ data.po }}
                      </td>
                      <td class="!text-center !text-sm !border-gray-200">
                        {{ data.poDate | date : 'dd/MM/YYYY' }}
                      </td>
                      <td class="!text-center !text-sm !border-gray-200">
                        {{ data.poAmount | currency : 'RM ' }}
                      </td>
                      <td class="!text-center !text-sm !border-gray-200">
                        <a
                          class="text-cyan-600 hover:underline cursor-pointer"
                          (click)="ActionClick(data.id, 'quotation')"
                        >
                          {{ data.quotationId }}</a
                        >
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
                [value]="PagingSignal().data"
                [rows]="Query.PageSize"
                [paginator]="true"
                styleClass="!border !border-gray-200"
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
                            <span class="font-semibold">#{{ item.po }}</span>
                            <p-tag
                              [value]="item.status"
                              [severity]="SeverityStatus(item.status)"
                              class="!text-xs dark:!bg-surface-900 !tracking-wider !rounded-full !px-4"
                            />
                          </div>
                          <div
                            class="text-xs text-gray-600 font-thin flex flex-row justify-between items-center"
                          >
                            <div>Received Date</div>
                            <div>
                              {{ item.poReceivedDate | date : 'dd/MM/YYYY' }}
                            </div>
                          </div>
                          <div
                            class="text-xs text-gray-600 font-thin flex flex-row justify-between items-center"
                          >
                            <div>PO Date</div>
                            <div>
                              {{ item.poDate | date : 'dd/MM/YYYY' }}
                            </div>
                          </div>
                          <div
                            class="text-xs text-gray-600 font-thin flex flex-row justify-between items-center"
                          >
                            <div>Amount</div>
                            <div>
                              {{ item.poAmount | currency : 'RM ' }}
                            </div>
                          </div>
                          <div
                            class="text-xs text-gray-600 font-thin flex flex-row justify-between items-center"
                          >
                            <div>Quotation ID</div>
                            <div
                              (click)="ActionClick(item.id, 'quotation')"
                              class="text-cyan-600 hover:underline cursor-pointer"
                            >
                              {{ item.quotationId }}
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
                            *ngIf="item.status === 'Draft'"
                            (click)="ActionClick(item.id, 'reject')"
                            class="pi pi-times-circle !text-sm !text-red-500 !text-shadow-md"
                          ></i>
                          <i
                            *ngIf="item.status === 'Draft'"
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
    <p-confirmdialog />`,
  styleUrl: './purchase-order-view.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseOrderView implements OnInit, OnDestroy {
  @ViewChild('fTable') fTable?: Table;

  private readonly notificationService = inject(NotificationService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly purchaseOrderService = inject(PurchaseOrderService);
  private readonly loadingService = inject(LoadingService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  private notificationSub!: Subscription;
  notifications: { message: string; time: Date }[] = [];

  Query: GridifyQueryExtend = {} as GridifyQueryExtend;
  PagingSignal = signal<PagingContent<PurchaseOrderDto>>(
    {} as PagingContent<PurchaseOrderDto>
  );

  search: string = '';
  isMobile = window.innerWidth < 770;

  @HostListener('window: resize', [])
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
    this.notificationSub = this.notificationService.message$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((msg) => {
        if (msg) {
          this.addNotification(msg);
        }
      });

    if (this.isMobile) this.GetData();
  }

  GetData() {
    this.loadingService.start();
    this.purchaseOrderService
      .GetMany(this.Query)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.PagingSignal.set(res);
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

  ActionClick(id: number, type: string, event?: Event) {
    if (type === 'edit') {
      this.router.navigate(['/purchase-order/form'], { queryParams: { id } });
      return;
    }

    if (type === 'quotation') {
      this.router.navigate(['/quotation/form'], { queryParams: { id } });
      return;
    }
  }

  SeverityStatus(status: PurchaseOrderStatus) {
    switch (status) {
      case PurchaseOrderStatus.Approved:
        return 'success';
      case PurchaseOrderStatus.Draft:
        return 'warn';
      default:
        return 'danger';
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
