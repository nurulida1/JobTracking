import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/userService.service';
import { UserRole } from '../../enum/enum';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  template: `<div
    class="rounded-2xl border px-5 py-4 flex flex-row items-center text-gray-500 text-xs lg:text-sm bg-white border-t border-gray-200 shadow-md"
    [ngClass]="role === 'Guest' ? 'justify-evenly' : 'justify-between'"
  >
    <div
      [routerLink]="'/dashboard'"
      routerLinkActive="!text-blue-500"
      class="w-12 h-12 flex flex-col justify-center items-center rounded-full transition-colors"
    >
      <i class="pi pi-home !text-2xl"></i>
      <div>Home</div>
    </div>

    <div
      *ngIf="role === 'Admin' || role === 'Approver'"
      [routerLink]="'/quotation'"
      routerLinkActive="!text-blue-500"
      class="w-12 h-12 flex flex-col justify-center items-center rounded-full transition-colors"
    >
      <i class="pi pi-receipt !text-2xl"></i>
      <div>Quotation</div>
    </div>

    <div
      *ngIf="role !== 'Guest'"
      [routerLink]="'/job'"
      routerLinkActive="!text-blue-500"
      class="w-12 h-12 flex flex-col justify-center items-center rounded-full transition-colors"
    >
      <i class="pi pi-briefcase !text-2xl"></i>
      <div>Job</div>
    </div>

    <div
      *ngIf="role !== 'Guest'"
      [routerLink]="'/delivery'"
      routerLinkActive="!text-blue-500"
      class="w-12 h-12 flex flex-col justify-center items-center rounded-full transition-colors"
    >
      <i class="pi pi-truck !text-2xl"></i>
      <div>Delivery</div>
    </div>

    <div
      [routerLink]="'/settings'"
      routerLinkActive="!text-blue-500"
      class="w-12 h-12 flex flex-col justify-center items-center rounded-full transition-colors"
    >
      <i class="pi pi-cog !text-2xl"></i>
      <div>Settings</div>
    </div>
  </div> `,
  styleUrl: './footer.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  private readonly userService = inject(UserService);

  role: UserRole | null = null;

  constructor() {
    this.role = this.userService.currentUser?.role ?? UserRole.Guest;
  }
}
