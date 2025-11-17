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
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { UserRole, WorkOrderStatus } from '../../../shared/enum/enum';
import { WorkOrderService } from '../../../services/workOrderService.service';
import {
  WorkOrderDto,
  WorkOrderTechnician,
} from '../../../models/WorkOrderModel';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { LoadingService } from '../../../services/loading.service';
import { NotificationService } from '../../../services/notificationService.service';
import { UserService } from '../../../services/userService.service';
import {
  GridifyQueryExtend,
  PagingContent,
  BuildSortText,
  BuildFilterText,
} from '../../../shared/helpers/helpers';
import { PurchaseOrderDto } from '../../../models/PurchaseOrderModel';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-work-order-view',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    InputTextModule,
    TextareaModule,
    FormsModule,
    DataViewModule,
    ConfirmDialogModule,
    AvatarModule,
    AvatarGroup,
    MultiSelectModule,
  ],
  template: ` <div
      class="relative w-full bg-cover bg-center flex items-center justify-center bg-white/60"
    >
      <div class="relative w-full min-h-[98vh] md:min-h-[91.8vh] flex flex-col">
        <div class="flex flex-row md:pb-0 pb-10">
          <div class="w-full pt-14 md:pt-0 md:flex-1">
            <div class="p-4 flex flex-col">
              <h3
                class="text-xl font-semibold mb-3 text-gray-600 text-shadow-md text-shadow-black/10 tracking-wider"
              >
                Work Order Management
              </h3>

              <div class="w-full mb-2 flex flex-row items-center gap-2">
                <div class="relative w-full">
                  <input
                    type="text"
                    pInputText
                    [(ngModel)]="search"
                    class="w-full !text-sm !tracking-wide !border-gray-200"
                    placeholder="Search by Work Order No"
                    (keyup)="Search(search)"
                  />
                  <i
                    class="pi pi-search !text-sm absolute top-2 right-3 !text-gray-500"
                  ></i>
                </div>
              </div>

              <div class="block pb-20 md:pb-5 mt-3">
                <div *ngIf="!PagingSignal().data" class="w-full">
                  <div
                    class="p-2 flex flex-col justify-center items-center text-sm text-gray-600 tracking-wider"
                  >
                    <div>No result found.</div>
                  </div>
                </div>
                <p-dataview
                  *ngIf="PagingSignal().data"
                  [value]="PagingSignal().data"
                  [rows]="Query.PageSize"
                  [paginator]="true"
                  styleClass="!border !border-gray-200"
                >
                  <ng-template #list let-items>
                    <div class="grid grid-cols-12 grid-nogutter">
                      <div
                        class="col-span-12"
                        *ngFor="let item of items; let first = first"
                      >
                        <div
                          (click)="ActionClick(item.id, 'detail', item)"
                          class="flex flex-col sm:flex-row sm:items-center px-4 py-3 border border-gray-100"
                          [ngClass]="{
                            'bg-gray-100 shadow-md': selectedWO?.id === item.id,
                            'hover:bg-gray-50 cursor-pointer':
                              selectedWO?.id !== item.id
                          }"
                        >
                          <div
                            class="flex flex-col gap-1 tracking-wider text-gray-700 w-full"
                          >
                            <div
                              class="flex flex-row items-center justify-between"
                            >
                              <span class="font-semibold"
                                >#{{ item.workOrderNo }}</span
                              >
                              <p-tag
                                [value]="item.status"
                                [severity]="SeverityStatus(item.status)"
                                class="!text-xs dark:!bg-surface-900 !tracking-wider !rounded-full !px-4"
                              />
                            </div>
                            <div
                              class="mt-3 mb-3 border-b border-dashed border-gray-200"
                            ></div>
                            <div
                              class="text-xs text-gray-600 font-thin flex flex-row justify-between items-center pb-1"
                            >
                              <div>Assigned Date</div>
                              <div>
                                {{ item.assignedDate | date : 'dd/MM/YYYY' }}
                              </div>
                            </div>
                            <div
                              class="text-xs text-gray-600 font-thin flex flex-row justify-between items-center pb-1"
                            >
                              <div>Assigned To</div>
                              <div
                                class="flex justify-center"
                                *ngIf="item.technicians"
                              >
                                <p-avatar-group>
                                  <p-avatar
                                    *ngFor="let tech of item.technicians"
                                    [label]="tech.nameInitials"
                                    shape="circle"
                                    [title]="tech.fullName"
                                  >
                                  </p-avatar>
                                  <p-avatar
                                    *ngIf="item.technicians.length > 5"
                                    label="+{{ item.technicians.length - 5 }}"
                                    shape="circle"
                                  ></p-avatar>
                                </p-avatar-group>
                              </div>
                              <div
                                class="flex justify-center"
                                *ngIf="item.technicians.length === 0"
                              >
                                N/A
                              </div>
                            </div>
                            <div
                              class="text-xs text-gray-600 font-thin flex flex-row justify-between items-center"
                            >
                              <div>Purchase Order ID</div>
                              <div
                                (click)="
                                  ActionClick(
                                    item.id,
                                    'purchase-order',
                                    item.purchaseOrder
                                  )
                                "
                                class="text-cyan-600 hover:underline cursor-pointer"
                              >
                                {{ item.purchaseOrder.purchaseOrderNo }}
                              </div>
                            </div>
                          </div>
                          <div
                            *ngIf="role === 'Planner'"
                            class="border-b border-dashed border-gray-300"
                          ></div>
                          <div
                            class="flex flex-row items-center justify-end gap-3"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </ng-template>
                </p-dataview>
              </div>
            </div>
          </div>
          <div
            *ngIf="!isMobile"
            class="flex-1 border-l h-full border-gray-200 bg-white"
          >
            <ng-container *ngTemplateOutlet="details"></ng-container>
          </div>
          <div
            *ngIf="isMobile && selectedWO"
            class="absolute top-0 right-0 bg-black/30 w-full h-full"
          >
            <div class="mt-20 flex justify-center">
              <div
                class="h-[80%] w-[90%] border-2 bg-white border-gray-200 p-2 relative"
              >
                <div
                  class="pi pi-times absolute top-3 right-3 cursor-pointer"
                  (click)="selectedWO = null"
                ></div>
                <ng-container *ngTemplateOutlet="details"></ng-container>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ng-template #details>
        <div
          class="h-full flex flex-col justify-center px-3 py-2"
          *ngIf="selectedWO"
        >
          <div class="font-semibold text-lg tracking-widest">
            #{{ selectedWO.workOrderNo }}
          </div>
          <div class="border-b border-gray-100 mt-2 mb-2"></div>
          <div class="flex flex-row items-center gap-2 justify-between">
            <div class="flex-1">
              <p-button
                (onClick)="changeWorkOrderStatus(selectedWO.id, 'start')"
                label="Start"
                severity="info"
                styleClass="!w-full !text-sm !py-1.5 !tracking-wide !text-xs md:!rounded-sm"
                [disabled]="selectedWO.status !== 'Pending'"
                ><ng-template #icon>
                  <div
                    class="pi pi-play !text-xs md:!text-sm"
                  ></div> </ng-template
              ></p-button>
            </div>
            <div class="flex-1">
              <p-button
                (onClick)="changeWorkOrderStatus(selectedWO.id, 'onHold')"
                label="OnHold"
                severity="danger"
                styleClass="!w-full !text-sm !py-1.5 !tracking-wide !text-xs md:!rounded-sm"
                [disabled]="selectedWO.status !== 'WIP'"
                ><ng-template #icon>
                  <div
                    class="pi pi-pause !text-xs md:!text-sm"
                  ></div> </ng-template
              ></p-button>
            </div>
            <div class="flex-1">
              <p-button
                (onClick)="changeWorkOrderStatus(selectedWO.id, 'resume')"
                label="Resume"
                severity="help"
                styleClass="!w-full !text-sm !py-1.5 !tracking-wide !text-xs md:!rounded-sm"
                [disabled]="selectedWO.status !== 'OnHold'"
                ><ng-template #icon>
                  <div
                    class="pi pi-caret-right !text-xs md:!text-sm"
                  ></div> </ng-template
              ></p-button>
            </div>
            <div class="flex-1">
              <p-button
                (onClick)="changeWorkOrderStatus(selectedWO.id, 'complete')"
                severity="success"
                label="Complete"
                styleClass="!w-full !text-sm !py-1.5 !tracking-wide !text-xs md:!rounded-sm"
                [disabled]="selectedWO.status !== 'WIP'"
                ><ng-template #icon>
                  <div
                    class="pi pi-check !text-xs md:!text-sm"
                  ></div> </ng-template
              ></p-button>
            </div>
          </div>
          <div class="border-b border-gray-100 mt-2 mb-2"></div>

          <div class="pb-1 text-sm text-gray-600 tracking-wide">Site</div>
          <input
            [disabled]="selectedWO.status === 'Completed'"
            type="text"
            pInputText
            class="w-full !text-sm"
            [(ngModel)]="selectedWO.site"
          />

          <div class="pt-3 pb-1 text-sm text-gray-600 tracking-wide">
            Remarks
            <span class="italic text-xs text-gray-500">(Optional)</span>
          </div>
          <input
            [disabled]="selectedWO.status === 'Completed'"
            type="text"
            pInputText
            class="w-full !text-sm"
            [(ngModel)]="selectedWO.remarks"
          />

          <div class="pt-3 pb-1 text-sm text-gray-600 tracking-wide">
            Job Description
          </div>
          <textarea
            [disabled]="selectedWO.status === 'Completed'"
            rows="5"
            cols="30"
            pTextarea
            class="w-full !text-sm"
            [autoResize]="true"
            [(ngModel)]="selectedWO.jobDescription"
          ></textarea>
          <div class="pt-3 pb-1 text-sm text-gray-600 tracking-wide">
            Assign Technicians
          </div>
          <p-multiselect
            [disabled]="selectedWO.status === 'Completed'"
            [options]="technicianOptions || []"
            [(ngModel)]="technicianIds"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Technicians"
            class="w-full !text-sm"
            panelStyleClass="!text-sm"
            appendTo="body"
          ></p-multiselect>
          <div class="flex flex-row items-center justify-end gap-2 pt-5">
            <p-button
              [disabled]="selectedWO.status === 'Completed'"
              (onClick)="ActionClick(selectedWO.id, 'reset', selectedWO)"
              label="Reset"
              severity="secondary"
              styleClass="!text-sm !py-1.5 !px-4 !tracking-wider"
            ></p-button>
            <p-button
              [disabled]="selectedWO.status === 'Completed'"
              (onClick)="ActionClick(selectedWO.id, 'update', selectedWO)"
              label="Save Changes"
              severity="info"
              styleClass="!text-sm !py-1.5 !px-4 !tracking-wider"
            ></p-button>
          </div>
          <div class="border-b border-gray-200 mt-4 mb-2"></div>

          <div class="py-2 text-sm font-semibold text-gray-600 tracking-wider">
            Assigned Technicians
          </div>
          <p-table
            dataKey="id"
            [value]="assignedTechnicians || []"
            size="small"
            [tableStyle]="{ 'min-width': '10rem' }"
            tableStyleClass="!w-full border border-gray-200"
            styleClass="!w-full"
          >
            <ng-template #header>
              <tr>
                <th class="text-sm !text-center w-[20%] !bg-gray-100">No</th>
                <th class="text-sm !text-center w-[60%] !bg-gray-100">Name</th>
                <th class="text-sm !text-center w-[20%] !bg-gray-100">
                  Action
                </th>
              </tr>
            </ng-template>
            <ng-template #body let-data let-i="rowIndex">
              <tr>
                <td>
                  <div class="text-sm text-gray-700 text-center">
                    {{ i + 1 }}
                  </div>
                </td>
                <td>
                  <div class="text-sm text-gray-700 text-center">
                    {{ data.fullName }}
                  </div>
                </td>
                <td>
                  <div
                    class="flex justify-center items-center text-sm text-gray-700 text-center"
                  >
                    <p-button
                      (onClick)="RemoveTechnician(data.id)"
                      icon="pi pi-trash"
                      [text]="true"
                      severity="danger"
                      styleClass="!text-sm"
                      [disabled]="selectedWO.status === 'Completed'"
                    ></p-button>
                  </div>
                </td>
              </tr>
            </ng-template>

            <ng-template #emptymessage>
              <tr>
                <td colspan="100%" class="!text-center !border">
                  <div
                    class="text-center !text-sm !text-gray-500 !tracking-wider"
                  >
                    No assigned technicians.
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </ng-template>

      <div
        *ngIf="PODialog"
        class="absolute top-0 right-0 w-full h-full backdrop-blur-xs"
      >
        <div
          class="flex flex-col items-center md:justify-center w-full h-full pt-20 md:pt-0"
        >
          <div
            class="relative px-3 py-4 border border-gray-200 w-[80%] md:w-[50%] min-h-[10%] md:min-h-[30%] bg-white/90 rounded-md shadow-lg flex flex-col gap-3"
          >
            <div class="absolute top-4 right-3">
              <i
                (click)="PODialog = false"
                class="pi pi-times-circle !text-red-600 !cursor-pointer"
                pTooltip="Close"
              ></i>
            </div>
            <div
              class="text-sm md:text-base tracking-widest text-gray-600 font-semibold text-shadow-sm"
            >
              #{{ selectedPO?.purchaseOrderNo }}
            </div>
            <div class="border-b border-gray-200"></div>
            <div
              class="flex flex-row items-center justify-between text-xs md:text-sm tracking-wide"
            >
              <div class="text-gray-500">PO Date</div>
              <div>{{ selectedPO?.poDate | date : 'dd/MM/YYYY' }}</div>
            </div>
            <div
              *ngIf="selectedPO?.site"
              class="flex flex-row items-center justify-between text-xs md:text-sm tracking-wide"
            >
              <div class="text-gray-500">Site</div>
              <div>{{ selectedPO?.site }}</div>
            </div>
            <div
              *ngIf="selectedPO?.project"
              class="flex flex-row items-center justify-between text-xs md:text-sm tracking-wide"
            >
              <div class="text-gray-500">Project</div>
              <div>{{ selectedPO?.project }}</div>
            </div>
            <div
              *ngIf="selectedPO?.client"
              class="flex flex-row items-center justify-between text-xs md:text-sm tracking-wide"
            >
              <div class="text-gray-500">Client</div>
              <div>{{ selectedPO?.client }}</div>
            </div>
            <div class="w-full">
              <div class="border-b border-dashed border-gray-300"></div>
            </div>
            <div
              class="flex flex-row items-center justify-between text-xs md:text-sm tracking-wide"
            >
              <div class="text-gray-500">Amount</div>
              <div class="font-semibold text-xl tracking-wider">
                {{ selectedPO?.poAmount | currency : 'RM ' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p-confirmdialog />`,
  styleUrl: './work-order-view.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrderView implements OnInit, OnDestroy {
  @ViewChild('fTable') fTable?: Table;

  private readonly notificationService = inject(NotificationService);
  private readonly workOrderService = inject(WorkOrderService);
  private readonly loadingService = inject(LoadingService);
  private readonly messageService = inject(MessageService);
  private readonly userService = inject(UserService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  private notificationSub!: Subscription;
  notifications: { message: string; time: Date }[] = [];

  Query: GridifyQueryExtend = {} as GridifyQueryExtend;
  PagingSignal = signal<PagingContent<WorkOrderDto>>(
    {} as PagingContent<WorkOrderDto>
  );

  search: string = '';
  PODialog: boolean = false;
  role: UserRole | null = null;
  selectedWO: WorkOrderDto | null = null;
  selectedPO: PurchaseOrderDto | null = null;

  technicianOptions: { label: string; value: string }[] = [];
  assignedTechnicians: WorkOrderTechnician[] = [];
  technicianIds: string[] = [];

  isMobile = window.innerWidth < 770;

  @HostListener('window: resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 770;
  }

  constructor() {
    this.role = this.userService.currentUser?.userRole ?? null;

    this.Query.Page = 1;
    this.Query.PageSize = 10;
    this.Query.OrderBy = 'CreatedAt desc';
    this.Query.Filter = null;
    this.Query.Select = null;
    this.Query.Includes = 'PurchaseOrder';
  }

  ngOnInit(): void {
    this.notificationSub = this.notificationService.message$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((msg) => {
        if (msg) {
          this.addNotification(msg);
        }
      });

    this.GetData();
  }

  GetData() {
    this.loadingService.start();
    this.workOrderService
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
      workOrderNo: [
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

  ActionClick(id: string, type: string, data?: any) {
    switch (type) {
      case 'edit': {
        this.router.navigate(['/work-order/form'], { queryParams: { id } });
        break;
      }
      case 'update': {
        this.updateWorkOrder();
        break;
      }
      case 'reset': {
        break;
      }
      case 'detail': {
        this.selectedWO = data;
        this.assignedTechnicians = data?.technicians ?? [];
        this.technicianIds =
          data?.technicians?.map((t: WorkOrderTechnician) => t.userId) ?? [];
        this.userService
          .GetMany({
            Page: 1,
            PageSize: 1000000,
            Filter: 'Role=Technician',
            Select: 'Id,FullName,Username',
            OrderBy: null,
            Includes: null,
          })
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((res) => {
            this.technicianOptions = res.data.map((user: any) => ({
              label: user.FullName,
              value: user.Id,
            }));
            this.cdr.detectChanges();
          });
        break;
      }
      case 'purchase-order': {
        if (this.role === 'Planner') {
          this.router.navigate(['/purchase-order/form'], {
            queryParams: { id },
          });
        } else {
          this.selectedPO = data;
          this.PODialog = true;
          this.cdr.detectChanges();
        }
        break;
      }
    }
  }

  private updateWorkOrder() {
    if (!this.selectedWO) return;

    const request = {
      id: this.selectedWO.id,
      jobDescription: this.selectedWO.jobDescription,
      site: this.selectedWO.site,
      remarks: this.selectedWO.remarks,
      technicianIds: this.technicianIds,
    };

    this.loadingService.start();
    this.workOrderService
      .Update(request)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Work Order Updated',
            detail: `Work Order #${res.workOrderNo} has been successfully updated.`,
            life: 5000,
          });

          if (this.selectedWO)
            Object.assign(this.selectedWO, {
              jobDescription: res.jobDescription,
              site: res.site,
              remarks: res.remarks,
              technicians: res.technicians ?? [],
            });

          this.assignedTechnicians = res?.technicians ?? [];
          this.technicianIds =
            res?.technicians?.map((t: WorkOrderTechnician) => t.userId) ?? [];

          this.cdr.detectChanges();
        },
        error: () => this.loadingService.stop(),
        complete: () => this.loadingService.stop(),
      });
  }

  changeWorkOrderStatus(
    id: string,
    type: 'start' | 'onHold' | 'resume' | 'complete'
  ) {
    this.loadingService.start();

    let observable$;
    switch (type) {
      case 'start':
        observable$ = this.workOrderService.Start(id);
        break;
      case 'onHold':
        observable$ = this.workOrderService.OnHold(id);
        break;
      case 'resume':
        observable$ = this.workOrderService.Resume(id);
        break;
      case 'complete':
        observable$ = this.workOrderService.Complete(id);
        break;
    }

    observable$.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res: any) => {
        this.loadingService.stop();

        const statusMap = {
          start: WorkOrderStatus.WIP,
          onHold: WorkOrderStatus.OnHold,
          resume: WorkOrderStatus.WIP,
          complete: WorkOrderStatus.Completed,
        };

        this.PagingSignal.update((state) => {
          const newData = state.data.map((item) =>
            item.id === id ? { ...item, status: statusMap[type] } : item
          );
          return { ...state, data: newData };
        });

        if (this.selectedWO) {
          this.selectedWO.status = statusMap[type];
          if (type === 'start') this.selectedWO.startedAt = new Date();
        }

        const summaryMap = {
          start: 'Work Order Started',
          onHold: 'Work Order OnHold',
          resume: 'Work Order Resumed',
          complete: 'Work Order Completed',
        };

        const detailMap = {
          start: `Work Order #${res.workOrder.workOrderNo} started. Job #${res.job.jobNo} generated.`,
          onHold: `Work Order #${res.workOrder.workOrderNo} has been put on hold.`,
          resume: `Work Order #${res.workOrder.workOrderNo} has been resumed.`,
          complete: `Work Order #${res.workOrder.workOrderNo} has been completed.`,
        };

        this.messageService.add({
          severity: 'success',
          summary: summaryMap[type],
          detail: detailMap[type],
          life: 5000,
        });
      },
      error: () => this.loadingService.stop(),
    });
  }

  RemoveTechnician(id: string) {
    this.loadingService.start();
    this.workOrderService
      .RemoveTechnician(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.assignedTechnicians = this.assignedTechnicians.filter(
            (tech) => tech.id !== id
          );
          this.technicianIds = this.technicianIds.filter(
            (techId) => techId !== id
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Technician Removed',
            detail: `Technician has been successfully removed from the work order.`,
            life: 5000, // message stays for 5 seconds
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

  SeverityStatus(status: WorkOrderStatus) {
    switch (status) {
      case WorkOrderStatus.Completed:
        return 'success';
      case WorkOrderStatus.WIP:
        return 'info';
      default:
        return 'warn';
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
