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
import { MessageService } from 'primeng/api';
import { JobPriority, JobStatus } from '../../../shared/enum/enum';
import { Tooltip } from 'primeng/tooltip';

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
    class="relative w-full px-3 md:pt-5 md:px-6 bg-cover bg-center flex flex-col border-2 pb-40 md:pb-0 min-h-[98vh] md:min-h-[91.8vh] bg-white/60"
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
          let status of ['All', 'WIP', 'Pending', 'Completed', 'Cancelled']
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
                      'bg-blue-400': data.status === 'WIP',
                      'bg-orange-400':
                        data.status === 'OnHold' || data.status === 'Pending',
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
      class="absolute top-12 md:top-0 left-0 w-full h-full bg-black/30 flex md:items-center justify-center p-3"
    >
      <div
        *ngIf="selectedJob"
        class="relative mt-10 md:mt-0 p-2 border-t-8 border md:w-[80%] h-[50%] overflow-y-auto md:h-[80%] rounded-md border-gray-300 bg-white"
        [ngClass]="{
          'border-t-yellow-500': selectedJob.priority === 'Medium',
          'border-t-blue-500': selectedJob.priority === 'Low',
          'border-t-red-500': selectedJob.priority === 'High',
          'border-t-orange-500': selectedJob.priority === 'Critical'
        }"
      >
        <div
          (click)="detailDialog = false"
          class="pi pi-times cursor-pointer absolute top-2 right-2"
          tooltipPosition="left"
        ></div>

        <div class="flex flex-col md:h-full md:justify-between">
          <div class="flex flex-col">
            <div class="font-semibold tracking-wider text-lg text-gray-700">
              #{{ selectedJob.jobNo }}
            </div>
            <div class="flex flex-row items-center gap-2 mt-2">
              <div class="text-xs text-gray-600 tracking-wider">Priority :</div>
              <div
                class="border px-5 py-0.5 pt-1 text-xs rounded-full text-white text-shadow-md tracking-wider"
                [ngClass]="{
                  'bg-blue-400': selectedJob.priority === 'Low',
                  'bg-orange-400': selectedJob.priority === 'Critical',
                  'bg-red-400': selectedJob.priority === 'High',
                  'bg-yellow-500': selectedJob.priority === 'Medium'
                }"
              >
                {{ selectedJob.priority }}
              </div>
            </div>
            <div class="border-b border-gray-200 mt-3 mb-3"></div>
            <div class="flex flex-row items-center">
              <div class="flex flex-row items-center gap-2 w-[30%] md:w-[15%]">
                <i class="pi pi-users !text-gray-500 !text-sm"></i>
                <div class="text-gray-500 text-xs tracking-wider">
                  Assigned By :
                </div>
              </div>
              <div
                *ngIf="selectedJob.assignedByUser"
                class="flex flex-row items-center gap-2 bg-gray-100 py-1 px-1 pr-3 rounded-full"
              >
                <div
                  class="w-5 h-5 p-2 flex items-center justify-center rounded-full border border-gray-300 bg-gray-200"
                >
                  <i
                    class="pi pi-user !text-shadow-md !text-xs !text-gray-700"
                  ></i>
                </div>
                <div
                  class="text-xs pt-1 tracking-wider text-shadow-md text-gray-700"
                >
                  {{ selectedJob.assignedByUser?.fullName }}
                </div>
              </div>
              <div
                *ngIf="!selectedJob.assignedByUser"
                class="text-xs font-semibold tracking-wider text-gray-600"
              >
                N/A
              </div>
            </div>
            <div class="flex flex-row items-center mt-2">
              <div class="flex flex-row items-center gap-2 w-[30%] md:w-[15%]">
                <i class="pi pi-calendar-clock !text-gray-500 !text-sm"></i>
                <div class="text-gray-500 text-xs tracking-wider">
                  Due Date :
                </div>
              </div>
              <div class="text-xs font-semibold tracking-wider text-gray-600">
                {{ selectedJob.dueDate | date : 'MMMM dd, YYYY' }}
              </div>
            </div>
            <div class="flex flex-row items-center mt-2">
              <div class="flex flex-row items-center gap-2 w-[30%] md:w-[15%]">
                <i class="pi pi-chart-pie !text-gray-500 !text-sm"></i>
                <div class="text-gray-500 text-xs tracking-wider">Status :</div>
              </div>
              <div
                class="flex flex-row items-center border px-5 py-0.5 pt-1 text-xs rounded-md tracking-wider"
                [ngClass]="{
                  'border-blue-400 text-blue-400': selectedJob.status === 'WIP',
                  'border-orange-400 text-orange-400':
                    selectedJob.status === 'OnHold' ||
                    selectedJob.status === 'Pending',
                  'border-red-400 text-red-400':
                    selectedJob.status === 'Cancelled',
                  'border-green-400 text-green-400':
                    selectedJob.status === 'Completed'
                }"
              >
                <div class="pi pi-circle-fill !text-[5px]"></div>
                <div class="ml-1 text-[10px]">
                  {{ selectedJob.status }}
                </div>
              </div>
            </div>
            <div class="border-b border-gray-300 mt-4 mb-4"></div>
            <div class="flex flex-row items-center gap-1 pb-1">
              <div
                class="pi pi-clipboard !text-xs !text-gray-700 !text-shadow-md"
              ></div>
              <div class="text-sm tracking-wider">Description</div>
            </div>
            <div class="text-xs text-gray-500 tracking-wider">
              {{ selectedJob.description ?? 'N/A' }}
            </div>
            <div class="pt-3 pb-2 text-sm tracking-wider">Remarks</div>
            <div class="text-xs text-gray-500 tracking-wider">
              <div>{{ selectedJob.remarks ?? 'N/A' }}</div>
            </div>
          </div>
          <div class="flex flex-col w-full">
            <div class="border-b border-dashed border-gray-300 mt-4 mb-4"></div>
            <div class="grid grid-cols-3 md:grid-cols-5 gap-2 w-full">
              <p-button
                (onClick)="changeJobStatus(selectedJob.id, 'start')"
                [disabled]="selectedJob.status !== 'Pending'"
                label="Start"
                class="w-full"
                severity="info"
                styleClass="!flex-1 !py-1.5 w-full !text-xs md:!text-sm !tracking-wider !rounded-none"
                ><ng-template #icon>
                  <div
                    class="pi pi-play !text-xs md:!text-sm"
                  ></div> </ng-template
              ></p-button>
              <p-button
                (onClick)="changeJobStatus(selectedJob.id, 'onHold')"
                [disabled]="selectedJob.status !== 'WIP'"
                label="OnHold"
                class="w-full"
                severity="warn"
                styleClass="!flex-1 !py-1.5 w-full !text-xs md:!text-sm !tracking-wider !rounded-none"
                ><ng-template #icon>
                  <div
                    class="pi pi-pause !text-xs md:!text-sm"
                  ></div> </ng-template
              ></p-button>
              <p-button
                (onClick)="changeJobStatus(selectedJob.id, 'resume')"
                [disabled]="selectedJob.status !== 'OnHold'"
                label="Resume"
                class="w-full"
                severity="info"
                styleClass="!flex-1 !py-1.5 w-full !text-xs md:!text-sm !tracking-wider !rounded-none"
                ><ng-template #icon>
                  <div
                    class="pi pi-caret-right !text-xs md:!text-sm"
                  ></div> </ng-template
              ></p-button>
              <p-button
                (onClick)="changeJobStatus(selectedJob.id, 'complete')"
                [disabled]="selectedJob.status !== 'WIP'"
                label="Complete"
                severity="success"
                class="w-full"
                styleClass="!flex-1 !py-1.5 w-full !text-xs md:!text-sm !tracking-wider !rounded-none"
              >
                <ng-template #icon>
                  <div
                    class="pi pi-check !text-xs md:!text-sm"
                  ></div> </ng-template
              ></p-button>
              <p-button
                (onClick)="changeJobStatus(selectedJob.id, 'cancel')"
                [disabled]="
                  selectedJob.status === 'Cancelled' ||
                  selectedJob.status === 'OnHold'
                "
                label="Cancel"
                severity="danger"
                class="w-full"
                styleClass="!flex-1 !py-1.5 w-full !text-xs md:!text-sm !tracking-wider !rounded-none"
              >
                <ng-template #icon>
                  <div class="pi pi-times !text-xs md:!text-sm"></div>
                </ng-template>
              </p-button>
            </div>
          </div>
        </div>
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
  private readonly messageService = inject(MessageService);
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
    this.Query.Includes =
      'WorkOrder,AssignedByUser,AssignedToUser,WorkOrderTechnician';
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

  changeJobStatus(
    id: string,
    type: 'start' | 'onHold' | 'resume' | 'complete' | 'cancel'
  ) {
    this.loadingService.start();

    let observable$;

    switch (type) {
      case 'start':
        observable$ = this.jobService.Start(id);
        break;
      case 'onHold':
        observable$ = this.jobService.OnHold(id);
        break;
      case 'resume':
        observable$ = this.jobService.Resume(id);
        break;
      case 'complete':
        observable$ = this.jobService.Complete(id);
        break;
      case 'cancel':
        observable$ = this.jobService.Cancel(id);
        break;
      default:
        observable$ = null;
        break;
    }

    observable$?.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res) => {
        this.loadingService.stop();

        const statusMap = {
          start: JobStatus.WIP,
          onHold: JobStatus.OnHold,
          resume: JobStatus.WIP,
          complete: JobStatus.Completed,
          cancel: JobStatus.Cancelled,
        };

        this.PagingSignal.update((state) => {
          const updatedData = state.data.map((job) => {
            if (job.id === res.job.id) {
              return { ...job, status: statusMap[type] };
            }
            return job;
          });
          return { ...state, data: updatedData };
        });

        if (this.selectedJob) {
          this.selectedJob.status = statusMap[type];
          if (type === 'complete') this.selectedJob.completionDate = new Date();
        }

        const summaryMap = {
          start: 'Job Started',
          onHold: 'Job On Hold',
          resume: 'Job Resumed',
          complete: 'Job Completed',
          cancel: 'Job Cancelled',
        };

        this.addNotification(`${summaryMap[type]}: Job #${res.job.jobNo}`);
        this.messageService.add({
          severity: 'success',
          summary: summaryMap[type],
          detail: res.message,
        });
      },
      error: (err) => {
        this.loadingService.stop();
      },
      complete: () => {
        this.cdr.detectChanges();
      },
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

  SeverityStatus(status: JobStatus) {
    switch (status) {
      case JobStatus.Completed:
        return 'success';
      case JobStatus.Pending:
        return 'warn';
      case JobStatus.WIP:
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
