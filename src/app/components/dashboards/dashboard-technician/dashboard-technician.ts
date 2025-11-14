import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { DashboardCount } from '../../../models/AppModels';
import { JobDto, JobTaskResponse, TaskCount } from '../../../models/JobModels';
import { AppService } from '../../../services/appService.service';
import { UserService } from '../../../services/userService.service';

@Component({
  selector: 'app-dashboard-technician',
  imports: [CommonModule],
  template: `
    <div class="w-full pt-10 pb-20 md:p-2" *ngIf="!loading; else loadingTpl">
      <div class="text-gray-500 tracking-wider text-sm">Hi, {{ name }}</div>
      <h2 class="text-xl mb-4 text-gray-700 font-bold tracking-wide">
        {{ today | date : 'EEE, MMMM d' }}
      </h2>

      <!-- Dashboard summary -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <div
          class="relative rounded-lg h-[150px] bg-[#CD7D49] gap-1 flex flex-col justify-between py-4 px-3 items-start shadow-lg"
        >
          <div class="absolute top-7 right-3">
            <div
              class="w-10 h-10 rounded-full flex justify-center items-center inset-shadow-sm inset-shadow-black/60 text-white"
            >
              <i class="pi pi-briefcase !text-shadow-md !text-lg"></i>
            </div>
          </div>
          <div class="text-7xl text-white text-shadow-lg">
            {{ dashboardData?.active }}
          </div>
          <div class="tracking-widest text-sm text-white text-shadow-md">
            Active Jobs
          </div>
        </div>
        <div
          class="relative rounded-lg h-[150px] bg-[#4758B0] gap-1 flex flex-col justify-between py-4 px-3 items-start shadow-lg"
        >
          <div class="absolute top-7 right-3">
            <div
              class="w-10 h-10 rounded-full flex justify-center items-center inset-shadow-sm inset-shadow-black/60 text-white"
            >
              <i class="pi pi-truck !text-shadow-md !text-lg"></i>
            </div>
          </div>
          <div class="text-7xl text-white text-shadow-lg">
            {{ dashboardData?.active }}
          </div>
          <div class="tracking-widest text-sm text-white text-shadow-md">
            Item to Pick Up
          </div>
        </div>
      </div>

      <!-- Today tasks -->
      <h3 class="text-xl text-shadow-md mb-3 tracking-wider">Today's Tasks</h3>

      <div *ngIf="todayTasks.length > 0; else noTasks">
        <div
          *ngFor="let task of todayTasks"
          class="border rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition"
        >
          <div class="flex justify-between items-center">
            <div>
              <h4 class="text-lg font-semibold">{{ task.description }}</h4>
              <p class="text-sm text-gray-600">
                Work Order ID: {{ task.workOrderId }}
              </p>
              <p class="text-sm text-gray-600">
                Due: {{ task.completionDate | date : 'shortDate' }}
              </p>
            </div>
            <span
              class="px-3 py-1 text-sm rounded-full"
              [ngClass]="getPriorityColor(task.priority)"
            >
              {{ task.priority }}
            </span>
          </div>
          <div class="mt-2 text-sm">
            <strong>Status:</strong> {{ task.status }}
          </div>
        </div>
      </div>

      <ng-template #noTasks>
        <p class="text-gray-500 tracking-wider text-sm italic">
          No tasks for today 🎉
        </p>
      </ng-template>
    </div>

    <ng-template #loadingTpl>
      <div class="flex justify-center items-center h-48">
        <p>Loading dashboard...</p>
      </div>
    </ng-template>
  `,
  styleUrl: './dashboard-technician.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTechnician implements OnInit {
  @Input() dashboardCount: DashboardCount = {
    quotations: { pending: 0, approved: 0, rejected: 0 },
    jobs: { active: 0, pending: 0, delayed: 0 },
    workOrders: 0,
  };

  private readonly appService = inject(AppService);
  private readonly userService = inject(UserService);
  private readonly cdr = inject(ChangeDetectorRef);

  todayTasks: JobDto[] = [];
  loading: boolean = true;
  dashboardData: TaskCount | null = null;
  userId: string | null = null;
  name: string = '';
  today: Date = new Date();

  ngOnInit() {
    this.userId = this.userService.currentUser?.userId ?? '';
    this.name = this.userService.currentUser?.username ?? '';
    this.loadTodayTasks();
  }

  loadTodayTasks() {
    this.appService.TodayTasks(this.userId ?? '').subscribe({
      next: (res) => {
        if (res.taskCount) this.dashboardData = res.taskCount;
        this.todayTasks = res.tasks;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getPriorityColor(priority: string) {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-400 text-gray-800';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  }
}
