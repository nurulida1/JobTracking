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
import { JobDto } from '../../../models/JobModels';
import { AppService } from '../../../services/appService.service';
import { UserService } from '../../../services/userService.service';

@Component({
  selector: 'app-dashboard-technician',
  imports: [CommonModule],
  template: `<div class="pt-12" *ngIf="!loading; else loadingTpl">
      <div class="text-gray-500 tracking-wider text-sm">Hi, {{ name }}</div>
      <h2 class="text-xl mb-4 text-gray-700 font-bold tracking-wide">
        {{ today | date : 'EEE, MMMM d' }}
      </h2>

      <!-- Dashboard summary -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div
          class="rounded-lg h-[100px] border border-gray-300 bg-white gap-1 flex flex-col justify-center items-center"
        >
          <div class="text-4xl text-gray-700">0</div>
          <div class="tracking-wider text-sm text-green-500">Active Jobs</div>
        </div>
        <div
          class="rounded-lg h-[100px] border border-gray-300 bg-white gap-1 flex flex-col items-center justify-center"
        >
          <div class="text-4xl text-gray-700">0</div>
          <div class="tracking-wider text-sm text-yellow-500">Pending</div>
        </div>
        <div
          class="rounded-lg h-[100px] border border-gray-300 bg-white gap-1 flex flex-col items-center justify-center"
        >
          <div class="text-4xl text-gray-700">0</div>
          <div class="tracking-wider text-sm text-red-500">Delayed</div>
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
    </ng-template> `,
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
  dashboardData?: DashboardCount;
  userId: number = 0;
  name: string = '';
  today: Date = new Date();

  ngOnInit() {
    this.userId = this.userService.currentUser?.id ?? 0;
    this.name = this.userService.currentUser?.fullName ?? '';
    this.loadDashboard();
    this.loadTodayTasks();
  }

  loadDashboard() {
    this.appService.GetDashboardCount().subscribe({
      next: (res) => {
        this.dashboardCount = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadTodayTasks() {
    this.appService.TodayTasks(this.userId).subscribe({
      next: (res) => {
        this.todayTasks = res.tasks;
      },
      error: (err) => {
        console.log(err);
      },
    });
    // const params = new HttpParams().set('userId', this.userId.toString());
    // this.http
    //   .get<Task[]>(`${environment.apiUrl}/technician/todayTasks`, { params })
    //   .subscribe({
    //     next: (res) => {
    //       this.todayTasks = res;
    //       this.loading = false;
    //     },
    //     error: (err) => {
    //       console.error(err);
    //       this.loading = false;
    //     },
    //   });
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
