import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
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
import { Subject, takeUntil } from 'rxjs';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { QuotationStatus } from '../../../shared/enum/enum';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

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
      <div class="text-lg font-semibold tracking-widest mb-2 text-shadow-lg">
        YL Systems
      </div>
      <div class="flex flex-row w-full">
        <div
          class="w-[5%] p-4 border-r border-gray-700/50 flex flex-col items-center"
        >
          <div class="space-y-6 w-full">
            <a
              [routerLink]="'/dashboard'"
              class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition duration-200 text-gray-400"
              pTooltip="Home"
              tooltipPosition="right"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-10v10a1 1 0 001 1h3m-6 0a1 1 0 001-1v-4a1 1 0 00-1-1h-2a1 1 0 00-1 1v4a1 1 0 001 1z"
                ></path>
              </svg>
            </a>
            <a
              [routerLink]="'/quotation'"
              class="flex items-center space-x-3 p-3 rounded-xl bg-blue-600/60 shadow-lg transition duration-200"
              pTooltip="Quotations"
              tooltipPosition="right"
            >
              <svg
                class="w-6 h-6"
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
                  d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z"
                />
              </svg>
            </a>
            <a
              href="#"
              class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition duration-200 text-gray-400"
              pTooltip="Purchase Order"
              tooltipPosition="right"
            >
              <svg
                class="w-6 h-6"
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
                  d="M9 8h6m-6 4h6m-6 4h6M6 3v18l2-2 2 2 2-2 2 2 2-2 2 2V3l-2 2-2-2-2 2-2-2-2 2-2-2Z"
                />
              </svg>
            </a>
            <a
              href="#"
              class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition duration-200 text-gray-400"
              pTooltip="Jobs"
              tooltipPosition="right"
            >
              <svg
                class="w-6 h-6 "
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
                  d="M8 7H5a2 2 0 0 0-2 2v4m5-6h8M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m0 0h3a2 2 0 0 1 2 2v4m0 0v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6m18 0s-4 2-9 2-9-2-9-2m9-2h.01"
                />
              </svg>
            </a>
            <a
              href="#"
              class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition duration-200 text-gray-400"
              pTooltip="Delivery"
              tooltipPosition="right"
            >
              <svg
                class="w-6 h-6"
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
                  d="M13 7h6l2 4m-8-4v8H9m4-8V6c0-.26522-.1054-.51957-.2929-.70711C12.5196 5.10536 12.2652 5 12 5H4c-.26522 0-.51957.10536-.70711.29289C3.10536 5.48043 3 5.73478 3 6v9h2m14 0h2v-4m0 0h-5M8 8.66669V10l1.5 1.5m10 5c0 1.3807-1.1193 2.5-2.5 2.5s-2.5-1.1193-2.5-2.5S15.6193 14 17 14s2.5 1.1193 2.5 2.5Zm-10 0C9.5 17.8807 8.38071 19 7 19s-2.5-1.1193-2.5-2.5S5.61929 14 7 14s2.5 1.1193 2.5 2.5Z"
                />
              </svg>
            </a>
          </div>
        </div>

        <div class="w-[95%] p-4 space-y-4">
          <div class="h-[45%]">
            <div
              class="bg-black/30 p-4 rounded-xl border border-gray-700/50 shadow-md flex flex-col"
            >
              <h3
                class="text-lg font-semibold mb-3 text-blue-400 tracking-wider"
              >
                Quotations Management
              </h3>
              <div class="flex space-x-4 mb-4">
                <div
                  class="text-center flex flex-row items-center justify-center gap-5 shadow-md bg-black/20 flex-1 py-4 rounded-md"
                >
                  <div class="">
                    <img src="assets/drafts.png" alt="" class="w-[30px]" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <div
                      class="text-3xl font-semibold text-white text-shadow-md tracking-widest"
                    >
                      32
                    </div>
                    <div class="text-xs text-gray-400 tracking-wider">
                      Drafts
                    </div>
                  </div>
                </div>
                <div
                  class="text-center bg-black/20 flex-1 py-4 rounded-md shadow-md"
                >
                  <div
                    class="text-3xl font-semibold tracking-widest text-yellow-400 text-shadow-md"
                  >
                    15
                  </div>
                  <div class="text-xs text-gray-400 tracking-wider">
                    Pending Approval
                  </div>
                </div>
                <div
                  class="text-center bg-black/20 flex-1 py-4 rounded-md shadow-md"
                >
                  <div
                    class="text-3xl font-semibold tracking-widest text-green-400 text-shadow-md"
                  >
                    1.5
                  </div>
                  <div class="text-xs text-gray-400 tracking-wider">
                    Approved
                  </div>
                </div>
                <div
                  [routerLink]="'/quotation/form/'"
                  class="text-center flex flex-col gap-3 items-center justify-center hover:bg-black/50 cursor-pointer bg-black/20 flex-1 py-4 rounded-md shadow-md"
                >
                  <div
                    class="text-3xl pi pi-plus font-semibold tracking-widest text-green-400 text-shadow-md"
                  ></div>
                  <div class="text-xs text-gray-400 tracking-wider italic">
                    Add New Quotation
                  </div>
                </div>
              </div>
              <div class="mb-2">
                <input
                  type="text"
                  pInputText
                  class="w-full !bg-black/30 !border-none !text-white/80"
                  placeholder="Search by quotation no"
                />
              </div>
              <div class="w-full p-2 flex flex-col items-center justify-center">
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
  @ViewChild('fTable') fTable?: Table;

  private readonly loadingService = inject(LoadingService);
  private readonly quotationService = inject(QuotationService);
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  Query: GridifyQueryExtend = {} as GridifyQueryExtend;
  PagingSignal = signal<{ Data: any[]; TotalElements: number }>({
    Data: [],
    TotalElements: 0,
  });
  search: string = '';

  constructor() {
    this.Query.Page = 1;
    this.Query.PageSize = 10;
    this.Query.OrderBy = 'CreatedAt desc';
    this.Query.Filter = null;
    this.Query.Select = null;
  }

  ngOnInit(): void {}

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
      Tenant_Name: [
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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.loadingService.stop();
  }
}
