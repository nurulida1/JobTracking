import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SpeedDialModule } from 'primeng/speeddial';
import { TooltipModule } from 'primeng/tooltip';
import { QuotationRoutingModule } from '../quotation/quotation-rounting.module';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { LoadingService } from '../../services/loading.service';
import { AppService } from '../../services/appService.service';
import { DashboardCount } from '../../models/AppModels';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    SpeedDialModule,
    TooltipModule,
    QuotationRoutingModule,
    SidebarComponent,
    ChartModule,
  ],
  template: `
    <div
      class="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center pb-20 2xl:pt-2 2xl:pb-2"
      style="background-image: url('assets/background.png');"
    >
      <div class="absolute inset-0 backdrop-blur-sm bg-black/40 z-10"></div>
      <div
        class="relative z-20 border border-gray-400/30 p-4 2xl:rounded-3xl bg-black/20 
          w-[98%] min-h-[98vh] shadow-xl
          shadow-[0_0_40px_rgba(173,216,230,0.5)] text-white backdrop-filter backdrop-blur-xl
          flex flex-col"
      >
        <div
          class="text-lg font-semibold tracking-widest mb-2 py-5 text-shadow-lg"
        ></div>
        <div
          class="w-full"
          [ngClass]="{
            'flex flex-row border': !isMobile,
            'flex flex-col': isMobile
          }"
        >
          <div
            *ngIf="!isMobile"
            class="w-[7%] 3xl:w-[5%] p-4 border-r border-gray-700/50 flex flex-col items-center"
          >
            <app-sidebar></app-sidebar>
          </div>

          <div class="w-full 2xl:w-[75%] p-1 2xl:p-4 space-y-4">
            <div class="grid 2xl:grid-cols-2 gap-4 h-[45%]">
              <div
                class="bg-black/30 p-4 rounded-xl border border-gray-700/50 shadow-md flex flex-col"
              >
                <h3
                  class="text-lg font-semibold mb-3 text-blue-400 tracking-wider"
                >
                  Quotations
                </h3>
                <div class="flex space-x-4 mb-4">
                  <div class="text-center flex-1 border-r border-white/20">
                    <div
                      class="text-3xl font-semibold text-yellow-400 text-shadow-md tracking-widest"
                    >
                      {{ dashboardCount.quotations?.pending }}
                    </div>
                    <div class="text-xs text-gray-400 tracking-wider">
                      Pending Approval
                    </div>
                  </div>
                  <div class="text-center flex-1 ">
                    <div
                      class="text-3xl font-semibold tracking-widest text-green-400 text-shadow-md"
                    >
                      {{ dashboardCount.quotations?.approved }}
                    </div>
                    <div class="text-xs text-gray-400 tracking-wider">
                      Approved
                    </div>
                  </div>
                  <div class="text-center flex-1 border-l border-white/20">
                    <div
                      class="text-3xl font-semibold tracking-widest text-red-400 text-shadow-md"
                    >
                      {{ dashboardCount.quotations?.rejected }}
                    </div>
                    <div class="text-xs text-gray-400 tracking-wider">
                      Rejected
                    </div>
                  </div>
                </div>
                <div class="text-sm text-gray-400 mb-2">
                  Quotes Generated This Month
                </div>
                <div
                  class="flex-grow bg-white/5 rounded-lg border border-white/10 p-2 flex items-center justify-center"
                >
                  <p-chart
                    type="line"
                    [data]="quotationChartData"
                    [options]="quotationChartOptions"
                    style="width: 100%;"
                  ></p-chart>
                </div>
              </div>

              <div
                class="bg-black/30 p-4 rounded-xl border border-gray-700/50 shadow-md flex flex-col items-center"
              >
                <h3 class="text-lg font-semibold mb-3 text-pink-400">
                  Job Tracking
                </h3>
                <div class="flex items-center justify-center w-full h-full">
                  <div
                    class="relative w-40 h-40 flex items-center justify-center"
                  >
                    <svg viewBox="0 0 36 36" class="absolute w-full h-full">
                      <path
                        class="text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831"
                        stroke-width="4"
                        stroke-dasharray="100, 100"
                      />
                      <path
                        class="text-cyan-500"
                        fill="none"
                        stroke="currentColor"
                        d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831"
                        stroke-width="4"
                        stroke-dasharray="48, 100"
                        stroke-dashoffset="0"
                      />
                      <path
                        class="text-fuchsia-500"
                        fill="none"
                        stroke="currentColor"
                        d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831"
                        stroke-width="4"
                        stroke-dasharray="12, 100"
                        stroke-dashoffset="-48"
                      />
                    </svg>
                    <div class="absolute text-3xl font-bold">
                      {{ dashboardCount.jobs?.active }}
                    </div>
                  </div>
                </div>
                <div class="flex justify-around w-full mt-2 text-sm">
                  <div class="text-center">
                    <div
                      class="w-2 h-2 rounded-full bg-cyan-500 inline-block mr-1"
                    ></div>
                    <span class="text-gray-400">Active Jobs</span>
                  </div>
                  <div class="text-center">
                    <div
                      class="w-2 h-2 rounded-full bg-fuchsia-500 inline-block mr-1"
                    ></div>
                    <span class="text-gray-400">Delayed Jobs</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid 2xl:grid-cols-2 gap-4 h-[50%] mt-7">
              <div
                class="bg-black/30 p-4 rounded-xl border border-gray-700/50 shadow-md flex flex-col"
              >
                <h3
                  class="text-lg font-semibold text-shadow-lg mb-3 text-cyan-400"
                >
                  Job Tracking
                </h3>
                <div class="flex space-x-8 mb-4">
                  <div class="text-center flex-1 border-r border-white/20">
                    <div
                      class="text-4xl font-semibold tracking-widest text-white text-shadow-lg"
                    >
                      {{ dashboardCount.jobs?.active }}
                    </div>
                    <div class="text-sm text-gray-400">Active Jobs</div>
                  </div>
                  <div class="text-center flex-1">
                    <div
                      class="text-4xl font-semibold tracking-widest text-yellow-400 text-shadow"
                    >
                      {{ dashboardCount.jobs?.pending }}
                    </div>
                    <div class="text-sm text-gray-400">Pending</div>
                  </div>
                  <div class="text-center flex-1 border-l border-white/20">
                    <div
                      class="text-4xl font-semibold tracking-widest text-red-400 text-shadow"
                    >
                      {{ dashboardCount.jobs?.delayed }}
                    </div>
                    <div class="text-sm text-gray-400">Delayed</div>
                  </div>
                </div>
                <div class="p-2">
                  <div class="text-sm text-gray-200 tracking-wider">
                    Latest Job
                  </div>
                  <div class="mt-2 flex flex-row items-center gap-2">
                    <i class="pi pi-circle-on !text-[5px]"></i>
                    <div class="text-xs text-gray-200 tracking-wider">
                      Job 1 in progress
                    </div>
                  </div>
                </div>
                <div class="border-b border-white/10 mt-2 mb-4"></div>
                <div class="flex justify-center space-x-4">
                  <button
                    [routerLink]="'/quotation/form'"
                    class="px-5 py-2 text-sm tracking-wider border-[#40A0AC] border-2 cursor-pointer rounded-md font-semibold transition duration-200 hover:bg-[#317c86]"
                  >
                    Create New Quote
                  </button>
                  <button
                    class="cursor-pointer px-5 py-3 text-sm tracking-wider bg-white/20 hover:bg-gray-700 rounded-md font-semibold transition duration-200"
                  >
                    View Reports
                  </button>
                </div>
              </div>

              <div
                class="bg-black/30 p-4 rounded-xl border border-gray-700/50 shadow-md flex flex-col"
              >
                <h3
                  class="text-lg font-semibold mb-3 text-shadow-lg text-yellow-400"
                >
                  Work Orders (WO)
                </h3>
                <div class="flex justify-between mb-4">
                  <div>
                    <div
                      class="text-2xl font-semibold tracking-widest text-white"
                    >
                      323.95
                    </div>
                    <div class="text-sm text-gray-400">
                      Personnel Working ($)
                    </div>
                  </div>
                  <div>
                    <div
                      class="text-2xl font-semibold tracking-widest text-white"
                    >
                      18,903.38
                    </div>
                    <div class="text-sm text-gray-400">
                      Total Material Cost ($)
                    </div>
                  </div>
                </div>
                <div
                  class="flex-grow bg-white/5 rounded-lg border border-white/10 p-2 flex items-center justify-center"
                >
                  <span class="text-gray-500 text-xs"
                    >Work Order Chart Placeholder</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="w-full 2xl:w-[20%] min-h-[90%] p-4" *ngIf="!isMobile">
            <div
              class=" h-full p-4 2xl:border-l 2xl:border-white/20 flex flex-col"
            >
              <div class="flex flex-row items-center gap-2 mb-2 pl-2">
                <svg
                  class="w-6 h-6 text-green-400 filter drop-shadow-[0_0_4px_#22c55e] drop-shadow-[0_0_8px_#22c55e]"
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
                    d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z"
                  />
                </svg>
                <h3
                  class="text-lg font-semibold text-green-400 tracking-wider text-shadow-lg"
                >
                  Notifications
                </h3>
              </div>
              <div class="border-b border-white/10 mb-3 "></div>
              <div class="space-y-3 overflow-y-auto pl-2">
                <ng-container *ngFor="let notification of notifications">
                  <div class="border-b border-white/5 pb-2">
                    <div class="text-sm font-semibold">
                      {{ notification.message }}
                    </div>
                    <div class="text-xs text-white/30">
                      {{ notification.time | date : 'dd/MM/yyyy hh:mm:ss a' }}
                    </div>
                  </div>
                </ng-container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './dashboard.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit, OnDestroy {
  isMobile = window.innerWidth < 770;

  private readonly loadingService = inject(LoadingService);
  private readonly appService = inject(AppService);
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);

  dashboardCount: DashboardCount = {} as DashboardCount;
  notifications: [{ message: string; time: Date }] | null = null;

  quotationChartData: any;
  quotationChartOptions: any;

  ngOnInit(): void {
    const requests: any = {
      dashboardCount: this.appService.GetDashboardCount(),
      quotationChart: this.appService.QuotationChart(),
    };

    if (!this.isMobile) {
      requests.notifications = this.appService.GetNotifications();
    }

    forkJoin(requests)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          this.dashboardCount = res.dashboardCount;

          if (!this.isMobile) {
            this.notifications = res.notifications;
          }

          // 🆕 Handle quotation chart data
          const chartData = res.quotationChart || [];
          const labels = chartData.map((item: any) =>
            new Date(item.date).toLocaleDateString('en-MY', {
              day: '2-digit',
              month: 'short',
            })
          );
          const data = chartData.map((item: any) => item.count);

          this.quotationChartData = {
            labels,
            datasets: [
              {
                data,
                borderColor: '#42A5F5',
                backgroundColor: 'rgba(66,165,245,0.3)',
                tension: 0.3,
                fill: true,
              },
            ],
          };

          this.quotationChartOptions = {
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: {
                ticks: { color: '#A0AEC0' },
                grid: { color: 'rgba(255,255,255,0.1)' },
              },
              y: {
                ticks: {
                  color: '#A0AEC0',
                  precision: 0,
                  callback: function (value: number) {
                    return Math.floor(value);
                  },
                },
                grid: { color: 'rgba(255,255,255,0.1)' },
              },
            },
          };

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.loadingService.stop();
        },
        complete: () => {
          this.loadingService.stop();
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.loadingService.stop();
  }
}
