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
import { TagModule } from 'primeng/tag';
import { LoadingService } from '../../../services/loading.service';
import { JobService } from '../../../services/jobService.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import {
  BuildFilterText,
  BuildSortText,
  GridifyQueryExtend,
  PagingContent,
} from '../../../shared/helpers/helpers';
import { JobDto } from '../../../models/JobModels';
import { NotificationService } from '../../../services/notificationService.service';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { DatePickerModule } from 'primeng/datepicker';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { DeliveryStatus } from '../../../shared/enum/enum';

@Component({
  selector: 'app-job-view',
  imports: [
    CommonModule,
    TagModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    DatePickerModule,
    TableModule,
  ],
  template: `<div
    class="relative w-full px-3 md:pt-5 md:px-6 bg-cover bg-center flex flex-col min-h-[98vh] md:min-h-[91.8vh] bg-white/60"
  >
    <div
      class="text-xl pt-16 md:pt-0 tracking-widest pb-3 font-semibold text-gray-700"
    >
      Scheduled Jobs
    </div>
    <div class="flex flex-row items-center gap-2 w-full">
      <div class="relative w-full">
        <input
          type="text"
          pInputText
          placeholder="Search"
          class="w-full placeholder:!tracking-wider !text-sm"
        />
        <i class="pi pi-search !text-gray-500 absolute top-3 right-3"></i>
      </div>
      <p-datepicker
        *ngIf="!isMobile"
        selectionMode="range"
        appendTo="body"
        showIcon="true"
        placeholder="Select range date"
        inputStyleClass="!text-sm !tracking-wide !w-[200px]"
        (onSelect)="SelectRangeDate($event)"
      ></p-datepicker>
      <p-button
        *ngIf="isMobile"
        icon="pi pi-calendar"
        styleClass="!bg-white !border-gray-300 !border-2 !text-blue-500"
        (onClick)="displayCalendar()"
      ></p-button>
    </div>
    <div
      class="mt-3 p-2 flex flex-row items-center gap-2 overflow-x-auto tracking-wide"
    >
      <div
        *ngFor="
          let status of ['All', 'Active', 'Pending', 'Delayed', 'Completed']
        "
        (click)="FilterStatus(status)"
        [ngClass]="{
          'bg-blue-500 text-white shadow-lg': filterStatus === status,
          'border bg-white border-gray-300 hover:bg-blue-500 hover:text-white text-gray-700':
            filterStatus !== status
        }"
        class="px-5 py-1 rounded-full text-sm cursor-pointer transition-all duration-200"
      >
        {{ status }}
      </div>
    </div>
    <div class="border-b border-gray-300 mt-2"></div>
    <div *ngIf="!isMobile" class="w-full">
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
              class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[10%]"
            >
              Priority
            </th>
            <th
              class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[15%]"
            >
              Record No
            </th>

            <th
              class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[15%]"
            >
              Work Order ID
            </th>
            <th
              class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[20%]"
            >
              Assigned To
            </th>
            <th
              class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[10%]"
            >
              Due Date
            </th>
            <th
              class="!text-sm !text-center !font-bold tracking-wider !bg-gray-100 !w-[10%]"
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
              <p-tag
                [value]="data.priority"
                severity="warn"
                styleClass="!text-xs !px-4"
              ></p-tag>
            </td>
            <td class="!text-center !text-sm !border-gray-200">
              {{ data.recordNo }}
            </td>
            <td class="!text-center !text-sm !border-gray-200">
              {{ data.workOrderId }}
            </td>
            <td class="!text-center !text-sm !border-gray-200">
              {{ data.assignedToUser?.fullName }}
            </td>
            <td class="!text-center !text-sm !border-gray-200">
              {{ data.dueDate | date : 'dd/MM/YYYY' }}
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
                  <i class="pi pi-check-circle !text-[15px]"></i> </ng-template
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
                  <i class="pi pi-times-circle !text-[15px]"></i> </ng-template
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
    <div class="flex flex-col pt-4" *ngIf="isMobile">
      <ng-container *ngIf="PagingSignal().totalElements > 0; else noData">
        <div
          (click)="DetailsClick()"
          class="p-2 rounded-sm bg-white border border-gray-300 flex flex-col"
        >
          <div class="flex flex-row justify-between">
            <div class="flex flex-col">
              <div class="flex flex-row items-start gap-2">
                <div
                  class="border rounded-full px-3 py-1 text-sm border-gray-300"
                >
                  #JO001
                </div>
                <div
                  class="bg-blue-200 text-blue-700 text-sm gap-1 rounded-full px-3 py-1"
                >
                  <div>In Progress</div>
                </div>
              </div>
              <div class="pt-2 text-sm tracking-wider text-gray-800">
                Inspect, and troubleshoot the cctv, fix any indentified
                problems.
              </div>
            </div>
            <div
              class="rounded-md px-3 bg-gray-300/30 p-2 flex flex-col justify-center items-center gap-1"
            >
              <div class="text-sm text-gray-400">Aug</div>
              <div class="font-semibold tracking-wider">14</div>
            </div>
          </div>
          <div class="border-b border-gray-200 my-3"></div>
          <div class="flex flex-row items-center gap-2">
            <div
              class="flex flex-row items-center text-blue-500 justify-center border rounded-full w-6 h-6"
            >
              <i class="pi pi-map-marker !text-xs"></i>
            </div>
            <div class="text-sm">YL Systems Sdn Bhd</div>
          </div>
          <div class="mt-3 gap-2 justify-center flex flex-row items-center">
            <div class="flex-1">
              <p-button
                severity="info"
                label="Start Job"
                icon="pi pi-play"
                styleClass="!tracking-wide !text-sm !px-4 !py-1 !rounded-lg !w-full"
              ></p-button>
            </div>
            <div class="flex-1">
              <p-button
                severity="danger"
                label="Stop Job"
                icon="pi pi-stop"
                styleClass="!tracking-wide !text-sm !px-4 !py-1 !rounded-lg !w-full"
              ></p-button>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
    <ng-template #noData>
      <div class="pt-6 tracking-wider text-sm w-full text-center" *ngIf="">
        <div class="flex justify-center items-center pb-3">
          <img src="assets/happy.png" alt="" class="w-[30px]" />
        </div>
        <div>No scheduled jobs available</div>
      </div>
    </ng-template>
    <div
      *ngIf="showCalendar"
      (click)="showCalendar = false"
      class="backdrop-blur-xs w-full min-h-screen absolute top-0 left-0 flex items-center justify-center"
    >
      <p-datepicker
        #calendar
        selectionMode="range"
        class="max-w-full"
        [inline]="true"
        [showWeek]="false"
        appendTo="body"
        [readonlyInput]="true"
        (onSelect)="SelectRangeDate($event)"
      />
    </div>
    <div
      *ngIf="detailDialog"
      class="backdrop-blur-xs absolute top-0 right-0 w-full min-h-[91.5vh] flex justify-end items-center transition-opacity duration-3000 ease-in-out"
    >
      <div
        class="relative px-4 mr-5 flex flex-col rounded-lg border border-gray-300 bg-white drop-shadow-lg p-2 w-[50%] min-h-[80vh]"
      >
        <div
          class="absolute top-3 right-3 cursor-pointer z-20"
          (click)="detailDialog = false"
        >
          <i class="pi pi-times"></i>
        </div>
        <div
          class="pt-10 border-b border-gray-200 mb-3 relative h-[100px] overflow-hidden"
        >
          <img
            src="assets/delivery.png"
            alt=""
            class="w-[100px] absolute bottom-0 animate-slide-across"
          />
        </div>

        <div class="flex flex-row items-center gap-3">
          <div class="text-gray-700 tracking-wider text-xl font-bold">
            Delivery details #D0OO1
          </div>
          <div
            class="px-4 py-1 font-semibold bg-violet-100 rounded-full tracking-wider text-[10px] text-violet-500 text-shadow-md"
          >
            SHIPPING
          </div>
        </div>
        <div class="relative w-full border-b border-gray-200 p-4 pt-6">
          <div class="absolute top-4 left-0">
            <div class="flex flex-col items-center gap-2">
              <div
                class="w-10 h-10 border rounded-full flex items-center justify-center bg-gray-100 border-gray-300"
              >
                <i class="pi pi-box !text-gray-500 !text-shadow-md"></i>
              </div>
              <div class="flex flex-col items-center">
                <div class="text-xs text-gray-600">Drop Date</div>
                <div class="text-[9px] tracking-wider text-gray-500">
                  10 Aug 2026
                </div>
              </div>
            </div>
          </div>

          <div class="absolute top-4 right-0">
            <div class="flex flex-col items-center gap-2">
              <div
                class="w-10 h-10 border rounded-full flex items-center justify-center bg-gray-100 border-gray-300"
              >
                <i class="pi pi-truck !text-gray-500 !text-shadow-md"></i>
              </div>
              <div class="flex flex-col items-center">
                <div class="text-xs text-gray-600">Est. Arrival</div>
                <div class="text-[9px] tracking-wider text-gray-500">
                  13 Aug 2026
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="pt-1 text-gray-500 text-xs tracking-wider">
          Date: 20 Aug 2026
        </div> -->
        <div class="flex flex-row items-center gap-2 pt-7">
          <div class="pt-10 text-gray-500 text-xs tracking-wide">
            Received By:
          </div>
          <div class="pt-10 text-gray-700 font-semibold text-xs tracking-wide">
            Nurul
          </div>
        </div>
        <div class="pt-3 text-gray-500 text-xs underline">Remarks</div>
        <div class="text-gray-700 text-xs pt-1">~ details</div>
      </div>
    </div>
  </div>`,
  styleUrl: './job-view.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobView implements OnInit, OnDestroy {
  @ViewChild('fTable') fTable?: Table;

  private readonly notificationService = inject(NotificationService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly loadingService = inject(LoadingService);
  private readonly jobService = inject(JobService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  private notificationSub!: Subscription;

  notifications: { message: string; time: Date }[] = [];

  Query: GridifyQueryExtend = {} as GridifyQueryExtend;
  PagingSignal = signal<PagingContent<JobDto>>({} as PagingContent<JobDto>);

  search: string = '';
  filterStatus: string = 'All';

  startDate: Date[] | undefined;
  endDate: Date[] | undefined;

  showCalendar: boolean = false;
  detailDialog: boolean = false;

  isMobile = window.innerWidth < 770;

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 770;
  }

  constructor() {
    this.Query.Page = 1;
    this.Query.PageSize = 10;
    this.Query.Filter = null;
    this.Query.Select = null;
    this.Query.OrderBy = 'CreatedAt';
    this.Query.Includes = null;
  }

  ngOnInit(): void {
    this.notificationSub = this.notificationService.message$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((msg) => {
        if (msg) {
          console.log('📢 SignalR update received:', msg);
          this.addNotification(msg);
        }
      });

    if (this.isMobile) this.GetData();
  }

  GetData() {
    this.loadingService.start();
    this.jobService
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

  FilterStatus(status: string) {
    this.filterStatus = status;
    this.cdr.detectChanges();
  }

  DetailsClick() {
    this.router.navigate(['/job/details']);
  }

  ActionClick(id: number, type: string, event?: Event) {
    if (type === 'edit') {
      this.router.navigate(['/job/details'], { queryParams: { id } });
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
      accept: () => {},
      reject: () => {},
    });
  }

  displayCalendar() {
    this.startDate = undefined;
    this.endDate = undefined;
    this.showCalendar = true;
    this.cdr.detectChanges();
  }

  SelectRangeDate(event: any) {
    if (!this.startDate) {
      this.startDate = event;
    } else {
      this.endDate = event;
    }

    if (this.startDate && this.endDate) {
      this.loadingService.start();

      setTimeout(() => {
        this.loadingService.stop();
        this.showCalendar = false;
        this.cdr.detectChanges();
      }, 1000);
    }
  }

  SeverityStatus(status: DeliveryStatus) {
    switch (status) {
      case DeliveryStatus.Delivered:
        return 'success';
      case DeliveryStatus.Pending:
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
