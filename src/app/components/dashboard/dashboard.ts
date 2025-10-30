import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SpeedDialModule } from 'primeng/speeddial';
import { TooltipModule } from 'primeng/tooltip';
import { QuotationRoutingModule } from '../quotation/quotation-rounting.module';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    SpeedDialModule,
    TooltipModule,
    QuotationRoutingModule,
  ],
  template: `
    <div
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
                href="#"
                class="flex items-center space-x-3 p-3 rounded-xl bg-blue-600/60 shadow-lg transition duration-200"
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
                class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition duration-200 text-gray-400"
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

          <div class="w-[75%] p-4 space-y-4">
            <div class="grid grid-cols-2 gap-4 h-[45%]">
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
                      class="text-3xl font-semibold text-white text-shadow-md tracking-widest"
                    >
                      32
                    </div>
                    <div class="text-xs text-gray-400 tracking-wider">
                      Drafts
                    </div>
                  </div>
                  <div class="text-center flex-1 ">
                    <div
                      class="text-3xl font-semibold tracking-widest text-yellow-400 text-shadow-md"
                    >
                      15
                    </div>
                    <div class="text-xs text-gray-400 tracking-wider">
                      Pending Approval
                    </div>
                  </div>
                  <div class="text-center flex-1 border-l border-white/20">
                    <div
                      class="text-3xl font-semibold tracking-widest text-green-400 text-shadow-md"
                    >
                      1.5
                    </div>
                    <div class="text-xs text-gray-400 tracking-wider">
                      Approved
                    </div>
                  </div>
                </div>
                <div class="text-sm text-gray-400 mb-2">
                  Quotes Generated This Month
                </div>
                <div
                  class="flex-grow bg-white/5 rounded-lg border border-white/10 p-2 flex items-center justify-center"
                >
                  <span class="text-gray-500 text-xs">Chart Placeholder</span>
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
                    <div class="absolute text-3xl font-bold">48</div>
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

            <div class="grid grid-cols-2 gap-4 h-[50%] mt-7">
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
                      46
                    </div>
                    <div class="text-sm text-gray-400">Active Jobs</div>
                  </div>
                  <div class="text-center flex-1">
                    <div
                      class="text-4xl font-semibold tracking-widest text-yellow-400 text-shadow"
                    >
                      13
                    </div>
                    <div class="text-sm text-gray-400">Pending</div>
                  </div>
                  <div class="text-center flex-1 border-l border-white/20">
                    <div
                      class="text-4xl font-semibold tracking-widest text-red-400 text-shadow"
                    >
                      12
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
          <div class="w-[20%] min-h-[90%] p-4">
            <div class=" h-full p-4 border-l border-white/20 flex flex-col">
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
                <div class="border-b border-white/5 pb-2">
                  <div class="text-sm font-semibold">
                    Quote #2027 is **Approved**
                  </div>
                  <div class="text-xs text-gray-500">2 minutes ago</div>
                </div>
                <div class="border-b border-white/5 pb-2">
                  <div class="text-sm font-semibold">
                    Job A863 has **Delivery** scheduled
                  </div>
                  <div class="text-xs text-gray-500">1 hour ago</div>
                </div>
                <div class="border-b border-white/5 pb-2">
                  <div class="text-sm font-semibold">
                    **PO #981** requires sign-off
                  </div>
                  <div class="text-xs text-gray-500">Yesterday</div>
                </div>
                <div class="border-b border-white/5 pb-2">
                  <div class="text-sm font-semibold">
                    New **Client** added: Acme Corp
                  </div>
                  <div class="text-xs text-gray-500">2 days ago</div>
                </div>
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
export class Dashboard {}
