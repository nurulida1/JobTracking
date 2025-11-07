import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DeliveryRoutingModule } from '../../delivery/delivery-rounting.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-details',
  imports: [CommonModule, DeliveryRoutingModule],
  template: `<div
    class="relative bg-white p-5 px-5 w-full mt-20 shadow-t-md rounded-t-3xl flex flex-col shadow-2xl min-h-[90vh]"
    [ngClass]="{ slideUp: !isClosing, slideDown: isClosing }"
  >
    <div class="text-sm w-fit px-3 py-1 rounded-full bg-blue-100 text-blue-500">
      In Progress
    </div>
    <div
      class="pi pi-times absolute top-4 right-5 !text-xl"
      (click)="closeJobDetails()"
    ></div>
    <div class="pt-5 flex flex-row items-center justify-between">
      <div class=" font-semibold text-xl tracking-wider">Job Details</div>
      <div class="text-gray-400 text-sm">#JO001</div>
    </div>
    <div class="border-b border-gray-200 mt-2"></div>
    <div class="mt-4 flex flex-col gap-3 text-sm text-gray-700 tracking-wider">
      <!-- Assigned By -->
      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-row items-center gap-2">
          <i class="pi pi-user !text-sm text-violet-500"></i>
          <span class="font-medium text-violet-500">Assigned By:</span>
        </div>
        <span>Shah</span>
      </div>

      <!-- Due Date -->
      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-row items-center gap-2">
          <i class="pi pi-calendar !text-sm text-violet-500"></i>
          <span class="font-medium text-violet-500">Due Date:</span>
        </div>
        <span>20 Jun 2026</span>
      </div>

      <!-- Job Priority -->
      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-row items-center gap-2">
          <i class="pi pi-exclamation-triangle !text-sm text-red-500"></i>
          <span class="font-medium text-red-500">Priority:</span>
        </div>
        <span>High</span>
      </div>

      <!-- Completion Date (only if completed) *ngIf="job.status === 'Completed'"-->
      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-row items-center gap-2">
          <i class="pi pi-check-circle !text-sm text-green-500"></i>
          <span class="font-medium text-green-500">Completion Date:</span>
        </div>
        <span>18 June 2026</span>
      </div>

      <!-- Job Description -->
      <div class="flex flex-col gap-1 border-t border-gray-200">
        <span class="font-medium pt-4 font-semibold">Job Description:</span>
        <div class="text-gray-500">
          Inspect, and troubleshoot the cctv, fix any indentified problems.
        </div>
      </div>
    </div>
  </div>`,
  styleUrl: './job-details.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobDetails {
  private readonly router = inject(Router);

  isClosing: boolean = false;

  closeJobDetails() {
    this.isClosing = true;

    setTimeout(() => {
      this.router.navigate(['/job']);
    }, 400);
  }
}
