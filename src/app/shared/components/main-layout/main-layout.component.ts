import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main-layout',
  imports: [
    SidebarComponent,
    RouterOutlet,
    NavbarComponent,
    CommonModule,
    FooterComponent,
    SpeedDialModule,
  ],
  template: `
    <div class="relative w-full min-h-screen flex flex-col">
      <!-- <app-navbar class="w-full"></app-navbar> -->

      <div *ngIf="isMobile" class="flex-1 flex flex-row w-full">
        <div class="flex-1 flex flex-col min-h-full min-w-0">
          <div class="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100">
            <router-outlet></router-outlet>
          </div>
        </div>
        <div class="fixed bottom-2 right-0 z-50">
          <p-speeddial
            [model]="items"
            [radius]="120"
            direction="up"
            [transitionDelay]="80"
            [buttonProps]="{ severity: 'info', rounded: true }"
          >
            <ng-template pTemplate="item" let-item>
              <div
                class="bg-white flex flex-row items-center gap-2 px-2 py-1 shadow-md border border-gray-200  rounded-lg"
              >
                <img
                  *ngIf="item.image"
                  [src]="item.image"
                  alt="icon"
                  class="w-6 h-6 object-contain"
                />
                <i *ngIf="!item.image" [class]="item.icon" class="!text-sm"></i>
                <span
                  *ngIf="item.label"
                  class="text-gray-800 text-xs font-medium"
                >
                  {{ item.label }}
                </span>
              </div>
            </ng-template>
          </p-speeddial>
        </div>
      </div>

      <div *ngIf="!isMobile" class="flex-1 w-full overflow-auto bg-gray-100">
        <router-outlet></router-outlet>
      </div>

      <!-- <app-footer *ngIf="!isMobile" class="shrink-0"></app-footer> -->
    </div>
  `,
  styleUrl: './main-layout.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  isMobile = window.innerWidth < 770;
  items: MenuItem[] = [];

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 1280;
  }

  ngOnInit() {
    console.log(this.isMobile);
    this.items = [
      {
        icon: 'pi pi-cog',
        label: 'Settings',
        routerLink: ['/settings'],
      },
      {
        icon: 'pi pi-box',
        label: 'Delivery',
        routerLink: ['/delivery'],
      },
      {
        icon: 'pi pi-briefcase',
        label: 'Jobs',
        routerLink: ['/jobs'],
      },
      {
        icon: 'pi pi-list-check',
        label: 'Purchase Order',
        routerLink: ['/purchase-order'],
      },
      {
        icon: 'pi pi-receipt',
        label: 'Quotations',
        routerLink: ['/quotation'],
      },
    ];
  }
}
