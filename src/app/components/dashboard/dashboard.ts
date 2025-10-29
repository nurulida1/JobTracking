import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SpeedDialModule } from 'primeng/speeddial';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, SpeedDialModule],
  template: `
    <div class="px-4 py-2 flex flex-col">
      <div class="tracking-wide font-semibold text-xl text-blue-900">
        Dashboard
      </div>
      <div class="flex flex-row gap-2 mt-2">
        <div
          class="flex-1 border border-gray-200 bg-white rounded-md p-2 h-[130px]"
        >
          <div class="flex flex-col text-center items-center">
            <div class="flex justify-center">
              <img src="assets/active-job.png" alt="" class="w-[40px]" />
            </div>
            <div class="text-indigo-500 font-semibold text-sm mt-1">
              Active Jobs
            </div>
            <div class="font-bold text-3xl mt-2 text-indigo-500">0</div>
          </div>
        </div>
        <div
          class="flex-1 border border-gray-200 bg-white rounded-md p-2 h-[130px]"
        >
          <div class="flex flex-col text-center items-center">
            <div class="flex justify-center">
              <img src="assets/quotation.png" alt="" class="w-[40px]" />
            </div>
            <div class="text-orange-500 font-semibold text-sm mt-1">
              Pending Quotes
            </div>
            <div class="font-bold text-3xl mt-2 text-orange-500">0</div>
          </div>
        </div>
        <div
          class="flex-1 border border-gray-200 bg-white rounded-md p-2 h-[130px]"
        >
          <div class="flex flex-col text-center items-center">
            <div class="flex justify-center">
              <img
                src="assets/check-list.png"
                alt=""
                class="w-[40px] opacity-75"
              />
            </div>
            <div class="text-green-500 font-semibold text-sm mt-1">
              Today's Task
            </div>
            <div class="font-bold text-3xl mt-2 text-green-500">0</div>
          </div>
        </div>
      </div>
      <div class="mt-4 font-semibold text-blue-900">Recent activities</div>
      <div class="mt-3 bg-white p-2 pb-3 rounded-sm">
        <div class="text-blue-800 text-sm font-bold">
          Quotation Q-2025-03-02 Approved
        </div>
        <div class="text-xs mt-1 text-gray-600">
          Technician All assigned to J-2023 Completed
        </div>
      </div>
      <div class="mt-3 bg-white p-2 pb-3 rounded-sm">
        <div class="text-blue-800 text-sm font-bold">
          Quotation Q-2025-03-02 Approved
        </div>
        <div class="text-xs mt-1 text-gray-600">
          Technician All assigned to J-2023 Completed
        </div>
      </div>
      <div class="mt-3 bg-white p-2 pb-3 rounded-sm">
        <div class="text-blue-800 text-sm font-bold">
          Quotation Q-2025-03-02 Approved
        </div>
        <div class="text-xs mt-1 text-gray-600">
          Technician All assigned to J-2023 Completed
        </div>
      </div>
      <div class="mt-4 font-semibold text-blue-900">My Active Tasks</div>
      <div
        class="flex flex-row items-center justify-between mt-3 bg-white p-2 pb-3 rounded-sm"
      >
        <div class="text-blue-800 text-sm font-bold">
          Quotation Q-2025-03-02 Approved
        </div>
        <div
          class="bg-orange-400 text-white text-shadow-md text-xs px-2 p-1 rounded-md w-fit "
        >
          In Progress
        </div>
      </div>
      <div
        class="flex flex-row items-center justify-between mt-3 bg-white p-2 pb-3 rounded-sm"
      >
        <div class="text-blue-800 text-sm font-bold">
          Quotation Q-2025-03-02 Approved
        </div>
        <div
          class="bg-orange-400 text-white text-shadow-md text-xs px-2 p-1 rounded-md w-fit "
        >
          In Progress
        </div>
      </div>
      <div
        class="flex flex-row items-center justify-between mt-3 bg-white p-2 pb-3 rounded-sm"
      >
        <div class="text-blue-800 text-sm font-bold">
          Quotation Q-2025-03-02 Approved
        </div>
        <div
          class="bg-orange-400 text-white text-shadow-md text-xs px-2 p-1 rounded-md w-fit "
        >
          In Progress
        </div>
      </div>
    </div>
  `,
  styleUrl: './dashboard.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {}
