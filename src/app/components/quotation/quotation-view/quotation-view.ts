import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
import { finalize, Subject, takeUntil } from 'rxjs';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { QuotationStatus } from '../../../shared/enum/enum';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { DataViewModule } from 'primeng/dataview';

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
    SidebarComponent,
    DataViewModule,
  ],
  template: ` <div
    class="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center"
    style="background-image: url('assets/background.png');"
  >
    <div class="absolute inset-0 backdrop-blur-sm bg-black/40 z-10"></div>
    <div
      class="relative z-20 border border-gray-400/30 p-4 rounded-3xl bg-black/20 
          w-[98%] min-h-[98vh] shadow-xl
          shadow-[0_0_40px_rgba(173,216,230,0.5)] text-white backdrop-filter backdrop-blur-xl
          flex flex-col"
    >
      <div
        class="text-lg font-semibold tracking-widest mb-2 text-shadow-lg"
      ></div>
      <div class="flex flex-row w-full">
        <app-sidebar *ngIf="!isMobile"></app-sidebar>

        <div class="w-full">
          <div class="pt-10">
            <div
              class="bg-black/30 p-4 rounded-xl border border-gray-700/50 shadow-md flex flex-col"
            >
              <h3
                class="text-lg font-semibold mb-3 text-blue-400 tracking-wider"
              >
                Quotations Management
              </h3>
              <div class="grid grid-cols-2 gap-2 mb-4">
                <div
                  class="text-center flex flex-row items-center justify-center gap-5 shadow-md bg-black/20 flex-1 py-4 rounded-md"
                >
                  <!-- <div class="shadow-lg p-3 rounded-full pl-4 bg-black/50">
                    <img src="assets/drafts.png" alt="" class="w-[30px]" />
                  </div> -->
                  <div class="flex flex-col gap-2">
                    <div
                      class="text-3xl font-semibold text-yellow-400 text-shadow-md tracking-widest"
                    >
                      {{ dashboardCount?.pending }}
                    </div>
                    <div class="text-xs text-gray-400 tracking-wider">
                      Pending Approval
                    </div>
                  </div>
                </div>
                <div
                  class="text-center flex flex-row items-center justify-center gap-5 shadow-md bg-black/20 flex-1 py-4 rounded-md"
                >
                  <!-- <div class="shadow-lg p-3 rounded-full pl-4 pb-4 bg-black/50">
                    <img src="assets/pending.png" alt="" class="w-[30px]" />
                  </div> -->
                  <div class="flex flex-col gap-2">
                    <div
                      class="text-3xl font-semibold tracking-widest text-green-400 text-shadow-md"
                    >
                      {{ dashboardCount?.approved }}
                    </div>
                    <div class="text-xs text-gray-400 tracking-wider">
                      Approved
                    </div>
                  </div>
                </div>
                <div
                  class="text-center flex flex-row items-center justify-center gap-5 shadow-md bg-black/20 flex-1 py-4 rounded-md"
                >
                  <!-- <div class="shadow-lg p-3 rounded-full pl-4 pb-4 bg-black/50">
                    <img src="assets/ready.png" alt="" class="w-[30px]" />
                  </div> -->
                  <div class="flex flex-col gap-2">
                    <div
                      class="text-3xl font-semibold tracking-widest text-red-400 text-shadow-md"
                    >
                      {{ dashboardCount?.rejected }}
                    </div>
                    <div class="text-xs text-gray-400 tracking-wider">
                      Rejected
                    </div>
                  </div>
                </div>
                <div
                  [routerLink]="'/quotation/form/'"
                  class="text-center flex flex-col gap-3 items-center justify-center hover:bg-black/50 cursor-pointer bg-black/20 flex-1 py-4 rounded-md shadow-md"
                >
                  <div
                    class="text-3xl pi pi-plus font-semibold tracking-widest text-green-400 text-shadow-md"
                  ></div>
                  <div class="text-xs text-gray-400 tracking-wider">
                    Add New Quotation
                  </div>
                </div>
              </div>
              <div class="mb-2">
                <input
                  type="text"
                  pInputText
                  [(ngModel)]="search"
                  class="w-full !bg-black/30 !border-none !text-white/80 placeholder:!text-white/70 !text-sm !tracking-wide"
                  placeholder="Search by quotation no"
                  (keyup)="Search(search)"
                />
              </div>
              <div
                class="w-full p-2 flex flex-col items-center justify-center hidden 2xl:block"
              >
                <div class="flex-grow w-full">
                  <p-table
                    #fTable
                    dataKey="id"
                    styleClass="!w-full"
                    tableStyleClass="!w-full"
                    [tableStyle]="{ 'min-width': '65rem' }"
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
                          class="!border-none !text-center !font-thin tracking-wider !w-[20%] !bg-black/20"
                        >
                          Quotation No
                        </th>
                        <th
                          class="!border-none !text-center !font-thin tracking-wider !w-[20%] !bg-black/20"
                        >
                          Vendor Name
                        </th>
                        <th
                          class="!border-none !text-center !font-thin tracking-wider !w-[20%] !bg-black/20"
                        >
                          Received Date
                        </th>
                        <th
                          class="!border-none !text-center !font-thin tracking-wider !w-[15%] !bg-black/20"
                        >
                          Amount
                        </th>
                        <th
                          class="!border-none !text-center !font-thin tracking-wider !w-[15%] !bg-black/20"
                        >
                          Status
                        </th>
                        <th
                          class="!border-none !text-center !font-thin tracking-wider !w-[10%] !bg-black/20"
                        >
                          Action
                        </th>
                      </tr>
                    </ng-template>
                    <ng-template #body let-data>
                      <tr>
                        <td class="!text-center">
                          {{ data.quotationNo }}
                        </td>
                        <td class="!text-center">
                          {{ data.vendorName }}
                        </td>
                        <td class="!text-center">
                          {{ data.receivedDate | date : 'dd/MM/YYYY' }}
                        </td>
                        <td class="!text-center">
                          {{ data.quotationAmount | currency : 'RM ' }}
                        </td>
                        <td class="!text-center">
                          <p-tag
                            styleClass="!tracking-wider !px-3"
                            [value]="DisplayStatus(data.status)"
                            [severity]="SeverityStatus(data.status)"
                          ></p-tag>
                        </td>
                        <td class="!text-center">
                          <p-button
                            icon="pi pi-pencil"
                            styleClass="!text-xs"
                            [text]="true"
                            severity="info"
                            pTooltip="Edit"
                            ><ng-template pTemplate="icon">
                              <i
                                class="pi pi-pencil !text-[15px]"
                              ></i> </ng-template
                          ></p-button>
                        </td>
                      </tr>
                    </ng-template>
                    <ng-template #emptymessage> </ng-template>
                    <tr>
                      <td colspan="100%">No data found.</td>
                    </tr>
                  </p-table>
                </div>
              </div>
              <div class="block 2xl:hidden pb-20 mt-3">
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
                          <div
                            class="flex flex-col gap-1 tracking-wider text-white"
                          >
                            <div
                              class="relative flex flex-row items-center justify-between"
                            >
                              <span class="font-medium mb-3"
                                >#{{ item.quotationNo }}</span
                              >
                              <p-tag
                                [value]="DisplayStatus(item.status)"
                                [severity]="SeverityStatus(item.status)"
                                class="absolute -top-3 -right-2 !text-xs dark:!bg-surface-900 !tracking-wider !rounded-full !px-4"
                              />
                            </div>
                            <div
                              class="text-xs text-white/70 font-thin flex flex-row justify-between items-center"
                            >
                              <div>Vendor Name</div>
                              <div>{{ item.vendorName }}</div>
                            </div>
                            <div
                              class="text-xs text-white/70 font-thin flex flex-row justify-between items-center"
                            >
                              <div>Received Date</div>
                              <div>
                                {{ item.receivedDate | date : 'dd/MM/YYYY' }}
                              </div>
                            </div>
                            <div
                              class="text-xs text-white/70 font-thin flex flex-row justify-between items-center"
                            >
                              <div>Amount</div>
                              <div>
                                {{ item.quotationAmount | currency : 'RM ' }}
                              </div>
                            </div>
                          </div>
                          <div
                            class="border-b border-dashed border-white/20 "
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
                      <img
                        src="assets/no-results.png"
                        alt=""
                        class="w-[50px]"
                      />
                    </div>
                    <div
                      class="text-sm text-white tracking-wider text-center p-3"
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
    </div>
  </div>`,
  styleUrl: './quotation-view.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotationView implements OnInit, OnDestroy {
  isMobile = window.innerWidth < 770;
  @ViewChild('fTable') fTable?: Table;

  private readonly loadingService = inject(LoadingService);
  private readonly quotationService = inject(QuotationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

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

  constructor() {
    this.Query.Page = 1;
    this.Query.PageSize = 10;
    this.Query.OrderBy = 'CreatedAt desc';
    this.Query.Filter = null;
    this.Query.Select = null;
  }

  ngOnInit(): void {
    this.loadingService.start();
    this.quotationService
      .GetDashboardCount()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.dashboardCount = res;
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
      case QuotationStatus.Pending:
        return 'Pending';
      case QuotationStatus.Approved:
        return 'Approved';
      default:
        return 'Rejected';
    }
  }

  SeverityStatus(status: QuotationStatus) {
    switch (status) {
      case QuotationStatus.Approved:
        return 'success';
      case QuotationStatus.Pending:
        return 'warning';
      default:
        return 'danger';
    }
  }

  ActionClick(id: number, type: string) {
    if (type === 'edit') {
      this.router.navigate(['/quotation/form'], { queryParams: { id } });
      return;
    }

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
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.loadingService.stop();
  }
}
