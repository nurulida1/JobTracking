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
import { UserRole } from '../../enum/enum';
import { UserService } from '../../../services/userService.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, AvatarModule, TooltipModule],
  template: `
    <div class="gap-4 pt-10 w-full flex flex-col justify-center items-center">
      <!-- 🏠 HOME -->
      <a
        [routerLink]="'/dashboard'"
        [ngClass]="{
          'bg-blue-600/10 text-cyan-500 text-shadow-md text-black/50 inset-shadow-sm inset-shadow-black/50':
            isActive('/dashboard'),
          'text-gray-400 hover:bg-white/10': !isActive('/dashboard')
        }"
        class="flex items-center space-x-3 p-3 rounded-xl transition duration-200"
        pTooltip="Home"
        tooltipPosition="right"
      >
        <i class="pi pi-home !text-xl"></i>
      </a>

      <!-- 📄 QUOTATIONS -->
      <a
        *ngIf="role === 'Admin' || role === 'Approver'"
        [routerLink]="'/quotation'"
        [ngClass]="{
          'bg-blue-600/10 text-cyan-500 text-shadow-md text-black/50 inset-shadow-sm inset-shadow-black/50':
            isActive('/quotation'),
          'text-gray-400 hover:bg-white/10': !isActive('/quotation')
        }"
        class="flex items-center space-x-3 p-3 rounded-xl transition duration-200"
        pTooltip="Quotations"
        tooltipPosition="right"
      >
        <i class="pi pi-receipt !text-xl"></i>
      </a>

      <!-- 📄 PURCHASE ORDERS -->
      <a
        *ngIf="role === 'Admin' || role === 'Approver'"
        [routerLink]="'/purchase-order'"
        [ngClass]="{
          'bg-blue-600/10 text-cyan-500 text-shadow-md text-black/50 inset-shadow-sm inset-shadow-black/50':
            isActive('/purchase-order'),
          'text-gray-400 hover:bg-white/10': !isActive('/purchase-order')
        }"
        class="flex items-center space-x-3 p-3 rounded-xl transition duration-200"
        pTooltip="Purchase Orders"
        tooltipPosition="right"
      >
        <i class="pi pi-credit-card !text-xl"></i>
      </a>

      <!-- ⚙️ JOBS -->
      <a
        *ngIf="role !== 'Guest'"
        [routerLink]="'/job'"
        [ngClass]="{
          'bg-blue-600/10 text-cyan-500 text-shadow-md text-black/50 inset-shadow-sm inset-shadow-black/50':
            isActive('/job'),
          'text-gray-400 hover:bg-white/10': !isActive('/job')
        }"
        class="flex items-center space-x-3 p-3 rounded-xl transition duration-200"
        pTooltip="Jobs"
        tooltipPosition="right"
      >
        <i class="pi pi-briefcase !text-xl"></i>
      </a>

      <!-- 🚚 DELIVERY -->
      <a
        *ngIf="role !== 'Guest'"
        [routerLink]="'/delivery'"
        [ngClass]="{
          'bg-blue-600/10 text-cyan-500 text-shadow-md text-black/50 inset-shadow-sm inset-shadow-black/50':
            isActive('/delivery'),
          'text-gray-400 hover:bg-white/10': !isActive('/delivery')
        }"
        class="flex items-center space-x-3 p-3 rounded-xl transition duration-200"
        pTooltip="Delivery"
        tooltipPosition="right"
      >
        <i class="pi pi-truck !text-xl"></i>
      </a>

      <a
        *ngIf="role === 'Admin'"
        [routerLink]="'/request-role'"
        [ngClass]="{
          'bg-blue-600/10 text-cyan-500 text-shadow-md text-black/50 inset-shadow-sm inset-shadow-black/50':
            isActive('/request-role'),
          'text-gray-400 hover:bg-white/10': !isActive('/request-role')
        }"
        class="flex items-center space-x-3 p-3 rounded-xl transition duration-200"
        pTooltip="Request Role"
        tooltipPosition="right"
      >
        <i class="pi pi-users !text-xl"></i>
      </a>
    </div>
  `,
  styleUrl: './sidebar.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  private destroy$ = new Subject<void>();

  currentUrl: string = '';
  role: UserRole | null = null;

  constructor() {
    this.currentUrl = this.router.url;
    this.role = this.userService.currentUser?.role ?? UserRole.Guest;
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
