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
import {
  DeliveryStatus,
  JobPriority,
  JobStatus,
} from '../../../shared/enum/enum';
import { Tooltip } from 'primeng/tooltip';
import { query } from '@angular/animations';

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
    Tooltip,
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
        [disabled]="PagingSignal().totalElements === 0"
      ></p-datepicker>
      <p-button
        *ngIf="isMobile"
        icon="pi pi-calendar"
        styleClass="!bg-white !border-gray-300 !border-2 !text-blue-500"
        (onClick)="displayCalendar()"
        [disabled]="PagingSignal().totalElements === 0"
      ></p-button>
    </div>
    <div
      class="mt-3 p-2 flex flex-row items-center gap-2 overflow-x-auto tracking-wide"
    >
      <div
        *ngFor="
          let status of [
            'All',
            'InProgress',
            'Pending',
            'Completed',
            'Cancelled'
          ]
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
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-2 pt-4"
    >
      <ng-container *ngIf="PagingSignal().totalElements > 0; else noData">
        <ng-container *ngFor="let data of PagingSignal().data">
          <div
            class="p-2 border-t-8 border rounded-md border-gray-300 bg-white"
            [ngClass]="{
              'border-t-yellow-500': data.priority === 'Medium',
              'border-t-blue-500': data.priority === 'Low',
              'border-t-red-500': data.priority === 'High',
              'border-t-orange-500': data.priority === 'Critical'
            }"
          >
            <div class="flex flex-col h-full justify-between">
              <div class="flex flex-col">
                <div class="flex flex-row items-center justify-between">
                  <div
                    class="border px-5 py-0.5 text-xs rounded-full text-white text-shadow-md tracking-wider"
                    [ngClass]="{
                      'bg-blue-400': data.status === 'InProgress',
                      'bg-orange-400': data.status === 'OnHold',
                      'bg-red-400': data.status === 'Cancelled',
                      'bg-green-400': data.status === 'Completed'
                    }"
                  >
                    {{ data.status }}
                  </div>
                  <div class="text-gray-600 text-xs tracking-wider">
                    Due:
                    <b>{{
                      (data.dueDate | date : 'MMMM dd, YYYY') ?? 'N/A'
                    }}</b>
                  </div>
                </div>

                <div
                  class="pt-5 text-sm font-semibold tracking-wider text-gray-700"
                >
                  #{{ data.jobNo }}
                </div>
                <div class="py-3 text-xs text-gray-500 tracking-wider">
                  {{ data.description }}
                </div>
              </div>
              <div class="flex flex-col">
                <div
                  class="border-b border-dashed border-gray-300 mt-2 mb-2"
                ></div>
                <div class="flex flex-row gap-3 items-center justify-end">
                  <i
                    (click)="ActionClick(data.id, 'view', data)"
                    class="pi pi-eye !text-gray-400 hover:!text-gray-500 cursor-pointer"
                    pTooltip="View"
                    tooltipPosition="top"
                  ></i>
                  <i
                    (click)="ActionClick(data.id, 'edit', data)"
                    class="pi pi-pencil !text-sm !text-blue-400 hover:!text-blue-500 cursor-pointer"
                    pTooltip="Update"
                    tooltipPosition="top"
                  ></i>
                </div>
              </div>
            </div>
          </div> </ng-container
      ></ng-container>
    </div>
    <ng-template #noData>
      <div
        class="pt-6 tracking-wider text-sm w-full text-center flex flex-col items-center justify-center text-gray-500"
      >
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
      class="backdrop-blur-xs absolute top-0 right-0 w-full min-h-[91.5vh] transition-opacity duration-3000 ease-in-out"
    >
      <div
        *ngIf="selectedJob"
        class="w-full min-h-[91.5vh] flex flex-col justify-end items-end px-5"
      >
        <div
          class="relative w-full h-[60vh] border p-2 bg-white border-gray-200 rounded-md"
        >
          <div
            class="pi pi-times !text-gray-500 absolute top-2 right-2 cursor-pointer"
            (click)="detailDialog = false"
          ></div>
          <div class="flex flex-col p-2">
            <div class="font-semibold text-gray-500 tracking-wider text-xl">
              #{{ selectedJob.jobNo }}
            </div>
          </div>
        </div>
        <!-- <div
          *ngIf="selectedJob"
          class="relative px-4 mr-5 flex flex-col rounded-lg border border-gray-300 bg-white drop-shadow-lg p-2 w-full min-h-[50vh]"
        >
          <div
            class="absolute top-3 right-3 cursor-pointer z-20"
            (click)="detailDialog = false"
          >
            <i class="pi pi-times"></i>
          </div>

          <div class="flex flex-row items-center gap-3">
            <div class="text-gray-600 tracking-wider text-xl font-bold">
              #{{ selectedJob.jobNo }}
            </div>
            <div
              class="px-4 py-1 font-semibold rounded-full text-white tracking-widest pb-1.5 text-[10px] text-shadow-lg text-shadow-black/30"
              [ngClass]="{ 'bg-blue-400': selectedJob.priority === 'Low' }"
            >
              {{ selectedJob.priority }}
            </div>
          </div>
          <div class="w-full mt-2 mb-2 border-b border-gray-200"></div>
        </div> -->
      </div>
    </div>
  </div>`,
  styleUrl: './job-view.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobView implements OnInit, OnDestroy {
  @ViewChild('fTable') fTable?: Table;

  private readonly notificationService = inject(NotificationService);
  private readonly loadingService = inject(LoadingService);
  private readonly jobService = inject(JobService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  private notificationSub!: Subscription;

  notifications: { message: string; time: Date }[] = [];

  Query: GridifyQueryExtend = {} as GridifyQueryExtend;
  PagingSignal = signal<PagingContent<JobDto>>({} as PagingContent<JobDto>);

  selectedJob: JobDto | null = null;

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
    this.Query.Includes = 'WorkOrder';
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

    this.GetData();
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

  ActionClick(id: string, type: string, data?: any) {
    if (type === 'edit') {
      this.router.navigate(['/job/forms'], { queryParams: { id } });
      return;
    }

    if (type === 'view') {
      this.selectedJob = data;
      this.detailDialog = true;
      this.cdr.detectChanges();
      return;
    }
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

  SeverityStatus(status: JobStatus) {
    switch (status) {
      case JobStatus.Completed:
        return 'success';
      case JobStatus.Pending:
        return 'warn';
      case JobStatus.InProgress:
        return 'info';
      default:
        return 'danger';
    }
  }

  SeverityPriority(priority: JobPriority) {
    switch (priority) {
      case JobPriority.Medium:
        return 'warn';
      case JobPriority.Low:
        return 'info';
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
