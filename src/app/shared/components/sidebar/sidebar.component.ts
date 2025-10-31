import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, AvatarModule, TooltipModule],
  template: `
    <div class="space-y-6 w-full">
      <!-- 🏠 HOME -->
      <a
        [routerLink]="'/dashboard'"
        routerLinkActive="bg-blue-600/60 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
        class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition duration-200 text-gray-400"
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

      <!-- 📄 QUOTATIONS -->
      <a
        [routerLink]="'/quotation'"
        routerLinkActive="bg-blue-600/60 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
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

      <!-- 🧾 PURCHASE ORDER -->
      <a
        [routerLink]="'/purchase-order'"
        routerLinkActive="bg-blue-600/60 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
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

      <!-- ⚙️ JOBS -->
      <a
        [routerLink]="'/jobs'"
        routerLinkActive="bg-blue-600/60 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
        class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition duration-200 text-gray-400"
        pTooltip="Jobs"
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
            d="M8 7H5a2 2 0 0 0-2 2v4m5-6h8M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m0 0h3a2 2 0 0 1 2 2v4m0 0v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6m18 0s-4 2-9 2-9-2-9-2m9-2h.01"
          />
        </svg>
      </a>

      <!-- 🚚 DELIVERY -->
      <a
        [routerLink]="'/delivery'"
        routerLinkActive="bg-blue-600/60 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
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
  `,
  styleUrl: './sidebar.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnDestroy {
  private readonly router = inject(Router);

  private destroy$ = new Subject<void>();

  currentUrl: string = '';

  constructor() {
    this.currentUrl = this.router.url;
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  isActive(route: string): boolean {
    return this.currentUrl.includes(route);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
